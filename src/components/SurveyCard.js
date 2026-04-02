'use client';

import { useState, useEffect, useCallback } from 'react';
import CountdownTimer from './CountdownTimer';
import ShareButtons from './ShareButtons';
import CommentSection from './CommentSection';
import styles from './SurveyCard.module.css';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function SurveyCard({ survey, onVote }) {
  const storageKey = `voted-survey-${survey.id}`;
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [localVotes, setLocalVotes] = useState(survey.options.map((o) => o.votes));
  const [expired, setExpired] = useState(false);

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
      <h3 className={styles.question}>{survey.question}</h3>

      <div className={styles.meta}>
        <span>👤 {survey.author}</span>
        <span>🕐 {getTimeAgo(survey.createdAt)}</span>
        <span>📊 {totalVotes} oy</span>
      </div>

      {/* Countdown Timer */}
      {survey.expiresAt && (
        <CountdownTimer expiresAt={survey.expiresAt} onExpire={handleExpire} />
      )}

      <div className={styles.options}>
        {survey.options.map((option, i) => {
          const pct = totalVotes > 0 ? Math.round((localVotes[i] / totalVotes) * 100) : 0;
          const isWinner = voted && localVotes[i] === maxVotes && totalVotes > 0;

          return voted ? (
            <div
              key={i}
              className={`${styles.resultOption} ${isWinner ? styles.winner : ''} ${
                selectedOption === i ? styles.selected : ''
              }`}
            >
              <div className={styles.resultBar} style={{ width: `${pct}%` }} />
              <div className={styles.optLetter}>{LETTERS[i]}</div>
              <span className={styles.optText}>{option.text}</span>
              <div className={styles.resultInfo}>
                {isWinner && <span className={styles.crown}>👑</span>}
                <span className={styles.resultPct}>{pct}%</span>
                <span className={styles.resultCnt}>{localVotes[i]} oy</span>
              </div>
            </div>
          ) : (
            <button
              key={i}
              className={`${styles.voteOption} ${expired ? styles.disabled : ''}`}
              onClick={() => handleVote(i)}
              disabled={expired}
            >
              <div className={styles.optLetter}>{LETTERS[i]}</div>
              <span className={styles.optText}>{option.text}</span>
              <span className={styles.optHint}>{expired ? 'Sona erdi' : 'Oy ver'}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span className={styles.footInfo}>
          {expired ? '⏰ Anket sona erdi' : voted ? '✅ Oyunuz kaydedildi' : `${survey.options.length} seçenek`}
        </span>
        <ShareButtons survey={survey} />
      </div>

      <CommentSection surveyId={survey.id} />
    </div>
  );
}
