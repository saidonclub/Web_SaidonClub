// ============================================================
// COMPONENT: Media Upload
// PURPOSE: Drag-drop image/video upload with preview and compression
// ============================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Film,
  AlertCircle,
  CheckCircle2,
  Star,
  Trash2,
  Eye,
  Zap,
} from "lucide-react";
import styles from "./MediaUpload.module.css";

interface MediaFile {
  id: string;
  url: string;
  type: "image" | "video";
  status: "uploading" | "success" | "error";
  progress: number;
  isMain?: boolean;
  savings?: number; // Porcentaje de ahorro por optimización
}

interface MediaUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  onSetMain?: (url: string) => void;
  maxFiles?: number;
  initialUrls?: string[];
  folder?: string;
  acceptVideo?: boolean;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploadComplete,
  onSetMain,
  maxFiles = 10,
  initialUrls = [],
  folder = "products",
  acceptVideo = true,
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializar con URLs existentes
  useEffect(() => {
    if (initialUrls.length > 0 && files.length === 0) {
      setFiles(
        initialUrls.map((url, index) => ({
          id: `init-${index}`,
          url,
          type: url.match(/\.(mp4|webm|mov|avi)$/i) ? "video" : "image",
          status: "success",
          progress: 100,
          isMain: index === 0,
        })),
      );
    }
  }, [initialUrls, files.length]);

  const uploadFile = async (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const isVideo = file.type.startsWith("video/");

    if (isVideo && !acceptVideo) {
      // Usar un feedback más elegante en el futuro, por ahora alert
      alert("Los videos no están permitidos en este campo.");
      return;
    }

    const newFile: MediaFile = {
      id,
      url: URL.createObjectURL(file),
      type: isVideo ? "video" : "image",
      status: "uploading",
      progress: 0,
      isMain: files.length === 0,
    };

    setFiles((prev) => [...prev, newFile]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const response = await fetch("/api/upload/optimized", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error en la subida");

      const result = await response.json();

      const { size, originalSize } = result.data;
      const savings =
        originalSize > 0 ? Math.round((1 - size / originalSize) * 100) : 0;

      setFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === id
            ? {
                ...f,
                url: result.data.url,
                status: "success" as const,
                progress: 100,
                savings,
              }
            : f,
        );

        const successUrls = updated
          .filter((f) => f.status === "success")
          .map((f) => f.url);
        onUploadComplete?.(successUrls);

        return updated;
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error" } : f)),
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Máximo ${maxFiles} archivos permitidos.`);
      return;
    }
    selectedFiles.forEach(uploadFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (files.length + droppedFiles.length > maxFiles) {
      alert(`Máximo ${maxFiles} archivos permitidos.`);
      return;
    }
    droppedFiles.forEach(uploadFile);
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      if (fileToRemove?.isMain && filtered.length > 0) {
        filtered[0].isMain = true;
      }
      onUploadComplete?.(
        filtered.filter((f) => f.status === "success").map((f) => f.url),
      );
      return filtered;
    });
  };

  const setMainFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        const isTarget = f.id === id;
        if (isTarget && f.status === "success") onSetMain?.(f.url);
        return { ...f, isMain: isTarget };
      }),
    );
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
        />

        <div className={styles.dropzoneContent}>
          <div className={styles.iconCircle}>
            <Upload size={28} />
          </div>
          <div className={styles.dropzoneText}>
            <h3>Optimización Automática de Medios</h3>
            <p>Arrastra imágenes o videos para procesarlos instantáneamente</p>
          </div>
          <div className={styles.formatBadges}>
            <span className={styles.badge}>
              <ImageIcon size={14} /> Auto-WebP
            </span>
            <span className={styles.badge}>
              <Film size={14} /> 420p Video (15s)
            </span>
            <span className={styles.badge}>
              <Zap size={14} /> Ultra Compresión
            </span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.previewGrid}>
          {files.map((file) => (
            <div
              key={file.id}
              className={`${styles.previewItem} ${file.isMain ? styles.mainItem : ""} ${styles[file.status]}`}
            >
              {file.type === "image" ? (
                <img src={file.url} alt="Preview" className={styles.media} />
              ) : (
                <video
                  src={file.url}
                  className={styles.media}
                  muted
                  playsInline
                />
              )}

              {/* Toolbar */}
              <div className={styles.itemToolbar}>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${file.isMain ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMainFile(file.id);
                  }}
                  title="Imagen Principal"
                >
                  <Star
                    size={16}
                    fill={file.isMain ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewId(file.id);
                  }}
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  className={`${styles.toolBtn} ${styles.danger}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Status Indicators */}
              {file.status === "uploading" && (
                <div className={styles.overlay}>
                  <div className={styles.spinner} />
                  <div className={styles.progressText}>
                    {file.type === "video"
                      ? "PROCESANDO 420P..."
                      : "OPTIMIZANDO WEBP..."}
                  </div>
                </div>
              )}

              {file.status === "error" && (
                <div
                  className={styles.errorOverlay}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AlertCircle size={24} />
                  <span>ERROR</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className={styles.retryBtn}
                  >
                    Quitar
                  </button>
                </div>
              )}

              {file.isMain && <div className={styles.mainBadge}>PRINCIPAL</div>}

              {file.status === "success" && (
                <>
                  <div className={styles.checkBadge}>
                    <CheckCircle2 size={16} />
                  </div>
                  {file.savings && file.savings > 0 && (
                    <div
                      className={styles.savingsBadge}
                      title="Espacio ahorrado"
                    >
                      -{file.savings}%
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewId && (
        <div className={styles.modal} onClick={() => setPreviewId(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModal}
              onClick={() => setPreviewId(null)}
            >
              <X size={32} />
            </button>
            {files.find((f) => f.id === previewId)?.type === "image" ? (
              <img
                src={files.find((f) => f.id === previewId)?.url}
                alt="Preview"
              />
            ) : (
              <video
                src={files.find((f) => f.id === previewId)?.url}
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
