
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { createIssue, IssuePriority } from "../services/api";

export default function ReportIssues() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    priority: "Medium" as IssuePriority
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const issue = await createIssue(formData);

      setMessage(`Issue reported successfully! Reference ID: ${issue._id}`);

      setFormData({
        title: "",
        category: "",
        location: "",
        description: "",
        priority: "Medium"
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to report your issue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d9dfd5",
    borderRadius: "8px",
    background: "#fffef9",
    color: "#263629",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#285c43"
  };

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "28px 20px",
        color: "#263629"
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            color: "#66816d",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            marginBottom: "8px"
          }}
        >
          CAMPUSPULSE / REPORT AN ISSUE
        </p>

        <h1 style={{ fontSize: "30px", margin: "0 0 10px" }}>
          Something needs fixing?
        </h1>

        <p style={{ color: "#68756a", lineHeight: 1.6, margin: 0 }}>
          Tell us what happened and where. Your campus team can work on
          getting it resolved.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fffdf5",
          border: "1px solid #e6e4d6",
          borderRadius: "14px",
          padding: "24px",
          display: "grid",
          gap: "20px"
        }}
      >
        <div>
          <label htmlFor="title" style={labelStyle}>
            Issue title *
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Water cooler not working"
            maxLength={150}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category" style={labelStyle}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select a category</option>
            <option value="Sanitation">Sanitation & Cleanliness</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Electrical">Electrical</option>
            <option value="Internet / IT">Internet / IT Support</option>
            <option value="Classroom">Classroom & Furniture</option>
            <option value="Transport">Transport</option>
            <option value="Academic Facilities">Academic Facilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" style={labelStyle}>
            Campus location *
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Block A, 2nd floor"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description" style={labelStyle}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue and any details that may help..."
            rows={5}
            maxLength={2000}
            required
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.6
            }}
          />
        </div>

        <div>
          <label htmlFor="priority" style={labelStyle}>
            Suggested priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <p style={{ color: "#788276", fontSize: "12px", marginBottom: 0 }}>
            Choose the priority that best describes the issue.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#fff0ed",
              color: "#a33324",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              overflowWrap: "anywhere"
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div
            role="status"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#eaf5e9",
              color: "#285c43",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              overflowWrap: "anywhere"
            }}
          >
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            width: "100%",
            padding: "13px",
            background: loading ? "#8aa294" : "#285c43",
            color: "#ffffff",
            border: "none",
            borderRadius: "9px",
            fontWeight: 700,
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          <Send size={17} />
          {loading ? "Submitting..." : "Submit issue"}
        </button>
      </form>
    </div>
  );
}
