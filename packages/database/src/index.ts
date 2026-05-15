// ============================================================
// PACKAGE:    @saidonclub/database
// PURPOSE:    Export barrel — expone prisma, supabase y helpers.
// ============================================================

export { prisma } from './client';
export * from './generated/client_v3';
export { supabaseAdmin, supabaseAnon, createUserClient } from './supabase';
