import React, { useState } from "react";

export default function EmailForm() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:5000/api/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", text: `Success! Job ID: ${data.jobId}` });
        setFormData({ to: "", subject: "", body: "" });
      } else {
        setStatus({
          type: "error",
          text: data.message || "Something went wrong",
        });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Failed to connect to API server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Dispatch Queue Email</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Recipient Email:
          </label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Subject:
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Message Body:
          </label>
          <textarea
            name="body"
            rows="4"
            value={formData.body}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Queueing..." : "Send Email"}
        </button>
      </form>

      {status && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "4px",
            backgroundColor: status.type === "success" ? "#d4edda" : "#f8d7da",
            color: status.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}
