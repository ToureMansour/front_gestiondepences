import PropTypes from 'prop-types';
import styles from './Skeleton.module.css';

export function Skeleton({ width, height, borderRadius = 'var(--radius-md)', className = '' }) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard({ lines = 3, title = false }) {
  return (
    <div className={styles.card}>
      {title && <Skeleton width="40%" height="18px" />}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${95 - i * 12}%`} height="14px" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="85%" height="13px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.tableRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${70 - c * 8}%`} height="13px" />
          ))}
        </div>
      ))}
    </div>
  );
}

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.string,
  className: PropTypes.string,
};

SkeletonCard.propTypes = {
  lines: PropTypes.number,
  title: PropTypes.bool,
};

SkeletonTable.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
};
