// import React from "react";
// import JobCard from "../../components/Jobcard";
// import abcLogo from "../../assets/CompanyLogos/abc.png";
// import alnoorLogo from "../../assets/CompanyLogos/alnoor.png";
// import brightLogo from "../../assets/CompanyLogos/bright.png";
// import dewaLogo from "../../assets/CompanyLogos/dewa.png";
// import easLogo from "../../assets/CompanyLogos/eas.png";
// import emiratesLogo from "../../assets/CompanyLogos/emirates.png";
// import googleLogo from "../../assets/CompanyLogos/google.png";
// import lazordLogo from "../../assets/CompanyLogos/lazord.png";
// import talabatLogo from "../../assets/CompanyLogos/talabat.png";

// function Job() {
//   // Safe extraction fallback for dynamic admin-posted jobs
//   const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

//   return (
//     <div className="container my-4">
//       {/* Section 1: Featured Static Jobs */}
//       <h3 className="fw-bold mb-4">Featured Jobs</h3>
//       <div className="row g-4 mb-5">
//         <JobCard
//           id={1}
//           title="Driver"
//           company="Emirates Transport"
//           location="Dubai"
//           salary="AED 2500"
//           logo={emiratesLogo}
//         />

//         <JobCard
//           id={2}
//           title="Electrician"
//           company="Al Noor Technical Services"
//           location="Sharjah"
//           salary="AED 3000"
//           logo={alnoorLogo}
//         />

//         <JobCard
//           id={3}
//           title="Cleaner"
//           company="Bright Facility Management"
//           location="Abu Dhabi"
//           salary="AED 1800"
//           logo={brightLogo}
//         />

//         <JobCard
//           id={4}
//           title="Plumber"
//           company="Bright Facility Management"
//           location="Abu Dhabi"
//           salary="AED 1800"
//           logo={brightLogo}
//         />

//         <JobCard
//           id={5}
//           title="Delivery Rider"
//           company="Talabat"
//           location="Dubai"
//           salary="AED 2500 + Commission"
//           logo={talabatLogo}
//         />

//         <JobCard
//           id={6}
//           title="IT Technical Support"
//           company="Google"
//           location="Dubai"
//           salary="AED 4500"
//           logo={googleLogo}
//         />

//         <JobCard
//           id={7}
//           title="Driver"
//           company="EAS"
//           location="Dubai"
//           salary="AED 3500"
//           logo={easLogo}
//         />

//         <JobCard
//           id={8}
//           title="Receptionist"
//           company="Abc Cargo"
//           location="Umm Al Quain"
//           salary="AED 2400 + Accommodation"
//           logo={abcLogo}
//         />
//       </div>

//       <hr className="my-5" />

//       {/* Section 2: Dynamic Admin / Backend Posted Jobs */}
//       <div className="row mb-3">
//         <div className="col-12">
//           <h3 className="fw-bold text-center">Latest Jobs</h3>
//         </div>
//       </div>

//       <div className="row g-4">
//         {jobs.length > 0 ? (
//           jobs.map((job) => (
//             <JobCard key={job.id} {...job} />
//           ))
//         ) : (
//           <p className="text-center text-muted py-4">No Latest jobs available</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Job;


import React, { useState, useEffect } from "react";
import JobCard from "../../components/Jobcard";
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