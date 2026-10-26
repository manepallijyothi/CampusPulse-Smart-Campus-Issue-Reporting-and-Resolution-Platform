
import { useEffect, useState, type FormEvent } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  Users,
  Settings,
  Search,
  Bell,
  MapPin,
  Clock,
  CheckCircle2,
  CircleAlert,
  Droplets,
  Wifi,
  Lightbulb,
  Armchair,
  ArrowUpRight,
  Menu,
  X
} from "lucide-react";
import { getIssues, createIssue, type Issue as ApiIssue } from "./services/api";

type IssueStatus = "Pending" | "In Progress" | "Resolved";
type Priority = "High" | "Medium" | "Low";

type Issue = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  icon: string;
  reported: string;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "All Issues", icon: ClipboardList },
  { label: "Report an Issue", icon: Plus },
  { label: "People", icon: Users },
  { label: "Settings", icon: Settings }
];

function mapApiIssue(issue: ApiIssue): Issue {
  const category = issue.category.toLowerCase();

  let icon = "alert";

  if (category.includes("plumb") || category.includes("water")) {
    icon = "water";
  } else if (
    category.includes("it") ||
    category.includes("internet") ||
    category.includes("wifi")
  ) {
    icon = "wifi";
  } else if (category.includes("electric")) {
    icon = "light";
  } else if (category.includes("furniture")) {
    icon = "chair";
  }

  return {
    id: issue._id,
    title: issue.title,
    category: issue.category,
    location: issue.location,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    icon,
    reported: new Date(issue.createdAt).toLocaleString()
  };
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  async function loadIssues() {
    setLoading(true);
    setError("");

    try {
      const result = await getIssues();
      setIssues(result.map(mapApiIssue));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load issues from the server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIssues();
  }, []);

  const pendingCount = issues.filter((issue) => issue.status === "Pending").length;
  const progressCount = issues.filter((issue) => issue.status === "In Progress").length;
  const resolvedCount = issues.filter((issue) => issue.status === "Resolved").length;

  const filteredIssues = issues.filter((issue) => {
    const query = searchText.toLowerCase();

    return (
      issue.title.toLowerCase().includes(query) ||
      issue.category.toLowerCase().includes(query) ||
      issue.location.toLowerCase().includes(query)
    );
  });

  function handleNavigation(label: string) {
    setActivePage(label);
    setMobileMenu(false);
    setNotice("");
    setError("");
    setShowForm(label === "Report an Issue");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    setSubmitting(true);

    try {
      const createdIssue = await createIssue({
        title: title.trim(),
        category,
        location: location.trim(),
        description: description.trim(),
        priority
      });

      setIssues((current) => [mapApiIssue(createdIssue), ...current]);
      setTitle("");
      setCategory("Maintenance");
      setLocation("");
      setDescription("");
      setPriority("Medium");
      setShowForm(false);
      setActivePage("All Issues");
      setNotice("Issue successfully reported and saved!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit the issue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function getIssueIcon(icon: string) {
    switch (icon) {
      case "water":
        return <Droplets size={19} />;
      case "wifi":
        return <Wifi size={19} />;
      case "light":
        return <Lightbulb size={19} />;
      case "chair":
        return <Armchair size={19} />;
      default:
        return <CircleAlert size={19} />;
    }
  }

  function renderIssue(issue: Issue) {
    return (
      <div className="issue-item" key={issue.id}>
        <div className="issue-symbol">{getIssueIcon(issue.icon)}</div>

        <div className="issue-info">
          <p className="issue-title">{issue.title}</p>
          <p className="issue-meta">
            {issue.category} · {issue.id}
          </p>
          <p className="issue-meta">
            <MapPin size={11} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
            {issue.location} · {issue.reported}
          </p>
        </div>

        <div>
          <span
            className={`status-pill ${
              issue.status === "Pending"
                ? "status-pending"
                : issue.status === "In Progress"
                  ? "status-progress"
                  : "status-resolved"
            }`}
          >
            {issue.status}
          </span>
          <p
            className={`issue-meta priority-${issue.priority.toLowerCase()}`}
            style={{ textAlign: "right", marginTop: 8 }}
          >
            {issue.priority} priority
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">C</div>
          <div className="brand-copy">
            <p className="brand-name">CampusPulse</p>
            <p className="brand-caption">A better campus, together.</p>
          </div>
        </div>

        <p className="nav-label">Workspace</p>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${activePage === item.label ? "active" : ""}`}
                onClick={() => handleNavigation(item.label)}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                <span className="nav-text">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <strong>Small fixes, big change.</strong>
            <p>Every report helps make our campus safer, cleaner and better.</p>
          </div>
          <div className="sidebar-footer">CampusPulse · Student Portal</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-menu-button"
              aria-label="Open menu"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="topbar-label">Campus Services / Overview</p>
              <h2 className="topbar-title">{activePage}</h2>
            </div>
          </div>

          <div className="profile-area">
            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() => setNotice("You are all caught up!")}
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="profile-avatar">S</div>
            <div>
              <p className="profile-name">Student User</p>
              <p className="profile-role">Student account</p>
            </div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice-banner" role="status">
              <span>{notice}</span>
              <button aria-label="Dismiss message" onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="notice-banner" role="alert">
              <span>{error}</span>
              <button aria-label="Dismiss error" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {showForm ? (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">Make your voice count</p>
                  <h1 className="page-heading">Report an issue</h1>
                  <p className="page-description">
                    Tell us what needs attention. Clear details help the right team resolve it faster.
                  </p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setShowForm(false);
                    setActivePage("Dashboard");
                  }}
                >
                  Cancel
                </button>
              </div>

              <section className="panel form-panel">
                <form onSubmit={handleSubmit} className="form-grid">
                  <div className="form-field full-width">
                    <label className="form-label" htmlFor="issue-title">Issue title *</label>
                    <input
                      id="issue-title"
                      className="form-control"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. Water leakage near Block A"
                      minLength={5}
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="issue-category">Category *</label>
                    <select
                      id="issue-category"
                      className="form-control"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      required
                    >
                      <option>Maintenance</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>IT Support</option>
                      <option>Sanitation</option>
                      <option>Transport</option>
                      <option>Furniture</option>
                      <option>Academic Facilities</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="issue-location">Location *</label>
                    <input
                      id="issue-location"
                      className="form-control"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Block, floor, room..."
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="form-label" htmlFor="issue-description">Description *</label>
                    <textarea
                      id="issue-description"
                      className="form-control"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Describe the issue and when you noticed it..."
                      minLength={10}
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label className="form-label" htmlFor="issue-priority">Priority</label>
                    <select
                      id="issue-priority"
                      className="form-control"
                      value={priority}
                      onChange={(event) => setPriority(event.target.value as Priority)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <button className="primary-button" type="submit" disabled={submitting}>
                      <Plus size={17} />
                      {submitting ? "Submitting..." : "Submit report"}
                    </button>
                  </div>
                </form>
              </section>
            </>
          ) : (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">Your campus, your community</p>
                  <h1 className="page-heading">
                    {activePage === "Dashboard"
                      ? "Good day, Student!"
                      : activePage === "All Issues"
                        ? "Campus issues"
                        : activePage}
                  </h1>
                  <p className="page-description">
                    {activePage === "Dashboard"
                      ? "Here’s what’s happening around campus. Together, we can make things better."
                      : "Search and keep track of reported campus issues."}
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setShowForm(true);
                    setActivePage("Report an Issue");
                  }}
                >
                  <Plus size={17} /> Report an issue
                </button>
              </div>

              {activePage === "Dashboard" && (
                <section className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-top">
                      <span className="stat-label">Total reports</span>
                      <span className="stat-icon"><ClipboardList size={18} /></span>
                    </div>
                    <p className="stat-value">{issues.length}</p>
                    <p className="stat-footnote">All reports from the database</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span className="stat-label">Pending</span>
                      <span className="stat-icon"><Clock size={18} /></span>
                    </div>
                    <p className="stat-value">{pendingCount}</p>
                    <p className="stat-footnote">Awaiting attention</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span className="stat-label">In progress</span>
                      <span className="stat-icon"><CircleAlert size={18} /></span>
                    </div>
                    <p className="stat-value">{progressCount}</p>
                    <p className="stat-footnote">Being worked on</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span className="stat-label">Resolved</span>
                      <span className="stat-icon"><CheckCircle2 size={18} /></span>
                    </div>
                    <p className="stat-value">{resolvedCount}</p>
                    <p className="stat-footnote">Issues marked resolved</p>
                  </div>
                </section>
              )}

              <section className="content-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">
                        {activePage === "All Issues" ? "All reported issues" : "Recent campus issues"}
                      </h2>
                      <p className="panel-subtitle">Track reports and their current status</p>
                    </div>
                    <button className="text-link" onClick={() => setActivePage("All Issues")}>
                      View all <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div style={{ padding: "14px 20px 4px" }}>
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        aria-label="Search issues"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search title, category or location..."
                      />
                    </div>
                  </div>

                  <div className="issue-list">
                    {loading ? (
                      <div className="empty-state">Loading issues...</div>
                    ) : filteredIssues.length ? (
                      (activePage === "Dashboard" ? filteredIssues.slice(0, 4) : filteredIssues).map(renderIssue)
                    ) : (
                      <div className="empty-state">
                        {error ? "Could not load issues. Check your server." : "No issues found. Report the first campus issue!"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Campus activity</h2>
                      <p className="panel-subtitle">A quick look at recent reports</p>
                    </div>
                  </div>

                  <div className="activity-list">
                    {issues.slice(0, 3).map((issue) => (
                      <div className="activity-item" key={issue.id}>
                        <span className="activity-dot" />
                        <div>
                          <p className="activity-text">
                            <strong>{issue.status}</strong> {issue.title}
                          </p>
                          <p className="activity-time">{issue.reported} · {issue.location}</p>
                        </div>
                      </div>
                    ))}

                    {!loading && issues.length === 0 && (
                      <p className="issue-meta">New campus activity will appear here when reports are submitted.</p>
                    )}
                  </div>

                  <div className="quick-card">
                    <h3>Spotted something?</h3>
                    <p>Report maintenance, sanitation, IT or other campus problems so the right team can take action.</p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        setShowForm(true);
                        setActivePage("Report an Issue");
                      }}
                    >
                      <Plus size={15} /> Create a report
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
