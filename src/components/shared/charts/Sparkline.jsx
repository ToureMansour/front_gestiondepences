import PropTypes from 'prop-types';

export default function Sparkline({ data, width = 96, height = 36, color = 'var(--color-primary)' }) {
  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height} role="img" aria-label="Sparkline">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="var(--color-border-light)" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    );
  }

  const values = data.map(Number);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values.map((v, i) => [
    i * stepX,
    height - ((v - min) / range) * (height - 4) - 2,
  ]);

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} role="img" aria-label="Sparkline">
      <path d={area} fill={color} opacity="0.1" stroke="none" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

Sparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
