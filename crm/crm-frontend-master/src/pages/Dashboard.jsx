import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import LeadNotesPanel from "../components/LeadNotesPanel";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const STATUSES = ["New", "Contacted", "Converted"];

function Dashboard() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      setError(
        err.message.includes("Token") || err.message.includes("token")
          ? "Session expired. Please sign in again."
          : "Unable to load leads. Make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadInList = (updatedLead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/leads/${id}`, { status });
      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? res.data : lead))
      );
      if (selectedLead?._id === id) {
        setSelectedLead(res.data);
      }
      showToast("Status updated", "info");
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const deleteLead = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      if (selectedLead?._id === id) {
        setSelectedLead(null);
      }
      showToast("Lead deleted");
    } catch (err) {
      showToast(err.message || "Failed to delete lead", "error");
    }
  };

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.source.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      contacted: leads.filter((l) => l.status === "Contacted").length,
      converted: leads.filter((l) => l.status === "Converted").length,
      new: leads.filter((l) => l.status === "New").length,
    }),
    [leads]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard__subtitle">
            Welcome back{user?.email ? `, ${user.email}` : ""}. Manage leads and
            track your sales pipeline.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={fetchLeads}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__label">Total Leads</span>
          <span className="stat-card__value">{stats.total}</span>
        </div>
        <div className="stat-card stat-card--new">
          <span className="stat-card__label">New</span>
          <span className="stat-card__value">{stats.new}</span>
        </div>
        <div className="stat-card stat-card--contacted">
          <span className="stat-card__label">Contacted</span>
          <span className="stat-card__value">{stats.contacted}</span>
        </div>
        <div className="stat-card stat-card--converted">
          <span className="stat-card__label">Converted</span>
          <span className="stat-card__value">{stats.converted}</span>
        </div>
      </div>

      <div className="table-panel">
        <div className="table-toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, email, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="state-message">
            <div className="spinner" />
            <p>Loading leads...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-message state-message--error">
            <p>{error}</p>
            <button type="button" className="btn btn--secondary" onClick={fetchLeads}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredLeads.length === 0 && (
          <div className="state-message">
            <p>
              {leads.length === 0
                ? "No leads yet. Submit one from the contact form."
                : "No leads match your search."}
            </p>
          </div>
        )}

        {!loading && !error && filteredLeads.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="cell-name">{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>
                      <span className="source-tag">{lead.source}</span>
                    </td>
                    <td>
                      <div className="status-cell">
                        <StatusBadge status={lead.status} />
                        <select
                          className="status-select"
                          value={lead.status}
                          onChange={(e) =>
                            updateStatus(lead._id, e.target.value)
                          }
                          aria-label={`Update status for ${lead.name}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-notes"
                        onClick={() => setSelectedLead(lead)}
                      >
                        Notes
                        {(lead.notes?.length ?? 0) > 0 && (
                          <span className="btn-notes__count">
                            {lead.notes.length}
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="cell-date">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => deleteLead(lead._id, lead.name)}
                        aria-label={`Delete ${lead.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadNotesPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={updateLeadInList}
        />
      )}
    </div>
  );
}

export default Dashboard;
