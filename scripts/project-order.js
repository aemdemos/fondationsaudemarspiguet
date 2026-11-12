function getProjectSortDate(project, endYear) {
  const fallback = endYear * 10000 + 1231;
  const value = project.startDate?.trim();
  if (!value) return fallback;

  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (match) {
    const [day, month, year] = match.slice(1).map(Number);
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    if (year > 0 && date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) {
      return year * 10000 + month * 100 + day;
    }
  }
  console.warn(`Invalid Start Date for project ${project.path}: "${value}". Expected DD.MM.YYYY; using Duration instead.`);
  return fallback;
}

export default function sortProjects(projects) {
  return projects.map((project) => {
    const [start, end] = (project.duration || '').replace(/\s*→\s*/, '→').split('→')
      .map((year) => parseInt(year.trim(), 10));
    const startYear = Number.isFinite(start) ? start : 0;
    const endYear = Number.isFinite(end) ? end : 0;
    return {
      project,
      date: getProjectSortDate(project, endYear),
      startYear,
      endYear,
    };
  }).sort((left, right) => right.date - left.date
    || right.endYear - left.endYear || right.startYear - left.startYear)
    .map(({ project }) => project);
}
