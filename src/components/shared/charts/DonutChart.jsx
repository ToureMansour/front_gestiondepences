import { useState } from 'react';
import PropTypes from 'prop-types';

export default function DonutChart({ segments, size = 180, thickness = 22, centerLabel }) {
  const [hovered, setHovered] = useState(null);
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
  const arcs = segments.map((seg, i) => {
    const fraction = seg.value / total;
    const dash = fraction * circumference;
    const arc = {
      dash,
      gap: circumference - dash,
      offset: -offset * circumference,
      color: seg.color,
      label: seg.label || '',
      value: seg.value,
      fraction,
    };
    offset += fraction;
    return arc;
  });

  const hoveredArc = hovered !== null ? arcs[hovered] : null;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} onMouseLeave={() => setHovered(null)}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--color-border-light)" strokeWidth={thickness} />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={hovered === i ? thickness + 4 : thickness}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-width 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(i)}
          />
        ))}
      </svg>

      {hoveredArc ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          animation: 'fadeIn 0.15s ease',
        }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
            {hoveredArc.value.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px', maxWidth: size - 30, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {hoveredArc.label}
          </span>
          <span style={{ fontSize: '11px', color: hoveredArc.color, fontWeight: '600', marginTop: '2px' }}>
            {(hoveredArc.fraction * 100).toFixed(1)}%
          </span>
        </div>
      ) : (
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
      )}
    </div>
  );
}

DonutChart.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ),
  size: PropTypes.number,
  thickness: PropTypes.number,
  centerLabel: PropTypes.node,
};
