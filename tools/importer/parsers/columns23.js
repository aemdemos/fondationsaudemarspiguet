/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns23)'];
  const cells = [headerRow];

  // 2. Select main container
  // The relevant content is inside `.container_col.team_listing`
  const teamListing = element.querySelector('.container_col.team_listing');
  if (!teamListing) {
    // Fallback: replace with empty Columns block if not found
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Helper to group .col.col4 blocks together until next section
  function collectSectionBlocks(startIndex, col12s, allCols) {
    const startCol12 = col12s[startIndex];
    const endCol12 = col12s[startIndex + 1];
    const blocks = [];
    let foundStart = false;
    for (const el of allCols) {
      if (el === startCol12) {
        foundStart = true;
        continue;
      }
      if (foundStart) {
        if (el === endCol12) break;
        if (el.classList.contains('col4')) {
          blocks.push(el);
        }
      }
    }
    return blocks;
  }

  // Find all col12 blocks: these are the section headers
  const col12s = Array.from(teamListing.querySelectorAll(':scope > .col.col12'));
  // Find all direct children .col blocks for order preservation
  const allCols = Array.from(teamListing.querySelectorAll(':scope > .col'));

  // For each section (col12)
  for (let s = 0; s < col12s.length; s++) {
    const sectionHeader = col12s[s];
    const sectionBlocks = collectSectionBlocks(s, col12s, allCols);
    if (sectionBlocks.length === 0) {
      // If no col4s, skip
      continue;
    }
    // How many columns in this section? Most likely 3 (as in screenshot)
    const numCols = 3;
    // Add title row (spread the col12 in first cell, rest empty)
    const titleRow = Array(numCols).fill('');
    titleRow[0] = sectionHeader;
    cells.push(titleRow);
    // Now, chunk sectionBlocks into groups of numCols
    for (let i = 0; i < sectionBlocks.length; i += numCols) {
      const row = sectionBlocks.slice(i, i + numCols);
      // If last row is not full, pad with empty
      while (row.length < numCols) row.push('');
      cells.push(row);
    }
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
