
import React, { useState, useEffect } from "react";
import JobCategory from "../components/JobCategory";
import JobCard from "../components/JobCard";
import { getJobs } from "../service/api";

function Home() {

  const categories = [
    { title: "Driver",       jobs: 120 },
    { title: "Construction", jobs: 80  },
    { title: "Cleaning",     jobs: 60  },
    { title: "Technician",   jobs: 50  },
    { title: "Delivery",     jobs: 40  },
    { title: "Security",     jobs: 35  },
    { title: "Plumber",      jobs: 60  },
    { title: "Electrician",  jobs: 40  }
  ];

  const [jobTitle, setJobTitle]     = useState("");
  const [location, setLocation]     = useState("");
  const [allJobs, setAllJobs]       = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searched, setSearched]     = useState(false);

  // ✅ Fetch jobs from backend on page load
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs();
        setAllJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.log("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // ✅ Search filters from backend data
  const handleSearch = async () => {
  setSearched(true);
  try {
    setLoading(true);
    const { data } = await getJobs({
      search: jobTitle,    // ← sends to backend as ?search=driver
      location: location   // ← sends to backend as ?location=dubai
    });
    setFilteredJobs(data);
  } catch (err) {
    console.log("Search error:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-section text-center text-white d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Find Blue Collar Jobs in Dubai
          </h1>
          <p className="lead">Search thousands of jobs across UAE</p>

          {/* SEARCH FORM */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="row g-3 bg-white p-4 rounded shadow mt-4">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Job Title e.g. Driver"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Location e.g. Dubai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button className="btn btn-primary w-100 fw-bold">
                  🔍 Search Jobs
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* STATS */}
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-4">
            <h2 className="fw-bold text-primary">{allJobs.length}+</h2>
            <p className="text-muted">Jobs Available</p>
          </div>
          <div className="col-md-4">
            <h2 className="fw-bold text-success">500+</h2>
            <p className="text-muted">Companies</p>
          </div>
          <div className="col-md-4">
            <h2 className="fw-bold text-warning">2000+</h2>
            <p className="text-muted">Candidates</p>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="container mt-5">
        <h3 className="text-center mb-4">Popular Job Categories</h3>
        <div className="row g-4">
          {categories.map((cat, index) => (
            <JobCategory key={index} title={cat.title} jobs={cat.jobs} />
          ))}
        </div>
      </div>

      {/* LOCATIONS */}
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-5">Find Jobs by Location</h2>
        <div className="row g-3">
          {[
            { code: "ae", name: "UAE",          count: "2,000+" },
            { code: "sa", name: "Saudi Arabia", count: "4,867"  },
            { code: "qa", name: "Qatar",        count: "1,228"  },
            { code: "kw", name: "Kuwait",       count: "498"    },
            { code: "om", name: "Oman",         count: "373"    },
            { code: "bh", name: "Bahrain",      count: "255"    },
            { code: "eg", name: "Egypt",        count: "3,680"  },
          ].map((country) => (
            <div className="col-md-3" key={country.code}>
              <div className="card p-3 h-100 border-0 shadow-sm">
                <div className="d-flex align-items-center">
                  <img
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    alt={country.name}
                    width="50"
                  />
                  <div className="ms-3">
                    <h5 className="mb-0">{country.name}</h5>
                    <small className="text-muted">({country.count})</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="col-md-3">
            <div className="card p-3 h-100 border-0 shadow-sm bg-success text-white d-flex justify-content-center align-items-center" style={{ cursor: "pointer" }}>
              <h5 className="mb-0">More Countries →</h5>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS / ALL JOBS */}
      <div className="container mt-5 mb-5">
        <h3 className="text-center mb-4">
          {searched ? "Search Results" : "Latest Jobs"}
        </h3>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="row g-4">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} {...job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">🔍 No jobs found. Try different keywords.</p>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setJobTitle("");
                setLocation("");
                setFilteredJobs(allJobs);
                setSearched(false);
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;


// import React, { useState, useEffect } from "react";
// import JobCategory from "../components/JobCategory";
// import JobCard from "../components/Jobcard";
// import { getJobs } from "../service/api";

// function Home() {

//   const categories = [
//     { title: "Driver",       jobs: 120 },
//     { title: "Construction", jobs: 80  },
//     { title: "Cleaning",     jobs: 60  },
//     { title: "Technician",   jobs: 50  },
//     { title: "Delivery",     jobs: 40  },
//     { title: "Security",     jobs: 35  },
//     { title: "Plumber",      jobs: 60  },
//     { title: "Electrician",  jobs: 40  }
//   ];

//   const [jobTitle, setJobTitle]         = useState("");
//   const [location, setLocation]         = useState("");
//   const [allJobs, setAllJobs]           = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [searched, setSearched]         = useState(false);

//   // ✅ Fetch jobs from backend on page load
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const { data } = await getJobs();

//         // ✅ DEBUG — shows first job fields on page
//         console.log("First job from backend:", data[0]);

//         setAllJobs(data);
//         setFilteredJobs(data);
//       } catch (err) {
//         console.log("Error fetching jobs:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   const handleSearch = async () => {
//     setSearched(true);
//     try {
//       setLoading(true);
//       const { data } = await getJobs({
//         search:   jobTitle,
//         location: location
//       });
//       setFilteredJobs(data);
//     } catch (err) {
//       console.log("Search error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <div className="hero-section text-center text-white d-flex align-items-center">
//         <div className="container">
//           <h1 className="display-4 fw-bold">
//             Find Blue Collar Jobs in Dubai
//           </h1>
//           <p className="lead">Search thousands of jobs across UAE</p>

//           <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
//             <div className="row g-3 bg-white p-4 rounded shadow mt-4">
//               <div className="col-md-4">
//                 <input
//                   className="form-control"
//                   placeholder="Job Title e.g. Driver"
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4">
//                 <input
//                   className="form-control"
//                   placeholder="Location e.g. Dubai"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4">
//                 <button className="btn btn-primary w-100 fw-bold">
//                   🔍 Search Jobs
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="container mt-5 text-center">
//         <div className="row">
//           <div className="col-md-4">
//             <h2 className="fw-bold text-primary">{allJobs.length}+</h2>
//             <p className="text-muted">Jobs Available</p>
//           </div>
//           <div className="col-md-4">
//             <h2 className="fw-bold text-success">500+</h2>
//             <p className="text-muted">Companies</p>
//           </div>
//           <div className="col-md-4">
//             <h2 className="fw-bold text-warning">2000+</h2>
//             <p className="text-muted">Candidates</p>
//           </div>
//         </div>
//       </div>

//       {/* CATEGORIES */}
//       <div className="container mt-5">
//         <h3 className="text-center mb-4">Popular Job Categories</h3>
//         <div className="row g-4">
//           {categories.map((cat, index) => (
//             <JobCategory key={index} title={cat.title} jobs={cat.jobs} />
//           ))}
//         </div>
//       </div>

//       {/* LOCATIONS */}
//       <div className="container mt-5">
//         <h2 className="text-center fw-bold mb-5">Find Jobs by Location</h2>
//         <div className="row g-3">
//           {[
//             { code: "ae", name: "UAE",          count: "2,000+" },
//             { code: "sa", name: "Saudi Arabia", count: "4,867"  },
//             { code: "qa", name: "Qatar",        count: "1,228"  },
//             { code: "kw", name: "Kuwait",       count: "498"    },
//             { code: "om", name: "Oman",         count: "373"    },
//             { code: "bh", name: "Bahrain",      count: "255"    },
//             { code: "eg", name: "Egypt",        count: "3,680"  },
//           ].map((country) => (
//             <div className="col-md-3" key={country.code}>
//               <div className="card p-3 h-100 border-0 shadow-sm">
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={`https://flagcdn.com/w80/${country.code}.png`}
//                     alt={country.name}
//                     width="50"
//                   />
//                   <div className="ms-3">
//                     <h5 className="mb-0">{country.name}</h5>
//                     <small className="text-muted">({country.count})</small>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div className="col-md-3">
//             <div
//               className="card p-3 h-100 border-0 shadow-sm bg-success text-white d-flex justify-content-center align-items-center"
//               style={{ cursor: "pointer" }}
//             >
//               <h5 className="mb-0">More Countries →</h5>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ DEBUG BOX — shows on webpage, no F12 needed */}
//       {filteredJobs[0] && (
//         <div className="container mt-3">
//           <div className="alert alert-info text-center">
//             <strong>Debug:</strong> First job →
//             Title: <b>{filteredJobs[0].title}</b> |
//             Company: <b>{filteredJobs[0].companyName || "MISSING"}</b> |
//             Logo: <b>{filteredJobs[0].logo || "MISSING"}</b>
//           </div>
//         </div>
//       )}

//       {/* JOBS SECTION */}
//       <div className="container mt-5 mb-5">
//         <h3 className="text-center mb-4">
//           {searched ? "Search Results" : "Latest Jobs"}
//         </h3>

//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status" />
//             <p className="mt-2 text-muted">Loading jobs...</p>
//           </div>
//         ) : filteredJobs.length > 0 ? (
//           <div className="row g-4">
//             {filteredJobs.map((job) => (
//               <JobCard key={job._id} {...job} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-5">
//             <p className="text-muted">🔍 No jobs found. Try different keywords.</p>
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => {
//                 setJobTitle("");
//                 setLocation("");
//                 setFilteredJobs(allJobs);
//                 setSearched(false);
//               }}
//             >
//               Clear Search
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Home;