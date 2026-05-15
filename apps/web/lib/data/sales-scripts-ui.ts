/**
 * Re-exporta los datos de sales-scripts para uso en componentes cliente.
 */
export { SALES_SCRIPTS, getScriptById, getScriptsByCategory, getScriptsByChannel } from "./sales-scripts";
export type { SalesScript } from "./sales-scripts";

// Alias para compatibilidad con el componente de UI
export const BLOG_CATEGORIES_SCRIPTS = null; // placeholder, no usado
