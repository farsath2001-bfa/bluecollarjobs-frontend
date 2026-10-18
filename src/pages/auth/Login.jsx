import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTitle } from "../../utils/useTitle";
import sideImage from "../../assets/Images/hero-construction.jpg";

function Login() {
  useTitle("Log in");
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
      setError("Enter your email and password");
      return;
    }
    try {
      setLoading(true);
      const { data } = await loginUser({ email, password });
      saveSession(data);
      toast(`Welcome back, ${data.name.split(" ")[0]}`);
      navigate(from && data.role !== "admin" ? from : data.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Email or password is incorrect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side" style={{ backgroundImage: `url(${sideImage})` }}>
        <div>
          <h2>Your next job is one application away</h2>
          <p>Log in to apply, save jobs and see when employers respond.</p>
        </div>
      </div>

      <div className="auth-form">
        <div>
          <h1 className="h2 mb-1">Log in</h1>
          <p className="text-steel mb-4">
            New here? <Link to="/register" state={{ from }} className="fw-semibold">Create a free account</Link>
          </p>

          {from && <div className="alert alert-info py-2">Log in to continue.</div>}
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="small text-steel mt-4 mb-0">
            Forgot your password? <Link to="/contact?subject=Password%20reset">Contact support</Link> and we'll reset it for you.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
