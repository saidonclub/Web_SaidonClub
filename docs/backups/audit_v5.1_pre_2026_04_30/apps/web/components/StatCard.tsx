// ============================================================
// MODULE:     components/admin/StatCard
// PURPOSE:    Card de estadísticas para dashboards administrativos
// ============================================================

import Link from 'next/link';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: number | string;
  href?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'cyan' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorMap = {
  blue: styles.colorBlue,
  orange: styles.colorOrange,
  green: styles.colorGreen,
  red: styles.colorRed,
  purple: styles.colorPurple,
  cyan: styles.colorCyan,
  yellow: styles.colorYellow,
};

export function StatCard({
  title,
  value,
  href,
  icon,
  color = 'blue',
  trend,
}: StatCardProps) {
  const cardContent = (
    <div className={`${styles.card} ${colorMap[color]}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span
            className={`${styles.trend} ${trend.isPositive ? styles.trendUp : styles.trendDown}`}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
