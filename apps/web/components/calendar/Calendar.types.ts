// ============================================================
// TYPES: Calendar Appointment Types
// PURPOSE: Shared types for calendar and appointments
// ============================================================

export interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone?: string;
  serviceName: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  location?: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface CalendarConfig {
  minDate?: Date;
  maxDate?: Date;
  workingHours: { start: string; end: string };
  availableSlots: string[];
  slotDuration: number; // in minutes
}

export type CalendarView = "month" | "week" | "day";

export type AppointmentStatus = 
  | "pending" 
  | "confirmed" 
  | "in_progress" 
  | "completed" 
  | "cancelled" 
  | "no_show";

export interface AppointmentAction {
  type: "accept" | "reject" | "reschedule" | "complete" | "cancel";
  appointmentId: string;
  newDate?: Date;
  reason?: string;
}