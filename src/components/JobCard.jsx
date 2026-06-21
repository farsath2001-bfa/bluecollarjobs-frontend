
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaMapMarkerAlt, FaMoneyBill, FaStar } from "react-icons/fa";

// import abcLogo      from "../assets/CompanyLogos/abc.png";
// import alnoorLogo   from "../assets/CompanyLogos/alnoor.png";
// import brightLogo   from "../assets/CompanyLogos/bright.png";
// import dewaLogo     from "../assets/CompanyLogos/dewa.png";
// import easLogo      from "../assets/CompanyLogos/eas.png";
// import emiratesLogo from "../assets/CompanyLogos/emirates.png";
// import lazordLogo   from "../assets/CompanyLogos/lazord.png";
// import talabatLogo  from "../assets/CompanyLogos/talabat.png";

// const logoMap = {
//   "abc.png":      abcLogo,
//   "alnoor.png":   alnoorLogo,
//   "bright.png":   brightLogo,
//   "dewa.png":     dewaLogo,
//   "eas.png":      easLogo,
//   "emirates.png": emiratesLogo,
//   "lazord.png":   lazordLogo,
//   "talabat.png":  talabatLogo,
// };

// const defaultLogo = emiratesLogo;

// function JobCard({ _id, title, companyName, location, salary, logo, jobType }) {

//   // ✅ Only declared once
//   const resolvedLogo = logoMap[logo] || defaultLogo;

//   const [saved, setSaved] = useState(() => {
//     const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
//     return savedJobs.includes(_id);
//   });

//   const handleSave = () => {
//     let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
//     if (savedJobs.includes(_id)) {
//       savedJobs = savedJobs.filter((jobId) => jobId !== _id);
//       setSaved(false);
//     } else {
//       savedJobs.push(_id);
//       setSaved(true);
//     }
//     localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
//   };

//   return (
//     <div className="col-md-4">
//       <div className="card job-card shadow-sm h-100 border-0">
//         <div className="card-body d-flex flex-column">

//           {/* Logo */}
//           <div className="text-center mb-3">
//             <img
//               src={resolvedLogo}
//               alt={companyName}      
//               style={{ width: "80px", height: "80px", objectFit: "contain" }}
//             />
//           </div>

//           {/* Job Type Badge */}
//           {jobType && (
//             <div className="text-center mb-2">
//               <span className="badge bg-light text-primary border">
//                 {jobType}
//               </span>
//             </div>
//           )}

//           {/* Title */}
//           <h6 className="fw-bold text-center mb-2">{title}</h6>

//           {/* Company */}
//           <p className="text-center text-muted mb-2">
//             <strong>{companyName || "Company"}</strong>
//           </p>

//           {/* Location */}
//           <p className="text-center text-muted mb-2">
//             <FaMapMarkerAlt className="me-1 text-danger" />
//             {location}
//           </p>

//           {/* Salary */}
//           <p className="text-center text-success fw-bold mb-3">
//             <FaMoneyBill className="me-1" />
//             {salary || "Salary not specified"}
//           </p>

//           {/* Buttons */}
//           <div className="mt-auto">
//             <Link
//               to={`/jobs/${_id}`}
//               className="btn btn-primary w-100 mb-2"
//             >
//               View Job
//             </Link>

//             <button
//               className={`btn w-100 ${saved ? "btn-warning" : "btn-outline-success"}`}
//               onClick={handleSave}
//             >
//               {saved ? <><FaStar className="me-1" />Saved</> : "Save Job"}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default JobCard;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBill, FaStar } from "react-icons/fa";

import abcLogo      from "../assets/CompanyLogos/abc.png";
import alnoorLogo   from "../assets/CompanyLogos/alnoor.png";
import brightLogo   from "../assets/CompanyLogos/bright.png";
import dewaLogo     from "../assets/CompanyLogos/dewa.png";
import easLogo      from "../assets/CompanyLogos/eas.png";
import emiratesLogo from "../assets/CompanyLogos/emirates.png";
import lazordLogo   from "../assets/CompanyLogos/lazord.png";
import talabatLogo  from "../assets/CompanyLogos/talabat.png";

const logoMap = {
  "abc.png":      abcLogo,
  "alnoor.png":   alnoorLogo,
  "bright.png":   brightLogo,
  "dewa.png":     dewaLogo,
  "eas.png":      easLogo,
  "emirates.png": emiratesLogo,
  "lazord.png":   lazordLogo,
  "talabat.png":  talabatLogo,
};

const defaultLogo = emiratesLogo;

function JobCard({ _id, title, companyName, location, salary, logo, jobType }) {

  const resolvedLogo = logoMap[logo] || defaultLogo;

  const [saved, setSaved] = useState(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    return savedJobs.includes(_id);
  });

  const handleSave = () => {
    let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    if (savedJobs.includes(_id)) {
      savedJobs = savedJobs.filter((jobId) => jobId !== _id);
      setSaved(false);
    } else {
      savedJobs.push(_id);
      setSaved(true);
    }
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  };

  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "12px" }}>
        <div className="card-body d-flex flex-column p-4">

          {/* Logo */}
          <div className="text-center mb-3">
            <img
              src={resolvedLogo}
              alt={companyName}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Job Type Badge */}
          {jobType && (
            <div className="text-center mb-2">
              <span className="badge bg-light text-primary border">
                {jobType}
              </span>
            </div>
          )}

          {/* Title */}
          <h6 className="fw-bold text-center mb-2">
            {title}
          </h6>

          {/* Company Name */}
          <p className="text-center text-muted mb-2">
            <strong>{companyName}</strong>
          </p>

          {/* Location */}
          <p className="text-center text-muted mb-2">
            <FaMapMarkerAlt className="me-1 text-danger" />
            {location}
          </p>

          {/* Salary */}
          <p className="text-center text-success fw-bold mb-3">
            <FaMoneyBill className="me-1" />
            {salary || "Salary not specified"}
          </p>

          {/* Buttons */}
          <div className="mt-auto">
            <Link
              to={`/jobs/${_id}`}
              className="btn btn-primary w-100 mb-2"
            >
              View Job
            </Link>

            <button
              className={`btn w-100 ${saved ? "btn-warning" : "btn-outline-success"}`}
              onClick={handleSave}
            >
              {saved ? <><FaStar className="me-1" />Saved</> : "Save Job"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobCard;