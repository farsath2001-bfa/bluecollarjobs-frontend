import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTitle } from "../../utils/useTitle";
import { useT } from "../../context/LanguageContext";
import sideImage from "../../assets/Images/hero-construction.jpg";

function Login() {
  const t = useT();
  useTitle(t("auth.loginTitle"));
  const { user, loginUser: saveSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("auth.errLogin"));
      return;
    }
    try {
      setLoading(true);
      const { data } = await loginUser({ email, password });
      saveSession(data);
      toast(t("auth.welcomeBack", { name: data.name.split(" ")[0] }));
      navigate(from && data.role !== "admin" ? from : data.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err, t("auth.errLoginFailed")));
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
          <h1 className="h2 mb-1">{t("auth.loginTitle")}</h1>
          <p className="text-steel mb-4">
            {t("auth.newHere")} <Link to="/register" state={{ from }} className="fw-semibold">{t("auth.createFree")}</Link>
          </p>

          {from && <div className="alert alert-info py-2">{t("auth.continue")}</div>}
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">{t("auth.email")}</label>
              <input id="email" type="email" dir="ltr" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="password">{t("auth.password")}</label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control pe-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
            </div>

            <div className="mb-4 text-end">
              <Link to="/forgot-password" state={{ email }} className="small fw-semibold">{t("auth.forgot")}</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? t("auth.loggingIn") : t("auth.loginTitle")}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
