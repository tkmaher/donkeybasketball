---
name: mem-1
description: Rewrite obistrip.tsx, globals.scss, and page.tsx for collapsing strip to 10% width and column links
---

Implemented collapsing strip to 10dvw width with links in column format when collapsed. Modified obistrip.tsx to conditionally render links-only view when collapsed, updated globals.scss to set width: 10dvw and style the links column, and kept page.tsx unchanged.

**Why:** This implements the user's request to make the strip collapse to 10% of screen width while showing links in a column and hiding non-text elements.

**How to apply:** The collapsed state is triggered by clicking on the strip. The width is set to 10dvw and the links are displayed in a vertical column with 1px gaps.