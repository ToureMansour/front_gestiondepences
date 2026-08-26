import { useState } from 'react';
import PropTypes from 'prop-types';

function buildPath(points) {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let d = `M ${first[0]} ${first[1]}`;
  for (const [x, y] of rest) {
    d += ` L ${x} ${y}`;
  }
  return d;
}

function buildAreaPath(points, height) {
  if (points.length === 0) return '';
  const line = buildPath(points);
  return `${line} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`;
}

export default function LineChart({
  labels,
  series,
  width = 560,
  height = 220,
  padding = { top: 24, right: 16, bottom: 28, left: 44 },
  color = 'var(--color-primary)',
  fill = true,
}) {
  const [hovered, setHovered] = useState(null);
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  if (!labels || labels.length === 0 || !series || series.length === 0) {
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <text x="50%" y="50%" textAnchor="middle" fill="var(--color-text-muted)" fontSize="13">
          No data
        </text>
      </svg>
    );
  }

  const values = series.map(Number);
  const max = Math.max(...values, 1);
  const min = 0;
  const range = max - min || 1;

  const stepX = innerW / Math.max(labels.length - 1, 1);
  const points = values.map((v, i) => [
    padding.left + i * stepX,
    padding.top + innerH - ((v - min) / range) * innerH,
  ]);

  const gridLines = 4;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = min + (range * i) / gridLines;
    const y = padding.top + innerH - (i / gridLines) * innerH;
    return { y, val };
  });

  const tooltipW = 100;
  const tooltipH = 38;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Line chart"
      onMouseLeave={() => setHovered(null)}
      style={{ overflow: 'visible' }}
    >
      {yTicks.map(({ y, val }) => (
        <g key={y}>
          <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="var(--color-border-light)" strokeWidth="1" />
          <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="11">
            {Number.isInteger(val) ? val : val.toFixed(1)}
          </text>
        </g>
      ))}

      {fill && (
        <path
          d={buildAreaPath(points, padding.top + innerH)}
          fill={color}
          opacity="0.12"
          stroke="none"
        />
      )}

      <path
        d={buildPath(points)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={hovered === i ? 6 : 4}
            fill={hovered === i ? color : 'var(--color-surface)'}
            stroke={color}
            strokeWidth={hovered === i ? 0 : 2}
            style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
          />
          {labels.length <= 12 && (
            <text x={x} y={height - 8} textAnchor="middle" fill="var(--color-text-muted)" fontSize="11">
              {labels[i]}
            </text>
          )}
          {labels.length > 12 && (
            <text
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill={hovered === i ? 'var(--color-text)' : 'var(--color-text-muted)'}
              fontSize="10"
              fontWeight={hovered === i ? '600' : '400'}
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}

      {points.map(([x, y], i) => {
        const isLast = x + tooltipW / 2 > width - padding.right;
        const tx = isLast ? x - tooltipW - 10 : x + 10;
        const ty = y - tooltipH / 2;
        return (
          <g key={`hit-${i}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setHovered(i)}>
            <rect x={x - stepX / 2} y={padding.top} width={stepX} height={innerH} fill="transparent" />
            {hovered === i && (
              <g>
                <rect
                  x={tx}
                  y={ty}
                  width={tooltipW}
                  height={tooltipH}
                  rx="6"
                  fill="var(--color-text)"
                  opacity="0.92"
                />
                <text x={tx + 10} y={ty + 15} fill="var(--color-text-muted)" fontSize="10">
                  {labels[i]}
                </text>
                <text x={tx + 10} y={ty + 28} fill="#fff" fontSize="12" fontWeight="700">
                  {Number(values[i]).toLocaleString()} FCFA
                </text>
                <line x1={x} y1={y + 6} x2={x} y2={ty + tooltipH} stroke={color} strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  series: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.shape({ top: PropTypes.number, right: PropTypes.number, bottom: PropTypes.number, left: PropTypes.number }),
  color: PropTypes.string,
  fill: PropTypes.bool,
};
