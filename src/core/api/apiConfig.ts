import axios from "axios";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

export const API_CONFIG = {
  BASE_URLS: {
    WEBHOOKS: normalizeBaseUrl(
      import.meta.env.VITE_N8N_BASE_URL ||
        "https://n8n.sofiatechnology.ai/webhook",
    ),
    DJANGO: normalizeBaseUrl(
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    ),
  },
  ENDPOINTS: {
    CREATION_STUDIO: {
      generations: "/api/generations/",
      creations: "/api/creations/",
      creationDetail: (uuid: string) => `/api/creations/${uuid}/`,
      creationGenerations: (uuid: string) => `/api/creations/${uuid}/generations/`,
      generationDetail: (uuid: string) => `/api/generations/${uuid}/`,
    },
    BRAND_EXTRACTOR: {
      brandExtractor: "/api/extract/",
    },
    BRANDS: {
      list: "/api/brands/",
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

const attachAuthToken = (client: typeof DJANGO_CLIENT) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

attachAuthToken(DJANGO_CLIENT);
attachAuthToken(API_CLIENT);

// Auto token refresh on 401
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

DJANGO_CLIENT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(DJANGO_CLIENT(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post("/sia-api/api/auth/login/", {
          email: "lovakush81@gmail.com",
          password: "lovaofi@123",
        });

        const newToken = data.data.access_token;
        const newRefresh = data.data.refresh_token;
        localStorage.setItem("token", newToken);
        if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        DJANGO_CLIENT.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return DJANGO_CLIENT(originalRequest);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Request/response logging for DJANGO_CLIENT (development only)
if (import.meta.env.DEV) {
  DJANGO_CLIENT.interceptors.request.use((config) => {
    console.log(
      `📤 Django Request: ${config.method?.toUpperCase()} ${config.url}`,
      { data: config.data },
    );
    return config;
  });

  DJANGO_CLIENT.interceptors.response.use(
    (response) => {
      console.log(`📥 Django Response: ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error(`❌ Django Error (${error.response?.status}):`, {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        sentPayload: error.config?.data,
        errorResponse: error.response?.data,
      });
      return Promise.reject(error);
    },
  );
}

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
