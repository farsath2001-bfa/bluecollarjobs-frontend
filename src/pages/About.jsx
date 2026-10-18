import React from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaPhoneAlt, FaShieldAlt, FaHandHoldingUsd } from "react-icons/fa";
import { PageHead } from "../components/ui";
import { useTitle } from "../utils/useTitle";
import delivery from "../assets/Images/hero-delivery.jpg";

const promises = [
  { icon: FaMoneyBillWave, title: "Salary on every job", text: "We ask every employer for the monthly pay and what's included — accommodation, transport, visa — before a job goes live." },
  { icon: FaHandHoldingUsd, title: "Free for workers", text: "You never pay to apply or to get hired. Anyone asking for money for a job or visa is not working with us." },
  { icon: FaPhoneAlt, title: "Employers call you", text: "Your application goes out with your phone number, so the next step is a real conversation." },
  { icon: FaShieldAlt, title: "Checked employers", text: "Companies marked as verified have been confirmed by our team. Report anything that looks wrong and we'll look into it." },
];

function About() {
  useTitle("About us");
  return (
    <>
      <PageHead title="About Jobz Dxb">A job board built for the people who build, drive, clean and guard the UAE.</PageHead>

      <section className="section-tight">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <h2 className="mb-3">Why we started</h2>
              <p className="lead text-body mb-3">
                Finding a blue-collar job in the UAE usually means WhatsApp forwards, agents and listings with no salary. We wanted one place where the pay is shown upfront and applying takes a minute.
              </p>
              <p className="text-steel measure mb-0">
                Jobz Dxb lists openings for drivers, electricians, plumbers, AC technicians, cleaners, security guards, delivery riders, warehouse staff and construction workers across all seven emirates. Employers post jobs, you apply with your phone number, and you can follow every application from your dashboard.
              </p>
            </div>
            <div className="col-lg-5">
              <img src={delivery} alt="A delivery rider in Dubai" className="w-100" style={{ borderRadius: "var(--radius)", maxHeight: 380, objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="mb-4">What we promise</h2>
          <div className="row g-3">
            {promises.map(({ icon, title, text }) => (
              <div className="col-md-6" key={title}>
                <div className="panel h-100 d-flex gap-3">
                  <span className="cat-tile p-0 border-0" style={{ background: "none" }}><span className="ico">{React.createElement(icon)}</span></span>
                  <div>
                    <h3 className="h4 mb-1">{title}</h3>
                    <p className="text-steel mb-0">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="employer-band mt-5">
            <div>
              <h2>Ready to look?</h2>
              <p>New jobs are added every week across Dubai, Abu Dhabi, Sharjah and the northern emirates.</p>
            </div>
            <Link to="/jobs" className="btn btn-lg" style={{ background: "#fff", color: "var(--navy)" }}>Find jobs</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
