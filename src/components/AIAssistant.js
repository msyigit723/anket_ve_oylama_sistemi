'use client';

import { useState, useCallback } from 'react';
import styles from './AIAssistant.module.css';

// AI-simulated suggestions (would be Gemini API in production)
const AI_SUGGESTIONS = [
  {
    topic: 'Teknoloji',
    suggestions: [
      { question: 'Hangi yapay zeka aracını günlük işlerinizde en çok kullanıyorsunuz?', options: ['ChatGPT', 'Gemini', 'Copilot', 'Claude'] },
      { question: 'Tercih ettiğiniz kod editörü hangisi?', options: ['VS Code', 'JetBrains', 'Vim/Neovim', 'Zed'] },
      { question: '2026 yılının en önemli teknoloji trendi ne olacak?', options: ['AI Agents', 'Kuantum Bilişim', 'AR/VR', 'Web3'] },
    ],
  },
  {
    topic: 'İş Hayatı',
    suggestions: [
      { question: 'İdeal çalışma modeli sizce hangisi?', options: ['Tam uzaktan', 'Hibrit (3+2)', 'Esnek ofis', 'Tam zamanlı ofis'] },
      { question: 'Bir iş görüşmesinde en çok neye dikkat edersiniz?', options: ['Maaş', 'Şirket kültürü', 'Uzaktan çalışma', 'Kariyer fırsatları'] },
    ],
  },
  {
    topic: 'Yaşam Tarzı',
    suggestions: [
      { question: 'Sabah rutininizde ilk ne yaparsınız?', options: ['Kahve/çay içerim', 'Egzersiz yaparım', 'Telefona bakarım', 'Duş alırım'] },
      { question: 'Hafta sonu tatili için nereyi tercih edersiniz?', options: ['Doğa/Kamp', 'Şehir turu', 'Deniz/Plaj', 'Evde dinlenme'] },
    ],
  },
];

export default function AIAssistant({ isOpen, onClose, onApply }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);

    // Simulate AI thinking time
    await new Promise(r => setTimeout(r, 1500));

    const found = AI_SUGGESTIONS.find(s => s.topic === topic);
    setResults(found?.suggestions || []);
    setLoading(false);
  };

  const handleApply = (suggestion) => {
    if (onApply) onApply(suggestion);
    onClose();
    setSelectedTopic(null);
    setResults(null);
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setResults(null);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.aiIcon}>🤖</span>
            <div>
              <h2 className={styles.title}>AI Anket Asistanı</h2>
              <p className={styles.subtitle}>Yapay zeka destekli anket önerileri</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Topic Selection */}
          {!selectedTopic && !loading && (
            <>
              <p className={styles.prompt}>Bir konu seçin, AI size anket önerileri oluştursun:</p>
              <div className={styles.topicGrid}>
                {AI_SUGGESTIONS.map(s => (
                  <button
                    key={s.topic}
                    className={styles.topicCard}
                    onClick={() => handleGenerate(s.topic)}
                  >
                    <span className={styles.topicEmoji}>
                      {s.topic === 'Teknoloji' ? '💻' : s.topic === 'İş Hayatı' ? '💼' : '🌱'}
                    </span>
                    <span className={styles.topicLabel}>{s.topic}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Loading */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.aiThinking}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <p className={styles.loadingText}>AI düşünüyor…</p>
              <p className={styles.loadingSubtext}>"{selectedTopic}" konusunda anketler oluşturuluyor</p>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <>
              <div className={styles.resultHeader}>
                <button className={styles.backBtn} onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Geri
                </button>
                <span className={styles.resultBadge}>✨ {results.length} öneri</span>
              </div>
              <div className={styles.resultsList}>
                {results.map((r, i) => (
                  <div key={i} className={styles.resultCard}>
                    <div className={styles.resultQ}>{r.question}</div>
                    <div className={styles.resultOptions}>
                      {r.options.map((o, j) => (
                        <span key={j} className={styles.resultOption}>{o}</span>
                      ))}
                    </div>
                    <button className={styles.applyBtn} onClick={() => handleApply(r)}>
                      Kullan
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.poweredBy}>Powered by AI ✨</span>
        </div>
      </div>
    </div>
  );
}
