import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import JobCard from "../../components/JobCard";
import { EmptyState, JobRowSkeleton, PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getSavedJobs, errorMessage } from "../../service/api";
import { useSavedJobs } from "../../context/SavedJobsContext";

function SavedJobs() {
  useTitle("Saved jobs");
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
      <PageHead title="Saved jobs" crumb={<Link to="/dashboard">Dashboard</Link>}>
        Jobs you've bookmarked. Apply before they close.
      </PageHead>
      <div className="container section-tight">
        {loading ? (
          <JobRowSkeleton count={3} />
        ) : error ? (
          <EmptyState title="Saved jobs couldn't load">{error}</EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState icon={<FaRegBookmark />} title="No saved jobs" action={<Link to="/jobs" className="btn btn-primary">Find jobs</Link>}>
            Tap the bookmark on any job to keep it here for later.
          </EmptyState>
        ) : (
          <div className="job-list">
            {visible.map((s) => (
              <div key={s._id}>
                {!s.job.isActive && <div className="small text-steel mb-1">This job is now closed</div>}
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
