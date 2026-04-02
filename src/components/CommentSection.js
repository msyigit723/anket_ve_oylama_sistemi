'use client';

import { useState, useCallback } from 'react';
import SentimentAnalysis from './SentimentAnalysis';
import styles from './CommentSection.module.css';

const MOCK_COMMENTS = {
  1: [
    { id: 'c1', author: 'Ege Yıldız', text: 'TypeScript kesinlikle en iyi seçenek!', createdAt: new Date(Date.now() - 3600000).toISOString(), replies: [
      { id: 'r1', author: 'Zeynep Ak', text: 'Katılıyorum, tip güvenliği çok önemli.', createdAt: new Date(Date.now() - 1800000).toISOString() },
    ]},
    { id: 'c2', author: 'Mert Kılıç', text: 'Python ile data science yapmak çok keyifli.', createdAt: new Date(Date.now() - 7200000).toISOString(), replies: [] },
  ],
  100: [
    { id: 'c3', author: 'Deniz Avcı', text: 'Sahil her zaman kazanır! 🏖️', createdAt: new Date(Date.now() - 5400000).toISOString(), replies: [] },
  ],
};

export default function CommentSection({ surveyId }) {
  const [comments, setComments] = useState(MOCK_COMMENTS[surveyId] || []);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  const handleSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: `c-${Date.now()}`,
      author: 'Sen',
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment('');
  }, [newComment]);

  const handleSubmitReply = useCallback((commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: `r-${Date.now()}`,
      author: 'Sen',
      text: replyText.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply] }
          : c
      )
    );
    setReplyTo(null);
    setReplyText('');
  }, [replyText]);

  const totalCount = comments.reduce((sum, c) => sum + 1 + c.replies.length, 0);

  return (
    <div className={styles.section}>
      {/* Toggle */}
      <button
        className={styles.toggle}
        onClick={() => setExpanded(!expanded)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{totalCount} Yorum</span>
        <svg
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 20 20" fill="none"
        >
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className={styles.body}>
          {/* New Comment Form */}
          <form className={styles.form} onSubmit={handleSubmitComment}>
            <div className={styles.avatar}>Sen</div>
            <input
              className={styles.commentInput}
              type="text"
              placeholder="Yorum yaz…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!newComment.trim()}
              aria-label="Gönder"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

          {/* AI Sentiment Analysis */}
          {comments.length > 0 && (
            <SentimentAnalysis comments={comments} />
          )}

          {/* Comments List */}
          <div className={styles.list}>
            {comments.length === 0 ? (
              <p className={styles.empty}>Henüz yorum yok. İlk yorumu sen yaz!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAvatar}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentAuthor}>{comment.author}</span>
                      <span className={styles.commentTime}>{getTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                  <button
                    className={styles.replyBtn}
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 17 4 12 9 7" />
                      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                    </svg>
                    Yanıtla
                  </button>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className={styles.replies}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className={styles.reply}>
                          <div className={styles.commentHeader}>
                            <div className={`${styles.commentAvatar} ${styles.replyAvatar}`}>
                              {reply.author.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.commentMeta}>
                              <span className={styles.commentAuthor}>{reply.author}</span>
                              <span className={styles.commentTime}>{getTimeAgo(reply.createdAt)}</span>
                            </div>
                          </div>
                          <p className={styles.commentText}>{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className={styles.replyForm}>
                      <input
                        className={styles.replyInput}
                        type="text"
                        placeholder="Yanıt yaz…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={500}
                        autoFocus
                      />
                      <button
                        className={styles.sendBtn}
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim()}
                        aria-label="Gönder"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
