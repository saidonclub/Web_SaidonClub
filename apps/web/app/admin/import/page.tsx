'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import styles from './Import.module.css';
import * as XLSX from 'xlsx';

type ImportType = 'products' | 'services' | 'users' | 'balances' | 'transactions';

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('products');
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResults(null);
        
        // Preview data
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          setPreview(data.slice(0, 6)); // Show first 5 rows
        };
        reader.readAsBinaryString(selectedFile);
      } else {
        alert('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV');
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setResults(null);

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        // Send to API
        const response = await fetch('/api/admin/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: importType,
            data: jsonData
          }),
        });

        const result = await response.json();
        setResults({
          success: response.ok,
          message: result.message || (response.ok ? 'Importación completada con éxito' : 'Error en la importación'),
          details: result.details
        });
        setIsUploading(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Import error:', error);
      setResults({
        success: false,
        message: 'Error procesando el archivo'
      });
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Actualización Masiva vía Excel</h2>
          <p className={styles.cardSubtitle}>
            Sube tablas para actualizar productos, servicios o usuarios de forma masiva.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de Importación</label>
          <div className={styles.radioGroup}>
            <button 
              className={`${styles.radioBtn} ${importType === 'products' ? styles.active : ''}`}
              onClick={() => setImportType('products')}
            >
              <FileSpreadsheet size={18} />
              Productos
            </button>
            <button 
              className={`${styles.radioBtn} ${importType === 'services' ? styles.active : ''}`}
              onClick={() => setImportType('services')}
            >
              <FileSpreadsheet size={18} />
              Servicios
            </button>
            <button 
              className={`${styles.radioBtn} ${importType === 'users' ? styles.active : ''}`}
              onClick={() => setImportType('users')}
            >
              <FileSpreadsheet size={18} />
              Usuarios
            </button>
            <button 
              className={`${styles.radioBtn} ${importType === 'balances' ? styles.active : ''}`}
              onClick={() => setImportType('balances')}
            >
              <FileSpreadsheet size={18} />
              Saldos
            </button>
            <button 
              className={`${styles.radioBtn} ${importType === 'transactions' ? styles.active : ''}`}
              onClick={() => setImportType('transactions')}
            >
              <FileSpreadsheet size={18} />
              Transacciones
            </button>
          </div>
        </div>

        <div className={styles.uploadArea}>
          <input 
            type="file" 
            id="file-upload" 
            className={styles.fileInput} 
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
          />
          <label htmlFor="file-upload" className={styles.uploadLabel}>
            <Upload size={48} className={styles.uploadIcon} />
            {file ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <>
                <span className={styles.uploadTitle}>Haz clic para subir o arrastra un archivo</span>
                <span className={styles.uploadHint}>Formatos soportados: .xlsx, .xls, .csv</span>
              </>
            )}
          </label>
        </div>

        {preview.length > 0 && (
          <div className={styles.previewSection}>
            <h3 className={styles.sectionTitle}>Vista Previa (Primeras 5 filas)</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    {preview[0]?.map((header: any, i: number) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row: any[], i: number) => (
                    <tr key={i}>
                      {row.map((cell: any, j: number) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && (
          <div className={`${styles.alert} ${results.success ? styles.success : styles.error}`}>
            {results.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <div className={styles.alertContent}>
              <span className={styles.alertTitle}>{results.success ? 'Éxito' : 'Error'}</span>
              <p className={styles.alertMessage}>{results.message}</p>
              {results.details && (
                <div className={styles.details}>
                  {results.details.created !== undefined && <span>Creados: {results.details.created}</span>}
                  {results.details.updated !== undefined && <span>Actualizados: {results.details.updated}</span>}
                  {results.details.failed !== undefined && <span>Fallidos: {results.details.failed}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.infoBox}>
          <Info size={20} />
          <div>
            <p><strong>Importante:</strong> Asegúrate de que las columnas coincidan con el formato esperado.</p>
            <ul className={styles.infoList}>
              <li>Para productos: name, description, pricePVP, priceSaidon, cost, stock, category_slug</li>
              <li>Para saldos: email, balanceAvailable, balancePending, balanceDebt</li>
              <li>Para transacciones: email, type (ROYALTY, DEPOSIT, etc), amount, status, description</li>
              <li>El sistema intentará actualizar si el registro ya existe o crear uno nuevo según corresponda.</li>
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.importBtn} 
            disabled={!file || isUploading}
            onClick={handleImport}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className={styles.spin} />
                Procesando...
              </>
            ) : (
              'Comenzar Importación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
