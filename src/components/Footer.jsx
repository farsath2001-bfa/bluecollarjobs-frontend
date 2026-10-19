import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaRegCommentDots, FaWhatsapp } from "react-icons/fa";
import logo from "../assets/Images/logo-small.png";
import { useT } from "../context/LanguageContext";
import { SITE_WHATSAPP, waLink } from "../utils/whatsapp";

function Footer() {
  const t = useT();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link to="/" className="brand mb-3" lang="en">
              <img src={logo} alt="" />
              Jobz Dxb
            </Link>
            <p className="mt-3 mb-0" style={{ maxWidth: "34ch" }}>{t("footer.tagline")}</p>
          </div>

          <div className="col-6 col-lg-2">
            <h4>{t("footer.seekers")}</h4>
            <ul>
              <li><Link to="/jobs">{t("nav.jobs")}</Link></li>
              <li><Link to="/companies">{t("nav.companies")}</Link></li>
              <li><Link to="/register">{t("nav.register")}</Link></li>
              <li><Link to="/saved">{t("nav.saved")}</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h4>{t("footer.popular")}</h4>
            <ul>
              <li><Link to="/jobs?category=Driver">{t("footer.driverJobs")}</Link></li>
              <li><Link to="/jobs?category=Security">{t("footer.securityJobs")}</Link></li>
              <li><Link to="/jobs?category=Cleaning">{t("footer.cleaningJobs")}</Link></li>
              <li><Link to="/jobs?location=Dubai">{t("footer.dubaiJobs")}</Link></li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h4>{t("footer.touch")}</h4>
            <ul className="footer-contact">
              <li><FaEnvelope aria-hidden="true" /><a href="mailto:support@jobzdxb.com" className="ltr">support@jobzdxb.com</a></li>
              {SITE_WHATSAPP && (
                <li><FaWhatsapp aria-hidden="true" /><a href={waLink(SITE_WHATSAPP)} target="_blank" rel="noreferrer">{t("footer.whatsapp")}</a></li>
              )}
              <li><FaRegCommentDots aria-hidden="true" /><Link to="/contact">{t("footer.sendMessage")}</Link></li>
              <li><FaMapMarkerAlt aria-hidden="true" />{t("contact.officeVal")}</li>
            </ul>
            <p className="small mt-3 mb-0">{t("footer.hiring")} <Link to="/contact" className="text-white fw-semibold">{t("footer.postWithUs")}</Link></p>
          </div>
        </div>

        <div className="base">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span>{t("footer.scam")}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
