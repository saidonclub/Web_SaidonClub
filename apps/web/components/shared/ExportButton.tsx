'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { exportToExcel } from '@/utils/export';
import { useToast } from '@/components/shared/Toast';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
  sheetName?: string;
  label?: string;
  className?: string;
}

export function ExportButton({ 
  data, 
  filename = 'export', 
  sheetName = 'Data', 
  label = 'Exportar a Excel',
  className = ''
}: ExportButtonProps) {
  const { warning } = useToast();
  
  const handleExport = () => {
    if (!data || data.length === 0) {
      warning('Exportación', 'No hay datos para exportar');
      return;
    }
    
    // Simple formatting for common fields before export
    const formattedData = data.map(item => {
      const newItem = { ...item } as Record<string, unknown>;
      
      // Convert dates to string and handle nested objects
      Object.keys(newItem).forEach(key => {
        const val = newItem[key];
        if (val instanceof Date) {
          newItem[key] = val.toLocaleString();
        }
        // Handle specific nested objects common in Prisma queries
        if (key === 'wallet' && val && typeof val === 'object') {
          const walletVal = val as Record<string, unknown>;
          if (walletVal.user && typeof walletVal.user === 'object') {
            const userVal = walletVal.user as Record<string, unknown>;
            newItem.user_email = userVal.email;
            newItem.user_name = userVal.name;
          }
        }
      });
      return newItem;
    });

    exportToExcel(formattedData, filename, sheetName);
  };

  return (
    <button 
      onClick={handleExport} 
      className={`${styles.exportBtn} ${className}`}
      title={label}
    >
      <Download size={18} />
      <span>{label}</span>
    </button>
  );
}
