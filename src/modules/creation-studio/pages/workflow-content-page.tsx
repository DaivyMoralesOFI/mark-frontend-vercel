import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Controls,
  EdgeTypes,
  NodeTypes,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { AlertCircle } from "lucide-react";

import BottomNavbar from "@/modules/creation-studio/components/navbar/bottom-navbar";
import WaitingCard from "@/modules/creation-studio/components/card/waiting-card";
import { useCreationStatus } from "@/modules/creation-studio/hooks/use-create-image";
import { CreatedImageCard } from "@/modules/creation-studio/components/card/created-image-card";
import sampleImage from "@/assets/img/sample_mark_respond.png";
import AnimatedEdge from "@/modules/creation-studio/components/flow/animated-edge";
import { useFlowStore } from "@/modules/creation-studio/store/flow-store";
import { useBrands } from "@/shared/hooks/useBrands";

const SkeletonNode = () => (
  <div className="w-[400px] h-[500px] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
    <div className="text-slate-400 font-medium">Creating magic...</div>
  </div>
);

const ResultNode = ({ data }: NodeProps) => (
  <div className="relative">
    <CreatedImageCard image={data.image || sampleImage} />
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
  });

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
    } else if (isProcessing || (isDone && !finalImageUrl)) {
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
    } else if (isDone && finalImageUrl) {
      setNodes([
        {
          id: "content-node",
          type: "result",
          position: { x: window.innerWidth / 2 - 200, y: 50 },
          data: {
            image: finalImageUrl,
          },
        },
      ]);
      setEdges([]);
    }
  }, [
    isProcessing,
    isDone,
    finalImageUrl,
    hasSubscriptionError,
    subscriptionError,
    setNodes,
    setEdges,
  ]);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      result: ResultNode,
      skeleton: SkeletonNode,
      waiting: WaitingCard,
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
        >
          <Controls />
        </ReactFlow>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
};

export default WorkflowContentPage;
