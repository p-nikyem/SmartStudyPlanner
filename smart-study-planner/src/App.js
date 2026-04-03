import React, { useState } from 'react';
import WorkloadGauge from './components/WorkloadGauge';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "COEN 448 Assignment",
      subTasks: [
        { id: 1, label: "Write tests", completed: false, suggestedDate: new Date().toISOString().split('T')[0] },
        { id: 2, label: "Run CI", completed: false, suggestedDate: new Date().toISOString().split('T')[0] },
        { id: 3, label: "Fix bugs", completed: true, suggestedDate: new Date().toISOString().split('T')[0] },
      ]
    },
    {
      id: 2,
      title: "Capstone Project",
      subTasks: [
        { id: 4, label: "ROS integration", completed: false, suggestedDate: new Date().toISOString().split('T')[0] },
        { id: 5, label: "Thermal debug", completed: false, suggestedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] }, // tomorrow
      ]
    }
  ]);

  // Toggle function for Dashboard
  const handleToggle = (assignmentId, taskId) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              subTasks: a.subTasks.map(st =>
                st.id === taskId ? { ...st, completed: !st.completed } : st
              )
            }
          : a
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">

        {/* Gauge */}
        <WorkloadGauge assignments={assignments} />

        {/* Dashboard */}
        <Dashboard assignments={assignments} onToggle={handleToggle} />

      </header>
    </div>
  );
}

export default App;