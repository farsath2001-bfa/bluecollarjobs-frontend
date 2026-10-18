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
- `vercel.json` rewrites every path to `index.html` so links like `/jobs/123` work on refresh.

## Structure

```
src/
  service/api.js            all API calls (one axios instance, JWT attached automatically)
  context/AuthContext.jsx   logged-in user, stored under localStorage "jobz.auth"
  context/SavedJobsContext  saved-job ids synced with the backend
  context/ToastContext      toast("Saved") / toast("Failed", "error")
  components/               Navbar, Footer, JobCard, JobCategory, ui.jsx (Modal, ConfirmDialog, EmptyState, Pagination…)
  pages/                    public pages, jobs/, company/, dashboard/ (candidate), admin/
  utils/format.js           logos, salary/date formatting, emirates & job types
```

## Roles

- **Candidate** — browse, save, apply, track applications, edit profile (`/dashboard`, `/applied`, `/saved`, `/profile`)
- **Admin** — `/admin`: overview stats, jobs, companies, applications (status + notes + call/WhatsApp), users, contact messages
