import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import RSS from "rss";
import markdownit from 'markdown-it'
import { NotionToMarkdown } from "notion-to-md";
import { get } from "../get";
import fs from 'fs';
import path from 'path';

const {
  N2R_NOTION_DATABASE_ID,
  N2R_NOTION_TOKEN,
  N2R_SITE_URL,
  N2R_TITLE,
  N2R_AUTHOR,
  N2R_LANGUAGE = "zh-CN",
} = process.env;

const md = markdownit()

const client = new Client({
  auth: N2R_NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({
  notionClient: client,
})

const getContentHtml = async (id: string) => {
  try {
    const mdBlocks = await n2m.pageToMarkdown(id)
    const content = n2m.toMarkdownString(mdBlocks)

    if (!content.parent) {
      return "";
    }

    const html = md.render(content.parent)

    if (html) {
      return html
    }
  } catch {
    return ""
  }
}

export async function GET() {
  if (!N2R_NOTION_DATABASE_ID) {
    return new NextResponse("Notion database ID is not set", { status: 500 });
  }

  if (!N2R_NOTION_TOKEN) {
    return new NextResponse("Notion token is not set", { status: 500 });
  }

  if (!N2R_SITE_URL) {
    return new NextResponse("Site URL is not set", { status: 500 });
  }

  if (!N2R_TITLE) {
    return new NextResponse("Title is not set", { status: 500 });
  }

  const response = await client.databases.query({
    database_id: N2R_NOTION_DATABASE_ID,
  });

  // 创建 RSS feed
  const feed = new RSS({
    title: N2R_TITLE,
    language: N2R_LANGUAGE,
    feed_url: `${N2R_SITE_URL}/rss`,
    site_url: N2R_SITE_URL,
    pubDate: new Date(),
  });

  for (const page of response.results) {

    const item: any = {
      url: get(page, "public_url"),
      lastEditedTime: new Date(get(page, "created_time")),
      title: get(page, "properties.名称.title[0].plain_text") || "无标题",
      author: N2R_AUTHOR,
    };

    const html = await getContentHtml(get(page, "id"))
    if (html) {
      item.description = html
    }

    feed.item(item)
  }

  // 生成 XML 内容
  const xml = feed.xml();

  // 确保 public 目录存在
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 保存 XML 文件
  const filePath = path.join(publicDir, 'feed.xml');
  fs.writeFileSync(filePath, xml);

  // 返回保存的文件
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
