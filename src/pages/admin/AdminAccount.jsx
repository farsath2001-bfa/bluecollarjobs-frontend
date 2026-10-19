import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { useTitle } from "../../utils/useTitle";
import { updateProfile, changePassword, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { initials, formatDate } from "../../utils/format";

// The admin's own login: display name, phone and password
function AdminAccount() {
  useTitle("My account");
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "" });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");

  const dirty = form.name.trim() !== (user.name || "") || form.phone.trim() !== (user.phone || "");

  const saveDetails = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast("Name can't be empty", "error");
      return;
    }
    try {
      setSaving(true);
      const { data } = await updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      updateUser(data);
      toast("Account details saved");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (!pw.currentPassword) return setPwError("Enter your current password");
    if (pw.newPassword.length < 6) return setPwError("New password needs at least 6 characters");
    if (pw.newPassword !== pw.confirm) return setPwError("The two new passwords don't match");
    if (pw.newPassword === pw.currentPassword) return setPwError("Choose a password that's different from the current one");
    try {
      setPwSaving(true);
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      toast("Password changed");
    } catch (err) {
      setPwError(errorMessage(err));
    } finally {
      setPwSaving(false);
    }
    return undefined;
  };

  const pwType = show ? "text" : "password";

  return (
    <AdminShell title="My account">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="panel text-center h-100">
            <span className="avatar avatar-lg mx-auto mb-2" lang="en">{initials(user.name)}</span>
            <div className="fw-bold fs-5">{user.name}</div>
            <div className="text-steel small ltr">{user.email}</div>
            <div className="chip chip-blue mt-2">Administrator</div>
            {user.createdAt && <div className="small text-steel mt-3">Account since {formatDate(user.createdAt)}</div>}
            <hr />
            <p className="small text-steel mb-0">
              Your sign-in email can't be changed here. If you forget your password, use “Forgot your password?” on the log-in page — the link goes to this email.
            </p>
          </div>
        </div>

        <div className="col-lg-8">
          <form className="panel mb-4" onSubmit={saveDetails}>
            <h2 className="h4 mb-1">Your details</h2>
            <p className="text-steel small mb-3">Your name shows in the top menu and on emails sent from the admin panel.</p>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="a-name">Display name</label>
                <input id="a-name" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="a-phone">Phone / WhatsApp</label>
                <input id="a-phone" type="tel" dir="ltr" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="a-email">Email</label>
                <input id="a-email" type="email" dir="ltr" className="form-control" value={user.email} disabled readOnly />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3" disabled={saving || !dirty}>{saving ? "Saving…" : "Save details"}</button>
          </form>

          <form className="panel" onSubmit={savePassword} noValidate>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Change password</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShow((s) => !s)}>
                {show ? <><FaEyeSlash /> Hide</> : <><FaEye /> Show</>}
              </button>
            </div>
            {pwError && <div className="alert alert-danger py-2" role="alert">{pwError}</div>}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="a-cur">Current password</label>
                <input id="a-cur" type={pwType} className="form-control" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="a-new">New password</label>
                <input id="a-new" type={pwType} className="form-control" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
                <div className="form-text">At least 6 characters. A short sentence is easy to remember and hard to guess.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="a-confirm">Confirm new password</label>
                <input id="a-confirm" type={pwType} className="form-control" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-light-line mt-3" disabled={pwSaving}>{pwSaving ? "Changing…" : "Change password"}</button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminAccount;
