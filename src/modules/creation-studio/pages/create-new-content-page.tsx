import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

import BottomNavbar from "@/modules/creation-studio/components/navbar/bottom-navbar";
import WaitingCard from "@/modules/creation-studio/components/card/waiting-card";
import { StartingAlert } from "@/modules/creation-studio/components/alerts/starting-alert";
import { useFlowStore } from "@/modules/creation-studio/store/flow-store";
import BrandDNA from "../components/sidebar/brand-dna";

// Página inicial: Estado "Vacio" o "List para crear"
const WaitingNode = () => {
  return (
    <div className="relative p-0 flex justify-center items-center">
      <WaitingCard />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

const CreateNewContentPage = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    onConnect,
  } = useFlowStore();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setIsAlertOpen(true);
    // Solo mostramos el nodo de bienvenida/espera inicial
    setNodes([
      {
        id: "start",
        type: "waiting",
        position: { x: window.innerWidth / 2 - 100, y: 100 },
        data: { label: "Start", isLoading: true },
      },
    ]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      waiting: WaitingNode,
    }),
    [],
  );

  return (
    <div className="w-full h-full relative">
      <StartingAlert open={isAlertOpen} onOpenChange={setIsAlertOpen} />
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 2, maxZoom: 1 }}
          minZoom={1}
          maxZoom={1.5}
        >
          <Background variant={undefined} />
          <Controls />
        </ReactFlow>
      </div>
      <div className="absolute top-10 right-0 w-full max-w-sm z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <BrandDNA />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
};

export default CreateNewContentPage;
