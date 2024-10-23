"use client"; // 告訴 Next.js 這個組件應該是客戶端組件

import { useState } from "react";
import ReactMarkdown from "react-markdown"; // 導入 react-markdown

export default function Home() {
  const [url, setUrl] = useState("");
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(false);

  // console.log(url);

  const fetchArticleData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setArticleData(null);

    try {
      const response = await fetch(`http://localhost:3000/api/`, {
        method: "POST", // 指定請求方法為 POST
        headers: {
          "Content-Type": "application/json", // 設置內容類型為 JSON
        },
        body: JSON.stringify({ url }), // 將 URL 封裝為 JSON 字符串
      });

      const data = await response.json();
      console.log(data.res); // 打印出 API 返回的數據
      setArticleData(data.res);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Article Fetcher</h1>{" "}
      {/* 標題置中 */}
      <form
        onSubmit={fetchArticleData}
        className="flex justify-center items-center mb-4"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())} // 去掉多餘空格
          placeholder="Enter article URL"
          required
          className="border rounded p-2 w-64 mr-2" // Tailwind CSS 樣式
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Fetch Article
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {articleData && (
        <div>
          <ReactMarkdown>{articleData}</ReactMarkdown>{" "}
          {/* 渲染 Markdown 內容 */}
        </div>
      )}
    </div>
  );
}
