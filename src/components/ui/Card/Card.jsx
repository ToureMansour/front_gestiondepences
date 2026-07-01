import PropTypes from 'prop-types';
import styles from './Card.module.css';

function Card({ title, subtitle, children, className = '', ...props }) {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {title && (
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
