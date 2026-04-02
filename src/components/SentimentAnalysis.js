'use client';

import { useState } from 'react';
import styles from './SentimentAnalysis.module.css';

// Simulated sentiment analysis (would be Gemini API in production)
const SENTIMENT_RESULTS = {
  positive: {
    label: 'Pozitif',
    icon: '😊',
    color: 'green',
    summary: 'Kullanıcıların genel eğilimi pozitif. Yorumlar büyük ölçüde olumlu ifadeler içeriyor ve konuya yönelik ilgi yüksek.',
  },
  neutral: {
    label: 'Nötr',
    icon: '😐',
    color: 'blue',
    summary: 'Kullanıcı yorumları dengeli bir dağılım gösteriyor. Hem olumlu hem de eleştirel bakış açıları mevcut.',
  },
  negative: {
    label: 'Negatif',
    icon: '😔',
    color: 'red',
    summary: 'Kullanıcılar bu konuda olumsuz bir eğilim gösteriyor. Eleştiriler ve şikayetler ağırlıkta.',
  },
};

const KEYWORD_MAP = {
  positive: ['harika', 'mükemmel', 'en iyi', 'güzel', 'kesinlikle', 'seviyorum', 'kazanır', 'keyifli'],
  negative: ['kötü', 'berbat', 'spam', 'buy', 'cheap', 'başarısız'],
};

function analyzeSentiment(comments) {
  if (!comments || comments.length === 0) return null;

  let positiveScore = 0;
  let negativeScore = 0;

  comments.forEach(c => {
    const text = c.text.toLowerCase();
    KEYWORD_MAP.positive.forEach(kw => { if (text.includes(kw)) positiveScore++; });
    KEYWORD_MAP.negative.forEach(kw => { if (text.includes(kw)) negativeScore++; });
  });

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

export default function SentimentAnalysis({ comments }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1800));
    const sentiment = analyzeSentiment(comments);
    setResult(SENTIMENT_RESULTS[sentiment]);
    setLoading(false);
  };

  if (!comments || comments.length === 0) return null;

  return (
    <div className={styles.container}>
      {!result && !loading && (
        <button className={styles.analyzeBtn} onClick={handleAnalyze}>
          <span className={styles.sparkle}>✨</span>
          AI Duygu Analizi
        </button>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.brain}>🧠</div>
          <span className={styles.loadText}>Yorumlar analiz ediliyor…</span>
        </div>
      )}

      {result && (
        <div className={`${styles.result} ${styles[result.color]}`}>
          <div className={styles.resultHeader}>
            <span className={styles.resultIcon}>{result.icon}</span>
            <span className={styles.resultLabel}>Genel Eğilim: <strong>{result.label}</strong></span>
          </div>
          <p className={styles.resultSummary}>{result.summary}</p>
          <button className={styles.resetBtn} onClick={() => setResult(null)}>
            Tekrar Analiz Et
          </button>
        </div>
      )}
    </div>
  );
}
