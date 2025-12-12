import React, { useEffect, useMemo, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { loadNotes, saveNotes } from "./utils/storage";

import TextType from './utils/TextType';



export default function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(() => (notes[0]?.id ?? null));
  const [query, setQuery] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  // keep notes saved to localStorage (debounced-ish using effect)
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // ensure activeId valid when notes change
  useEffect(() => {
    if (!activeId && notes.length) setActiveId(notes[0].id);
    if (activeId && !notes.some(n => n.id === activeId)) {
      setActiveId(notes[0]?.id ?? null);
    }
  }, [notes, activeId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes.slice().sort((a,b)=>b.updatedAt-a.updatedAt);
    return notes
      .filter(n => (n.title + " " + n.content).toLowerCase().includes(q))
      .sort((a,b)=>b.updatedAt-a.updatedAt);
  }, [notes, query]);

  const activeNote = notes.find(n => n.id === activeId) ?? null;

  // create a new note
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
  }, []);

  // update note in notes array
  const updateNote = useCallback((updated) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === updated.id);
      if (idx === -1) return [updated, ...prev];
      const copy = prev.slice();
      copy[idx] = updated;
      // move updated note to top
      copy.splice(idx, 1);
      return [updated, ...copy];
    });
  }, []);

  const deleteNote = useCallback((id) => {
    if (!confirm("Delete this note?")) return;
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const exportNote = useCallback((note) => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (note.title || "note") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importContent = useCallback((text) => {
    // Put imported text into the active note (or create one)
    if (!activeNote) {
      const n = {
        id: uuidv4(),
        title: "",
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

  // keyboard shortcuts: Ctrl/Cmd+S to save (no-op because autosave), Ctrl/Cmd+N to add
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // maybe flash saved state
        // not required — localStorage autosaves
        console.info("Saved");
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        addNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addNote]);

  return (
    <div className="app-shell">
      
      <TextType 
        text={["Welcome to Note App!", "Create and manage your notes with ease."," Enjoy writing!"," Stay organized!"]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|"
      />

      <Sidebar
        notes={filtered}
        activeId={activeId}
        onAdd={addNote}
        onSelect={setActiveId}
        onDelete={deleteNote}
        onSearch={setQuery}
      />

      <div className="main-area">
        <Editor
          note={activeNote}
          onChange={updateNote}
          onExport={exportNote}
          onImport={importContent}
          onTogglePreview={() => setShowPreview(s => !s)}
        />
        {showPreview && <Preview content={activeNote?.content || ""} />}
      </div>
    </div>
  );
}
