'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { exportToExcel } from '@/utils/export';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  data: any[];
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
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    // Simple formatting for common fields before export
    const formattedData = data.map(item => {
      const newItem = { ...item };
      
      // Convert dates to string
      for (const key in newItem) {
        if (newItem[key] instanceof Date) {
          newItem[key] = newItem[key].toLocaleString();
        }
        // Handle specific nested objects common in Prisma queries
        if (key === 'wallet' && newItem[key]?.user) {
          newItem.user_email = newItem[key].user.email;
          newItem.user_name = newItem[key].user.name;
        }
      }
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
