import axios from "axios";
import * as cheerio from "cheerio";

const AZURE_API_URL = "https://api.cognitive.microsofttranslator.com";
const AZURE_API_KEY = process.env.AZURE_API_KEY;

export async function POST(req) {
  const { url } = await req.json();
  console.log("Received URL:", url);
  const res = await fetchArticleContent(url);
  return new Response(JSON.stringify({ res }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function translateWithAzure(text) {
  const url = `${AZURE_API_URL}/translate?api-version=3.0&from=en&to=zh-Hant`;
  try {
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
        "Ocp-Apim-Subscription-Region": "eastasia", // 必須設定
        "Content-Type": "application/json",
      },
      data: [
        {
          Text: text,
        },
      ],
    });

    const translation = response.data[0].translations[0].text;
    console.log(`翻譯結果: ${translation} \n`);
    return translation;
  } catch (error) {
    console.error("翻譯失敗:", error);
    return null;
  }
}

async function fetchArticleContent(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Create an array to hold the mixed content (text and images)
    const contentArray = [];

    // Get the title and convert to Markdown header
    const title = $("title").text();
    const Title = `# ${title} ${await translateWithAzure(title)} \n\n`; // Markdown 標題

    const articleLink = `原文連結: ${url} \n\n`;

    // 抓取所有段落和圖片，按出現順序加入
    const elements = $("p, img"); // 將選取的元素儲存到一個變數中
    for (let element of elements) {
      if ($(element).is("p")) {
        contentArray.push($(element).text());
        const translatedText = await translateWithAzure($(element).text());
        console.log(translatedText);
        contentArray.push(translatedText);
      } else if ($(element).is("img")) {
        if (
          !$(element).hasClass("social-image") &&
          !$(element).hasClass("navbar-logo") &&
          !$(element).hasClass("_1sjywpl0 bc5nci19k bc5nci4t0 bc5nci4ow") // mirror pfp
        ) {
          let imgSrc = $(element).attr("src");
          const imgId = $(element).attr("id");
          const imgAlt = $(element).attr("alt");

          // 處理相對路徑
          if (imgSrc && !imgSrc.startsWith("http")) {
            imgSrc = new URL(imgSrc, url).href; // 將相對路徑轉換為絕對路徑
          }

          if (imgSrc) {
            contentArray.push(`![Image](${imgSrc})`); // Markdown 格式圖片
          }
        }
      }
    }

    // 將混合的內容用兩個換行符號分隔，組織成 Markdown 格式
    const fullContent = `${Title}${articleLink}${contentArray.join("\n\n")}`;

    // 返回最終的 Markdown 內容
    return { title: Title, content: fullContent };
  } catch (error) {
    console.error("抓取失敗:", error);
  }
}
