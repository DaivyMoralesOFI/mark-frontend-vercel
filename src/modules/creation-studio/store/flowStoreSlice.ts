import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { BrandExtractor } from "../schemas/BrandSchema";
import { CreateImage } from "../schemas/CreateImage";

export type SelectedGeneration = {
  uuid: string;
  parent_uuid: string;
  img_url: string;
  label: string;
} | null;

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  brandData: BrandExtractor | null;
  userPrompt: string;
  postCopy: string;
  copyVersions: string[];
  copyEditPrompts: Record<string, string>;
  lastCreationPayload: CreateImage | null;
  focusedCardId: string | null;
  selectedImageUuid: string | null;
  selectedCopyIndex: number | null;
  isLoading: boolean;
  error: string | null;
  setFocusedCardId: (id: string | null) => void;
  setSelectedImageUuid: (uuid: string | null) => void;
  setSelectedCopyIndex: (index: number | null) => void;
  selectedGeneration: SelectedGeneration;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setBrandData: (data: BrandExtractor | null) => void;
  setUserPrompt: (prompt: string) => void;
  setPostCopy: (copy: string) => void;
  addCopyVersion: (copy: string) => void;
  setCopyEditPrompt: (parentGenUuid: string, prompt: string) => void;
  setLastCreationPayload: (payload: CreateImage | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedGeneration: (gen: SelectedGeneration) => void;
  resetFlow: () => void;
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  brandData: null,
  userPrompt: "",
  postCopy: "",
  copyVersions: [],
  copyEditPrompts: {},
  lastCreationPayload: null,
  focusedCardId: null,
  selectedImageUuid: null,
  selectedCopyIndex: null,
  isLoading: false,
  error: null,
  selectedGeneration: null,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setBrandData: (brandData) => set({ brandData }),
  setUserPrompt: (userPrompt) => set({ userPrompt }),
  setPostCopy: (postCopy) => set({ postCopy }),
  addCopyVersion: (copy) => set((state) => ({ copyVersions: [...state.copyVersions, copy] })),
  setCopyEditPrompt: (parentGenUuid, prompt) =>
    set((state) => ({ copyEditPrompts: { ...state.copyEditPrompts, [parentGenUuid]: prompt } })),
  setLastCreationPayload: (lastCreationPayload) => set({ lastCreationPayload }),
  setFocusedCardId: (focusedCardId) => set({ focusedCardId }),
  setSelectedImageUuid: (selectedImageUuid) => set({ selectedImageUuid }),
  setSelectedCopyIndex: (selectedCopyIndex) => set({ selectedCopyIndex }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedGeneration: (gen) => set({ selectedGeneration: gen }),
  resetFlow: () =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
      brandData: null,
      copyVersions: [],
      selectedImageUuid: null,
      selectedCopyIndex: null,
      // userPrompt is intentionally preserved across navigation
      isLoading: false,
      error: null,
      selectedGeneration: null,
    }),
}));
