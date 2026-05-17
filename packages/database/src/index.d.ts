import { prisma } from './client';
import { supabaseAdmin, supabaseAnon, createUserClient } from './supabase';
export { prisma, supabaseAdmin, supabaseAnon, createUserClient };
declare const _default: {
    prisma: import("./generated/client_v3").PrismaClient<import("./generated/client_v3").Prisma.PrismaClientOptions, never, import("./generated/client_v3/runtime/library").DefaultArgs>;
    supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<import("./database.types").Database, "public", "public", never, {
        PostgrestVersion: "12";
    }>;
    supabaseAnon: import("@supabase/supabase-js").SupabaseClient<import("./database.types").Database, "public", "public", never, {
        PostgrestVersion: "12";
    }>;
    createUserClient: typeof createUserClient;
};
export default _default;
//# sourceMappingURL=index.d.ts.map