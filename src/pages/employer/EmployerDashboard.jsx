import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import EmployerShell from "./EmployerShell";
import { StatusBadge } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { adminGetApplications } from "../../service/api";
import { timeAgo } from "../../utils/format";

// What makes a company profile convincing to job seekers
const profileChecks = (c) => [
  { label: "Company logo", done: !!c.logo },
  { label: "About the company", done: (c.description || "").length >= 40 },
  { label: "Emirate", done: !!c.location },
  { label: "Industry", done: !!c.industry },
  { label: "Phone / WhatsApp", done: !!c.phone },
];

function EmployerDashboard() {
  useTitle("Employer dashboard");
  const [apps, setApps] = useState(null);

  useEffect(() => {
    adminGetApplications()
      .then(({ data }) => setApps(data))
      .catch(() => setApps([]));
  }, []);

  return (
    <EmployerShell
      title="Employer dashboard"
      actions={(company) =>
        company?.status === "approved" ? (
          <Link to="/employer/jobs?new=1" className="btn btn-primary"><FaPlus /> Post a job</Link>
        ) : null
      }
    >
      {(company) =>
        !company ? (
          <div className="row g-3">{Array.from({ length: 4 }).map((_, i) => <div className="col-6 col-lg-3" key={i}><div className="skel" style={{ height: 104 }} /></div>)}</div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <Link to="/employer/jobs" className="stat-tile">
                  <span className="lbl">Open jobs</span><span className="num">{company.stats.openJobs}</span>
                  <span className="hint">{company.stats.jobs} posted in total</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/employer/applicants" className="stat-tile">
                  <span className="lbl">Applicants</span><span className="num">{company.stats.applications}</span>
                  <span className="hint">across all your jobs</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/employer/applicants?status=pending" className="stat-tile">
                  <span className="lbl">Not reviewed yet</span><span className="num">{company.stats.pendingApplications}</span>
                  <span className="hint">waiting for your call</span>
                </Link>
              </div>
              <div className="col-6 col-lg-3">
                <Link to="/employer/company" className="stat-tile">
                  <span className="lbl">Account</span>
                  <span className="num"><span className={`status status-${company.status}`} style={{ fontSize: "1rem" }}>{company.status === "approved" ? "Approved" : company.status === "pending" ? "Waiting" : "Suspended"}</span></span>
                  <span className="hint">{company.isVerified ? "Verified employer" : "Not verified yet"}</span>
                </Link>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="panel">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h4 mb-0">Latest applicants</h2>
                    <Link to="/employer/applicants" className="fw-semibold">See all</Link>
                  </div>
                  {apps === null ? (
                    <div className="skel" style={{ height: 160 }} />
                  ) : apps.length === 0 ? (
                    <p className="text-steel mb-0">
                      No applicants yet.{" "}
                      {company.status === "approved" ? (
                        <>Post a job with the salary and what you provide (accommodation, transport, visa) — those get the most applicants.</>
                      ) : (
                        <>Once you're approved and post a job, applicants appear here with their phone number and CV.</>
                      )}
                    </p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {apps.slice(0, 6).map((a) => (
                        <li key={a._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                          <span className="avatar" lang="en">{(a.applicant?.name || "?").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>
                          <div className="flex-grow-1 min-w-0">
                            <div className="fw-semibold">{a.applicant?.name || "Deleted user"}</div>
                            <div className="small text-steel">{a.job?.title}, {timeAgo(a.createdAt)}</div>
                          </div>
                          {a.phone && <a href={`tel:${a.phone}`} className="small d-none d-sm-inline ltr">{a.phone}</a>}
                          <StatusBadge status={a.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <aside className="col-lg-4">
                <div className="panel mb-4">
                  <h2 className="h4 mb-1">Your company profile</h2>
                  <p className="small text-steel">Job seekers see this on every job you post. A complete profile gets more applicants.</p>
                  <ul className="list-unstyled small mb-3">
                    {profileChecks(company).map((c) => (
                      <li key={c.label} className={`py-1 d-flex align-items-center gap-2 ${c.done ? "text-steel" : "fw-semibold"}`}>
                        {c.done ? <FaCheckCircle className="text-success" /> : <FaRegCircle />} {c.label}
                      </li>
                    ))}
                  </ul>
                  <Link to="/employer/company" className="btn btn-light-line w-100">Edit company profile</Link>
                </div>
                <div className="panel">
                  <h2 className="h4 mb-2">How it works</h2>
                  <ol className="small text-steel ps-3 mb-0">
                    <li className="mb-1">Post a job with the monthly salary and what's included.</li>
                    <li className="mb-1">It goes live straight away and you get an email for each applicant.</li>
                    <li className="mb-1">Call or WhatsApp applicants, open their CV and update their status — they see it on their dashboard.</li>
                    <li>Close the job when it's filled, or set a closing date.</li>
                  </ol>
                </div>
              </aside>
            </div>
          </>
        )
      }
    </EmployerShell>
  );
}

export default EmployerDashboard;
