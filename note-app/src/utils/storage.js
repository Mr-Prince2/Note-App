const KEY = "notes_app_v1";// Key for localStorage

export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY);// Retrieve raw data from localStorage
    if (!raw) return [];// Return empty array if no data found
    return JSON.parse(raw);// Parse and return notes
  } catch (e) {
    console.error("Failed to load notes:", e);// Log error if parsing fails
    return [];// Return empty array on error
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));// Serialize and save notes to localStorage
  } catch (e) {
    console.error("Failed to save notes:", e);// Log error if saving fails
  }
}
