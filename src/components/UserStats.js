'use client';

import { useGamification } from '@/context/GamificationProvider';
import styles from './UserStats.module.css';

export default function UserStats() {
  const { points, totalVotes, totalCreated, badges, earnedBadges } = useGamification();

  return (
    <div className={styles.container}>
      {/* Points Section */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚡</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{points}</span>
            <span className={styles.statLabel}>Puan</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🗳️</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalVotes}</span>
            <span className={styles.statLabel}>Oy</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📝</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalCreated}</span>
            <span className={styles.statLabel}>Anket</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className={styles.badgesSection}>
        <h3 className={styles.badgesTitle}>Rozetler</h3>
        <div className={styles.badgesGrid}>
          {badges.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`${styles.badge} ${isEarned ? styles.earned : styles.locked}`}
                title={`${badge.name}: ${badge.description}`}
              >
                <span className={styles.badgeIcon}>{isEarned ? badge.icon : '🔒'}</span>
                <span className={styles.badgeName}>{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
