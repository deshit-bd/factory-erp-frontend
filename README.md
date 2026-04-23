# Factory ERP Frontend

This repository now starts with a feature-based React + JavaScript architecture using Tailwind CSS.

## Folder structure

```text
src/
  app/        # app bootstrap, providers, Tailwind entry styles
  features/   # business features (auth, inventory, dashboard, ...)
  pages/      # route-level page composition
  shared/     # generic reusable ui, libs, constants, helpers
  widgets/    # larger composed blocks that combine features/shared ui
```

## Architecture rules

1. Keep `app/` thin. It should wire providers, routing, and global app concerns.
2. Put business-specific UI, hooks, state, and services inside the relevant feature folder.
3. Use `shared/` only for code that is genuinely generic and not tied to one business domain.
4. Compose features into `widgets/` and `pages/` rather than letting features depend heavily on each other.
5. Export public APIs from each feature via its `index.js`.

## Example feature shape

```text
features/
  inventory/
    components/
    hooks/
    services/
    index.js
```

Add subfolders only when the feature actually needs them. Start small and grow intentionally.

## Getting started

```bash
npm install
npm run dev
```

## Tailwind usage

- Tailwind is loaded from `src/app/styles/index.css`.
- Vite uses the `@tailwindcss/vite` plugin.
- Prefer utility classes in components.
- Keep truly reusable patterns in shared components instead of rebuilding long class strings everywhere.
