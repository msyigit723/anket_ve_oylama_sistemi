import Skeleton from './Skeleton';
import styles from './SurveyCardSkeleton.module.css';

export default function SurveyCardSkeleton() {
  return (
    <div className={styles.card}>
      {/* Question */}
      <Skeleton variant="text" width="80%" height="18px" />
      
      {/* Meta row */}
      <div className={styles.meta}>
        <Skeleton variant="text" width="90px" height="12px" />
        <Skeleton variant="text" width="70px" height="12px" />
      </div>

      {/* Options */}
      <div className={styles.options}>
        <div className={styles.option}>
          <Skeleton variant="rectangular" width="28px" height="28px" />
          <Skeleton variant="text" width="60%" height="14px" />
        </div>
        <div className={styles.option}>
          <Skeleton variant="rectangular" width="28px" height="28px" />
          <Skeleton variant="text" width="45%" height="14px" />
        </div>
        <div className={styles.option}>
          <Skeleton variant="rectangular" width="28px" height="28px" />
          <Skeleton variant="text" width="55%" height="14px" />
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Skeleton variant="text" width="100px" height="12px" />
        <div className={styles.actions}>
          <Skeleton variant="rectangular" width="60px" height="28px" />
          <Skeleton variant="rectangular" width="60px" height="28px" />
        </div>
      </div>
    </div>
  );
}
