'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import styles from './admin.module.css';

// ─── Mock Data ───────────────────────────────────────────────
const MOCK_SURVEYS = [
  { id: 1, question: 'En çok hangi programlama dilini tercih ediyorsunuz?', author: 'Ahmet Yılmaz', type: 'text', totalVotes: 117, createdAt: '2026-04-02T13:00:00Z', status: 'active' },
  { id: 2, question: 'Uzaktan çalışma mı, ofisten çalışma mı?', author: 'Elif Demir', type: 'text', totalVotes: 100, createdAt: '2026-04-02T10:00:00Z', status: 'active', expiresAt: '2026-04-02T20:00:00Z' },
  { id: 3, question: 'Yapay zeka günlük iş akışınıza ne kadar entegre?', author: 'Mehmet Aksoy', type: 'text', totalVotes: 100, createdAt: '2026-04-01T18:00:00Z', status: 'expired' },
  { id: 100, question: 'Tatil için hangi mekanı tercih edersiniz?', author: 'Seda Kaya', type: 'image', totalVotes: 124, createdAt: '2026-04-02T14:00:00Z', status: 'active' },
  { id: 101, question: 'Çalışma ortamı olarak hangisini seçerdiniz?', author: 'Can Öztürk', type: 'image', totalVotes: 107, createdAt: '2026-04-01T03:00:00Z', status: 'active' },
];

const MOCK_LEADS = [
  { id: 1, firstName: 'Ali', lastName: 'Veli', email: 'ali@example.com', phone: '+90 532 111 22 33', createdAt: '2026-04-02T15:30:00Z' },
  { id: 2, firstName: 'Ayşe', lastName: 'Kara', email: 'ayse@example.com', phone: '+90 555 444 55 66', createdAt: '2026-04-02T14:00:00Z' },
  { id: 3, firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet@example.com', phone: '+90 542 777 88 99', createdAt: '2026-04-01T09:00:00Z' },
];

const MOCK_COMMENTS = [
  { id: 'c1', surveyId: 1, author: 'Ege Yıldız', text: 'TypeScript kesinlikle en iyi seçenek!', createdAt: '2026-04-02T14:00:00Z', flagged: false },
  { id: 'c2', surveyId: 1, author: 'Mert Kılıç', text: 'Python ile data science yapmak çok keyifli.', createdAt: '2026-04-02T12:00:00Z', flagged: false },
  { id: 'c3', surveyId: 100, author: 'Deniz Avcı', text: 'Sahil her zaman kazanır! 🏖️', createdAt: '2026-04-02T13:30:00Z', flagged: false },
  { id: 'c4', surveyId: 2, author: 'Spam Bot', text: 'BUY CHEAP PRODUCTS NOW!!!', createdAt: '2026-04-02T16:00:00Z', flagged: true },
];

// ─── Utility ─────────────────────────────────────────────────
const formatDate = (d) => new Date(d).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const exportToCSV = (data, filename, headers) => {
  const bom = '\uFEFF';
  const headerRow = headers.map(h => h.label).join(';');
  const rows = data.map(row =>
    headers.map(h => {
      let val = typeof h.accessor === 'function' ? h.accessor(row) : row[h.accessor];
      if (typeof val === 'string' && (val.includes(';') || val.includes('"'))) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? '';
    }).join(';')
  );
  const csv = bom + [headerRow, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Tabs ────────────────────────────────────────────────────
const TABS = [
  { key: 'overview', label: '📊 Genel Bakış', icon: '📊' },
  { key: 'surveys', label: '📝 Anketler', icon: '📝' },
  { key: 'leads', label: '📧 İletişim', icon: '📧' },
  { key: 'comments', label: '💬 Yorumlar', icon: '💬' },
];

// ─── Component ───────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  // ── Route Protection ──
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace('/panel-access');
    }
  }, [authLoading, user, isAdmin, router]);

  const [activeTab, setActiveTab] = useState('overview');
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [leads] = useState(MOCK_LEADS);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Show loading while auth is resolving
  if (authLoading || !user || !isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>
        Yetkilendirme kontrol ediliyor…
      </div>
    );
  }

  // Stats
  const stats = useMemo(() => ({
    totalSurveys: surveys.length,
    activeSurveys: surveys.filter(s => s.status === 'active').length,
    totalVotes: surveys.reduce((s, sv) => s + sv.totalVotes, 0),
    totalLeads: leads.length,
    totalComments: comments.length,
    flaggedComments: comments.filter(c => c.flagged).length,
  }), [surveys, leads, comments]);

  // Delete survey
  const handleDeleteSurvey = (id) => {
    if (confirm('Bu anketi silmek istediğinize emin misiniz?')) {
      setSurveys(prev => prev.filter(s => s.id !== id));
    }
  };

  // Delete comment
  const handleDeleteComment = (id) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  // Export surveys
  const handleExportSurveys = () => {
    exportToCSV(surveys, 'anket-sonuclari', [
      { label: 'ID', accessor: 'id' },
      { label: 'Soru', accessor: 'question' },
      { label: 'Yazar', accessor: 'author' },
      { label: 'Tip', accessor: 'type' },
      { label: 'Toplam Oy', accessor: 'totalVotes' },
      { label: 'Durum', accessor: 'status' },
      { label: 'Tarih', accessor: d => formatDate(d.createdAt) },
    ]);
  };

  // Export leads
  const handleExportLeads = () => {
    exportToCSV(leads, 'iletisim-verileri', [
      { label: 'ID', accessor: 'id' },
      { label: 'İsim', accessor: 'firstName' },
      { label: 'Soyisim', accessor: 'lastName' },
      { label: 'E-posta', accessor: 'email' },
      { label: 'Telefon', accessor: 'phone' },
      { label: 'Tarih', accessor: d => formatDate(d.createdAt) },
    ]);
  };

  // Filter
  const filteredSurveys = surveys.filter(s =>
    s.question.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredComments = comments.filter(c =>
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
          Anasayfa
        </Link>
        <div className={styles.sidebarTitle}>Admin Panel</div>
        <nav className={styles.nav}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`${styles.navItem} ${activeTab === tab.key ? styles.navActive : ''}`}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminBadge}>🔐 Admin</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>
            {TABS.find(t => t.key === activeTab)?.label}
          </h1>
          {(activeTab === 'surveys' || activeTab === 'comments') && (
            <div className={styles.headerActions}>
              <div className={styles.searchBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Ara…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </header>

        {/* ─── OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.purple}`}>📊</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.totalSurveys}</span>
                  <span className={styles.statLbl}>Toplam Anket</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.green}`}>✅</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.activeSurveys}</span>
                  <span className={styles.statLbl}>Aktif Anket</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.blue}`}>🗳️</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.totalVotes}</span>
                  <span className={styles.statLbl}>Toplam Oy</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.orange}`}>📧</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.totalLeads}</span>
                  <span className={styles.statLbl}>Lead Sayısı</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.cyan}`}>💬</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.totalComments}</span>
                  <span className={styles.statLbl}>Yorum</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.red}`}>🚩</div>
                <div className={styles.statInfo}>
                  <span className={styles.statVal}>{stats.flaggedComments}</span>
                  <span className={styles.statLbl}>Flagged</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h3 className={styles.sectionTitle}>Hızlı İşlemler</h3>
              <div className={styles.actionGrid}>
                <button className={styles.actionCard} onClick={handleExportSurveys}>
                  <span className={styles.actionIcon}>📥</span>
                  <span>Anket Sonuçlarını İndir (CSV)</span>
                </button>
                <button className={styles.actionCard} onClick={handleExportLeads}>
                  <span className={styles.actionIcon}>📥</span>
                  <span>Lead Verilerini İndir (CSV)</span>
                </button>
                <button className={styles.actionCard} onClick={() => setActiveTab('comments')}>
                  <span className={styles.actionIcon}>🚩</span>
                  <span>Flagged Yorumları İncele ({stats.flaggedComments})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── SURVEYS ─── */}
        {activeTab === 'surveys' && (
          <div className={styles.content}>
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>{filteredSurveys.length} anket</span>
              <button className={styles.exportBtn} onClick={handleExportSurveys}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                CSV İndir
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Soru</th>
                    <th>Yazar</th>
                    <th>Tip</th>
                    <th>Oy</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map(s => (
                    <tr key={s.id}>
                      <td className={styles.cellQ}>{s.question}</td>
                      <td>{s.author}</td>
                      <td><span className={`${styles.typePill} ${s.type === 'image' ? styles.pillImage : styles.pillText}`}>{s.type === 'image' ? '📸 Resimli' : '📝 Metin'}</span></td>
                      <td className={styles.cellNum}>{s.totalVotes}</td>
                      <td><span className={`${styles.statusPill} ${s.status === 'active' ? styles.statusActive : styles.statusExpired}`}>{s.status === 'active' ? 'Aktif' : 'Sona Erdi'}</span></td>
                      <td className={styles.cellDate}>{formatDate(s.createdAt)}</td>
                      <td>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteSurvey(s.id)} title="Sil">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── LEADS ─── */}
        {activeTab === 'leads' && (
          <div className={styles.content}>
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>{leads.length} kayıt</span>
              <button className={styles.exportBtn} onClick={handleExportLeads}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                CSV İndir
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>İsim</th>
                    <th>Soyisim</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id}>
                      <td>{l.firstName}</td>
                      <td>{l.lastName}</td>
                      <td className={styles.cellEmail}>{l.email}</td>
                      <td>{l.phone}</td>
                      <td className={styles.cellDate}>{formatDate(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── COMMENTS ─── */}
        {activeTab === 'comments' && (
          <div className={styles.content}>
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>{filteredComments.length} yorum</span>
            </div>
            <div className={styles.commentsList}>
              {filteredComments.map(c => (
                <div key={c.id} className={`${styles.commentCard} ${c.flagged ? styles.flagged : ''}`}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAvatar}>{c.author.charAt(0)}</div>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentAuthor}>{c.author}</span>
                      <span className={styles.commentSurvey}>Anket #{c.surveyId}</span>
                      <span className={styles.commentTime}>{formatDate(c.createdAt)}</span>
                    </div>
                    {c.flagged && <span className={styles.flagBadge}>🚩 Spam</span>}
                  </div>
                  <p className={styles.commentText}>{c.text}</p>
                  <div className={styles.commentActions}>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteComment(c.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
