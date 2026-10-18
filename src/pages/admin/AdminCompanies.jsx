import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { CompanyLogo, ConfirmDialog, EmptyState, Modal } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { getCompanies, adminCreateCompany, adminUpdateCompany, adminDeleteCompany, errorMessage } from "../../service/api";
import { useToast } from "../../context/ToastContext";
import { BUNDLED_LOGOS, EMIRATES } from "../../utils/format";

const EMPTY = { name: "", industry: "", location: "Dubai", logo: "", website: "", phone: "", email: "", description: "", isVerified: false };

function CompanyForm({ initial, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(initial._id);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Company name is required");
      return;
    }
    try {
      setSaving(true);
      const { data } = editing ? await adminUpdateCompany(initial._id, form) : await adminCreateCompany(form);
      toast(editing ? "Company updated" : "Company added");
      onSaved({ ...data, openJobs: initial.openJobs || 0 }, editing);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? "Edit company" : "Add company"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-light-line" onClick={onClose}>Cancel</button>
          <button type="submit" form="company-form" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add company"}</button>
        </>
      }
    >
      <form id="company-form" onSubmit={submit} noValidate>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="c-name">Company name *</label>
            <input id="c-name" className="form-control" value={form.name} onChange={set("name")} />
            {editing && <div className="form-text">Renaming also updates the name on this company's jobs.</div>}
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="c-ind">Industry</label>
            <input id="c-ind" className="form-control" placeholder="e.g. Facility management" value={form.industry} onChange={set("industry")} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="c-loc">Emirate</label>
            <select id="c-loc" className="form-select" value={form.location} onChange={set("location")}>
              {[...new Set([...EMIRATES, form.location].filter(Boolean))].map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="c-web">Website</label>
            <input id="c-web" className="form-control" placeholder="www.example.ae" value={form.website} onChange={set("website")} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="c-logo">Logo</label>
            <div className="d-flex gap-2 align-items-center">
              <CompanyLogo logo={form.logo} name={form.name} size="sm" />
              <select id="c-logo" className="form-select" value={BUNDLED_LOGOS[form.logo] ? form.logo : form.logo ? "__url" : ""} onChange={(e) => setForm({ ...form, logo: e.target.value === "__url" ? "https://" : e.target.value })}>
                <option value="">No logo (show initials)</option>
                {Object.entries(BUNDLED_LOGOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                <option value="__url">Image URL…</option>
              </select>
            </div>
            {form.logo && !BUNDLED_LOGOS[form.logo] && (
              <input className="form-control mt-2" placeholder="https://res.cloudinary.com/…/logo.png" value={form.logo} onChange={set("logo")} aria-label="Logo image URL" />
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="c-phone">HR phone</label>
            <input id="c-phone" className="form-control" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="c-email">HR email</label>
            <input id="c-email" type="email" className="form-control" value={form.email} onChange={set("email")} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="c-desc">About the company</label>
            <textarea id="c-desc" className="form-control" rows={3} value={form.description} onChange={set("description")} />
          </div>
          <div className="col-12">
            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
              <input type="checkbox" className="form-check-input m-0" checked={form.isVerified} onChange={set("isVerified")} />
              Verified employer (shows a check mark on the site)
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function AdminCompanies() {
  useTitle("Manage companies");
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCompanies()
      .then(({ data }) => setCompanies(data))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const onSaved = (c, wasEdit) => {
    setCompanies((list) => (wasEdit ? list.map((x) => (x._id === c._id ? c : x)) : [...list, c]).sort((a, b) => a.name.localeCompare(b.name)));
    setEditing(null);
  };

  const confirmDelete = async () => {
    try {
      setBusy(true);
      await adminDeleteCompany(deleting._id);
      setCompanies((list) => list.filter((c) => c._id !== deleting._id));
      toast("Company deleted");
      setDeleting(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Companies" actions={<button className="btn btn-primary" onClick={() => setEditing(EMPTY)}><FaPlus /> Add company</button>}>
      {loading ? (
        <div className="skel" style={{ height: 280 }} />
      ) : companies.length === 0 ? (
        <EmptyState title="No companies yet" action={<button className="btn btn-primary" onClick={() => setEditing(EMPTY)}>Add company</button>}>
          Add employers here, then pick them when you post a job.
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Company</th><th>Emirate</th><th>Open jobs</th><th>Contact</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <CompanyLogo logo={c.logo} name={c.name} size="sm" />
                      <div>
                        <Link to={`/company/${c._id}`} className="fw-semibold text-reset">{c.name}</Link> {c.isVerified && <FaCheckCircle className="verified" title="Verified" />}
                        <div className="small text-steel">{c.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.location}</td>
                  <td>{c.openJobs || 0}</td>
                  <td className="small">{c.phone || c.email || <span className="text-steel">—</span>}</td>
                  <td className="text-end text-nowrap">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing({ ...EMPTY, ...c })} aria-label={`Edit ${c.name}`}><FaEdit /></button>
                    <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <CompanyForm initial={editing} onSaved={onSaved} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete this company?"
          message={`${deleting.name} will be removed. Its jobs stay on the site but are no longer linked to a company profile.`}
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </AdminShell>
  );
}

export default AdminCompanies;
