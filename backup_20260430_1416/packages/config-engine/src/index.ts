import { prisma } from '@saidonclub/database';

const LOCAL_CACHE_TTL = 60 * 1000; // 60 segundos en ms

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class ConfigManager {
  private localCache = new Map<string, CacheEntry>();

  /**
   * Obtiene una configuración por su clave.
   * Estrategia: Memoria local → Prisma DB.
   */
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    // 1. Verificar cache local
    const cached = this.localCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }

    // 2. Fallback a base de datos
    const config = await prisma.systemConfig.findUnique({
      where: { key, isActive: true },
    });

    if (config) {
      const parsed = this.parseValue(config.value, config.type);
      this.setLocalCache(key, parsed);
      return parsed as T;
    }

    // 3. Valor por defecto
    if (defaultValue !== undefined) return defaultValue as T;
    throw new Error(`Configuración '${key}' no encontrada y sin valor por defecto.`);
  }

  /**
   * Obtiene múltiples configuraciones en paralelo.
   * Útil para el MLM Engine que necesita 10+ switches a la vez.
   */
  async getMany(keys: string[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    await Promise.all(
      keys.map(async (key) => {
        try {
          result[key] = await this.get(key);
        } catch {
          result[key] = null;
        }
      })
    );
    return result;
  }

  /**
   * Establece una configuración con validaciones completas.
   * SOLO Super Admin puede llamar esto (validado en capa superior).
   */
  async set(key: string, value: any, userId: string, reason?: string): Promise<void> {
    const config = await prisma.systemConfig.findUnique({ where: { key } });
    if (!config) throw new Error(`Configuración '${key}' no existe en el schema.`);

    const stringValue = String(value);

    // Validar tipo
    if (!this.validateType(stringValue, config.type)) {
      throw new Error(`Valor inválido para tipo ${config.type}`);
    }

    // Validar rango numérico
    if (config.minValue !== null || config.maxValue !== null) {
      const num = Number(value);
      if (config.minValue !== null && num < Number(config.minValue)) {
        throw new Error(`Valor mínimo permitido: ${config.minValue}`);
      }
      if (config.maxValue !== null && num > Number(config.maxValue)) {
        throw new Error(`Valor máximo permitido: ${config.maxValue}`);
      }
    }

    // Validar valores permitidos (enum-like)
    if (config.allowedValues.length > 0 && !config.allowedValues.includes(stringValue)) {
      throw new Error(`Valor debe ser uno de: ${config.allowedValues.join(', ')}`);
    }

    // Validar dependencias (no activar si padres están apagados)
    await this.validateDependencies(key, value);

    // Guardar historial para rollback
    await prisma.configHistory.create({
      data: {
        configId: config.id,
        key,
        oldValue: config.value,
        newValue: stringValue,
        changedBy: userId,
        changedByEmail: 'admin@saidonclub.com', // Resolver desde contexto en app/web
        reason: reason || 'Cambio desde panel admin',
      },
    });

    // Actualizar
    await prisma.systemConfig.update({
      where: { key },
      data: { value: stringValue, updatedBy: userId },
    });

    // Invalidar cache
    this.invalidateCache(key);
  }

  /**
   * Rollback a una versión anterior del historial.
   */
  async rollback(key: string, historyId: string, userId: string): Promise<void> {
    const history = await prisma.configHistory.findUnique({ where: { id: historyId } });
    if (!history || history.key !== key) throw new Error('Historial no encontrado');
    await this.set(key, history.oldValue, userId, `Rollback a versión de ${history.createdAt}`);
  }

  // ---------- MÉTODOS PRIVADOS ----------

  private setLocalCache(key: string, value: any): void {
    this.localCache.set(key, { value, expiresAt: Date.now() + LOCAL_CACHE_TTL });
  }

  private invalidateCache(key: string): void {
    this.localCache.delete(key);
  }

  private parseValue(value: string, type: string): any {
    switch (type) {
      case 'BOOLEAN': return value === 'true';
      case 'NUMBER': return Number(value);
      case 'DECIMAL': return Number(value);
      case 'JSON': return JSON.parse(value);
      case 'ARRAY': return JSON.parse(value);
      default: return value;
    }
  }

  private validateType(value: string, type: string): boolean {
    switch (type) {
      case 'BOOLEAN': return ['true', 'false'].includes(value);
      case 'NUMBER': return !isNaN(Number(value)) && Number.isInteger(Number(value));
      case 'DECIMAL': return !isNaN(Number(value));
      case 'JSON':
        try { JSON.parse(value); return true; } catch { return false; }
      case 'ARRAY':
        try { return Array.isArray(JSON.parse(value)); } catch { return false; }
      default: return true;
    }
  }

  private async validateDependencies(key: string, value: any): Promise<void> {
    const config = await prisma.systemConfig.findUnique({ where: { key } });
    if (!config) return;

    // Si estamos DESACTIVANDO, verificar que nadie dependa de esta key
    if (value === false || value === 'false') {
      const dependents = await prisma.systemConfig.findMany({
        where: {
          dependencies: { has: key },
          isActive: true,
          value: 'true',
        },
      });
      if (dependents.length > 0) {
        const names = dependents.map(d => d.key).join(', ');
        throw new Error(`No puedes desactivar '${key}' porque es requerido por: ${names}`);
      }
    }

    // Si estamos ACTIVANDO, verificar que padres estén activos
    if (value === true || value === 'true') {
      for (const depKey of config.dependencies) {
        const dep = await prisma.systemConfig.findUnique({ where: { key: depKey } });
        if (!dep || dep.value !== 'true') {
          throw new Error(`No puedes activar '${key}' porque requiere '${depKey}' activo.`);
        }
      }
    }
  }
}

export const config = new ConfigManager();
