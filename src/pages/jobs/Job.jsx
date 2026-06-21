
import React, { useState, useEffect } from "react";
import JobCard from "../../components/JobCard";
import { getJobs } from "../../service/api";

function Job() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "All", "Driver", "Electrician", "Cleaning",
    "Plumber", "Security", "Delivery", "Technician", "Construction"
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const { data } = await getJobs(params);
      setJobs(data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs({
      search:   search,
      category: category === "All" ? "" : category
    });
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    fetchJobs({
      category: cat === "All" ? "" : cat
    });
  };

  return (
    <div className="container my-5">

      <h2 className="fw-bold text-center mb-2">All Jobs</h2>
      <p className="text-center text-muted mb-4">
        Find your perfect blue collar job in UAE
      </p>

      {/* Search Bar */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "All" ? "" : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              category === cat || (cat === "All" && category === "")
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs Count */}
      <p className="text-muted mb-3">
        Showing <strong>{jobs.length}</strong> jobs
      </p>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading jobs...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="row g-4">
          {jobs.map((job) => (
            <JobCard key={job._id} {...job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No jobs found. Try different keywords.</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setSearch("");
              setCategory("");
              fetchJobs();
            }}
          >
            Show All Jobs
          </button>
        </div>
      )}

    </div>
  );
}

export default Job;