import React, { useState } from 'react';
import './ProgressTracker.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + 'T00:00:00');
  return d < today;
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.round((d - today) / (1000*60*60*24));
}

function completionRatio(subTasks) {
  if (!subTasks.length) return 0;
  return subTasks.filter(t => t.completed).length / subTasks.length;
}

const DIFFICULTY_COLORS = {
  easy:   { bg: 'var(--accent-light)',  text: 'var(--accent)' },
  medium: { bg: 'var(--amber-light)',   text: 'var(--amber)' },
  hard:   { bg: 'var(--coral-light)',   text: 'var(--coral)' },
};

const TYPE_LABELS = {
  'research-paper': 'Research Paper',
  'essay':          'Essay',
  'presentation':   'Presentation',
  'problem-set':    'Problem Set',
  'lab-report':     'Lab Report',
  'other':          'Other',
};

export default function ProgressTracker({ assignments, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState({});

  function toggle(id) {
    setExpanded(v => ({ ...v, [id]: !v[id] }));
  }

  if (assignments.length === 0) {
    return (
      <div className="pt-empty">
        <div className="pt-empty__icon">📋</div>
        <p className="pt-empty__text">No assignments yet.</p>
        <p className="pt-empty__sub">Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="pt">
      {assignments.map((a, aIdx) => {
        const ratio     = completionRatio(a.subTasks);
        const pct       = Math.round(ratio * 100);
        const isOpen    = expanded[a.id] !== false; // open by default
        const due       = daysUntil(a.deadline);
        const diffStyle = DIFFICULTY_COLORS[a.difficulty] || DIFFICULTY_COLORS.medium;

        return (
          <div
            key={a.id}
            className={`pt__card ${ratio === 1 ? 'pt__card--done' : ''}`}
            style={{ animationDelay: `${aIdx * 0.06}s` }}
          >
            {/* Card header */}
            <div className="pt__card-header" onClick={() => toggle(a.id)}>
              <div className="pt__card-meta">
                <span className="pt__type-badge">{TYPE_LABELS[a.type] || a.type}</span>
                <span
                  className="pt__diff-badge"
                  style={{ background: diffStyle.bg, color: diffStyle.text }}
                >
                  {a.difficulty}
                </span>
              </div>
              <div className="pt__card-title-row">
                <h3 className="pt__card-title">{a.title}</h3>
                <button
                  className="pt__chevron"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  onClick={e => { e.stopPropagation(); toggle(a.id); }}
                >
                  {isOpen ? '▲' : '▼'}
                </button>
              </div>

              {/* Progress bar */}
              <div className="pt__prog-row">
                <div className="pt__prog-bar">
                  <div
                    className="pt__prog-fill"
                    style={{
                      width: `${pct}%`,
                      background: ratio === 1
                        ? 'var(--accent)'
                        : ratio > 0.6
                        ? 'var(--accent)'
                        : ratio > 0.3
                        ? 'var(--amber)'
                        : 'var(--border-strong)',
                    }}
                  />
                </div>
                <span className="pt__prog-label">{pct}%</span>
              </div>

              <div className="pt__deadline-row">
                <span className={`pt__deadline ${due !== null && due <= 2 && ratio < 1 ? 'pt__deadline--soon' : ''}`}>
                  Due {formatDate(a.deadline)}
                  {due === 0 && ' · Today'}
                  {due === 1 && ' · Tomorrow'}
                  {due !== null && due > 1 && ` · ${due} days`}
                  {due !== null && due < 0 && ' · Overdue'}
                </span>
                {ratio === 1 && <span className="pt__done-badge">Complete ✓</span>}
              </div>
            </div>

            {/* Sub-task list */}
            {isOpen && (
              <div className="pt__tasks">
                {a.subTasks.map((st, stIdx) => {
                  const over  = !st.completed && isOverdue(st.suggestedDate);
                  const today = !st.completed && isToday(st.suggestedDate);
                  return (
                    <div
                      key={st.id}
                      className={`pt__task ${st.completed ? 'pt__task--done' : ''} ${over ? 'pt__task--overdue' : ''} ${today ? 'pt__task--today' : ''}`}
                      style={{ animationDelay: `${stIdx * 0.04}s` }}
                    >
                      <button
                        className={`pt__check ${st.completed ? 'pt__check--checked' : ''}`}
                        onClick={() => onToggle(a.id, st.id)}
                        aria-label={st.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {st.completed && <span className="pt__check-mark">✓</span>}
                      </button>
                      <div className="pt__task-body">
                        <span className="pt__task-label">{st.label}</span>
                        {st.suggestedDate && (
                          <span className={`pt__task-date ${over ? 'pt__task-date--overdue' : ''} ${today ? 'pt__task-date--today' : ''}`}>
                            {today ? 'Today' : over ? `Was ${formatDate(st.suggestedDate)}` : formatDate(st.suggestedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  className="pt__delete"
                  onClick={() => onDelete(a.id)}
                  title="Remove this assignment"
                >
                  Remove assignment
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
