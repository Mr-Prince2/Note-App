# 📝 Note App — Modern Markdown Editor & Workspace

A sleek, fast, and responsive Markdown note-taking web application built with **React 19**, **Vite**, **GSAP**, and **LocalStorage** persistence.

![Note App Preview](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-34D399)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- ⚡ **Real-time Live Markdown Preview**: Instant split-pane Markdown rendering with support for GitHub Flavored Markdown (tables, task lists, code blocks, blockquotes, and links).
- 💾 **Debounced LocalStorage Autosave**: Automatic background saving (300ms debounce) with a live visual save status badge (`Saving...` ➔ `Saved`).
- 🎨 **Glassmorphism Dark Theme**: Modern UI styled with translucent panels, smooth backdrop blurs, glow effects, and custom scrollbars.
- 📱 **Fully Mobile Responsive**: Slide-out sidebar drawer navigation with backdrop overlay for smaller screens (`< 900px`).
- 📊 **Live Editor Statistics**: Real-time word count, character count, estimated reading time, and formatted last edited timestamp.
- 📁 **Import & Export**: Seamlessly import existing `.md` or `.txt` files, and export notes as sanitized `.md` files.
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl` / `Cmd` + `N`: Create a new note
  - `Ctrl` / `Cmd` + `S`: Manual save trigger
  - `Escape`: Close modals and drawers
- 🗑️ **Glassmorphism Confirmation Modal**: Custom styled modal for safe note deletion instead of native browser prompts.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **React 19** | Core UI library & hooks |
| **Vite 7** | Next-generation frontend build tool |
| **GSAP** | Animated typing text headers (`TextType`) |
| **React Markdown & Remark GFM** | Markdown parsing & GitHub Flavored Markdown rendering |
| **UUID (v4)** | Unique note identifier generation |
| **Vanilla CSS** | Glassmorphism design system & responsive layout |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mr-Prince2/Note-App.git
   cd Note-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

---

## 📂 Project Structure

```text
Note-App/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── Editor.jsx      # Markdown editor & stats toolbar
│   │   ├── Preview.jsx     # Live Markdown split preview
│   │   ├── Sidebar.jsx     # Note list, search & mobile drawer
│   │   └── ConfirmModal.jsx# Delete confirmation dialog
│   ├── utils/
│   │   ├── storage.js      # LocalStorage helper methods
│   │   ├── TextType.jsx    # GSAP typing text animation
│   │   └── TextType.css    # Typing component styles
│   ├── App.jsx             # Main application shell & state logic
│   ├── Styles.css          # Glassmorphism design tokens & styles
│   └── main.jsx            # React root entry point
├── index.html              # HTML entry point with Google Fonts
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite build configuration
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
