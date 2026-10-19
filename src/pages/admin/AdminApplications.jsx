import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaSearch, FaFileAlt, FaDownload } from "react-icons/fa";
import AdminShell from "./AdminShell";
import EmployerShell from "../employer/EmployerShell";
import { EmptyState, Modal, StatusBadge } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { adminGetApplications, adminUpdateApplication, openFile, errorMessage } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { formatDate, timeAgo } from "../../utils/format";
import { downloadCsv } from "../../utils/csv";
import { toWhatsAppNumber } from "../../utils/whatsapp";

const CSV_COLUMNS = [
  { label: "Applied on", value: (a) => (a.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : "") },
  { label: "Status", value: (a) => a.status },
  { label: "Name", value: (a) => a.applicant?.name },
  { label: "Phone", value: (a) => a.phone || a.applicant?.phone },
  { label: "Email", value: (a) => a.applicant?.email },
  { label: "Job", value: (a) => a.job?.title },
  { label: "Company", value: (a) => a.job?.companyName },
  { label: "Job location", value: (a) => a.job?.location },
  { label: "Can start", value: (a) => a.availableFrom },
  { label: "Has UAE visa", value: (a) => (a.hasUaeVisa ? "Yes" : "No") },
  { label: "Lives in", value: (a) => a.applicant?.location },
  { label: "Nationality", value: (a) => a.applicant?.nationality },
  { label: "Experience (years)", value: (a) => a.applicant?.experienceYears },
  { label: "Skills", value: (a) => a.applicant?.skills },
  { label: "Languages", value: (a) => a.applicant?.languages },
  { label: "CV", value: (a) => a.resume || a.applicant?.resume },
  { label: "Message", value: (a) => a.coverLetter },
  { label: "Private note", value: (a) => a.adminNote },
];

const STATUSES = ["pending", "reviewed", "shortlisted", "accepted", "rejected"];

// UAE numbers typed as 050… → 97150… for WhatsApp links
const waNumber = (phone = "") => toWhatsAppNumber(phone) || phone.replace(/\D/g, "");

function ApplicationModal({ app, onChange, onClose }) {
  const toast = useToast();
  const [note, setNote] = useState(app.adminNote || "");
  const [saving, setSaving] = useState("");
  const person = app.applicant || {};

  const update = async (data, label) => {
    try {
      setSaving(label);
      const res = await adminUpdateApplication(app._id, data);
      onChange(res.data);
      toast(data.status ? `Marked as ${data.status}` : "Note saved");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving("");
    }
  };

  const phone = app.phone || person.phone;

  return (
    <Modal title={person.name || "Applicant"} onClose={onClose}>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-steel small">Applied for</div>
          <strong>{app.job?.title || "Removed job"}</strong>
          <div className="small text-steel">{app.job?.companyName}, {formatDate(app.createdAt)}</div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {phone && <a className="btn btn-primary btn-sm" href={`tel:${phone}`}><FaPhoneAlt /> {phone}</a>}
        {phone && <a className="btn btn-light-line btn-sm" href={`https://wa.me/${waNumber(phone)}`} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>}
        {person.email && <a className="btn btn-light-line btn-sm" href={`mailto:${person.email}`}><FaEnvelope /> Email</a>}
        {(app.resume || person.resume) && (
          <button type="button" className="btn btn-light-line btn-sm" onClick={() => openFile(app.resume || person.resume).catch((err) => toast(errorMessage(err), "error"))}>
            <FaFileAlt /> Open CV
          </button>
        )}
      </div>

      <div className="detail-facts mb-3">
        <div><small>Can start</small><strong>{app.availableFrom || "Not given"}</strong></div>
        <div><small>UAE visa</small><strong>{app.hasUaeVisa ? "Yes, has visa" : "No / not given"}</strong></div>
        <div><small>Lives in</small><strong>{person.location || "Not given"}</strong></div>
        <div><small>Experience</small><strong>{person.experienceYears ? `${person.experienceYears} years` : "Not given"}</strong></div>
        <div><small>Nationality</small><strong>{person.nationality || "Not given"}</strong></div>
        <div><small>Languages</small><strong>{person.languages?.join(", ") || "Not given"}</strong></div>
      </div>

      {person.skills?.length > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-1">{person.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
      )}

      {app.coverLetter && (
        <div className="mb-3">
          <div className="small text-steel mb-1">Message from applicant</div>
          <p className="prose mb-0 p-3" style={{ background: "var(--paper)", borderRadius: 6 }}>{app.coverLetter}</p>
        </div>
      )}

      <div className="mb-3">
        <span className="form-label d-block">Set status</span>
        <div className="d-flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`btn btn-sm ${app.status === s ? "btn-primary" : "btn-light-line"} text-capitalize`}
              disabled={!!saving}
              onClick={() => update({ status: s }, s)}
            >
              {saving === s ? "Saving…" : s}
            </button>
          ))}
        </div>
      </div>

      <label className="form-label" htmlFor="note">Private note</label>
      <textarea id="note" className="form-control" rows={2} placeholder="e.g. Called on Monday, interview Thursday 10am" value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="button" className="btn btn-light-line btn-sm mt-2" disabled={!!saving || note === (app.adminNote || "")} onClick={() => update({ adminNote: note }, "note")}>
        {saving === "note" ? "Saving…" : "Save note"}
      </button>
    </Modal>
  );
}

function AdminApplications({ employer = false }) {
  useTitle(employer ? "Applicants" : "Applications");
  const Shell = employer ? EmployerShell : AdminShell;
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");
  const status = params.get("status") || "";
  const jobFilter = params.get("job") || "";

  useEffect(() => {
    adminGetApplications()
      .then(({ data }) => setApps(data))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps
      .filter((a) => !status || a.status === status)
      .filter((a) => !jobFilter || a.job?._id === jobFilter)
      .filter((a) => !q || [a.applicant?.name, a.applicant?.email, a.phone, a.job?.title, a.job?.companyName].some((v) => v?.toLowerCase().includes(q)));
  }, [apps, status, jobFilter, search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  const onChange = (updated) => {
    setApps((list) => list.map((a) => (a._id === updated._id ? updated : a)));
    setOpen(updated);
  };

  const jobTitle = jobFilter && apps.find((a) => a.job?._id === jobFilter)?.job?.title;

  return (
    <Shell
      title={employer ? "Applicants" : "Applications"}
      actions={
        <button
          type="button"
          className="btn btn-light-line"
          disabled={!shown.length}
          onClick={() => downloadCsv(`applications-${new Date().toISOString().slice(0, 10)}.csv`, CSV_COLUMNS, shown)}
          title="Download the applications shown below as a spreadsheet"
        >
          <FaDownload /> Export CSV ({shown.length})
        </button>
      }
    >
      <div className="toolbar">
        <div className="input-icon grow">
          <FaSearch aria-hidden="true" />
          <input className="form-control" placeholder="Search name, phone, email or job" aria-label="Search applications" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: "auto" }} value={status} onChange={(e) => setFilter("status", e.target.value)} aria-label="Status">
          <option value="">All statuses ({apps.length})</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)} ({apps.filter((a) => a.status === s).length})</option>)}
        </select>
      </div>
      {jobFilter && (
        <div className="mb-3">
          <button type="button" className="chip chip-blue border-0" onClick={() => setFilter("job", "")}>Only: {jobTitle || "selected job"} ✕</button>
        </div>
      )}

      {loading ? (
        <div className="skel" style={{ height: 300 }} />
      ) : shown.length === 0 ? (
        <EmptyState icon={<FaFileAlt />} title={apps.length ? "No applications match" : "No applications yet"}>
          {apps.length ? "Change the search or status filter." : employer ? "When job seekers apply to your jobs, they appear here with their phone number and CV." : "Applications appear here as soon as candidates apply."}
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Applicant</th><th>Job</th><th>Phone</th><th>Applied</th><th>Status</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div className="fw-semibold">{a.applicant?.name || "Deleted user"}</div>
                    <small className="text-steel">{a.applicant?.email}</small>
                  </td>
                  <td>
                    {a.job ? <Link to={`/jobs/${a.job._id}`} className="text-reset fw-semibold">{a.job.title}</Link> : <span className="text-steel">Removed job</span>}
                    <div className="small text-steel">{a.job?.companyName}</div>
                  </td>
                  <td className="text-nowrap">{a.phone ? <a href={`tel:${a.phone}`}>{a.phone}</a> : "—"}</td>
                  <td className="text-nowrap small text-steel">{timeAgo(a.createdAt)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-end"><button type="button" className="btn btn-light-line btn-sm" onClick={() => setOpen(a)}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <ApplicationModal app={open} onChange={onChange} onClose={() => setOpen(null)} />}
    </Shell>
  );
}

export default AdminApplications;
