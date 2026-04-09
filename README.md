# Smart Study Planner

Smart Study Planner is a React web app that helps students break assignments into smaller tasks and organize work before deadlines.

The application source code lives in:

`smart-study-planner/`

## Prerequisites

- Node.js 18 LTS or newer
- npm (bundled with Node.js)

Check your versions:

```bash
node -v
npm -v
```

## Run the Project (Development)

From this repository root:

```bash
cd smart-study-planner
npm install
npm start
```

Open:

`http://localhost:3000`

## Useful Scripts

Run all commands from `smart-study-planner/`:

- `npm start` - start local development server
- `npm test` - run tests in watch mode
- `npm test -- --watchAll=false` - one-time test run
- `npm run build` - create production build in `build/`
- `npm run eject` - expose CRA config (one-way)

## Production Build

```bash
cd smart-study-planner
npm run build
npx serve -s build
```

## Troubleshooting

- If port 3000 is in use (PowerShell):
  ```powershell
  $env:PORT=3001
  npm start
  ```
- If install fails, remove `node_modules` and `package-lock.json` inside `smart-study-planner/` and run `npm install` again.
- Data resets after refresh because the app currently stores state in memory (no backend/local storage persistence yet).

## Detailed App Documentation

Full project-specific documentation is available in:

`smart-study-planner/README.md`
