declare class ConfigManager {
    private localCache;
    /**
     * Obtiene una configuración por su clave.
     * Estrategia: Memoria local → Prisma DB.
     */
    get<T>(key: string, defaultValue?: T): Promise<T>;
    /**
     * Obtiene múltiples configuraciones en paralelo.
     * Útil para el MLM Engine que necesita 10+ switches a la vez.
     */
    getMany(keys: string[]): Promise<Record<string, any>>;
    /**
     * Establece una configuración con validaciones completas.
     * SOLO Super Admin puede llamar esto (validado en capa superior).
     */
    set(key: string, value: any, userId: string, reason?: string): Promise<void>;
    /**
     * Rollback a una versión anterior del historial.
     */
    rollback(key: string, historyId: string, userId: string): Promise<void>;
    private setLocalCache;
    private invalidateCache;
    private parseValue;
    private validateType;
    private validateDependencies;
}
export declare const config: ConfigManager;
export {};
//# sourceMappingURL=index.d.ts.map