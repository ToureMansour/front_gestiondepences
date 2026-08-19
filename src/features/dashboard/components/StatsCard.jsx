import PropTypes from 'prop-types';
import Sparkline from '../../../components/shared/charts/Sparkline';
import styles from './StatsCard.module.css';

function StatsCard({ title, value, icon, color = 'var(--color-primary)', softColor = '#E8F7F5', trend, sub, sparkline }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon} style={{ background: softColor, color }}>
          {icon}
        </div>
        {sparkline && <Sparkline data={sparkline} color={color} />}
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
      <div className={styles.bottom}>
        {trend !== undefined && (
          <span className={trend >= 0 ? styles.trendUp : styles.trendDown}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className={styles.sub}>{sub}</span>}
      </div>
    </div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  softColor: PropTypes.string,
  trend: PropTypes.number,
  sub: PropTypes.string,
  sparkline: PropTypes.arrayOf(PropTypes.number),
};

export default StatsCard;
