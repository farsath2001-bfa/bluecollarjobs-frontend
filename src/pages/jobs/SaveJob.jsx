

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { getJobById } from "../../service/api";

function SavedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const savedIds = JSON.parse(localStorage.getItem("savedJobs")) || [];

      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch full job details for each saved job ID
        const jobPromises = savedIds.map(id =>
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

    fetchSavedJobs();
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">

        <h2 className="fw-bold text-center mb-2">⭐ Saved Jobs</h2>
        <p className="text-center text-muted mb-4">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} saved
        </p>

        {jobs.length > 0 ? (
          <div className="row g-4">
            {jobs.map((job) => (
              <JobCard key={job._id} {...job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No saved jobs yet.</p>
            <p className="text-muted small">
              Tap "Save Job" on any job card to bookmark it here.
            </p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default SavedJobs;