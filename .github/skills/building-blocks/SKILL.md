---
name: building-blocks
description: 'Use when implementing, fixing, or styling Adobe EDS blocks in blocks/**/*.js and blocks/**/*.css, including decorate functions, DA-authored HTML, variants, images, and authoring instrumentation.'
---

# Build EDS Blocks

## Workflow

1. For a new block, establish the authored input and representative content with [content-driven-development](../content-driven-development/SKILL.md). For an existing block fix, inspect its current decoration and preserve its content contract.
2. Read the closest relevant block and shared helper before editing. Use [block-collection-and-party](../block-collection-and-party/SKILL.md) only when additional reference patterns are needed.
3. Implement in `blocks/<block-name>/<block-name>.js` and `.css`. Export `decorate(block)` as default; make it async only when required. New standalone blocks normally load by convention, without a central JS registry.
4. Transform authored HTML with DOM APIs. Preserve semantic headings, lists, links, and optional content. Avoid rebuilding trusted existing DOM as strings, and do not inject unsanitized remote or author-provided HTML.
5. Reuse `createOptimizedPicture` from `scripts/aem.js` when appropriate. Preserve alt text and responsive image behavior. Follow nearby `moveInstrumentation` usage from `scripts/scripts.js` when replacing instrumented elements.
6. Reuse suitable utilities from `scripts/dom-helpers.js` and `scripts/utils.js`. Keep changes to shared loading code out of scope unless the behavior genuinely requires them.
7. Scope CSS to the block class, keep specificity low, and reuse tokens from `styles/styles.css`. Preserve site themes, typography, breakpoints, and existing variants rather than redesigning surrounding sections.
8. Give interactive controls semantic elements, accessible names, keyboard support, visible focus, and appropriate state attributes. Respect reduced-motion preferences for new animation. Do not add blocking third-party requests or unnecessary dependencies.
9. After the first meaningful edit, run a focused check using [testing-blocks](../testing-blocks/SKILL.md) before expanding the change. Validate all affected variants and report any authoring documentation updates needed.

## Authoring Configuration

Only add or modify block `_*.json` sources when Universal Editor support is requested or required by the existing contract. DA tables do not require those schemas. Regenerate root component JSON with `npm run build:json` after UE source changes.

## References

Local adaptation informed by [Adobe building blocks](https://github.com/adobe/helix-website/tree/main/.claude/skills/building-blocks). Local repository conventions and available tools take precedence over upstream tooling assumptions.