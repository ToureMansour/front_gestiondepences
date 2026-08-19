import PropTypes from 'prop-types';

export default function DonutChart({ segments, size = 180, thickness = 22, centerLabel }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (!total || segments.length === 0) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={(size - thickness) / 2} fill="none" stroke="var(--color-border-light)" strokeWidth={thickness} />
        </svg>
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.value / total;
    const dash = fraction * circumference;
    const arc = {
      dash,
      gap: circumference - dash,
      offset: -offset * circumference,
      color: seg.color,
    };
    offset += fraction;
    return arc;
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--color-border-light)" strokeWidth={thickness} />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.4s ease' }}
          />
        ))}
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        {centerLabel}
      </div>
    </div>
  );
}

DonutChart.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  size: PropTypes.number,
  thickness: PropTypes.number,
  centerLabel: PropTypes.node,
};
