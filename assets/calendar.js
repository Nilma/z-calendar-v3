import { formatDateTime, formatTimeRange, toIsoDate } from './utils.js';

/* Helper to slugify categories for CSS classes */
function catSlug(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function renderList(container, events) {
  container.innerHTML = '';
  if (!events.length) {
    container.innerHTML = '<li class="empty">No events found. Adjust filters.</li>';
    return;
  }
  const frag = document.createDocumentFragment();
  for (const e of events) {
    const li = document.createElement('li');
    li.className = 'event-card';
    li.dataset.category = e.category;
    li.innerHTML = `
      <h3>${e.title}</h3>
      <div class="meta">
        <span>${formatDateTime(e.startDate)}</span>
        <span>${e.location || ''}</span>
        <span>${e.speaker || ''}</span>
      </div>
      <p class="description">${escapeHtml(e.description || '')}</p>
      <div class="badges">
        <span class="badge" data-cat="${e.category}">${e.category}</span>
        ${(e.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}
      </div>
      <div class="actions">
        <button class="outline" data-action="ics" data-id="${e.id}">Add to Calendar</button>
      </div>
    `;
    frag.appendChild(li);
  }
  container.appendChild(frag);
}

export function renderCalendar(state, DOM) {
  if (!DOM.calendarGrid) {
    console.warn('Calendar grid element missing from DOM.');
    return;
  }
  const { calendarFocus, filtered } = state;
  const year = calendarFocus.getFullYear();
  const month = calendarFocus.getMonth();

  DOM.calendarLabel.textContent =
    calendarFocus.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay(); // 0=Sun
  const localeFirstDay = 1; // Monday
  const offset = (startDay - localeFirstDay + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = toIsoDate(new Date());

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    const dateObj = new Date(year, month, dayNum);
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const dateIso = toIsoDate(dateObj);
    const evts = filtered.filter(e => toIsoDate(e.startDate) === dateIso);
    cells.push({ dateObj, dateIso, inMonth, evts, isToday: dateIso === todayIso });
  }

  DOM.calendarGrid.innerHTML = '';
  const weekDayLabels = [];
  for (let d = 0; d < 7; d++) {
    // Using a fixed Monday-based reference week
    const base = new Date(2025, 0, d + 6);
    weekDayLabels.push(base.toLocaleString(undefined, { weekday: 'short' }).slice(0,2));
  }
  // Header labels
  weekDayLabels.forEach(lbl => {
    const hd = document.createElement('div');
    hd.className = 'calendar-cell outside';
    hd.style.minHeight = 'auto';
    hd.style.background = 'transparent';
    hd.style.border = 'none';
    hd.style.fontWeight = '700';
    hd.textContent = lbl;
    hd.setAttribute('role', 'columnheader');
    DOM.calendarGrid.appendChild(hd);
  });

  let monthHasEvents = false;

  for (const c of cells) {
    const div = document.createElement('div');
    div.className =
      'calendar-cell' +
      (c.inMonth ? '' : ' outside') +
      (c.isToday ? ' today' : '');
    div.setAttribute('data-date', c.dateIso);
    div.setAttribute('role', 'gridcell');
    if (c.evts.length) {
      monthHasEvents = true;
      div.setAttribute('aria-label',
        `${c.dateObj.toDateString()} (${c.evts.length} event${c.evts.length>1?'s':''})`);
    } else {
      div.setAttribute('aria-label', c.dateObj.toDateString());
    }
    div.innerHTML = `
      <div class="calendar-date">${c.dateObj.getDate()}</div>
      ${c.evts.map(ev => {
        const slug = catSlug(ev.category);
        return `<div class="calendar-event-dot cat-${slug}" title="${escapeHtml(ev.title)}"></div>`;
      }).join('')}
    `;
    div.addEventListener('click', () => openDayDetail(c, DOM));
    DOM.calendarGrid.appendChild(div);
  }

  if (DOM.calendarEmptyNote) {
    DOM.calendarEmptyNote.hidden = monthHasEvents;
  }
}

function openDayDetail(cell, DOM) {
  DOM.dayDetail.hidden = false;
  DOM.dayDetailDate.textContent = new Date(cell.dateIso)
    .toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
  DOM.dayDetailEvents.innerHTML =
    cell.evts.map(e => `
      <li>
        <strong>${e.title}</strong><br/>
        <span>${formatTimeRange(e.startDate, e.endDate)}</span> •
        <span>${e.location || 'TBA'}</span><br/>
        <em>${escapeHtml(e.description||'')}</em>
      </li>
    `).join('') || '<li>No events</li>';
}

export function renderTimeline(container, events) {
  container.innerHTML = '';
  if (!events.length) {
    container.innerHTML = '<p>No events.</p>';
    return;
  }
  const frag = document.createDocumentFragment();
  for (const e of events) {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.dataset.category = e.category;
    div.innerHTML = `
      <strong>${e.title}</strong>
      <div class="meta">
        <span>${formatDateTime(e.startDate)}</span>
        <span>${e.location || ''}</span>
      </div>
      <p class="description">${escapeHtml(e.description||'')}</p>
    `;
    frag.appendChild(div);
  }
  container.appendChild(frag);
}

export function exportIcs(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}