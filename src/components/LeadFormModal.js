'use client';

import { useState, useCallback } from 'react';
import styles from './LeadFormModal.module.css';

// Validation helpers
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formatPhone = (value) => {
  // Strip everything except digits
  const digits = value.replace(/\D/g, '');

  // Auto-prepend 90 if user starts typing
  let clean = digits;
  if (clean.startsWith('90')) {
    clean = clean.slice(2);
  } else if (clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  // Only allow up to 10 digits after country code
  clean = clean.slice(0, 10);

  // Format: +90 5XX XXX XX XX
  let formatted = '+90';
  if (clean.length > 0) formatted += ' ' + clean.slice(0, 3);
  if (clean.length > 3) formatted += ' ' + clean.slice(3, 6);
  if (clean.length > 6) formatted += ' ' + clean.slice(6, 8);
  if (clean.length > 8) formatted += ' ' + clean.slice(8, 10);

  return { formatted, raw: clean };
};

const validateField = (name, value) => {
  switch (name) {
    case 'firstName':
      if (!value.trim()) return 'İsim gerekli';
      if (value.trim().length < 2) return 'En az 2 karakter olmalı';
      return '';
    case 'lastName':
      if (!value.trim()) return 'Soyisim gerekli';
      if (value.trim().length < 2) return 'En az 2 karakter olmalı';
      return '';
    case 'email':
      if (!value.trim()) return 'E-posta gerekli';
      if (!EMAIL_REGEX.test(value.trim())) return 'Geçerli bir e-posta adresi girin';
      return '';
    case 'phone':
      if (!value) return 'Telefon numarası gerekli';
      if (value.length < 10) return 'Telefon numarası 10 haneli olmalı';
      if (!value.startsWith('5')) return 'Telefon numarası 5 ile başlamalı';
      return '';
    default:
      return '';
  }
};

export default function LeadFormModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [phoneDisplay, setPhoneDisplay] = useState('+90');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const { formatted, raw } = formatPhone(value);
      setPhoneDisplay(formatted);
      setForm((prev) => ({ ...prev, phone: raw }));

      // Live validate if already touched
      if (touched.phone) {
        setErrors((prev) => ({ ...prev, phone: validateField('phone', raw) }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === 'phone') {
      setErrors((prev) => ({ ...prev, phone: validateField('phone', form.phone) }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      firstName: validateField('firstName', form.firstName),
      lastName: validateField('lastName', form.lastName),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
    };

    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, email: true, phone: true });

    // Check if any errors
    if (Object.values(newErrors).some((e) => e)) return;

    setSubmitting(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    if (onSubmit) {
      onSubmit({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: `+90${form.phone}`,
      });
    }

    // Reset form
    setForm({ firstName: '', lastName: '', email: '', phone: '' });
    setPhoneDisplay('+90');
    setErrors({});
    setTouched({});
    setSubmitting(false);
    onClose();
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>İletişim Formu</h2>
            <p className={styles.subtitle}>Bilgilerinizi bırakın, size ulaşalım</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Name Row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lead-firstName">İsim</label>
              <input
                id="lead-firstName"
                type="text"
                name="firstName"
                className={`${styles.input} ${hasError('firstName') ? styles.inputError : ''}`}
                placeholder="Adınız"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="given-name"
                autoFocus
              />
              {hasError('firstName') && (
                <span className={styles.error}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="lead-lastName">Soyisim</label>
              <input
                id="lead-lastName"
                type="text"
                name="lastName"
                className={`${styles.input} ${hasError('lastName') ? styles.inputError : ''}`}
                placeholder="Soyadınız"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="family-name"
              />
              {hasError('lastName') && (
                <span className={styles.error}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lead-email">E-posta</label>
            <div className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                id="lead-email"
                type="email"
                name="email"
                className={`${styles.input} ${styles.inputWithIcon} ${hasError('email') ? styles.inputError : ''}`}
                placeholder="ornek@email.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
            </div>
            {hasError('email') && (
              <span className={styles.error}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lead-phone">Telefon</label>
            <div className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input
                id="lead-phone"
                type="tel"
                name="phone"
                className={`${styles.input} ${styles.inputWithIcon} ${hasError('phone') ? styles.inputError : ''}`}
                placeholder="+90 5__ ___ __ __"
                value={phoneDisplay}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
              />
            </div>
            {hasError('phone') && (
              <span className={styles.error}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.phone}
              </span>
            )}
            <span className={styles.hint}>Format: +90 5XX XXX XX XX</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} />
                Gönderiliyor…
              </>
            ) : (
              <>
                Gönder
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
