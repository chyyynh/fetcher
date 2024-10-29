// components/ui/MarkdownEditor.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* 編輯區 */}
      <textarea
        style={{ width: "50%", height: "400px" }}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="在此輸入 Markdown"
      />

      {/* 預覽區 */}
      <div style={{ width: "50%", padding: "10px", border: "1px solid #ddd" }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
