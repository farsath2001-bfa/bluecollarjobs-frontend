import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../service/api";

function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await loginUser({ email, password });
       console.log("✅ RESPONSE FROM BACKEND:", data); 

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);

      if (data.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
        console.log("❌ ERROR:", err.response); 
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4 border-0">
            <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>

            <form onSubmit={handleLogin}>

              {error && (
                <div className="alert alert-danger py-2 text-center">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showPasswordCheck"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label text-muted" htmlFor="showPasswordCheck">
                  Show Password
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <hr className="my-4" />

            <div className="text-center">
              <p className="mb-2 small">
                Don't have an account?{" "}
                <Link to="/register" className="fw-bold text-decoration-none text-primary">
                  Register
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;