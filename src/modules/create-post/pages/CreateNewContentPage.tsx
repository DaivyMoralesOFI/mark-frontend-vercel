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

import BottomNavbar from "@/modules/create-post/components/navbar/BottomNavbar";
import BottomBrandNavbar from "@/modules/create-post/components/navbar/BottomBrandNavbar";
import WaitingCard from "@/modules/create-post/components/card/WaitingCard";

import { StartingAlert } from "@/modules/create-post/components/alerts/StartingAlert";
import { useFlowStore } from "@/modules/create-post/store/flowStoreSlice";
import BrandDNA from "../components/sidebar/BrandDNA";
import { useTheme } from "@/core/context/ThemeProvider";

import ExtractingNode from "@/modules/create-post/components/flow/ExtractingNode";
import BrandLogoNode from "@/modules/create-post/components/flow/BrandLogoNode";
import BrandIdentityNode from "@/modules/create-post/components/flow/BrandIdentityNode";
import BrandTypographyNode from "@/modules/create-post/components/flow/BrandTypographyNode";
import BrandColorSystemNode from "@/modules/create-post/components/flow/BrandColorSystemNode";
import BrandVoiceNode from "@/modules/create-post/components/flow/BrandVoiceNode";

import { cn } from "@/shared/utils/utils";
import { Globe, ArrowUp, Loader } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExtractorFormData,
  extractorFormSchema,
} from "@/modules/create-post/schemas/BrandSchema";
import { useBrandExtractor } from "../hooks/useBrands";

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
        stroke: "var(--outline-variant)",
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

export type CreationMode = "canvas" | "brand-dna";

/**
 * Inner component that uses useReactFlow (must be inside ReactFlowProvider).
 * Used for DNA extraction flow mode.
 */
const FlowCanvas = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
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

  const lastWidthRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lastWidthRef.current = container.offsetWidth;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (Math.abs(newWidth - lastWidthRef.current) > 5) {
          lastWidthRef.current = newWidth;
          setTimeout(() => {
            fitView({ padding: 0.3, maxZoom: 1, duration: 300 });
          }, 50);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fitView]);

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? window.innerWidth;
  }, [containerRef]);

  useEffect(() => {
    const w = getContainerWidth();

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
      setNodes([]);
      setEdges([]);
    }
  }, [isLoading, brandData, setNodes, setEdges, getContainerWidth]);

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.3, maxZoom: 1, duration: 300 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, fitView]);

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
    []
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      dashed: DashedEdge,
    }),
    []
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
      {!isDark && <Background color="var(--outline-variant)" gap={20} size={1} />}
      <Controls />
    </ReactFlow>
  );
};

/**
 * Centered Brand DNA URL input in creation-post style.
 * Only shown when no brand data is loaded and not currently extracting.
 */
const BrandDnaUrlInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { mutate: brandExtractor, isPending: isProcessing } = useBrandExtractor();
  const { brandData, isLoading } = useFlowStore();

  const _form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: { brandUrl: "" },
  });

  const urlValue = _form.watch("brandUrl");
  const hasUrl = urlValue?.trim().length > 0;

  const onSubmit = (data: ExtractorFormData) => {
    brandExtractor(data.brandUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      _form.handleSubmit(onSubmit)();
    }
  };

  // Don't show the centered input if we already have data or are loading
  if (brandData || isLoading) return null;

  return (
    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center pointer-events-none">
      <div className="w-full max-w-[680px] flex flex-col items-center px-4 pointer-events-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-on-surface mb-1.5">
            Extract Brand DNA
          </h2>
          <p className="text-sm text-on-surface-variant/60">
            Paste a URL to decode your brand's unique identity
          </p>
        </div>

        {/* Creation-post style input container */}
        <form
          onSubmit={_form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <div
            className={cn(
              "w-full flex flex-col",
              "bg-surface-container-lowest/95 dark:bg-[#1C1C1C] backdrop-blur-2xl",
              "border rounded-[1.25rem] shadow-xl",
              "transition-all duration-300 ease-out",
              isFocused || hasUrl
                ? "border-primary/40 shadow-primary/5"
                : "border-outline-variant/60 dark:border-outline/10 shadow-black/5"
            )}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              {/* Globe icon */}
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant/40">
                <Globe className="w-4 h-4" strokeWidth={1.8} />
              </div>

              <Controller
                name="brandUrl"
                control={_form.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder="https://www.example.com"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "flex-1 bg-transparent border-none shadow-none",
                      "text-on-surface text-[15px] leading-relaxed",
                      "placeholder:text-on-surface-variant/40",
                      "focus:outline-none focus:ring-0",
                      "py-1 min-h-[28px]"
                    )}
                  />
                )}
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing || !hasUrl}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "transition-all duration-200 ease-out",
                  hasUrl && !isProcessing
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
                    : "bg-outline-variant/15 text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Subtle hint text */}
        <p className="text-[10px] text-muted-foreground/30 mt-3 select-none">
          We'll extract colors, typography, tone, and visual identity from your website
        </p>
      </div>
    </div>
  );
};

const CreateNewContentPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<CreationMode>("canvas");
  const containerRef = useRef<HTMLDivElement>(null);
  const { brandData } = useFlowStore();

  useEffect(() => {
    setIsAlertOpen(true);
  }, []);

  const handleSetMode = useCallback(
    (mode: CreationMode) => setCreationMode(mode),
    []
  );

  const tabs: { id: CreationMode; label: string }[] = [
    { id: "canvas", label: "Canvas" },
    { id: "brand-dna", label: "Brand DNA" },
  ];

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <StartingAlert open={isAlertOpen} onOpenChange={setIsAlertOpen} />

      {/* Top Center Mode Toggle — Canvas / Brand DNA */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] pointer-events-auto">
        <div className="flex items-center bg-surface-container-high/80 dark:bg-[#1C1C1C] backdrop-blur-xl border border-outline-variant/30 dark:border-outline/20 rounded-full p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                creationMode === tab.id
                  ? "bg-on-surface dark:bg-on-surface text-surface dark:text-surface shadow-sm"
                  : "text-on-surface-variant/70 hover:text-on-surface hover:bg-on-surface/5"
              )}
              onClick={() => handleSetMode(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas mode — centered prompt input with settings above */}
      {creationMode === "canvas" && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-5">
          <div className="w-full max-w-[540px] px-4">
            <BottomNavbar centered />
          </div>
        </div>
      )}

      {/* Brand DNA mode — centered URL input + ReactFlow canvas */}
      {creationMode === "brand-dna" && (
        <>
          <div className="absolute inset-0 z-0">
            <ReactFlowProvider>
              <FlowCanvas containerRef={containerRef} />
            </ReactFlowProvider>
          </div>
          {/* Centered URL input — only visible when no brand data */}
          <BrandDnaUrlInput />

          {/* Sidebar for brand data details */}
          {brandData && (
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-full max-w-sm z-10 pointer-events-none">
              <div className="pointer-events-auto">
                <MemoizedBrandDNA />
              </div>
            </div>
          )}
        </>
      )}

      {/* Bottom Navbar — only for brand-dna mode */}
      {creationMode === "brand-dna" && (
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomBrandNavbar />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewContentPage;
