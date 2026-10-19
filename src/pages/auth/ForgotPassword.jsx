import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { forgotPassword, errorMessage } from "../../service/api";
import { useTitle } from "../../utils/useTitle";
import { useT } from "../../context/LanguageContext";
import sideImage from "../../assets/Images/hero-delivery.jpg";

function ForgotPassword() {
  const t = useT();
  useTitle(t("auth.forgotTitle"));
  const [email, setEmail] = useState(useLocation().state?.email || "");
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t("auth.errLogin"));
      return;
    }
    try {
      setLoading(true);
      await forgotPassword(email.trim());
      setSent(t("auth.linkSent"));
    } catch (err) {
      setError(errorMessage(err, t("common.genericError")));
    } finally {
      setLoading(false);
    }
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
          <h1 className="h2 mb-1">{t("auth.forgotTitle")}</h1>
          <p className="text-steel mb-4">{t("auth.forgotText")}</p>

          {sent ? (
            <div className="alert alert-success d-flex gap-3 align-items-start" role="status">
              <FaEnvelopeOpenText className="fs-4 flex-none mt-1" aria-hidden="true" />
              <div>{sent}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
              <div className="mb-4">
                <label className="form-label" htmlFor="email">{t("auth.email")}</label>
                <input id="email" type="email" dir="ltr" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                {loading ? t("auth.sending") : t("auth.sendLink")}
              </button>
            </form>
          )}

          <p className="small mt-4 mb-0"><Link to="/login" className="fw-semibold">{t("auth.backToLogin")}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
