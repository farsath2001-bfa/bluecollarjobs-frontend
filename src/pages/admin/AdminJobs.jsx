import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { CompanyLogo, ConfirmDialog, EmptyState, Modal } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import {
  adminGetJobs, adminCreateJob, adminUpdateJob, adminDeleteJob, getCompanies, errorMessage,
} from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { LogoUpload } from "../../components/Uploads";
import { BUNDLED_LOGOS, BENEFIT_OPTIONS, COMMON_CATEGORIES, EMIRATES, JOB_TYPES, formatSalary, formatDate } from "../../utils/format";

const EMPTY = {
  title: "", description: "", category: "", location: "Dubai", company: "", companyName: "", logo: "",
  salary: "", jobType: "Full-time", requirements: "", benefits: [], vacancies: 1, isActive: true,
  contactPhone: "", expiresAt: "",
};

// <input type="date"> works with YYYY-MM-DD in local time
const toDateInput = (d) => {
  if (!d) return "";
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
// A closing date means "open until the end of that day"
const fromDateInput = (s) => (s ? new Date(`${s}T23:59:59`).toISOString() : "");
const isExpired = (j) => j.expiresAt && new Date(j.expiresAt) <= new Date();

function JobForm({ initial, companies, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(initial._id);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const pickCompany = (e) => {
    const c = companies.find((x) => x._id === e.target.value);
    setForm({ ...form, company: e.target.value, companyName: c ? c.name : form.companyName, logo: c ? c.logo : form.logo });
  };

  const toggleBenefit = (b) =>
    setForm({ ...form, benefits: form.benefits.includes(b) ? form.benefits.filter((x) => x !== b) : [...form.benefits, b] });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.category || !form.location || !(form.company || form.companyName)) {
      setError("Title, company, trade, location and description are required");
      return;
    }
    const payload = { ...form, vacancies: Number(form.vacancies) || 1, expiresAt: fromDateInput(form.expiresAt) };
    try {
      setSaving(true);
      const { data } = editing ? await adminUpdateJob(initial._id, payload) : await adminCreateJob(payload);
      toast(editing ? "Job updated" : "Job posted");
      onSaved(data, editing);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? "Edit job" : "Post a job"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-light-line" onClick={onClose}>Cancel</button>
          <button type="submit" form="job-form" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Post job"}</button>
        </>
      }
    >
      <form id="job-form" onSubmit={submit} noValidate>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="j-title">Job title *</label>
            <input id="j-title" className="form-control" placeholder="e.g. Light Vehicle Driver" value={form.title} onChange={set("title")} />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="j-company">Company *</label>
            <select id="j-company" className="form-select" value={form.company} onChange={pickCompany}>
              <option value="">Not listed (type the name)</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            {!form.company ? (
              <>
                <label className="form-label" htmlFor="j-cname">Company name *</label>
                <input id="j-cname" className="form-control" value={form.companyName} onChange={set("companyName")} />
              </>
            ) : (
              <>
                <span className="form-label d-block">Logo</span>
                <div className="d-flex align-items-center gap-2"><CompanyLogo logo={form.logo} name={form.companyName} size="sm" /><small className="text-steel">From company profile</small></div>
              </>
            )}
          </div>
          {!form.company && (
            <div className="col-12">
              <label className="form-label" htmlFor="j-logo">Logo</label>
              <select id="j-logo" className="form-select" value={BUNDLED_LOGOS[form.logo] ? form.logo : form.logo ? "__url" : ""} onChange={(e) => setForm({ ...form, logo: e.target.value === "__url" ? "https://" : e.target.value })}>
                <option value="">No logo (show initials)</option>
                {Object.entries(BUNDLED_LOGOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                <option value="__url">Image URL…</option>
              </select>
              {form.logo && !BUNDLED_LOGOS[form.logo] && (
                <input className="form-control mt-2" placeholder="https://…/logo.png" value={form.logo} onChange={set("logo")} aria-label="Logo image URL" />
              )}
              <LogoUpload value={form.logo} onChange={(url) => setForm((f) => ({ ...f, logo: url }))} />
            </div>
          )}

          <div className="col-md-6">
            <label className="form-label" htmlFor="j-cat">Trade *</label>
            <input id="j-cat" className="form-control" list="cat-options" placeholder="e.g. Driver" value={form.category} onChange={set("category")} />
            <datalist id="cat-options">{COMMON_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="j-loc">Emirate *</label>
            <select id="j-loc" className="form-select" value={form.location} onChange={set("location")}>
              {[...new Set([...EMIRATES, form.location].filter(Boolean))].map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div className="col-md-5">
            <label className="form-label" htmlFor="j-salary">Salary</label>
            <input id="j-salary" className="form-control" placeholder="AED 2,500 / month" value={form.salary} onChange={set("salary")} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="j-type">Job type</label>
            <select id="j-type" className="form-select" value={form.jobType} onChange={set("jobType")}>
              {JOB_TYPES.map((jt) => <option key={jt}>{jt}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="j-vac">Openings</label>
            <input id="j-vac" type="number" min="1" className="form-control" value={form.vacancies} onChange={set("vacancies")} />
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="j-desc">Description *</label>
            <textarea id="j-desc" className="form-control" rows={4} placeholder="What the work involves, shift hours, days off" value={form.description} onChange={set("description")} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="j-req">Requirements</label>
            <textarea id="j-req" className="form-control" rows={3} placeholder={"One per line, e.g.\nValid UAE driving licence\n2 years experience"} value={form.requirements} onChange={set("requirements")} />
          </div>
          <div className="col-12">
            <span className="form-label d-block">Employer provides</span>
            <div className="d-flex flex-wrap gap-2">
              {BENEFIT_OPTIONS.map((b) => (
                <button key={b} type="button" className={`chip ${form.benefits.includes(b) ? "chip-pay" : ""}`} onClick={() => toggleBenefit(b)} aria-pressed={form.benefits.includes(b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="j-phone">WhatsApp / phone for this job</label>
            <input id="j-phone" type="tel" className="form-control" placeholder="050 123 4567" value={form.contactPhone} onChange={set("contactPhone")} />
            <div className="form-text">Shows an “Apply on WhatsApp” button. Leave empty to use the company's phone.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="j-exp">Closing date</label>
            <input id="j-exp" type="date" className="form-control" min={editing ? undefined : toDateInput(new Date())} value={form.expiresAt} onChange={set("expiresAt")} />
            <div className="form-text">The job hides itself after this day. Leave empty to keep it open.</div>
          </div>
          <div className="col-12">
            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
              <input type="checkbox" className="form-check-input m-0" checked={form.isActive} onChange={set("isActive")} />
              Open for applications (visible on the site)
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function AdminJobs() {
  useTitle("Manage jobs");
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(params.get("new") ? EMPTY : null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    Promise.all([adminGetJobs(), getCompanies()])
      .then(([j, c]) => {
        setJobs(j.data);
        setCompanies(c.data);
      })
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs
      .filter((j) => status === "all" || (status === "open" ? j.isActive && !isExpired(j) : !j.isActive || isExpired(j)))
      .filter((j) => !q || [j.title, j.companyName, j.category, j.location].some((v) => v?.toLowerCase().includes(q)));
  }, [jobs, search, status]);

  const openEdit = (job) =>
    setEditing({
      ...EMPTY,
      ...job,
      company: job.company?._id || job.company || "",
      requirements: (job.requirements || []).join("\n"),
      benefits: job.benefits || [],
      contactPhone: job.contactPhone || "",
      expiresAt: toDateInput(job.expiresAt),
    });

  const closeForm = () => {
    setEditing(null);
    if (params.get("new")) setParams({});
  };

  const onSaved = (job, wasEdit) => {
    setJobs((list) => (wasEdit ? list.map((j) => (j._id === job._id ? job : j)) : [job, ...list]));
    closeForm();
  };

  const toggleActive = async (job) => {
    try {
      const { data } = await adminUpdateJob(job._id, { isActive: !job.isActive });
      setJobs((list) => list.map((j) => (j._id === job._id ? data : j)));
      toast(data.isActive ? "Job reopened" : "Job closed");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  };

  const confirmDelete = async () => {
    try {
      setBusy(true);
      await adminDeleteJob(deleting._id);
      setJobs((list) => list.filter((j) => j._id !== deleting._id));
      toast("Job deleted");
      setDeleting(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Jobs" actions={<button className="btn btn-primary" onClick={() => setEditing(EMPTY)}><FaPlus /> Post a job</button>}>
      <div className="toolbar">
        <div className="input-icon grow">
          <FaSearch aria-hidden="true" />
          <input className="form-control" placeholder="Search title, company, trade or emirate" aria-label="Search jobs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All jobs ({jobs.length})</option>
          <option value="open">Open ({jobs.filter((j) => j.isActive && !isExpired(j)).length})</option>
          <option value="closed">Closed or expired ({jobs.filter((j) => !j.isActive || isExpired(j)).length})</option>
        </select>
      </div>

      {loading ? (
        <div className="skel" style={{ height: 320 }} />
      ) : shown.length === 0 ? (
        <EmptyState title={jobs.length ? "No jobs match" : "No jobs yet"} action={<button className="btn btn-primary" onClick={() => setEditing(EMPTY)}>Post a job</button>}>
          {jobs.length ? "Change the search or status filter." : "Post your first job and it will appear on the site straight away."}
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Job</th><th>Location</th><th>Salary</th><th>Applicants</th><th>Status</th><th>Posted</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {shown.map((j) => (
                <tr key={j._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <CompanyLogo logo={j.logo} name={j.companyName} size="sm" />
                      <div>
                        <div className="fw-semibold">{j.title}</div>
                        <small className="text-steel">{j.companyName}, {j.category}</small>
                      </div>
                    </div>
                  </td>
                  <td>{j.location}</td>
                  <td className="text-nowrap">{formatSalary(j.salary) || "—"}</td>
                  <td>
                    <Link to={`/admin/applications?job=${j._id}`} className="fw-semibold">{j.applicantsCount || 0}</Link>
                  </td>
                  <td>
                    <button type="button" className={`status status-${j.isActive ? "active" : "closed"} border-0`} onClick={() => toggleActive(j)} title={j.isActive ? "Click to close" : "Click to reopen"}>
                      {j.isActive ? "Open" : "Closed"}
                    </button>
                    {j.isActive && j.expiresAt && (
                      <div className={`small mt-1 ${isExpired(j) ? "text-danger fw-semibold" : "text-steel"}`}>
                        {isExpired(j) ? "Expired" : "Until"} {formatDate(j.expiresAt)}
                      </div>
                    )}
                  </td>
                  <td className="text-nowrap small text-steel">{formatDate(j.createdAt)}</td>
                  <td className="text-nowrap text-end">
                    <Link to={`/jobs/${j._id}`} className="btn btn-ghost btn-sm" aria-label={`View ${j.title}`} title="View on site"><FaExternalLinkAlt /></Link>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(j)} aria-label={`Edit ${j.title}`} title="Edit"><FaEdit /></button>
                    <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => setDeleting(j)} aria-label={`Delete ${j.title}`} title="Delete"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <JobForm initial={editing} companies={companies} onSaved={onSaved} onClose={closeForm} />}
      {deleting && (
        <ConfirmDialog
          title="Delete this job?"
          message={`"${deleting.title}" and its ${deleting.applicantsCount || 0} applications will be removed permanently. To hide it but keep the applications, close the job instead.`}
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </AdminShell>
  );
}

export default AdminJobs;
