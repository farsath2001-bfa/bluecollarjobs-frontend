
// import React from "react";
// function Contact() {
//   return (
//     <div className="container py-5">
//       <h1>Contact Us</h1>

//       <p>Email: support@jobzdxb.com</p>
//       <p>Phone: +971 XX XXX XXXX</p>
//       <p>Location: Dubai, UAE</p>

//       <form>
//         <input
//           type="text"
//           className="form-control mb-3"
//           placeholder="Name"
//         />

//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Email"
//         />

//         <textarea
//           className="form-control mb-3"
//           rows="5"
//           placeholder="Message"
//         ></textarea>

//         <button className="btn btn-primary">
//           Send Message
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Contact;  

import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just show a success message
    // Later you can connect this to a backend /api/contact route
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>

      {/* Hero Banner */}
      <div style={{ backgroundColor: "#5a7296", padding: "60px 0" }}
        className="text-white text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="lead">We'd love to hear from you</p>
      </div>

      <div className="container pb-5">
        <div className="row g-4 justify-content-center">

          {/* Contact Info */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "16px" }}>
              <h5 className="fw-bold mb-4">Get in Touch</h5>

              <div className="d-flex align-items-start mb-3">
                <span className="fs-5 me-3">📧</span>
                <div>
                  <strong>Email</strong>
                  <p className="text-muted small mb-0">support@jobzdxb.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <span className="fs-5 me-3">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p className="text-muted small mb-0">+971 XX XXX XXXX</p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <span className="fs-5 me-3">📍</span>
                <div>
                  <strong>Location</strong>
                  <p className="text-muted small mb-0">Dubai, UAE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-7">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
              <h5 className="fw-bold mb-4">Send a Message</h5>

              {sent && (
                <div className="alert alert-success py-2">
                  ✅ Message sent! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  className="form-control mb-3"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  className="form-control mb-3"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="message"
                  className="form-control mb-3"
                  rows="5"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>

                <button type="submit" className="btn btn-primary fw-bold px-4">
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;