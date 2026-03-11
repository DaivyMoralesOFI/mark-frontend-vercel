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

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  brandData: BrandExtractor | null;
  userPrompt: string;
  postCopy: string;
  copyVersions: string[];
  lastCreationPayload: CreateImage | null;
  focusedCardId: string | null;
  selectedImageUuid: string | null;
  selectedCopyIndex: number | null;
  isLoading: boolean;
  error: string | null;
  setFocusedCardId: (id: string | null) => void;
  setSelectedImageUuid: (uuid: string | null) => void;
  setSelectedCopyIndex: (index: number | null) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setBrandData: (data: BrandExtractor | null) => void;
  setUserPrompt: (prompt: string) => void;
  setPostCopy: (copy: string) => void;
  addCopyVersion: (copy: string) => void;
  setLastCreationPayload: (payload: CreateImage | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // Canvas interactions
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
  lastCreationPayload: null,
  focusedCardId: null,
  selectedImageUuid: null,
  selectedCopyIndex: null,
  isLoading: false,
  error: null,
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
  setLastCreationPayload: (lastCreationPayload) => set({ lastCreationPayload }),
  setFocusedCardId: (focusedCardId) => set({ focusedCardId }),
  setSelectedImageUuid: (selectedImageUuid) => set({ selectedImageUuid }),
  setSelectedCopyIndex: (selectedCopyIndex) => set({ selectedCopyIndex }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
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
    }),
}));
