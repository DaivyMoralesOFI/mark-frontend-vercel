import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "../store/flow-store";
import BottomBrandNavbar from "../components/navbar/bottom-brand-navbar";
import { LogoNode } from "../components/flow-nodes/logo-node";
import { IdentityNode } from "../components/flow-nodes/identity-node";
import { TypographyNode } from "../components/flow-nodes/typography-node";
import { ColorNode } from "../components/flow-nodes/color-node";
import { VoiceNode } from "../components/flow-nodes/voice-node";
import { BrandExtractor } from "../schemas/brand-schema";
import WaitingCard from "../components/card/waiting-card";

const nodeTypes = {
  logo: LogoNode,
  identity: IdentityNode,
  typography: TypographyNode,
  colors: ColorNode,
  voice: VoiceNode,
};

const BrandExtractorPage = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    brandData,
    isLoading,
  } = useFlowStore();

  const generateFlow = useMemo(
    () => (data: BrandExtractor) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // 1. Logo Node (Root)
      const rootId = "logo-root";
      const radius = 450; // Radius for circular layout

      newNodes.push({
        id: rootId,
        type: "logo",
        data: {
          url: data.brand_identity.logo.url,
          format: data.brand_identity.logo.format,
          label: "Brand Logo",
          isLarge: true,
        },
        position: { x: 0, y: 0 },
      });

      // helper to calculate positions around a circle
      // starting from top-left, going clockwise: identity, voice, colors, typography
      const positions = [
        { x: -radius, y: -radius * 0.6 }, // Identity (Top-Left)
        { x: radius, y: -radius * 0.6 }, // Voice (Top-Right)
        { x: radius, y: radius * 0.6 }, // Colors (Bottom-Right)
        { x: -radius, y: radius * 0.6 }, // Typography (Bottom-Left)
      ];

      // 2. Identity Node
      const identityId = "identity";
      newNodes.push({
        id: identityId,
        type: "identity",
        data: {
          name: data.brand_identity.name,
          brand_archetype: data.brand_identity.brand_archetype,
          industry: data.brand_identity.industry,
          label: "Identity",
        },
        position: positions[0],
      });
      newEdges.push({
        id: `e-${rootId}-${identityId}`,
        source: rootId,
        target: identityId,
        sourceHandle: "source-left",
        animated: true,
      });

      // 5. Voice Node
      const voiceId = "voice";
      newNodes.push({
        id: voiceId,
        type: "voice",
        data: {
          tone_of_voice: data.brand_voice.tone_of_voice,
          communication_style: data.brand_voice.communication_style,
          target_audience: data.brand_voice.target_audience,
          positioning_statement: data.brand_voice.positioning_statement,
          label: "Brand Voice",
        },
        position: positions[1],
      });
      newEdges.push({
        id: `e-${rootId}-${voiceId}`,
        source: rootId,
        target: voiceId,
        sourceHandle: "source-right",
        animated: true,
      });

      // 4. Color Node
      const colorId = "colors";
      newNodes.push({
        id: colorId,
        type: "colors",
        data: {
          roles: data.color_system.roles,
          label: "Color System",
        },
        position: positions[2],
      });
      newEdges.push({
        id: `e-${rootId}-${colorId}`,
        source: rootId,
        target: colorId,
        sourceHandle: "source-right",
        animated: true,
      });

      // 3. Typography Node
      const typoId = "typography";
      newNodes.push({
        id: typoId,
        type: "typography",
        data: {
          headings: data.typography.headings,
          body: data.typography.body,
          label: "Typography",
        },
        position: positions[3],
      });
      newEdges.push({
        id: `e-${rootId}-${typoId}`,
        source: rootId,
        target: typoId,
        sourceHandle: "source-left",
        animated: true,
      });

      return { nodes: newNodes, edges: newEdges };
    },
    [],
  );

  useEffect(() => {
    if (brandData) {
      const { nodes: newNodes, edges: newEdges } = generateFlow(brandData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [brandData, generateFlow, setNodes, setEdges]);

  return (
    <div className="w-full h-screen relative  overflow-hidden">
      <div className="absolute inset-0 z-0">
        {!brandData || isLoading ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <WaitingCard
              isLoading={isLoading}
              title="Discover your brand DNA"
              description="Extract your brand DNA from your website"
            />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.5 }}
            minZoom={0.2}
            maxZoom={1.5}
            className="bg-dot-pattern"
          >
            <Background color="#ccc" variant={"dots" as any} />
            <Controls />
          </ReactFlow>
        )}
      </div>
      <BottomBrandNavbar />
    </div>
  );
};

export default BrandExtractorPage;
