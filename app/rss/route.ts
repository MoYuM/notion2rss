import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import RSS from "rss";

const client = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET() {
  if (!process.env.NOTION_DATABASE_ID) {
    return new NextResponse("Notion database ID is not set", { status: 500 });
  }

  if (!process.env.NOTION_TOKEN) {
    return new NextResponse("Notion token is not set", { status: 500 });
  }

  if (!process.env.BASE_URL) {
    return new NextResponse("Base URL is not set", { status: 500 });
  }

  const title = process.env.TITLE || "title";
  const language = process.env.LANGUAGE || "zh-CN";

  const response = await client.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  // 创建 RSS feed
  const feed = new RSS({
    title,
    language,
    feed_url: `${process.env.BASE_URL}/rss`,
    site_url: process.env.BASE_URL,
    pubDate: new Date(),
  });

  response.results.forEach((page: any) => {
    const title = page.properties["名称"].title[0]?.plain_text || "无标题";
    const url = page.public_url;
    const lastEditedTime = new Date(page.last_edited_time);

    feed.item({
      title: title,
      description: "",
      url: url,
      date: lastEditedTime,
      categories: page.properties["分类"]?.filter(Boolean),
    });
  });

  // 设置响应头为 XML
  return new NextResponse(feed.xml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
