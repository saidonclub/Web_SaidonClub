// ============================================================
// MODULE:     components/admin/MultimediaDashboard
// PURPOSE:    Dashboard de gestión multimedia con galería y operaciones batch
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Trash2,
  Image as ImageIcon,
  Film,
  HardDrive,
  CheckCircle,
  Loader2,
  Grid,
  List,
  Zap,
  Maximize2,
  AlertTriangle,
} from "lucide-react";

interface MediaFile {
  id: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  type: "image" | "video" | "other";
  format?: string;
  width?: number;
  height?: number;
  createdAt: string;
  optimized: boolean;
}

interface Stats {
  totalFiles: number;
  totalSize: number;
  imagesCount: number;
  videosCount: number;
  unoptimizedCount: number;
  savedBytes: number;
}

interface Props {
  initialPage?: number;
}

export function MultimediaDashboard({ initialPage = 1 }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [processing, setProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string>("");

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/admin/multimedia?${params}`);
      const data = await res.json();

      if (data.items) {
        setFiles(data.items);
        setStats(data.stats);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.size === files.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map((f) => f.id)));
    }
  };

  const handleOptimize = async () => {
    if (selected.size === 0) return;

    setProcessing(true);
    setProcessingType("optimizing");

    try {
      const res = await fetch("/api/admin/multimedia/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: Array.from(selected) }),
      });

      const data = await res.json();
      alert(
        `Optimizado: ${data.optimized?.length || 0} archivos\nAhorro: ${(
          (data.totalSaved || 0) /
          1024
        ).toFixed(1)} KB`
      );
      setSelected(new Set());
      fetchFiles();
    } catch (error) {
      alert("Error al optimizar");
    } finally {
      setProcessing(false);
      setProcessingType("");
    }
  };

  const handleRegenerateSizes = async () => {
    if (selected.size === 0) return;

    setProcessing(true);
    setProcessingType("regenerating");

    try {
      const res = await fetch("/api/admin/multimedia/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileIds: Array.from(selected),
          sizes: ["thumbnail", "small", "medium", "large"],
        }),
      });

      const data = await res.json();
      alert(`Generados: ${data.regenerated?.length || 0} tamaños`);
      setSelected(new Set());
      fetchFiles();
    } catch (error) {
      alert("Error al regenerar");
    } finally {
      setProcessing(false);
      setProcessingType("");
    }
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`¿Eliminar ${selected.size} archivos?`)) return;

    setProcessing(true);
    setProcessingType("deleting");

    try {
      const res = await fetch("/api/admin/multimedia", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: Array.from(selected) }),
      });

      const data = await res.json();
      alert(`Eliminados: ${data.deleted?.length || 0} archivos`);
      setSelected(new Set());
      fetchFiles();
    } catch (error) {
      alert("Error al eliminar");
    } finally {
      setProcessing(false);
      setProcessingType("");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="multimedia-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Multimedia</h1>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={handleOptimize}
            disabled={selected.size === 0 || processing}
          >
            {processing && processingType === "optimizing" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Zap size={16} />
            )}
            Optimizar ({selected.size})
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleRegenerateSizes}
            disabled={selected.size === 0 || processing}
          >
            {processing && processingType === "regenerating" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
            Regenerar Tamaños
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={selected.size === 0 || processing}
          >
            {processing && processingType === "deleting" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            Eliminar
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <HardDrive size={20} />
            <div className="stat-info">
              <span className="stat-value">{formatSize(stats.totalSize)}</span>
              <span className="stat-label">Espacio usado</span>
            </div>
          </div>
          <div className="stat-card">
            <ImageIcon size={20} />
            <div className="stat-info">
              <span className="stat-value">{stats.imagesCount}</span>
              <span className="stat-label">Imágenes</span>
            </div>
          </div>
          <div className="stat-card">
            <Film size={20} />
            <div className="stat-info">
              <span className="stat-value">{stats.videosCount}</span>
              <span className="stat-label">Videos</span>
            </div>
          </div>
          <div className="stat-card warning">
            <AlertTriangle size={20} />
            <div className="stat-info">
              <span className="stat-value">{stats.unoptimizedCount}</span>
              <span className="stat-label">Sin optimizar</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters & View */}
      <div className="toolbar">
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          <option value="image">Solo imágenes</option>
          <option value="video">Solo videos</option>
        </select>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={16} />
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className={`gallery ${viewMode}`}>
        {loading ? (
          <div className="loading">
            <Loader2 className="animate-spin" size={32} />
            <p>Cargando archivos...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="empty">
            <ImageIcon size={48} />
            <p>No hay archivos multimedia</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid">
            {files.map((file) => (
              <div
                key={file.id}
                className={`grid-item ${selected.has(file.id) ? "selected" : ""}`}
                onClick={() => handleSelect(file.id)}
              >
                <div className="preview">
                  {file.type === "image" ? (
                    <Image
                      src={file.url}
                      alt={file.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Film size={32} />
                  )}
                  {selected.has(file.id) && (
                    <CheckCircle className="checked" size={20} />
                  )}
                </div>
                <div className="info">
                  <span className="filename">{file.filename}</span>
                  <span className="size">{formatSize(file.size)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.size === files.length && files.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Archivo</th>
                <th>Tipo</th>
                <th>Tamaño</th>
                <th>Dimensiones</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={selected.has(file.id) ? "selected" : ""}
                  onClick={() => handleSelect(file.id)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(file.id)}
                      onChange={() => handleSelect(file.id)}
                    />
                  </td>
                  <td>
                    <div className="file-cell">
                      {file.type === "image" ? (
                        <Image
                          src={file.url}
                          alt={file.filename}
                          width={40}
                          height={40}
                          className="thumb"
                        />
                      ) : (
                        <Film size={20} />
                      )}
                      <span>{file.filename}</span>
                    </div>
                  </td>
                  <td>{file.type}</td>
                  <td>{formatSize(file.size)}</td>
                  <td>
                    {file.width && file.height
                      ? `${file.width}x${file.height}`
                      : "-"}
                  </td>
                  <td>{formatDate(file.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Siguiente
        </button>
      </div>

      <style jsx>{`
        .multimedia-dashboard {
          padding: 1.5rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .dashboard-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #1f2937;
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card.warning {
          border: 1px solid #f59e0b;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: var(--radius-sm);
          color: white;
        }

        .view-toggle {
          display: flex;
          background: #1f2937;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .view-toggle button {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }

        .view-toggle button.active {
          background: #374151;
          color: white;
        }

        .gallery {
          min-height: 400px;
          margin-bottom: 1rem;
        }

        .loading,
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #9ca3af;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .grid-item {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .grid-item:hover {
          border-color: #3b82f6;
        }

        .grid-item.selected {
          border-color: #3b82f6;
        }

        .preview {
          position: relative;
          aspect-ratio: 1;
          background: #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview .checked {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #3b82f6;
          border-radius: var(--radius-full);
          padding: 0.25rem;
          color: white;
        }

        .info {
          padding: 0.5rem;
          background: #1f2937;
        }

        .filename {
          display: block;
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .size {
          font-size: 0.625rem;
          color: #9ca3af;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #374151;
        }

        .table tr.selected td {
          background: #1e3a5f;
        }

        .file-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .file-cell .thumb {
          border-radius: var(--radius-xs);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: var(--radius-sm);
          color: white;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}