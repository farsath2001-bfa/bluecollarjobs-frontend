import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { updateProfile, changePassword, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EMIRATES, tEmirate } from "../../utils/format";
import { useT } from "../../context/LanguageContext";
import { CvField } from "../../components/Uploads";

function Profile() {
  const t = useT();
  useTitle(t("profile.title"));
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
    resumeName: user.resumeName || "",
    bio: user.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast(t("profile.nameEmpty"), "error");
      return;
    }
    try {
      setSaving(true);
      const { data } = await updateProfile({ ...form, experienceYears: Number(form.experienceYears) || 0 });
      updateUser(data);
      toast(t("profile.saved"));
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword.length < 6) {
      toast(t("profile.pw6"), "error");
      return;
    }
    try {
      setPwSaving(true);
      await changePassword(pw);
      setPw({ currentPassword: "", newPassword: "" });
      toast(t("profile.pwChanged"));
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <>
      <PageHead title={t("profile.title")} crumb={<Link to="/dashboard">{t("nav.dashboard")}</Link>}>
        {t("profile.sub")}
      </PageHead>

      <div className="container section-tight" style={{ maxWidth: 860 }}>
        <form className="panel mb-4" onSubmit={save}>
          <h2 className="h4 mb-3">{t("profile.about")}</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">{t("auth.fullName")}</label>
              <input id="name" className="form-control" value={form.name} onChange={set("name")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="phone">{t("auth.phone")}</label>
              <input id="phone" type="tel" dir="ltr" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="location">{t("profile.live")}</label>
              <select id="location" className="form-select" value={form.location} onChange={set("location")}>
                <option value="">{t("profile.chooseEmirate")}</option>
                {EMIRATES.map((e) => <option key={e} value={e}>{tEmirate(e)}</option>)}
                <option value="Outside the UAE">{t("profile.outside")}</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="nationality">{t("profile.nationality")}</label>
              <input id="nationality" className="form-control" value={form.nationality} onChange={set("nationality")} />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="exp">{t("profile.experience")}</label>
              <input id="exp" type="number" min="0" max="60" className="form-control" value={form.experienceYears} onChange={set("experienceYears")} />
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="skills">{t("profile.skills")}</label>
              <input id="skills" className="form-control" placeholder={t("profile.skillsPh")} value={form.skills} onChange={set("skills")} />
              <div className="form-text">{t("profile.commas")}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="languages">{t("profile.languages")}</label>
              <input id="languages" className="form-control" placeholder={t("profile.languagesPh")} value={form.languages} onChange={set("languages")} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="resume">{t("cv.yourCv")}</label>
              <CvField value={{ url: form.resume, name: form.resumeName }} onChange={({ url, name }) => setForm((f) => ({ ...f, resume: url, resumeName: name }))} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="bio">{t("profile.summary")}</label>
              <textarea id="bio" className="form-control" rows={3} maxLength={600} placeholder={t("profile.summaryPh")} value={form.bio} onChange={set("bio")} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" type="submit" disabled={saving}>{saving ? t("profile.saving") : t("profile.save")}</button>
        </form>

        <form className="panel" onSubmit={savePassword}>
          <h2 className="h4 mb-3">{t("profile.changePw")}</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="cur">{t("profile.currentPw")}</label>
              <input id="cur" type="password" className="form-control" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new">{t("profile.newPw")}</label>
              <input id="new" type="password" className="form-control" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
            </div>
          </div>
          <button className="btn btn-light-line mt-3" type="submit" disabled={pwSaving}>{pwSaving ? t("profile.changing") : t("profile.changePwBtn")}</button>
        </form>
      </div>
    </>
  );
}

export default Profile;
