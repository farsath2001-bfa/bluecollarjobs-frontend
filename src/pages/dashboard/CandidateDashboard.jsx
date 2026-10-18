import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUserEdit } from "react-icons/fa";
import { CompanyLogo, StatusBadge } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import JobCard from "../../components/JobCard";
import { getMyApplications, getJobs, normalizeJobList } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { initials, timeAgo } from "../../utils/format";

// Which profile fields are filled — employers see these on every application
const profileChecks = (u) => [
  { label: "Phone number", done: !!u?.phone },
  { label: "Location", done: !!u?.location },
  { label: "Skills", done: u?.skills?.length > 0 },
  { label: "Years of experience", done: u?.experienceYears > 0 },
  { label: "Languages", done: u?.languages?.length > 0 },
  { label: "CV link", done: !!u?.resume },
];

function CandidateDashboard() {
  useTitle("My dashboard");
  const { user } = useAuth();
  const { savedIds } = useSavedJobs();
  const [apps, setApps] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApps(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Suggest jobs matching the trade of the most recent application, else newest jobs
  useEffect(() => {
    if (loading) return;
    const appliedIds = new Set(apps.map((a) => a.job?._id));
    const category = apps.find((a) => a.job?.category)?.job.category;
    getJobs({ limit: 6, ...(category ? { category } : {}) })
      .then(({ data }) => setSuggested(normalizeJobList(data).jobs.filter((j) => !appliedIds.has(j._id)).slice(0, 4)))
      .catch(() => {});
  }, [loading, apps]);

  const checks = profileChecks(user);
  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);
  const active = apps.filter((a) => ["pending", "reviewed", "shortlisted"].includes(a.status)).length;
  const good = apps.filter((a) => ["shortlisted", "accepted"].includes(a.status)).length;

  return (
    <div className="container section-tight">
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <span className="avatar avatar-lg">{initials(user.name)}</span>
        <div className="flex-grow-1">
          <h1 className="h2 mb-0">Hello, {user.name.split(" ")[0]}</h1>
          <div className="text-steel">{user.email}{user.phone ? `, ${user.phone}` : ""}</div>
        </div>
        <Link to="/jobs" className="btn btn-primary"><FaSearch /> Find jobs</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <Link to="/applied" className="stat-tile"><span className="lbl">Applications</span><span className="num">{apps.length}</span></Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/applied" className="stat-tile"><span className="lbl">In progress</span><span className="num">{active}</span></Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/applied" className="stat-tile"><span className="lbl">Shortlisted or hired</span><span className="num text-success">{good}</span></Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/saved" className="stat-tile"><span className="lbl">Saved jobs</span><span className="num">{savedIds.size}</span></Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="panel mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Recent applications</h2>
              {apps.length > 0 && <Link to="/applied" className="fw-semibold">View all</Link>}
            </div>
            {loading ? (
              <div className="skel" style={{ height: 120 }} />
            ) : apps.length === 0 ? (
              <p className="text-steel mb-0">You haven't applied for anything yet. <Link to="/jobs">Browse open jobs</Link> and apply in a minute.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {apps.slice(0, 5).map((a) => (
                  <li key={a._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <CompanyLogo logo={a.job?.logo} name={a.job?.companyName} size="sm" />
                    <div className="flex-grow-1 min-w-0">
                      {a.job ? <Link to={`/jobs/${a.job._id}`} className="fw-semibold text-reset">{a.job.title}</Link> : <span>Job removed</span>}
                      <div className="small text-steel">{a.job?.companyName}, applied {timeAgo(a.createdAt).toLowerCase()}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {suggested.length > 0 && (
            <>
              <h2 className="h4 mb-3">Jobs you might like</h2>
              <div className="job-list">{suggested.map((j) => <JobCard key={j._id} {...j} />)}</div>
            </>
          )}
        </div>

        <aside className="col-lg-4">
          <div className="panel">
            <h2 className="h4 mb-1">Your profile</h2>
            <p className="text-steel small">Employers see this with every application. A full profile gets more calls.</p>
            <div className="d-flex justify-content-between small fw-semibold mb-1"><span>{pct}% complete</span><span>{done}/{checks.length}</span></div>
            <div className="progress-thin mb-3"><span style={{ width: `${pct}%` }} /></div>
            <ul className="list-unstyled small mb-3">
              {checks.map((c) => (
                <li key={c.label} className={`py-1 ${c.done ? "text-steel text-decoration-line-through" : "fw-semibold"}`}>
                  {c.done ? "✓ " : "○ "}{c.label}
                </li>
              ))}
            </ul>
            <Link to="/profile" className="btn btn-light-line w-100"><FaUserEdit /> Edit profile</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CandidateDashboard;
