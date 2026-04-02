'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import SurveyCard from '@/components/SurveyCard';
import ImageSurveyCard from '@/components/ImageSurveyCard';
import SurveyListSkeleton from '@/components/SurveyListSkeleton';
import UserStats from '@/components/UserStats';
import CreateSurveyModal from '@/components/CreateSurveyModal';
import LeadFormModal from '@/components/LeadFormModal';
import AIAssistant from '@/components/AIAssistant';
import { useGamification } from '@/context/GamificationProvider';
import { useToast } from '@/context/ToastProvider';
import styles from './page.module.css';

// Mock data — text surveys
const MOCK_TEXT_SURVEYS = [
  {
    id: 1,
    type: 'text',
    question: 'En çok hangi programlama dilini tercih ediyorsunuz?',
    author: 'Ahmet Yılmaz',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    options: [
      { text: 'JavaScript / TypeScript', votes: 42 },
      { text: 'Python', votes: 38 },
      { text: 'Java', votes: 15 },
      { text: 'Go / Rust', votes: 22 },
    ],
  },
  {
    id: 2,
    type: 'text',
    question: 'Uzaktan çalışma mı, ofisten çalışma mı?',
    author: 'Elif Demir',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 saat sonra
    options: [
      { text: 'Tam zamanlı uzaktan', votes: 58 },
      { text: 'Hibrit model', votes: 34 },
      { text: 'Tam zamanlı ofis', votes: 8 },
    ],
  },
];

// Mock data — image surveys
const MOCK_IMAGE_SURVEYS = [
  {
    id: 100,
    type: 'image',
    question: 'Tatil için hangi mekanı tercih edersiniz?',
    author: 'Seda Kaya',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    options: [
      { text: 'Sahil & Deniz', image: '/images/beach.png', votes: 45 },
      { text: 'Orman & Doğa', image: '/images/forest.png', votes: 32 },
      { text: 'Şehir & Gece', image: '/images/city.png', votes: 28 },
      { text: 'Kafe & Huzur', image: '/images/cafe.png', votes: 19 },
    ],
  },
  {
    id: 101,
    type: 'image',
    question: 'Çalışma ortamı olarak hangisini seçerdiniz?',
    author: 'Can Öztürk',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    options: [
      { text: 'Rahat Kafe', image: '/images/cafe.png', votes: 65 },
      { text: 'Şehir Ofisi', image: '/images/city.png', votes: 42 },
    ],
  },
];

// Additional text survey with countdown nearly expired
const MOCK_TIMED_SURVEY = {
  id: 3,
  type: 'text',
  question: 'Yapay zeka günlük iş akışınıza ne kadar entegre?',
  author: 'Mehmet Aksoy',
  createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 dk kaldı → urgent
  options: [
    { text: 'Her gün kullanıyorum', votes: 45 },
    { text: 'Haftada birkaç kez', votes: 30 },
    { text: 'Nadiren', votes: 18 },
    { text: 'Hiç kullanmıyorum', votes: 7 },
  ],
};

const ALL_MOCK_SURVEYS = [
  ...MOCK_IMAGE_SURVEYS,
  ...MOCK_TEXT_SURVEYS,
  MOCK_TIMED_SURVEY,
];

const TAB_FILTERS = [
  { key: 'all', label: 'Tümü' },
  { key: 'text', label: '📝 Metin' },
  { key: 'image', label: '📸 Resimli' },
  { key: 'timed', label: '⏰ Süreli' },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { recordVote, recordCreate } = useGamification();
  const { showToast } = useToast();

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setSurveys(ALL_MOCK_SURVEYS);
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Handle vote
  const handleVote = useCallback(() => {
    recordVote();
  }, [recordVote]);

  // Handle new survey creation
  const handleCreateSurvey = useCallback((newSurvey) => {
    setSurveys((prev) => [newSurvey, ...prev]);
    recordCreate();
    showToast('Anket başarıyla oluşturuldu!', 'success');
  }, [recordCreate, showToast]);

  // Handle lead form submit
  const handleLeadSubmit = useCallback((data) => {
    console.log('Lead data:', data);
    showToast(`Teşekkürler ${data.firstName}! Bilgileriniz kaydedildi.`, 'success');
  }, [showToast]);

  // Handle AI suggestion apply
  const handleAIApply = useCallback((suggestion) => {
    const newSurvey = {
      id: Date.now(),
      type: 'text',
      question: suggestion.question,
      author: 'Sen',
      createdAt: new Date().toISOString(),
      options: suggestion.options.map(o => ({ text: o, votes: 0 })),
    };
    setSurveys(prev => [newSurvey, ...prev]);
    recordCreate();
    showToast('AI önerisi ile anket oluşturuldu!', 'success');
  }, [recordCreate, showToast]);

  // Filter and sort
  const filteredSurveys = surveys
    .filter((s) => {
      // Tab filter
      if (activeTab === 'text') return s.type === 'text' && !s.expiresAt;
      if (activeTab === 'image') return s.type === 'image';
      if (activeTab === 'timed') return !!s.expiresAt;
      return true;
    })
    .filter((s) =>
      s.question.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'most_voted') {
        const totalA = a.options.reduce((sum, o) => sum + o.votes, 0);
        const totalB = b.options.reduce((sum, o) => sum + o.votes, 0);
        return totalB - totalA;
      }
      return 0;
    });

  return (
    <>
      <Header />
      <UserStats />

      {/* Lead Form Button */}
      <button
        className={styles.leadBtn}
        onClick={() => setShowLead(true)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
        İletişim Formu
      </button>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={showLead}
        onClose={() => setShowLead(false)}
        onSubmit={handleLeadSubmit}
      />

      {/* FAB Buttons */}
      <div className={styles.fabGroup}>
        <button
          className={`${styles.fab} ${styles.fabAI}`}
          onClick={() => setShowAI(true)}
          title="AI Asistan"
          aria-label="AI Asistan"
        >
          🤖
        </button>
        <button
          className={styles.fab}
          onClick={() => setShowCreate(true)}
          title="Yeni Anket Oluştur"
          aria-label="Yeni Anket Oluştur"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        onApply={handleAIApply}
      />

      {/* Create Survey Modal */}
      <CreateSurveyModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateSurvey}
      />

      {/* Surveys Section */}
      <section className={styles.surveys}>
        <div className={styles.surveysHeader}>
          <h2>Anketler</h2>
          <span className={styles.countPill}>
            {loading ? '...' : filteredSurveys.length}
          </span>
        </div>

        {/* Tab Filters */}
        <div className={styles.tabs}>
          {TAB_FILTERS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Anketlerde ara…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Anketleri Sırala"
          >
            <option value="newest">En Yeniler</option>
            <option value="most_voted">En Çok Oy</option>
            <option value="oldest">En Eskiler</option>
          </select>
        </div>

        {/* Survey List */}
        <div className={styles.surveysList}>
          {loading ? (
            <SurveyListSkeleton count={3} />
          ) : filteredSurveys.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 18H32M16 24H28M16 30H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p>Sonuç bulunamadı</p>
              <span>Farklı bir arama terimi veya filtre deneyin</span>
            </div>
          ) : (
            filteredSurveys.map((survey) =>
              survey.type === 'image' ? (
                <ImageSurveyCard key={survey.id} survey={survey} onVote={handleVote} />
              ) : (
                <SurveyCard key={survey.id} survey={survey} onVote={handleVote} />
              )
            )
          )}
        </div>
      </section>
    </>
  );
}
