import React, { useMemo, useEffect, useRef } from 'react';
import './WorkloadGauge.css';

function getDaysFromToday(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.round((d - today) / (1000*60*60*24));
}

function getLevel(density) {
  if (density === 0)   return { key: 'none',     color: '#9C968E', label: 'Nothing due soon',          msg: 'Enjoy the calm — great time to get ahead.' };
  if (density < 1.5)   return { key: 'light',    color: '#3D7A5E', label: 'Light ahead',               msg: 'You\'re well ahead of schedule. Keep it up.' };
  if (density < 3)     return { key: 'moderate', color: '#C17B2A', label: 'Steady workload',           msg: 'A comfortable pace. Stay consistent.' };
  if (density < 5)     return { key: 'busy',     color: '#B87030', label: 'Busy stretch coming',      msg: 'Consider getting started a little early.' };
  return                      { key: 'heavy',    color: '#B84B3A', label: 'Heavy week ahead',          msg: 'Break tasks into small sessions to stay steady.' };
}

export default function WorkloadGauge({ assignments }) {
  const arcRef = useRef(null);

  const { density, level, upcoming } = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const window7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const counts = {};
    window7.forEach(d => { counts[d] = 0; });

    assignments.forEach(a => {
      a.subTasks.forEach(st => {
        if (!st.completed && st.suggestedDate && counts[st.suggestedDate] !== undefined) {
          counts[st.suggestedDate]++;
        }
      });
    });

    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    const density = total / 7;
    const upcoming = window7.map(date => ({ date, count: counts[date] }));
    return { density, level: getLevel(density), upcoming };
  }, [assignments]);

  // Animate arc on mount / change
  const ARC_LENGTH = 251.2; // circumference of r=40 semicircle
  const maxDensity = 6;
  const ratio = Math.min(density / maxDensity, 1);
  const arcOffset = ARC_LENGTH - ratio * ARC_LENGTH;

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.strokeDashoffset = ARC_LENGTH;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.strokeDashoffset = arcOffset;
      });
    });
  }, [arcOffset]);

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="gauge">
      <h3 className="gauge__heading">Next 7 days</h3>

      {/* Arc meter */}
      <div className="gauge__arc-wrap">
        <svg viewBox="0 0 100 58" className="gauge__svg">
          {/* Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="var(--border)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            ref={arcRef}
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={level.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={ARC_LENGTH}
          />
          {/* Center label */}
          <text x="50" y="44" textAnchor="middle" className="gauge__svg-label" fill={level.color}>
            {level.label.split(' ')[0]}
          </text>
        </svg>
        <div className="gauge__status" style={{ color: level.color }}>
          {level.label}
        </div>
      </div>

      <p className="gauge__msg">{level.msg}</p>

      {/* Daily bar mini-chart */}
      <div className="gauge__bars">
        {upcoming.map(({ date, count }) => {
          const d = new Date(date);
          const dayName = days[d.getDay()];
          const isToday = getDaysFromToday(date) === 0;
          const barH = count === 0 ? 4 : Math.min(4 + count * 10, 52);
          const barColor = count === 0 ? 'var(--border)' : count < 3 ? 'var(--accent-mid)' : count < 5 ? 'var(--amber-mid)' : 'var(--coral-mid)';
          return (
            <div key={date} className={`gauge__bar-col ${isToday ? 'gauge__bar-col--today' : ''}`}>
              <div className="gauge__bar-outer">
                <div
                  className="gauge__bar-inner"
                  style={{ height: `${barH}px`, background: barColor }}
                />
              </div>
              <span className="gauge__bar-label">{isToday ? 'Today' : dayName}</span>
              {count > 0 && <span className="gauge__bar-count">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
