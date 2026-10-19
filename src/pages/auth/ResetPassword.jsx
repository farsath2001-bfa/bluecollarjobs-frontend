import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTitle } from "../../utils/useTitle";
import { useT } from "../../context/LanguageContext";
import sideImage from "../../assets/Images/hero-construction.jpg";

function ResetPassword() {
  const t = useT();
  useTitle(t("auth.resetTitle"));
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { loginUser: saveSession } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError(t("auth.errPw"));
    if (password !== confirm) return setError(t("auth.mismatch"));
    try {
      setLoading(true);
      const { data } = await resetPassword(token, password);
      saveSession(data);
      toast(t("auth.resetDone"));
      navigate(data.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err, t("common.genericError")));
    } finally {
      setLoading(false);
    }
    return undefined;
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side" style={{ backgroundImage: `url(${sideImage})` }}>
        <div>
          <h2>{t("auth.loginSideTitle")}</h2>
          <p>{t("auth.loginSideText")}</p>
        </div>
      </div>

      <div className="auth-form">
        <div>
          <h1 className="h2 mb-1">{t("auth.resetTitle")}</h1>
          <p className="text-steel mb-4">{t("auth.resetText")}</p>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
              {/expired|invalid/i.test(error) && (
                <> <Link to="/forgot-password" className="alert-link">{t("auth.sendLink")}</Link></>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">{t("auth.newPassword")}</label>
              <div className="position-relative">
                <input id="password" type={show ? "text" : "password"} className="form-control pe-5" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={6} required autoFocus />
                <button type="button" className="btn btn-ghost position-absolute top-50 end-0 translate-middle-y me-1" onClick={() => setShow((s) => !s)} aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}>
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="form-text">{t("auth.pwHint")}</div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="confirm">{t("auth.confirmPassword")}</label>
              <input id="confirm" type={show ? "text" : "password"} className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? t("auth.saving") : t("auth.savePassword")}
            </button>
          </form>

          <p className="small mt-4 mb-0"><Link to="/login" className="fw-semibold">{t("auth.backToLogin")}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
