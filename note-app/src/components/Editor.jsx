import React, { useEffect, useRef } from "react";

export default function Editor({
  note,
  onChange,
  onExport,
  onImport,
  onTogglePreview,
}) {
  const titleRef = useRef();

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, [note?.id]);

  if (!note) {
    return <div className="editor-empty">Select or create a note</div>;
  }

  const handleContent = (field, value) => {
    onChange({ ...note, [field]: value, updatedAt: Date.now() });
  };

  return (
    <main className="editor">
      <div className="editor-toolbar">
        <input
          ref={titleRef}
          className="title-input"
          placeholder="Note title..."
          value={note.title}
          onChange={(e) => handleContent("title", e.target.value)}
        />

        <div className="toolbar-actions">
          <button className="btn" onClick={onTogglePreview} title="Toggle preview">Preview</button>
          <button className="btn" onClick={() => onExport(note)} title="Export .md">Export</button>
          <label className="btn upload">
            Import
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
        placeholder="Write Markdown here..."
      />
    </main>
  );
}
