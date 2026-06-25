import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'https://bluecollarjobs-backend.onrender.com'

function AdminJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const navigate                = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
    companyName: "",
    jobType: "full-time",
    logo: ""
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddJob = async () => {
    if (!form.title || !form.description || !form.category || !form.location) {
      setError("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/jobs`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Job added successfully!");
      setError("");
      setForm({ title: "", description: "", category: "", location: "", salary: "", companyName: "", jobType: "full-time", logo: "" });
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(job => job._id !== id));
      setSuccess("Job deleted!");
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Manage Jobs</h2>
          <p className="text-muted mb-0">Add and remove job listings</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>
      </div>

      {error   && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <h5 className="fw-bold mb-3">Add New Job</h5>
            <input className="form-control mb-2" placeholder="Job Title *" name="title" value={form.title} onChange={handleChange} />
            <textarea className="form-control mb-2" placeholder="Job Description *" name="description" rows="3" value={form.description} onChange={handleChange} />
            <input className="form-control mb-2" placeholder="Category (e.g. Plumber, Driver) *" name="category" value={form.category} onChange={handleChange} />
            <input className="form-control mb-2" placeholder="Location *" name="location" value={form.location} onChange={handleChange} />
            <input className="form-control mb-2" placeholder="Company Name *" name="companyName" value={form.companyName} onChange={handleChange} />
            <input className="form-control mb-2" placeholder="Salary (e.g. AED 3000)" name="salary" value={form.salary} onChange={handleChange} />
            <select className="form-select mb-2" name="jobType" value={form.jobType} onChange={handleChange}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <select className="form-select mb-3" name="logo" value={form.logo} onChange={handleChange}>
              <option value="">Select Company Logo</option>
              <option value="emirates.png">Emirates</option>
              <option value="talabat.png">Talabat</option>
              <option value="alnoor.png">Al Noor</option>
              <option value="bright.png">Bright Facility</option>
              <option value="lazord.png">Lazord</option>
              <option value="dewa.png">Dewa</option>
              <option value="abc.png">Abc</option>
              <option value="eas.png">Eas</option>
            </select>
            <button className="btn btn-primary w-100 fw-bold" onClick={handleAddJob} disabled={loading}>
              {loading ? "Adding..." : "Add Job"}
            </button>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <h5 className="fw-bold mb-3">All Jobs ({jobs.length})</h5>
            {jobs.length === 0 ? (
              <div className="text-center py-4 text-muted"><p>No jobs yet. Add your first job!</p></div>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                  <div>
                    <strong>{job.title}</strong>
                    <p className="text-muted small mb-0">📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType} &nbsp;|&nbsp; 💰 {job.salary || "Not specified"}</p>
                    <span className="badge bg-light text-dark border">{job.category}</span>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminJobs;