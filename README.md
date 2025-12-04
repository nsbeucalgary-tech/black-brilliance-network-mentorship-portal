# Black Brilliance Network – Mentorship Portal 

## Getting Started 

### Install dependencies:
```bash
npm install
```
### Start the development server:
```bash
npm run dev
```

## Branch Convention:
For each Page in the application please create a branch and the branch name should be based on the jira tickets for example - "Login-Page"

## Commit Convention:
### General Commit
<pre>
<b><a href="#types">&lt;type&gt;</a></b></font>: <b><a href="#description">&lt;description&gt;</a></b>
</pre>

### Initial Commit 
```
chore: init
```

### Merge Commit
<pre>
Merge branch '<b>&lt;branch name&gt;</b>'
</pre>
<sup>Follows default git merge message</sup>

### Revert Commit
<pre>
Revert "<b>&lt;reverted commit subject line&gt;</b>"
</pre>
<sup>Follows default git revert message</sup>


### Types
- `feat` — Commits that add, adjust or remove a new feature to the API or UI
  - `fix` — Commits that fix an API or UI bug of a preceded `feat` commit

- `refactor` — Commits that rewrite or restructure code without altering API or UI behavior
  - `perf` — Commits are special type of `refactor` commits that specifically improve performance

- `style` — Commits that address code style (e.g., white-space, formatting, missing semi-colons) and do not affect application behavior

- `test` — Commits that add missing tests or correct existing ones

- `docs` — Commits that exclusively affect documentation

- `build` — Commits that affect build-related components such as build tools, dependencies, project version, CI/CD pipelines, ...

- `ops` — Commits that affect operational components like infrastructure, deployment, backup, recovery procedures, ...

- `chore` — Miscellaneous tasks (e.g., changes to `.gitignore`)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
