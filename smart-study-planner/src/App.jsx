import React, { useState } from 'react';
import AssignmentForm   from './components/AssignmentForm';
import Dashboard        from './components/Dashboard';
import WorkloadGauge    from './components/WorkloadGauge';
import ProgressTracker  from './components/ProgressTracker';
import './App.css';

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'assignments' | 'add'

  function handleAdd(assignment) {
    setAssignments(prev => [assignment, ...prev]);
    setView('dashboard');
  }

  function handleToggle(assignmentId, subTaskId) {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          subTasks: a.subTasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  }

  function handleDelete(assignmentId) {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  }

  const totalTasks  = assignments.reduce((s, a) => s + a.subTasks.length, 0);
  const doneTasks   = assignments.reduce((s, a) => s + a.subTasks.filter(t => t.completed).length, 0);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo">◆</span>
          <span className="sidebar__name">Study<em>Planner</em></span>
        </div>

        <nav className="sidebar__nav">
          <button
            className={`sidebar__link ${view === 'dashboard' ? 'sidebar__link--active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            <span className="sidebar__link-icon">◈</span>
            Today's Focus
          </button>
          <button
            className={`sidebar__link ${view === 'assignments' ? 'sidebar__link--active' : ''}`}
            onClick={() => setView('assignments')}
          >
            <span className="sidebar__link-icon">◉</span>
            Assignments
            {assignments.length > 0 && (
              <span className="sidebar__badge">{assignments.length}</span>
            )}
          </button>
          <button
            className={`sidebar__link ${view === 'add' ? 'sidebar__link--active' : ''}`}
            onClick={() => setView('add')}
          >
            <span className="sidebar__link-icon">+</span>
            Add Assignment
          </button>
        </nav>

        {totalTasks > 0 && (
          <div className="sidebar__progress">
            <div className="sidebar__prog-label">
              <span>Overall progress</span>
              <span>{doneTasks}/{totalTasks}</span>
            </div>
            <div className="sidebar__prog-bar">
              <div
                className="sidebar__prog-fill"
                style={{ width: `${Math.round((doneTasks/totalTasks)*100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="sidebar__footer">
          <p>SOEN 357 · Concordia</p>
          <p>Winter 2026</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="main">
        {/* Mobile top bar */}
        <div className="topbar">
          <span className="topbar__brand">◆ StudyPlanner</span>
          <div className="topbar__tabs">
            {['dashboard','assignments','add'].map(v => (
              <button
                key={v}
                className={`topbar__tab ${view === v ? 'topbar__tab--active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === 'dashboard' ? 'Today' : v === 'assignments' ? 'All' : '+'}
              </button>
            ))}
          </div>
        </div>

        <div className="main__content">
          {view === 'dashboard' && (
            <div className="layout-dashboard">
              <div className="layout-dashboard__left">
                <Dashboard assignments={assignments} onToggle={handleToggle} />
                {assignments.length === 0 && (
                  <div className="onboarding">
                    <h2 className="onboarding__title">Welcome to your planner.</h2>
                    <p className="onboarding__body">
                      Add your first assignment and we will automatically break it into
                      steps and build a realistic daily schedule for you.
                    </p>
                    <button className="onboarding__cta" onClick={() => setView('add')}>
                      Add your first assignment →
                    </button>
                  </div>
                )}
              </div>
              <div className="layout-dashboard__right">
                <WorkloadGauge assignments={assignments} />
              </div>
            </div>
          )}

          {view === 'assignments' && (
            <div className="layout-single">
              <div className="page-header">
                <h1 className="page-title">Assignments</h1>
                <button className="page-add-btn" onClick={() => setView('add')}>+ Add new</button>
              </div>
              <ProgressTracker
                assignments={assignments}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </div>
          )}

          {view === 'add' && (
            <div className="layout-single layout-single--narrow">
              <AssignmentForm onAdd={handleAdd} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
