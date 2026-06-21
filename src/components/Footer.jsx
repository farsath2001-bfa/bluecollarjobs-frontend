// import React from "react";
// function Footer(){
//     return(
//         <div className="bg-dark text-white text-center p-3 mt-5">
//             ©2026 BlueCollar Jobs | Dubai

//         </div>
//     );
// }
// export default Footer;  

import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Images/Jobz-image.png";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">

        <div className="row g-4">

          {/* Brand */}
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="Jobz Dxb" width={36} height={36} className="me-2" />
              <h5 className="fw-bold mb-0">Jobz Dxb</h5>
            </div>
            <p className="text-secondary small">
              Connecting blue-collar workers with trusted employers
              across Dubai and the UAE.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/jobs" className="text-secondary text-decoration-none">Jobs</Link>
              </li>
              <li className="mb-2">
                <Link to="/companies" className="text-secondary text-decoration-none">Companies</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-secondary text-decoration-none">About</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-secondary text-decoration-none">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-secondary text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-secondary text-decoration-none">Register</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Get in Touch</h6>
            <p className="text-secondary small mb-2">📧 support@jobzdxb.com</p>
            <p className="text-secondary small mb-2">📞 +971 XX XXX XXXX</p>
            <p className="text-secondary small mb-0">📍 Dubai, UAE</p>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-secondary small">
          © 2026 Jobz Dxb | BlueCollar Jobs in Dubai. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;