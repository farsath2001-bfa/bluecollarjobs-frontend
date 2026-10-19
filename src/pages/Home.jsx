import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import JobCategory from "../components/JobCategory";
import JobCard from "../components/JobCard";
import { JobRowSkeleton, EmptyState } from "../components/ui";
import { useTitle } from "../utils/useTitle";
import { getJobs, getJobMeta, normalizeJobList } from "../service/api";
import { EMIRATES, tEmirate, tCategory } from "../utils/format";
import { useT } from "../context/LanguageContext";
import construction from "../assets/Images/hero-construction.jpg";
import delivery from "../assets/Images/hero-delivery.jpg";
import warehouse from "../assets/Images/hero-warehouse.jpg";

function Home() {
  useTitle();
  const t = useT();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [meta, setMeta] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([getJobs({ limit: 6 }), getJobMeta().catch(() => ({ data: null }))])
      .then(([jobsRes, metaRes]) => {
        setJobs(normalizeJobList(jobsRes.data).jobs);
        setMeta(metaRes.data);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location) params.set("location", location);
    navigate(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  const categories = meta?.categories?.slice(0, 8) || [];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-stretch g-4">
            <div className="col-lg-6 d-flex flex-column justify-content-center">
              <h1>{t("home.title")}</h1>
              <p className="lead">{t("home.lead")}</p>

              <form className="hero-search" onSubmit={handleSearch} role="search">
                <div className="input-icon">
                  <FaSearch aria-hidden="true" />
                  <input
                    className="form-control"
                    placeholder={t("home.jobPlaceholder")}
                    aria-label={t("home.jobPlaceholder")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="input-icon">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <select className="form-select" aria-label={t("jobs.emirate")} value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">{t("common.allEmirates")}</option>
                    {EMIRATES.map((e) => <option key={e} value={e}>{tEmirate(e)}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">{t("common.search")}</button>
              </form>

              <div className="hero-quick">
                {t("home.popular")}
                {["Driver", "Security", "Cleaning", "Delivery"].map((c) => (
                  <Link key={c} to={`/jobs?category=${c}`}>{tCategory(c)}</Link>
                ))}
              </div>

              {meta && (
                <div className="hero-stats">
                  <div><strong>{meta.total}</strong><span>{t("home.statJobs")}</span></div>
                  <div><strong>{meta.companies}</strong><span>{t("home.statEmployers")}</span></div>
                  <div><strong>{meta.locations?.length || 0}</strong><span>{t("home.statEmirates")}</span></div>
                </div>
              )}
            </div>

            <div className="col-lg-6">
              <div className="hero-photos">
                <figure><img src={construction} alt="Construction workers on a Dubai site at sunset" /><figcaption>{t("home.capConstruction")}</figcaption></figure>
                <figure><img src={delivery} alt="Delivery rider on a motorbike in Dubai" /><figcaption>{t("home.capDelivery")}</figcaption></figure>
                <figure><img src={warehouse} alt="Warehouse staff and forklift operator" /><figcaption>{t("home.capWarehouse")}</figcaption></figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      {categories.length > 0 && (
        <section className="section pb-0">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{t("home.browseTitle")}</h2>
                <p>{t("home.browseSub")}</p>
              </div>
              <Link to="/jobs" className="btn btn-light-line">{t("common.allJobs")}</Link>
            </div>
            <div className="cat-grid">
              {categories.map((c) => <JobCategory key={c.name} title={c.name} jobs={c.count} />)}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Latest jobs ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t("home.latestTitle")}</h2>
              <p>{t("home.latestSub")}</p>
            </div>
            <Link to="/jobs" className="btn btn-primary">{t("common.seeAllJobs")}</Link>
          </div>

          {loading ? (
            <JobRowSkeleton count={4} />
          ) : failed ? (
            <EmptyState title={t("home.failed")} action={<button className="btn btn-primary" onClick={() => window.location.reload()}>{t("common.reload")}</button>}>
              {t("common.serverWaking")}
            </EmptyState>
          ) : jobs.length ? (
            <div className="job-list">
              {jobs.map((job) => <JobCard key={job._id} {...job} />)}
            </div>
          ) : (
            <EmptyState title={t("home.noJobs")}>{t("home.noJobsSub")}</EmptyState>
          )}
        </div>
      </section>

      {/* ---------- How it works (a real sequence, so it's numbered) ---------- */}
      <section className="section pt-0">
        <div className="container">
          <h2 className="mb-4">{t("home.stepsTitle")}</h2>
          <div className="steps">
            <div>
              <span className="n">1</span>
              <h3>{t("home.step1Title")}</h3>
              <p>{t("home.step1Text")}</p>
            </div>
            <div>
              <span className="n">2</span>
              <h3>{t("home.step2Title")}</h3>
              <p>{t("home.step2Text")}</p>
            </div>
            <div>
              <span className="n">3</span>
              <h3>{t("home.step3Title")}</h3>
              <p>{t("home.step3Text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Employers ---------- */}
      <section className="pb-2">
        <div className="container">
          <div className="employer-band">
            <div>
              <h2>{t("home.hiringTitle")}</h2>
              <p>{t("home.hiringText")}</p>
            </div>
            <Link to="/employers" className="btn btn-lg" style={{ background: "#fff", color: "var(--navy)" }}>
              {t("home.postJob")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
