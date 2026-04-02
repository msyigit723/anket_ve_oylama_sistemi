'use client';

import { useEffect } from 'react';
import { useGamification } from '@/context/GamificationProvider';
import styles from './BadgeToast.module.css';

export default function BadgeToast() {
  const { newBadge, clearNewBadge } = useGamification();

  useEffect(() => {
    if (newBadge) {
      const timer = setTimeout(clearNewBadge, 4000);
      return () => clearTimeout(timer);
    }
  }, [newBadge, clearNewBadge]);

  if (!newBadge) return null;

  return (
    <div className={styles.overlay} onClick={clearNewBadge}>
      <div className={styles.toast}>
        <div className={styles.confetti}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={styles.particle} style={{
              '--angle': `${(i * 30)}deg`,
              '--delay': `${i * 0.05}s`,
              '--color': ['#6c5ce7', '#a78bfa', '#f59e0b', '#10b981', '#ef4444', '#6dd5ed'][i % 6],
            }} />
          ))}
        </div>
        <div className={styles.icon}>{newBadge.icon}</div>
        <div className={styles.content}>
          <span className={styles.label}>Yeni Rozet Kazandın!</span>
          <span className={styles.name}>{newBadge.name}</span>
          <span className={styles.desc}>{newBadge.description}</span>
        </div>
      </div>
    </div>
  );
}
