import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { updateProfile, changePassword, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EMIRATES } from "../../utils/format";

function Profile() {
  useTitle("Edit profile");
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    location: user.location || "",
    nationality: user.nationality || "",
    experienceYears: user.experienceYears || 0,
    skills: (user.skills || []).join(", "),
    languages: (user.languages || []).join(", "),
    resume: user.resume || "",
    bio: user.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast("Name can't be empty", "error");
      return;
    }
    try {
      setSaving(true);
      const { data } = await updateProfile({ ...form, experienceYears: Number(form.experienceYears) || 0 });
      updateUser(data);
      toast("Profile saved");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword.length < 6) {
      toast("New password needs at least 6 characters", "error");
      return;
    }
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
  };

  return (
    <>
      <PageHead title="Edit profile" crumb={<Link to="/dashboard">Dashboard</Link>}>
        Employers see these details when you apply.
      </PageHead>

      <div className="container section-tight" style={{ maxWidth: 860 }}>
        <form className="panel mb-4" onSubmit={save}>
          <h2 className="h4 mb-3">About you</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" className="form-control" value={form.name} onChange={set("name")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="phone">Phone / WhatsApp</label>
              <input id="phone" type="tel" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="location">Where do you live?</label>
              <select id="location" className="form-select" value={form.location} onChange={set("location")}>
                <option value="">Choose an emirate</option>
                {EMIRATES.map((e) => <option key={e}>{e}</option>)}
                <option>Outside the UAE</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="nationality">Nationality</label>
              <input id="nationality" className="form-control" value={form.nationality} onChange={set("nationality")} />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="exp">Years of experience</label>
              <input id="exp" type="number" min="0" max="60" className="form-control" value={form.experienceYears} onChange={set("experienceYears")} />
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="skills">Skills</label>
              <input id="skills" className="form-control" placeholder="e.g. Light vehicle licence, forklift, wiring" value={form.skills} onChange={set("skills")} />
              <div className="form-text">Separate with commas.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="languages">Languages</label>
              <input id="languages" className="form-control" placeholder="e.g. English, Hindi, Arabic" value={form.languages} onChange={set("languages")} />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="resume">CV link</label>
              <input id="resume" type="url" className="form-control" placeholder="Google Drive or Dropbox link" value={form.resume} onChange={set("resume")} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="bio">Short summary</label>
              <textarea id="bio" className="form-control" rows={3} maxLength={600} placeholder="Where you've worked and what you're good at" value={form.bio} onChange={set("bio")} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
        </form>

        <form className="panel" onSubmit={savePassword}>
          <h2 className="h4 mb-3">Change password</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="cur">Current password</label>
              <input id="cur" type="password" className="form-control" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new">New password</label>
              <input id="new" type="password" className="form-control" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
            </div>
          </div>
          <button className="btn btn-light-line mt-3" type="submit" disabled={pwSaving}>{pwSaving ? "Changing…" : "Change password"}</button>
        </form>
      </div>
    </>
  );
}

export default Profile;
