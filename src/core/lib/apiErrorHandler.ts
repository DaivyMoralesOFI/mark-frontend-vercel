import { AxiosError, AxiosInstance } from "axios";
import { ApiErrorType } from "@/core/enum/api-error.enum";
import { ApiError, ApiErrorHandlerConfig } from "@/core/type/ApiErrors.type";
import {
  BackendError,
  BackendErrorSchema,
  ValidationError,
  ValidationErrorSchema,
} from "@/core/schemas/ApiErrorsSchema";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Clock,
  FileQuestion,
  LucideIcon,
  ServerCrash,
  ShieldAlert,
  WifiOff,
} from "lucide-react";

function parseBackendError(
  data: unknown,
): BackendError | ValidationError | unknown {
  // Intenta parsear como error de validación primero
  const validationResult = ValidationErrorSchema.safeParse(data);
  if (validationResult.success) {
    return validationResult.data;
  }

  // Si no, intenta como error genérico del backend
  const backendResult = BackendErrorSchema.safeParse(data);
  if (backendResult.success) {
    return backendResult.data;
  }

  // Si no matchea ningún schema, retorna el data crudo
  return data;
}

function classifyError(error: AxiosError): ApiErrorType {
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return ApiErrorType.TIMEOUT;
    }
    return ApiErrorType.NETWORK_ERROR;
  }

  const status = error.response.status;

  if (status === 401) return ApiErrorType.UNAUTHORIZED;
  if (status === 403) return ApiErrorType.FORBIDDEN;
  if (status === 404) return ApiErrorType.NOT_FOUND;
  if (status === 400 || status === 422) return ApiErrorType.VALIDATION_ERROR;
  if (status >= 500) return ApiErrorType.SERVER_ERROR;

  return ApiErrorType.UNKNOWN;
}

function transformError(
  error: AxiosError,
  customMessages?: Partial<Record<ApiErrorType, string>>,
): ApiError {
  const type = classifyError(error);

  // Parsear y validar la respuesta del backend con Zod
  const parsedDetails = error.response?.data
    ? parseBackendError(error.response.data)
    : undefined;

  const userMessage = getUserFriendlyMessage(
    type,
    parsedDetails,
    customMessages,
  );

  return {
    type,
    message: error.message,
    userMessage,
    statusCode: error.response?.status,
    details: parsedDetails,
    originalError: error,
  };
}
export function setupApiErrorHandler(
  axiosInstance: AxiosInstance,
  config?: ApiErrorHandlerConfig,
): void {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError = transformError(error, config?.customMessages);

      if (config?.logErrors) {
        console.error("[API Error]", {
          type: apiError.type,
          message: apiError.userMessage,
          statusCode: apiError.statusCode,
          details: apiError.details,
        });
      }

      if (config?.onError) {
        config.onError(apiError);
      }

      return Promise.reject(apiError);
    },
  );
}
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "userMessage" in error
  );
}

export function isValidationError(
  details: unknown,
): details is ValidationError {
  return ValidationErrorSchema.safeParse(details).success;
}

export function isBackendError(details: unknown): details is BackendError {
  return BackendErrorSchema.safeParse(details).success;
}

function extractMessageFromDetails(
  details: BackendError | ValidationError | unknown,
): string | null {
  // Si es un error de validación
  if (details && typeof details === "object" && "detail" in details) {
    const detail = details.detail;

    // Array de errores de validación
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((err) => err.msg).join(", ");
    }

    // String simple
    if (typeof detail === "string") {
      return detail;
    }
  }

  // Si es un BackendError con message o error
  if (details && typeof details === "object") {
    if ("message" in details && typeof details.message === "string") {
      return details.message;
    }
    if ("error" in details && typeof details.error === "string") {
      return details.error;
    }
  }

  return null;
}

function getUserFriendlyMessage(
  type: ApiErrorType,
  details: BackendError | ValidationError | unknown,
  customMessages?: Partial<Record<ApiErrorType, string>>,
): string {
  // Primero intenta extraer mensaje del backend (más específico)
  const backendMessage = extractMessageFromDetails(details);
  if (backendMessage) {
    return backendMessage;
  }

  // Si hay mensaje personalizado, usarlo
  if (customMessages?.[type]) {
    return customMessages[type]!;
  }

  // Mensajes por defecto en español
  const defaultMessages: Record<ApiErrorType, string> = {
    [ApiErrorType.NETWORK_ERROR]:
      "Please check your internet connection and try again",
    [ApiErrorType.UNAUTHORIZED]:
      "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    [ApiErrorType.FORBIDDEN]: "No tienes permisos para realizar esta acción.",
    [ApiErrorType.NOT_FOUND]: "El recurso solicitado no fue encontrado.",
    [ApiErrorType.VALIDATION_ERROR]:
      "Los datos ingresados no son válidos. Por favor, verifica la información.",
    [ApiErrorType.SERVER_ERROR]:
      "Ocurrió un error en el servidor. Intenta nuevamente más tarde.",
    [ApiErrorType.TIMEOUT]:
      "La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.",
    [ApiErrorType.UNKNOWN]:
      "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
  };

  return defaultMessages[type];
}

export const getErrorIcon = (type: ApiErrorType): LucideIcon => {
  switch (type) {
    case ApiErrorType.NETWORK_ERROR:
      return WifiOff;
    case ApiErrorType.TIMEOUT:
      return Clock;
    case ApiErrorType.UNAUTHORIZED:
      return ShieldAlert;
    case ApiErrorType.FORBIDDEN:
      return Ban;
    case ApiErrorType.NOT_FOUND:
      return FileQuestion;
    case ApiErrorType.SERVER_ERROR:
      return ServerCrash;
    case ApiErrorType.VALIDATION_ERROR:
      return AlertCircle;
    case ApiErrorType.UNKNOWN:
    default:
      return AlertTriangle;
  }
};

export const getErrorVariant = (
  type: ApiErrorType,
): "default" | "success" | "info" | "warning" | "error" => {
  switch (type) {
    case ApiErrorType.SERVER_ERROR:
    case ApiErrorType.NETWORK_ERROR:
    case ApiErrorType.TIMEOUT:
    case ApiErrorType.UNKNOWN:
      return "error";
    case ApiErrorType.UNAUTHORIZED:
    case ApiErrorType.FORBIDDEN:
      return "warning";
    case ApiErrorType.VALIDATION_ERROR:
      return "info";
    case ApiErrorType.NOT_FOUND:
      return "default";
  }
};

export const getErrorTitle = (type: ApiErrorType): string => {
  switch (type) {
    case ApiErrorType.NETWORK_ERROR:
      return "This is not usual, but we have a connection problem.";
    case ApiErrorType.TIMEOUT:
      return "We have waited a long time for an answer";
    case ApiErrorType.UNAUTHORIZED:
      return "Hey, you are not authorized to view this content.";
    case ApiErrorType.FORBIDDEN:
      return "You should contact your manager because you have been denied access to this content.";
    case ApiErrorType.NOT_FOUND:
      return "I've tried every way possible to find what you need, but I haven't found it.";
    case ApiErrorType.SERVER_ERROR:
      return "We sincerely apologize, but we're having trouble communicating with our servers.";
    case ApiErrorType.VALIDATION_ERROR:
      return "Please check carefully what you need, because we have not been able to properly validate your request.";
    case ApiErrorType.UNKNOWN:
    default:
      return "This is unexpected, even we don't know what's happening.";
  }
};

export const getDefaultToastDuration = (type: ApiErrorType): number => {
  switch (type) {
    case ApiErrorType.NETWORK_ERROR:
    case ApiErrorType.TIMEOUT:
    case ApiErrorType.SERVER_ERROR:
    case ApiErrorType.UNAUTHORIZED:
      return 6000; // 6 segundos para errores críticos

    case ApiErrorType.VALIDATION_ERROR:
      return 5000; // 5 segundos para validaciones (pueden tener múltiples mensajes)

    case ApiErrorType.NOT_FOUND:
    case ApiErrorType.FORBIDDEN:
    case ApiErrorType.UNKNOWN:
    default:
      return 4000; // 4 segundos por defecto
  }
};
