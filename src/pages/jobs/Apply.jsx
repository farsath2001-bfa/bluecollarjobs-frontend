import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { CompanyLogo, EmptyState, Spinner } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { applyToJob, getJobById, updateProfile, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatSalary, tLocation } from "../../utils/format";
import { useT } from "../../context/LanguageContext";
import { CvField } from "../../components/Uploads";

const AVAILABILITY = ["Immediately", "Within 1 week", "Within 2 weeks", "Within 1 month", "After notice period"];

function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const t = useT();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    phone: user?.phone || "",
    availableFrom: "Immediately",
    hasUaeVisa: false,
    resume: user?.resume || "",
    coverLetter: "",
  });
  const [resumeName, setResumeName] = useState(user?.resumeName || "");

  useTitle(job ? `${t("apply.title")}: ${job.title}` : t("apply.title"));

  useEffect(() => {
    getJobById(id)
      .then(({ data }) => setJob(data))
      .catch((err) => setLoadError(errorMessage(err, t("detail.notFoundSub"))))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) {
      setError(t("apply.phoneError"));
      return;
    }
    try {
      setSubmitting(true);
      await applyToJob(id, form);
      // First phone number / CV given here becomes part of the profile too
      const profilePatch = {};
      if (!user.phone) profilePatch.phone = form.phone;
      if (form.resume && !user.resume) Object.assign(profilePatch, { resume: form.resume, resumeName });
      if (Object.keys(profilePatch).length) {
        updateUser(profilePatch);
        updateProfile(profilePatch).catch(() => {});
      }
      toast(t("apply.sent"));
      navigate("/applied", { replace: true });
    } catch (err) {
      setError(errorMessage(err, t("apply.failed")));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  if (loadError || !job || job.isOpen === false) {
    return (
      <div className="container section">
        <EmptyState title={t("apply.cantApply")} action={<Link to="/jobs" className="btn btn-primary">{t("detail.browseOpen")}</Link>}>
          {loadError || t("common.closed")}
        </EmptyState>
      </div>
    );
  }

  const pay = formatSalary(job.salary);

  return (
    <div className="container section-tight" style={{ maxWidth: 760 }}>
      <Link to={`/jobs/${id}`} className="btn btn-ghost mb-3 ps-0"><FaArrowLeft className="flip-rtl" /> {t("apply.back")}</Link>

      <div className="panel mb-3 d-flex gap-3 align-items-center">
        <CompanyLogo logo={job.logo} name={job.companyName} />
        <div className="min-w-0 flex-grow-1">
          <div className="fw-bold fs-5">{job.title}</div>
          <div className="text-steel">{job.companyName} <FaMapMarkerAlt className="ms-2" aria-hidden="true" /> {tLocation(job.location)}</div>
        </div>
        {pay && <span className="salary d-none d-sm-block ltr">{pay}</span>}
      </div>

      <form className="panel" onSubmit={handleSubmit} noValidate>
        <h1 className="h2 mb-1">{t("apply.title")}</h1>
        <p className="text-steel mb-4">{t("apply.applyingAs", { name: user.name, email: user.email })}</p>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">{t("apply.phone")} *</label>
            <input id="phone" type="tel" className="form-control" dir="ltr" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} required autoComplete="tel" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="avail">{t("apply.start")}</label>
            <select id="avail" className="form-select" value={form.availableFrom} onChange={set("availableFrom")}>
              {AVAILABILITY.map((a) => <option key={a} value={a}>{t(`avail.${a}`)}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
              <input type="checkbox" className="form-check-input m-0" checked={form.hasUaeVisa} onChange={set("hasUaeVisa")} />
              {t("apply.visa")}
            </label>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="resume">{t("apply.cv")} <span className="text-steel fw-normal">{t("common.optional")}</span></label>
            <CvField
              value={{ url: form.resume, name: resumeName }}
              onChange={({ url, name }) => {
                setForm((f) => ({ ...f, resume: url }));
                setResumeName(name);
              }}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cover">{t("apply.message")} <span className="text-steel fw-normal">{t("common.optional")}</span></label>
            <textarea
              id="cover"
              className="form-control"
              rows={4}
              maxLength={1500}
              placeholder={t("apply.messagePh")}
              value={form.coverLetter}
              onChange={set("coverLetter")}
            />
            <div className="form-text text-end">{form.coverLetter.length}/1500</div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={submitting}>
          {submitting ? t("apply.sending") : t("apply.send")}
        </button>
      </form>
    </div>
  );
}

export default Apply;
