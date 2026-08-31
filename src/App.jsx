import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import ConfirmModal from "./components/ConfirmModal";
import { loadNotes, saveNotes } from "./utils/storage";

export default function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(() => (notes[0]?.id ?? null));
  const [query, setQuery] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const saveTimeoutRef = useRef(null);

  // Debounced autosave to LocalStorage
  useEffect(() => {
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(notes);
      setIsSaving(false);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [notes]);

  // Ensure activeId is valid when notes change
  useEffect(() => {
    if (!activeId && notes.length) {
      setActiveId(notes[0].id);
    } else if (activeId && !notes.some(n => n.id === activeId)) {
      setActiveId(notes[0]?.id ?? null);
    }
  }, [notes, activeId]);

  // Filter notes based on query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    return notes
      .filter(n => (n.title + " " + n.content).toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, query]);

  const activeNote = notes.find(n => n.id === activeId) ?? null;

  // Create a new note
  const addNote = useCallback(() => {
    const newNote = {
      id: uuidv4(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
    setQuery("");
  }, []);

  // Update note in notes state
  const updateNote = useCallback((updated) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === updated.id);
      if (idx === -1) return [updated, ...prev];
      const copy = prev.slice();
      copy[idx] = updated;
      copy.splice(idx, 1);
      return [updated, ...copy];
    });
  }, []);

  // Request note deletion confirmation
  const handleDeleteRequest = useCallback((id) => {
    setDeleteTargetId(id);
  }, []);

  // Execute deletion after modal confirmation
  const confirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    setNotes(prev => prev.filter(n => n.id !== deleteTargetId));
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  // Export note as Markdown
  const exportNote = useCallback((note) => {
    const safeTitle = (note.title || "note").trim().replace(/[^a-z0-9_\-\s]/gi, "_");
    const blob = new Blob([`# ${note.title || "Untitled Note"}\n\n${note.content}`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Import text/markdown file content
  const importContent = useCallback((text) => {
    if (!activeNote) {
      const n = {
        id: uuidv4(),
        title: "Imported Note",
        content: text,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes(prev => [n, ...prev]);
      setActiveId(n.id);
    } else {
      updateNote({ ...activeNote, content: text, updatedAt: Date.now() });
    }
  }, [activeNote, updateNote]);

  // Keyboard shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+N)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveNotes(notes);
        setIsSaving(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        addNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addNote, notes]);

  return (
    <div className="app-shell">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        notes={filtered}
        activeId={activeId}
        onAdd={addNote}
        onSelect={setActiveId}
        onDelete={handleDeleteRequest}
        onSearch={setQuery}
        searchQuery={query}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-area">
        <Editor
          note={activeNote}
          onChange={updateNote}
          onExport={exportNote}
          onImport={importContent}
          onTogglePreview={() => setShowPreview(s => !s)}
          showPreview={showPreview}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          isSaving={isSaving}
        />
        {showPreview && <Preview content={activeNote?.content || ""} />}
      </div>

      {/* Glassmorphism Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
