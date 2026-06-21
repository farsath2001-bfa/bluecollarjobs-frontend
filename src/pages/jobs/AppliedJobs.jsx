// import React from "react";

// function AppliedJobs() {

//   const applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];

//   return (
//     <div className="container mt-5">

//       <h2 className="text-center mb-4">Applied Jobs</h2>

//       {applied.length > 0 ? (
//         <ul className="list-group">
//           {applied.map((job, index) => (
//             <li key={index} className="list-group-item">
//               Job ID: {job}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-center">No applied jobs yet</p>
//       )}

//     </div>
//   );
// }

// export default AppliedJobs;   


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobById } from "../../service/api";

function AppliedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const appliedIds = JSON.parse(localStorage.getItem("appliedJobs")) || [];

      if (appliedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch full job details for each applied job ID
        const jobPromises = appliedIds.map(id =>
          getJobById(id).then(res => res.data).catch(() => null)
        );
        const results = await Promise.all(jobPromises);
        setJobs(results.filter(job => job !== null));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">

        <h2 className="fw-bold text-center mb-4">My Applied Jobs</h2>

        {jobs.length > 0 ? (
          <div className="row g-3">
            {jobs.map((job) => (
              <div key={job._id} className="col-md-8 mx-auto">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">{job.title}</h6>
                      <p className="text-muted small mb-1">{job.companyName}</p>
                      <p className="text-muted small mb-0">
                        📍 {job.location} &nbsp;|&nbsp; 💰 {job.salary || "N/A"}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success mb-2">Applied</span>
                      <br />
                      <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-primary">
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">You haven't applied to any jobs yet.</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default AppliedJobs;