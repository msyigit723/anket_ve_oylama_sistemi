'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import styles from '../auth.module.css';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

const STRENGTH = [
  { label: '', color: 'transparent', width: '0%' },
  { label: 'Çok zayıf', color: '#ef4444', width: '20%' },
  { label: 'Zayıf', color: '#f59e0b', width: '40%' },
  { label: 'Orta', color: '#f59e0b', width: '60%' },
  { label: 'Güçlü', color: '#10b981', width: '80%' },
  { label: 'Çok güçlü', color: '#10b981', width: '100%' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const pwStrength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthInfo = STRENGTH[pwStrength];

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'İsim gerekli';
    else if (name.trim().length < 2) e.name = 'En az 2 karakter';
    if (!email.trim()) e.email = 'E-posta gerekli';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Geçerli bir e-posta girin';
    if (!password) e.password = 'Şifre gerekli';
    else if (password.length < 6) e.password = 'En az 6 karakter';
    if (password !== confirmPass) e.confirmPass = 'Şifreler eşleşmiyor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.push('/');
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.logoIcon}>📝</span>
          <h1 className={styles.logoTitle}>Kayıt Ol</h1>
          <p className={styles.logoSub}>Hemen ücretsiz hesap oluşturun</p>
        </div>

        {generalError && (
          <div className={styles.errorBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {generalError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>İsim</label>
            <div className={styles.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
                autoComplete="name"
                autoFocus
              />
            </div>
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>E-posta</label>
            <div className={styles.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="ornek@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Şifre</label>
            <div className={styles.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                type={showPass ? 'text' : 'password'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="En az 6 karakter"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                autoComplete="new-password"
              />
              <button type="button" className={styles.togglePass} onClick={() => setShowPass(!showPass)}>
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <span className={styles.error}>{errors.password}</span>}
            {password && (
              <>
                <div className={styles.strengthBar}>
                  <div className={styles.strengthFill} style={{ width: strengthInfo.width, background: strengthInfo.color }} />
                </div>
                <span className={styles.strengthLabel} style={{ color: strengthInfo.color }}>{strengthInfo.label}</span>
              </>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Şifre Tekrar</label>
            <div className={styles.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <input
                type="password"
                className={`${styles.input} ${errors.confirmPass ? styles.inputError : ''}`}
                placeholder="Şifrenizi tekrar girin"
                value={confirmPass}
                onChange={e => { setConfirmPass(e.target.value); setErrors(p => ({...p, confirmPass: ''})); }}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPass && <span className={styles.error}>{errors.confirmPass}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <><span className={styles.spinner} /> Kayıt yapılıyor…</> : 'Kayıt Ol'}
          </button>
        </form>

        <div className={styles.divider}>veya</div>

        <p className={styles.footerLink}>
          Zaten hesabınız var mı? <Link href="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
