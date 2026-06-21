// import React from "react";
// function Apply(){
//     return(
//         <>
//         </>
//     );
// }
// export default Apply;


// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { applyToJob } from "../../service/api";

// function Apply() {

//   const { id } = useParams();

//   const [name,setName] = useState("");
//   const [email,setEmail] = useState("");
//   const [phone,setPhone] = useState("");
//   const [password,setPassword] = useState("");
//   const [file,setFile]=useState("null");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const application = {
//       jobId: id,
//       name,
//       email,
//       phone,
//       password,
//       filename:file? file.name :""
//     };

//     console.log("Application submitted:", application);
//       let applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
//       applied.push(id);
//       localStorage.setItem("appliedJobs", JSON.stringify(applied));
//     alert("Application Submitted successfully!");
//   };
  
    
//   return (
//     <div className="container mt-5">

//       <h2>Apply for Job {id}</h2>

//       <form onSubmit={handleSubmit} className="card p-4 mt-4">

//         <div className="mb-3">
//           <label>Name</label>
//           <input
//             className="form-control"
//             value={name}
//             onChange={(e)=>setName(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={email}
//             onChange={(e)=>setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label>Phone</label>
//           <input
//             className="form-control"
//             value={phone}
//             onChange={(e)=>setPhone(e.target.value)}
//             required
//           />
//         </div>

//          <div className="mb-3">
//           <label>Password</label>
//           <input
//             className="form-control"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//             required
//           />
//         </div>
    
//       <div className="mb-3">
//       <label htmlFor="formFileSm" className="form-label">
//       File
//       </label>

//       <input
//        className="form-control form-control-sm"
//        id="formFileSm"
//        type="file"
//        onChange={(e) => setFile(e.target.files[0])}
//        required
//        />
//       </div>

//         <button className="btn btn-success w-100">
//           Submit Application
//         </button>

//       </form>

//     </div>
//   );
// }

// export default Apply;  


import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { applyToJob, getJobById } from "../../service/api";

function Apply() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // ✅ Block if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

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

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");

      // ✅ Calls real backend POST /api/jobs/:id/apply
      const { data } = await applyToJob(id);

      setMessage(data.message || "Applied successfully!");

      // ✅ Also keep local copy for quick dashboard counts
      let applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
      if (!applied.includes(id)) {
        applied.push(id);
        localStorage.setItem("appliedJobs", JSON.stringify(applied));
      }

      setTimeout(() => navigate("/applied"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply. Try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (error && !job) return (
    <div className="container mt-5 text-center">
      <h3>{error}</h3>
      <Link to="/jobs" className="btn btn-primary mt-3">Back to Jobs</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">

            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>

              <h4 className="fw-bold text-center mb-1">Apply for this Job</h4>
              <p className="text-center text-muted mb-4">{job?.title} at {job?.companyName}</p>

              {message && (
                <div className="alert alert-success text-center">
                  ✅ {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

              {!message && (
                <>
                  {/* Job Summary */}
                  <div className="bg-light rounded p-3 mb-4">
                    <p className="mb-1"><strong>📍 Location:</strong> {job?.location}</p>
                    <p className="mb-1"><strong>💰 Salary:</strong> {job?.salary || "Not specified"}</p>
                    <p className="mb-0"><strong>💼 Type:</strong> {job?.jobType}</p>
                  </div>

                  {/* Applicant info (read from logged in user) */}
                  <div className="mb-4">
                    <p className="mb-1"><strong>Applying as:</strong></p>
                    <p className="text-muted mb-0">{user?.name} — {user?.email}</p>
                  </div>

                  <button
                    className="btn btn-success w-100 fw-bold py-2"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? "Submitting..." : "Confirm & Apply"}
                  </button>
                </>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Apply;