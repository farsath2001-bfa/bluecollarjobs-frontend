import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import JobCard from "../../components/JobCard";
import { JobRowSkeleton, EmptyState, Pagination, PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getJobs, getJobMeta, normalizeJobList, errorMessage } from "../../service/api";
import { EMIRATES, JOB_TYPES } from "../../utils/format";

const FILTER_KEYS = ["keyword", "category", "location", "jobType", "minSalary", "sort", "page"];

function Job() {
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

  useTitle(filters.category ? `${filters.category} jobs` : "Find jobs");

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
    filters.category && { key: "category", label: filters.category },
    filters.location && { key: "location", label: filters.location },
    filters.jobType && { key: "jobType", label: filters.jobType },
    filters.minSalary && { key: "minSalary", label: `AED ${Number(filters.minSalary).toLocaleString()}+` },
  ].filter(Boolean);

  const locationOptions = meta?.locations?.length ? meta.locations.map((l) => l.name) : EMIRATES;

  return (
    <>
      <PageHead title={filters.category ? `${filters.category} jobs in the UAE` : "Find a job"}>
        {meta ? `${meta.total} open jobs from ${meta.companies} employers.` : "Search open jobs across the UAE."}
      </PageHead>

      <div className="container section-tight">
        <form onSubmit={submitKeyword} className="d-flex gap-2 mb-4" role="search">
          <div className="input-icon flex-grow-1">
            <FaSearch aria-hidden="true" />
            <input
              className="form-control form-control-lg"
              placeholder="Search by job title, trade or company"
              aria-label="Search jobs"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit">Search</button>
        </form>

        <div className="row g-4">
          {/* ---------- Filters ---------- */}
          <aside className={`col-lg-3 ${showFilters ? "" : "d-none d-lg-block"}`}>
            <div className="panel filter-pane">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0">Filters</h3>
                {active.length > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>Clear all</button>}
              </div>

              <div className="filter-group">
                <span className="label">Trade</span>
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
                        {c.name}
                      </span>
                      <small>{c.count}</small>
                    </label>
                  ))}
                  {filters.category && (
                    <button type="button" className="btn btn-ghost btn-sm px-0 mt-1" onClick={() => update({ category: "" })}>Any trade</button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="f-location">Emirate</label>
                <select id="f-location" className="form-select" value={filters.location} onChange={(e) => update({ location: e.target.value })}>
                  <option value="">All emirates</option>
                  {locationOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <span className="label">Job type</span>
                {JOB_TYPES.map((t) => (
                  <label className="check-row" key={t}>
                    <span>
                      <input type="radio" name="jobType" checked={filters.jobType === t} onChange={() => update({ jobType: t })} />
                      {t}
                    </span>
                  </label>
                ))}
                {filters.jobType && (
                  <button type="button" className="btn btn-ghost btn-sm px-0 mt-1" onClick={() => update({ jobType: "" })}>Any type</button>
                )}
              </div>

              <div className="filter-group">
                <label htmlFor="f-salary">Minimum salary</label>
                <select id="f-salary" className="form-select" value={filters.minSalary} onChange={(e) => update({ minSalary: e.target.value })}>
                  <option value="">Any salary</option>
                  {[1500, 2000, 2500, 3000, 4000, 5000].map((s) => (
                    <option key={s} value={s}>AED {s.toLocaleString()} or more</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* ---------- Results ---------- */}
          <section className="col-lg-9" aria-live="polite">
            <div className="results-bar">
              <div>
                <strong>{loading ? "Searching…" : `${result.total} ${result.total === 1 ? "job" : "jobs"}`}</strong>
                {active.length > 0 && (
                  <div className="active-filters mt-2">
                    {active.map((f) => (
                      <button key={f.key} type="button" className="chip chip-blue" onClick={() => update({ [f.key]: "" })} aria-label={`Remove filter ${f.label}`}>
                        {f.label} <FaTimes aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button type="button" className="btn btn-light-line d-lg-none" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
                  <FaSlidersH /> {showFilters ? "Hide filters" : "Filters"}
                </button>
                <label htmlFor="sort" className="small-label d-none d-sm-inline">Sort</label>
                <select id="sort" className="form-select" style={{ width: "auto" }} value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                  <option value="">Newest first</option>
                  <option value="salary">Highest salary</option>
                </select>
              </div>
            </div>

            {loading ? (
              <JobRowSkeleton count={5} />
            ) : error ? (
              <EmptyState title="Jobs couldn't load" action={<button className="btn btn-primary" onClick={() => setRetry((r) => r + 1)}>Try again</button>}>
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
                title="No jobs match these filters"
                action={<button className="btn btn-primary" onClick={clearAll}>Clear filters</button>}
              >
                Try a different trade or emirate, or remove the salary filter.
              </EmptyState>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Job;
