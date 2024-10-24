"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [url, setUrl] = useState("");
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchArticleData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setArticleData(null);

    try {
      const response = await fetch(`http://localhost:3000/api/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log(data.res);
      setArticleData(data.res);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Article Fetcher
          </CardTitle>
          <CardDescription className="text-center">
            Enter a URL to fetch and display an article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={fetchArticleData}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              placeholder="Enter article URL"
              required
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Fetching...
                </>
              ) : (
                "Fetch Article"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {articleData && (
        <Card>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{articleData}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
