import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { StatusBadge } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { timeAgo } from "../../utils/format";

const STATUS_ORDER = ["pending", "reviewed", "shortlisted", "accepted", "rejected"];

function Admin() {
  useTitle("Admin");

  return (
    <AdminShell title="Admin overview" actions={<Link to="/admin/jobs?new=1" className="btn btn-primary"><FaPlus /> Post a job</Link>}>
      {(stats) =>
        !stats ? (
          <div className="row g-3">{Array.from({ length: 4 }).map((_, i) => <div className="col-6 col-lg-3" key={i}><div className="skel" style={{ height: 104 }} /></div>)}</div>
        ) : (
          <>
            {stats.pendingEmployers > 0 && (
              <Link to="/admin/companies?status=pending" className="notice notice-warn mb-3 text-decoration-none">
                <strong>{stats.pendingEmployers} {stats.pendingEmployers === 1 ? "employer is" : "employers are"} waiting for approval.</strong>
                <span className="ms-auto fw-semibold">Review now →</span>
              </Link>
            )}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <Link to="/admin/jobs" className="stat-tile">
                  <span className="lbl">Open jobs</span><span className="num">{stats.activeJobs}</span>
                  <span className="hint">{stats.jobs - stats.activeJobs} closed</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/admin/applications" className="stat-tile">
                  <span className="lbl">Applications</span><span className="num">{stats.applications}</span>
                  <span className="hint">{stats.pendingApplications} waiting for review</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/admin/users" className="stat-tile">
                  <span className="lbl">Job seekers</span><span className="num">{stats.users}</span>
                  <span className="hint">registered accounts</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/admin/companies" className="stat-tile">
                  <span className="lbl">Companies</span><span className="num">{stats.companies}</span>
                  <span className="hint">{stats.unreadMessages} unread {stats.unreadMessages === 1 ? "message" : "messages"}</span>
                </Link>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="panel">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h4 mb-0">Latest applications</h2>
                    <Link to="/admin/applications" className="fw-semibold">Review all</Link>
                  </div>
                  {stats.recentApplications.length === 0 ? (
                    <p className="text-steel mb-0">No applications yet. They'll show up here as candidates apply.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {stats.recentApplications.map((a) => (
                        <li key={a._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                          <div className="flex-grow-1 min-w-0">
                            <strong>{a.applicant?.name || "Deleted user"}</strong>
                            <span className="text-steel"> applied for </span>
                            <strong>{a.job?.title || "a removed job"}</strong>
                            <div className="small text-steel">{a.job?.companyName}, {timeAgo(a.createdAt).toLowerCase()}</div>
                          </div>
                          <StatusBadge status={a.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="panel">
                  <h2 className="h4 mb-3">Applications by status</h2>
                  {STATUS_ORDER.map((s) => {
                    const n = stats.applicationsByStatus?.[s] || 0;
                    const pct = stats.applications ? Math.round((n / stats.applications) * 100) : 0;
                    return (
                      <Link to={`/admin/applications?status=${s}`} key={s} className="d-block text-reset mb-3">
                        <div className="d-flex justify-content-between small mb-1"><StatusBadge status={s} /><strong>{n}</strong></div>
                        <div className="progress-thin"><span style={{ width: `${pct}%`, background: "var(--navy-2)" }} /></div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )
      }
    </AdminShell>
  );
}

export default Admin;
