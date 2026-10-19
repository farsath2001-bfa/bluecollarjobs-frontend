import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import JobCard from "../../components/JobCard";
import { JobRowSkeleton, EmptyState, Pagination, PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getJobs, getJobMeta, normalizeJobList, errorMessage } from "../../service/api";
import { EMIRATES, JOB_TYPES, tCategory, tEmirate, tJobType, tLocation } from "../../utils/format";
import { useT } from "../../context/LanguageContext";

const FILTER_KEYS = ["keyword", "category", "location", "jobType", "minSalary", "sort", "page"];

function Job() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState({ jobs: [], total: 0, page: 1, pages: 1 });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keywordInput, setKeywordInput] = useState(params.get("keyword") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [retry, setRetry] = useState(0);

  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ""]));
  const page = Number(filters.page) || 1;
  const queryKey = params.toString();

  useTitle(filters.category ? t("jobs.titleCategory", { category: tCategory(filters.category) }) : t("jobs.title"), { description: t("seo.jobsDesc") });

  useEffect(() => {
    getJobMeta().then(({ data }) => setMeta(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setKeywordInput(params.get("keyword") || "");
    setLoading(true);
    setError("");
    const query = Object.fromEntries([...new URLSearchParams(queryKey)].filter(([, v]) => v));
    getJobs({ limit: 10, ...query })
      .then(({ data }) => setResult(normalizeJobList(data)))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, retry]);

  // Update one or more filters in the URL (resets to page 1 unless page is being set)
  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  const clearAll = () => {
    setKeywordInput("");
    setParams({});
  };

  const submitKeyword = (e) => {
    e.preventDefault();
    update({ keyword: keywordInput.trim() });
  };

  const goToPage = (p) => {
    update({ page: p > 1 ? String(p) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const active = [
    filters.keyword && { key: "keyword", label: `"${filters.keyword}"` },
    filters.category && { key: "category", label: tCategory(filters.category) },
    filters.location && { key: "location", label: tLocation(filters.location) },
    filters.jobType && { key: "jobType", label: tJobType(filters.jobType) },
    filters.minSalary && { key: "minSalary", label: `AED ${Number(filters.minSalary).toLocaleString()}+` },
  ].filter(Boolean);

  const locationOptions = meta?.locations?.length ? meta.locations.map((l) => l.name) : EMIRATES;

  return (
    <>
      <PageHead title={filters.category ? t("jobs.titleCategory", { category: tCategory(filters.category) }) : t("jobs.title")}>
        {meta ? t("jobs.sub", { total: meta.total, companies: meta.companies }) : t("jobs.subDefault")}
      </PageHead>

      <div className="container section-tight">
        <form onSubmit={submitKeyword} className="d-flex gap-2 mb-4" role="search">
          <div className="input-icon flex-grow-1">
            <FaSearch aria-hidden="true" />
            <input
              className="form-control form-control-lg"
              placeholder={t("jobs.searchPlaceholder")}
              aria-label={t("jobs.searchPlaceholder")}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit">{t("common.search")}</button>
        </form>

        <div className="row g-4">
          {/* ---------- Filters ---------- */}
          <aside className={`col-lg-3 ${showFilters ? "" : "d-none d-lg-block"}`}>
            <div className="panel filter-pane">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0">{t("jobs.filters")}</h3>
                {active.length > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>{t("jobs.clearAll")}</button>}
              </div>

              <div className="filter-group">
                <span className="label">{t("jobs.trade")}</span>
                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                  {(meta?.categories || []).map((c) => (
                    <label className="check-row" key={c.name}>
                      <span>
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category.toLowerCase() === c.name.toLowerCase()}
                          onChange={() => update({ category: c.name })}
                        />
                        {tCategory(c.name)}
                      </span>
                      <small>{c.count}</small>
                    </label>
                  ))}
                  {filters.category && (
                    <button type="button" className="btn btn-ghost btn-sm px-0 mt-1" onClick={() => update({ category: "" })}>{t("jobs.anyTrade")}</button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="f-location">{t("jobs.emirate")}</label>
                <select id="f-location" className="form-select" value={filters.location} onChange={(e) => update({ location: e.target.value })}>
                  <option value="">{t("common.allEmirates")}</option>
                  {locationOptions.map((l) => <option key={l} value={l}>{tEmirate(l)}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <span className="label">{t("jobs.jobType")}</span>
                {JOB_TYPES.map((jt) => (
                  <label className="check-row" key={jt}>
                    <span>
                      <input type="radio" name="jobType" checked={filters.jobType === jt} onChange={() => update({ jobType: jt })} />
                      {tJobType(jt)}
                    </span>
                  </label>
                ))}
                {filters.jobType && (
                  <button type="button" className="btn btn-ghost btn-sm px-0 mt-1" onClick={() => update({ jobType: "" })}>{t("jobs.anyType")}</button>
                )}
              </div>

              <div className="filter-group">
                <label htmlFor="f-salary">{t("jobs.minSalary")}</label>
                <select id="f-salary" className="form-select" value={filters.minSalary} onChange={(e) => update({ minSalary: e.target.value })}>
                  <option value="">{t("jobs.anySalary")}</option>
                  {[1500, 2000, 2500, 3000, 4000, 5000].map((s) => (
                    <option key={s} value={s}>{t("jobs.salaryOrMore", { n: s.toLocaleString("en-US") })}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* ---------- Results ---------- */}
          <section className="col-lg-9" aria-live="polite">
            <div className="results-bar">
              <div>
                <strong>{loading ? t("jobs.searching") : t(result.total === 1 ? "common.job" : "common.jobs", { n: result.total })}</strong>
                {active.length > 0 && (
                  <div className="active-filters mt-2">
                    {active.map((f) => (
                      <button key={f.key} type="button" className="chip chip-blue" onClick={() => update({ [f.key]: "" })} aria-label={t("jobs.removeFilter", { label: f.label })}>
                        {f.label} <FaTimes aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button type="button" className="btn btn-light-line d-lg-none" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
                  <FaSlidersH /> {showFilters ? t("jobs.hideFilters") : t("jobs.filters")}
                </button>
                <label htmlFor="sort" className="small-label d-none d-sm-inline">{t("jobs.sort")}</label>
                <select id="sort" className="form-select" style={{ width: "auto" }} value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                  <option value="">{t("jobs.newest")}</option>
                  <option value="salary">{t("jobs.highestSalary")}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <JobRowSkeleton count={5} />
            ) : error ? (
              <EmptyState title={t("jobs.failed")} action={<button className="btn btn-primary" onClick={() => setRetry((r) => r + 1)}>{t("common.tryAgain")}</button>}>
                {error}
              </EmptyState>
            ) : result.jobs.length ? (
              <>
                <div className="job-list">
                  {result.jobs.map((job) => <JobCard key={job._id} {...job} />)}
                </div>
                <Pagination page={page} pages={result.pages} onChange={goToPage} />
              </>
            ) : (
              <EmptyState
                icon={<FaSearch />}
                title={t("jobs.noMatch")}
                action={<button className="btn btn-primary" onClick={clearAll}>{t("jobs.clearFilters")}</button>}
              >
                {t("jobs.noMatchSub")}
              </EmptyState>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Job;
