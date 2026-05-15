import React from "react";
import styles from "./PageBanner.module.css";
import { LucideIcon } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  icon?: LucideIcon;
  stats?: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[];
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  image,
  icon: Icon,
  stats,
}) => {
  return (
    <header className={styles.banner}>
      <div 
        className={styles.bgImage} 
        style={{ backgroundImage: `url(${image})` }} 
      />
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          {Icon && (
            <div className={styles.iconBox}>
              <Icon size={32} />
            </div>
          )}
          <div className={styles.text}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.statItem}>
                <stat.icon size={16} className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageBanner;
