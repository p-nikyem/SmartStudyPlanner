import React, { useState } from 'react';
import { decompose } from '../logic/decompose';
import { schedule } from '../logic/schedule';
import './AssignmentForm.css';

const TYPES = [
  { value: 'research-paper', label: 'Research Paper' },
  { value: 'essay',          label: 'Essay' },
  { value: 'presentation',   label: 'Presentation' },
  { value: 'problem-set',    label: 'Problem Set' },
  { value: 'lab-report',     label: 'Lab Report' },
  { value: 'other',          label: 'Other' },
];

const DIFFICULTIES = [
  { value: 'easy',   label: 'Light',    desc: 'Quick turnaround' },
  { value: 'medium', label: 'Moderate', desc: 'Standard workload' },
  { value: 'hard',   label: 'Intensive', desc: 'Heavy assignment' },
];

function today() {
  return new Date().toISOString().split('T')[0];
}

let assignmentIdCounter = 0;

export default function AssignmentForm({ onAdd }) {
  const [title,      setTitle]      = useState('');
  const [deadline,   setDeadline]   = useState('');
  const [type,       setType]       = useState('research-paper');
  const [difficulty, setDifficulty] = useState('medium');
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!title.trim())   e.title    = 'Please enter a title.';
    if (!deadline)       e.deadline = 'Please choose a deadline.';
    else if (deadline <= today()) e.deadline = 'Deadline must be a future date.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    // Small artificial delay so the button feedback is visible
    setTimeout(() => {
      const subTasks   = decompose(type, difficulty);
      const scheduled  = schedule(subTasks, deadline);
      const assignment = {
        id:         `asgn-${Date.now()}-${assignmentIdCounter++}`,
        title:      title.trim(),
        deadline,
        type,
        difficulty,
        subTasks:   scheduled,
        createdAt:  new Date().toISOString(),
      };
      onAdd(assignment);
      setTitle('');
      setDeadline('');
      setType('research-paper');
      setDifficulty('medium');
      setSubmitting(false);
    }, 300);
  }

  return (
    <form className="aform" onSubmit={handleSubmit} noValidate>
      <div className="aform__header">
        <h2 className="aform__title">Add assignment</h2>
        <p className="aform__subtitle">We'll break it into steps and build your schedule.</p>
      </div>

      {/* Title */}
      <div className={`aform__field ${errors.title ? 'aform__field--error' : ''}`}>
        <label className="aform__label" htmlFor="af-title">Assignment title</label>
        <input
          id="af-title"
          className="aform__input"
          type="text"
          placeholder="e.g. SOEN 357 Final Report"
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors(v => ({ ...v, title: '' })); }}
          maxLength={120}
        />
        {errors.title && <span className="aform__error">{errors.title}</span>}
      </div>

      {/* Deadline */}
      <div className={`aform__field ${errors.deadline ? 'aform__field--error' : ''}`}>
        <label className="aform__label" htmlFor="af-deadline">Deadline</label>
        <input
          id="af-deadline"
          className="aform__input aform__input--date"
          type="date"
          min={(() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; })()}
          value={deadline}
          onChange={e => { setDeadline(e.target.value); setErrors(v => ({ ...v, deadline: '' })); }}
        />
        {errors.deadline && <span className="aform__error">{errors.deadline}</span>}
      </div>

      {/* Type */}
      <div className="aform__field">
        <label className="aform__label" htmlFor="af-type">Assignment type</label>
        <div className="aform__select-wrap">
          <select
            id="af-type"
            className="aform__select"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <span className="aform__select-arrow">↓</span>
        </div>
      </div>

      {/* Difficulty */}
      <div className="aform__field">
        <label className="aform__label">Workload level</label>
        <div className="aform__difficulty">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              type="button"
              className={`aform__diff-btn ${difficulty === d.value ? 'aform__diff-btn--active' : ''}`}
              onClick={() => setDifficulty(d.value)}
            >
              <span className="aform__diff-label">{d.label}</span>
              <span className="aform__diff-desc">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className={`aform__submit ${submitting ? 'aform__submit--loading' : ''}`}
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Building your plan…' : 'Create study plan →'}
      </button>
    </form>
  );
}
