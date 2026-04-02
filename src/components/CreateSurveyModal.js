'use client';

import { useState, useRef } from 'react';
import styles from './CreateSurveyModal.module.css';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function CreateSurveyModal({ isOpen, onClose, onSubmit }) {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('text'); // 'text' or 'image'
  const [options, setOptions] = useState([
    { text: '', image: null, preview: null },
    { text: '', image: null, preview: null },
  ]);
  const [hasDuration, setHasDuration] = useState(false);
  const [duration, setDuration] = useState(24); // hours
  const fileInputRefs = useRef([]);

  if (!isOpen) return null;

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, { text: '', image: null, preview: null }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newOptions = [...options];
      newOptions[index] = {
        ...newOptions[index],
        image: file,
        preview: ev.target.result,
      };
      setOptions(newOptions);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) return;
    const validOptions = options.filter((o) => o.text.trim());
    if (validOptions.length < 2) return;

    const survey = {
      id: Date.now(),
      question: question.trim(),
      author: 'Sen',
      createdAt: new Date().toISOString(),
      type,
      options: validOptions.map((o) => ({
        text: o.text.trim(),
        votes: 0,
        ...(type === 'image' && o.preview ? { image: o.preview } : {}),
      })),
      ...(hasDuration ? {
        expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
      } : {}),
    };

    onSubmit(survey);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setQuestion('');
    setType('text');
    setOptions([
      { text: '', image: null, preview: null },
      { text: '', image: null, preview: null },
    ]);
    setHasDuration(false);
    setDuration(24);
  };

  const isValid = question.trim() && options.filter((o) => o.text.trim()).length >= 2;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Yeni Anket Oluştur</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Question */}
          <div className={styles.field}>
            <label className={styles.label}>Soru</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Sorunuzu buraya yazın…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              autoFocus
            />
          </div>

          {/* Type Toggle */}
          <div className={styles.field}>
            <label className={styles.label}>Anket Tipi</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'text' ? styles.active : ''}`}
                onClick={() => setType('text')}
              >
                📝 Metin
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'image' ? styles.active : ''}`}
                onClick={() => setType('image')}
              >
                📸 Resimli
              </button>
            </div>
          </div>

          {/* Options */}
          <div className={styles.field}>
            <label className={styles.label}>Seçenekler</label>
            <div className={styles.optionsList}>
              {options.map((opt, i) => (
                <div key={i} className={styles.optionRow}>
                  <div className={styles.optionBadge}>{LETTERS[i]}</div>
                  <div className={styles.optionContent}>
                    <input
                      type="text"
                      className={styles.optionInput}
                      placeholder={`Seçenek ${LETTERS[i]}`}
                      value={opt.text}
                      onChange={(e) => updateOption(i, 'text', e.target.value)}
                      maxLength={120}
                    />
                    {type === 'image' && (
                      <div className={styles.imageUpload}>
                        {opt.preview ? (
                          <div className={styles.previewContainer}>
                            <img src={opt.preview} alt="" className={styles.previewImg} />
                            <button
                              type="button"
                              className={styles.removeImg}
                              onClick={() => updateOption(i, 'preview', null)}
                            >✕</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadBtn}
                            onClick={() => fileInputRefs.current[i]?.click()}
                          >
                            📷 Görsel Ekle
                          </button>
                        )}
                        <input
                          ref={(el) => (fileInputRefs.current[i] = el)}
                          type="file"
                          accept="image/*"
                          className={styles.fileInput}
                          onChange={(e) => handleImageUpload(i, e)}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeOption(i)}
                    disabled={options.length <= 2}
                    aria-label="Sil"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button type="button" className={styles.addBtn} onClick={addOption}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Şık Ekle
              </button>
            )}
          </div>

          {/* Duration */}
          <div className={styles.field}>
            <div className={styles.durationToggle}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={hasDuration}
                  onChange={(e) => setHasDuration(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkText}>⏰ Süre Ekle</span>
              </label>
              {hasDuration && (
                <select
                  className={styles.durationSelect}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={1}>1 Saat</option>
                  <option value={6}>6 Saat</option>
                  <option value={12}>12 Saat</option>
                  <option value={24}>24 Saat</option>
                  <option value={48}>2 Gün</option>
                  <option value={72}>3 Gün</option>
                  <option value={168}>1 Hafta</option>
                </select>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!isValid}
          >
            Anketi Yayınla
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 9H16M10 3L16 9L10 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
