export async function fetchEvents(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load events');
  const data = await res.json();
  return data.map(e => ({
    ...e,
    startDate: new Date(e.start),
    endDate: new Date(e.end)
  })).sort((a,b) => a.startDate - b.startDate);
}

export function applyFilters(events, { q, category, from, to }) {
  const query = q?.toLowerCase() || '';
  const fromDate = from ? new Date(from + 'T00:00:00') : null;
  const toDate = to ? new Date(to + 'T23:59:59') : null;
  return events.filter(e => {
    if (category && e.category !== category) return false;
    if (fromDate && e.startDate < fromDate) return false;
    if (toDate && e.startDate > toDate) return false;
    if (query) {
      const hay = (e.title + ' ' + e.speaker + ' ' + e.description + ' ' + (e.tags||[]).join(' ')).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function buildCategoryOptions(select, events) {
  const cats = [...new Set(events.map(e => e.category))].sort();
  for (const c of cats) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.append(opt);
  }
}

export function onFilterChange(elements, handler) {
  elements.forEach(el => el.addEventListener('input', handler));
}

export function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTimeRange(start, end) {
  const opts = { hour: '2-digit', minute: '2-digit' };
  return `${start.toLocaleTimeString([], opts)} – ${end.toLocaleTimeString([], opts)}`;
}

export function toIsoDate(date) {
  return date.toISOString().slice(0,10);
}