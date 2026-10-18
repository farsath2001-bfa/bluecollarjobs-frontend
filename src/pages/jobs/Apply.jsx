import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { CompanyLogo, EmptyState, Spinner } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { applyToJob, getJobById, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatSalary } from "../../utils/format";

const AVAILABILITY = ["Immediately", "Within 1 week", "Within 2 weeks", "Within 1 month", "After notice period"];

function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    phone: user?.phone || "",
    availableFrom: "Immediately",
    hasUaeVisa: false,
    resume: user?.resume || "",
    coverLetter: "",
  });

  useTitle(job ? `Apply: ${job.title}` : "Apply");

  useEffect(() => {
    getJobById(id)
      .then(({ data }) => setJob(data))
      .catch((err) => setLoadError(errorMessage(err, "This job is no longer available")))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) {
      setError("Enter a phone number the employer can call, e.g. 050 123 4567");
      return;
    }
    try {
      setSubmitting(true);
      await applyToJob(id, form);
      if (!user.phone) updateUser({ phone: form.phone });
      toast("Application sent");
      navigate("/applied", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Your application didn't go through. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading job…" />;

  if (loadError || !job) {
    return (
      <div className="container section">
        <EmptyState title="This job can't take applications" action={<Link to="/jobs" className="btn btn-primary">Browse open jobs</Link>}>
          {loadError}
        </EmptyState>
      </div>
    );
  }

  const pay = formatSalary(job.salary);

  return (
    <div className="container section-tight" style={{ maxWidth: 760 }}>
      <Link to={`/jobs/${id}`} className="btn btn-ghost mb-3 ps-0"><FaArrowLeft /> Back to job</Link>

      <div className="panel mb-3 d-flex gap-3 align-items-center">
        <CompanyLogo logo={job.logo} name={job.companyName} />
        <div className="min-w-0 flex-grow-1">
          <div className="fw-bold fs-5">{job.title}</div>
          <div className="text-steel">{job.companyName} <FaMapMarkerAlt className="ms-2" aria-hidden="true" /> {job.location}</div>
        </div>
        {pay && <span className="salary d-none d-sm-block">{pay}</span>}
      </div>

      <form className="panel" onSubmit={handleSubmit} noValidate>
        <h1 className="h2 mb-1">Apply for this job</h1>
        <p className="text-steel mb-4">Applying as <strong>{user.name}</strong> ({user.email}). The employer will call you on the number below.</p>

        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">Phone / WhatsApp *</label>
            <input id="phone" type="tel" className="form-control" placeholder="050 123 4567" value={form.phone} onChange={set("phone")} required autoComplete="tel" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="avail">When can you start?</label>
            <select id="avail" className="form-select" value={form.availableFrom} onChange={set("availableFrom")}>
              {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
              <input type="checkbox" className="form-check-input m-0" checked={form.hasUaeVisa} onChange={set("hasUaeVisa")} />
              I already have a valid UAE residence or work visa
            </label>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="resume">Link to your CV <span className="text-steel fw-normal">(optional)</span></label>
            <input id="resume" type="url" className="form-control" placeholder="Google Drive or Dropbox link" value={form.resume} onChange={set("resume")} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cover">Message to the employer <span className="text-steel fw-normal">(optional)</span></label>
            <textarea
              id="cover"
              className="form-control"
              rows={4}
              maxLength={1500}
              placeholder="Your experience in this work, licences you hold, languages you speak…"
              value={form.coverLetter}
              onChange={set("coverLetter")}
            />
            <div className="form-text text-end">{form.coverLetter.length}/1500</div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={submitting}>
          {submitting ? "Sending application…" : "Send application"}
        </button>
      </form>
    </div>
  );
}

export default Apply;
