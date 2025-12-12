import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Preview({ content }) {
  return (
    <aside className="preview">
      <div className="preview-inner">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || "_Nothing to preview_"}
        </ReactMarkdown>
      </div>
    </aside>
  );
}
