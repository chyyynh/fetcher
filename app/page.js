"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Button } from "@/components/ui/button";
import { Title } from "@radix-ui/react-toast";
// import { useToast } from "@/hooks/use-toast";

export default function Component() {
  // const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [articleData, setArticleData] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchArticleData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setArticleData("");
    setFetched(false);

    try {
      const response = await fetch(`http://localhost:3000/api/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      console.log(response);

      const data = await response.json();

      setTitle(data.res.title);
      console.log(`title:\n\n${title}\n`);

      setArticleData(data.res.content);
      console.log(`content:\n\n${articleData}\n`);

      setFetched(true);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    console.log(`title:\n\n${title}\n`);
    console.log(`content:\n\n${articleData}\n`);
    setUploading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/upload-to-hackmd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: title, content: articleData }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(`上傳成功 HackMD 連結：${data.url}`);
      } else {
        throw new Error(data.message || "上傳失敗");
      }
    } catch (error) {
      console.error("上傳到 HackMD 時出錯:", error);
    } finally {
      setUploading(false);
    }
    console.log("Uploading article...");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* URL Input Section */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <form onSubmit={fetchArticleData} className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              placeholder="Enter article URL"
              required
              className="bg-white text-black hover:bg-white/90 flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-black text-white hover:bg-black/90"
            >
              {loading ? "Fetching..." : "Fetch"}
            </Button>
            {fetched && (
              <Button
                type="button"
                onClick={handleUpload}
                className="bg-black text-white hover:bg-black/90"
              >
                Upload
              </Button>
            )}
          </form>
        </div>

        {/* Editor Section */}
        {fetched && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <div className="flex px-4 py-2">
                <div className="w-1/2 font-medium">Markdown</div>
                <div className="w-1/2 font-medium">Preview</div>
              </div>
            </div>
            <MarkdownEditor
              value={articleData}
              style={{ height: "calc(100vh - 200px)" }}
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={({ text }) => setArticleData(text)}
              className="border-none"
              config={{
                view: {
                  menu: false,
                  md: true,
                  html: true,
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
