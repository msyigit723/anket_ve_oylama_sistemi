'use client';

import { useState, useEffect, useCallback } from 'react';
import CountdownTimer from './CountdownTimer';
import ShareButtons from './ShareButtons';
import CommentSection from './CommentSection';
import styles from './ImageSurveyCard.module.css';

export default function ImageSurveyCard({ survey, onVote }) {
  const storageKey = `voted-survey-${survey.id}`;
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [localVotes, setLocalVotes] = useState(survey.options.map((o) => o.votes));
  const [expired, setExpired] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  const totalVotes = localVotes.reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(...localVotes);

  // Check if already voted
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setVoted(true);
      setSelectedOption(parseInt(stored, 10));
    }
  }, [storageKey]);

  // Animate results after voting
  useEffect(() => {
    if (voted) {
      const t = setTimeout(() => setAnimateResults(true), 100);
      return () => clearTimeout(t);
    }
  }, [voted]);

  const handleVote = useCallback((index) => {
    if (voted || expired) return;

    setSelectedOption(index);
    setVoted(true);
    setLocalVotes((prev) => prev.map((v, i) => (i === index ? v + 1 : v)));
    localStorage.setItem(storageKey, index.toString());

    if (onVote) onVote(survey.id, index);
  }, [voted, expired, storageKey, survey.id, onVote]);

  const handleExpire = useCallback(() => {
    setExpired(true);
  }, []);

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.question}>{survey.question}</h3>
          <div className={styles.meta}>
            <span>👤 {survey.author}</span>
            <span>🕐 {getTimeAgo(survey.createdAt)}</span>
            <span>📊 {totalVotes} oy</span>
          </div>
        </div>
        <span className={styles.typeBadge}>📸 Resimli</span>
      </div>

      {/* Countdown */}
      {survey.expiresAt && (
        <CountdownTimer expiresAt={survey.expiresAt} onExpire={handleExpire} />
      )}

      {/* Image Grid */}
      <div className={`${styles.grid} ${survey.options.length === 2 ? styles.grid2 : styles.grid4}`}>
        {survey.options.map((option, i) => {
          const pct = totalVotes > 0 ? Math.round((localVotes[i] / totalVotes) * 100) : 0;
          const isWinner = voted && localVotes[i] === maxVotes && totalVotes > 0;
          const isSelected = selectedOption === i;

          return (
            <div
              key={i}
              className={`${styles.imageOption} ${voted ? styles.revealed : ''} ${isWinner ? styles.winner : ''} ${isSelected ? styles.selected : ''} ${expired && !voted ? styles.disabled : ''}`}
              onClick={() => !voted && !expired && handleVote(i)}
            >
              <div className={styles.imageContainer}>
                <img
                  src={option.image}
                  alt={option.text}
                  className={styles.image}
                  draggable={false}
                />
                {/* Hover overlay for voting */}
                {!voted && !expired && (
                  <div className={styles.overlay}>
                    <span className={styles.voteLabel}>Oy Ver</span>
                  </div>
                )}
                {/* Winner crown */}
                {isWinner && voted && (
                  <div className={styles.crownBadge}>👑</div>
                )}
                {/* Selected check */}
                {isSelected && voted && (
                  <div className={styles.checkBadge}>✓</div>
                )}
              </div>

              {/* Label */}
              <div className={styles.optionLabel}>
                <span className={styles.optionText}>{option.text}</span>
              </div>

              {/* Result bar */}
              {voted && (
                <div className={styles.resultArea}>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${isWinner ? styles.barWinner : ''}`}
                      style={{ width: animateResults ? `${pct}%` : '0%' }}
                    />
                  </div>
                  <div className={styles.resultStats}>
                    <span className={`${styles.pct} ${isWinner ? styles.pctWinner : ''}`}>{pct}%</span>
                    <span className={styles.cnt}>{localVotes[i]} oy</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footInfo}>
          {expired ? '⏰ Anket sona erdi' : voted ? '✅ Oyunuz kaydedildi' : `${survey.options.length} seçenek — Görsele tıklayarak oy verin`}
        </span>
        <ShareButtons survey={survey} />
      </div>

      <CommentSection surveyId={survey.id} />
    </div>
  );
}
