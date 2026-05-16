import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file (XLSX).
 * @param data Array of objects to export.
 * @param filename Name of the file to be downloaded.
 * @param sheetName Name of the sheet inside the Excel file.
 */
export function exportToExcel(data: Record<string, unknown>[], filename: string = 'export.xlsx', sheetName: string = 'Data') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Create a blob and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
