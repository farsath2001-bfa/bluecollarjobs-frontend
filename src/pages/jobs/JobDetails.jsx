// import React from "react";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { getJobById } from "../../service/api";

// function JobDetails(){

//     const {id}= useParams();
//     const jobs= [
//         {
//             id :1,
//              title:"Driver",
//           company:"Emirates Transport",
//           location:"Dubai",
//           salary:"AED 2500",
//           description: "Delivery food to customers across Dubai."
//         },
//         {
//             id:2,
//              title:"Electrician",
//           company:"Al Noor Technical Services",
//           location:"Sharjah",
//           salary:"AED 3000",
//           description:"Construction and maintenance jobs."
//         },
//         {
//             id:4,
//             title:"Plumber",
//             company:"Lazord Plumbing Agencies",
//             salary:"2000",
//             location:"Sharjah",
//             description:"Residential and commercial plumbing."
//         },
//         {
//             id:3,
//             title:"cleaner",
//             company:"AlMas Cleaning Services",
//             location:"Ajman",
//             salary:"1600",
//             description:"Office, home, and building cleaning."
//         },
//         {
//             id:5,
//             title:"Delivery Rider",
//             company:"Talabat",
//             location:"Dubai",
//             salary:"2500+ Commisssion",
//             description:"Food and parcel delivery jobs."
//         },
//          {
//             id:6,
//             title:"IT Technical support",
//             company:"Google",
//             location:"Dubai",
//             salary:"4500",
//             description:"We Create IT Future."
//         },
//         {
//             id:7,
//             title:"Driver",
//             company:"EAS",
//             location:"Dubai",
//             salary:"3500",
//             description:"Delivery Documents to customers across Dubai."  
//         },
//          {
//             id:8,
//             title:"Recepitionist",
//             company:"ABC Cargo",
//             location:"Umm al Quain",
//             salary:"2400 + Accomodation",
//             description:"We Create IT Future and Keep Learning."
//         }


//     ];

//    const job = jobs.find((j) =>j.id === parseInt(id));
//     // const job=jobs.find((j)=>j.id=== parseInt(id));

//     if (!job) {
//     return (
//       <div className="container mt-5">
//         <h3>Job not found</h3>
//       </div>
//     );
//   }

//     return(
//         <div className="container text-center  ">
//             <h2>{job.title}</h2>
//             <p><strong>Company:</strong> {job.company}</p>
//             <p><strong>Location:</strong>{job.location}</p>
//             <p><strong>Salary:</strong>{job.salary}</p>
//             <p className="mt-3">{job.description} </p>

//             {/* <button className="btn btn-success mt-3">Apply Now</button> */}
//             <Link to={`/apply/${job.id}`} className="btn btn-success mt-3">
//             Apply Now
//             </Link>
            

//         </div>
//     );
// }
// export default JobDetails;


import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../../service/api";
import { FaMapMarkerAlt, FaMoneyBill, FaBriefcase, FaArrowLeft } from "react-icons/fa";

import abcLogo      from "../../assets/CompanyLogos/abc.png";
import alnoorLogo   from "../../assets/CompanyLogos/alnoor.png";
import brightLogo   from "../../assets/CompanyLogos/bright.png";
import dewaLogo     from "../../assets/CompanyLogos/dewa.png";
import easLogo      from "../../assets/CompanyLogos/eas.png";
import emiratesLogo from "../../assets/CompanyLogos/emirates.png";
import lazordLogo   from "../../assets/CompanyLogos/lazord.png";
import talabatLogo  from "../../assets/CompanyLogos/talabat.png";

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

function JobDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError("Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2">Loading job details...</p>
    </div>
  );

  if (error || !job) return (
    <div className="container mt-5 text-center">
      <h3>Job not found</h3>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/jobs")}>
        Back to Jobs
      </button>
    </div>
  );

  const resolvedLogo = logoMap[job.logo] || emiratesLogo;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">

          {/* Back Button */}
          <button
            className="btn btn-outline-secondary mb-4"
            onClick={() => navigate("/jobs")}
          >
            <FaArrowLeft className="me-2" />
            Back to Jobs
          </button>

          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>

            {/* Company Logo + Name */}
            <div className="text-center mb-4">
              <img
                src={resolvedLogo}
                alt={job.companyName}
                style={{ width: "100px", height: "100px", objectFit: "contain" }}
              />
              <h5 className="mt-2 text-muted">{job.companyName}</h5>
            </div>

            {/* Job Title */}
            <h2 className="fw-bold text-center mb-4">{job.title}</h2>

            {/* Job Info Badges */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <span className="badge bg-light text-dark border px-3 py-2">
                <FaMapMarkerAlt className="me-1 text-danger" />
                {job.location}
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                <FaMoneyBill className="me-1 text-success" />
                {job.salary || "Salary not specified"}
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                <FaBriefcase className="me-1 text-primary" />
                {job.jobType}
              </span>
              <span className="badge bg-primary text-white px-3 py-2">
                {job.category}
              </span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-bold mb-2">Job Description</h5>
              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                {job.description}
              </p>
            </div>

            {/* Apply Button */}
            <Link
              to={`/apply/${job._id}`}
              className="btn btn-success btn-lg w-100 fw-bold"
            >
              Apply Now
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;