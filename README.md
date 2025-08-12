# Zealand Academy Event Calendar

A lightweight, dependency‑free event calendar web application for Zealand Academy.  
It starts as a static, easily hostable site (GitHub Pages / Netlify / Vercel / any static server) and can be progressively upgraded to a full-stack platform.

> Version: v2 (Zealand theme variant with improved theming and calendar robustness)

---

## Table of Contents
1. Overview  
2. Demo & Screenshots  
3. Feature Matrix  
4. Tech Stack & Philosophy  
5. Project Structure  
6. Quick Start (Static)  
7. Adding & Managing Events  
8. Theming & Zealand Branding  
9. Accessibility (A11y)  
10. ICS Export Details  
11. Performance Notes  
12. Progressive Enhancement Roadmap  
13. Migration to Next.js (Outline)  
14. Future Extensions (Recurring Events, Registration, JSON-LD, Feeds)  
15. Testing Strategy  
16. Deployment Guides (GitHub Pages / Netlify / Vercel)  
17. Troubleshooting  
18. Contributing  
19. License & Brand Disclaimer  
20. Changelog (Key Milestones)

---

## 1. Overview

This project provides:
- A rich client‑side interface (List, Calendar, Timeline views) for academic events.
- Filtering (search, category, date range).
- Brand theme overrides (Zealand-inspired) applied via CSS variables.
- Dark mode toggle (persisted via localStorage).
- Export of filtered events to iCalendar (.ics).
- Zero external JS dependencies (vanilla ES modules).
- Simple JSON data source (`events.json`) to reduce operational complexity.

---

## 2. Demo & Screenshots

(Replace with actual URLs once deployed.)

- Live Demo (placeholder): https://your-demo-url.example
- Screenshot suggestions:
  - `docs/screenshots/list-view.png`
  - `docs/screenshots/calendar-view.png`
  - `docs/screenshots/timeline-view-dark.png`
  - `docs/screenshots/day-detail.png`

Add them after capturing; keep file sizes low (<300 KB) for repo health.

---

## 3. Feature Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| List view | ✅ | Responsive grid cards |
| Calendar (monthly) | ✅ | Day details panel |
| Timeline view | ✅ | Chronological vertical line |
| Search | ✅ | Title, speaker, description, tags |
| Category filter | ✅ | Populated dynamically |
| Date range filter | ✅ | Inclusive boundaries |
| iCal (.ics) export | ✅ | Filtered subset |
| Dark mode | ✅ | `data-theme` with persistence |
| Zealand theme | ✅ | Overridable variables |
| Admin mock form | ✅ | Generates JSON snippet only (no persistence) |
| Recurring events | 🚧 Planned | See roadmap |
| JSON-LD structured data | 🚧 Planned | Boost SEO |
| API backend | 🚧 Planned | Next.js / Prisma |
| Auth-protected admin | 🚧 Planned | OAuth / OIDC / Auth.js |
| Registration / RSVP | 🚧 Planned | Email confirmations |
| Webcal subscription feed | 🚧 Planned | ICS feed endpoint |

---

## 4. Tech Stack & Philosophy

| Layer | Choice | Reason |
|-------|--------|-------|
| Markup | HTML5 semantic | Accessibility & portability |
| Styles | CSS custom properties + progressive enhancement | Theming flexibility (Zealand palette) |
| Behavior | ES Modules (vanilla JS) | No build required |
| Data | Static JSON (`events.json`) | Easy to edit pre‑backend |
| Export | Hand-built ICS generator | Keeps bundle minimal |
| Future backend | Next.js + Prisma | Full-stack evolution path |

Principles:
- Start simple, avoid premature complexity.
- Use human-readable IDs.
- Optimize for accessibility and maintainable design tokens.

---

## 5. Project Structure

```
/
├─ index.html
├─ admin.html
├─ events.json
├─ assets/
│  ├─ styles.css
│  ├─ zealand-theme.css
│  ├─ utils.js
│  ├─ calendar.js
│  ├─ ical.js
│  ├─ favicon.svg
├─ README.md
└─ (optional) docs/ (screenshots, design notes)
```

---

## 6. Quick Start (Static)

1. Clone:
   git clone https://github.com/your-org/zealand-event-calendar.git
2. Serve (must use HTTP for `fetch`):
   - Python: `python -m http.server 8080`
   - Node: `npx serve .`
3. Visit: http://localhost:8080
4. Edit `events.json` to add more events.
5. (Optional) Adjust theme in `assets/zealand-theme.css`.

---

## 7. Adding & Managing Events

Edit `events.json`:

```jsonc
{
  "id": "2025-10-03-new-event",
  "title": "New Event",
  "start": "2025-10-03T09:00:00+02:00",
  "end":   "2025-10-03T11:00:00+02:00",
  "category": "Workshop",
  "location": "Room B101",
  "speaker": "Jane Doe",
  "description": "Details...",
  "tags": ["Topic1","Topic2"]
}
```

Guidelines:
- `id`: Prefer `YYYY-MM-DD-slug` for deterministic uniqueness.
- Timestamps: ISO 8601 with timezone offset (`+02:00`) or `Z` for UTC.
- Keep categories consistent (e.g., "Workshop", "Lab") to leverage filtering.
- Tags: free-form; searchable.

To generate JSON quickly: use `admin.html` (static helper form). Copy the JSON snippet into `events.json`.

---

## 8. Theming & Zealand Branding

Brand customizations live in `assets/zealand-theme.css`:
- Overrides CSS variables after `styles.css`.
- Provides palette tokens: `--brand`, `--brand-accent`, etc.
- Introduces decorative gradient hero and accent bar.
- Category-specific dot/badge styling uses slugified category names.

To update palette:
1. Inspect official site with browser DevTools.
2. Collect primary/secondary/neutral hex codes (ensure usage rights).
3. Replace placeholders in `zealand-theme.css`.
4. Verify contrast (e.g., WebAIM contrast checker for AA 4.5:1).

Dark Mode:
- Triggered by data attribute on `<html data-theme="dark">`.
- Maintained in `localStorage`.

Disable dark mode (optional):
- Remove toggle button and associated script.
- Set only light theme variables.

---

## 9. Accessibility (A11y)

Implemented:
- Distinct focus ring (`--focus`) not removed by theme.
- ARIA labels for view containers & filters.
- List updates announced via `aria-live="polite"`.
- Calendar cells use `role="gridcell"` with `aria-label` summarizing events.
- Color not sole means of conveying information (text labels remain).

Recommended Enhancements:
- Add keyboard navigation for calendar (arrow keys) — planned.
- Add skip link for screen readers.
- Provide a high-contrast mode toggle if brand allows.

---

## 10. ICS Export Details

- Export uses currently filtered event set.
- UTC formatting uses `YYYYMMDDTHHMMSSZ`.
- Minimal ICS properties: `UID`, `DTSTAMP`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, `CATEGORIES`.
- For recurring events (future), incorporate RRULE.

---

## 11. Performance Notes

- No frameworks = minimal bundle.
- Single network fetch (`events.json`).
- Rendering scales well for dozens to hundreds of events; above ~2–3k events, paginate or lazy load.
- Defer heavy transformations (none currently) and rely on DOM fragment batching.

Potential Optimizations:
- Precompute slug fields server-side (future backend).
- Add HTTP caching headers / ETag once hosted behind a CDN.

---

## 12. Progressive Enhancement Roadmap

| Phase | Goal | Key Tasks |
|-------|------|-----------|
| 1 | Static MVP | (Complete) JSON fetch + views |
| 2 | Backend API | Next.js API route `/api/events` |
| 3 | Auth | Auth.js / OIDC for admin |
| 4 | Admin CRUD UI | Protected dashboard, validation (Zod) |
| 5 | Recurrence & Feeds | RRULE support + `/feed.ics` + Webcal |
| 6 | Registrations | RSVP endpoints + email notifications |
| 7 | Observability | Logging, metrics, error tracking (Sentry) |
| 8 | SEO & Indexing | JSON-LD, meta OG/Twitter tags |
| 9 | i18n | Language switch + localized date formatting |

---

## 13. Migration to Next.js (Outline)

1. `npx create-next-app@latest`
2. Add Prisma: `npm i @prisma/client` + `npx prisma init`
3. Define `Event` model:
   ```prisma
   model Event {
     id        String   @id
     title     String
     start     DateTime
     end       DateTime
     category  String
     location  String?
     speaker   String?
     description String?
     tags      String[] @default([])
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
4. `npx prisma migrate dev`
5. API route (`app/api/events/route.ts`) for GET/POST with input validation (Zod).
6. Replace `fetch('events.json')` with `fetch('/api/events')`.
7. Add ISR or caching for public event pages.
8. Add authentication (Auth.js) for POST/PUT/DELETE.

---

## 14. Future Extensions

Recurring Events:
- Add fields: `recurrenceRule` (RRULE), `recurrenceEnd`.
- Expand in UI by generating instances within visible range.

Registration / RSVP:
- Add capacity fields (`capacity`, `spotsRemaining`).
- Endpoint: `POST /api/events/{id}/rsvp`.
- Email confirmation + cancellation.

JSON-LD Structured Data:
- Inject `<script type="application/ld+json">` with an `@type: Event` list (increase discoverability).

Feeds:
- Provide `/events.json` (already static), `/feed.ics`, `/feed.atom`.

Notifications:
- Web Push or email digest for new events matching tags.

---

## 15. Testing Strategy

Current (manual):
- Verify filtering & view toggling in Chrome, Firefox, Safari.
- Check keyboard tab order.

Proposed Automation:
- Playwright for UI flows (List->Calendar->Timeline).
- Contract tests for API (post-migration).

Sample Playwright scenario (future):
```ts
test('can filter by category and see calendar event', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('#categoryFilter', 'Workshop');
  await page.click('text=Calendar');
  await expect(page.locator('.calendar-event-dot')).toHaveCount(>=1);
});
```

---

## 16. Deployment Guides

### GitHub Pages
1. Keep project at root.
2. Enable Pages (Settings > Pages > Deploy from main).
3. Ensure relative paths (already relative).
4. If using a subpath (e.g., `/calendar/`), adjust fetch to `./events.json`.

### Netlify
- Drag & drop or `netlify deploy`.
- No build command needed (static).
- Set `_headers` if adding caching later.

### Vercel
- Import repo.
- Framework: "Other".
- Root directory: `/`.
- Output: static.

---

## 17. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Calendar view blank | Missing calendar markup after theme merge | Use full `index.html` from v2 |
| Console error: fetch failed | Opening with `file://` | Serve via local HTTP server |
| Filters do nothing | Event IDs load but no matches | Check `events.json` date formats |
| ICS file empty | Filters exclude all events | Clear filters before export |
| Dark mode not persisting | localStorage blocked | Check browser privacy settings |
| Dots missing for category | Category spelling mismatch | Normalize category names / slug logic |

---

## 18. Contributing

1. Fork & branch: `feat/<short-description>`
2. For UI changes, include before/after screenshots.
3. Run accessibility check (Lighthouse).
4. Submit PR with:
   - Summary
   - Rationale
   - Any trade-offs
5. Code style: keep vanilla, avoid adding frameworks unless roadmap stage is reached.

---

## 19. License & Brand Disclaimer

- Code: MIT (adjust if institutional policy differs).
- Zealand name/logo/brand elements may be protected; ensure you have rights before using official assets.
- This repository avoids bundling proprietary fonts or logos unless explicitly permitted.

Example MIT header:

```
MIT License © Zealand Academy / Contributors
```

---

## 20. Changelog (Key Milestones)

| Version | Date | Notes |
|---------|------|-------|
| v1 | Initial | Static MVP (list/calendar/timeline) |
| v2 | Added Zealand theme | Theme layer, improved calendar resilience, category color dots |
| vNext | Planned | Backend API + Auth |

Maintain a full `CHANGELOG.md` if release cadence increases.

---

## FAQ

Q: Why no framework initially?  
A: Minimize complexity, reduce bundle size, and keep barrier to contribution low.

Q: How many events can this handle?  
A: Practically a few hundred before UI performance degrades; beyond that, paginate or virtualize.

Q: Can I import a CSV?  
A: Convert CSV to JSON (e.g., small Node script) matching the event schema.

---

## Maintainership Tasks

| Interval | Task |
|----------|------|
| Weekly | Add new events, prune past duplicates |
| Monthly | Validate accessibility & Lighthouse score |
| Quarterly | Review dependencies (once backend added) |
| Ongoing | Ensure brand tokens align with current style guide |

---

## Next Steps (Suggested)

1. Add JSON-LD event markup.
2. Implement keyboard navigation across calendar cells.
3. Introduce recurrence handling (RRULE parser or manual generation).
4. Move to Next.js backend once editorial velocity increases.
5. Offer ICS subscription feed for calendars (Outlook/Google).

---

If you need help implementing any roadmap item (e.g., Next.js API, RRULE expansion, JSON-LD injection), open an issue or request guidance.

Happy building! 🎉