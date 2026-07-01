import PropTypes from 'prop-types';

function StatsCard({ title, value, icon, color = '#0F766E' }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>
          {value}
        </p>
      </div>
    </div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
};

export default StatsCard;
