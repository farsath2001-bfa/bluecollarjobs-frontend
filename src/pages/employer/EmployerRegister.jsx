import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { registerEmployer, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useT } from "../../context/LanguageContext";
import { useTitle } from "../../utils/useTitle";
import { homeFor } from "../../utils/roles";
import { EMIRATES, tEmirate } from "../../utils/format";
import sideImage from "../../assets/Images/hero-warehouse.jpg";

function EmployerRegister() {
  const t = useT();
  useTitle(t("emp.title"), { description: t("emp.sub") });
  const { user, loginUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", companyName: "", industry: "", location: "Dubai", website: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password || !form.companyName.trim()) return setError(t("emp.errFill"));
    if (form.password.length < 6) return setError(t("auth.errPw"));
    try {
      setLoading(true);
      const { data } = await registerEmployer(form);
      loginUser(data);
      toast(t("emp.created"));
      navigate("/employer", { replace: true });
    } catch (err) {
      setError(errorMessage(err, t("auth.errRegister")));
    } finally {
      setLoading(false);
    }
    return undefined;
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side" style={{ backgroundImage: `url(${sideImage})` }}>
        <div>
          <h2>{t("emp.title")}</h2>
          <p>{t("emp.sub")}</p>
          <ul className="list-unstyled mt-3 mb-0 d-grid gap-2">
            {["emp.b1", "emp.b2", "emp.b3", "emp.b4"].map((k) => (
              <li key={k} className="d-flex gap-2 align-items-start"><FaCheckCircle className="mt-1 flex-none" aria-hidden="true" /> {t(k)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-form">
        <div>
          <h1 className="h2 mb-1">{t("emp.formTitle")}</h1>
          <p className="text-steel mb-4">
            {t("emp.already")} <Link to="/login" className="fw-semibold">{t("nav.login")}</Link>
          </p>

          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={submit} noValidate>
            <h2 className="h6 text-uppercase text-steel mb-2" style={{ letterSpacing: ".04em" }}>{t("emp.companyDetails")}</h2>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <label className="form-label" htmlFor="r-company">{t("emp.companyName")} *</label>
                <input id="r-company" className="form-control" value={form.companyName} onChange={set("companyName")} autoComplete="organization" required />
              </div>
              <div className="col-sm-6">
                <label className="form-label" htmlFor="r-ind">{t("emp.industry")}</label>
                <input id="r-ind" className="form-control" placeholder={t("emp.industryPh")} value={form.industry} onChange={set("industry")} />
              </div>
              <div className="col-sm-6">
                <label className="form-label" htmlFor="r-loc">{t("emp.emirate")}</label>
                <select id="r-loc" className="form-select" value={form.location} onChange={set("location")}>
                  {EMIRATES.map((x) => <option key={x} value={x}>{tEmirate(x)}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="r-web">{t("emp.website")} <span className="text-steel fw-normal">{t("common.optional")}</span></label>
                <input id="r-web" dir="ltr" className="form-control" placeholder="www.example.ae" value={form.website} onChange={set("website")} />
              </div>
            </div>

            <h2 className="h6 text-uppercase text-steel mb-2" style={{ letterSpacing: ".04em" }}>{t("emp.yourDetails")}</h2>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="form-label" htmlFor="r-name">{t("emp.yourName")} *</label>
                <input id="r-name" className="form-control" value={form.name} onChange={set("name")} autoComplete="name" required />
              </div>
              <div className="col-sm-6">
                <label className="form-label" htmlFor="r-phone">{t("emp.mobile")} *</label>
                <input id="r-phone" type="tel" dir="ltr" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} autoComplete="tel" required />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="r-email">{t("emp.workEmail")} *</label>
                <input id="r-email" type="email" dir="ltr" className="form-control" placeholder="hr@company.ae" value={form.email} onChange={set("email")} autoComplete="email" required />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="r-pw">{t("auth.password")} *</label>
                <div className="position-relative">
                  <input id="r-pw" type={show ? "text" : "password"} className="form-control pe-5" value={form.password} onChange={set("password")} autoComplete="new-password" minLength={6} required />
                  <button type="button" className="btn btn-ghost position-absolute top-50 end-0 translate-middle-y me-1" onClick={() => setShow((s) => !s)} aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="form-text">{t("auth.pwHint")}</div>
              </div>
            </div>

            <div className="notice notice-ok small my-3">{t("emp.approvalNote")}</div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? t("emp.creating") : t("emp.create")}
            </button>
          </form>

          <p className="small text-steel mt-4 mb-0">{t("emp.jobSeeker")} <Link to="/register">{t("emp.jobSeekerLink")}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default EmployerRegister;
