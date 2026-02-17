import { ZodSchema } from "zod";

import {
  collection,
  query,
  onSnapshot,
  doc,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { firestore } from "@/core/config/firebase-database";

export type UnsubscribeFn = () => void;
export interface SubscriptionResult<T> {
  data: T[];
  errors: string[];
}

export type FirebaseSubscriptionError = {
  type:
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "FIREBASE_ERROR"
  | "PERMISSION_DENIED";
  message: string;
  details?: any;
};

export type EnhancedCallback<T> = (
  data: T[] | null,
  error?: FirebaseSubscriptionError,
) => void;

export function parseDocuments<T>(
  docs: DocumentSnapshot[] | QuerySnapshot["docs"],
  schema: ZodSchema<T>,
): SubscriptionResult<T> {
  const data: T[] = [];
  const errors: string[] = [];

  const docArray = Array.isArray(docs) ? docs : docs;

  docArray.forEach((doc) => {
    const result = schema.safeParse(doc.data());
    if (result.success) {
      data.push(result.data);
    } else {
      errors.push(
        `Doc ${doc.id}: ${result.error.issues.map((i) => i.message).join(", ")}`,
      );
    }
  });

  return { data, errors };
}

export function createLiveSubscription<T>(
  collectionPath: string,
  schema: ZodSchema<T>,
  queryConstraints: any[],
  callback: EnhancedCallback<T>,
): UnsubscribeFn {
  try {
    const pathParts = collectionPath.split("/");
    const isDoc = pathParts.length % 2 === 0;

    if (isDoc) {
      console.log(
        `🔥 [Firebase] Suscribiéndose a DOCUMENTO: ${collectionPath}`,
      );
      const [root, ...rest] = pathParts;
      const docRef = doc(firestore, root, ...rest);
      return onSnapshot(
        docRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            console.warn(`📭 Document ${collectionPath} does not exist yet`);
            callback(null, {
              type: "NOT_FOUND",
              message: "Document not found - may not be created yet",
            });
            return;
          }
          const dataWithId = { ...snapshot.data(), uuid: snapshot.id };
          const result = schema.safeParse(dataWithId);
          if (result.success) {
            callback([result.data]);
          } else {
            console.error(`❌ Validation failed for ${collectionPath}:`, {
              errors: result.error.flatten(),
              receivedData: snapshot.data(),
            });
            callback(null, {
              type: "VALIDATION_ERROR",
              message: "Data validation failed",
              details: result.error.flatten(),
            });
          }
        },
        (error) => {
          const errorType =
            error.code === "permission-denied"
              ? "PERMISSION_DENIED"
              : "FIREBASE_ERROR";

          console.error(`🔴 Firebase error in ${collectionPath}:`, {
            code: error.code,
            message: error.message,
          });

          callback(null, {
            type: errorType,
            message: error.message,
            details: { code: error.code },
          });
        },
      );
    }

    // @ts-ignore
    const q = query(
      collection(firestore, pathParts[0], ...pathParts.slice(1)),
      ...(queryConstraints as any),
    );

    console.log(
      `🔥 [Firebase] Suscribiéndose a COLECCIÓN: ${collectionPath}`,
      q,
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(null);
          return;
        }

        const { data, errors } = parseDocuments(snapshot.docs, schema);
        if (errors.length > 0) {
          console.warn(`Validation errors in ${collectionPath}:`, errors);
        }

        callback(data.length > 0 ? data : null);
      },
      (error) => {
        console.error(
          `🔴 [Firebase] Error en colección: ${collectionPath}:`,
          error.message,
        );
        callback(null);
      },
    );
  } catch (err) {
    console.error(
      `❌ [Firebase] Error crítico inicializando suscripción:`,
      err,
    );
    callback(null);
    return () => { };
  }
}
