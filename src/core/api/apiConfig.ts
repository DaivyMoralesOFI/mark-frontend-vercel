import axios from "axios";

export const API_CONFIG = {
  BASE_URLS: {
    WEBHOOKS: "https://n8n.sofiatechnology.ai/webhook",
    DJANGO: "http://127.0.0.1:8000",
  },
  ENDPOINTS: {
    CREATION_STUDIO: {
      createImage: "/api/content/generate/",
      getImageCreated: "/generated-image-v2",
      editImage: "/api/content/edit-image/",
      regenerateCopy: "/api/content/regenerate-copy/",
    },
    BRAND_EXTRACTOR: {
      brandExtractor: "/extract-brand-dna",
    },
  },
  FIREBASE: {
    BRANDS: {
      list: "brands",
      setBrand: "brands",
    },
  },
};

export const DJANGO_CLIENT = axios.create({
  baseURL: API_CONFIG.BASE_URLS.DJANGO,
  timeout: 150000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const API_CLIENT = axios.create({
  baseURL: API_CONFIG.BASE_URLS.WEBHOOKS,
  timeout: 150000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request logging (development only)
if (import.meta.env.DEV) {
  API_CLIENT.interceptors.request.use((config) => {
    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      {
        data: config.data,
      },
    );
    return config;
  });

  API_CLIENT.interceptors.response.use(
    (response) => {
      console.log(`📥 API Response: ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const errorDetails = {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        sentPayload: error.config?.data,
        status: status,
        errorResponse: error.response?.data,
        errorMessage: error.message,
      };

      if (status === 400) {
        console.error("❌ Bad Request (400):", errorDetails);
      } else if (status) {
        console.error(`❌ API Error (${status}):`, errorDetails);
      } else {
        console.error("❌ Network/Unknown Error:", errorDetails);
      }

      return Promise.reject(error);
    },
  );
}
