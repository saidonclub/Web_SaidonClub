// ============================================================
// FILE:       packages/database/prisma/seed.ts
// PURPOSE:    Poblar la SystemConfig con todos los switches
//             del SaidonClub OS v5.1.
//             Ejecutar: pnpm db:seed
//
// INSTRUCCIÓN CRÍTICA: Todos los valores son UPSERT.
//             Nunca borrará configuración existente.
//             Los valores marcados con * DEBEN configurarse
//             antes del go-live (credenciales reales).
// ============================================================

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

type ConfigSeed = {
  key: string;
  value: string;
  type: 'BOOLEAN' | 'NUMBER' | 'STRING' | 'JSON';
  description: string;
};

const configs: ConfigSeed[] = [
  // ─── SISTEMA GENERAL ────────────────────────────────────────
  { key: 'system_name', value: 'SaidonClub OS', type: 'STRING', description: 'Nombre del sistema' },
  { key: 'system_version', value: '5.1.0', type: 'STRING', description: 'Versión del sistema' },
  { key: 'system_timezone', value: 'America/Guayaquil', type: 'STRING', description: 'Zona horaria principal' },
  { key: 'system_currency', value: 'USD', type: 'STRING', description: 'Moneda base del sistema' },
  { key: 'system_maintenance_mode', value: 'false', type: 'BOOLEAN', description: 'Activar modo mantenimiento' },
  { key: 'system_debug_mode', value: 'false', type: 'BOOLEAN', description: 'Activar logs de debug' },
  { key: 'system_registration_open', value: 'true', type: 'BOOLEAN', description: 'Registro público abierto' },
  { key: 'system_country', value: 'EC', type: 'STRING', description: 'País principal de operación' },

  // ─── MLM — MOTOR PRINCIPAL ─────────────────────────────────
  { key: 'mlm_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar/deshabilitar motor MLM completo' },
  { key: 'mlm_royalty_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar pago de regalías por ventas' },
  { key: 'mlm_seed_bonus_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar bono semilla por membresías' },
  { key: 'mlm_ranks_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar sistema de rangos mensuales' },
  { key: 'mlm_compression_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar compresión dinámica en árbol' },

  // ─── MLM — REGALÍAS ─────────────────────────────────────────
  { key: 'mlm_royalty_percentage', value: '50', type: 'NUMBER', description: '% del margen real destinado al pool de regalías' },
  { key: 'mlm_royalty_levels', value: '8', type: 'NUMBER', description: 'Número de niveles pagados en regalías' },
  { key: 'mlm_royalty_l1_pct', value: '25', type: 'NUMBER', description: '% pool para nivel 1 de regalías' },
  { key: 'mlm_royalty_l2_pct', value: '15', type: 'NUMBER', description: '% pool para nivel 2 de regalías' },
  { key: 'mlm_royalty_l3_pct', value: '12', type: 'NUMBER', description: '% pool para nivel 3 de regalías' },
  { key: 'mlm_royalty_l4_pct', value: '10', type: 'NUMBER', description: '% pool para nivel 4 de regalías' },
  { key: 'mlm_royalty_l5_pct', value: '10', type: 'NUMBER', description: '% pool para nivel 5 de regalías' },
  { key: 'mlm_royalty_l6_pct', value: '10', type: 'NUMBER', description: '% pool para nivel 6 de regalías' },
  { key: 'mlm_royalty_l7_pct', value: '10', type: 'NUMBER', description: '% pool para nivel 7 de regalías' },
  { key: 'mlm_royalty_l8_pct', value: '8', type: 'NUMBER', description: '% pool para nivel 8 de regalías' },

  // ─── MLM — BONO SEMILLA ─────────────────────────────────────
  { key: 'mlm_seed_preferente_n1', value: '10', type: 'NUMBER', description: 'Bono semilla Preferente nivel 1 (USD)' },
  { key: 'mlm_seed_pionero_n1', value: '43', type: 'NUMBER', description: 'Bono semilla Pionero nivel 1 (USD)' },
  { key: 'mlm_seed_upgrade_n1', value: '33', type: 'NUMBER', description: 'Bono semilla Upgrade nivel 1 (USD)' },
  { key: 'mlm_seed_pionero_n2_8', value: '1', type: 'NUMBER', description: 'Bono semilla Pionero niveles 2-8 (USD)' },
  { key: 'mlm_seed_upgrade_n2_8', value: '1', type: 'NUMBER', description: 'Bono semilla Upgrade niveles 2-8 (USD)' },

  // ─── MLM — ACTIVACIÓN ROLLING ───────────────────────────────
  { key: 'mlm_activation_rolling_days', value: '30', type: 'NUMBER', description: 'Ventana rolling para activación (días)' },
  { key: 'mlm_activation_min_points', value: '50', type: 'NUMBER', description: 'Puntos mínimos para activación rolling' },

  // ─── MLM — RANGOS ───────────────────────────────────────────
  { key: 'mlm_rank_35_rule_enabled', value: 'true', type: 'BOOLEAN', description: 'Activar regla del 35% en cálculo de rangos' },
  { key: 'mlm_rank_35_base_points', value: '2500', type: 'NUMBER', description: 'Base de puntos para calcular límite 35%' },
  { key: 'rank_plata_points', value: '500', type: 'NUMBER', description: 'Puntos requeridos para Rango Plata' },
  { key: 'rank_plata_bonus', value: '50', type: 'NUMBER', description: 'Bono mensual Rango Plata (USD)' },
  { key: 'rank_oro_points', value: '1200', type: 'NUMBER', description: 'Puntos requeridos para Rango Oro' },
  { key: 'rank_oro_bonus', value: '120', type: 'NUMBER', description: 'Bono mensual Rango Oro (USD)' },
  { key: 'rank_zafiro_points', value: '2500', type: 'NUMBER', description: 'Puntos requeridos para Rango Zafiro' },
  { key: 'rank_zafiro_bonus', value: '300', type: 'NUMBER', description: 'Bono mensual Rango Zafiro (USD)' },
  { key: 'rank_esmeralda_points', value: '5000', type: 'NUMBER', description: 'Puntos requeridos para Rango Esmeralda' },
  { key: 'rank_esmeralda_bonus', value: '600', type: 'NUMBER', description: 'Bono mensual Rango Esmeralda (USD)' },
  { key: 'rank_rubi_points', value: '10000', type: 'NUMBER', description: 'Puntos requeridos para Rango Rubí' },
  { key: 'rank_rubi_bonus', value: '1200', type: 'NUMBER', description: 'Bono mensual Rango Rubí (USD)' },
  { key: 'rank_diamante_points', value: '25000', type: 'NUMBER', description: 'Puntos requeridos para Rango Diamante' },
  { key: 'rank_diamante_bonus', value: '3000', type: 'NUMBER', description: 'Bono mensual Rango Diamante (USD)' },
  { key: 'rank_diamante_azul_points', value: '60000', type: 'NUMBER', description: 'Puntos requeridos para Rango Diamante Azul' },
  { key: 'rank_diamante_azul_bonus', value: '8000', type: 'NUMBER', description: 'Bono mensual Rango Diamante Azul (USD)' },

  // ─── MEMBRESÍAS ─────────────────────────────────────────────
  { key: 'membership_preferente_price', value: '99', type: 'NUMBER', description: 'Precio membresía Preferente (USD)' },
  { key: 'membership_pionero_price', value: '199', type: 'NUMBER', description: 'Precio membresía Pionero (USD)' },
  { key: 'membership_upgrade_price', value: '100', type: 'NUMBER', description: 'Precio Upgrade Preferente→Pionero (USD)' },
  { key: 'membership_pionero_duration_days', value: '365', type: 'NUMBER', description: 'Duración membresía Pionero (días)' },
  { key: 'membership_preferente_duration_days', value: '365', type: 'NUMBER', description: 'Duración membresía Preferente (días)' },
  { key: 'membership_auto_renew_enabled', value: 'false', type: 'BOOLEAN', description: 'Renovación automática de membresías' },
  { key: 'membership_grace_period_days', value: '7', type: 'NUMBER', description: 'Días de gracia post-vencimiento' },

  // ─── MARKETPLACE ────────────────────────────────────────────
  { key: 'marketplace_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar módulo marketplace' },
  { key: 'marketplace_commission_provider_pct', value: '85', type: 'NUMBER', description: '% que recibe el proveedor por venta' },
  { key: 'marketplace_commission_saidon_pct', value: '15', type: 'NUMBER', description: '% que retiene SaidonClub del marketplace' },
  { key: 'marketplace_min_price', value: '5', type: 'NUMBER', description: 'Precio mínimo de producto (USD)' },
  { key: 'marketplace_max_price', value: '10000', type: 'NUMBER', description: 'Precio máximo de producto (USD)' },
  { key: 'marketplace_product_approval_required', value: 'true', type: 'BOOLEAN', description: 'Productos requieren aprobación admin' },
  { key: 'marketplace_stock_alert_threshold', value: '5', type: 'NUMBER', description: 'Alerta cuando stock baje de este número' },
  { key: 'marketplace_points_ratio', value: '0.1', type: 'NUMBER', description: 'Puntos generados por cada USD de compra' },

  // ─── CIERRE SEMANAL ─────────────────────────────────────────
  { key: 'closure_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar cierre semanal automático' },
  { key: 'closure_day_of_week', value: '5', type: 'NUMBER', description: 'Día del cierre (5 = Viernes)' },
  { key: 'closure_hour_utc', value: '22', type: 'NUMBER', description: 'Hora UTC del cierre (22 = 17:00 Ecuador)' },
  { key: 'closure_notify_admin', value: 'true', type: 'BOOLEAN', description: 'Notificar al admin al completar cierre' },
  { key: 'closure_auto_pay_threshold', value: '10', type: 'NUMBER', description: 'Monto mínimo para pago automático (USD)' },

  // ─── PAGOS & RETIROS ────────────────────────────────────────
  { key: 'payment_min_withdrawal', value: '20', type: 'NUMBER', description: 'Monto mínimo de retiro (USD)' },
  { key: 'payment_max_withdrawal', value: '5000', type: 'NUMBER', description: 'Monto máximo de retiro por semana (USD)' },
  { key: 'payment_withdrawal_fee_pct', value: '5', type: 'NUMBER', description: '% comisión por retiro' },
  { key: 'payment_withdrawal_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar retiros del sistema' },
  { key: 'payment_paypal_enabled', value: 'false', type: 'BOOLEAN', description: '* Habilitar pago con PayPal' },
  { key: 'payment_stripe_enabled', value: 'false', type: 'BOOLEAN', description: '* Habilitar pago con Stripe' },
  { key: 'payment_bank_transfer_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar transferencia bancaria' },

  // ─── NOTIFICACIONES ─────────────────────────────────────────
  { key: 'notif_email_enabled', value: 'true', type: 'BOOLEAN', description: 'Habilitar notificaciones por email' },
  { key: 'notif_telegram_enabled', value: 'false', type: 'BOOLEAN', description: '* Habilitar notificaciones por Telegram' },
  { key: 'notif_push_enabled', value: 'false', type: 'BOOLEAN', description: '* Habilitar notificaciones push' },
  { key: 'notif_admin_email', value: 'admin@saidonclub.com', type: 'STRING', description: '* Email del administrador para alertas' },
  { key: 'notif_from_email', value: 'noreply@saidonclub.com', type: 'STRING', description: '* Email remitente del sistema' },

  // ─── SEGURIDAD ──────────────────────────────────────────────
  { key: 'security_max_login_attempts', value: '5', type: 'NUMBER', description: 'Intentos fallidos antes de bloqueo' },
  { key: 'security_lockout_minutes', value: '30', type: 'NUMBER', description: 'Minutos de bloqueo por intentos fallidos' },
  { key: 'security_session_hours', value: '24', type: 'NUMBER', description: 'Duración de sesión en horas' },
  { key: 'security_2fa_required_admin', value: 'true', type: 'BOOLEAN', description: '2FA obligatorio para administradores' },
  { key: 'security_2fa_required_provider', value: 'false', type: 'BOOLEAN', description: '2FA obligatorio para proveedores' },

  // ─── UI / DISEÑO ────────────────────────────────────────────
  { key: 'ui_theme_primary', value: '#F97316', type: 'STRING', description: 'Color primario del sistema (Orange 500)' },
  { key: 'ui_theme_dark_bg', value: '#0A0A0A', type: 'STRING', description: 'Color de fondo oscuro base' },
  { key: 'ui_logo_url', value: '/logotipo.png', type: 'STRING', description: 'URL del logo principal' },
  { key: 'ui_favicon_url', value: '/favicon.ico', type: 'STRING', description: 'URL del favicon' },
  { key: 'ui_items_per_page', value: '12', type: 'NUMBER', description: 'Items por página en listados' },

  // ─── CACHÉ & PERFORMANCE ────────────────────────────────────
  { key: 'cache_config_ttl_seconds', value: '60', type: 'NUMBER', description: 'TTL del caché de configuración (segundos)' },
  { key: 'cache_products_ttl_seconds', value: '300', type: 'NUMBER', description: 'TTL del caché de productos (segundos)' },
  { key: 'cache_rankings_ttl_seconds', value: '3600', type: 'NUMBER', description: 'TTL del caché de rankings (segundos)' },
];

async function main() {
  console.log('🌱 Iniciando seed de SystemConfig...');

  let created = 0;
  let updated = 0;

  for (const cfg of configs) {
    const existing = await prisma.systemConfig.findUnique({ where: { key: cfg.key } });

    // Mapear prefijo de clave a ConfigCategory del enum
    const prefix = cfg.key.split('_')[0].toUpperCase();
    const categoryMap: Record<string, string> = {
      SYSTEM: 'GENERAL',
      MLM: 'MLM',
      RANK: 'MLM',
      MEMBERSHIP: 'MEMBERSHIP',
      MARKETPLACE: 'MARKETPLACE',
      CLOSURE: 'GENERAL',
      PAYMENT: 'PAYMENTS',
      NOTIF: 'NOTIFICATIONS',
      SECURITY: 'SECURITY',
      UI: 'UI',
      CACHE: 'GENERAL',
    };
    const category = (categoryMap[prefix] ?? 'GENERAL') as any;

    await prisma.systemConfig.upsert({
      where: { key: cfg.key },
      update: { description: cfg.description }, // Solo actualiza descripción, NO el valor
      create: {
        key: cfg.key,
        value: cfg.value,
        type: cfg.type as any,
        description: cfg.description,
        category,
      },
    });

    existing ? updated++ : created++;
  }

  console.log(`✅ Seed completado: ${created} creados, ${updated} actualizados`);
  console.log(`📊 Total de configuraciones: ${configs.length}`);
  console.log(`⚠️  Recuerda configurar los valores marcados con * antes del go-live.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
