/**
 * @module SecurityLogger
 * @description Omega Forensic Event Logger.
 * Provides a traceable, non-repudiable audit trail of all critical system interactions.
 * Automatically triggers security alerts for high-severity events.
 * Logs are persisted to the Supabase 'event_logs' table for permanent audit.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendSecurityAlert } from "./security-alerts";

export type SecurityEvent = 
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_PASSWORD_CHANGE'
  | 'ADMIN_ACCESS'
  | 'DATA_EXPORT'
  | 'SECURITY_SETTING_CHANGE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'API_RATE_LIMIT_HIT';

// Eventos que disparan notificación inmediata al administrador
const CRITICAL_EVENTS: SecurityEvent[] = [
  'SUSPICIOUS_ACTIVITY',
  'API_RATE_LIMIT_HIT',
  'ADMIN_ACCESS'
];

/**
 * Registra un evento de seguridad en la base de datos para auditoría forense.
 * @param userId ID del usuario involucrado (null si es un evento de sistema).
 * @param eventType Tipo de evento de seguridad.
 * @param payload Datos adicionales del evento.
 * @param aggregateType Tipo de agregado (SYSTEM, USER, PRODUCT, etc.).
 * @returns true si el registro fue exitoso, false de lo contrario.
 */
export async function logSecurityEvent(
  userId: string | null,
  eventType: SecurityEvent,
  payload: Record<string, unknown>,
  aggregateType: string = 'SYSTEM'
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const { error } = await supabase
      .from('event_logs')
      .insert({
        user_id: userId,
        aggregate_type: aggregateType,
        event_type: eventType,
        payload,
        version: 1
      });

    // Enviar alerta inmediata si el evento es crítico
    if (CRITICAL_EVENTS.includes(eventType)) {
      await sendSecurityAlert(eventType, { userId, ...payload });
    }

    if (error) {
      console.error('[SECURITY_LOGGER_ERROR]:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[SECURITY_LOGGER_FATAL]:', err);
    return false;
  }
}
