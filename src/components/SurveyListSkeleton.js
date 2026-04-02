import SurveyCardSkeleton from './SurveyCardSkeleton';
import styles from './SurveyListSkeleton.module.css';

export default function SurveyListSkeleton({ count = 3 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <SurveyCardSkeleton key={i} />
      ))}
    </div>
  );
}
