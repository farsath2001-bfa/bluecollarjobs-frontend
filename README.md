# Jobz Dxb — Frontend

React 19 + Vite + Bootstrap 5 (bundled) job portal for blue-collar jobs in the UAE.

## Run locally

```bash
npm install
cp .env.example .env     # point VITE_API_URL at your backend, e.g. http://localhost:5000/api
npm run dev
```

## Deploy (Vercel)

- Set `VITE_API_URL` in **Project → Settings → Environment Variables** (e.g. `https://bluecollarjobs-backend.onrender.com/api`).
- Optional: `VITE_WHATSAPP_NUMBER` (e.g. `971501234567`, country code, no `+`) adds "WhatsApp us" in the footer and an "Apply on WhatsApp" button on jobs that have no number of their own.
- `vercel.json` sends `/sitemap.xml` to the backend and rewrites every other path to `index.html`, so links like `/jobs/123` work on refresh.

## Languages

English, Arabic, Hindi and Urdu, switched from the globe button in the top bar (remembered per browser). Arabic and Urdu flip the layout right-to-left and load Bootstrap's RTL stylesheet.

- Text lives in `src/i18n/en.js`, `ar.js`, `hi.js`, `ur.js`. English is the fallback for any missing key.
- In a component: `const t = useT();` then `t("home.title")` or `t("common.daysAgo", { n: 3 })`.
- Trades, emirates, benefits and job types are stored in English in the database and translated for display (`tCategory`, `tLocation`, `tBenefit`, `tJobType` in `utils/format.js`).
- The admin panel stays in English.

## Install as an app (PWA)

`public/manifest.webmanifest`, `public/icons/` and `public/sw.js` make the site installable on phones and computers. The service worker only runs in production builds; it keeps pages fresh (network first) and caches built files, and never caches API responses. After changing `sw.js`, bump `VERSION` inside it so old caches are cleared.

## SEO

- Each page sets its title, description, Open Graph tags and canonical URL (`utils/useTitle.js`).
- Job pages add Google for Jobs `JobPosting` data, so open jobs can appear in Google's job search.
- `public/robots.txt` points to the sitemap. After deploying, add the site in Google Search Console and submit `https://bluecollarjobs-frontend.vercel.app/sitemap.xml`.

## Structure

```
src/
  service/api.js            all API calls (one axios instance, JWT attached automatically)
  context/AuthContext.jsx   logged-in user, stored under localStorage "jobz.auth"
  context/SavedJobsContext  saved-job ids synced with the backend
  context/ToastContext      toast("Saved") / toast("Failed", "error")
  components/               Navbar, Footer, JobCard, JobCategory, ui.jsx (Modal, ConfirmDialog, EmptyState, Pagination…)
  pages/                    public pages, jobs/, company/, dashboard/ (candidate), admin/
  utils/format.js           logos, salary/date formatting, emirates & job types, translated labels
  i18n/                     translations + language switching
  components/Uploads.jsx    CV upload (candidates) and logo upload (admin) via the backend / Cloudinary
```

## Roles

- **Candidate** — browse, save, apply, track applications, edit profile (`/dashboard`, `/applied`, `/saved`, `/profile`)
- **Admin** — `/admin`: overview stats, jobs (with WhatsApp number and closing date), companies (logo upload), applications (status + notes + call/WhatsApp + CSV export), users, contact messages, My account (name, phone, password)
