import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaGlobe, FaMapMarkerAlt, FaIndustry } from "react-icons/fa";
import { CompanyLogo, EmptyState, Spinner } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import JobCard from "../../components/JobCard";
import { getCompanyById, errorMessage } from "../../service/api";

function CompanyDetails() {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, company: null, error: "" });
  const loading = result.id !== id;
  const { company, error } = loading ? { company: null, error: "" } : result;

  useTitle(company?.name || "Company");

  useEffect(() => {
    getCompanyById(id)
      .then(({ data }) => setResult({ id, company: data, error: "" }))
      .catch((err) => setResult({ id, company: null, error: errorMessage(err, "Company not found") }));
  }, [id]);

  if (loading) return <Spinner label="Loading company…" />;

  if (error || !company) {
    return (
      <div className="container section">
        <EmptyState title="Company not found" action={<Link to="/companies" className="btn btn-primary">All companies</Link>}>{error}</EmptyState>
      </div>
    );
  }

  const website = company.website && (company.website.startsWith("http") ? company.website : `https://${company.website}`);

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Link to="/companies" className="crumb d-inline-flex align-items-center gap-2 mb-3"><FaArrowLeft /> All companies</Link>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <CompanyLogo logo={company.logo} name={company.name} size="lg" />
            <div>
              <h1 className="mb-1">
                {company.name} {company.isVerified && <FaCheckCircle style={{ color: "#9db4ff", fontSize: "0.5em", verticalAlign: "middle" }} title="Verified employer" aria-label="Verified employer" />}
              </h1>
              <div className="d-flex flex-wrap gap-3" style={{ color: "#b9c3e3" }}>
                {company.industry && <span><FaIndustry aria-hidden="true" /> {company.industry}</span>}
                {company.location && <span><FaMapMarkerAlt aria-hidden="true" /> {company.location}</span>}
                {website && <a href={website} target="_blank" rel="noreferrer" className="text-white"><FaGlobe aria-hidden="true" /> Website</a>}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container section-tight">
        <div className="row g-4">
          <div className="col-lg-8">
            <h2 className="h3 mb-3">{company.openJobs ? `${company.openJobs} open ${company.openJobs === 1 ? "job" : "jobs"}` : "Open jobs"}</h2>
            {company.jobs?.length ? (
              <div className="job-list">{company.jobs.map((j) => <JobCard key={j._id} {...j} />)}</div>
            ) : (
              <EmptyState title="No open jobs right now" action={<Link to="/jobs" className="btn btn-primary">See other jobs</Link>}>
                Check back soon, or save similar jobs from other employers.
              </EmptyState>
            )}
          </div>
          <aside className="col-lg-4">
            <div className="panel">
              <h2 className="h4">About {company.name}</h2>
              <p className="text-steel mb-0">{company.description || "This employer hasn't added a description yet."}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default CompanyDetails;
