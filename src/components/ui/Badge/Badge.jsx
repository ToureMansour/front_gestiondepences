import PropTypes from 'prop-types';
import styles from './Badge.module.css';

const VARIANT_MAP = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  active: 'active',
  inactive: 'inactive',
};

function Badge({ variant = 'default', children }) {
  const className = `${styles.badge} ${styles[VARIANT_MAP[variant] || 'default']}`;
  return <span className={className}>{children}</span>;
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['pending', 'approved', 'rejected', 'active', 'inactive', 'default']),
  children: PropTypes.node.isRequired,
};

export default Badge;
