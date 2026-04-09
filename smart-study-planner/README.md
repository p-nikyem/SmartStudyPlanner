# Smart Study Planner

Smart Study Planner is a React web app that helps students break assignments into smaller tasks and spread work over the days leading to a deadline.

## Features

- Add assignments with title, deadline, type, and workload level.
- Auto-generate sub-tasks based on assignment type.
- Auto-schedule tasks from today to the deadline (heavier tasks are placed earlier).
- Track progress by assignment and by daily focus view.
- See workload density for the next 7 days.
- Mark tasks complete/incomplete and remove assignments.

## Tech Stack

- React 19
- Create React App (`react-scripts` 5)
- Plain CSS modules per component

## Prerequisites

Install these tools before running:

- Node.js 18 LTS or newer
- npm (comes with Node.js)

Check versions:

```bash
node -v
npm -v
```

## Project Location

From the repository root, the app is inside:

`smart-study-planner/`

All runtime commands below should be run from that folder.

## Quick Start (Development)

1. Move into the app directory:

```bash
cd smart-study-planner
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open the app:

`http://localhost:3000`

## Available Scripts

In `smart-study-planner/`, you can run:

- `npm start`
  - Runs the app in development mode on port 3000 by default.
  - Auto-reloads when files change.
- `npm test`
  - Starts the Jest test runner in watch mode.
- `npm run build`
  - Builds an optimized production bundle in `build/`.
- `npm run eject`
  - Permanently exposes CRA config files. Use only if you need custom tooling.

For CI or a one-time test run:

```bash
npm test -- --watchAll=false
```

## How to Use the App

1. Open the **Add Assignment** view.
2. Enter:
   - Assignment title
   - Deadline (must be a future date)
   - Assignment type
   - Workload level (`Light`, `Moderate`, or `Intensive`)
3. Submit to generate a study plan.
4. Use:
   - **Today's Focus** for tasks scheduled today and overdue items.
   - **Assignments** for full progress tracking and task completion.
   - **Next 7 days** gauge for workload overview.

## Scheduling and Task Logic

- Task templates are defined by assignment type in `src/logic/decompose.js`.
- Difficulty adjusts task set size:
  - `easy`: fewer tasks
  - `medium`: default tasks
  - `hard`: adds extra revision task
- Date scheduling happens in `src/logic/schedule.js`:
  - Sorts tasks by weight (heavy first)
  - Spreads tasks between today and deadline
  - Assigns earlier dates to heavier tasks

## Project Structure

```text
smart-study-planner/
  public/
  src/
    components/
      AssignmentForm.jsx
      Dashboard.jsx
      ProgressTracker.jsx
      WorkloadGauge.jsx
    logic/
      decompose.js
      schedule.js
    App.jsx
    index.js
  package.json
```

## Production Build

Create a production bundle:

```bash
cd smart-study-planner
npm run build
```

The output is generated in:

`smart-study-planner/build/`

To serve it locally:

```bash
npx serve -s build
```

## Troubleshooting

- `npm install` fails or dependencies are missing:
  - Delete `node_modules` and `package-lock.json`, then run `npm install` again.
- `Port 3000 is already in use`:
  - Windows PowerShell:
    ```powershell
    $env:PORT=3001
    npm start
    ```
- App data disappears after refresh:
  - Current implementation stores assignments in memory only (no backend or local storage persistence yet).
- Deadline validation error:
  - The app only accepts future dates (not today or past dates).

## Notes

- This project was created for SOEN 357 (Concordia University).
- Current version is frontend-only with no authentication or database.
