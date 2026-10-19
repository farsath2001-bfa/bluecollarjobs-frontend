import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { CompanyLogo, ConfirmDialog, EmptyState, PageHead, StatusBadge, JobRowSkeleton } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getMyApplications, withdrawApplication, errorMessage } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { formatSalary, formatDate, tLocation } from "../../utils/format";
import { useT } from "../../context/LanguageContext";

function AppliedJobs() {
  const t = useT();
  useTitle(t("applied.title"));
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
      toast(t("applied.withdrawn"));
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
      <PageHead title={t("applied.title")} crumb={<Link to="/dashboard">{t("nav.dashboard")}</Link>}>
        {t("applied.sub")}
      </PageHead>

      <div className="container section-tight">
        {!loading && apps.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {["all", "pending", "reviewed", "shortlisted", "accepted", "rejected"].map((s) =>
              s === "all" || counts[s] ? (
                <button key={s} type="button" className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-light-line"}`} onClick={() => setFilter(s)}>
                  {s === "all" ? t("applied.all", { n: apps.length }) : `${t(`status.${s}`)} (${counts[s]})`}
                </button>
              ) : null
            )}
          </div>
        )}

        {loading ? (
          <JobRowSkeleton count={3} />
        ) : error ? (
          <EmptyState title={t("applied.failed")}>{error}</EmptyState>
        ) : apps.length === 0 ? (
          <EmptyState icon={<FaFileAlt />} title={t("applied.none")} action={<Link to="/jobs" className="btn btn-primary">{t("common.findJobs")}</Link>}>
            {t("applied.noneSub")}
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
                        <span className="fw-bold">{t("dash.jobRemoved")}</span>
                      )}
                      <div className="text-steel small">
                        {[job?.companyName, tLocation(job?.location), t("applied.on", { date: formatDate(a.createdAt) })].filter(Boolean).join(" · ")}
                      </div>
                      <div className="small mt-2">{t(`statusHelp.${a.status}`)}</div>
                    </div>
                    <div className="text-end d-flex flex-column align-items-end gap-2">
                      <StatusBadge status={a.status} />
                      {formatSalary(job?.salary) && <span className="salary ltr" style={{ fontSize: "1rem" }}>{formatSalary(job.salary)}</span>}
                      {a.status === "pending" && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(a)}>{t("applied.withdraw")}</button>
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
          title={t("applied.withdrawTitle")}
          message={t("applied.withdrawText", { title: confirm.job?.title || "" })}
          confirmLabel={t("applied.withdraw")}
          busy={busy}
          onConfirm={withdraw}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

export default AppliedJobs;
