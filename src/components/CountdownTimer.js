'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './CountdownTimer.module.css';

export default function CountdownTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  const calculateTime = useCallback(() => {
    const now = Date.now();
    const end = new Date(expiresAt).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return null;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const totalHours = diff / (1000 * 60 * 60);

    return { days, hours, minutes, seconds, totalHours };
  }, [expiresAt]);

  useEffect(() => {
    const initial = calculateTime();
    if (!initial) {
      setExpired(true);
      if (onExpire) onExpire();
      return;
    }

    setTimeLeft(initial);

    const interval = setInterval(() => {
      const remaining = calculateTime();
      if (!remaining) {
        setExpired(true);
        setTimeLeft(null);
        if (onExpire) onExpire();
        clearInterval(interval);
        return;
      }
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTime, onExpire]);

  if (expired) {
    return (
      <div className={`${styles.timer} ${styles.expired}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Anket Sona Erdi</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  const isUrgent = timeLeft.totalHours < 1;
  const isWarning = timeLeft.totalHours < 24 && !isUrgent;

  const pad = (n) => n.toString().padStart(2, '0');

  return (
    <div className={`${styles.timer} ${isUrgent ? styles.urgent : ''} ${isWarning ? styles.warning : ''}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <div className={styles.segments}>
        {timeLeft.days > 0 && (
          <div className={styles.segment}>
            <span className={styles.value}>{timeLeft.days}</span>
            <span className={styles.label}>gün</span>
          </div>
        )}
        <div className={styles.segment}>
          <span className={styles.value}>{pad(timeLeft.hours)}</span>
          <span className={styles.label}>saat</span>
        </div>
        <div className={`${styles.separator} ${isUrgent ? styles.pulse : ''}`}>:</div>
        <div className={styles.segment}>
          <span className={styles.value}>{pad(timeLeft.minutes)}</span>
          <span className={styles.label}>dk</span>
        </div>
        <div className={`${styles.separator} ${isUrgent ? styles.pulse : ''}`}>:</div>
        <div className={styles.segment}>
          <span className={`${styles.value} ${isUrgent ? styles.pulse : ''}`}>{pad(timeLeft.seconds)}</span>
          <span className={styles.label}>sn</span>
        </div>
      </div>
    </div>
  );
}
