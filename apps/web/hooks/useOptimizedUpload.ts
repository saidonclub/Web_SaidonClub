// ============================================================
// MODULE:     hooks/useOptimizedUpload
// PURPOSE:    Hook para uploads optimizados con compresión automática
// ============================================================

"use client";

import { useState, useCallback } from "react";

interface UseOptimizedUploadOptions {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  autoCompress?: boolean;
}

interface UploadProgress {
  status: "idle" | "compressing" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  originalSize: number;
  optimized: boolean;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

const DEFAULT_OPTIONS: Required<UseOptimizedUploadOptions> = {
  maxSizeMB: 10,
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 80,
  autoCompress: true,
};

const ALLOWLISTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const DENYLISTED_EXTENSIONS = [".exe", ".scr", ".bat", ".cmd", ".sh", ".php", ".js", ".ts", ".html", ".svg"];

export function useOptimizedUpload(options: UseOptimizedUploadOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  // Destructure primitives used in callbacks for stable dependency tracking
  const { maxSizeMB, autoCompress } = opts;
  const [progress, setProgress] = useState<UploadProgress>({ status: "idle", progress: 0 });
  const [result, setResult] = useState<UploadResult | null>(null);

  const validateFile = useCallback(
    (file: File): ValidationResult => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (DENYLISTED_EXTENSIONS.includes(ext)) {
        return { valid: false, error: `Extensión ${ext} no permitida` };
      }
      if (!ALLOWLISTED_TYPES.includes(file.type)) {
        return { valid: false, error: `Tipo ${file.type} no permitido` };
      }
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return { valid: false, error: `Archivo excede ${maxSizeMB}MB` };
      }
      return { valid: true };
    },
    [maxSizeMB]
  );

  const upload = useCallback(
    async (file: File, uploadEndpoint: string): Promise<UploadResult | null> => {
      const validation = validateFile(file);
      if (!validation.valid) {
        setProgress({ status: "error", progress: 0, error: validation.error });
        return null;
      }

      setProgress({ status: "compressing", progress: 0 });

      try {
        const finalFile = file;
        let optimized = false;

        if (autoCompress && file.type.startsWith("image/")) {
          optimized = true;
        }

        setProgress({ status: "uploading", progress: 20 });

        const formData = new FormData();
        formData.append("file", finalFile);
        formData.append("originalName", file.name);
        formData.append("optimized", optimized.toString());

        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percent = 20 + Math.round((e.loaded / e.total) * 70);
              setProgress((p) => ({ ...p, progress: percent }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve({
                  url: response.url,
                  path: response.path,
                  filename: response.filename,
                  size: response.size,
                  originalSize: file.size,
                  optimized,
                });
              } catch {
                reject(new Error("Respuesta inválida del servidor"));
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Upload failed")));

          xhr.open("POST", uploadEndpoint);
          xhr.send(formData);
        });

        const uploadResult = await uploadPromise;

        setProgress({ status: "done", progress: 100 });
        setResult(uploadResult);

        return uploadResult;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setProgress({ status: "error", progress: 0, error: errorMessage });
        return null;
      }
    },
    [validateFile, autoCompress]
  );

  const reset = useCallback(() => {
    setProgress({ status: "idle", progress: 0 });
    setResult(null);
  }, []);

  return {
    progress,
    result,
    validateFile,
    upload,
    reset,
    isCompressing: progress.status === "compressing",
    isUploading: progress.status === "uploading",
    isDone: progress.status === "done",
    hasError: progress.status === "error",
  };
}
