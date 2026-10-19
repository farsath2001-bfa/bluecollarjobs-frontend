import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTitle } from "../../utils/useTitle";
import { useT } from "../../context/LanguageContext";
import { homeFor } from "../../utils/roles";
import sideImage from "../../assets/Images/hero-warehouse.jpg";

function Register() {
  const t = useT();
  useTitle(t("auth.registerTitle"));
  const { user, loginUser: saveSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const from = useLocation().state?.from;

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError(t("auth.errFill"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.errPw"));
      return;
    }
    try {
      setLoading(true);
      const { data } = await registerUser(form);
      saveSession(data);
      toast(t("auth.created"));
      navigate(from || "/jobs", { replace: true });
    } catch (err) {
      setError(errorMessage(err, t("auth.errRegister")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side" style={{ backgroundImage: `url(${sideImage})` }}>
        <div>
          <h2>{t("auth.registerSideTitle")}</h2>
          <p>{t("auth.registerSideText")}</p>
        </div>
      </div>

      <div className="auth-form">
        <div>
          <h1 className="h2 mb-1">{t("auth.registerTitle")}</h1>
          <p className="text-steel mb-4">
            {t("auth.already")} <Link to="/login" state={{ from }} className="fw-semibold">{t("nav.login")}</Link>
          </p>

          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">{t("auth.fullName")}</label>
              <input id="name" className="form-control" value={form.name} onChange={set("name")} autoComplete="name" required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">{t("auth.email")}</label>
              <input id="email" type="email" dir="ltr" className="form-control" placeholder="name@example.com" value={form.email} onChange={set("email")} autoComplete="email" required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="phone">{t("auth.phone")} <span className="text-steel fw-normal">{t("common.optional")}</span></label>
              <input id="phone" type="tel" dir="ltr" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} autoComplete="tel" />
              <div className="form-text">{t("auth.phoneHint")}</div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">{t("auth.password")}</label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control pe-5"
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="btn btn-ghost position-absolute top-50 end-0 translate-middle-y me-1"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="form-text">{t("auth.pwHint")}</div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? t("auth.creating") : t("nav.register")}
            </button>
          </form>

          <p className="small text-steel mt-4 mb-0">{t("auth.employer")} <Link to="/employers/register" className="fw-semibold">{t("emp.formTitle")}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
