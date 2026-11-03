---
name: content-modeling
description: 'Use when designing or changing EDS block content structures, DA authoring tables, optional fields, block variants, or author-facing examples. Distinguish DA document content from Universal Editor component JSON models.'
---

# Model Block Content

## Workflow

1. Inspect the current block input or a neighboring example. Identify content semantics: images, headings, descriptions, links, repeated entries, and optional values.
2. Select the simplest suitable model:
   - Standalone for a hero, quote, or unique narrative element.
   - Collection for repeated cards, slides, or other items, usually one row per item.
   - Configuration for genuinely dynamic behavior such as a listing source or filter.
   - Auto-blocking when ordinary content or sections provide a simpler established authoring experience.
3. Specify a DA table with a block-name header and clear row/cell meanings. Prefer few columns, semantic headings and links, inferred defaults, and named variants such as `Cards (Statistics)` over numerous configuration cells.
4. Define empty-state behavior, optional cells, multiple links or images, long text, and compatibility with existing content. Avoid positional assumptions not guaranteed by the agreed table.
5. Return a compact author-facing example: table, cell purposes, optional fields, variants, and representative content or preview URL. Preserve the model in an existing suitable documentation location when one exists.
6. If Universal Editor support is explicitly needed, inspect the neighboring block `_*.json` definition/model/filter pattern. Update source JSON and run `npm run build:json`; never hand-edit the generated root component files.

## DA and Universal Editor

DA content tables are the authored content contract, not the root component JSON schema. Do not add UE configuration to a DA-only block by default. Determine the actual authoring surface from the task and available page/configuration evidence.

When library examples need updating, identify the configured library and required changes. Remote DA edits and publication require authorization.

## References

Local adaptation informed by [Adobe content modeling](https://github.com/adobe/helix-website/tree/main/.claude/skills/content-modeling) and [DA library documentation](https://docs.da.live/administrators/guides/setup-library).