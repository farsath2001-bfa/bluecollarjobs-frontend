import React from "react";
import { Link } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useT } from "../context/LanguageContext";

function NotFound() {
  const t = useT();
  useTitle(t("nf.title"));
  return (
    <div className="container notfound">
      <div className="big">404</div>
      <h1 className="h2 mt-3">{t("nf.title")}</h1>
      <p className="text-steel mx-auto" style={{ maxWidth: "42ch" }}>{t("nf.text")}</p>
      <div className="d-flex gap-2 justify-content-center mt-4">
        <Link to="/jobs" className="btn btn-primary">{t("common.findJobs")}</Link>
        <Link to="/" className="btn btn-light-line">{t("nf.home")}</Link>
      </div>
    </div>
  );
}

export default NotFound;
