import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import JobCategory from "../components/JobCategory";
import JobCard from "../components/JobCard";
import { JobRowSkeleton, EmptyState } from "../components/ui";
import { useTitle } from "../utils/useTitle";
import { getJobs, getJobMeta, normalizeJobList } from "../service/api";
import { EMIRATES } from "../utils/format";
import construction from "../assets/Images/hero-construction.jpg";
import delivery from "../assets/Images/hero-delivery.jpg";
import warehouse from "../assets/Images/hero-warehouse.jpg";

function Home() {
  useTitle();
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
              <h1>Find work in the UAE this week</h1>
              <p className="lead">
                Driver, technician, cleaner, security and delivery jobs from employers in Dubai and across the Emirates. Salary shown on every job.
              </p>

              <form className="hero-search" onSubmit={handleSearch} role="search">
                <div className="input-icon">
                  <FaSearch aria-hidden="true" />
                  <input
                    className="form-control"
                    placeholder="Job title, e.g. Driver"
                    aria-label="Job title or keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="input-icon">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <select className="form-select" aria-label="Emirate" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">All emirates</option>
                    {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">Search</button>
              </form>

              <div className="hero-quick">
                Popular:
                {["Driver", "Security", "Cleaning", "Delivery"].map((c) => (
                  <Link key={c} to={`/jobs?category=${c}`}>{c}</Link>
                ))}
              </div>

              {meta && (
                <div className="hero-stats">
                  <div><strong>{meta.total}</strong><span>open jobs</span></div>
                  <div><strong>{meta.companies}</strong><span>employers</span></div>
                  <div><strong>{meta.locations?.length || 0}</strong><span>emirates hiring</span></div>
                </div>
              )}
            </div>

            <div className="col-lg-6">
              <div className="hero-photos">
                <figure><img src={construction} alt="Construction workers on a Dubai site at sunset" /><figcaption>Construction</figcaption></figure>
                <figure><img src={delivery} alt="Delivery rider on a motorbike in Dubai" /><figcaption>Delivery</figcaption></figure>
                <figure><img src={warehouse} alt="Warehouse staff and forklift operator" /><figcaption>Warehouse</figcaption></figure>
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
                <h2>Browse by trade</h2>
                <p>Pick your line of work to see every opening.</p>
              </div>
              <Link to="/jobs" className="btn btn-light-line">All jobs</Link>
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
              <h2>Latest jobs</h2>
              <p>Newest openings first. Save the ones you like and apply when you're ready.</p>
            </div>
            <Link to="/jobs" className="btn btn-primary">See all jobs</Link>
          </div>

          {loading ? (
            <JobRowSkeleton count={4} />
          ) : failed ? (
            <EmptyState title="Jobs couldn't load" action={<button className="btn btn-primary" onClick={() => window.location.reload()}>Reload page</button>}>
              The server may be waking up after a quiet period. This usually takes under a minute.
            </EmptyState>
          ) : jobs.length ? (
            <div className="job-list">
              {jobs.map((job) => <JobCard key={job._id} {...job} />)}
            </div>
          ) : (
            <EmptyState title="No jobs posted yet">New openings appear here as soon as employers post them.</EmptyState>
          )}
        </div>
      </section>

      {/* ---------- How it works (a real sequence, so it's numbered) ---------- */}
      <section className="section pt-0">
        <div className="container">
          <h2 className="mb-4">Get hired in three steps</h2>
          <div className="steps">
            <div>
              <span className="n">1</span>
              <h3>Create a free account</h3>
              <p>Just your name, email and phone number. No fees, ever.</p>
            </div>
            <div>
              <span className="n">2</span>
              <h3>Apply in one minute</h3>
              <p>Pick a job, tell the employer when you can start, and send your application.</p>
            </div>
            <div>
              <span className="n">3</span>
              <h3>Track your status</h3>
              <p>See when your application is reviewed, shortlisted or accepted on your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Employers ---------- */}
      <section className="pb-2">
        <div className="container">
          <div className="employer-band">
            <div>
              <h2>Hiring workers?</h2>
              <p>Tell us about the role and we'll post it for you and send you applicants with phone numbers ready to call.</p>
            </div>
            <Link to="/contact?subject=Post%20a%20job" className="btn btn-lg" style={{ background: "#fff", color: "var(--navy)" }}>
              Post a job
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
