// ============================================================
// MODULE:     components/admin/StatCard
// PURPOSE:    Card de estadísticas para dashboards administrativos (AdminLTE Style)
// ============================================================

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <div className={`${styles.smallBox} ${colorMap[color]}`}>
      <div className={styles.inner}>
        <div className={styles.valueRow}>
          <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          {trend && (
            <span
              className={`${styles.trend} ${trend.isPositive ? styles.trendUp : styles.trendDown}`}
            >
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p>{title}</p>
      </div>
      {icon && <div className={styles.icon}>{icon}</div>}
      {href ? (
        <Link href={href} className={styles.smallBoxFooter}>
          Más información <ArrowRight size={16} className={styles.footerIcon} />
        </Link>
      ) : (
        <div className={styles.smallBoxFooterEmpty}></div>
      )}
    </div>
  );

  return cardContent;
}
