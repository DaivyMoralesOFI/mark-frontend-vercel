import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  EdgeTypes,
  NodeTypes,
  NodeProps,
  useReactFlow,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { AlertCircle, Plus, Minus, Maximize } from "lucide-react";
import { LiaBroomSolid } from "react-icons/lia";

import BottomNavbar from "@/modules/create-post/components/navbar/BottomNavbar";
import WaitingCard from "@/modules/create-post/components/card/WaitingCard";
import { useCreationStatus } from "@/modules/create-post/hooks/useCreateImage";
import { CreatedImageCard } from "@/modules/create-post/components/card/CreatedImageCard";
import sampleImage from "@/assets/img/sample_mark_respond.png";
import AnimatedEdge from "@/modules/create-post/components/flow/AnimatedEdge";
import { useFlowStore } from "@/modules/create-post/store/flowStoreSlice";


const SkeletonNode = () => (
  <div className="w-[500px] h-[580px] bg-neutral-100 dark:bg-[#1C1C1C] rounded-2xl border border-neutral-200/60 dark:border-white/[0.06] flex flex-col items-center justify-center gap-4 relative overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
    {/* Shimmer overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
        animation: "shimmer 2.5s ease-in-out infinite",
      }}
    />
    {/* Spinner */}
    <div className="w-8 h-8 border-2 border-neutral-300 dark:border-white/10 border-t-primary rounded-full animate-spin" />
    <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 tracking-wide">Creating your image...</span>
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const ResultNode = ({ data }: NodeProps) => (
  <div className="relative">
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      style={{ background: "transparent", border: "none", width: 0, height: 0 }}
    />
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      style={{ background: "transparent", border: "none", width: 0, height: 0 }}
    />
    <CreatedImageCard
      image={data.image || sampleImage}
      creation_uuid={data.creation_uuid}
      parent_uuid={data.parent_uuid}
      isProcessing={data.isProcessing}
      prompt={data.prompt}
    />
  </div>
);

const WorkflowContentPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  console.log("📍 WorkflowContentPage - UUID from URL:", uuid);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    onConnect,
    resetFlow,
  } = useFlowStore();

  // Suscripción al estado de Firebase para este UUID específico
  const {
    status,
    mapData,
    isProcessing,
    isDone,
    hasSubscriptionError,
    subscriptionError,
  } = useCreationStatus(uuid ?? "");

  const finalImageUrl = status?.img_url || status?.image_url;

  console.log({
    isProcessing,
    isDone,
    hasSubscriptionError,
    subscriptionError,
    finalImageUrl,
    mapData,
  });

  const [hiddenNodeIds, setHiddenNodeIds] = useState<string[]>([]);

  useEffect(() => {
    const handleHideNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.uuid) {
        console.log("🗑️ Hiding node from canvas:", customEvent.detail.uuid);
        setHiddenNodeIds((prev) => [...prev, customEvent.detail.uuid]);
      }
    };
    window.addEventListener("hideNode", handleHideNode);
    return () => window.removeEventListener("hideNode", handleHideNode);
  }, []);

  // Limpiar el flujo al desmontar para evitar que queden nodos al navegar
  useEffect(() => {
    return () => resetFlow();
  }, [resetFlow]);

  // Efecto para manejar el flujo visual basado en el estado de Firebase
  useEffect(() => {
    // Show error state if subscription has error
    if (hasSubscriptionError) {
      setNodes([
        {
          id: "error-node",
          type: "waiting",
          position: { x: window.innerWidth / 2 - 200, y: 50 },
          data: {
            title: "Subscription Error",
            description: subscriptionError?.message || "Unknown error",
            icon: AlertCircle,
          },
        },
      ]);
      setEdges([]);
    } else if (mapData && mapData.length > 0) {
      // Prevent showing nothing if there are items
      const newNodes = mapData
        .filter((item) => item.uuid && !hiddenNodeIds.includes(item.uuid))
        // Sort chronologically (oldest to newest)
        // Missing timestamps default to Infinity, with array index as tie-breaker for stability
        .sort((a, b) => {
          const getTime = (val: any) => {
            if (val?.seconds) return val.seconds * 1000 + (val.nanoseconds || 0) / 1000000;
            if (typeof val === 'number') return val;
            if (val) {
              const parsed = new Date(val).getTime();
              if (!isNaN(parsed)) return parsed;
            }
            return 0; // Items with no timestamp treated as oldest (leftmost)
          };

          // Fallback to update_at if creation_at is missing completely
          const timeA = getTime(a.creation_at || a.update_at);
          const timeB = getTime(b.creation_at || b.update_at);

          if (timeA === timeB) {
            // Stable tie-breaker for items with missing timestamps (keeps them in received order)
            return mapData.indexOf(a) - mapData.indexOf(b);
          }
          return timeA - timeB;
        })
        .map((item, index) => {
          const imageUrl = item.img_url || item.image_url;
          const isItemProcessing = item.status?.toLowerCase() !== "done";

          if (!imageUrl) {
            return {
              id: `skeleton-node-${item.uuid || index}`,
              type: "skeleton",
              position: { x: (window.innerWidth / 2 - 200) + (index * 650), y: 50 },
              data: {
                label: !isItemProcessing ? "Finalizing..." : "Creating magic...",
              },
            };
          }

          return {
            id: `content-node-${item.uuid || index}`,
            type: "result",
            position: { x: (window.innerWidth / 2 - 200) + (index * 650), y: 50 },
            data: {
              image: imageUrl,
              creation_uuid: uuid,
              parent_uuid: item.uuid,
              isProcessing: isItemProcessing,
              prompt: item.prompt,
            },
          };
        });

      setNodes(newNodes);

      // Create animated timeline edges between consecutive nodes
      const newEdges = newNodes.slice(0, -1).map((_node, index) => ({
        id: `edge-${index}-${index + 1}`,
        source: newNodes[index].id,
        target: newNodes[index + 1].id,
        sourceHandle: "right",
        targetHandle: "left",
        type: "animated",
        data: { isActive: true },
      }));
      setEdges(newEdges);
    } else if ((isProcessing && !finalImageUrl) || (isDone && !finalImageUrl)) {
      // Si está procesando O si ya terminó pero la URL de la imagen aún no se ha propagado
      setNodes([
        {
          id: "content-node",
          type: "skeleton",
          position: { x: window.innerWidth / 2 - 200, y: 50 },
          data: {
            label: isDone ? "Finalizing..." : "Creating magic...",
          },
        },
      ]);
      setEdges([]);
    }
  }, [
    mapData,
    uuid,
    isProcessing,
    isDone,
    finalImageUrl,
    hasSubscriptionError,
    subscriptionError,
    hiddenNodeIds,
    setNodes,
    setEdges,
  ]);



  const nodeTypes: NodeTypes = useMemo(
    () => ({
      result: ResultNode,
      skeleton: SkeletonNode,
      waiting: ({ data }: NodeProps) => (
        <WaitingCard
          title={data?.title}
          description={data?.description}
        />
      ),
    }),
    [],
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      animated: AnimatedEdge,
    }),
    [],
  );

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 2, maxZoom: 1 }}
          minZoom={0.5}
          maxZoom={1.5}
          panOnScroll={true}
          selectionOnDrag={false}
          panOnDrag={true}
        >
          <CustomControls nodes={nodes} setNodes={setNodes} />
          <FlowPanner nodes={nodes} />
        </ReactFlow>
      </div>
      {(!isDone || !finalImageUrl) && (
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomNavbar />
          </div>
        </div>
      )}
    </div>
  );
};

function CustomControls({ nodes, setNodes }: { nodes: any[]; setNodes: (nodes: any[]) => void }) {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const handleZoomIn = useCallback(() => zoomIn({ duration: 300 }), [zoomIn]);
  const handleZoomOut = useCallback(() => zoomOut({ duration: 300 }), [zoomOut]);
  const handleFitView = useCallback(() => fitView({ padding: 0.5, maxZoom: 1.5, duration: 400 }), [fitView]);

  const handleRealign = useCallback(() => {
    const NODE_WIDTH = 650;
    const startX = window.innerWidth / 2 - 200;
    const realigned = nodes.map((node, index) => ({
      ...node,
      position: { x: startX + index * NODE_WIDTH, y: 50 },
    }));
    setNodes(realigned);
    // Navigate to the last node after realigning
    const lastNode = realigned[realigned.length - 1];
    if (lastNode?.position) {
      setTimeout(() => setViewport({
        x: -(lastNode.position.x) + (window.innerWidth / 2) - 250,
        y: -(lastNode.position.y) + (window.innerHeight / 2) - 300,
        zoom: 1,
      }, { duration: 600 }), 50);
    }
  }, [nodes, setNodes, setViewport]);

  return (
    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-xl p-1 shadow-lg shadow-black/10 dark:shadow-2xl dark:shadow-black/40">
      <ControlButton onClick={handleZoomIn} title="Zoom in">
        <Plus className="w-4 h-4" />
      </ControlButton>
      <ControlButton onClick={handleZoomOut} title="Zoom out">
        <Minus className="w-4 h-4" />
      </ControlButton>
      <div className="w-full h-px bg-black/[0.06] dark:bg-white/[0.06] my-0.5" />
      <ControlButton onClick={handleFitView} title="Fit view">
        <Maximize className="w-4 h-4" />
      </ControlButton>
      <div className="w-full h-px bg-black/[0.06] dark:bg-white/[0.06] my-0.5" />
      <ControlButton onClick={handleRealign} title="Re-align images">
        <LiaBroomSolid className="w-4 h-4" />
      </ControlButton>
    </div>
  );
}

function ControlButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] rounded-lg transition-all duration-200 cursor-pointer"
    >
      {children}
    </button>
  );
}

function FlowPanner({ nodes }: { nodes: any[] }) {
  const { setViewport } = useReactFlow();

  const lastNodeId = nodes[nodes.length - 1]?.id ?? null;

  useEffect(() => {
    if (!lastNodeId) return;
    const lastNode = nodes[nodes.length - 1];
    if (!lastNode?.position) return;

    // Use a longer delay so this always runs after ReactFlow's internal fitView
    const timer = setTimeout(() => {
      setViewport({
        x: -(lastNode.position.x) + (window.innerWidth / 2) - 250,
        y: -(lastNode.position.y) + (window.innerHeight / 2) - 300,
        zoom: 1,
      }, { duration: 800 });
    }, 300);

    return () => clearTimeout(timer);
  }, [lastNodeId, setViewport]);

  return null;
}

export default WorkflowContentPage;
