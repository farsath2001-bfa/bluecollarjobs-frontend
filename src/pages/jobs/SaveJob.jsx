import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import JobCard from "../../components/JobCard";
import { EmptyState, JobRowSkeleton, PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getSavedJobs, errorMessage } from "../../service/api";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { useT } from "../../context/LanguageContext";

function SavedJobs() {
  const t = useT();
  useTitle(t("saved.title"));
  const { savedIds } = useSavedJobs();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSavedJobs()
      .then(({ data }) => setItems(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Hide a job straight away when it's un-saved from its card
  const visible = items.filter((s) => savedIds.has(s.job._id));

  return (
    <>
      <PageHead title={t("saved.title")} crumb={<Link to="/dashboard">{t("nav.dashboard")}</Link>}>
        {t("saved.sub")}
      </PageHead>
      <div className="container section-tight">
        {loading ? (
          <JobRowSkeleton count={3} />
        ) : error ? (
          <EmptyState title={t("saved.failed")}>{error}</EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState icon={<FaRegBookmark />} title={t("saved.none")} action={<Link to="/jobs" className="btn btn-primary">{t("common.findJobs")}</Link>}>
            {t("saved.noneSub")}
          </EmptyState>
        ) : (
          <div className="job-list">
            {visible.map((s) => (
              <div key={s._id}>
                {(s.job.isOpen === false || !s.job.isActive) && <div className="small text-steel mb-1">{t("saved.closedNow")}</div>}
                <JobCard {...s.job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SavedJobs;
