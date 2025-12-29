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
