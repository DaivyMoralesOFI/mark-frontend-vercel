import { ApiErrorType } from "@/core/enum/api-error.enum";
import {
  BackendError,
  ValidationError,
} from "@/core/schemas/ApiErrorsSchema";
import { AxiosError } from "axios";

export interface ApiError {
  type: ApiErrorType;
  message: string;
  userMessage: string;
  statusCode?: number;
  details?: BackendError | ValidationError | unknown;
  originalError?: AxiosError;
}

export interface ApiErrorHandlerConfig {
  onError?: (error: ApiError) => void;
  logErrors?: boolean;
  customMessages?: Partial<Record<ApiErrorType, string>>;
}
