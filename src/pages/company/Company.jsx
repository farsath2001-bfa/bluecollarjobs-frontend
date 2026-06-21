
// import React from "react";
// import emiratesLogo from "../../assets/CompanyLogos/emirates.png";
// import talabatLogo from "../../assets/CompanyLogos/talabat.png";
// import alnoorLogo from "../../assets/CompanyLogos/alnoor.png";
// import brightLogo from "../../assets/CompanyLogos/bright.png";
// import lazordLogo from "../../assets/CompanyLogos/lazord.png";
// import abcLogo from "../../assets/CompanyLogos/abc.png";
// import { Link } from "react-router-dom";

// function Companies() {

//   const companies = [
//   {
//     id: 1,
//     name: "Emirates Transport",
//     location: "Dubai",
//     jobs: 15,
//     logo: emiratesLogo
//   },
//   {
//     id: 2,
//     name: "Talabat",
//     location: "Dubai",
//     jobs: 25,
//     logo: talabatLogo
//   },
//   {
//     id: 3,
//     name: "Al Noor Technical Services",
//     location: "Sharjah",
//     jobs: 12,
//     logo: alnoorLogo
//   },
//   {
//     id: 4,
//     name: "Bright Facility Management",
//     location: "Abu Dhabi",
//     jobs: 10,
//     logo: brightLogo
//   },
//   {
//     id: 5,
//     name: "Lazord Plumbing Agencies",
//     location: "Sharjah",
//     jobs: 8,
//     logo: lazordLogo
//   },
//   {
//     id: 6,
//     name: "ABC Cargo",
//     location: "Umm Al Quain",
//     jobs: 10,
//     logo: abcLogo
//   }
// ];
//   return (
//     <div className="container mt-5">

//       <h2 className="fw-bold text-center mb-4">
//         Companies Hiring Now
//       </h2>

//       <div className="row g-4">

//         {companies.map((company) => (

//           <div key={company.id} className="col-md-4">

//             <div className="card shadow-sm h-100">
//               <div className="card-body text-center">

//   <img
//     src={company.logo}
//     alt={company.name}
//     style={{ height: "80px", objectFit: "contain" }}
//     className="mb-3"
//   />

//   <h5>{company.name}</h5>

//   <p>📍 {company.location}</p>

//   <p>
//     <strong>{company.jobs} Open Jobs</strong>
//   </p>

//   <Link
//     to={`/company/${company.id}`}
//     className="btn btn-primary"
//   >
//     View Company
//   </Link>

// </div>


//             </div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// }

// export default Companies;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emiratesLogo from "../../assets/CompanyLogos/emirates.png";
import talabatLogo  from "../../assets/CompanyLogos/talabat.png";
import alnoorLogo   from "../../assets/CompanyLogos/alnoor.png";
import brightLogo   from "../../assets/CompanyLogos/bright.png";
import lazordLogo   from "../../assets/CompanyLogos/lazord.png";
import abcLogo      from "../../assets/CompanyLogos/abc.png";
import dewaLogo     from "../../assets/CompanyLogos/dewa.png";
import easLogo      from "../../assets/CompanyLogos/eas.png";

const logoMap = {
  "emirates.png": emiratesLogo,
  "talabat.png":  talabatLogo,
  "alnoor.png":   alnoorLogo,
  "bright.png":   brightLogo,
  "lazord.png":   lazordLogo,
  "abc.png":      abcLogo,
  "dewa.png":     dewaLogo,
  "eas.png":      easLogo,
};

// ✅ Fallback static companies if backend has none
const staticCompanies = [
  { _id: "1", name: "Emirates Transport",       location: "Dubai",        jobs: 15, logo: "emirates.png", industry: "Transportation" },
  { _id: "2", name: "Talabat",                  location: "Dubai",        jobs: 25, logo: "talabat.png",  industry: "Food Delivery"  },
  { _id: "3", name: "Al Noor Technical Services",location: "Sharjah",     jobs: 12, logo: "alnoor.png",   industry: "Technical"      },
  { _id: "4", name: "Bright Facility Management",location: "Abu Dhabi",   jobs: 10, logo: "bright.png",   industry: "Facility Mgmt"  },
  { _id: "5", name: "Lazord Plumbing Agencies",  location: "Sharjah",     jobs: 8,  logo: "lazord.png",   industry: "Plumbing"       },
  { _id: "6", name: "ABC Cargo",                 location: "Umm Al Quain",jobs: 10, logo: "abc.png",      industry: "Cargo"          },
];

function Companies() {
  const [companies, setCompanies] = useState(staticCompanies);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/company");
        const data = await res.json();
        if (data.length > 0) setCompanies(data);
      } catch (err) {
        console.log("Using static companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>

      {/* Header Banner */}
      <div style={{ backgroundColor: "#57749e", padding: "50px 0" }}
        className="text-white text-center mb-5">
        <h2 className="fw-bold">Companies Hiring Now</h2>
        <p className="lead mb-4">Find top employers across the UAE</p>

        {/* Search */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <input
                className="form-control form-control-lg"
                placeholder="Search company or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">

        {/* Count */}
        <p className="text-muted mb-4">
          Showing <strong>{filtered.length}</strong> companies
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((company) => (
              <div key={company._id} className="col-md-4">
                <div className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: "16px", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div className="card-body text-center p-4 d-flex flex-column">

                    {/* Logo */}
                    <div className="mb-3"
                      style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", padding: "16px" }}>
                      <img
                        src={logoMap[company.logo] || emiratesLogo}
                        alt={company.name}
                        style={{ height: "70px", objectFit: "contain" }}
                      />
                    </div>

                    {/* Name */}
                    <h5 className="fw-bold mb-1">{company.name}</h5>

                    {/* Industry Badge */}
                    {company.industry && (
                      <span className="badge bg-light text-primary border mb-2">
                        {company.industry}
                      </span>
                    )}

                    {/* Location */}
                    <p className="text-muted mb-2">📍 {company.location}</p>

                    {/* Jobs count */}
                    <p className="text-success fw-bold mb-3">
                      💼 {company.jobs || 0} Open Jobs
                    </p>

                    {/* Button */}
                    <div className="mt-auto">
                      <Link
                        to={`/company/${company._id}`}
                        className="btn btn-primary w-100"
                      >
                        View Company
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Companies;