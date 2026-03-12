import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  EdgeTypes,
  NodeTypes,
  NodeProps,
  ReactFlowProvider,
  Node,
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize,
  LayoutList,
  LayoutPanelLeft,
  Sparkles,
  Copy as CopyIcon,
  Check,
  ArrowUp,
  Loader,
  Brush,
  Rows3,
  CheckCircle2,
  Circle,
} from "lucide-react";

import WaitingCard from "@/modules/creation-studio/components/card/WaitingCard";
import {
  useCreationStatus,
  useGenerationStatus,
  useEditImage,
  useEditVideoScene,
  useEditCopy,
} from "@/modules/creation-studio/hooks/useCreateImage";
import { CreatedImageCard } from "@/modules/creation-studio/components/card/CreatedImageCard";
import sampleImage from "@/assets/img/sample_mark_respond.png";
import ImageEdge from "@/modules/creation-studio/components/flow/ImageEdge";
import CopyEdge from "@/modules/creation-studio/components/flow/CopyEdge";
import { useFlowStore } from "@/modules/creation-studio/store/flowStoreSlice";
import type { PendingCopyEdit } from "@/modules/creation-studio/store/flowStoreSlice";
import type { GenerationStore } from "@/modules/creation-studio/schemas/CreateImage";
import { CreationsHistorySidebar } from "@/modules/creation-studio/components/sidebar/CreationsHistorySidebar";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/config/query-keys";
import { cn } from "@/shared/utils/utils";
import { SocialPreviewAside } from "@/modules/creation-studio/components/sidebar/SocialPreviewAside";
import { Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Layout constants — horizontal tree (left → right)
const NODE_WIDTH = 380;
const NODE_HEIGHT = 520;
const H_GAP = 20;
const V_GAP = 16;
const BUBBLE_NODE_WIDTH = 260; // width of the standalone prompt bubble node
const START_X = 360; // image nodes start here; bubble fits in the 80..360 space
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
  alignment: "horizontal" | "vertical" = "vertical",
  postCopy?: string,
  userPrompt?: string,
  copyEditPrompts: Record<string, string> = {},
  pendingCopyEdits: Record<string, PendingCopyEdit> = {},
): { nodes: Node[]; edges: Edge[] } {
  const withImages = generations.filter(
    (g) =>
      g.img_url?.startsWith("http") ||
      g.gen_type === "carousel" ||
      g.gen_type === "video" ||
      (g as any).type === "video"
  );
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

  let roots = withImages.filter((g) => {
    const parentId = g.parent_uuid ?? "";
    const selfId = g.uuid ?? "";
    return !parentId || parentId === selfId || !allIds.has(parentId);
  });

  // For video workflow the service wraps the real video generation inside a
  // creation-uuid root, producing a chain:
  //   creation-root (video, no img_url) → video-gen (video, no img_url) → scenes
  // Both nodes hit the isCarouselOrVideoRoot check → two bubbles.
  // Fix: collapse any video-type child with no img_url into the root so scenes
  // become direct children of the single bubble node.
  for (const root of roots) {
    const rootGenType = root.gen_type || (root as any).type;
    if (rootGenType !== "video") continue;
    const rootId = root.uuid ?? "";
    let changed = true;
    while (changed) {
      changed = false;
      const children = childrenMap.get(rootId) ?? [];
      const intermediaries = children.filter(
        (c) =>
          (c.gen_type || (c as any).type) === "video" &&
          !c.img_url?.startsWith("http"),
      );
      if (intermediaries.length === 0) break;
      const keep = children.filter((c) => !intermediaries.includes(c));
      const promoted = intermediaries.flatMap(
        (c) => childrenMap.get(c.uuid ?? "") ?? [],
      );
      childrenMap.set(rootId, [...keep, ...promoted]);
      intermediaries.forEach((c) => childrenMap.delete(c.uuid ?? ""));
      changed = true;
    }
  }

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

  function getMaxDepth(t: TreeNode, d: number): number {
    if (t.children.length === 0) return d;
    return Math.max(...t.children.map((c) => getMaxDepth(c, d + 1)));
  }

  function layoutTree(
    tree: TreeNode,
    startX: number,
    startY: number,
    depth: number,
  ) {
    if (alignment === "vertical") {
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
        const mid =
          (firstChild.y + lastChild.y + NODE_HEIGHT) / 2 - NODE_HEIGHT / 2;
        tree.x = x;
        tree.y = mid;
      }
    } else {
      // Horizontal layout: children are placed to the right of each other at the same level
      // This is ideal for carousels
      const y = startY + depth * (NODE_HEIGHT + V_GAP);
      if (tree.children.length === 0) {
        tree.y = y;
        tree.x = startX + tree.subtreeHeight / 2 - NODE_WIDTH / 2;
      } else {
        let childX = startX;
        for (const child of tree.children) {
          layoutTree(child, childX, startY, depth + 1);
          childX += child.subtreeHeight + H_GAP;
        }
        const firstChild = tree.children[0];
        const lastChild = tree.children[tree.children.length - 1];
        const mid =
          (firstChild.x + lastChild.x + NODE_WIDTH) / 2 - NODE_WIDTH / 2;
        tree.y = y;
        tree.x = mid;
      }
    }
  }

  if (alignment === "vertical") {
    let currentY = START_Y;
    for (const tree of trees) {
      layoutTree(tree, START_X, currentY, 0);
      currentY += tree.subtreeHeight + V_GAP * 2;
    }
  } else {
    let currentX = START_X;
    for (const tree of trees) {
      const maxDepth = getMaxDepth(tree, 0);
      layoutTree(tree, currentX, START_Y, 0);
      currentX += (maxDepth + 1) * (NODE_WIDTH + H_GAP) + H_GAP;
    }
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const isIdList = (str: string) => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}(,|[0-9a-f-]{36})*/i.test(str);

  const parseCopy = (raw: any): string => {
    if (!raw) return "";
    if (typeof raw === "string") {
      if (isIdList(raw.trim())) return "";
      try {
        const parsed = JSON.parse(raw);
        if (parsed.caption) {
          return `${parsed.caption}${parsed.hashtags ? "\n\n" + parsed.hashtags.join(" ") : ""}`;
        }
        return raw;
      } catch (e) {
        return raw;
      }
    }
    if (typeof raw === "object") {
        if (raw.caption) {
            return `${raw.caption}${raw.hashtags ? "\n\n" + raw.hashtags.join(" ") : ""}`;
        }
        return JSON.stringify(raw);
    }
    return String(raw);
  };

  function flattenTree(tree: TreeNode, parentNodeId?: string, parentIsBubble = false, hidePromptBubble = false, isVideoScene = false) {
    const nodeId = `gen-${tree.gen.uuid ?? ""}`;
    const genType = tree.gen.gen_type || (tree.gen as any).type;
    // For video: only the root generation (no img_url) becomes the bubble;
    // individual scenes (which have img_url) render as normal result nodes.
    const isCarouselOrVideoRoot =
      genType === "carousel" ||
      (genType === "video" && !tree.gen.img_url?.startsWith("http"));

    if (isCarouselOrVideoRoot) {
      const bubbleWidth = 260;
      nodes.push({
        id: nodeId,
        type: "promptBubble",
        position: { x: tree.x, y: tree.y },
        data: {
          prompt: tree.gen.prompt ?? "",
          genUuid: tree.gen.uuid ?? "",
          genParentUuid: tree.gen.parent_uuid ?? tree.gen.uuid ?? "",
          genType: genType,
        },
      });
      // Chain: bubble → scene[0] → scene[1] → ... placed horizontally
      const isVideoRoot = genType === "video";
      let prevId = nodeId;
      let slideX = tree.x + bubbleWidth + H_GAP;
      const slideY = tree.y;
      for (const child of tree.children) {
        child.x = slideX;
        child.y = slideY;
        flattenTree(child, prevId, true, true, isVideoRoot);
        prevId = `gen-${child.gen.uuid ?? ""}`;
        slideX += NODE_WIDTH + H_GAP;
      }
      return;
    }

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
        genType: genType,
        prompt: tree.gen.prompt ?? "",
        copy: parseCopy(tree.gen.copy || (tree.gen as any).content),
        hidePromptBubble: hidePromptBubble || !parentNodeId,
        isVideoScene,
      },
    });
    if (parentNodeId) {
      edges.push({
        id: `edge-${parentNodeId}-${nodeId}`,
        source: parentNodeId,
        target: nodeId,
        sourceHandle: parentIsBubble ? "right" : (alignment === "vertical" ? "right" : "bottom"),
        targetHandle: parentIsBubble ? "left" : (alignment === "vertical" ? "left" : "top"),
        type: "imageEdge",
      });
    }
    for (const child of tree.children) {
      flattenTree(child, nodeId);
    }
  }

  for (const tree of trees) {
    flattenTree(tree);
  }

  // Add standalone prompt bubble nodes on the LEFT of each non-carousel/non-video root image
  for (const root of roots) {
    const rootGenType = root.gen_type || (root as any).type;
    if (
      rootGenType === "carousel" ||
      (rootGenType === "video" && !root.img_url?.startsWith("http"))
    ) continue;
    const imgNodeId = `gen-${root.uuid ?? ""}`;
    const imgNode = nodes.find((n) => n.id === imgNodeId);
    if (!imgNode) continue;
    const bubbleNodeId = `bubble-root-${root.uuid ?? ""}`;
    if (nodes.find((n) => n.id === bubbleNodeId)) continue;
    nodes.push({
      id: bubbleNodeId,
      type: "promptBubble",
      position: {
        x: imgNode.position.x - BUBBLE_NODE_WIDTH - H_GAP,
        y: imgNode.position.y + NODE_HEIGHT / 2 - 30,
      },
      data: {
        prompt: root.prompt || userPrompt || "",
        genUuid: root.uuid ?? "",
      },
    });
    edges.push({
      id: `edge-${bubbleNodeId}-${imgNodeId}`,
      source: bubbleNodeId,
      target: imgNodeId,
      sourceHandle: "right",
      targetHandle: "left",
      type: "imageEdge",
    });
  }

  // Copy nodes — one per root generation that has copy text, plus edit chain
  const allCopyGens = generations.filter((g) => g.gen_type === "copy" || g.gen_type === "edit_copy");

  function addCopyEdits(parentUuid: string, parentNodeId: string, baseX: number, baseY: number, depth: number) {
    const children = allCopyGens.filter((g) => g.parent_uuid === parentUuid);
    for (const child of children) {
      const childNodeId = `copy-${child.uuid ?? ""}`;
      const isPending = child.status === "pending" || child.status === "processing";
      nodes.push({
        id: childNodeId,
        type: isPending ? "copySkeletonCard" : "copyCard",
        position: {
          x: baseX + (depth + 1) * (NODE_WIDTH + H_GAP),
          y: baseY,
        },
        data: {
          copy: parseCopy(child.copy ?? ""),
          genUuid: child.uuid ?? "",
          prompt: child.prompt || copyEditPrompts[child.parent_uuid ?? ""] || "",
        },
      });
      edges.push({
        id: `edge-${parentNodeId}-${childNodeId}`,
        source: parentNodeId,
        target: childNodeId,
        targetHandle: "left",
        type: "copyEdge",
      });
      addCopyEdits(child.uuid ?? "", childNodeId, baseX, baseY, depth + 1);
    }
  }

  for (let i = 0; i < roots.length; i++) {
    const root = roots[i];

    let rootCopyRaw = root.copy || "";
    // For carousels, root.copy is often a list of slide UUIDs — fall back to content.
    if (isIdList(rootCopyRaw.trim())) {
      rootCopyRaw = (root as any).content || "";
    }
    
    // The copy may be stored directly on the image generation (root.copy) or as a
    // separate gen_type="copy" generation whose parent_uuid points to this image.
    // If rootCopyRaw exists, root.copy is the original. Otherwise, the first child is the original.
    const rootCopyGen = !rootCopyRaw ? allCopyGens.find((g) => g.parent_uuid === (root.uuid ?? "")) : undefined;
    
    const rawCopyValue = rootCopyRaw || rootCopyGen?.copy || postCopy || "";
    const copyText = parseCopy(rawCopyValue);
    
    if (!copyText && !allCopyGens.some(g => g.parent_uuid === (root.uuid ?? ""))) continue;

    const imgNodeId = `gen-${root.uuid ?? ""}`;
    const imgNode = nodes.find((n) => n.id === imgNodeId);
    if (!imgNode) continue;

    // Avoid duplicate copy nodes for the same root
    const copyGenUuid = rootCopyGen?.uuid ?? root.uuid ?? "";
    const copyNodeId = `copy-${copyGenUuid}`;
    if (nodes.find(n => n.id === copyNodeId)) continue;
    const copyY = imgNode.position.y + NODE_HEIGHT + V_GAP;
    nodes.push({
      id: copyNodeId,
      type: "copyCard",
      position: { x: imgNode.position.x, y: copyY },
      data: {
        copy: copyText,
        genUuid: copyGenUuid,
        // Initial copy: prompt bubble shown separately on the left
        prompt: "",
        hidePromptBubble: true,
      },
    });
    // Connect bubble → copy (instead of image → copy)
    // For carousel/video roots the bubble node id is `gen-${uuid}`; for regular roots it is `bubble-root-${uuid}`
    const rootGenTypeForCopy = root.gen_type || (root as any).type;
    const isCarouselOrVideo =
      rootGenTypeForCopy === "carousel" ||
      (rootGenTypeForCopy === "video" && !root.img_url?.startsWith("http"));
    const bubbleNodeId = isCarouselOrVideo
      ? `gen-${root.uuid ?? ""}`
      : `bubble-root-${root.uuid ?? ""}`;
    edges.push({
      id: `edge-${bubbleNodeId}-${copyNodeId}`,
      source: bubbleNodeId,
      target: copyNodeId,
      sourceHandle: isCarouselOrVideo ? "bottom" : "right",
      targetHandle: "left",
      type: "copyEdge",
    });
    addCopyEdits(copyGenUuid, copyNodeId, imgNode.position.x, copyY, 0);
  }

  // Pending copy edit skeletons — show while waiting for the API to return the new generation
  for (const [parentUuid, editInfo] of Object.entries(pendingCopyEdits)) {
    const alreadyInApi = allCopyGens.some((g) => g.parent_uuid === parentUuid);
    if (alreadyInApi) continue;
    const parentNodeId = `copy-${parentUuid}`;
    const parentNode = nodes.find((n) => n.id === parentNodeId);
    if (!parentNode) continue;
    const skeletonId = `pending-copy-skeleton-${parentUuid}`;
    if (nodes.find((n) => n.id === skeletonId)) continue;
    nodes.push({
      id: skeletonId,
      type: "copySkeletonCard",
      position: {
        x: parentNode.position.x + NODE_WIDTH + H_GAP,
        y: parentNode.position.y,
      },
      data: { prompt: editInfo.prompt, currentCopy: editInfo.copyText },
    });
    edges.push({
      id: `edge-${parentNodeId}-${skeletonId}`,
      source: parentNodeId,
      target: skeletonId,
      type: "copyEdge",
    });
  }

  // Skeleton to the right of selected node — only when a generation is genuinely pending
  // Only show skeleton for edit operations (parent_uuid set), not initial generation
  const hasPendingGen =
    isProcessing &&
    generations.some(
      (g) =>
        g.gen_type !== "copy" &&
        g.gen_type !== "carousel" &&
        g.gen_type !== "video" &&
        !g.img_url?.startsWith("http") &&
        !!g.parent_uuid,
    );
  if (hasPendingGen && nodes.length > 0) {
    const targetNodeId = selectedGenUuid
      ? `gen-${selectedGenUuid}`
      : nodes[nodes.length - 1].id;
    const targetNode =
      nodes.find((n) => n.id === targetNodeId) || nodes[nodes.length - 1];
    const skeletonId = "skeleton-node";
    nodes.push({
      id: skeletonId,
      type: "skeleton",
      position: {
        x: targetNode.position.x + NODE_WIDTH + H_GAP,
        y: targetNode.position.y,
      },
      data: { label: "Creating magic...", prompt: userPrompt ?? "" },
    });
    edges.push({
      id: `edge-${targetNode.id}-${skeletonId}`,
      source: targetNode.id,
      target: skeletonId,
      sourceHandle: "right",
      type: "imageEdge",
    });
  }

  return { nodes, edges };
}

const ResultNode = ({ data, id, xPos, yPos }: NodeProps) => {
  const { uuid: creationUuid } = useParams<{ uuid: string }>();
  const { mutate: editImage, isPending: isImagePending } = useEditImage();
  const { mutate: editVideoScene, isPending: isVideoScenePending } = useEditVideoScene();
  const isPending = isImagePending || isVideoScenePending;
  const queryClient = useQueryClient();
  const { addNodes, addEdges } = useReactFlow();
  const selectedGeneration = useFlowStore((s) => s.selectedGeneration);
  const setSelectedGeneration = useFlowStore((s) => s.setSelectedGeneration);
  const isVideoScene = !!(data.isVideoScene as boolean);

  const handleEdit = (prompt: string) => {
    if (!creationUuid) return;

    const skeletonId = `edit-skeleton-${data.genUuid}-${Date.now()}`;
    addNodes({
      id: skeletonId,
      type: "skeleton",
      position: { x: xPos + NODE_WIDTH + H_GAP, y: yPos },
      data: { label: "Creating magic...", prompt },
    });
    addEdges({
      id: `edge-${id}-${skeletonId}`,
      source: id,
      target: skeletonId,
      sourceHandle: "right",
      type: "imageEdge",
    });

    const onSuccess = () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.creation_studio.get_image(creationUuid),
      });
    };

    if (isVideoScene) {
      editVideoScene(
        {
          creation_uuid: creationUuid,
          parent: data.genUuid as string,
          prompt,
          scene_duration: 6,
        },
        { onSuccess },
      );
    } else {
      if (!data.genImgUrl) return;
      editImage(
        {
          uuid: data.genUuid,
          parent_uuid: data.genParentUuid || data.genUuid,
          creation_uuid: creationUuid,
          img_url: data.genImgUrl,
          prompt,
        },
        { onSuccess },
      );
    }
  };

  return (
    <div style={{ width: 380 }}>
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0, width: 1, height: 1 }} />

      <CreatedImageCard
        image={data.image || (data.genType === "carousel" || data.genType === "video" ? "" : sampleImage)}
        onEditSubmit={handleEdit}
        isEditPending={isPending}
        variant="image"
        isSelected={selectedGeneration?.uuid === data.genUuid}
        onSelect={() => {
          setSelectedGeneration({
            uuid: data.genUuid as string,
            parent_uuid: data.genParentUuid as string,
            img_url: data.genImgUrl as string,
            label: data.genLabel as string,
          });
        }}
        genType={data.genType as string}
        prompt={data.prompt as string}
        hidePromptBubble={data.hidePromptBubble as boolean}
      />
    </div>
  );
};

const avatarUrl = `https://ui-avatars.com/api/?name=U&background=random`;

function PromptBubble({ prompt }: { prompt: string }) {
  if (!prompt) return null;
  return (
    <div className="w-full flex items-start gap-2.5 mt-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800">
        <img src={avatarUrl} alt="U" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="relative max-w-[85%] bg-white dark:bg-[#1C1C1F] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-lg">
        <div className="absolute -top-[5px] left-3.5 w-2.5 h-2.5 bg-white dark:bg-[#1C1C1F] border-l border-t border-black/[0.06] dark:border-white/[0.06] rotate-45" />
        <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-relaxed font-medium line-clamp-3">
          {prompt}
        </p>
      </div>
    </div>
  );
}

const CopySkeletonNode = ({ data }: NodeProps) => {
  const currentCopy = (data.currentCopy as string) ?? "";
  const SKELETON_COPY_PREVIEW = 220;
  const displayCopy = currentCopy.length > SKELETON_COPY_PREVIEW
    ? currentCopy.slice(0, SKELETON_COPY_PREVIEW) + "…"
    : currentCopy;

  return (
    <div style={{ width: 380, animation: "skeletonEnter 0.4s cubic-bezier(0.2, 0, 0, 1) forwards" }}>
      <style>{`
        @keyframes skeletonEnter {
          from { opacity: 0; transform: translateX(20px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
      `}</style>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1 }} />
      <div className="bg-white dark:bg-[#18181B] rounded-[1.5rem] border border-dashed border-[#D946EF]/30 dark:border-[#D946EF]/20 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#D946EF]/10 animate-pulse" />
            <div className="w-28 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </div>
          <div className="w-14 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
        {/* Body — show previous copy blurred, or fallback to skeleton bars */}
        <div className="px-5 py-4 relative">
          {currentCopy ? (
            <>
              <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-[1.7] whitespace-pre-line opacity-25 blur-[3px] select-none pointer-events-none">
                {displayCopy}
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                  <Loader className="w-3.5 h-3.5 text-[#D946EF] animate-spin" />
                  <span className="text-xs font-medium text-[#D946EF]">Rewriting…</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="w-5/6 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="w-4/6 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse mt-2" />
              <div className="w-3/4 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          )}
        </div>
      </div>
      <PromptBubble prompt={(data.prompt as string) ?? ""} />
    </div>
  );
};

const SkeletonNode = ({ data }: NodeProps) => (
  <div className="flex flex-col items-center" style={{ width: 380, animation: "skeletonEnter 0.4s cubic-bezier(0.2, 0, 0, 1) forwards" }}>
    <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1 }} />
    <div className="w-full h-[475px] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
      <div className="text-slate-400 font-medium">Creating magic...</div>
    </div>
    <div className="mt-3">
      <span className="text-xs font-medium text-muted-foreground bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline-variant/20 animate-pulse">
        Processing...
      </span>
    </div>
    <PromptBubble prompt={(data.prompt as string) ?? ""} />
  </div>
);

const WaitingNodeComponent = ({ data }: NodeProps) => (
  <WaitingCard title={data?.title} description={data?.description} />
);

const PromptBubbleNodeComponent = ({ data }: NodeProps) => (
  <div style={{ width: 260 }}>
    <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0, width: 1, height: 1 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0, width: 1, height: 1 }} />
    <div className="flex items-start gap-2.5">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800">
        <img src={avatarUrl} alt="U" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="relative bg-white dark:bg-[#1C1C1F] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-lg">
        <div className="absolute -top-[5px] left-3.5 w-2.5 h-2.5 bg-white dark:bg-[#1C1C1F] border-l border-t border-black/[0.06] dark:border-white/[0.06] rotate-45" />
        <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-relaxed font-medium line-clamp-4">
          {(data.prompt as string) || ""}
        </p>
      </div>
    </div>
  </div>
);

const COPY_PREVIEW_LENGTH = 220;

const CopyNode = ({ data }: NodeProps) => {
  const { uuid: creationUuid } = useParams<{ uuid: string }>();
  const queryClient = useQueryClient();
  const { mutate: editCopy, isPending } = useEditCopy();
  const [feedback, setFeedback] = useState("");
  const [showEditInput, setShowEditInput] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(crypto.randomUUID()).current;

  const {
    userPrompt: userPromptFromStore,
    postCopy,
    setPostCopy,
    setCopyEditPrompt,
    addPendingCopyEdit,
    removePendingCopyEdit,
    focusedCardId,
    setFocusedCardId,
  } = useFlowStore();

  const copy = (data.copy as string) ?? "";
  const prompt = (data.prompt as string) || userPromptFromStore || "";
  const isLong = copy.length > COPY_PREVIEW_LENGTH;
  const isBlurred = focusedCardId !== null && focusedCardId !== componentId;

  useEffect(() => {
    if (showEditInput) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showEditInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowEditInput(false);
        setFocusedCardId(null);
      }
    }
    function handleCloseOthers(event: Event) {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.id !== componentId) {
        setShowEditInput(false);
        setFocusedCardId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("closeOtherImageTools", handleCloseOthers);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("closeOtherImageTools", handleCloseOthers);
    };
  }, [componentId, setFocusedCardId]);

  const handleSubmit = () => {
    if (!creationUuid || !feedback.trim()) return;

    const parentUuid = data.genUuid as string;

    // Add a pending skeleton via the store so it's part of computedNodes
    // and survives any subsequent useMemo recomputes.
    addPendingCopyEdit(parentUuid, { copyText: copy, prompt: feedback });

    // Cache the feedback so the resulting node can display it even if the
    // backend doesn't return `prompt` on edit_copy generations.
    setCopyEditPrompt(parentUuid, feedback);

    editCopy(
      {
        creation_uuid: creationUuid,
        parent: parentUuid,
        current_copy: copy,
        copy_feedback: feedback,
      },
      {
        onSuccess: () => {
          setFeedback("");
          setShowEditInput(false);
          setFocusedCardId(null);
          queryClient.invalidateQueries({
            queryKey: queryKeys.creation_studio.get_image(creationUuid),
          });
          // Remove the pending skeleton once the API has accepted the request.
          // The real node (skeleton or card) will come from the refetched data.
          removePendingCopyEdit(parentUuid);
        },
      },
    );
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    const opening = !showEditInput;
    if (opening) {
      window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
      setFocusedCardId(componentId);
      // Auto-select for preview when opening edit tools
      setPostCopy(copy);
    } else {
      setFocusedCardId(null);
    }
    setShowEditInput(opening);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: 380 }}
      className={cn(
        "transition-all duration-300 ease-out",
        isBlurred ? "opacity-40 scale-[0.97] saturate-50" : "opacity-100 scale-100 saturate-100",
      )}
    >
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 1, height: 1 }} />
      {/* Sliding edit input at top — same pattern as CreatedImageCard */}
      <div
        className={cn(
          "w-full bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-[1.25rem] shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden",
          showEditInput
            ? "opacity-100 max-h-20 mb-3 pointer-events-auto"
            : "opacity-0 max-h-0 mb-0 pointer-events-none border-transparent",
        )}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && feedback.trim()) {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") {
                setShowEditInput(false);
                setFeedback("");
              }
            }}
            placeholder="Edit instructions..."
            disabled={isPending}
            className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm font-medium disabled:opacity-50 min-w-0 px-2"
          />
          <button
            onClick={handleSubmit}
            disabled={!feedback.trim() || isPending}
            className={cn(
              "flex-shrink-0 rounded-full p-2 transition-all flex items-center justify-center",
              feedback.trim() && !isPending
                ? "bg-[#D946EF] text-white hover:bg-[#D946EF]/90"
                : "bg-neutral-200 dark:bg-neutral-700/50 text-neutral-400",
            )}
          >
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Card */}
      <div 
        className={cn(
          "bg-white dark:bg-[#18181B] rounded-[1.5rem] border shadow-xl overflow-hidden transition-all duration-300 cursor-pointer",
          "border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#D946EF]/15 to-[#D946EF]/5 dark:from-[#D946EF]/20 dark:to-[#D946EF]/5">
              <Sparkles className="w-3.5 h-3.5 text-[#D946EF]" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Generated Copy
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyText();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Copy text — click to open edit input */}
        <div className="px-5 py-4 cursor-pointer" onClick={handleCardClick}>
          <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-[1.7] whitespace-pre-line">
            {isLong && !expanded ? copy.slice(0, COPY_PREVIEW_LENGTH) + "…" : copy}
          </p>
          {isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="mt-1 text-[12px] font-medium text-[#D946EF] hover:text-[#D946EF]/80 transition-colors"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Select bar — same as CreatedImageCard */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showEditInput ? "max-h-14 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-black/[0.04] dark:border-white/[0.04] bg-neutral-50/50 dark:bg-white/[0.02]">
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Use in final preview</span>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setPostCopy(copy);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors",
                postCopy === copy
                  ? "bg-[#D946EF]/10 text-[#D946EF]"
                  : "text-neutral-400 hover:text-[#D946EF] hover:bg-[#D946EF]/[0.06]"
              )}
            >
              {postCopy === copy ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              <span>{postCopy === copy ? "Selected" : "Select"}</span>
            </button>
          </div>
        </div>
      </div>

      {!(data.hidePromptBubble as boolean) && <PromptBubble prompt={prompt} />}
    </div>
  );
};

const edgeTypes: EdgeTypes = {
  imageEdge: ImageEdge,
  copyEdge: CopyEdge,
};

/**
 * Create a stable fingerprint from generations data.
 * Includes edit_copy generations and their status so computedNodes
 * updates whenever an edit arrives or transitions to done.
 */
function generationsFingerprint(generations: GenerationStore[]): string {
  return generations
    .filter(
      (g) =>
        !!g.img_url ||
        g.gen_type === "copy" ||
        g.gen_type === "edit_copy" ||
        g.gen_type === "edit_video_scene",
    )
    .map((g) => `${g.uuid}:${g.img_url ?? ""}:${g.copy ?? ""}:${g.status ?? ""}`)
    .sort()
    .join("|");
}

const WorkflowContentInner = ({
  showPreview,
  setShowPreview,
}: {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
}) => {
  const { uuid } = useParams<{ uuid: string }>();
  const prevFingerprintRef = useRef("");
  const setSelectedGeneration = useFlowStore((s) => s.setSelectedGeneration);
  const selectedGeneration = useFlowStore((s) => s.selectedGeneration);
  const postCopy = useFlowStore((s) => s.postCopy);
  const setPostCopy = useFlowStore((s) => s.setPostCopy);
  const userPrompt = useFlowStore((s) => s.userPrompt);
  const copyEditPrompts = useFlowStore((s) => s.copyEditPrompts);
  const pendingCopyEdits = useFlowStore((s) => s.pendingCopyEdits);
  const resetFlow = useFlowStore((s) => s.resetFlow);

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    return () => resetFlow();
  }, [resetFlow]);

  // Subscribe to creation status
  const { isProcessing, isDone, hasSubscriptionError, subscriptionError } =
    useCreationStatus(uuid ?? "");

  // Subscribe to generations subcollection
  const { generations, hasImage, type } = useGenerationStatus(uuid ?? "");
  const isCarousel = type === "carousel";
  const isVideo = type === "video" || type === "reel";

  // On refresh, postCopy is lost from Zustand — restore it from the API data
  useEffect(() => {
    if (!postCopy && generations.length > 0) {
      const copyFromApi =
        generations.find((g) => g.gen_type === "copy")?.copy ||
        generations[0]?.copy;
      if (copyFromApi) setPostCopy(copyFromApi);
    }
  }, [postCopy, generations, setPostCopy]);

  const [alignment, setAlignment] = useState<"horizontal" | "vertical">(
    "vertical",
  );

  useEffect(() => {
    if (isCarousel || isVideo) {
      setAlignment("horizontal");
    }
  }, [isCarousel]);

  // Derive a stable fingerprint
  const fingerprint = useMemo(
    () => generationsFingerprint(generations),
    [generations],
  );

  // Local draggable state — ReactFlow owns positions after initial layout
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const lastAlignmentRef = useRef(alignment);

  // Compute the canonical layout whenever data changes
  const { computedNodes, computedEdges } = useMemo(() => {
    if (hasSubscriptionError) {
      return {
        computedNodes: [
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
        computedEdges: [] as Edge[],
      };
    }

    if (!hasImage && isProcessing) {
      return {
        computedNodes: [
          {
            id: "skeleton-node",
            type: "skeleton" as const,
            position: { x: START_X, y: START_Y },
            data: { label: isDone ? "Finalizing..." : "Creating magic..." },
          },
          {
            id: "copy-skeleton-initial",
            type: "copySkeletonCard" as const,
            position: { x: START_X, y: START_Y + NODE_HEIGHT + V_GAP },
            data: { currentCopy: postCopy ?? "" },
          },
        ] as Node[],
        computedEdges: [] as Edge[],
      };
    }

    const { nodes: built, edges: builtEdges } = buildFlowFromGenerations(
      generations,
      isProcessing,
      isDone,
      selectedGeneration?.uuid,
      alignment,
      postCopy,
      userPrompt,
      copyEditPrompts,
      pendingCopyEdits,
    );

    return {
      computedNodes:
        built.length > 0
          ? built
          : ([
              {
                id: "skeleton-node",
                type: "skeleton" as const,
                position: { x: 200, y: START_Y },
                data: { label: "Waiting for data..." },
              },
            ] as Node[]),
      computedEdges: builtEdges,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fingerprint,
    isProcessing,
    isDone,
    hasImage,
    hasSubscriptionError,
    alignment,
    postCopy,
    userPrompt,
    copyEditPrompts,
    pendingCopyEdits,
  ]);

  // Sync computed layout → local state.
  // When alignment changes, we force positions to the new layout.
  // Otherwise, we preserve user-dragged positions for existing nodes.
  useEffect(() => {
    const alignmentChanged = lastAlignmentRef.current !== alignment;
    lastAlignmentRef.current = alignment;

    setNodes((prev) => {
      const posMap = new Map(prev.map((n) => [n.id, n.position]));
      return computedNodes.map((n) => ({
        ...n,
        position: alignmentChanged
          ? n.position
          : (posMap.get(n.id) ?? n.position),
      }));
    });
    setEdges(computedEdges);

    if (alignmentChanged) {
      setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedNodes, computedEdges, alignment, fitView]);

  // Auto-select the latest generation when a new result node arrives
  useEffect(() => {
    if (fingerprint !== prevFingerprintRef.current && fingerprint !== "") {
      prevFingerprintRef.current = fingerprint;

      const resultNodes = computedNodes.filter((n) => n.type === "result");
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
  }, [fingerprint, computedNodes, setSelectedGeneration]);

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
      } else if (node.type === "copyCard" && node.data) {
        if (node.data.copy) {
          setPostCopy(node.data.copy as string);
        }
      }
    },
    [setSelectedGeneration, setPostCopy],
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      result: ResultNode,
      skeleton: SkeletonNode,
      waiting: WaitingNodeComponent,
      copyCard: CopyNode,
      copySkeletonCard: CopySkeletonNode,
      promptBubble: PromptBubbleNodeComponent,
    }),
    [],
  );

  const onInit = useCallback((reactFlowInstance: any) => {
    reactFlowInstance.fitView({ padding: 0.3, maxZoom: 1 });
  }, []);

  const onPaneClick = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("closeOtherImageTools", { detail: { id: null } }),
    );
  }, []);

  const resetLayout = useCallback(() => {
    setNodes(computedNodes.map((n) => ({ ...n })));
    setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
  }, [computedNodes, setNodes, fitView]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={onInit}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
          panOnDrag={true}
          selectionOnDrag={false}
        >
          <Panel position="bottom-center" className="mb-8">
            <div className="flex items-center bg-surface-container-high/80 dark:bg-[#1C1C1C] backdrop-blur-xl border border-outline-variant/30 dark:border-outline/20 rounded-full p-1.5 shadow-lg gap-1">
              <button
                type="button"
                onClick={() => zoomIn()}
                className="p-2 rounded-full hover:bg-on-surface/5 text-on-surface-variant transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                className="p-2 rounded-full hover:bg-on-surface/5 text-on-surface-variant transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fitView({ padding: 0.3, duration: 300 })}
                className="p-2 rounded-full hover:bg-on-surface/5 text-on-surface-variant transition-colors"
                title="Fit View"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={resetLayout}
                className="p-2 rounded-full hover:bg-on-surface/5 text-on-surface-variant transition-colors"
                title="Reset Layout"
              >
                <Brush className="w-4 h-4" />
              </button>

              {isCarousel && (
                <>
                  <div className="w-px h-4 bg-outline-variant/30 mx-1" />
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("openAllEditInputs"))
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Edit All Slides"
                  >
                    <Rows3 className="w-3.5 h-3.5" />
                    Edit All
                  </button>
                  <div className="w-px h-4 bg-outline-variant/30 mx-1" />
                  <button
                    type="button"
                    onClick={() => setAlignment("horizontal")}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      alignment === "horizontal"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-on-surface/5 text-on-surface-variant",
                    )}
                    title="Align Horizontal"
                  >
                    <LayoutPanelLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment("vertical")}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      alignment === "vertical"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-on-surface/5 text-on-surface-variant",
                    )}
                    title="Align Vertical"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowContentPage = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="w-full h-full flex">
      <CreationsHistorySidebar />
      <div className="flex-1 h-full relative">
        <ReactFlowProvider>
          <WorkflowContentInner
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />
        </ReactFlowProvider>

        <AnimatePresence>
          {!showPreview && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              onClick={() => setShowPreview(true)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-surface-container-high/80 dark:bg-[#1C1C1C] backdrop-blur-xl border border-outline-variant/30 rounded-xl shadow-lg text-on-surface hover:bg-surface-container-highest transition-colors group"
              title="Open Social Preview"
            >
              <Smartphone className="w-5 h-5 text-on-surface-variant group-hover:text-on-surface transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-full z-20"
          >
            <SocialPreviewAside onClose={() => setShowPreview(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowContentPage;
