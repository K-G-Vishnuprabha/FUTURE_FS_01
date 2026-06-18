import { useEffect, useState } from "react";
import API from "../services/api";
import StatusBadge from "./StatusBadge";
import { useToast } from "./Toast";
import "./LeadNotesPanel.css";

function LeadNotesPanel({ lead, onClose, onUpdate }) {
  const { showToast } = useToast();
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState(lead?.notes || []);

  useEffect(() => {
    setNotes(lead?.notes || []);
    setNoteText("");
  }, [lead]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!lead) return null;

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post(`/leads/${lead._id}/note`, {
        text: noteText.trim(),
      });
      setNotes(res.data.notes);
      onUpdate(res.data);
      setNoteText("");
      showToast("Note added");
    } catch (err) {
      showToast(err.message || "Failed to add note", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="notes-overlay" onClick={onClose} role="presentation">
      <aside
        className="notes-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="notes-panel-title"
      >
        <header className="notes-panel__header">
          <div>
            <h2 id="notes-panel-title">{lead.name}</h2>
            <p className="notes-panel__email">{lead.email}</p>
          </div>
          <button
            type="button"
            className="notes-panel__close"
            onClick={onClose}
            aria-label="Close notes panel"
          >
            &times;
          </button>
        </header>

        <div className="notes-panel__meta">
          <StatusBadge status={lead.status} />
          <span className="notes-panel__source">{lead.source}</span>
        </div>

        <div className="notes-panel__body">
          <h3>Notes ({notes.length})</h3>

          {notes.length === 0 ? (
            <p className="notes-panel__empty">No notes yet. Add the first one below.</p>
          ) : (
            <ul className="notes-list">
              {[...notes].reverse().map((note, index) => (
                <li key={note._id || index} className="notes-list__item">
                  <p>{note.text}</p>
                  <time dateTime={note.createdAt}>
                    {new Date(note.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="notes-panel__form" onSubmit={handleAddNote}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note about this lead..."
            rows={3}
            required
          />
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || !noteText.trim()}
          >
            {submitting ? "Adding..." : "Add Note"}
          </button>
        </form>
      </aside>
    </div>
  );
}

export default LeadNotesPanel;
