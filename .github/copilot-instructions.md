# Project Guidelines

This repository is an Adobe Edge Delivery Services site using plain JavaScript modules and CSS. Preserve the existing Fondation, Arbres, and Biencommun visual identities and language behavior. See [README](../README.md) for environments and local setup.

## Implementation

- Reuse nearby blocks and helpers in `scripts/` before introducing dependencies or abstractions. Do not introduce a frontend framework or bundler for block work.
- Keep block behavior and styles in `blocks/<name>/<name>.js` and `.css`. Preserve the default `decorate(block)` export and scope block styles to its class.
- Reuse design tokens and typography in `styles/styles.css` and `styles/fonts.css`. Preserve existing responsive and site-specific variants.
- Preserve semantic authored content, accessible names, links, image alternatives, and authoring instrumentation when transforming the DOM. Use existing image optimization and instrumentation helpers where applicable.
- DA document tables and Universal Editor JSON models are different authoring contracts. Determine the requested authoring surface before changing either. Do not require UE model changes for a DA-only block.
- Treat `component-models.json`, `component-definition.json`, and `component-filters.json` as build outputs. Change their source files in `models/` or block `_*.json` files and run `npm run build:json` when UE configuration changes.

## Verification

- Use the scripts actually defined in `package.json`. The repository has JS/CSS lint scripts but no configured unit-test command. Do not assume `npm test`, `lint:fix`, or Vitest exists.
- Validate the touched block with focused linting and browser checks on representative content. Use `npm run lint` as the final repository lint gate for code changes; distinguish pre-existing failures from regressions.
- Do not publish DA content, modify remote libraries, commit, push, or open pull requests unless requested.

## Block Skills

Load the relevant local skill for block tasks:

- [Content-driven development](skills/content-driven-development/SKILL.md): coordinate content, implementation, and validation.
- [Content modeling](skills/content-modeling/SKILL.md): design DA tables and variants.
- [Building blocks](skills/building-blocks/SKILL.md): implement or modify JS/CSS blocks.
- [Block references](skills/block-collection-and-party/SKILL.md): find reusable local or external patterns.
- [Testing blocks](skills/testing-blocks/SKILL.md): verify behavior, accessibility, responsive layout, and linting.