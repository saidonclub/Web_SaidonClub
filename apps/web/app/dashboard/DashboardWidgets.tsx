import { ReactNode } from 'react';
import styles from './DashboardWidgets.module.css';
import { ChevronRight, MoreVertical, Maximize2, X } from 'lucide-react';

interface SmallBoxProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  link?: string;
}

export function SmallBox({ label, value, icon, color, trend, link }: SmallBoxProps) {
  return (
    <div className={styles.smallBox} style={{ '--accent-color': color } as any}>
      <div className={styles.smallBoxInner}>
        <div className={styles.smallBoxInfo}>
          <span className={styles.smallBoxLabel}>{label}</span>
          <h3 className={styles.smallBoxValue}>{value}</h3>
          {trend && (
            <div className={`${styles.smallBoxTrend} ${trend.isUp ? styles.up : styles.down}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        <div className={styles.smallBoxIcon}>
          {icon}
        </div>
      </div>
      {link && (
        <a href={link} className={styles.smallBoxFooter}>
          Ver más <ChevronRight size={14} />
        </a>
      )}
    </div>
  );
}

interface InfoCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function InfoCard({ title, icon, children, footer, className }: InfoCardProps) {
  return (
    <div className={`${styles.infoCard} ${className || ''}`}>
      <div className={styles.infoCardHeader}>
        <div className={styles.infoCardTitle}>
          {icon && <span className={styles.infoCardIcon}>{icon}</span>}
          <h3>{title}</h3>
        </div>
        <div className={styles.infoCardTools}>
          <button className={styles.toolBtn}><Maximize2 size={14} /></button>
          <button className={styles.toolBtn}><X size={14} /></button>
        </div>
      </div>
      <div className={styles.infoCardBody}>
        {children}
      </div>
      {footer && <div className={styles.infoCardFooter}>{footer}</div>}
    </div>
  );
}

export function Timeline({ items }: { items: { date: string, title: string, description: string, type: string }[] }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.timelineItem}>
          <div className={`${styles.timelineBadge} ${styles[item.type] || ''}`} />
          <div className={styles.timelineContent}>
            <span className={styles.timelineDate}>{item.date}</span>
            <h4 className={styles.timelineTitle}>{item.title}</h4>
            <p className={styles.timelineDesc}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentOrdersTable({ orders }: { orders: any[] }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estado</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><span className={styles.orderId}>#{order.id.slice(0, 8)}</span></td>
              <td>
                <span className={`${styles.badge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.itemCount}</td>
              <td className={styles.amount}>${order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MiniChart({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data, 1);
  const height = 40;
  const width = 100;
  const step = width / (data.length - 1);
  
  const points = data.map((val, i) => `${i * step},${height - (val / max) * height}`).join(' ');

  return (
    <div className={styles.miniChart}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
      </svg>
    </div>
  );
}
