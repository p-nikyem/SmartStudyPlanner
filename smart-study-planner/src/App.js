import React from 'react';
import WorkloadGauge from './components/WorkloadGauge';
import './App.css';

function App() {
  const assignments = [
    {
      subTasks: [
        { completed: false, suggestedDate: '2026-04-03' },
        { completed: false, suggestedDate: '2026-04-04' },
        { completed: true, suggestedDate: '2026-04-05' },
      ],
    },
    {
      subTasks: [
        { completed: false, suggestedDate: '2026-04-06' },
      ],
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <WorkloadGauge assignments={assignments} />
      </header>
    </div>
  );
}

export default App;