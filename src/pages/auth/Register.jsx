import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../service/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker"
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await registerUser(form);

      console.log("✅ Register success:", data);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);

      if (data.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
      console.log("❌ Register error:", err.response);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Register</h2>

            <form onSubmit={handleSubmit}>

              {error && (
                <div className="alert alert-danger py-2 text-center">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>

            </form>

            <div className="text-center mt-3">
              <p className="small mb-0">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-decoration-none">
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;