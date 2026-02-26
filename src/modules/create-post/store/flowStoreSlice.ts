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

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  brandData: BrandExtractor | null;
  isLoading: boolean;
  error: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setBrandData: (data: BrandExtractor | null) => void;
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
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetFlow: () =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
      brandData: null,
      isLoading: false,
      error: null,
    }),
}));
