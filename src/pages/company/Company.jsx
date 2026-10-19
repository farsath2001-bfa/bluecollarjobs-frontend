import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaCheckCircle, FaBuilding } from "react-icons/fa";
import { CompanyLogo, EmptyState, PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getCompanies, errorMessage } from "../../service/api";
import { useT } from "../../context/LanguageContext";
import { tLocation } from "../../utils/format";

function Companies() {
  const t = useT();
  useTitle(t("co.title"));
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hiringOnly, setHiringOnly] = useState(false);

  useEffect(() => {
    getCompanies()
      .then(({ data }) => setCompanies(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies
      .filter((c) => !hiringOnly || c.openJobs > 0)
      .filter((c) => !q || [c.name, c.location, c.industry].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => (b.openJobs || 0) - (a.openJobs || 0));
  }, [companies, search, hiringOnly]);

  return (
    <>
      <PageHead title={t("co.title")}>{t("co.sub")}</PageHead>

      <div className="container section-tight">
        <div className="toolbar">
          <div className="input-icon grow">
            <FaSearch aria-hidden="true" />
            <input className="form-control" placeholder={t("co.searchPh")} aria-label={t("co.searchPh")} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <label className="d-flex align-items-center gap-2 ms-1" style={{ cursor: "pointer" }}>
            <input type="checkbox" className="form-check-input m-0" checked={hiringOnly} onChange={(e) => setHiringOnly(e.target.checked)} />
            {t("co.hiringNow")}
          </label>
        </div>

        {loading ? (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-md-6 col-lg-4" key={i}><div className="skel" style={{ height: 180 }} /></div>
            ))}
          </div>
        ) : error ? (
          <EmptyState title={t("co.failed")}>{error}</EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FaBuilding />} title={t("co.noMatch")} action={<button className="btn btn-primary" onClick={() => { setSearch(""); setHiringOnly(false); }}>{t("co.showAll")}</button>}>
            {t("co.noMatchSub")}
          </EmptyState>
        ) : (
          <div className="row g-3">
            {filtered.map((c) => (
              <div className="col-md-6 col-lg-4" key={c._id}>
                <Link to={`/company/${c._id}`} className="company-card">
                  <div className="d-flex gap-3 align-items-center">
                    <CompanyLogo logo={c.logo} name={c.name} />
                    <div className="min-w-0">
                      <h3>
                        {c.name} {c.isVerified && <FaCheckCircle className="verified" title={t("co.verified")} aria-label={t("co.verified")} />}
                      </h3>
                      <small className="text-steel">{c.industry}</small>
                    </div>
                  </div>
                  {c.description && <p dir="auto" className="text-steel small mb-0" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.description}</p>}
                  <div className="foot">
                    <span className="text-steel"><FaMapMarkerAlt aria-hidden="true" /> {tLocation(c.location) || "UAE"}</span>
                    <strong className={c.openJobs ? "text-success" : "text-steel"}>
                      {c.openJobs ? (c.openJobs === 1 ? t("co.openJob") : t("co.openJobs", { n: c.openJobs })) : t("co.noOpenings")}
                    </strong>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Companies;
