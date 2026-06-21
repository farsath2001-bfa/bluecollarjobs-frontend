// import React from "react";
// import { Link } from "react-router-dom";

// function CandidateDashboard() {

//     const user = localStorage.getItem("user");
//     return(
//         <div className="container mt-5">
//             <h2 className="text-center mb-5">Candidate Dashboard</h2>
//             <div className="card p-4 shadow-sm">
//                 <h5>Welcome,{user}</h5>
//                 <div className="mt-4 grid gap-3">

//                     <Link to ="/saved" className="btn btn-outline-primary">
//                     Saved Jobs
//                     </Link>

//                     <Link to="/applied" className="btn btn-outline-success">
//                     📂 Applied Jobs
//                     </Link>

//                     <Link to="/" className="btn btn-outline-secondary">
//                     🔍 Browse Jobs
//                     </Link>

//                      <button className="btn btn-danger" onClick={() => {
//                         localStorage.removeItem("user");
//                         localStorage.removeItem("role");
//                         window.location.href = "/login";
//                         }}>
//                      Logout
//                      </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
// export default CandidateDashboard;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [savedCount, setSavedCount]   = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);

  useEffect(() => {
    // ✅ Parse user properly (it's stored as JSON object)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // ✅ Count saved & applied jobs
    const saved   = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setSavedCount(saved.length);
    setAppliedCount(applied.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Candidate Dashboard</h2>
            <p className="text-muted mb-0">
              Welcome back, {user?.name || "Job Seeker"} 👋
            </p>
          </div>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
          <div className="d-flex align-items-center">
            <div
              style={{
                width: "70px", height: "70px", borderRadius: "50%",
                backgroundColor: "#0d6efd", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem", fontWeight: "bold"
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ms-3">
              <h5 className="fw-bold mb-0">{user?.name}</h5>
              <p className="text-muted mb-0">{user?.email}</p>
              <span className="badge bg-light text-primary border mt-1">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #198754", borderRadius: "12px" }}>
              <p className="text-muted mb-1 small">Saved Jobs</p>
              <h3 className="fw-bold text-success">{savedCount}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #0d6efd", borderRadius: "12px" }}>
              <p className="text-muted mb-1 small">Applied Jobs</p>
              <h3 className="fw-bold text-primary">{appliedCount}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3" style={{ borderLeft: "4px solid #ffc107", borderRadius: "12px" }}>
              <p className="text-muted mb-1 small">Profile Status</p>
              <h3 className="fw-bold text-warning">Active</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 h-100 text-center" style={{ borderRadius: "12px" }}>
              <div className="fs-1 mb-2">⭐</div>
              <h6 className="fw-bold">Saved Jobs</h6>
              <p className="text-muted small">View jobs you've bookmarked</p>
              <Link to="/saved" className="btn btn-outline-primary mt-auto">
                View Saved
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 h-100 text-center" style={{ borderRadius: "12px" }}>
              <div className="fs-1 mb-2">📂</div>
              <h6 className="fw-bold">Applied Jobs</h6>
              <p className="text-muted small">Track your applications</p>
              <Link to="/applied" className="btn btn-outline-success mt-auto">
                View Applications
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 h-100 text-center" style={{ borderRadius: "12px" }}>
              <div className="fs-1 mb-2">🔍</div>
              <h6 className="fw-bold">Browse Jobs</h6>
              <p className="text-muted small">Find your next opportunity</p>
              <Link to="/jobs" className="btn btn-outline-secondary mt-auto">
                Browse Jobs
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CandidateDashboard;