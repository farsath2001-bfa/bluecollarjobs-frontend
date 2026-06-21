
// import React from "react";

// function About() {
//   return (
//     <div className="container py-5">
//       <h1>About Jobz Dxb</h1>

//       <p>
//         Jobz Dxb connects blue-collar workers with trusted employers
//         across Dubai and the UAE.
//       </p>

//       <h3>Our Mission</h3>
//       <p>
//         To make job searching simple, fast, and accessible for workers
//         and companies.
//       </p>

//       <h3>Why Choose Us?</h3>
//       <ul>
//         <li>Verified Job Listings</li>
//         <li>Trusted Employers</li>
//         <li>Easy Applications</li>
//         <li>Fast Hiring Process</li>
//       </ul>
//     </div>
//   );
// }

// export default About;  

import React from "react";

function About() {
  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>

      {/* Hero Banner */}
      <div style={{ backgroundColor: "#5a7296", padding: "60px 0" }}
        className="text-white text-center mb-5">
        <h1 className="fw-bold">About Jobz Dxb</h1>
        <p className="lead">Connecting talent with opportunity across the UAE</p>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-9">

            {/* Intro */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
              <p className="text-muted" style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
                Jobz Dxb connects blue-collar workers with trusted employers
                across Dubai and the UAE. We believe everyone deserves access
                to fair, reliable job opportunities — no matter their background.
              </p>
            </div>

            {/* Mission */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
              <h3 className="fw-bold mb-3">🎯 Our Mission</h3>
              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                To make job searching simple, fast, and accessible for
                workers and companies — bridging the gap between skilled
                workers and the businesses that need them most.
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
              <h3 className="fw-bold mb-4">⭐ Why Choose Us?</h3>
              <div className="row g-3">

                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <span className="fs-4 me-3">✅</span>
                    <div>
                      <strong>Verified Job Listings</strong>
                      <p className="text-muted small mb-0">Every job is checked before posting</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <span className="fs-4 me-3">🤝</span>
                    <div>
                      <strong>Trusted Employers</strong>
                      <p className="text-muted small mb-0">Companies we know and vet</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <span className="fs-4 me-3">⚡</span>
                    <div>
                      <strong>Easy Applications</strong>
                      <p className="text-muted small mb-0">Apply in just a few clicks</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <span className="fs-4 me-3">🚀</span>
                    <div>
                      <strong>Fast Hiring Process</strong>
                      <p className="text-muted small mb-0">Get hired quickly</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default About;