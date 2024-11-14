"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 假設正確密碼為 "123456"，可以改成你的邏輯
    const correctPassword = "123456";
    if (password === correctPassword) {
      // 清空錯誤提示
      setError("");
      // 導航到 /app 頁面
      router.push("/app");
    } else {
      // 顯示錯誤提示
      setError("密碼錯誤，請再試一次");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-black/90"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
