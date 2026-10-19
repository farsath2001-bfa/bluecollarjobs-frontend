import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChartBar, FaBriefcase, FaFileAlt, FaBuilding, FaHourglassHalf, FaBan } from "react-icons/fa";
import { getEmployerCompany } from "../../service/api";

// Shared header + tabs for the employer area. Loads the employer's company (status, stats)
// and hands it to `actions` / `children` when they are functions.
function EmployerShell({ title, actions, children }) {
  const [company, setCompany] = useState(null);

  const refresh = useCallback(() => getEmployerCompany().then(({ data }) => setCompany(data)).catch(() => {}), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const tabs = [
    { to: "/employer", label: "Overview", icon: FaChartBar, end: true },
    { to: "/employer/jobs", label: "My jobs", icon: FaBriefcase },
    { to: "/employer/applicants", label: "Applicants", icon: FaFileAlt, count: company?.stats?.pendingApplications },
    { to: "/employer/company", label: "Company profile", icon: FaBuilding },
  ];

  const render = (x) => (typeof x === "function" ? x(company, refresh) : x);

  return (
    <div className="container section-tight">
      {company?.status === "pending" && (
        <div className="notice notice-warn mb-3" role="status">
          <FaHourglassHalf aria-hidden="true" />
          <div>
            <strong>Your account is waiting for approval.</strong> Our team checks every new employer to keep job seekers safe — we may call you on{" "}
            <span className="ltr">{company.phone}</span>. Meanwhile, complete your <Link to="/employer/company">company profile</Link>. You can post jobs as soon as you're approved.
          </div>
        </div>
      )}
      {company?.status === "suspended" && (
        <div className="notice notice-danger mb-3" role="alert">
          <FaBan aria-hidden="true" />
          <div>
            <strong>Your employer account is suspended</strong> and your jobs are hidden from the site.
            {company.statusNote && <> Reason: {company.statusNote}.</>} <Link to="/contact">Contact us</Link> if you think this is a mistake.
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
        <div>
          <h1 className="h2 mb-0">{title}</h1>
          {company && <div className="text-steel small">{company.name}</div>}
        </div>
        {render(actions)}
      </div>
      <nav className="admin-tabs" aria-label="Employer sections">
        {tabs.map(({ to, label, icon, end, count }) => (
          <NavLink key={to} to={to} end={end}>
            {React.createElement(icon, { "aria-hidden": true })} {label}
            {count > 0 && <span className="count" aria-label={`${count} new`}>{count}</span>}
          </NavLink>
        ))}
      </nav>
      {render(children)}
    </div>
  );
}

export default EmployerShell;
