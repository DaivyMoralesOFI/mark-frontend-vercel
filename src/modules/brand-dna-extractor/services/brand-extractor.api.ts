import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "https://n8n.sofiatechnology.ai/webhook";

const apiDevClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30s for slower connections
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const brandExtractorWorkFlow = async (target_url: string) => {
  try {
    const response = await apiDevClient.post(
      `${API_BASE_URL}/extract-brand-dna`,
      { target_url }
    );

    return response;
  } catch (error) {
    console.log({ error });

    throw error;
  }
};
