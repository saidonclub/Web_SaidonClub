// ============================================================
// FILE:       database/src/database.types.ts
// AGENT:      Supabase Architect
// PURPOSE:    Stub de tipos de Supabase hasta que se ejecute:
//             `supabase gen types typescript --project-id <id> > src/database.types.ts`
//
// ¡IMPORTANTE! Este archivo es un STUB temporal.
// Reemplazar con los tipos reales generados por el CLI de Supabase
// ANTES del go-live. El comando es:
//
//   npx supabase gen types typescript \
//     --project-id <YOUR_SUPABASE_PROJECT_ID> \
//     --schema public > packages/database/src/database.types.ts
//
// Mantener este stub aquí para que el proyecto compile mientras
// se configura la conexión a Supabase.
// ============================================================

export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
