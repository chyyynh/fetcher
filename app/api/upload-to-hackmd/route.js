import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json(
      { message: "標題和內容都是必需的" },
      { status: 400 }
    );
  }

  try {
    // HackMD API 端點
    const hackmdApiUrl = "https://api.hackmd.io/v1/teams/funblocks/notes";

    // 確保在環境變量中設置了 HackMD API Token
    const hackmdApiToken = process.env.HACKMD_API_TOKEN;

    if (!hackmdApiToken) {
      throw new Error("HACKMD_API_TOKEN 未設置");
    }

    const response = await fetch(hackmdApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hackmdApiToken}`,
      },
      body: JSON.stringify({
        title: title,
        content: content,
        readPermission: "guest",
        writePermission: "owner",
      }),
    });

    if (!response.ok) {
      throw new Error(`HackMD API 響應狀態碼 ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ url: `https://hackmd.io/${data.id}` });
  } catch (error) {
    console.error("上傳到 HackMD 時出錯:", error);
    return NextResponse.json(
      { message: "上傳到 HackMD 失敗" },
      { status: 500 }
    );
  }
}
