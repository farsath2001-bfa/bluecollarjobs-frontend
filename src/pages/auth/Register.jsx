import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTitle } from "../../utils/useTitle";
import sideImage from "../../assets/Images/hero-warehouse.jpg";

function Register() {
  useTitle("Create account");
  const { user, loginUser: saveSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const from = useLocation().state?.from;

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Fill in your name, email and a password");
      return;
    }
    if (form.password.length < 6) {
      setError("Use a password with at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const { data } = await registerUser(form);
      saveSession(data);
      toast("Account created");
      navigate(from || "/jobs", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Your account couldn't be created. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side" style={{ backgroundImage: `url(${sideImage})` }}>
        <div>
          <h2>Free for job seekers. Always.</h2>
          <p>Create your account once, then apply to any job in under a minute.</p>
        </div>
      </div>

      <div className="auth-form">
        <div>
          <h1 className="h2 mb-1">Create your account</h1>
          <p className="text-steel mb-4">
            Already registered? <Link to="/login" state={{ from }} className="fw-semibold">Log in</Link>
          </p>

          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" className="form-control" value={form.name} onChange={set("name")} autoComplete="name" required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" placeholder="name@example.com" value={form.email} onChange={set("email")} autoComplete="email" required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="phone">Phone / WhatsApp <span className="text-steel fw-normal">(optional)</span></label>
              <input id="phone" type="tel" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} autoComplete="tel" />
              <div className="form-text">Employers use this to call you about your applications.</div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="form-text">At least 6 characters.</div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="small text-steel mt-4 mb-0">Are you an employer? <Link to="/contact?subject=Post%20a%20job">Talk to us about posting jobs</Link>.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
