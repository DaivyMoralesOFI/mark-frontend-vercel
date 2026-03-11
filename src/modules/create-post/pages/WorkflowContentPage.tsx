import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { AlertCircle, Plus, Minus, Maximize, Sparkles, Copy, Check, ChevronDown, CheckCircle2, Circle, ArrowUp, Loader } from "lucide-react";
import { LiaBroomSolid } from "react-icons/lia";

import BottomNavbar from "@/modules/create-post/components/navbar/BottomNavbar";
import WaitingCard from "@/modules/create-post/components/card/WaitingCard";
import { useCreationStatus, useRegenerateCopy } from "@/modules/create-post/hooks/useCreateImage";
import { CreatedImageCard } from "@/modules/create-post/components/card/CreatedImageCard";
import sampleImage from "@/assets/img/sample_mark_respond.png";
import AnimatedEdge from "@/modules/create-post/components/flow/AnimatedEdge";
import { useFlowStore } from "@/modules/create-post/store/flowStoreSlice";

const TOP_ROW_Y = 50;
const BOTTOM_ROW_Y = 700;
const NODE_WIDTH = 650;

const SkeletonNode = () => (
  <div className="w-[500px] h-[480px] bg-neutral-100 dark:bg-[#1C1C1C] rounded-2xl border border-neutral-200/60 dark:border-white/[0.06] flex flex-col items-center justify-center gap-4 relative overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
        animation: "shimmer 2.5s ease-in-out infinite",
      }}
    />
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

const CopySkeletonNode = () => (
  <div className="w-[500px] h-[260px] bg-neutral-100 dark:bg-[#1C1C1C] rounded-2xl border border-neutral-200/60 dark:border-white/[0.06] flex flex-col items-center justify-center gap-4 relative overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
    <div className="w-6 h-6 border-2 border-neutral-300 dark:border-white/10 border-t-[#D946EF] rounded-full animate-spin" />
    <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 tracking-wide">Generating copy...</span>
  </div>
);

function CopyCard({
  copy,
  isSelected,
  onSelect,
  creation_uuid,
}: {
  copy: string;
  isSelected?: boolean;
  onSelect?: () => void;
  creation_uuid?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(crypto.randomUUID()).current;
  const { lastCreationPayload, userPrompt, addCopyVersion, focusedCardId, setFocusedCardId, selectedCopyIndex } = useFlowStore();
  const { mutate: regenerateCopy, isPending: isRegenerating } = useRegenerateCopy();

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const isBlurred = focusedCardId !== null && focusedCardId !== componentId;
  const anySelected = selectedCopyIndex !== null;
  const isDimmedBySelection = anySelected && !isSelected;
  const isLong = copy.length > 280;

  useEffect(() => {
    function handleCloseOthers(event: Event) {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.id !== componentId) {
        setShowEditInput(false);
      }
    }
    window.addEventListener("closeOtherImageTools", handleCloseOthers);
    return () => window.removeEventListener("closeOtherImageTools", handleCloseOthers);
  }, [componentId]);

  const handleToggleEdit = () => {
    const opening = !showEditInput;
    if (opening) {
      window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
      setFocusedCardId(componentId);
    } else {
      setFocusedCardId(null);
    }
    setShowEditInput(opening);
  };

  const handleSubmit = () => {
    if (!editPrompt.trim() || !creation_uuid || !lastCreationPayload) return;
    regenerateCopy({
      creation_uuid,
      prompt: userPrompt,
      current_copy: copy,
      copy_feedback: editPrompt,
      platforms: lastCreationPayload.platforms,
      post_type: lastCreationPayload.post_type,
      post_tone: lastCreationPayload.post_tone,
      brand_dna: lastCreationPayload.brand_dna,
      identity: lastCreationPayload.identity,
    }, {
      onSuccess: (response) => {
        addCopyVersion(response.copy);
        setEditPrompt("");
        setShowEditInput(false);
        setFocusedCardId(null);
      },
      onError: (err) => console.error("Failed to regenerate copy:", err),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editPrompt.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full max-w-[520px] transition-all duration-500 ease-out ${
        isBlurred || isDimmedBySelection ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Edit input */}
      <div
        className={`w-full bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-[1.25rem] shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
          showEditInput
            ? "opacity-100 max-h-20 mb-3 pointer-events-auto"
            : "opacity-0 max-h-0 mb-0 pointer-events-none border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 px-2 py-2">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Make it shorter, change the tone..."
            disabled={isRegenerating}
            className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm font-medium disabled:opacity-50 min-w-0 px-2"
          />
          <button
            onClick={handleSubmit}
            disabled={!editPrompt.trim() || isRegenerating}
            className={`flex-shrink-0 rounded-full p-2 transition-all flex items-center justify-center ${
              editPrompt.trim() && !isRegenerating
                ? "bg-[#D946EF] hover:bg-[#D946EF]/90 text-white"
                : "bg-neutral-200 dark:bg-neutral-700/50 text-neutral-400"
            }`}
          >
            {isRegenerating ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Card */}
      <div
        className={`w-[500px] bg-white dark:bg-[#18181B] rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 border transition-all duration-500 ease-out cursor-pointer ${
          isSelected
            ? "border-[#D946EF]/30 ring-1 ring-[#D946EF]/20"
            : showEditInput
            ? "border-primary/40"
            : "border-black/[0.06] dark:border-white/[0.06]"
        }`}
        onClick={handleToggleEdit}
      >
        <div className="px-5 pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#D946EF]/15 to-[#D946EF]/5 dark:from-[#D946EF]/20 dark:to-[#D946EF]/5">
                <Sparkles className="w-3.5 h-3.5 text-[#D946EF]" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Generated Copy
              </span>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="relative">
            <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-[1.7] whitespace-pre-line">
              {copy}
            </p>
          </div>
        </div>

        {/* Select bar — shown on click */}
        {onSelect && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showEditInput ? "max-h-14 opacity-100" : "max-h-0 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Use in final preview</span>
              <button
                onClick={onSelect}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#D946EF]/10 text-[#D946EF]"
                    : "text-neutral-400 hover:text-[#D946EF] hover:bg-[#D946EF]/[0.06]"
                }`}
              >
                {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                <span>{isSelected ? "Selected" : "Select"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CopyNode = ({ data }: NodeProps) => (
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
    <CopyCard copy={data.copy} isSelected={data.isSelected} onSelect={data.onSelect} creation_uuid={data.creation_uuid} />
  </div>
);

function ResultNode({ data }: NodeProps) {
  const { selectedImageUuid, selectedCopyIndex } = useFlowStore();

  const isImageNode = data.variant === "image";
  const anyImageSelected = selectedImageUuid !== null;

  const isDimmed = isImageNode && anyImageSelected && !data.isSelected;
  const isSelected = isImageNode && data.isSelected;

  return (
    <div
      className={`relative transition-all duration-500 ease-out ${
        isDimmed ? "opacity-50" : "opacity-100"
      }`}
    >
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
      <div
        className={`rounded-[1.5rem] transition-all duration-500 ease-out ${
          isSelected ? "ring-1 ring-[#D946EF]/30" : ""
        }`}
      >
        <CreatedImageCard
          image={data.image || sampleImage}
          creation_uuid={data.creation_uuid}
          parent_uuid={data.parent_uuid}
          isProcessing={data.isProcessing}
          prompt={data.prompt}
          copy={data.copy}
          variant={data.variant ?? "combined"}
          isSelected={data.isSelected}
          onSelect={data.onSelect}
        />
      </div>
    </div>
  );
}

const WorkflowContentPage = () => {
  const { uuid } = useParams<{ uuid: string }>();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    onConnect,
    resetFlow,
    userPrompt,
    postCopy,
    copyVersions,
    selectedImageUuid,
    selectedCopyIndex,
    setSelectedImageUuid,
    setSelectedCopyIndex,
    setFocusedCardId,
  } = useFlowStore();

  // Track node positions via ref to preserve them across effect re-runs
  const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({});
  useEffect(() => {
    nodes.forEach((n) => {
      nodePositionsRef.current[n.id] = n.position;
    });
  }, [nodes]);

  const handlePaneClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: "__canvas__" } }));
    setFocusedCardId(null);
  }, [setFocusedCardId]);

  const {
    status,
    mapData,
    isProcessing,
    isDone,
    hasSubscriptionError,
    subscriptionError,
  } = useCreationStatus(uuid ?? "");

  const finalImageUrl = status?.img_url || status?.image_url;

  const [hiddenNodeIds, setHiddenNodeIds] = useState<string[]>([]);

  useEffect(() => {
    const handleHideNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.uuid) {
        setHiddenNodeIds((prev) => [...prev, customEvent.detail.uuid]);
      }
    };
    window.addEventListener("hideNode", handleHideNode);
    return () => window.removeEventListener("hideNode", handleHideNode);
  }, []);

  useEffect(() => {
    return () => resetFlow();
  }, [resetFlow]);

  useEffect(() => {
    if (hasSubscriptionError) {
      setNodes([
        {
          id: "error-node",
          type: "waiting",
          position: { x: window.innerWidth / 2 - 200, y: TOP_ROW_Y },
          data: {
            title: "Subscription Error",
            description: subscriptionError?.message || "Unknown error",
            icon: AlertCircle,
          },
        },
      ]);
      setEdges([]);
      return;
    }

    const startX = window.innerWidth / 2 - 200;
    const pos = (id: string, defaultPos: { x: number; y: number }) =>
      nodePositionsRef.current[id] ?? defaultPos;

    // Sort helper
    const getTime = (val: any) => {
      if (val?.seconds) return val.seconds * 1000 + (val.nanoseconds || 0) / 1000000;
      if (typeof val === "number") return val;
      if (val) {
        const parsed = new Date(val).getTime();
        if (!isNaN(parsed)) return parsed;
      }
      return Infinity; // No timestamp → treat as newest (rightmost)
    };

    // --- TOP ROW: image nodes from mapData ---
    const sortedMapData = (mapData ?? [])
      .filter((item) => item.uuid && !hiddenNodeIds.includes(item.uuid))
      .sort((a, b) => {
        const timeA = getTime(a.creation_at || a.update_at);
        const timeB = getTime(b.creation_at || b.update_at);
        if (timeA === timeB) return (mapData ?? []).indexOf(a) - (mapData ?? []).indexOf(b);
        return timeA - timeB;
      });

    const imageNodes = sortedMapData.map((item, index) => {
      const imageUrl = item.img_url || item.image_url;
      const isItemProcessing = item.status?.toLowerCase() !== "done";
      const nodeId = `image-node-${item.uuid || index}`;
      const isSelected = selectedImageUuid === item.uuid;

      if (!imageUrl) {
        return {
          id: `skeleton-node-${item.uuid || index}`,
          type: "skeleton",
          position: pos(`skeleton-node-${item.uuid || index}`, { x: startX + index * NODE_WIDTH, y: TOP_ROW_Y }),
          data: { label: !isItemProcessing ? "Finalizing..." : "Creating magic..." },
        };
      }

      return {
        id: nodeId,
        type: "result",
        position: pos(nodeId, { x: startX + index * NODE_WIDTH, y: TOP_ROW_Y }),
        data: {
          image: imageUrl,
          creation_uuid: uuid,
          parent_uuid: item.uuid,
          isProcessing: isItemProcessing,
          variant: "image",
          isSelected,
          onSelect: () => setSelectedImageUuid(isSelected ? null : item.uuid),
        },
      };
    });

    const topRow =
      imageNodes.length > 0
        ? imageNodes
        : (isProcessing || isDone) && !finalImageUrl
        ? [
            {
              id: "skeleton-node-loading",
              type: "skeleton",
              position: pos("skeleton-node-loading", { x: startX, y: TOP_ROW_Y }),
              data: { label: isDone ? "Finalizing..." : "Creating magic..." },
            },
          ]
        : [];

    // --- BOTTOM ROW: copy nodes from copyVersions ---
    const effectiveCopyVersions =
      copyVersions.length > 0 ? copyVersions : postCopy ? [postCopy] : [];

    const copyNodes = effectiveCopyVersions.map((copyText, index) => {
      const nodeId = `copy-node-${index}`;
      const isSelected = selectedCopyIndex === index;
      return {
        id: nodeId,
        type: "copyOnly",
        position: pos(nodeId, { x: startX + index * NODE_WIDTH, y: BOTTOM_ROW_Y }),
        data: {
          copy: copyText,
          isSelected,
          onSelect: () => setSelectedCopyIndex(isSelected ? null : index),
          creation_uuid: uuid,
        },
      };
    });

    const bottomRow =
      copyNodes.length > 0
        ? copyNodes
        : isProcessing || isDone
        ? [
            {
              id: "copy-skeleton-loading",
              type: "copySkeleton",
              position: pos("copy-skeleton-loading", { x: startX, y: BOTTOM_ROW_Y }),
              data: {},
            },
          ]
        : [];

    // --- FINAL COMBINED NODE (rightmost) ---
    // Use selected values; fall back to latest
    const latestImageItem = [...sortedMapData].reverse().find((item) => item.img_url || item.image_url);
    const selectedImageItem = selectedImageUuid
      ? sortedMapData.find((item) => item.uuid === selectedImageUuid)
      : undefined;
    const activeImageItem = (selectedImageItem && (selectedImageItem.img_url || selectedImageItem.image_url))
      ? selectedImageItem
      : latestImageItem;

    const latestCopy = effectiveCopyVersions[effectiveCopyVersions.length - 1];
    const activeCopy =
      selectedCopyIndex !== null && effectiveCopyVersions[selectedCopyIndex] !== undefined
        ? effectiveCopyVersions[selectedCopyIndex]
        : latestCopy;

    const maxCount = Math.max(topRow.length, bottomRow.length);
    const combinedX = startX + maxCount * NODE_WIDTH;
    const combinedY = (TOP_ROW_Y + BOTTOM_ROW_Y) / 2;

    const combinedNodes =
      activeImageItem && activeCopy
        ? [
            {
              id: "final-combined-node",
              type: "result",
              position: pos("final-combined-node", { x: combinedX, y: combinedY }),
              data: {
                image: activeImageItem.img_url || activeImageItem.image_url,
                creation_uuid: uuid,
                parent_uuid: activeImageItem.uuid,
                isProcessing: activeImageItem.status?.toLowerCase() !== "done",
                prompt: userPrompt,
                copy: activeCopy,
                variant: "combined",
              },
            },
          ]
        : [];

    const newNodes = [...topRow, ...bottomRow, ...combinedNodes];
    setNodes(newNodes);

    // --- EDGES ---
    const newEdges: any[] = [];

    topRow.slice(0, -1).forEach((_, i) => {
      newEdges.push({
        id: `image-edge-${i}`,
        source: topRow[i].id,
        target: topRow[i + 1].id,
        sourceHandle: "right",
        targetHandle: "left",
        type: "animated",
        data: { isActive: true },
      });
    });

    bottomRow.slice(0, -1).forEach((_, i) => {
      newEdges.push({
        id: `copy-edge-${i}`,
        source: bottomRow[i].id,
        target: bottomRow[i + 1].id,
        sourceHandle: "right",
        targetHandle: "left",
        type: "animated",
        data: { isActive: true },
      });
    });

    if (combinedNodes.length > 0) {
      if (topRow.length > 0) {
        newEdges.push({
          id: "converge-image",
          source: topRow[topRow.length - 1].id,
          target: "final-combined-node",
          sourceHandle: "right",
          targetHandle: "left",
          type: "animated",
          data: { isActive: true },
        });
      }
      if (bottomRow.length > 0) {
        newEdges.push({
          id: "converge-copy",
          source: bottomRow[bottomRow.length - 1].id,
          target: "final-combined-node",
          sourceHandle: "right",
          targetHandle: "left",
          type: "animated",
          data: { isActive: true },
        });
      }
    }

    setEdges(newEdges);
  }, [
    mapData,
    uuid,
    isProcessing,
    isDone,
    finalImageUrl,
    hasSubscriptionError,
    subscriptionError,
    hiddenNodeIds,
    copyVersions,
    postCopy,
    userPrompt,
    selectedImageUuid,
    selectedCopyIndex,
    setSelectedImageUuid,
    setSelectedCopyIndex,
    setNodes,
    setEdges,
  ]);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      result: ResultNode,
      skeleton: SkeletonNode,
      copyOnly: CopyNode,
      copySkeleton: CopySkeletonNode,
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
          onPaneClick={handlePaneClick}
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
    const startX = window.innerWidth / 2 - 200;
    const byType: Record<string, any[]> = {};
    nodes.forEach((node) => {
      const row = node.id.startsWith("copy-") ? "copy" : node.id === "final-combined-node" ? "combined" : "image";
      if (!byType[row]) byType[row] = [];
      byType[row].push(node);
    });

    const realigned = nodes.map((node) => {
      const row = node.id.startsWith("copy-") ? "copy" : node.id === "final-combined-node" ? "combined" : "image";
      const rowNodes = byType[row];
      const index = rowNodes.indexOf(node);
      const y = row === "copy" ? BOTTOM_ROW_Y : row === "combined" ? (TOP_ROW_Y + BOTTOM_ROW_Y) / 2 : TOP_ROW_Y;
      const x = row === "combined"
        ? startX + Math.max((byType.image?.length ?? 0), (byType.copy?.length ?? 0)) * NODE_WIDTH
        : startX + index * NODE_WIDTH;
      return { ...node, position: { x, y } };
    });

    setNodes(realigned);
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
