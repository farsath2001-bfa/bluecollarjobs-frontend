import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaBriefcase, FaBuilding, FaFileAlt, FaUsers, FaEnvelope, FaUserCircle } from "react-icons/fa";
import { adminGetStats } from "../../service/api";

// Shared header + tab bar for every admin page
function AdminShell({ title, actions, children }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminGetStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const tabs = [
    { to: "/admin", label: "Overview", icon: FaChartBar, end: true },
    { to: "/admin/jobs", label: "Jobs", icon: FaBriefcase },
    { to: "/admin/companies", label: "Companies", icon: FaBuilding, count: stats?.pendingEmployers },
    { to: "/admin/applications", label: "Applications", icon: FaFileAlt, count: stats?.pendingApplications },
    { to: "/admin/users", label: "Users", icon: FaUsers },
    { to: "/admin/messages", label: "Messages", icon: FaEnvelope, count: stats?.unreadMessages },
    { to: "/admin/account", label: "My account", icon: FaUserCircle },
  ];

  return (
    <div className="container section-tight">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
        <h1 className="h2 mb-0">{title}</h1>
        {actions}
      </div>
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map(({ to, label, icon, end, count }) => (
          <NavLink key={to} to={to} end={end}>
            {React.createElement(icon, { "aria-hidden": true })} {label}
            {count > 0 && <span className="count" aria-label={`${count} new`}>{count}</span>}
          </NavLink>
        ))}
      </nav>
      {typeof children === "function" ? children(stats) : children}
    </div>
  );
}

export default AdminShell;
