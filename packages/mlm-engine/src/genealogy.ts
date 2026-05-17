// ============================================================
// MODULE:     mlm-engine/genealogy
// AGENT:      MLM/Math Engineer
// DEPENDS ON: database, config-engine
// PURPOSE:    Gestión del árbol genealógico y compresión dinámica.
//             La compresión salta usuarios INACTIVOS para pagar
//             solo a quienes califican.
//
// REGLA DE ORO:
//   - Un usuario puede referir ILIMITADAS personas.
//   - Cada referido directo = una LÍNEA independiente.
//   - Máximo X niveles pagados (configurable: mlm_royalty_levels).
// ============================================================

import { prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';

export interface GenealogyNode {
  userId: string;
  username: string;
  level: number;
  isActive: boolean;
  rankName?: string;
}

/**
 * Recorre el árbol hacia arriba (patrocinadores) hasta el máximo
 * de niveles configurado. Aplica compresión dinámica si está activa.
 */
export async function getGenealogyTree(
  userId: string,
  maxLevels?: number
): Promise<GenealogyNode[]> {
  const levels = maxLevels ?? await config.get<number>('mlm_royalty_levels', 8);
  const compressionEnabled = await config.get<boolean>('mlm_compression_enabled', true);

  // High-performance Recursive CTE to fetch upline
  const query = `
    WITH RECURSIVE upline AS (
      -- Base case: The direct sponsor of the user
      SELECT
        u.id, u.username, u.sponsor_id,
        COALESCE(a.is_active, false) as is_active,
        1 as physical_level,
        CASE WHEN COALESCE(a.is_active, false) THEN 1 ELSE 0 END as active_level
      FROM users u
      LEFT JOIN activation_status a ON a.user_id = u.id
      WHERE u.id = (SELECT sponsor_id FROM users WHERE id = $1)

      UNION ALL

      -- Recursive step: The sponsor's sponsor
      SELECT
        u.id, u.username, u.sponsor_id,
        COALESCE(a.is_active, false) as is_active,
        c.physical_level + 1 as physical_level,
        c.active_level + CASE WHEN COALESCE(a.is_active, false) THEN 1 ELSE 0 END as active_level
      FROM users u
      INNER JOIN upline c ON u.id = c.sponsor_id
      LEFT JOIN activation_status a ON a.user_id = u.id
      WHERE 
        ($3::boolean AND c.active_level < $2::int) OR 
        (NOT $3::boolean AND c.physical_level < $2::int)
    )
    SELECT 
      id as "userId", 
      username, 
      (CASE WHEN $3::boolean THEN active_level ELSE physical_level END) as "level", 
      is_active as "isActive"
    FROM upline
    WHERE ($3::boolean AND is_active = true) OR (NOT $3::boolean);
  `;

  const results = await prisma.$queryRawUnsafe<any[]>(query, userId, levels, compressionEnabled);

  return results.map((row: { userId: string; username: string; level: unknown; isActive: unknown }) => ({
    userId: row.userId,
    username: row.username,
    level: Number(row.level),
    isActive: Boolean(row.isActive),
  }));
}

/**
 * Obtiene los volúmenes de todas las líneas directas de un usuario.
 * Una "línea" se define como un referido directo y toda su organización descendente.
 * 
 * OPTIMIZACIÓN ENTERPRISE: 
 * - Una sola consulta SQL para N líneas.
 * - Incluye el volumen personal de cada cabeza de línea.
 */
export async function getUserLinesVolumes(
  userId: string,
  cycleMonth: number,
  cycleYear: number
): Promise<{ lineId: string; volume: number }[]> {
  const query = `
    WITH RECURSIVE downline AS (
      -- Base: Referidos directos (Cabeza de cada línea)
      SELECT id as member_id, id as line_root_id
      FROM users 
      WHERE sponsor_id = $1

      UNION ALL

      -- Recursión: Descendientes de esos referidos
      SELECT u.id, d.line_root_id
      FROM users u
      INNER JOIN downline d ON u.sponsor_id = d.member_id
    )
    SELECT 
      d.line_root_id as "lineId",
      COALESCE(SUM(pl.amount), 0) as volume
    FROM downline d
    LEFT JOIN points_ledger pl ON pl.user_id = d.member_id 
      AND pl.cycle_month = $2::int 
      AND pl.cycle_year = $3::int
    GROUP BY d.line_root_id;
  `;

  const results = await prisma.$queryRawUnsafe<any[]>(query, userId, cycleMonth, cycleYear);
  return results.map((row: { lineId: string; volume: unknown }) => ({
    lineId: row.lineId,
    volume: Number(row.volume)
  }));
}

/**
 * Obtiene el volumen total de puntos de una línea específica (incluyendo al raíz).
 * @deprecated Use getUserLinesVolumes para múltiples líneas.
 */
export async function getLineVolume(
  rootId: string,
  cycleMonth: number,
  cycleYear: number
): Promise<number> {
  const query = `
    WITH RECURSIVE downline AS (
      SELECT id FROM users WHERE id = $1
      UNION ALL
      SELECT u.id FROM users u INNER JOIN downline d ON u.sponsor_id = d.id
    )
    SELECT COALESCE(SUM(amount), 0) as total
    FROM points_ledger
    WHERE user_id IN (SELECT id FROM downline)
      AND cycle_month = $2::int 
      AND cycle_year = $3::int;
  `;

  const results = await prisma.$queryRawUnsafe<any[]>(query, rootId, cycleMonth, cycleYear);
  return results.length > 0 ? Number(results[0].total) : 0;
}

/**
 * RECURSIVE CTE GOD MODE:
 * Calcula el volumen de TODAS las líneas de TODOS los usuarios del sistema.
 * Útil para cierres masivos y reportes globales.
 * 
 * ESTRATEGIA:
 * 1. Mapea todo el árbol genealógico.
 * 2. Suma puntos por línea.
 * 3. Actualiza el caché atómicamente.
 */
export async function refreshAllVolumesCache(
  cycleMonth: number,
  cycleYear: number
): Promise<void> {
  const query = `
    INSERT INTO volume_cache (id, user_id, line_root_id, volume, cycle_month, cycle_year, "updatedAt")
    WITH RECURSIVE organizational_tree AS (
      -- Base: Todas las líneas directas de todos
      SELECT id as member_id, sponsor_id as user_id, id as line_root_id
      FROM users 
      WHERE sponsor_id IS NOT NULL

      UNION ALL

      -- Recursión: descendientes
      SELECT u.id, ot.user_id, ot.line_root_id
      FROM users u
      INNER JOIN organizational_tree ot ON u.sponsor_id = ot.member_id
    )
    SELECT 
      gen_random_uuid(),
      ot.user_id,
      ot.line_root_id,
      COALESCE(SUM(pl.amount), 0),
      $1::int,
      $2::int,
      NOW()
    FROM organizational_tree ot
    LEFT JOIN points_ledger pl ON pl.user_id = ot.member_id 
      AND pl.cycle_month = $1 
      AND pl.cycle_year = $2
    GROUP BY ot.user_id, ot.line_root_id
    ON CONFLICT (user_id, line_root_id, cycle_month, cycle_year) 
    DO UPDATE SET 
      volume = EXCLUDED.volume,
      "updatedAt" = EXCLUDED."updatedAt";
  `;

  await prisma.$executeRawUnsafe(query, cycleMonth, cycleYear);
}
