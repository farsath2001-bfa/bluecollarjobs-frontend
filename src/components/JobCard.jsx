import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaRegClock, FaBookmark, FaRegBookmark, FaBed } from "react-icons/fa";
import { CompanyLogo } from "./ui";
import { formatSalary, timeAgo, isNew } from "../utils/format";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useAuth } from "../context/AuthContext";

// One job in a list. Salary sits on the right, biggest thing on the row.
function JobCard({ _id, title, companyName, location, salary, logo, jobType, createdAt, benefits = [] }) {
  const { isSaved, toggleSave } = useSavedJobs();
  const { isAdmin } = useAuth();
  const saved = isSaved(_id);
  const pay = formatSalary(salary);
  const housing = benefits.some((b) => /accommodation/i.test(b));

  return (
    <article className="job-row">
      <CompanyLogo logo={logo} name={companyName} />
      <div className="min-w-0">
        <Link to={`/jobs/${_id}`} className="title">
          {title}
          {isNew(createdAt) && <span className="new-flag">New</span>}
        </Link>
        <div className="company">{companyName}</div>
        <div className="job-meta">
          <span><FaMapMarkerAlt aria-hidden="true" />{location}</span>
          {jobType && <span><FaBriefcase aria-hidden="true" />{jobType}</span>}
          {housing && <span><FaBed aria-hidden="true" />Accommodation</span>}
          {createdAt && <span><FaRegClock aria-hidden="true" />{timeAgo(createdAt)}</span>}
        </div>
      </div>
      <div className="job-side">
        {pay ? <span className="salary">{pay}</span> : <span className="salary-none">Salary on request</span>}
        {!isAdmin && (
          <button
            type="button"
            className={`save-btn ${saved ? "on" : ""}`}
            onClick={() => toggleSave(_id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${title} from saved jobs` : `Save ${title}`}
            title={saved ? "Saved" : "Save job"}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}
      </div>
    </article>
  );
}

export default JobCard;
