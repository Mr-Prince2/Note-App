import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Preview({ content }) {
  return (
    <aside className="preview">
      <div className="preview-header">
        <span className="preview-title">Preview</span>
        <span className="preview-badge">Markdown</span>
      </div>
      <div className="preview-inner">
        {content && content.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        ) : (
          <div className="preview-empty">
            <p><em>Nothing to preview yet...</em></p>
            <small>Start typing Markdown in the editor to see live rendering here!</small>
          </div>
        )}
      </div>
    </aside>
  );
}
