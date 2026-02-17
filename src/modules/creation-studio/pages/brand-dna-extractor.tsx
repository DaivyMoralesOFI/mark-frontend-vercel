import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "../store/flow-store";
import BottomBrandNavbar from "../components/navbar/bottom-brand-bavbar";
import { LogoNode } from "../components/flow-nodes/logo-node";
import { IdentityNode } from "../components/flow-nodes/identity-node";
import { TypographyNode } from "../components/flow-nodes/typography-node";
import { ColorNode } from "../components/flow-nodes/color-node";
import { VoiceNode } from "../components/flow-nodes/voice-node";
import { BrandExtractor } from "../schemas/brand-schema";

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
  } = useFlowStore();

  const generateFlow = useMemo(
    () => (data: BrandExtractor) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // 1. Logo Node (Root)
      const rootId = "logo-root";
      newNodes.push({
        id: rootId,
        type: "logo",
        data: {
          url: data.brand_identity.logo.url,
          format: data.brand_identity.logo.format,
          label: "Brand Logo",
        },
        position: { x: 0, y: 0 },
      });

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
        position: { x: -350, y: 250 },
      });
      newEdges.push({
        id: `e-${rootId}-${identityId}`,
        source: rootId,
        target: identityId,
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
        position: { x: -100, y: 350 },
      });
      newEdges.push({
        id: `e-${rootId}-${typoId}`,
        source: rootId,
        target: typoId,
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
        position: { x: 200, y: 350 },
      });
      newEdges.push({
        id: `e-${rootId}-${colorId}`,
        source: rootId,
        target: colorId,
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
        position: { x: 450, y: 200 },
      });
      newEdges.push({
        id: `e-${rootId}-${voiceId}`,
        source: rootId,
        target: voiceId,
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
    <div className="w-full h-screen relative bg-surface-container-lowest overflow-hidden">
      <div className="absolute inset-0 z-0">
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
      </div>

      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-primary/5 via-transparent to-secondary/5" />

      <div className="absolute top-10 right-10 z-10">
        <div className="bg-surface-container-lowest/40 backdrop-blur-md border border-outline-variant/30 px-4 py-2 rounded-full shadow-sm">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Brand DNA Extractor
          </span>
        </div>
      </div>

      <BottomBrandNavbar />
    </div>
  );
};

export default BrandExtractorPage;
