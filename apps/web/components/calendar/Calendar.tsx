// ============================================================
// COMPONENT: Interactive Calendar
// PURPOSE: Display and manage appointments in a calendar view
// FEATURES: Month/week/day views, time slots, availability
// ============================================================

"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Appointment } from "./Calendar.types";
import styles from "./Calendar.module.css";

interface CalendarProps {
  appointments?: Appointment[];
  onDateSelect?: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  view?: "month" | "week" | "day";
  minDate?: Date;
  maxDate?: Date;
  selectable?: boolean;
  showTimeSlots?: boolean;
  availableSlots?: string[];
}

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export type { Appointment } from "./Calendar.types";
export default function Calendar({
  appointments = [],
  onDateSelect,
  onAccept,
  onReject,
  view = "month",
  minDate,
  maxDate,
  selectable = true,
  showTimeSlots = true,
  availableSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState(view);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isSelected = (date: Date) => selectedDate?.toDateString() === date.toDateString();
  const isPast = (date: Date) => date < today;
  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    onDateSelect?.(date);
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
  };

  const days = getDaysInMonth(currentDate);

  const statusColors = {
    pending: styles.statusPending,
    confirmed: styles.statusConfirmed,
    completed: styles.statusCompleted,
    cancelled: styles.statusCancelled,
  };

  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button onClick={() => navigateMonth(-1)} className={styles.navBtn}>
            <ChevronLeft size={20} />
          </button>
          <h2 className={styles.monthYear}>
            {MONTHS_ES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => navigateMonth(1)} className={styles.navBtn}>
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${calendarView === "month" ? styles.active : ""}`}
            onClick={() => setCalendarView("month")}
          >
            Mes
          </button>
          <button
            className={`${styles.viewBtn} ${calendarView === "week" ? styles.active : ""}`}
            onClick={() => setCalendarView("week")}
          >
            Semana
          </button>
          <button
            className={`${styles.viewBtn} ${calendarView === "day" ? styles.active : ""}`}
            onClick={() => setCalendarView("day")}
          >
            Día
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className={styles.dayHeaders}>
        {DAYS_ES.map(day => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={styles.grid}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className={styles.emptyCell} />;
          }
          
          const dayAppointments = getAppointmentsForDate(date);
          const disabled = isDisabled(date);
          const past = isPast(date);
          
          return (
            <motion.div
              key={date.toISOString()}
              className={`
                ${styles.dayCell}
                ${isToday(date) ? styles.today : ""}
                ${isSelected(date) ? styles.selected : ""}
                ${disabled ? styles.disabled : ""}
                ${past ? styles.past : ""}
              `}
              onClick={() => !disabled && handleDateClick(date)}
              whileHover={!disabled ? { scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
            >
              <span className={styles.dayNumber}>{date.getDate()}</span>
              
              {dayAppointments.length > 0 && (
                <div className={styles.appointmentDots}>
                  {dayAppointments.slice(0, 3).map(apt => (
                    <span
                      key={apt.id}
                      className={`${styles.dot} ${statusColors[apt.status]}`}
                      title={apt.title}
                    />
                  ))}
                  {dayAppointments.length > 3 && (
                    <span className={styles.moreIndicator}>+{dayAppointments.length - 3}</span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.selectedDetails}
          >
            <div className={styles.detailsHeader}>
              <CalendarIcon size={20} />
              <h3>
                {selectedDate.getDate()} de {MONTHS_ES[selectedDate.getMonth()]} de {selectedDate.getFullYear()}
              </h3>
            </div>

            {/* Time Slots */}
            {selectable && showTimeSlots && !isPast(selectedDate) && (
              <div className={styles.timeSlots}>
                <h4>Horarios disponibles</h4>
                <div className={styles.slotsGrid}>
                  {availableSlots.map(slot => {
                    const isBooked = getAppointmentsForDate(selectedDate).some(
                      apt => apt.startTime === slot
                    );
                    return (
                      <button
                        key={slot}
                        className={`
                          ${styles.slotBtn}
                          ${isBooked ? styles.booked : ""}
                          ${selectedSlot === slot ? styles.selectedSlot : ""}
                        `}
                        onClick={() => !isBooked && handleSlotClick(slot)}
                        disabled={isBooked}
                      >
                        <Clock size={14} />
                        {slot}
                        {isBooked && <span className={styles.bookedLabel}>Ocupado</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appointments List */}
            <div className={styles.appointmentsList}>
              <h4>Citas del día ({getAppointmentsForDate(selectedDate).length})</h4>
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <p className={styles.noAppointments}>No hay citas programadas</p>
              ) : (
                <div className={styles.appointmentsGrid}>
                  {getAppointmentsForDate(selectedDate).map(apt => (
                    <div key={apt.id} className={styles.appointmentCard}>
                      <div className={styles.appointmentHeader}>
                        <span className={`${styles.status} ${statusColors[apt.status]}`}>
                          {statusLabels[apt.status]}
                        </span>
                        <span className={styles.time}>
                          <Clock size={12} />
                          {apt.startTime} - {apt.endTime}
                        </span>
                      </div>
                      
                      <h5 className={styles.aptTitle}>{apt.title}</h5>
                      <p className={styles.aptService}>{apt.serviceName}</p>
                      
                      <div className={styles.aptDetails}>
                        <span><User size={12} /> {apt.clientName}</span>
                        {apt.location && (
                          <span><MapPin size={12} /> {apt.location}</span>
                        )}
                      </div>

                      {apt.notes && (
                        <p className={styles.aptNotes}>{apt.notes}</p>
                      )}

                      {/* Action Buttons */}
                      {(onAccept || onReject) && apt.status === "pending" && (
                        <div className={styles.aptActions}>
                          {onAccept && (
                            <button
                              onClick={() => onAccept(apt.id)}
                              className={styles.acceptBtn}
                              title="Aceptar cita"
                            >
                              <Check size={16} />
                              Aceptar
                            </button>
                          )}
                          {onReject && (
                            <button
                              onClick={() => onReject(apt.id)}
                              className={styles.rejectBtn}
                              title="Rechazar cita"
                            >
                              <X size={16} />
                              Rechazar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.statusPending}`} />
          Pendiente
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.statusConfirmed}`} />
          Confirmado
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.statusCompleted}`} />
          Completado
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.statusCancelled}`} />
          Cancelado
        </span>
      </div>
    </div>
  );
}