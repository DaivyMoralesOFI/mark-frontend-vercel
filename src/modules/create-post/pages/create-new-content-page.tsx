import { useEffect, useMemo, useState } from "react";
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
function DashedEdge({
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
}

// Waiting node (initial page state)
const WaitingNode = ({ data }: any) => {
  return (
    <div className="relative p-0 flex justify-center items-center">
      <WaitingCard
        title={data.title || "Hello again"}
        description={data.description || "What would you like to create today?"}
      />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
};

export type CreationMode = "post" | "dna";

const CreateNewContentPage = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    onConnect,
    brandData,
    isLoading,
  } = useFlowStore();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<CreationMode>("post");

  useEffect(() => {
    setIsAlertOpen(true);
  }, []);

  useEffect(() => {
    if (creationMode === "dna") {
      if (isLoading) {
        setNodes([
          {
            id: "extracting",
            type: "extracting",
            position: { x: window.innerWidth / 2 - 150, y: 150 },
            data: {},
          },
        ]);
        setEdges([]);
      } else if (brandData) {
        // Radial layout: Brand Logo at top-center, 4 nodes around it
        const centerX = window.innerWidth / 2 - 120;
        const topY = 60;

        const brandSharedData = { brand: brandData };

        setNodes([
          // Brand Logo — top center
          {
            id: "brand-logo",
            type: "brandLogo",
            position: { x: centerX, y: topY },
            data: brandSharedData,
          },
          // Identity — left
          {
            id: "brand-identity",
            type: "brandIdentity",
            position: { x: centerX - 380, y: topY + 200 },
            data: brandSharedData,
          },
          // Typography — bottom-left center
          {
            id: "brand-typography",
            type: "brandTypography",
            position: { x: centerX - 180, y: topY + 330 },
            data: brandSharedData,
          },
          // Color System — bottom-right center
          {
            id: "brand-color-system",
            type: "brandColorSystem",
            position: { x: centerX + 100, y: topY + 330 },
            data: brandSharedData,
          },
          // Brand Voice — right
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
            position: { x: window.innerWidth / 2 - 150, y: 150 },
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
          position: { x: window.innerWidth / 2 - 150, y: 150 },
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
  }, [creationMode, isLoading, brandData, setNodes, setEdges]);

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
    <div className="w-full h-full relative">
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
          onClick={() => setCreationMode("post")}
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
          onClick={() => setCreationMode("dna")}
        >
          Brand DNA Extractor
        </button>
      </div>

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
          fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background variant={undefined} />
          <Controls />
        </ReactFlow>
      </div>

      {creationMode === "post" && (
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-full max-w-sm z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <BrandDNA />
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
