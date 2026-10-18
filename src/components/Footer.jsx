import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaRegCommentDots } from "react-icons/fa";
import logo from "../assets/Images/logo-small.png";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link to="/" className="brand mb-3">
              <img src={logo} alt="" />
              Jobz Dxb
            </Link>
            <p className="mt-3 mb-0" style={{ maxWidth: "34ch" }}>
              Jobs for drivers, technicians, cleaners, guards and riders across Dubai and the UAE — with the salary shown upfront.
            </p>
          </div>

          <div className="col-6 col-lg-2">
            <h4>Job seekers</h4>
            <ul>
              <li><Link to="/jobs">Find jobs</Link></li>
              <li><Link to="/companies">Companies</Link></li>
              <li><Link to="/register">Create account</Link></li>
              <li><Link to="/saved">Saved jobs</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h4>Popular</h4>
            <ul>
              <li><Link to="/jobs?category=Driver">Driver jobs</Link></li>
              <li><Link to="/jobs?category=Security">Security jobs</Link></li>
              <li><Link to="/jobs?category=Cleaning">Cleaning jobs</Link></li>
              <li><Link to="/jobs?location=Dubai">Jobs in Dubai</Link></li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h4>Get in touch</h4>
            <ul className="footer-contact">
              <li><FaEnvelope aria-hidden="true" /><a href="mailto:support@jobzdxb.com">support@jobzdxb.com</a></li>
              <li><FaRegCommentDots aria-hidden="true" /><Link to="/contact">Send us a message</Link></li>
              <li><FaMapMarkerAlt aria-hidden="true" />Dubai, United Arab Emirates</li>
            </ul>
            <p className="small mt-3 mb-0">Hiring? <Link to="/contact" className="text-white fw-semibold">Post a job with us</Link></p>
          </div>
        </div>

        <div className="base">
          <span>© {new Date().getFullYear()} Jobz Dxb. All rights reserved.</span>
          <span>Never pay anyone to get a job. Report suspicious listings to us.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
