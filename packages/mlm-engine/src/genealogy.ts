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
        COALESCE(a."isActive", false) as is_active,
        1 as physical_level,
        CASE WHEN COALESCE(a."isActive", false) THEN 1 ELSE 0 END as active_level
      FROM users u
      LEFT JOIN activation_status a ON a.user_id = u.id
      WHERE u.id = (SELECT sponsor_id FROM users WHERE id = $1)

      UNION ALL

      -- Recursive step: The sponsor's sponsor
      SELECT
        u.id, u.username, u.sponsor_id,
        COALESCE(a."isActive", false) as is_active,
        c.physical_level + 1 as physical_level,
        c.active_level + CASE WHEN COALESCE(a."isActive", false) THEN 1 ELSE 0 END as active_level
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

  return results.map(row => ({
    userId: row.userId,
    username: row.username,
    level: Number(row.level),
    isActive: Boolean(row.isActive),
  }));
}

/**
 * Obtiene el volumen total de puntos de una línea específica.
 * Suma de puntos de todos los descendientes de un patrocinador directo.
 * Usado internamente para calcular la Regla del 35% en rangos.
 *
 * OPTIMIZADO: Usa Recursive CTE para evitar problema N+1.
 */
export async function getLineVolume(
  sponsorId: string,
  cycleMonth: number,
  cycleYear: number
): Promise<number> {
  const query = `
    WITH RECURSIVE downline AS (
      SELECT id FROM users WHERE sponsor_id = $1
      UNION ALL
      SELECT u.id FROM users u INNER JOIN downline d ON u.sponsor_id = d.id
    )
    SELECT COALESCE(SUM(amount), 0) as total
    FROM points_ledger
    WHERE user_id IN (SELECT id FROM downline)
      AND cycle_month = $2::int 
      AND cycle_year = $3::int;
  `;

  const results = await prisma.$queryRawUnsafe<any[]>(query, sponsorId, cycleMonth, cycleYear);
  return results.length > 0 ? Number(results[0].total) : 0;
}
