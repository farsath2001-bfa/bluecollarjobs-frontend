// import React from "react";
// import { Link } from "react-router-dom";

// function Admin() {
//   return (
//     <div className="container mt-5">

//       <h2 className="text-center mb-4">Admin Dashboard</h2>

//       <div className="card p-4 shadow-sm">

//         <h5>Admin Controls</h5>

//         <ul>
//           <li>Manage Jobs</li>
//           <li>Manage Users</li>
//           <li>View Applications</li>
//         </ul>
//         <Link to="/admin/jobs" className="btn btn-primary">Manage Jobs</Link>

//       </div>

//     </div>
//   );
// }

// export default Admin;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, getCompanies } from "../../service/api";

function Admin() {
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          getJobs(),
          getCompanies()
        ]);
        setStats({
          jobs: jobsRes.data.length,
          companies: companiesRes.data.length
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name} 👋</p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #0d6efd", borderRadius: "12px" }}>
            <p className="text-muted mb-1 small">Total Jobs</p>
            <h3 className="fw-bold text-primary">{stats.jobs}</h3>
            <p className="text-muted small mb-0">Active listings</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #198754", borderRadius: "12px" }}>
            <p className="text-muted mb-1 small">Companies</p>
            <h3 className="fw-bold text-success">{stats.companies}</h3>
            <p className="text-muted small mb-0">Registered</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #ffc107", borderRadius: "12px" }}>
            <p className="text-muted mb-1 small">Applications</p>
            <h3 className="fw-bold text-warning">--</h3>
            <p className="text-muted small mb-0">Total received</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #dc3545", borderRadius: "12px" }}>
            <p className="text-muted mb-1 small">Users</p>
            <h3 className="fw-bold text-danger">--</h3>
            <p className="text-muted small mb-0">Registered</p>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="row g-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <div className="d-flex align-items-center mb-3">
              <div style={{ backgroundColor: "#e7f0ff", borderRadius: "10px", padding: "10px", marginRight: "15px" }}>
                💼
              </div>
              <h5 className="mb-0 fw-bold">Manage Jobs</h5>
            </div>
            <p className="text-muted small">Add, edit or remove job listings from the portal.</p>
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/admin/jobs")}
            >
              Go to Jobs
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <div className="d-flex align-items-center mb-3">
              <div style={{ backgroundColor: "#e6f9f0", borderRadius: "10px", padding: "10px", marginRight: "15px" }}>
                🏢
              </div>
              <h5 className="mb-0 fw-bold">Manage Companies</h5>
            </div>
            <p className="text-muted small">Add and manage company profiles and logos.</p>
            <button
              className="btn btn-success w-100"
              onClick={() => navigate("/admin/companies")}
            >
              Go to Companies
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <div className="d-flex align-items-center mb-3">
              <div style={{ backgroundColor: "#fff8e6", borderRadius: "10px", padding: "10px", marginRight: "15px" }}>
                👥
              </div>
              <h5 className="mb-0 fw-bold">View Applications</h5>
            </div>
            <p className="text-muted small">See all job applications submitted by users.</p>
            <button
              className="btn btn-warning w-100"
              onClick={() => navigate("/admin/applications")}
            >
              View Applications
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;