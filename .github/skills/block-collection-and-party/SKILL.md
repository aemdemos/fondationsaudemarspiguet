---
name: block-collection-and-party
description: 'Use when searching for reusable Adobe EDS blocks, reference implementations, Block Collection or Block Party examples, or existing site patterns before creating a new block.'
---

# Find Reusable Block Patterns

## Workflow

1. Search this repository first for the requested behavior in `blocks/`, `templates/`, and the nearest relevant helpers in `scripts/`. Inspect the actual implementation rather than assuming a block name guarantees a match.
2. Compare the closest candidate's authored structure, variants, accessibility, image behavior, and dependencies against the requested content contract. Prefer extending a compatible existing block over duplicating it.
3. When local patterns are insufficient, consult [Adobe Block Collection](https://www.aem.live/developer/block-collection) or [Block Party](https://www.aem.live/developer/block-party/). Use available web tools and verify the actual source before recommending reuse.
4. Treat external implementations as references, not automatically trusted dependencies. Check license terms, dependencies, runtime compatibility, authoring assumptions, and accessibility before copying or installing anything. Preserve required attribution when reusing code.
5. Return the selected reference, why it fits, and the smallest adaptation needed. Use [building-blocks](../building-blocks/SKILL.md) to implement; do not import another site's branding, framework, or content model wholesale.

## References

Local workflow informed by [Adobe's block reference skill](https://github.com/adobe/helix-website/tree/main/.claude/skills/block-collection-and-party). External lookup is optional; lack of network access does not block use of local patterns.