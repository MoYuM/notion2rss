import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import markdownit from "markdown-it";
import RSS from "rss";

interface Env {
  notion2rss: KVNamespace;
  N2R_NOTION_DATABASE_ID: string;
  N2R_NOTION_TOKEN: string;
  N2R_SITE_URL: string;
  N2R_TITLE: string;
  N2R_AUTHOR: string;
  N2R_LANGUAGE: string;
  N2R_FEED_URL: string;
  N2R_DESCRIPTION: string;
  N2R_IMAGE_URL: string;
}

const get = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

const md = markdownit();

const getContentHtml = async (id: string, n2m: NotionToMarkdown) => {
  try {
    const mdBlocks = await n2m.pageToMarkdown(id);
    const content = n2m.toMarkdownString(mdBlocks);

    if (!content.parent) {
      return "";
    }

    const html = md.render(content.parent);

    if (html) {
      return html;
    }
  } catch {
    return "";
  }
};

const getPageCacheData = async (pageId: string, env: Env) => {
  const cacheString = await env.notion2rss.get(pageId);
  if (cacheString) {
    return JSON.parse(cacheString);
  }
  return null;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (!env.N2R_NOTION_DATABASE_ID) {
      return new Response("Notion database ID is not set", { status: 500 });
    }

    if (!env.N2R_NOTION_TOKEN) {
      return new Response("Notion token is not set", { status: 500 });
    }

    if (!env.N2R_SITE_URL) {
      return new Response("Site URL is not set", { status: 500 });
    }

    if (!env.N2R_TITLE) {
      return new Response("Title is not set", { status: 500 });
    }

    if (!env.N2R_FEED_URL) {
      return new Response("Feed URL is not set", { status: 500 });
    }

    const client = new Client({
      auth: env.N2R_NOTION_TOKEN,
      fetch: (url: string, init?: RequestInit) => fetch(url, init),
    });

    const n2m = new NotionToMarkdown({
      notionClient: client,
    });

    n2m.setCustomTransformer("image", (node) => {
      const url = get(node, "image.file.url");
      const src =
        'https://www.notion.so' +
        '/image/' +
        encodeURIComponent(url) +
        '?table=block' +
        '&id=' +
        get(node, "id")

      return `![${"image"}](${src})`;
    });

    try {
      const response = await client.databases.query({
        database_id: env.N2R_NOTION_DATABASE_ID,
      });

      // 创建 RSS feed
      const feed = new RSS({
        title: env.N2R_TITLE,
        description: env.N2R_DESCRIPTION,
        image_url: env.N2R_IMAGE_URL,
        language: env.N2R_LANGUAGE || "zh-CN",
        feed_url: env.N2R_FEED_URL,
        site_url: env.N2R_SITE_URL,
        pubDate: new Date(),
      });

      for (const page of response.results) {
        const pageId = get(page, "id");
        const lastEditedTime = new Date(get(page, "last_edited_time"));

        const cachedData = await getPageCacheData(pageId, env);

        if (
          cachedData &&
          cachedData.lastEditedTime === lastEditedTime.toISOString()
        ) {
          feed.item(cachedData);
          continue;
        } else {
          const item: any = {
            url: get(page, "public_url"),
            date: new Date(get(page, "created_time")),
            title: get(page, "properties.名称.title[0].plain_text") || "无标题",
            author: env.N2R_AUTHOR,
            lastEditedTime: lastEditedTime.toISOString(),
          };

          const html = await getContentHtml(pageId, n2m);
          if (html) {
            item.description = html;
            await env.notion2rss.put(pageId, JSON.stringify(item));
          }

          feed.item(item);
        }
      }

      const xml = feed.xml();

      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml",
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
