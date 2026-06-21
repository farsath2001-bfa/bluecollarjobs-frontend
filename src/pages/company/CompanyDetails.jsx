// import React from "react";
// import emiratesLogo from "../../assets/CompanyLogos/emirates.png";
// import talabatLogo from "../../assets/CompanyLogos/talabat.png";
// import alnoorLogo from "../../assets/CompanyLogos/alnoor.png";
// import brightLogo from "../../assets/CompanyLogos/bright.png";
// import lazordLogo from "../../assets/CompanyLogos/lazord.png";
// import abcLogo from "../../assets/CompanyLogos/abc.png";
// import { useParams } from "react-router-dom";

// function CompanyDetails() {
//   const { id } = useParams();

//   const companies = [
//     {
//       id: 1,
//       name: "Emirates Transport",
//       location: "Dubai",
//       jobs: 15,
//       logo: emiratesLogo,
//       industry: "Transportation & Logistics",
//       salaryRange: "AED 2,500 - AED 8,000",
//       employees: "5000+",
//       founded: "1981",
//       description: "One of the largest transportation companies in the UAE providing logistics and transport solutions.",
//       benefits: ["Visa Provided", "Medical Insurance", "Annual Leave", "Accommodation"]
//     },
//     {
//       id: 2,
//       name: "Talabat",
//       location: "Dubai",
//       jobs: 25,
//       logo: talabatLogo,
//       industry: "Food Delivery",
//       salaryRange: "AED 2,500 - AED 6,000",
//       employees: "10,000+",
//       founded: "2004",
//       description: "Talabat is one of the largest food and grocery delivery platforms in the Middle East.",
//       benefits: ["Visa Provided", "Medical Insurance", "Fuel Allowance", "Annual Leave"]
//     },
//     {
//       id: 3,
//       name: "Al Noor Technical Services",
//       location: "Sharjah",
//       jobs: 12,
//       logo: alnoorLogo,
//       industry: "Technical Services",
//       salaryRange: "AED 2,000 - AED 5,500",
//       employees: "500+",
//       founded: "2010",
//       description: "Specialized in electrical, plumbing, and maintenance services across the UAE.",
//       benefits: ["Accommodation", "Transport", "Medical Insurance", "Paid Overtime"]
//     },
//     {
//       id: 4,
//       name: "Bright Facility Management",
//       location: "Abu Dhabi",
//       jobs: 10,
//       logo: brightLogo,
//       industry: "Facility Management",
//       salaryRange: "AED 1,800 - AED 4,000",
//       employees: "1,000+",
//       founded: "2012",
//       description: "Provides cleaning, security, and facility management services to commercial buildings.",
//       benefits: ["Accommodation", "Visa", "Medical Insurance", "Annual Ticket"]
//     },
//     {
//       id: 5,
//       name: "Lazord Plumbing Agencies",
//       location: "Sharjah",
//       jobs: 8,
//       logo: lazordLogo,
//       industry: "Plumbing Services",
//       salaryRange: "AED 2,000 - AED 4,500",
//       employees: "250+",
//       founded: "2015",
//       description: "Residential and commercial plumbing installation and maintenance services.",
//       benefits: ["Accommodation", "Transport", "Medical Insurance", "Bonus"]
//     },
//     {
//       id: 6,
//       name: "ABC Cargo",
//       location: "Umm Al Quain",
//       jobs: 10,
//       logo: abcLogo,
//       industry: "Cargo Services",
//       salaryRange: "AED 1,700 - AED 4,500",
//       employees: "300+",
//       founded: "2010",
//       description: "Delivery Things From Uae To Other Countries services.",
//       benefits: ["Accommodation", "Transport", "Medical Insurance", "Overtime"]
//     }
//   ];

//   // Parse ID string from URL params to match with integer array keys
//   const company = companies.find((c) => c.id === parseInt(id));

//   if (!company) {
//     return <h2 className="text-center mt-5">Company Not Found</h2>;
//   }

//   return (
//     <div className="container mt-5">
//       <div className="card shadow p-4">
//         {/* Alignment Wrapper */}
//         <div className="text-center">
//           <img
//             src={company.logo}
//             alt={company.name}
//             style={{ height: "120px", objectFit: "contain" }}
//           />
//           <h2 className="mt-3">{company.name}</h2>
//           <p className="text-muted">{company.industry}</p>
//         </div>

//         <hr />

//         <div className="px-3">
//           <p><strong>📍 Location:</strong> {company.location}</p>
//           <p><strong>💰 Salary Range:</strong> {company.salaryRange}</p>
//           <p><strong>👥 Employees:</strong> {company.employees}</p>
//           <p><strong>🏢 Founded:</strong> {company.founded}</p>
//           <p><strong>📋 Open Jobs:</strong> {company.jobs}</p>
//         </div>

//         {/* Company Detailed Description and Profile Layout Card */}
//         <div className="card shadow-sm p-4 mt-4">
//           <h4 className="fw-bold mb-3">About Company</h4>
//           <p className="text-muted">{company.description}</p>

//           <h4 className="fw-bold mt-4 mb-3">Benefits</h4>
//           <div className="row">
//             <div className="col-md-6">
//               <ul className="list-group">
//                 {company.benefits.map((benefit, index) => (
//                   <li key={index} className="list-group-item">
//                     ✅ {benefit}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CompanyDetails;   

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

// ✅ Static fallback data
const staticCompanies = [
  {
    _id: "1", name: "Emirates Transport", location: "Dubai",
    logo: "emirates.png", industry: "Transportation & Logistics",
    salaryRange: "AED 2,500 - AED 8,000", employees: "5000+",
    founded: "1981", jobs: 15,
    description: "One of the largest transportation companies in the UAE providing logistics and transport solutions.",
    benefits: ["Visa Provided", "Medical Insurance", "Annual Leave", "Accommodation"]
  },
  {
    _id: "2", name: "Talabat", location: "Dubai",
    logo: "talabat.png", industry: "Food Delivery",
    salaryRange: "AED 2,500 - AED 6,000", employees: "10,000+",
    founded: "2004", jobs: 25,
    description: "Talabat is one of the largest food and grocery delivery platforms in the Middle East.",
    benefits: ["Visa Provided", "Medical Insurance", "Fuel Allowance", "Annual Leave"]
  },
  {
    _id: "3", name: "Al Noor Technical Services", location: "Sharjah",
    logo: "alnoor.png", industry: "Technical Services",
    salaryRange: "AED 2,000 - AED 5,500", employees: "500+",
    founded: "2010", jobs: 12,
    description: "Specialized in electrical, plumbing, and maintenance services across the UAE.",
    benefits: ["Accommodation", "Transport", "Medical Insurance", "Paid Overtime"]
  },
  {
    _id: "4", name: "Bright Facility Management", location: "Abu Dhabi",
    logo: "bright.png", industry: "Facility Management",
    salaryRange: "AED 1,800 - AED 4,000", employees: "1,000+",
    founded: "2012", jobs: 10,
    description: "Provides cleaning, security, and facility management services to commercial buildings.",
    benefits: ["Accommodation", "Visa", "Medical Insurance", "Annual Ticket"]
  },
  {
    _id: "5", name: "Lazord Plumbing Agencies", location: "Sharjah",
    logo: "lazord.png", industry: "Plumbing Services",
    salaryRange: "AED 2,000 - AED 4,500", employees: "250+",
    founded: "2015", jobs: 8,
    description: "Residential and commercial plumbing installation and maintenance services.",
    benefits: ["Accommodation", "Transport", "Medical Insurance", "Bonus"]
  },
  {
    _id: "6", name: "ABC Cargo", location: "Umm Al Quain",
    logo: "abc.png", industry: "Cargo Services",
    salaryRange: "AED 1,700 - AED 4,500", employees: "300+",
    founded: "2010", jobs: 10,
    description: "Delivery services from UAE to other countries.",
    benefits: ["Accommodation", "Transport", "Medical Insurance", "Overtime"]
  },
];

function CompanyDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [company, setCompany]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res  = await fetch(`http://localhost:5000/api/company/${id}`);
        const data = await res.json();
        if (data._id) {
          setCompany(data);
        } else {
          throw new Error("not found");
        }
      } catch (err) {
        // ✅ Fall back to static data
        const found = staticCompanies.find(c => c._id === id);
        setCompany(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (!company) return (
    <div className="container mt-5 text-center">
      <h3>Company not found</h3>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/companies")}>
        Back to Companies
      </button>
    </div>
  );

  const resolvedLogo = logoMap[company.logo] || emiratesLogo;

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">

        {/* Back Button */}
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate("/companies")}
        >
          ← Back to Companies
        </button>

        <div className="row g-4">

          {/* Left Column */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-center"
              style={{ borderRadius: "16px" }}>
              <div style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", padding: "20px" }}
                className="mb-3">
                <img
                  src={resolvedLogo}
                  alt={company.name}
                  style={{ height: "100px", objectFit: "contain" }}
                />
              </div>
              <h4 className="fw-bold">{company.name}</h4>
              <span className="badge bg-primary mb-3">{company.industry}</span>

              <div className="text-start">
                <p><strong>📍 Location:</strong> {company.location}</p>
                <p><strong>💰 Salary Range:</strong> {company.salaryRange || "Competitive"}</p>
                <p><strong>👥 Employees:</strong> {company.employees || "N/A"}</p>
                <p><strong>🏢 Founded:</strong> {company.founded || "N/A"}</p>
                <p><strong>📋 Open Jobs:</strong> {company.jobs || 0}</p>
              </div>

              <Link to="/jobs" className="btn btn-success w-100 mt-2">
                View Open Jobs
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-8">

            {/* About */}
            <div className="card border-0 shadow-sm p-4 mb-4"
              style={{ borderRadius: "16px" }}>
              <h4 className="fw-bold mb-3">About Company</h4>
              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                {company.description || "No description available."}
              </p>
            </div>

            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="card border-0 shadow-sm p-4"
                style={{ borderRadius: "16px" }}>
                <h4 className="fw-bold mb-3">Benefits</h4>
                <div className="row g-2">
                  {company.benefits.map((benefit, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex align-items-center p-2 bg-light rounded">
                        <span className="text-success me-2">✅</span>
                        {benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;
