import React from 'react';
import './Dashboard.css';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatLongDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getStatusMessage(todayTasks, totalTasks, doneToday) {
  if (totalTasks === 0)   return { text: 'Nothing on your plate yet. Add an assignment to get started.', mood: 'neutral' };
  if (todayTasks.length === 0) return { text: 'No tasks scheduled for today — you\'re ahead of the curve!', mood: 'good' };
  if (doneToday === todayTasks.length) return { text: 'Today\'s tasks are all done. Great work — enjoy the rest of your day.', mood: 'great' };
  const remaining = todayTasks.length - doneToday;
  if (remaining === 1) return { text: 'One task left for today. You\'re almost there.', mood: 'good' };
  return { text: `${remaining} tasks to go today. Take them one at a time.`, mood: 'neutral' };
}

export default function Dashboard({ assignments, onToggle }) {
  const today = todayStr();
  const allTodayTasks = [];

  assignments.forEach(a => {
    a.subTasks.forEach(st => {
      if (st.suggestedDate === today) {
        allTodayTasks.push({ ...st, assignmentTitle: a.title, assignmentId: a.id });
      }
    });
  });

  // Also surface overdue incomplete tasks
  const overdueTasks = [];
  assignments.forEach(a => {
    a.subTasks.forEach(st => {
      if (!st.completed && st.suggestedDate && st.suggestedDate < today) {
        overdueTasks.push({ ...st, assignmentTitle: a.title, assignmentId: a.id });
      }
    });
  });

  const totalSubTasks = assignments.reduce((s, a) => s + a.subTasks.length, 0);
  const doneSubTasks  = assignments.reduce((s, a) => s + a.subTasks.filter(t => t.completed).length, 0);
  const doneToday     = allTodayTasks.filter(t => t.completed).length;
  const overallPct    = totalSubTasks > 0 ? Math.round((doneSubTasks / totalSubTasks) * 100) : 0;
  const status        = getStatusMessage(allTodayTasks, totalSubTasks, doneToday);

  return (
    <div className="dash">
      {/* Date + greeting */}
      <div className="dash__top">
        <div>
          <p className="dash__date">{formatLongDate(today)}</p>
          <h2 className="dash__heading">Today's Focus</h2>
        </div>
        {totalSubTasks > 0 && (
          <div className="dash__overall">
            <svg viewBox="0 0 36 36" className="dash__ring">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={overallPct === 100 ? 'var(--accent)' : 'var(--accent)'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${overallPct} 100`}
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
              <text x="18" y="18" textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: '7px', fontFamily: 'var(--font-body)', fontWeight: 600, fill: 'var(--text-primary)' }}>
                {overallPct}%
              </text>
            </svg>
            <span className="dash__overall-label">overall</span>
          </div>
        )}
      </div>

      {/* Status message */}
      <div className={`dash__status dash__status--${status.mood}`}>
        {status.text}
      </div>

      {/* Overdue callout */}
      {overdueTasks.length > 0 && (
        <div className="dash__overdue-banner">
          <span className="dash__overdue-icon">○</span>
          <span>{overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} from earlier days still pending — see your assignments below.</span>
        </div>
      )}

      {/* Today's task list */}
      {allTodayTasks.length > 0 ? (
        <div className="dash__tasks">
          {allTodayTasks.map((st, i) => (
            <div
              key={st.id}
              className={`dash__task ${st.completed ? 'dash__task--done' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                className={`dash__check ${st.completed ? 'dash__check--checked' : ''}`}
                onClick={() => onToggle(st.assignmentId, st.id)}
                aria-label={st.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {st.completed && <span>✓</span>}
              </button>
              <div className="dash__task-info">
                <span className="dash__task-label">{st.label}</span>
                <span className="dash__task-source">{st.assignmentTitle}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        totalSubTasks > 0 && (
          <div className="dash__free">
            <span className="dash__free-icon">✦</span>
            <p>You're free today. Nothing is scheduled.</p>
          </div>
        )
      )}
    </div>
  );
}
