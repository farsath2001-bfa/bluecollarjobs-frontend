import React from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaPhoneAlt, FaShieldAlt, FaHandHoldingUsd } from "react-icons/fa";
import { PageHead } from "../components/ui";
import { useTitle } from "../utils/useTitle";
import { useT } from "../context/LanguageContext";
import delivery from "../assets/Images/hero-delivery.jpg";

const promises = [
  { icon: FaMoneyBillWave, key: "p1" },
  { icon: FaHandHoldingUsd, key: "p2" },
  { icon: FaPhoneAlt, key: "p3" },
  { icon: FaShieldAlt, key: "p4" },
];

function About() {
  const t = useT();
  useTitle(t("nav.about"));
  return (
    <>
      <PageHead title={t("about.title")}>{t("about.sub")}</PageHead>

      <section className="section-tight">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <h2 className="mb-3">{t("about.whyTitle")}</h2>
              <p className="lead text-body mb-3">{t("about.whyLead")}</p>
              <p className="text-steel measure mb-0">{t("about.whyText")}</p>
            </div>
            <div className="col-lg-5">
              <img src={delivery} alt="A delivery rider in Dubai" className="w-100" style={{ borderRadius: "var(--radius)", maxHeight: 380, objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="mb-4">{t("about.promiseTitle")}</h2>
          <div className="row g-3">
            {promises.map(({ icon, key }) => (
              <div className="col-md-6" key={key}>
                <div className="panel h-100 d-flex gap-3">
                  <span className="cat-tile p-0 border-0" style={{ background: "none" }}><span className="ico">{React.createElement(icon)}</span></span>
                  <div>
                    <h3 className="h4 mb-1">{t(`about.${key}Title`)}</h3>
                    <p className="text-steel mb-0">{t(`about.${key}Text`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="employer-band mt-5">
            <div>
              <h2>{t("about.readyTitle")}</h2>
              <p>{t("about.readyText")}</p>
            </div>
            <Link to="/jobs" className="btn btn-lg" style={{ background: "#fff", color: "var(--navy)" }}>{t("common.findJobs")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
