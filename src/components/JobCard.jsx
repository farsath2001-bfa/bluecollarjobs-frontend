import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaRegClock, FaBookmark, FaRegBookmark, FaBed } from "react-icons/fa";
import { CompanyLogo } from "./ui";
import { formatSalary, timeAgo, isNew, tJobType, tLocation, closingInfo } from "../utils/format";
import { useT } from "../context/LanguageContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useAuth } from "../context/AuthContext";

// One job in a list. Salary sits on the right, biggest thing on the row.
function JobCard({ _id, title, companyName, location, salary, logo, jobType, createdAt, expiresAt, benefits = [] }) {
  const t = useT();
  const { isSaved, toggleSave } = useSavedJobs();
  const { isAdmin } = useAuth();
  const saved = isSaved(_id);
  const pay = formatSalary(salary);
  const housing = benefits.some((b) => /accommodation/i.test(b));
  const closing = closingInfo(expiresAt);

  return (
    <article className="job-row">
      <CompanyLogo logo={logo} name={companyName} />
      <div className="min-w-0">
        <Link to={`/jobs/${_id}`} className="title">
          {title}
          {isNew(createdAt) && <span className="new-flag">{t("common.new")}</span>}
        </Link>
        <div className="company">{companyName}</div>
        <div className="job-meta">
          <span><FaMapMarkerAlt aria-hidden="true" />{tLocation(location)}</span>
          {jobType && <span><FaBriefcase aria-hidden="true" />{tJobType(jobType)}</span>}
          {housing && <span><FaBed aria-hidden="true" />{t("common.accommodation")}</span>}
          {closing?.soon ? (
            <span className="closing-chip"><FaRegClock aria-hidden="true" />{closing.text}</span>
          ) : (
            createdAt && <span><FaRegClock aria-hidden="true" />{timeAgo(createdAt)}</span>
          )}
        </div>
      </div>
      <div className="job-side">
        {pay ? <span className="salary ltr">{pay}</span> : <span className="salary-none">{t("common.salaryOnRequest")}</span>}
        {!isAdmin && (
          <button
            type="button"
            className={`save-btn ${saved ? "on" : ""}`}
            onClick={() => toggleSave(_id)}
            aria-pressed={saved}
            aria-label={saved ? t("common.unsaveTitle", { title }) : t("common.saveTitle", { title })}
            title={saved ? t("common.saved") : t("common.saveJob")}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}
      </div>
    </article>
  );
}

export default JobCard;
