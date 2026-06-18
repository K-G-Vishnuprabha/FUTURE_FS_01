import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../components/Toast";
import "./ContactForm.css";

const SOURCES = ["Website", "LinkedIn", "Facebook", "Referral", "Other"];

function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    source: "Website",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/leads", form);
      showToast("Lead submitted successfully!");
      setForm({ name: "", email: "", source: "Website" });
    } catch {
      showToast("Failed to submit lead. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__content">
          <span className="contact-hero__tag">Lead Capture</span>
          <h1>Grow your pipeline with every conversation</h1>
          <p>
            Submit your details and our team will follow up within one business
            day. Track every lead from first touch to conversion.
          </p>
          <Link to="/login" className="contact-hero__link">
            Admin login &rarr;
          </Link>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-card">
          <div className="contact-card__header">
            <h2>Get in touch</h2>
            <p>Fill out the form and we&apos;ll reach out shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="source">How did you hear about us?</label>
              <select
                id="source"
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                {SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Lead"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactForm;
