# Notion2Rss

notion2rss 借助 cloudflare workers 将 notion 的 database 转换为 rss 订阅源。

## 使用方法

1. 在 [Cloudflare Workers](https://workers.cloudflare.com/) 创建一个新的 KV 存储空间，命名为 `notion2rss`。

2. clone 本项目

```bash
git clone https://github.com/MoYuM/notion2rss.git
cd notion2rss
```

4. 在 `wrangler.jsonc` 中配置 KV 存储空间和其他 rss 配置

```js
{
  // 配置 KV 存储
  "kv_namespaces": [
    {
      "binding": "notion2rss",
      "id": "e916e450410448b1a618ac82138b37b8"
    }
  ],
  // 配置 RSS
  "vars": {
    // 你希望转换为 RSS 的 Notion 数据库 ID
    "N2R_NOTION_DATABASE_ID": "1e6e29bd912180839a35d7dab1e45e66",
    // 博客的地址
    "N2R_SITE_URL": "https://moyum.notion.site/moyum-130e29bd912180f7bee6c01cc2b09017",
    // rss feed 的地址
    "N2R_FEED_URL": "https://notion2rss-worker.moyum.workers.dev",
    // 博客的名称
    "N2R_TITLE": "moyum 的博客",
    // 博客的语言
    "N2R_LANGUAGE": "zh-CN",
    // 博客的作者
    "N2R_AUTHOR": "moyum",
    // rss feed 的描述
    "N2R_DESCRIPTION": "想做点有趣东西的程序员",
    // rss feed 的图片
    "N2R_IMAGE_URL": "https://i.imgur.com/7WJRaSx.jpeg"
  }
}
```

5. 部署 worker

```base
npx wrangler deploy
```

6. 去 dashboard 页面，点击 `Settings`，在 `Variables` 中添加以下 notion token：

- 变量名为 N2R_NOTION_TOKEN
- 重新部署
