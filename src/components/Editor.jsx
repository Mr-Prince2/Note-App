import React, { useEffect, useRef, useMemo } from "react";

export default function Editor({
  note,
  onChange,
  onExport,
  onImport,
  onTogglePreview,
  showPreview,
  onToggleMobileSidebar,
  isSaving,
}) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current && note?.id) {
      // Focus title if note is empty
      if (!note.title) {
        titleRef.current.focus();
      }
    }
  }, [note?.id]);

  const stats = useMemo(() => {
    if (!note || !note.content) return { words: 0, chars: 0, readingTime: 0 };
    const text = note.content.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const readingTime = Math.ceil(words / 200); // 200 wpm average
    return { words, chars, readingTime };
  }, [note?.content]);

  if (!note) {
    return (
      <main className="editor editor-empty-container">
        <div className="editor-empty">
          <div className="empty-icon">📝</div>
          <h2>No Note Selected</h2>
          <p>Select a note from the sidebar or create a new one to start writing.</p>
        </div>
      </main>
    );
  }

  const handleContent = (field, value) => {
    onChange({ ...note, [field]: value, updatedAt: Date.now() });
  };

  return (
    <main className="editor">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button
            className="btn btn-icon mobile-menu-toggle"
            onClick={onToggleMobileSidebar}
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <input
            ref={titleRef}
            className="title-input"
            placeholder="Note title..."
            value={note.title}
            onChange={(e) => handleContent("title", e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <div className={`save-badge ${isSaving ? "saving" : "saved"}`} title="Autosave status">
            <span className="badge-dot"></span>
            <span className="badge-text">{isSaving ? "Saving..." : "Saved"}</span>
          </div>

          <button
            className={`btn ${showPreview ? "btn-active" : ""}`}
            onClick={onTogglePreview}
            title="Toggle split markdown preview"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="btn-label">Preview</span>
          </button>

          <button
            className="btn"
            onClick={() => onExport(note)}
            title="Export as Markdown (.md)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="btn-label">Export</span>
          </button>

          <label className="btn upload" title="Import Markdown or Text file">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span className="btn-label">Import</span>
            <input
              type="file"
              accept=".md,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  onImport(reader.result);
                };
                reader.readAsText(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <textarea
        className="content-input"
        value={note.content}
        onChange={(e) => handleContent("content", e.target.value)}
        placeholder="Write Markdown notes here... (e.g. # Title, **bold**, - list items)"
      />

      <div className="editor-footer">
        <div className="editor-stats">
          <span>{stats.words} {stats.words === 1 ? "word" : "words"}</span>
          <span className="stat-divider">•</span>
          <span>{stats.chars} {stats.chars === 1 ? "character" : "characters"}</span>
          <span className="stat-divider">•</span>
          <span>~{stats.readingTime} min read</span>
        </div>
        <div className="editor-timestamp">
          Last edited {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </main>
  );
}
