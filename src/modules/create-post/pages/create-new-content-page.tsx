import { useEffect, useMemo, useState, memo, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  EdgeTypes,
  Handle,
  Position,
  BaseEdge,
  EdgeProps,
  getBezierPath,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import BottomNavbar from "@/modules/create-post/components/navbar/bottom-navbar";
import BottomBrandNavbar from "@/modules/create-post/components/navbar/bottom-brand-navbar";
import WaitingCard from "@/modules/create-post/components/card/waiting-card";
import { StartingAlert } from "@/modules/create-post/components/alerts/starting-alert";
import { useFlowStore } from "@/modules/create-post/store/flow-store";
import BrandDNA from "../components/sidebar/brand-dna";

import ExtractingNode from "@/modules/create-post/components/flow/extracting-node";
import BrandLogoNode from "@/modules/create-post/components/flow/brand-logo-node";
import BrandIdentityNode from "@/modules/create-post/components/flow/brand-identity-node";
import BrandTypographyNode from "@/modules/create-post/components/flow/brand-typography-node";
import BrandColorSystemNode from "@/modules/create-post/components/flow/brand-color-system-node";
import BrandVoiceNode from "@/modules/create-post/components/flow/brand-voice-node";

import { cn } from "@/shared/utils/utils";

// Dashed edge for connecting Brand Logo to child nodes
const DashedEdge = memo(function DashedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeDasharray: "6 4",
        stroke: "#d1d5db",
        strokeWidth: 1.5,
      }}
    />
  );
});

// Waiting node (initial page state)
const WaitingNode = memo(({ data }: any) => {
  return (
    <div className="relative p-0 flex justify-center items-center">
      <WaitingCard
        title={data.title || "Hello again"}
        description={data.description || "What would you like to create today?"}
      />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});

// Memoized sidebar to prevent re-renders from propagating to ReactFlow
const MemoizedBrandDNA = memo(BrandDNA);

export type CreationMode = "post" | "dna";

/**
 * Inner component that uses useReactFlow (must be inside ReactFlowProvider).
 * Uses a ResizeObserver on the canvas container to re-center nodes when
 * the sidebar opens/closes (the container resizes as the sidebar gap animates).
 */
const FlowCanvas = ({
  creationMode,
  containerRef,
}: {
  creationMode: CreationMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const setNodes = useFlowStore((s) => s.setNodes);
  const setEdges = useFlowStore((s) => s.setEdges);
  const brandData = useFlowStore((s) => s.brandData);
  const isLoading = useFlowStore((s) => s.isLoading);

  const { fitView } = useReactFlow();

  // Track the last known width so we can detect real resizes
  const lastWidthRef = useRef<number>(0);

  // ResizeObserver: re-center canvas whenever the container width changes
  // This handles sidebar open/close, window resize, etc.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lastWidthRef.current = container.offsetWidth;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        // Only fitView if width actually changed (avoid height-only changes)
        if (Math.abs(newWidth - lastWidthRef.current) > 5) {
          lastWidthRef.current = newWidth;
          // Debounce slightly so we catch the end of the CSS transition
          setTimeout(() => {
            fitView({ padding: 0.3, maxZoom: 1, duration: 300 });
          }, 50);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fitView]);

  // Get actual container width for accurate node positioning
  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? window.innerWidth;
  }, [containerRef]);

  // Set nodes based on creation mode and data
  useEffect(() => {
    const w = getContainerWidth();

    if (creationMode === "dna") {
      if (isLoading) {
        setNodes([
          {
            id: "extracting",
            type: "extracting",
            position: { x: w / 2 - 150, y: 150 },
            data: {},
          },
        ]);
        setEdges([]);
      } else if (brandData) {
        const centerX = w / 2 - 120;
        const topY = 60;
        const brandSharedData = { brand: brandData };

        setNodes([
          {
            id: "brand-logo",
            type: "brandLogo",
            position: { x: centerX, y: topY },
            data: brandSharedData,
          },
          {
            id: "brand-identity",
            type: "brandIdentity",
            position: { x: centerX - 380, y: topY + 200 },
            data: brandSharedData,
          },
          {
            id: "brand-typography",
            type: "brandTypography",
            position: { x: centerX - 180, y: topY + 330 },
            data: brandSharedData,
          },
          {
            id: "brand-color-system",
            type: "brandColorSystem",
            position: { x: centerX + 100, y: topY + 330 },
            data: brandSharedData,
          },
          {
            id: "brand-voice",
            type: "brandVoice",
            position: { x: centerX + 380, y: topY + 200 },
            data: brandSharedData,
          },
        ]);

        setEdges([
          {
            id: "e-logo-identity",
            source: "brand-logo",
            target: "brand-identity",
            sourceHandle: "left",
            type: "dashed",
          },
          {
            id: "e-logo-typography",
            source: "brand-logo",
            target: "brand-typography",
            sourceHandle: "bottom",
            type: "dashed",
          },
          {
            id: "e-logo-color",
            source: "brand-logo",
            target: "brand-color-system",
            sourceHandle: "bottom",
            type: "dashed",
          },
          {
            id: "e-logo-voice",
            source: "brand-logo",
            target: "brand-voice",
            sourceHandle: "right",
            type: "dashed",
          },
        ]);
      } else {
        setNodes([
          {
            id: "start",
            type: "waiting",
            position: { x: w / 2 - 150, y: 150 },
            data: {
              label: "Start",
              isLoading: true,
              title: "Extract Brand DNA",
              description: "Paste a URL to decode your brand's unique identity.",
            },
          },
        ]);
        setEdges([]);
      }
    } else {
      setNodes([
        {
          id: "start",
          type: "waiting",
          position: { x: w / 2 - 150, y: 150 },
          data: {
            label: "Start",
            isLoading: true,
            title: "Hello again",
            description: "What would you like to create today?",
          },
        },
      ]);
      setEdges([]);
    }
  }, [creationMode, isLoading, brandData, setNodes, setEdges, getContainerWidth]);

  // Re-center after nodes are set (e.g. mode switch)
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.3, maxZoom: 1, duration: 300 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, creationMode, fitView]);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      waiting: WaitingNode,
      extracting: ExtractingNode,
      brandLogo: BrandLogoNode,
      brandIdentity: BrandIdentityNode,
      brandTypography: BrandTypographyNode,
      brandColorSystem: BrandColorSystemNode,
      brandVoice: BrandVoiceNode,
    }),
    [],
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      dashed: DashedEdge,
    }),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
      minZoom={0.3}
      maxZoom={1.5}
    >
      <Background variant={undefined} />
      <Controls />
    </ReactFlow>
  );
};

const CreateNewContentPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<CreationMode>("post");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAlertOpen(true);
  }, []);

  const handleSetCreationPost = useCallback(() => setCreationMode("post"), []);
  const handleSetCreationDna = useCallback(() => setCreationMode("dna"), []);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <StartingAlert open={isAlertOpen} onOpenChange={setIsAlertOpen} />

      {/* Top Center Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] pointer-events-auto flex items-center bg-surface-container-low border border-outline-variant/30 rounded-full p-1 shadow-sm">
        <button
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            creationMode === "post"
              ? "bg-primary text-on-primary"
              : "text-on-surface hover:bg-surface-container hover:text-on-surface"
          )}
          onClick={handleSetCreationPost}
        >
          Create Post
        </button>
        <button
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            creationMode === "dna"
              ? "bg-primary text-on-primary"
              : "text-on-surface hover:bg-surface-container hover:text-on-surface"
          )}
          onClick={handleSetCreationDna}
        >
          Brand DNA Extractor
        </button>
      </div>

      <div className="absolute inset-0 z-0">
        <ReactFlowProvider>
          <FlowCanvas
            creationMode={creationMode}
            containerRef={containerRef}
          />
        </ReactFlowProvider>
      </div>

      {creationMode === "post" && (
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-full max-w-sm z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <MemoizedBrandDNA />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {creationMode === "post" ? <BottomNavbar /> : <BottomBrandNavbar />}
        </div>
      </div>
    </div>
  );
};

export default CreateNewContentPage;
