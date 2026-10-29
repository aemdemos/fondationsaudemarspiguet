---
name: content-driven-development
description: 'Use when creating or significantly changing Adobe EDS blocks for this site, especially DA document authoring. Coordinate authored content, content modeling, block implementation, and validation before coding from a visual design alone.'
---

# Content-Driven Block Development

## Workflow

1. Start from the requested block, existing page, design, or failing behavior. Read the nearest implementation and identify its authored HTML contract.
2. Determine whether the change targets DA, Universal Editor, or both. Existing UE configuration in this repository does not establish which authoring surface a particular page uses.
3. Identify the content authors need to provide and the variants users need. Reuse the existing content contract unless a change is necessary.
4. For a new or changed contract, use [content-modeling](../content-modeling/SKILL.md). Define the table and optional fields before implementing DOM transformations.
5. Obtain representative content: a supplied preview page, an existing example, or a minimal local fixture. Include an empty or optional field, long text, and multiple items where relevant. If remote content is unavailable, use local HTML matching EDS input rather than publishing content without permission.
6. Use [building-blocks](../building-blocks/SKILL.md) for implementation and [testing-blocks](../testing-blocks/SKILL.md) for validation. For a small bug fix, retain the existing model and run the smallest relevant check.
7. Deliver the implementation, authoring table or example when changed, tested URL, and any validation limits. Identify any DA library update needed; do not change remote content without authorization.

## Boundaries

- Keep authoring simple; do not expose presentation details as required configuration.
- Preserve existing site themes, languages, and compatible authored content.
- Do not invent a DA tenant, preview URL, content path, or credentials. Use supplied configuration and the repository README.

## References

Project-specific workflow informed by [Adobe's content-driven development skill](https://github.com/adobe/helix-website/tree/main/.claude/skills/content-driven-development). This local adaptation is not a vendored copy of Adobe's skill bundle.