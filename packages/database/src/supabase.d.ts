import { Database } from './database.types';
/**
 * Cliente ADMIN: Solo para Server Actions y Edge Functions.
 * Tiene bypass de RLS. Usar con EXTREMO cuidado.
 */
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", never, {
    PostgrestVersion: "12";
}>;
/**
 * Cliente ANÓNIMO: Para inicializar en el browser.
 * Las políticas RLS de Supabase controlan qué ve cada usuario.
 */
export declare const supabaseAnon: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", never, {
    PostgrestVersion: "12";
}>;
/**
 * Cliente por Usuario: Recibe el JWT de la sesión actual.
 * Respeta RLS automáticamente.
 */
export declare function createUserClient(jwt: string): import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", never, {
    PostgrestVersion: "12";
}>;
//# sourceMappingURL=supabase.d.ts.map