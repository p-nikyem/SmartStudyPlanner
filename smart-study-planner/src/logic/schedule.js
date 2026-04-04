// schedule(subTasks, deadline) → subTasks with suggestedDate filled in
// Distributes tasks across available days, weighted by task weight.
// Heavier tasks land earlier; density increases near the deadline.

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function schedule(subTasks, deadline) {
  if (!subTasks || subTasks.length === 0) return subTasks;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  // Available days (today inclusive, deadline inclusive)
  const totalDays = Math.max(
    1,
    Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24)) + 1
  );

  // Sort tasks: heaviest first (get scheduled earliest = more days buffer)
  const sorted = [...subTasks].sort((a, b) => b.weight - a.weight);

  // Total weight units
  const totalWeight = sorted.reduce((s, t) => s + t.weight, 0);

  // Assign each task a day offset proportional to its cumulative weight position
  // but biased so heavier tasks land early
  let cumulativeWeight = 0;
  const scheduled = sorted.map((task) => {
    // position in [0,1] where 0 = start, 1 = deadline
    const position = cumulativeWeight / totalWeight;
    const dayOffset = Math.floor(position * (totalDays - 1));
    const suggestedDate = toDateStr(addDays(today, dayOffset));
    cumulativeWeight += task.weight;
    return { ...task, suggestedDate };
  });

  // Restore original order (by original index) so UI displays in logical sequence
  const idToDate = Object.fromEntries(scheduled.map(t => [t.id, t.suggestedDate]));
  return subTasks.map(t => ({ ...t, suggestedDate: idToDate[t.id] }));
}
