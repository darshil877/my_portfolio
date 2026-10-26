import { MILESTONES } from './milestones-config.js';

const COLOR_THEMES = [
  {
    badge: 'bg-purple-500/20 border border-purple-500/40 text-purple-300',
    hover: 'group-hover:text-purple-300'
  },
  {
    badge: 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300',
    hover: 'group-hover:text-cyan-300'
  },
  {
    badge: 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300',
    hover: 'group-hover:text-fuchsia-300'
  },
  {
    badge: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300',
    hover: 'group-hover:text-emerald-300'
  }
];

function getMilestoneSortKeys(item, originalIndex) {
  const yearText = item && item.year != null ? String(item.year) : '';
  const matches = yearText.match(/(?:19|20)\d{2}/g);

  if (!matches || matches.length === 0) {
    console.warn('Milestone has no valid 4-digit year (19xx or 20xx):', item);
    return {
      item,
      originalIndex,
      hasYear: false,
      startYear: Infinity,
      endYear: Infinity
    };
  }

  const startYear = parseInt(matches[0], 10);
  let endYear = startYear;

  if (matches.length > 1) {
    endYear = parseInt(matches[1], 10);
  } else if (/present/i.test(yearText)) {
    endYear = new Date().getFullYear();
  }

  return {
    item,
    originalIndex,
    hasYear: true,
    startYear,
    endYear
  };
}

export function renderMilestones() {
  const container = document.getElementById('milestones-timeline');
  if (!container) return;

  container.textContent = '';

  if (!Array.isArray(MILESTONES) || MILESTONES.length === 0) {
    return;
  }

  const keyedItems = MILESTONES.map((item, index) => getMilestoneSortKeys(item, index));

  keyedItems.sort((a, b) => {
    if (!a.hasYear && !b.hasYear) {
      return a.originalIndex - b.originalIndex;
    }
    if (!a.hasYear) return 1;
    if (!b.hasYear) return -1;

    if (a.startYear !== b.startYear) {
      return a.startYear - b.startYear;
    }

    if (a.endYear !== b.endYear) {
      return a.endYear - b.endYear;
    }

    return a.originalIndex - b.originalIndex;
  });

  const sortedMilestones = keyedItems.map((entry) => entry.item);

  sortedMilestones.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const theme = COLOR_THEMES[index % COLOR_THEMES.length];

    const timelineItem = document.createElement('div');
    timelineItem.className = isEven
      ? 'timeline-item relative flex flex-col md:flex-row items-start group'
      : 'timeline-item relative flex flex-col md:flex-row items-start md:justify-end group';

    const dotWrapper = document.createElement('div');
    dotWrapper.className = 'absolute left-6 md:left-1/2 -translate-x-2.5 md:-translate-x-2.5 top-6';

    const dot = document.createElement('div');
    dot.className = 'timeline-dot-premium';
    dotWrapper.appendChild(dot);
    timelineItem.appendChild(dotWrapper);

    const textWrapper = document.createElement('div');
    textWrapper.className = isEven
      ? 'pl-16 md:pl-0 md:w-1/2 md:pr-16 md:text-right space-y-3'
      : 'pl-16 md:w-1/2 md:pl-16 text-left space-y-3';

    const yearBadge = document.createElement('div');
    yearBadge.className = `inline-block px-3 py-1 rounded-lg ${theme.badge} font-mono text-xs font-bold shadow-md`;
    yearBadge.textContent = item.year != null ? String(item.year) : '';
    textWrapper.appendChild(yearBadge);

    const heading = document.createElement('h3');
    heading.className = `text-2xl font-black text-white ${theme.hover} transition-colors`;
    heading.textContent = item.name != null ? String(item.name) : '';
    textWrapper.appendChild(heading);

    if (item.subtitle && typeof item.subtitle === 'string' && item.subtitle.trim() !== '') {
      const subtitle = document.createElement('p');
      subtitle.className = 'text-sm font-mono text-slate-400 font-semibold';
      subtitle.textContent = item.subtitle;
      textWrapper.appendChild(subtitle);
    }

    const about = document.createElement('p');
    about.className = 'text-sm text-slate-400 font-light leading-relaxed';
    about.textContent = item.about != null ? String(item.about) : '';
    textWrapper.appendChild(about);

    timelineItem.appendChild(textWrapper);
    container.appendChild(timelineItem);
  });
}
