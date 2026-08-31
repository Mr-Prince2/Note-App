import React from "react";
import TextType from "../utils/TextType";

export default function Sidebar({
  notes,
  activeId,
  onAdd,
  onSelect,
  onDelete,
  onSearch,
  searchQuery,
  isOpenMobile,
  onCloseMobile,
}) {
  return (
    <aside className={`sidebar ${isOpenMobile ? "open-mobile" : ""}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <span className="logo-icon">📝</span>
          <h1 className="brand-title">
            <TextType
              text={["Note App", "Write in MD", "Stay Organized"]}
              typingSpeed={70}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="|"
            />
          </h1>
        </div>

        <div className="sidebar-header-actions">
          <button
            className="btn btn-icon"
            onClick={onAdd}
            title="Create new note (Ctrl+N)"
            aria-label="Add new note"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          {onCloseMobile && (
            <button
              className="btn btn-icon mobile-close-btn"
              onClick={onCloseMobile}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="search-container">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          className="search"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => onSearch("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <ul className="note-list">
        {notes.length === 0 && (
          <li className="empty-state">
            {searchQuery ? "No matching notes found" : "No notes yet. Click '+' to create one!"}
          </li>
        )}

        {notes.map((n) => (
          <li
            key={n.id}
            tabIndex={0}
            role="button"
            className={`note-item ${n.id === activeId ? "active" : ""}`}
            onClick={() => {
              onSelect(n.id);
              if (onCloseMobile) onCloseMobile();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(n.id);
                if (onCloseMobile) onCloseMobile();
              }
            }}
          >
            <div className="note-item-main">
              <div className="note-title">
                {n.title.trim() || "Untitled Note"}
              </div>
              <div className="note-preview-text">
                {n.content.trim().slice(0, 60) || "Empty note..."}
              </div>
            </div>

            <div className="note-meta">
              <small className="note-date">
                {new Date(n.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </small>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                title="Delete note"
                aria-label="Delete note"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
