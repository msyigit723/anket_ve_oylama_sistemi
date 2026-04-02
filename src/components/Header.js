'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.badge}>ANKET SİSTEMİ</div>
      <h1 className={styles.title}>
        Sor. Oylan. <span className="gradient-text">Keşfet.</span>
      </h1>
      <p className={styles.subtitle}>
        Anketler oluşturun, topluluktan geri bildirim alın
      </p>

      <div className={styles.headerActions}>
        {user ? (
          <>
            <span className={styles.userPill}>
              <span className={styles.userAvatar}>{(user.name || user.email).charAt(0).toUpperCase()}</span>
              {user.name || user.email}
            </span>
            {isAdmin && (
              <Link href="/admin" className={styles.adminLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Admin Panel
              </Link>
            )}
            <button className={styles.logoutBtn} onClick={logout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Çıkış
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginBtn}>Giriş Yap</Link>
            <Link href="/register" className={styles.registerBtn}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </header>
  );
}
