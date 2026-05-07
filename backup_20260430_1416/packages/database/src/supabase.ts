// ============================================================
// MODULE:     database/src/supabase
// AGENT:      Supabase Architect
// PARENT:     System Architect
// PURPOSE:    Cliente Singleton de Supabase para el servidor.
//             Usa el rol 'service_role' para operaciones admin
//             y valida RLS para usuarios normales.
//
// REGLAS:
//   1. NUNCA exponer service_role al cliente (navegador).
//   2. Para Server Actions, usar createClient con service_role.
//   3. Para datos de usuario, usar createClient con session JWT.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types'; // Generado por supabase gen types

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Cliente ADMIN: Solo para Server Actions y Edge Functions.
 * Tiene bypass de RLS. Usar con EXTREMO cuidado.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/**
 * Cliente ANÓNIMO: Para inicializar en el browser.
 * Las políticas RLS de Supabase controlan qué ve cada usuario.
 */
export const supabaseAnon = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: true, persistSession: true }
});

/**
 * Cliente por Usuario: Recibe el JWT de la sesión actual.
 * Respeta RLS automáticamente.
 */
export function createUserClient(jwt: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
