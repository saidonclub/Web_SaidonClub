// ============================================================
// MODULE:     mlm-engine/ranks
// AGENT:      MLM/Math Engineer
// PURPOSE:    Evaluación mensual de rangos con Regla del 35%.
//             Ninguna línea puede aportar más del 35% del volumen
//             requerido para calificar.
//
// FÓRMULA REGLA 35%:
//   maxPerLine = basePoints * 0.35
//   Si una línea aporta más que maxPerLine, solo se contabiliza maxPerLine.
//
// JERARQUÍA: Plata → Oro → Zafiro → Esmeralda → Rubí → Diamante → Diamante Azul
// ============================================================

import { prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { getUserLinesVolumes } from './genealogy';

export interface RankEvaluation {
  userId: string;
  achievedRank: string;
  totalVolume: number;
  cappedVolume: number;
  bonusAmount: number;
}

export const RANK_HIERARCHY = [
  { name: 'PLATA', pointsKey: 'rank_plata_points', bonusKey: 'rank_plata_bonus' },
  { name: 'ORO', pointsKey: 'rank_oro_points', bonusKey: 'rank_oro_bonus' },
  { name: 'ZAFIRO', pointsKey: 'rank_zafiro_points', bonusKey: 'rank_zafiro_bonus' },
  { name: 'ESMERALDA', pointsKey: 'rank_esmeralda_points', bonusKey: 'rank_esmeralda_bonus' },
  { name: 'RUBI', pointsKey: 'rank_rubi_points', bonusKey: 'rank_rubi_bonus' },
  { name: 'DIAMANTE', pointsKey: 'rank_diamante_points', bonusKey: 'rank_diamante_bonus' },
  { name: 'DIAMANTE_AZUL', pointsKey: 'rank_diamante_azul_points', bonusKey: 'rank_diamante_azul_bonus' },
];

/**
 * Evalúa el rango alcanzado por un usuario en un ciclo mensual.
 * OPTIMIZADO: Elimina N+1 y llamadas redundantes a config.
 */
export async function evaluateRank(
  userId: string,
  cycleMonth: number,
  cycleYear: number,
  preFetchedRequirements: any[],
  preFetchedVolumes: Record<string, number[]>,
  ranksEnabled: boolean = true,
  rule35Enabled: boolean = true
): Promise<RankEvaluation | null> {
  if (!ranksEnabled) return null;

  let lineVolumes: number[] = [];
  
  if (preFetchedVolumes) {
    lineVolumes = preFetchedVolumes[userId] || [];
  } else {
    // INTENTO 1: Leer desde VolumeCache (O(1) masivo)
    const cachedLines = await prisma.volumeCache.findMany({
      where: {
        userId,
        cycleMonth,
        cycleYear,
      },
    });

    console.log(`[DEBUG] User ${userId}: cachedLines=${cachedLines.length}`);

    if (cachedLines.length > 0) {
      lineVolumes = cachedLines.map(c => Number(c.volume));
    } else {
      // INTENTO 2: Cálculo dinámico (Fallback o tiempo real)
      const lines = await getUserLinesVolumes(userId, cycleMonth, cycleYear);
      lineVolumes = lines.map(l => l.volume);
    }
  }

  const totalVolume = lineVolumes.reduce((sum, v) => sum + v, 0);

  // Determinar rango alcanzado (del más alto al más bajo)
  let achievedRank: string | null = null;
  let bonusAmount = 0;
  let finalCappedVolume = 0;

  // Usar requerimientos pre-cargados o cargarlos ahora (con cache local)
  const rankRequirements = preFetchedRequirements || await Promise.all(
    RANK_HIERARCHY.map(async (r) => ({
      ...r,
      points: await config.get<number>(r.pointsKey, Infinity),
      bonus: await config.get<number>(r.bonusKey, 0),
    }))
  );

  for (let i = rankRequirements.length - 1; i >= 0; i--) {
    const rank = rankRequirements[i];
    const requiredPoints = rank.points;

    // Aplicar Regla del 35% dinámicamente según los puntos requeridos del rango
    let cappedVolumeForRank = totalVolume;
    if (rule35Enabled && requiredPoints !== Infinity) {
      const maxPerLine = requiredPoints * 0.35;
      cappedVolumeForRank = lineVolumes.reduce((sum, vol) => sum + Math.min(vol, maxPerLine), 0);
    }

    if (cappedVolumeForRank >= requiredPoints) {
      achievedRank = rank.name;
      bonusAmount = rank.bonus;
      finalCappedVolume = cappedVolumeForRank;
      break;
    }
  }

  if (!achievedRank) return null;

  return {
    userId,
    achievedRank,
    totalVolume,
    cappedVolume: finalCappedVolume,
    bonusAmount,
  };
}
