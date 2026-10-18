import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaCheckCircle, FaShareAlt, FaUsers, FaCheck } from "react-icons/fa";
import { CompanyLogo, EmptyState, Spinner } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import JobCard from "../../components/JobCard";
import { getJobById, getMyApplications, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { useToast } from "../../context/ToastContext";
import { formatSalary, timeAgo, formatDate } from "../../utils/format";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const toast = useToast();
  // Result is stored with the id it belongs to, so changing jobs shows the loader again
  const [result, setResult] = useState({ id: null, job: null, error: "" });
  const loading = result.id !== id;
  const { job, error } = loading ? { job: null, error: "" } : result;
  const [application, setApplication] = useState(null);

  useTitle(job ? `${job.title} at ${job.companyName}` : "Job");

  useEffect(() => {
    getJobById(id)
      .then(({ data }) => setResult({ id, job: data, error: "" }))
      .catch((err) => setResult({ id, job: null, error: errorMessage(err, "This job is no longer available") }));
  }, [id]);

  // Has this candidate already applied?
  useEffect(() => {
    if (!user || isAdmin) return;
    getMyApplications()
      .then(({ data }) => setApplication(data.find((a) => (a.job?._id || a.job) === id) || null))
      .catch(() => {});
  }, [id, user, isAdmin]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: job.title, text: `${job.title} at ${job.companyName}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Link copied");
      }
    } catch {
      /* share sheet closed */
    }
  };

  if (loading) return <Spinner label="Loading job…" />;

  if (error || !job) {
    return (
      <div className="container section">
        <EmptyState title="Job not found" action={<Link to="/jobs" className="btn btn-primary">Browse open jobs</Link>}>
          {error || "It may have been filled or removed."}
        </EmptyState>
      </div>
    );
  }

  const pay = formatSalary(job.salary);
  const saved = isSaved(job._id);
  const company = typeof job.company === "object" ? job.company : null;

  const applyArea = isAdmin ? (
    <Link to="/admin/jobs" className="btn btn-primary btn-lg w-100">Edit in admin</Link>
  ) : application ? (
    <div className="text-center">
      <div className="chip chip-pay mb-2"><FaCheckCircle /> Applied {timeAgo(application.createdAt).toLowerCase()}</div>
      <Link to="/applied" className="btn btn-light-line w-100">Track my application</Link>
    </div>
  ) : !job.isActive ? (
    <div className="chip">This job is closed</div>
  ) : (
    <Link to={user ? `/apply/${job._id}` : "/login"} state={user ? undefined : { from: `/apply/${job._id}` }} className="btn btn-primary btn-lg w-100">
      Apply now
    </Link>
  );

  return (
    <div className="container section-tight">
      <button type="button" className="btn btn-ghost mb-3 ps-0" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/jobs"))}>
        <FaArrowLeft /> Back to jobs
      </button>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="panel mb-4">
            <div className="detail-head mb-4">
              <CompanyLogo logo={job.logo} name={job.companyName} size="lg" />
              <div className="min-w-0">
                <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.7rem)" }} className="mb-2">{job.title}</h1>
                <div className="text-steel">
                  {company ? <Link to={`/company/${company._id}`} className="fw-semibold">{job.companyName}</Link> : <span className="fw-semibold">{job.companyName}</span>}
                  {" in "}
                  <FaMapMarkerAlt aria-hidden="true" className="ms-1" /> {job.location}
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="chip chip-blue">{job.category}</span>
                  <span className="chip">{job.jobType}</span>
                  <span className="chip">Posted {timeAgo(job.createdAt).toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="detail-facts mb-4">
              <div><small>Salary</small><strong className={pay ? "text-success" : ""}>{pay || "Discussed at interview"}</strong></div>
              <div><small>Job type</small><strong>{job.jobType}</strong></div>
              <div><small>Location</small><strong>{job.location}</strong></div>
              <div><small>Openings</small><strong>{job.vacancies || 1}</strong></div>
            </div>

            <h2 className="h4 mb-2">About the job</h2>
            <p className="prose measure">{job.description}</p>

            {job.requirements?.length > 0 && (
              <>
                <h2 className="h4 mt-4 mb-2">What you need</h2>
                <ul className="tick-list">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              </>
            )}

            {job.benefits?.length > 0 && (
              <>
                <h2 className="h4 mt-4 mb-2">What the employer provides</h2>
                <div className="d-flex flex-wrap gap-2">
                  {job.benefits.map((b) => <span key={b} className="chip chip-pay"><FaCheck aria-hidden="true" /> {b}</span>)}
                </div>
              </>
            )}
          </div>

          {company && (
            <div className="panel mb-4">
              <div className="d-flex gap-3 align-items-center mb-2">
                <CompanyLogo logo={company.logo} name={company.name} size="sm" />
                <div>
                  <h2 className="h4 mb-0">{company.name}</h2>
                  <small className="text-steel">{[company.industry, company.location].filter(Boolean).join(", ")}</small>
                </div>
              </div>
              {company.description && <p className="text-steel mb-2 measure">{company.description}</p>}
              <Link to={`/company/${company._id}`} className="fw-semibold">See all jobs at {company.name}</Link>
            </div>
          )}
        </div>

        <aside className="col-lg-4">
          <div className="panel apply-card">
            <small className="text-steel">Monthly salary</small>
            {pay ? <span className="salary mb-3">{pay}</span> : <p className="fw-semibold">Discussed at interview</p>}
            {applyArea}
            <div className="d-flex gap-2 mt-2">
              {!isAdmin && (
                <button type="button" className="btn btn-light-line flex-fill" onClick={() => toggleSave(job._id)} aria-pressed={saved}>
                  {saved ? <><FaBookmark className="text-danger" /> Saved</> : <><FaRegBookmark /> Save</>}
                </button>
              )}
              <button type="button" className="btn btn-light-line flex-fill" onClick={share}><FaShareAlt /> Share</button>
            </div>
            <hr />
            <ul className="list-unstyled small text-steel mb-0">
              {job.applicantsCount > 0 && <li className="mb-1"><FaUsers className="me-2" />{job.applicantsCount} {job.applicantsCount === 1 ? "person has" : "people have"} applied</li>}
              <li>Posted {formatDate(job.createdAt)}</li>
            </ul>
            <p className="small text-steel mt-3 mb-0">Real employers never ask you to pay for a job or visa. <Link to="/contact">Report this job</Link></p>
          </div>
        </aside>
      </div>

      {job.similar?.length > 0 && (
        <section className="mt-5">
          <h2 className="h3 mb-3">More {job.category} jobs</h2>
          <div className="job-list">{job.similar.map((s) => <JobCard key={s._id} {...s} />)}</div>
        </section>
      )}
    </div>
  );
}

export default JobDetails;
