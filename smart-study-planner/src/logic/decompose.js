// decompose(type, difficulty) → array of { id, label, weight }
// weight: 1 = light, 2 = moderate, 3 = heavy

const TEMPLATES = {
  'research-paper': [
    { label: 'Choose topic & narrow focus',       weight: 1 },
    { label: 'Search & collect sources',          weight: 2 },
    { label: 'Read & annotate sources',           weight: 3 },
    { label: 'Create outline',                    weight: 1 },
    { label: 'Write introduction',                weight: 2 },
    { label: 'Write body sections',               weight: 3 },
    { label: 'Write conclusion',                  weight: 2 },
    { label: 'Revise & edit draft',               weight: 2 },
    { label: 'Format citations & bibliography',   weight: 1 },
    { label: 'Final proofread',                   weight: 1 },
  ],
  'essay': [
    { label: 'Analyse the prompt',                weight: 1 },
    { label: 'Brainstorm & plan argument',        weight: 1 },
    { label: 'Research supporting evidence',      weight: 2 },
    { label: 'Write outline',                     weight: 1 },
    { label: 'Write first draft',                 weight: 3 },
    { label: 'Revise argument & structure',       weight: 2 },
    { label: 'Proofread & polish',                weight: 1 },
  ],
  'presentation': [
    { label: 'Define key message & audience',     weight: 1 },
    { label: 'Research content',                  weight: 2 },
    { label: 'Create slide outline',              weight: 1 },
    { label: 'Design slides',                     weight: 3 },
    { label: 'Write speaker notes',               weight: 2 },
    { label: 'Rehearse & time yourself',          weight: 2 },
    { label: 'Final review & corrections',        weight: 1 },
  ],
  'problem-set': [
    { label: 'Read all problems & note difficulty', weight: 1 },
    { label: 'Review relevant lecture notes',      weight: 2 },
    { label: 'Solve straightforward problems',     weight: 2 },
    { label: 'Work through harder problems',       weight: 3 },
    { label: 'Check & verify solutions',           weight: 1 },
    { label: 'Write up clean solutions',           weight: 1 },
  ],
  'lab-report': [
    { label: 'Review lab data & notes',           weight: 1 },
    { label: 'Write introduction & background',   weight: 2 },
    { label: 'Describe methods',                  weight: 1 },
    { label: 'Analyse results & create figures',  weight: 3 },
    { label: 'Write discussion',                  weight: 2 },
    { label: 'Write conclusion & abstract',       weight: 1 },
    { label: 'Format references',                 weight: 1 },
  ],
  'other': [
    { label: 'Define scope & requirements',       weight: 1 },
    { label: 'Research & gather material',        weight: 2 },
    { label: 'Complete main work',                weight: 3 },
    { label: 'Review & refine',                   weight: 2 },
    { label: 'Final check',                       weight: 1 },
  ],
};

// Difficulty multiplies total tasks slightly
const DIFFICULTY_FILTER = {
  easy:   (tasks) => tasks.filter((_, i) => i !== 2 && i !== 5).slice(0, 5),
  medium: (tasks) => tasks,
  hard:   (tasks) => {
    const extra = { label: 'Deep revision & peer review', weight: 2 };
    return [...tasks, extra];
  },
};

let idCounter = 0;
function uid() { return `st-${Date.now()}-${idCounter++}`; }

export function decompose(type, difficulty) {
  const base = TEMPLATES[type] || TEMPLATES['other'];
  const filter = DIFFICULTY_FILTER[difficulty] || DIFFICULTY_FILTER['medium'];
  const tasks = filter([...base]);
  return tasks.map(t => ({ ...t, id: uid(), completed: false, suggestedDate: null }));
}
