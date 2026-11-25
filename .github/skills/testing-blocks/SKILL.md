---
name: testing-blocks
description: 'Use after changing EDS blocks, shared scripts, styles, or authoring configuration. Validate decoration, variants, accessibility, responsive rendering, image loading, and repository ESLint/Stylelint checks.'
---

# Validate EDS Block Changes

## Focused Checks

1. Select the smallest check that can disprove the intended behavior. Run it immediately after the first meaningful edit before broadening the work.
2. Use installed project tooling and substitute the actual block name:

   ```sh
   npx --no-install eslint blocks/<block-name>/<block-name>.js
   npx --no-install stylelint blocks/<block-name>/<block-name>.css
   ```

   Check other touched JS/CSS files explicitly when needed. If dependencies are absent, follow the README installation procedure. Do not silently fetch alternative tooling.
3. For UE source JSON changes, run `npm run build:json`, verify generated JSON is parseable, and inspect the diff for unrelated generated changes.
4. This repository does not define `npm test`, `lint:fix`, or a unit-test framework. Do not claim those checks ran. Prefer existing test infrastructure if later added; propose a framework only when the requested behavior warrants it.

## Browser Validation

1. Use a supplied preview path or representative local content. Start the existing AEM workflow with `aem up`; if the default port is occupied, inspect `aem up --help` and select an available port. Report the actual local URL. Do not install a global CLI without authorization.
2. If no remote content is available, inspect AEM CLI support for `--html-folder` and use a minimal local fixture containing valid EDS page structure. Do not guess a DA content path or overwrite existing drafts.
3. Use available browser/Playwright tools to verify desktop and mobile rendering, representative variants, multiple block instances, empty optional fields, long text, images, and navigation or interaction. Check console errors and failed resources.
4. Verify keyboard operation, focus visibility, semantic controls, accessible names, alt text, and reduced-motion behavior where affected.
5. Capture screenshots for visual changes and inspect overflow, overlap, clipping, and layout shifts. Check affected site themes and languages when shared behavior changes.
6. If no usable browser, CLI, or content fixture is available, state exactly what remains unverified. Do not equate lint passing with browser validation.

## Final Gate

Run `npm run lint` for code changes. Keep unrelated failures separate from regressions caused by the change. Summarize checks actually executed, affected variants, tested URL, and remaining risks. Do not commit, push, publish, or create a PR as part of testing unless requested.

## References

Local adaptation informed by [Adobe testing blocks](https://github.com/adobe/helix-website/tree/main/.claude/skills/testing-blocks), adjusted to the scripts available in this repository.