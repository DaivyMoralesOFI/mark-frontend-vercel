import { z, ZodSchema } from "zod";

/**
 * Resultado de la validación de un schema
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  rawData?: unknown;
}

/**
 * Configuración para la validación de schemas
 */
export interface SchemaValidatorConfig {
  /** Mostrar warnings en consola cuando la validación falla */
  logWarnings?: boolean;
  /** Contexto adicional para los logs (ej: operación, endpoint) */
  context?: Record<string, unknown>;
  /** Lanzar error automáticamente si la validación falla */
  throwOnError?: boolean;
  /** Mensaje de error personalizado */
  errorMessage?: string;
}

/**
 * Valida datos contra un schema de Zod de forma genérica
 *
 * @template T - El tipo inferido del schema de Zod
 * @param schema - El schema de Zod para validar
 * @param data - Los datos a validar
 * @param config - Configuración opcional de validación
 * @returns Resultado de la validación con los datos parseados o errores
 *
 * @example
 * ```typescript
 * // Ejemplo básico
 * const result = validateSchema(JobSchema, apiResponse);
 * if (result.success) {
 *   // Datos tipados y validados
 * }
 *
 * // Con configuración
 * const result = validateSchema(JobsResponseSchema, apiResponse, {
 *   logWarnings: true,
 *   context: { operation: 'getJobsByCompany', slug: 'ofi-services' },
 *   throwOnError: true,
 * });
 * ```
 */
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
  config: SchemaValidatorConfig = {},
): ValidationResult<T> {
  const {
    logWarnings = false,
    context = {},
    throwOnError = false,
    errorMessage,
  } = config;

  const validationResult = schema.safeParse(data);

  if (validationResult.success) {
    return {
      success: true,
      data: validationResult.data,
    };
  }

  // Extraer mensajes de error
  const errors = validationResult.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  // Logging opcional
  if (logWarnings) {
    console.warn("❌ Schema validation failed:", {
      errors,
      context,
      issuesCount: errors.length,
    });
    console.warn("📊 Raw data received:", data);
  }

  // Lanzar error si está configurado
  if (throwOnError) {
    const message =
      errorMessage || `Validation failed: ${errors.length} issues found`;
    const error = new Error(message);
    (error as any).validationErrors = errors;
    (error as any).context = context;
    throw error;
  }

  return {
    success: false,
    errors,
    rawData: data,
  };
}

/**
 * Valida datos y lanza un error si la validación falla
 * Versión simplificada de validateSchema con throwOnError: true
 *
 * @template T - El tipo inferido del schema de Zod
 * @param schema - El schema de Zod para validar
 * @param data - Los datos a validar
 * @param context - Contexto opcional para el error
 * @returns Los datos validados y tipados
 * @throws Error si la validación falla
 *
 * @example
 * ```typescript
 * try {
 *   const jobs = validateSchemaOrThrow(JobsResponseSchema, apiResponse, {
 *     operation: 'getAllJobs',
 *     endpoint: '/jobs/',
 *   });
 *   return jobs; // Datos validados
 * } catch (error) {
 *   console.error(error.validationErrors); // Array de errores
 * }
 * ```
 */
export function validateSchemaOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: Record<string, unknown>,
): T {
  const result = validateSchema(schema, data, {
    logWarnings: true,
    context,
    throwOnError: true,
  });

  return result.data!;
}

/**
 * Valida datos y devuelve la data original si la validación falla (con warning)
 * Ideal para evitar que la app se rompa si la API cambia campos menores
 *
 * @template T - El tipo inferido del schema de Zod
 * @param schema - El schema de Zod para validar
 * @param data - Los datos a validar
 * @param context - Contexto opcional para el warning
 * @returns Los datos (validados si tuvo éxito, o crudos si falló)
 */
export function validateSchemaSoft<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: Record<string, unknown>,
): T {
  const result = validateSchema(schema, data, {
    logWarnings: true,
    context,
    throwOnError: false,
  });

  return result.success ? result.data! : (data as T);
}

/**
 * Valida múltiples schemas en secuencia hasta que uno tenga éxito
 * Útil cuando la API puede retornar diferentes formatos
 *
 * @param schemas - Array de schemas a intentar en orden
 * @param data - Los datos a validar
 * @param config - Configuración opcional
 * @returns Resultado de la primera validación exitosa, o fallo si todas fallan
 *
 * @example
 * ```typescript
 * // Intentar validar como JobsResponse o como JobResponse
 * const result = validateSchemaFallback(
 *   [JobsResponseSchema, JobResponseSchema],
 *   apiResponse
 * );
 * ```
 */
export function validateSchemaFallback<T>(
  schemas: ZodSchema<T>[],
  data: unknown,
  config: SchemaValidatorConfig = {},
): ValidationResult<T> {
  const allErrors: string[] = [];

  for (const schema of schemas) {
    const result = validateSchema(schema, data, {
      ...config,
      throwOnError: false,
    });

    if (result.success) {
      return result;
    }

    if (result.errors) {
      allErrors.push(...result.errors);
    }
  }

  // Si todos fallan
  if (config.logWarnings) {
    console.warn("❌ All schema validations failed:", {
      schemasAttempted: schemas.length,
      totalErrors: allErrors.length,
      context: config.context,
    });
  }

  if (config.throwOnError) {
    const message =
      config.errorMessage || `All ${schemas.length} schema validations failed`;
    const error = new Error(message);
    (error as any).validationErrors = allErrors;
    (error as any).context = config.context;
    throw error;
  }

  return {
    success: false,
    errors: allErrors,
    rawData: data,
  };
}

/**
 * Helper para crear un validador personalizado con configuración predefinida
 *
 * @param defaultConfig - Configuración por defecto para todas las validaciones
 * @returns Función validadora con la configuración aplicada
 *
 * @example
 * ```typescript
 * // Crear un validador con logging siempre activado
 * const validator = createValidator({
 *   logWarnings: true,
 *   context: { service: 'job-service' }
 * });
 *
 * // Usar el validador
 * const jobs = validator(JobsResponseSchema, apiResponse);
 * ```
 */
export function createValidator(defaultConfig: SchemaValidatorConfig) {
  return <T>(
    schema: ZodSchema<T>,
    data: unknown,
    overrideConfig?: Partial<SchemaValidatorConfig>,
  ): ValidationResult<T> => {
    return validateSchema(schema, data, {
      ...defaultConfig,
      ...overrideConfig,
    });
  };
}

/**
 * Extrae información útil de un error de validación de Zod
 *
 * @param error - El error de Zod
 * @returns Objeto con información estructurada del error
 */
export function formatZodError(error: z.ZodError): {
  message: string;
  errors: Array<{ path: string; message: string; code: string }>;
  summary: string;
} {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join(".") || "root",
    message: issue.message,
    code: issue.code,
  }));

  const summary = `${errors.length} validation error${errors.length > 1 ? "s" : ""} found`;
  const message = errors.map((e) => `${e.path}: ${e.message}`).join("; ");

  return {
    message,
    errors,
    summary,
  };
}
