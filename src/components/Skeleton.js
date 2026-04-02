import styles from './Skeleton.module.css';

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
  count = 1,
}) {
  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '14px' : undefined),
        ...style,
      }}
    />
  ));

  return count === 1 ? elements[0] : <div className={styles.stack}>{elements}</div>;
}
