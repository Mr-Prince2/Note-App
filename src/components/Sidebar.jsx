import React from "react";

export default function Sidebar({
  notes,
  activeId,
  onAdd,
  onSelect,
  onDelete,
  onSearch,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1></h1>
        <div>
          <button className="btn" onClick={onAdd} title="Add note">➕</button>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search notes..."
        onChange={(e) => onSearch(e.target.value)}
      />

      <ul className="note-list">
        {notes.length === 0 && <li className="empty">No notes</li>} 
        {notes.map((n) => (
          <li
            key={n.id} // Unique key for each note
            className={`note-item ${n.id === activeId ? "active" : ""}`} // Highlight active note
            onClick={() => onSelect(n.id)}// Select note on click
          >
            <div className="note-title">
              {n.title || "Untitled"}
            </div>
            <div className="note-meta">
              <small>{new Date(n.updatedAt).toLocaleString()}</small>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();// Prevent triggering onSelect
                  onDelete(n.id);// Delete note on click
                }}
                title="Delete note"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
