import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaCheckCircle, FaShareAlt, FaUsers, FaCheck, FaWhatsapp, FaRegClock,
} from "react-icons/fa";
import { CompanyLogo, EmptyState, Spinner } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import JobCard from "../../components/JobCard";
import { getJobById, getMyApplications, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { useToast } from "../../context/ToastContext";
import { useT } from "../../context/LanguageContext";
import {
  formatSalary, timeAgo, formatDate, resolveLogo, closingInfo, tCategory, tJobType, tLocation, tBenefit,
} from "../../utils/format";
import { SITE_WHATSAPP, toWhatsAppNumber, waLink } from "../../utils/whatsapp";

const EMPLOYMENT_TYPES = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Contract: "CONTRACTOR", Temporary: "TEMPORARY" };

// Google for Jobs structured data (https://developers.google.com/search/docs/appearance/structured-data/job-posting)
function jobPostingJsonLd(job, company) {
  const amount = Number(String(job.salary || "").replace(/,/g, "").match(/\d{3,}/)?.[0]);
  const logo = resolveLogo(company?.logo || job.logo);
  const [locality, ...rest] = String(job.location || "Dubai").split(",").map((s) => s.trim());
  const data = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, job.requirements?.length ? `Requirements: ${job.requirements.join("; ")}` : "", job.benefits?.length ? `Benefits: ${job.benefits.join(", ")}` : ""]
      .filter(Boolean)
      .join("\n\n"),
    datePosted: job.createdAt,
    employmentType: EMPLOYMENT_TYPES[job.jobType] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      ...(company?.website ? { sameAs: company.website } : {}),
      ...(logo ? { logo: new URL(logo, window.location.origin).href } : {}),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressRegion: rest.pop() || locality,
        addressCountry: "AE",
      },
    },
    directApply: true,
    identifier: { "@type": "PropertyValue", name: "Jobz Dxb", value: job._id },
    industry: job.category,
    totalJobOpenings: job.vacancies || 1,
  };
  if (job.expiresAt) data.validThrough = job.expiresAt;
  if (amount) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "AED",
      value: { "@type": "QuantitativeValue", value: amount, unitText: "MONTH" },
    };
  }
  return data;
}

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const { user, isAdmin, isEmployer } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const toast = useToast();
  // Result is stored with the id it belongs to, so changing jobs shows the loader again
  const [result, setResult] = useState({ id: null, job: null, error: "" });
  const loading = result.id !== id;
  const { job, error } = loading ? { job: null, error: "" } : result;
  const [application, setApplication] = useState(null);
  const company = job && typeof job.company === "object" ? job.company : null;

  useTitle(job ? `${job.title} — ${job.companyName}` : undefined, {
    description: job
      ? `${job.title} at ${job.companyName}, ${job.location}. ${formatSalary(job.salary) || ""} ${String(job.description || "").slice(0, 140)}`.replace(/\s+/g, " ").trim()
      : undefined,
    jsonLd: job && job.isOpen !== false ? jobPostingJsonLd(job, company) : undefined,
  });

  useEffect(() => {
    getJobById(id)
      .then(({ data }) => setResult({ id, job: data, error: "" }))
      .catch((err) => setResult({ id, job: null, error: errorMessage(err, t("detail.notFoundSub")) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Has this candidate already applied?
  useEffect(() => {
    if (!user || isAdmin || isEmployer) return;
    getMyApplications()
      .then(({ data }) => setApplication(data.find((a) => (a.job?._id || a.job) === id) || null))
      .catch(() => {});
  }, [id, user, isAdmin, isEmployer]);

  if (loading) return <Spinner />;

  if (error || !job) {
    return (
      <div className="container section">
        <EmptyState title={t("detail.notFound")} action={<Link to="/jobs" className="btn btn-primary">{t("detail.browseOpen")}</Link>}>
          {error || t("detail.notFoundSub")}
        </EmptyState>
      </div>
    );
  }

  const url = window.location.origin + window.location.pathname;
  const pay = formatSalary(job.salary);
  const saved = isSaved(job._id);
  const isOpen = job.isOpen ?? job.isActive;
  const closing = closingInfo(job.expiresAt);
  const vars = { title: job.title, company: job.companyName, location: job.location, url };

  // WhatsApp: the job's own number, then the company's, then the site's number
  const waNumber = toWhatsAppNumber(job.contactPhone) || toWhatsAppNumber(company?.phone) || SITE_WHATSAPP;
  const waApply = waNumber ? waLink(waNumber, t("detail.whatsappApplyMsg", vars)) : null;
  const waShare = waLink("", t("detail.whatsappShareMsg", vars));

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: job.title, text: `${job.title} — ${job.companyName}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast(t("common.linkCopied"));
      }
    } catch {
      /* share sheet closed */
    }
  };

  const ownJob = isEmployer && String(user.company) === String(company?._id || job.company);
  const applyArea = isAdmin ? (
    <Link to="/admin/jobs" className="btn btn-primary btn-lg w-100">{t("detail.editAdmin")}</Link>
  ) : isEmployer ? (
    ownJob ? (
      <div className="d-grid gap-2">
        <Link to="/employer/jobs" className="btn btn-primary btn-lg">{t("nav.myJobs")}</Link>
        <Link to={`/employer/applicants?job=${job._id}`} className="btn btn-light-line">{t("nav.applicants")}</Link>
      </div>
    ) : (
      <p className="small text-steel mb-0">{t("emp.cantApply")}</p>
    )
  ) : application ? (
    <div className="text-center">
      <div className="chip chip-pay mb-2"><FaCheckCircle /> {t("detail.applied", { when: timeAgo(application.createdAt) })}</div>
      <Link to="/applied" className="btn btn-light-line w-100">{t("detail.track")}</Link>
    </div>
  ) : !isOpen ? (
    <div className="closed-banner text-center">{t("common.closed")}</div>
  ) : (
    <div className="d-grid gap-2">
      <Link to={user ? `/apply/${job._id}` : "/login"} state={user ? undefined : { from: `/apply/${job._id}` }} className="btn btn-primary btn-lg">
        {t("detail.applyNow")}
      </Link>
      {waApply && (
        <a href={waApply} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-lg">
          <FaWhatsapp aria-hidden="true" /> {t("detail.applyWhatsApp")}
        </a>
      )}
    </div>
  );

  return (
    <div className="container section-tight">
      <button type="button" className="btn btn-ghost mb-3 ps-0" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/jobs"))}>
        <FaArrowLeft className="flip-rtl" /> {t("detail.back")}
      </button>

      {!isOpen && !isAdmin && !isEmployer && <div className="closed-banner mb-3">{t("common.closed")}</div>}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="panel mb-4">
            <div className="detail-head mb-4">
              <CompanyLogo logo={job.logo} name={job.companyName} size="lg" />
              <div className="min-w-0">
                <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.7rem)" }} className="mb-2">{job.title}</h1>
                <div className="text-steel">
                  {company ? <Link to={`/company/${company._id}`} className="fw-semibold">{job.companyName}</Link> : <span className="fw-semibold">{job.companyName}</span>}
                  {` ${t("detail.in")} `}
                  <FaMapMarkerAlt aria-hidden="true" className="ms-1" /> {tLocation(job.location)}
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="chip chip-blue">{tCategory(job.category)}</span>
                  <span className="chip">{tJobType(job.jobType)}</span>
                  <span className="chip">{t("detail.posted", { when: timeAgo(job.createdAt) })}</span>
                  {closing && !closing.closed && (
                    <span className={closing.soon ? "closing-chip" : "chip"}><FaRegClock aria-hidden="true" /> {closing.text}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="detail-facts mb-4">
              <div><small>{t("detail.salary")}</small><strong className={pay ? "text-success ltr" : ""}>{pay || t("common.discussed")}</strong></div>
              <div><small>{t("detail.jobType")}</small><strong>{tJobType(job.jobType)}</strong></div>
              <div><small>{t("detail.location")}</small><strong>{tLocation(job.location)}</strong></div>
              <div><small>{t("detail.openings")}</small><strong>{job.vacancies || 1}</strong></div>
            </div>

            <h2 className="h4 mb-2">{t("detail.about")}</h2>
            <p className="prose measure" dir="auto">{job.description}</p>

            {job.requirements?.length > 0 && (
              <>
                <h2 className="h4 mt-4 mb-2">{t("detail.need")}</h2>
                <ul className="tick-list" dir="auto">{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              </>
            )}

            {job.benefits?.length > 0 && (
              <>
                <h2 className="h4 mt-4 mb-2">{t("detail.provides")}</h2>
                <div className="d-flex flex-wrap gap-2">
                  {job.benefits.map((b) => <span key={b} className="chip chip-pay"><FaCheck aria-hidden="true" /> {tBenefit(b)}</span>)}
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
                  <small className="text-steel">{[company.industry, tLocation(company.location)].filter(Boolean).join(", ")}</small>
                </div>
              </div>
              {company.description && <p className="text-steel mb-2 measure" dir="auto">{company.description}</p>}
              <Link to={`/company/${company._id}`} className="fw-semibold">{t("detail.seeAllAt", { company: company.name })}</Link>
            </div>
          )}
        </div>

        <aside className="col-lg-4">
          <div className="panel apply-card">
            <small className="text-steel">{t("detail.monthlySalary")}</small>
            {pay ? <span className="salary mb-3 ltr">{pay}</span> : <p className="fw-semibold">{t("common.discussed")}</p>}
            {applyArea}
            <div className="d-flex gap-2 mt-2">
              {!isAdmin && !isEmployer && (
                <button type="button" className="btn btn-light-line flex-fill" onClick={() => toggleSave(job._id)} aria-pressed={saved}>
                  {saved ? <><FaBookmark className="text-danger" /> {t("common.saved")}</> : <><FaRegBookmark /> {t("common.save")}</>}
                </button>
              )}
              <button type="button" className="btn btn-light-line flex-fill" onClick={share}><FaShareAlt /> {t("common.share")}</button>
            </div>
            <a href={waShare} target="_blank" rel="noreferrer" className="btn btn-whatsapp-outline w-100 mt-2">
              <FaWhatsapp aria-hidden="true" /> {t("detail.shareWhatsApp")}
            </a>
            <hr />
            <ul className="list-unstyled small text-steel mb-0">
              {job.applicantsCount > 0 && (
                <li className="mb-1">
                  <FaUsers className="me-2" />
                  {job.applicantsCount === 1 ? t("detail.onePerson") : t("detail.people", { n: job.applicantsCount })}
                </li>
              )}
              <li>{t("detail.postedOn", { date: formatDate(job.createdAt) })}</li>
              {closing && <li className="mt-1">{closing.text}</li>}
            </ul>
            <p className="small text-steel mt-3 mb-0">
              {t("detail.scam")} <Link to="/contact?subject=Report%20a%20listing">{t("detail.report")}</Link>
            </p>
          </div>
        </aside>
      </div>

      {job.similar?.length > 0 && (
        <section className="mt-5">
          <h2 className="h3 mb-3">{t("detail.moreJobs", { category: tCategory(job.category) })}</h2>
          <div className="job-list">{job.similar.map((s) => <JobCard key={s._id} {...s} />)}</div>
        </section>
      )}
    </div>
  );
}

export default JobDetails;
