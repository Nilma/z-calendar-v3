function formatDateUtc(date) {
  // ICS uses UTC: YYYYMMDDTHHMMSSZ
  return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
}

export function buildIcsFile(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zealand Academy//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@zealand-academy`,
      `DTSTAMP:${formatDateUtc(new Date())}`,
      `DTSTART:${formatDateUtc(e.startDate)}`,
      `DTEND:${formatDateUtc(e.endDate)}`,
      `SUMMARY:${escapeText(e.title)}`,
      `DESCRIPTION:${escapeText(e.description||'')}`,
      e.location ? `LOCATION:${escapeText(e.location)}` : '',
      `CATEGORIES:${escapeText(e.category)}`,
      'END:VEVENT'
    );
  }
  lines.push('END:VCALENDAR');
  return lines.filter(Boolean).join('\r\n');
}

function escapeText(str) {
  return str.replace(/([,;])/g,'\\$1').replace(/\n/g,'\\n');
}