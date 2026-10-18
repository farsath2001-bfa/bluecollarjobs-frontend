import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { CompanyLogo, ConfirmDialog, EmptyState, PageHead, StatusBadge, JobRowSkeleton } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getMyApplications, withdrawApplication, errorMessage } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { formatSalary, formatDate } from "../../utils/format";

const STATUS_HELP = {
  pending: "Sent. The employer hasn't opened it yet.",
  reviewed: "The employer has looked at your application.",
  shortlisted: "You're on the shortlist. Expect a call soon.",
  accepted: "Congratulations — the employer wants to hire you.",
  rejected: "The employer chose other candidates this time.",
};

function AppliedJobs() {
  useTitle("My applications");
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApps(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async () => {
    try {
      setBusy(true);
      await withdrawApplication(confirm._id);
      setApps((a) => a.filter((x) => x._id !== confirm._id));
      toast("Application withdrawn");
      setConfirm(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const counts = apps.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {});
  const shown = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <>
      <PageHead title="My applications" crumb={<Link to="/dashboard">Dashboard</Link>}>
        Every job you've applied for and where it stands.
      </PageHead>

      <div className="container section-tight">
        {!loading && apps.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {["all", "pending", "reviewed", "shortlisted", "accepted", "rejected"].map((s) =>
              s === "all" || counts[s] ? (
                <button key={s} type="button" className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-light-line"}`} onClick={() => setFilter(s)}>
                  {s === "all" ? `All (${apps.length})` : `${s[0].toUpperCase() + s.slice(1)} (${counts[s]})`}
                </button>
              ) : null
            )}
          </div>
        )}

        {loading ? (
          <JobRowSkeleton count={3} />
        ) : error ? (
          <EmptyState title="Applications couldn't load">{error}</EmptyState>
        ) : apps.length === 0 ? (
          <EmptyState icon={<FaFileAlt />} title="You haven't applied for any jobs yet" action={<Link to="/jobs" className="btn btn-primary">Find jobs</Link>}>
            When you apply, you'll see each application and its status here.
          </EmptyState>
        ) : (
          <div className="job-list">
            {shown.map((a) => {
              const job = a.job;
              return (
                <article className="panel panel-tight" key={a._id}>
                  <div className="d-flex gap-3 align-items-start flex-wrap">
                    <CompanyLogo logo={job?.logo} name={job?.companyName} size="sm" />
                    <div className="flex-grow-1 min-w-0">
                      {job ? (
                        <Link to={`/jobs/${job._id}`} className="fw-bold fs-6 text-reset">{job.title}</Link>
                      ) : (
                        <span className="fw-bold">Job removed</span>
                      )}
                      <div className="text-steel small">
                        {job?.companyName} · {job?.location} · Applied {formatDate(a.createdAt)}
                      </div>
                      <div className="small mt-2">{STATUS_HELP[a.status]}</div>
                    </div>
                    <div className="text-end d-flex flex-column align-items-end gap-2">
                      <StatusBadge status={a.status} />
                      {formatSalary(job?.salary) && <span className="salary" style={{ fontSize: "1rem" }}>{formatSalary(job.salary)}</span>}
                      {a.status === "pending" && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(a)}>Withdraw</button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          title="Withdraw application?"
          message={`Your application for ${confirm.job?.title || "this job"} will be removed. You can apply again later if the job is still open.`}
          confirmLabel="Withdraw"
          busy={busy}
          onConfirm={withdraw}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

export default AppliedJobs;
