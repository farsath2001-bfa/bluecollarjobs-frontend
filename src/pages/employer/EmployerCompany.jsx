import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerShell from "./EmployerShell";
import { CompanyLogo } from "../../components/ui";
import { LogoUpload } from "../../components/Uploads";
import { useTitle } from "../../utils/useTitle";
import { getEmployerCompany, updateEmployerCompany, updateProfile, changePassword, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EMIRATES } from "../../utils/format";

const FIELDS = ["name", "industry", "location", "website", "phone", "email", "description", "logo"];

function EmployerCompany() {
  useTitle("Company profile");
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [company, setCompany] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState({ name: user.name || "", phone: user.phone || "" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getEmployerCompany()
      .then(({ data }) => {
        setCompany(data);
        setForm(Object.fromEntries(FIELDS.map((f) => [f, data[f] || ""])));
      })
      .catch((err) => toast(errorMessage(err), "error"));
  }, [toast]);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const saveCompany = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast("Company name is required", "error");
    try {
      setSaving(true);
      const [{ data }] = await Promise.all([
        updateEmployerCompany(form),
        contact.name.trim() !== user.name || contact.phone.trim() !== (user.phone || "")
          ? updateProfile({ name: contact.name.trim(), phone: contact.phone.trim() }).then((r) => updateUser(r.data))
          : null,
      ]);
      setCompany((c) => ({ ...c, ...data }));
      toast("Company profile saved");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword.length < 6) return toast("New password needs at least 6 characters", "error");
    try {
      setPwSaving(true);
      await changePassword(pw);
      setPw({ currentPassword: "", newPassword: "" });
      toast("Password changed");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setPwSaving(false);
    }
    return undefined;
  };

  return (
    <EmployerShell title="Company profile">
      {!form ? (
        <div className="skel" style={{ height: 420 }} />
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <form className="panel mb-4" onSubmit={saveCompany} noValidate>
              <h2 className="h4 mb-1">Company details</h2>
              <p className="small text-steel mb-3">Shown on your company page and next to every job you post.</p>
              <div className="row g-3">
                <div className="col-md-7">
                  <label className="form-label" htmlFor="e-name">Company name *</label>
                  <input id="e-name" className="form-control" value={form.name} onChange={set("name")} />
                </div>
                <div className="col-md-5">
                  <label className="form-label" htmlFor="e-ind">Industry</label>
                  <input id="e-ind" className="form-control" placeholder="e.g. Logistics, Facility management" value={form.industry} onChange={set("industry")} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-loc">Emirate</label>
                  <select id="e-loc" className="form-select" value={form.location} onChange={set("location")}>
                    <option value="">Choose an emirate</option>
                    {[...new Set([...EMIRATES, form.location].filter(Boolean))].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-web">Website</label>
                  <input id="e-web" className="form-control" dir="ltr" placeholder="www.example.ae" value={form.website} onChange={set("website")} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-phone">Company phone / WhatsApp</label>
                  <input id="e-phone" type="tel" dir="ltr" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} />
                  <div className="form-text">Used for the “Apply on WhatsApp” button on your jobs.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-email">HR email</label>
                  <input id="e-email" type="email" dir="ltr" className="form-control" value={form.email} onChange={set("email")} />
                </div>
                <div className="col-12">
                  <span className="form-label d-block">Logo</span>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <CompanyLogo logo={form.logo} name={form.name} />
                    <LogoUpload preview={false} value={form.logo} onChange={(url) => setForm((f) => ({ ...f, logo: url }))} />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="e-desc">About the company</label>
                  <textarea id="e-desc" className="form-control" rows={4} maxLength={1500} placeholder="What you do, how many staff, where you work, why people like working with you" value={form.description} onChange={set("description")} />
                </div>
              </div>

              <h2 className="h5 mt-4 mb-2">Contact person</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-cname">Your name</label>
                  <input id="e-cname" className="form-control" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-cphone">Your mobile</label>
                  <input id="e-cphone" type="tel" dir="ltr" className="form-control" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </div>
              </div>

              <button className="btn btn-primary mt-3" type="submit" disabled={saving}>{saving ? "Saving…" : "Save company profile"}</button>
            </form>

            <form className="panel" onSubmit={savePassword}>
              <h2 className="h4 mb-3">Change password</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-cur">Current password</label>
                  <input id="e-cur" type="password" className="form-control" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="e-new">New password</label>
                  <input id="e-new" type="password" className="form-control" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
                </div>
              </div>
              <button className="btn btn-light-line mt-3" type="submit" disabled={pwSaving}>{pwSaving ? "Changing…" : "Change password"}</button>
            </form>
          </div>

          <aside className="col-lg-4">
            <div className="panel">
              <h2 className="h5">Account</h2>
              <p className="small mb-2">Signed in as <strong className="ltr">{user.email}</strong></p>
              <p className="small mb-2">Status: <span className={`status status-${company.status}`}>{company.status === "approved" ? "Approved" : company.status === "pending" ? "Waiting for approval" : "Suspended"}</span></p>
              {company.status !== "pending" && (
                <Link to={`/company/${company._id}`} className="small fw-semibold">View your public company page</Link>
              )}
              <hr />
              <p className="small text-steel mb-0">
                The <strong>verified</strong> check mark is added by our team after we confirm your trade licence.{" "}
                <Link to="/contact?subject=Other">Ask to be verified</Link>.
              </p>
            </div>
          </aside>
        </div>
      )}
    </EmployerShell>
  );
}

export default EmployerCompany;
