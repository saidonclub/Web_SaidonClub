import { google, sheets_v4 } from 'googleapis';
import { PrismaClient, AITicketStatus } from '@saidonclub/database';
import { GoogleAuth } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

// Envolvemos todo en una clase singleton o exportamos funciones sueltas
export class GoogleSheetsService {
  private auth?: GoogleAuth;
  private sheets?: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
    
    try {
      if (!this.isMockMode()) {
        // Initialize Auth using service account
        // We expect the private key to be base64 encoded or string with \n
        const privateKey = process.env.GOOGLE_PRIVATE_KEY
          ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : '';
          
        this.auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      } else {
        console.log(
          '\x1b[33m%s\x1b[0m',
          '[GoogleSheetsService] Modo Simulado (Mock) activado. Se utilizará data/mock-google-sheets.json.'
        );
      }
    } catch (err) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        `[GoogleSheetsService] Falló la inicialización real de Google Sheets: ${
          err instanceof Error ? err.message : 'Unknown'
        }. Activando modo simulado.`
      );
    }
  }

  public isMockMode(): boolean {
    const sheetId = process.env.GOOGLE_SHEET_ID || '';
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

    const hasPlaceholder =
      sheetId.includes('ingresa_tu_id_aqui') ||
      email.includes('tu-cuenta-de-servicio') ||
      privateKey.includes('-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----') ||
      privateKey.includes('...');

    return !this.isConfigured() || hasPlaceholder;
  }

  public isConfigured(): boolean {
    return !!(
      this.spreadsheetId &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );
  }

  private getMockFilePath(): string {
    return path.join(process.cwd(), 'data', 'mock-google-sheets.json');
  }

  private readMockData(): Record<string, string[][]> {
    const filePath = this.getMockFilePath();
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn(`[GoogleSheetsService] Error leyendo archivo mock:`, err);
    }
    return {};
  }

  private writeMockData(data: Record<string, string[][]>) {
    const filePath = this.getMockFilePath();
    try {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[GoogleSheetsService] Error escribiendo archivo mock:`, err);
    }
  }

  private colLetterToIndex(letter: string): number {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
      column += (letter.charCodeAt(i) - 65 + 1) * Math.pow(26, length - i - 1);
    }
    return column - 1;
  }

  /**
   * Appends data to a specific sheet
   */
  public async appendRow(range: string, values: string[][]) {
    if (this.isMockMode()) {
      console.log(
        '\x1b[33m%s\x1b[0m',
        `[GoogleSheetsService] MOCK MODE: appendRow llamado para rango "${range}".`
      );
      const parts = range.split('!');
      const sheetName = parts[0];
      const mockData = this.readMockData();
      if (!mockData[sheetName]) {
        mockData[sheetName] = [];
      }
      mockData[sheetName].push(...values);
      this.writeMockData(mockData);
      return {};
    }

    if (!this.isConfigured() || !this.sheets) throw new Error('Google Sheets API no está configurada.');
    
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('[GoogleSheetsService] Error appending row:', error);
      throw error;
    }
  }

  /**
   * Reads data from a specific sheet range
   */
  public async readRange(range: string) {
    if (this.isMockMode()) {
      console.log(
        '\x1b[33m%s\x1b[0m',
        `[GoogleSheetsService] MOCK MODE: readRange llamado para rango "${range}".`
      );
      const parts = range.split('!');
      const sheetName = parts[0];
      const cellRange = parts[1] || '';
      const mockData = this.readMockData();
      const grid = mockData[sheetName] || [];
      
      if (!cellRange) return grid;

      let startRow = 0;
      let endRow = Infinity;
      let startCol = 0;
      let endCol = Infinity;

      const match = cellRange.match(/^([A-Z]*)([0-9]*):([A-Z]*)([0-9]*)$/i);
      if (match) {
        const [, sColStr, sRowStr, eColStr, eRowStr] = match;
        if (sRowStr) startRow = parseInt(sRowStr, 10) - 1;
        if (eRowStr) endRow = parseInt(eRowStr, 10) - 1;
        if (sColStr) startCol = this.colLetterToIndex(sColStr.toUpperCase());
        if (eColStr) endCol = this.colLetterToIndex(eColStr.toUpperCase());
      } else {
        const singleMatch = cellRange.match(/^([A-Z]+)([0-9]*)$/i);
        if (singleMatch) {
          const [, colStr, rowStr] = singleMatch;
          if (rowStr) {
            startRow = parseInt(rowStr, 10) - 1;
            endRow = startRow;
          }
          if (colStr) {
            startCol = this.colLetterToIndex(colStr.toUpperCase());
            endCol = startCol;
          }
        } else {
          const colRangeMatch = cellRange.match(/^([A-Z]+):([A-Z]+)$/i);
          if (colRangeMatch) {
            const [, sColStr, eColStr] = colRangeMatch;
            startCol = this.colLetterToIndex(sColStr.toUpperCase());
            endCol = this.colLetterToIndex(eColStr.toUpperCase());
          }
        }
      }

      const result: string[][] = [];
      const rowLimit = Math.min(grid.length, endRow + 1);
      for (let r = startRow; r < rowLimit; r++) {
        const row = grid[r] || [];
        const slicedRow: string[] = [];
        const colLimit = Math.min(row.length, endCol + 1);
        for (let c = startCol; c < colLimit; c++) {
          slicedRow.push(row[c] || '');
        }
        result.push(slicedRow);
      }
      return result;
    }

    if (!this.isConfigured() || !this.sheets) throw new Error('Google Sheets API no está configurada.');

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data.values || [];
    } catch (error: unknown) {
      console.error('[GoogleSheetsService] Error reading range:', error);
      throw error;
    }
  }

  /**
   * Clears a specific sheet range
   */
  public async clearRange(range: string) {
    if (this.isMockMode()) {
      console.log(
        '\x1b[33m%s\x1b[0m',
        `[GoogleSheetsService] MOCK MODE: clearRange llamado para rango "${range}".`
      );
      const parts = range.split('!');
      const sheetName = parts[0];
      const mockData = this.readMockData();
      if (parts[1]?.includes('A:Z') || !parts[1]) {
        mockData[sheetName] = [];
      } else {
        mockData[sheetName] = [];
      }
      this.writeMockData(mockData);
      return;
    }

    if (!this.isConfigured() || !this.sheets) throw new Error('Google Sheets API no está configurada.');

    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range,
      });
    } catch (error: unknown) {
      console.error('[GoogleSheetsService] Error clearing range:', error);
      throw error;
    }
  }

  /**
   * Syncs all AITickets from DB to Sheet
   */
  public async syncTicketsToSheet(db: PrismaClient) {
    if (this.isMockMode()) {
      console.log(
        '\x1b[33m%s\x1b[0m',
        '[GoogleSheetsService] MOCK MODE: Sincronizando tickets DB -> Sheets (mock-google-sheets.json)...'
      );
      try {
        const tickets = await db.aITicket.findMany({
          orderBy: { createdAt: 'desc' }
        });

        const headers = [['ID', 'User ID', 'Session ID', 'Prompt', 'Response', 'Status', 'Model Used', 'Created At']];
        const rows = tickets.map((t) => [
          t.id,
          t.userId || 'Anonymous',
          t.sessionId || 'N/A',
          t.prompt || 'N/A',
          t.response || 'N/A',
          t.status,
          t.modelUsed || 'UNKNOWN',
          t.createdAt.toISOString()
        ]);

        const data = [...headers, ...rows];

        const mockData = this.readMockData();
        mockData['AITickets'] = data;
        this.writeMockData(mockData);

        console.log(
          '\x1b[33m%s\x1b[0m',
          `[GoogleSheetsService] MOCK MODE: ¡Sincronización exitosa! ${rows.length} tickets mockeados.`
        );
        return { success: true, count: rows.length };
      } catch (error: unknown) {
        console.error('[GoogleSheetsService] Error en sync mock DB -> Sheets:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    if (!this.isConfigured() || !this.sheets) return { success: false, message: 'Google Sheets no configurado' };

    try {
      // 1. Fetch tickets from DB
      const tickets = await db.aITicket.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // 2. Format for sheets
      const headers = [['ID', 'User ID', 'Session ID', 'Prompt', 'Response', 'Status', 'Model Used', 'Created At']];
      const rows = tickets.map((t) => [
        t.id,
        t.userId || 'Anonymous',
        t.sessionId || 'N/A',
        t.prompt || 'N/A',
        t.response || 'N/A',
        t.status,
        t.modelUsed || 'UNKNOWN',
        t.createdAt.toISOString()
      ]);

      const data = [...headers, ...rows];

      // 3. Clear existing and rewrite (Full sync)
      await this.clearRange('AITickets!A:Z');
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'AITickets!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: data },
      });

      return { success: true, count: rows.length };
    } catch (error: unknown) {
      console.error('[GoogleSheetsService] Error syncing tickets to sheet:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Syncs AITickets status from Sheet back to DB
   */
  public async syncTicketsFromSheet(db: PrismaClient) {
    if (this.isMockMode()) {
      console.log(
        '\x1b[33m%s\x1b[0m',
        '[GoogleSheetsService] MOCK MODE: Sincronizando tickets Sheets (mock-google-sheets.json) -> DB...'
      );
      try {
        const rows = await this.readRange('AITickets!A2:F');
        let updatedCount = 0;

        for (const row of rows) {
          if (!row || row.length < 6) continue;
          const id = row[0];
          const status = row[5];
          
          if (id && status) {
            // Validate status is a known AITicketStatus value before writing to DB
            const validStatuses = Object.values(AITicketStatus) as string[];
            if (!validStatuses.includes(status)) {
              console.warn(`[GoogleSheetsService] Valor de status inválido '${status}' para ticket ${id}. Omitiendo.`);
              continue;
            }
            try {
              await db.aITicket.update({
                where: { id },
                data: { status: status as AITicketStatus }
              });
              updatedCount++;
            } catch (err) {
              console.warn(`[GoogleSheetsService] Could not update ticket ${id}:`, err);
            }
          }
        }

        console.log(
          '\x1b[33m%s\x1b[0m',
          `[GoogleSheetsService] MOCK MODE: ¡Sincronización exitosa! ${updatedCount} tickets actualizados en la DB.`
        );
        return { success: true, updatedCount };
      } catch (error: unknown) {
        console.error('[GoogleSheetsService] Error en sync mock Sheets -> DB:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    if (!this.isConfigured() || !this.sheets) return { success: false, message: 'Google Sheets no configurado' };

    try {
      // Assuming headers are on row 1, data starts at row 2
      // We read up to column F (Status)
      const rows = await this.readRange('AITickets!A2:F');
      
      let updatedCount = 0;

      for (const row of rows) {
        if (!row || row.length < 6) continue;
        const id = row[0];
        const status = row[5]; // Ensure this matches AITicketStatus enum (column F)
        
        if (id && status) {
          // Validate status is a known AITicketStatus value before writing to DB
          const validStatuses = Object.values(AITicketStatus) as string[];
          if (!validStatuses.includes(status)) {
            console.warn(`[GoogleSheetsService] Valor de status inválido '${status}' para ticket ${id}. Omitiendo.`);
            continue;
          }
          try {
            await db.aITicket.update({
              where: { id },
              data: { status: status as AITicketStatus }
            });
            updatedCount++;
          } catch (err) {
            console.warn(`[GoogleSheetsService] Could not update ticket ${id}:`, err);
          }
        }
      }

      return { success: true, updatedCount };
    } catch (error: unknown) {
      console.error('[GoogleSheetsService] Error syncing tickets from sheet:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService();

