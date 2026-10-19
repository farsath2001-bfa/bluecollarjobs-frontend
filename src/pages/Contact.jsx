import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { PageHead } from "../components/ui";
import { useTitle } from "../utils/useTitle";
import { sendContactMessage, errorMessage } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { useT } from "../context/LanguageContext";

const SUBJECTS = ["Question about a job", "Post a job", "Problem with my account", "Password reset", "Report a listing", "Other"];

function Contact() {
  const t = useT();
  useTitle(t("contact.title"));
  const { user } = useAuth();
  const [params] = useSearchParams();
  const preset = params.get("subject");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: SUBJECTS.includes(preset) ? preset : preset ? "Other" : SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState({ sending: false, sent: "", error: "" });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ sending: false, sent: "", error: t("contact.errFill") });
      return;
    }
    setStatus({ sending: true, sent: "", error: "" });
    try {
      await sendContactMessage(form);
      setStatus({ sending: false, sent: t("contact.sent"), error: "" });
      setForm((f) => ({ ...f, message: "" }));
    } catch (err) {
      setStatus({ sending: false, sent: "", error: errorMessage(err, t("contact.failed")) });
    }
  };

  return (
    <>
      <PageHead title={t("contact.title")}>{t("contact.sub")}</PageHead>

      <div className="container section-tight">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="panel h-100">
              <h2 className="h4 mb-3">{t("contact.reach")}</h2>
              <ul className="list-unstyled mb-0 d-grid gap-3">
                <li className="d-flex gap-3"><FaEnvelope className="mt-1 text-primary" aria-hidden="true" /><div><strong>{t("contact.email")}</strong><br /><a href="mailto:support@jobzdxb.com" className="ltr">support@jobzdxb.com</a></div></li>
                <li className="d-flex gap-3"><FaClock className="mt-1 text-primary" aria-hidden="true" /><div><strong>{t("contact.hours")}</strong><br /><span className="text-steel">{t("contact.hoursVal")}</span></div></li>
                <li className="d-flex gap-3"><FaMapMarkerAlt className="mt-1 text-primary" aria-hidden="true" /><div><strong>{t("contact.office")}</strong><br /><span className="text-steel">{t("contact.officeVal")}</span></div></li>
              </ul>
              <hr />
              <p className="small text-steel mb-0">{t("contact.employers")}</p>
            </div>
          </div>

          <div className="col-lg-8">
            <form className="panel" onSubmit={handleSubmit} noValidate>
              <h2 className="h4 mb-3">{t("contact.formTitle")}</h2>
              {status.sent && <div className="alert alert-success py-2" role="status">{status.sent}</div>}
              {status.error && <div className="alert alert-danger py-2" role="alert">{status.error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="c-name">{t("contact.name")}</label>
                  <input id="c-name" className="form-control" value={form.name} onChange={set("name")} autoComplete="name" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="c-email">{t("contact.email")}</label>
                  <input id="c-email" type="email" dir="ltr" className="form-control" value={form.email} onChange={set("email")} autoComplete="email" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="c-phone">{t("contact.phone")} <span className="text-steel fw-normal">{t("common.optional")}</span></label>
                  <input id="c-phone" type="tel" dir="ltr" className="form-control" value={form.phone} onChange={set("phone")} autoComplete="tel" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="c-subject">{t("contact.subject")}</label>
                  <select id="c-subject" className="form-select" value={form.subject} onChange={set("subject")}>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{t(`subject.${s}`)}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="c-message">{t("contact.message")}</label>
                  <textarea id="c-message" className="form-control" rows={5} maxLength={2000} value={form.message} onChange={set("message")} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={status.sending}>
                {status.sending ? t("contact.sending") : t("contact.send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
