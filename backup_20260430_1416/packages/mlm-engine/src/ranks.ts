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
import { getLineVolume } from './genealogy';

export interface RankEvaluation {
  userId: string;
  achievedRank: string;
  totalVolume: number;
  cappedVolume: number;
  bonusAmount: number;
}

const RANK_HIERARCHY = [
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
 * Se ejecuta durante el cierre semanal que cae en el cambio de mes.
 */
export async function evaluateRank(
  userId: string,
  cycleMonth: number,
  cycleYear: number
): Promise<RankEvaluation | null> {
  const ranksEnabled = await config.get<boolean>('mlm_ranks_enabled', true);
  if (!ranksEnabled) return null;

  const rule35Enabled = await config.get<boolean>('mlm_rank_35_rule_enabled', true);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { referrals: true },
  });
  if (!user) return null;

  // Sumar volumen de cada línea directa
  let totalVolume = 0;
  const lineVolumes: number[] = [];

  for (const ref of user.referrals) {
    const vol = await getLineVolume(ref.id, cycleMonth, cycleYear);
    lineVolumes.push(vol);
    totalVolume += vol;
  }

  // Determinar rango alcanzado (del más alto al más bajo)
  let achievedRank: string | null = null;
  let bonusAmount = 0;
  let finalCappedVolume = 0;

  for (let i = RANK_HIERARCHY.length - 1; i >= 0; i--) {
    const rank = RANK_HIERARCHY[i];
    const requiredPoints = await config.get<number>(rank.pointsKey, Infinity);
    const bonus = await config.get<number>(rank.bonusKey, 0);

    // Aplicar Regla del 35% dinámicamente según los puntos requeridos del rango
    let cappedVolumeForRank = totalVolume;
    if (rule35Enabled && requiredPoints !== Infinity) {
      const maxPerLine = requiredPoints * 0.35;
      cappedVolumeForRank = lineVolumes.reduce((sum, vol) => sum + Math.min(vol, maxPerLine), 0);
    }

    if (cappedVolumeForRank >= requiredPoints) {
      achievedRank = rank.name;
      bonusAmount = bonus;
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
