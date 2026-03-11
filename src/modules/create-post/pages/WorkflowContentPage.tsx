import { useEffect, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  EdgeTypes,
  NodeTypes,
  NodeProps,
  ReactFlowProvider,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { AlertCircle, Plus, Minus, Maximize, Sparkles, Copy, Check, ChevronDown, CheckCircle2, Circle, ArrowUp, Loader } from "lucide-react";
import { LiaBroomSolid } from "react-icons/lia";

import BottomNavbar from "@/modules/create-post/components/navbar/BottomNavbar";
import WaitingCard from "@/modules/create-post/components/card/WaitingCard";
import { useCreationStatus, useGenerationStatus, useRegenerateCopy } from "@/modules/create-post/hooks/useCreateImage";
import { CreatedImageCard } from "@/modules/create-post/components/card/CreatedImageCard";
import sampleImage from "@/assets/img/sample_mark_respond.png";
import AnimatedEdge from "@/modules/create-post/components/flow/AnimatedEdge";
import { useFlowStore } from "@/modules/create-post/store/flowStoreSlice";
import type { GenerationStore } from "@/modules/create-post/schemas/CreateImage";

// Layout constants — horizontal tree (left → right)
const NODE_WIDTH = 380;
const NODE_HEIGHT = 520;
const H_GAP = 150;
const V_GAP = 60;
const START_X = 80;
const START_Y = 80;

type TreeNode = {
  gen: GenerationStore;
  children: TreeNode[];
  label: string;
  x: number;
  y: number;
  subtreeHeight: number;
};

/**
 * Horizontal tree: children appear to the RIGHT, siblings stack vertically.
 */
function buildFlowFromGenerations(
  generations: GenerationStore[],
  isProcessing: boolean,
  isDone: boolean,
  selectedGenUuid?: string,
): { nodes: Node[]; edges: Edge[] } {
  const withImages = generations.filter((g) => !!g.img_url);
  if (withImages.length === 0 && !isProcessing) {
    return { nodes: [], edges: [] };
  }

  const childrenMap = new Map<string, GenerationStore[]>();
  const allIds = new Set(withImages.map((g) => g.uuid ?? ""));

  for (const g of withImages) {
    const parentId = g.parent_uuid ?? "";
    const selfId = g.uuid ?? "";
    if (parentId && parentId !== selfId && allIds.has(parentId)) {
      const siblings = childrenMap.get(parentId) || [];
      siblings.push(g);
      childrenMap.set(parentId, siblings);
    }
  }

  const roots = withImages.filter((g) => {
    const parentId = g.parent_uuid ?? "";
    const selfId = g.uuid ?? "";
    return !parentId || parentId === selfId || !allIds.has(parentId);
  });

  let editCounter = 0;
  function buildTree(gen: GenerationStore, depth: number): TreeNode {
    const selfId = gen.uuid ?? "";
    const children = (childrenMap.get(selfId) || []).map((child) =>
      buildTree(child, depth + 1),
    );
    const label = depth === 0 ? "Original" : `Edit #${++editCounter}`;
    const childrenTotalHeight = children.reduce(
      (sum, c) => sum + c.subtreeHeight + V_GAP,
      -V_GAP,
    );
    const subtreeHeight = Math.max(NODE_HEIGHT, childrenTotalHeight);
    return { gen, children, label, x: 0, y: 0, subtreeHeight };
  }

  const trees = roots.map((r) => buildTree(r, 0));

  function layoutTree(tree: TreeNode, startX: number, startY: number, depth: number) {
    const x = startX + depth * (NODE_WIDTH + H_GAP);
    if (tree.children.length === 0) {
      tree.x = x;
      tree.y = startY + tree.subtreeHeight / 2 - NODE_HEIGHT / 2;
    } else {
      let childY = startY;
      for (const child of tree.children) {
        layoutTree(child, startX, childY, depth + 1);
        childY += child.subtreeHeight + V_GAP;
      }
      const firstChild = tree.children[0];
      const lastChild = tree.children[tree.children.length - 1];
      const mid = (firstChild.y + lastChild.y + NODE_HEIGHT) / 2 - NODE_HEIGHT / 2;
      tree.x = x;
      tree.y = mid;
    }
  }

  let currentY = START_Y;
  for (const tree of trees) {
    layoutTree(tree, START_X, currentY, 0);
    currentY += tree.subtreeHeight + V_GAP * 2;
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function flattenTree(tree: TreeNode, parentNodeId?: string) {
    const nodeId = `gen-${tree.gen.uuid ?? ""}`;
    nodes.push({
      id: nodeId,
      type: "result",
      position: { x: tree.x, y: tree.y },
      data: {
        image: tree.gen.img_url,
        label: tree.label,
        genUuid: tree.gen.uuid ?? "",
        genParentUuid: tree.gen.parent_uuid ?? tree.gen.uuid ?? "",
        genImgUrl: tree.gen.img_url ?? "",
        genLabel: tree.label,
      },
    });
    if (parentNodeId) {
      edges.push({
        id: `edge-${parentNodeId}-${nodeId}`,
        source: parentNodeId,
        target: nodeId,
        type: "animated",
        animated: true,
      });
    }
    for (const child of tree.children) {
      flattenTree(child, nodeId);
    }
  }

  for (const tree of trees) {
    flattenTree(tree);
  }

  // Skeleton to the right of selected node while processing
  if (isProcessing && !isDone && nodes.length > 0) {
    const targetNodeId = selectedGenUuid
      ? `gen-${selectedGenUuid}`
      : nodes[nodes.length - 1].id;
    const targetNode = nodes.find((n) => n.id === targetNodeId) || nodes[nodes.length - 1];
    const skeletonId = "skeleton-node";
    nodes.push({
      id: skeletonId,
      type: "skeleton",
      position: {
        x: targetNode.position.x + NODE_WIDTH + H_GAP,
        y: targetNode.position.y,
      },
      data: { label: "Creating magic..." },
    });
    edges.push({
      id: `edge-${targetNode.id}-${skeletonId}`,
      source: targetNode.id,
      target: skeletonId,
      type: "animated",
      animated: true,
    });
  }

  return { nodes, edges };
}


// Define node types outside component to avoid React Flow warning
const nodeTypes: NodeTypes = {
  result: ({ data, selected }: NodeProps) => (
    <div
      className="relative cursor-pointer transition-all duration-200"
      style={{ width: 380 }}
    >
      {/* Selection ring */}
      <div
        className={`rounded-xl overflow-hidden transition-all duration-200 ${selected
          ? "ring-3 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20"
          : "ring-1 ring-transparent hover:ring-2 hover:ring-primary/30"
          }`}
      >
        <CreatedImageCard image={data.image || sampleImage} />
      </div>

      {/* Label + selection indicator */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {selected && (
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        )}
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${selected
            ? "text-primary bg-primary/10 border-primary/30"
            : "text-muted-foreground bg-surface-container-lowest/90 border-outline-variant/20"
            }`}
        >
          {data.label}
          {selected && " · Selected"}
        </span>
      </div>
    </div>
  ),
  skeleton: () => (
    <div className="flex flex-col items-center" style={{ width: 380 }}>
      <div className="w-full h-[475px] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
        <div className="text-slate-400 font-medium">Creating magic...</div>
      </div>
      <div className="mt-3">
        <span className="text-xs font-medium text-muted-foreground bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline-variant/20 animate-pulse">
          Processing...
        </span>
      </div>
    </div>
  ),
  waiting: ({ data }: NodeProps) => (
    <WaitingCard
      title={data?.title}
      description={data?.description}
    />
  ),
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

/**
 * Create a stable fingerprint from generations data
 */
function generationsFingerprint(generations: GenerationStore[]): string {
  return generations
    .filter((g) => !!g.img_url)
    .map((g) => `${g.uuid}:${g.img_url}`)
    .sort()
    .join("|");
}




const WorkflowContentInner = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const prevFingerprintRef = useRef("");
  const setSelectedGeneration = useFlowStore((s) => s.setSelectedGeneration);
  const selectedGeneration = useFlowStore((s) => s.selectedGeneration);
  const resetFlow = useFlowStore((s) => s.resetFlow);

  useEffect(() => {
    return () => resetFlow();
  }, [resetFlow]);

  // Subscribe to creation status
  const {
    isProcessing,
    isDone,
    hasSubscriptionError,
    subscriptionError,
  } = useCreationStatus(uuid ?? "");

  // Subscribe to generations subcollection
  const { generations, hasImage } = useGenerationStatus(uuid ?? "");

  // Derive a stable fingerprint
  const fingerprint = useMemo(
    () => generationsFingerprint(generations),
    [generations],
  );

  // Build the flow data via useMemo (no setState = no infinite loop)
  const { flowNodes, flowEdges } = useMemo(() => {
    if (hasSubscriptionError) {
      return {
        flowNodes: [
          {
            id: "error-node",
            type: "waiting" as const,
            position: { x: 200, y: START_Y },
            data: {
              title: "Subscription Error",
              description: subscriptionError?.message || "Unknown error",
              icon: AlertCircle,
            },
          },
        ] as Node[],
        flowEdges: [] as Edge[],
      };
    }

    if (!hasImage && (isProcessing || !isDone)) {
      return {
        flowNodes: [
          {
            id: "skeleton-node",
            type: "skeleton" as const,
            position: { x: 200, y: START_Y },
            data: { label: isDone ? "Finalizing..." : "Creating magic..." },
          },
        ] as Node[],
        flowEdges: [] as Edge[],
      };
    }

    const { nodes, edges } = buildFlowFromGenerations(
      generations,
      isProcessing,
      isDone,
      selectedGeneration?.uuid,
    );

    return {
      flowNodes: nodes.length > 0 ? nodes : ([
        {
          id: "skeleton-node",
          type: "skeleton" as const,
          position: { x: 200, y: START_Y },
          data: { label: "Waiting for data..." },
        },
      ] as Node[]),
      flowEdges: edges,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingerprint, isProcessing, isDone, hasImage, hasSubscriptionError]);

  // Auto-select the latest generation when flow nodes change
  useEffect(() => {
    if (fingerprint !== prevFingerprintRef.current && fingerprint !== "") {
      prevFingerprintRef.current = fingerprint;

      // Auto-select the last result node (latest generation)
      const resultNodes = flowNodes.filter((n) => n.type === "result");
      const lastNode = resultNodes[resultNodes.length - 1];
      if (lastNode?.data) {
        setSelectedGeneration({
          uuid: lastNode.data.genUuid,
          parent_uuid: lastNode.data.genParentUuid,
          img_url: lastNode.data.genImgUrl,
          label: lastNode.data.genLabel,
        });
      }
    }
  }, [fingerprint, flowNodes, setSelectedGeneration]);

  // Handle node click → update selected generation
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "result" && node.data) {
        setSelectedGeneration({
          uuid: node.data.genUuid,
          parent_uuid: node.data.genParentUuid,
          img_url: node.data.genImgUrl,
          label: node.data.genLabel,
        });
      }
    },
    [setSelectedGeneration],
  );

  const onInit = useCallback((reactFlowInstance: any) => {
    reactFlowInstance.fitView({ padding: 0.3, maxZoom: 1 });
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={onInit}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
          panOnDrag={true}
          selectionOnDrag={false}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
};

const WorkflowContentPage = () => (
  <ReactFlowProvider>
    <WorkflowContentInner />
  </ReactFlowProvider>
);

export default WorkflowContentPage;
