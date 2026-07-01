import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

function Spinner({ size = 'md', fullPage = false }) {
  const className = [
    styles.spinner,
    styles[size],
    fullPage && styles.fullPage,
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullPage: PropTypes.bool,
};

export default Spinner;
