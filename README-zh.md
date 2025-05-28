# Notion2Rss

🌐 [English](README.md) | [简体中文](README-zh.md)

**Notion2Rss** 借助 Cloudflare Worker 将你的 Notion 数据库转换为可订阅的 RSS 源。

## 🚀 快速开始

### 准备工作

* 一个 Cloudflare 账户
* 一个 GitHub 账户
* 将 Cloudflare 连接至你的 GitHub 账号

### 步骤一：创建 Worker

1. 登录 [Cloudflare Workers](https://workers.cloudflare.com/) 控制台，选择 **“导入存储库”** 创建新 Worker

   ![image](https://github.com/user-attachments/assets/f9c0a82a-9576-47ae-8815-8f1a40bcbfc7)

3. 选择 **“通过 Git URL 克隆公共存储库”**

   ![image](https://github.com/user-attachments/assets/14e2fed8-cdad-497a-8128-3defc7e9c526)

5. 输入仓库地址：

   ```
   https://github.com/MoYuM/notion2rss
   ```

   ![image](https://github.com/user-attachments/assets/d674b15b-c754-4792-8afd-800f49eaaf34)

6. 配置 Worker（可自定义名称和 KV 名称，也可以直接点击下一步）

   ![image](https://github.com/user-attachments/assets/dce4416b-8e79-4722-b7d0-83d3d19f5d4a)

8. 等待部署完成

### 步骤二：设置 Notion Token

6. 进入刚刚创建的 Worker 设置页，添加变量：
   名称为 `N2R_NOTION_TOKEN`，类型选择「密钥」

   ![image](https://github.com/user-attachments/assets/963c56ad-66aa-44bc-b9fa-cd3fc5c5d79e)

8. 保存后点击「部署」按钮以使变量生效


   ![image](https://github.com/user-attachments/assets/38c7ca79-8b47-4c18-b555-b9e36d888147)


### 步骤三：访问 RSS

访问你的 Worker 地址，即可看到生成的 RSS Feed（XML 格式）。首次加载可能稍慢，之后会变快。


## ⚙️ RSS 配置

你可以通过设置环境变量自定义 RSS 的信息，如标题、图标、作者等。

进入 Worker 设置页面，点击「变量」部分进行编辑：

![image](https://github.com/user-attachments/assets/67b34950-3644-4f23-b680-9dc5d5778d66)

配置示例：

```jsonc
{
  "vars": {
    // Notion 数据库 ID（你希望被转为 RSS 的数据库）
    "N2R_NOTION_DATABASE_ID": "1e6e29bd912180839a35d7dab1e45e66",

    // 博客页面地址
    "N2R_SITE_URL": "https://moyum.notion.site/moyum-130e29bd912180f7bee6c01cc2b09017",

    // RSS Feed 的访问地址
    "N2R_FEED_URL": "https://notion2rss-worker.moyum.workers.dev",

    // 博客名称
    "N2R_TITLE": "moyum 的博客",

    // 博客语言
    "N2R_LANGUAGE": "zh-CN",

    // 作者名称
    "N2R_AUTHOR": "moyum",

    // RSS Feed 描述
    "N2R_DESCRIPTION": "想做点有趣东西的程序员",

    // RSS 图标地址
    "N2R_IMAGE_URL": "https://i.imgur.com/7WJRaSx.jpeg"
  }
}
```

## 🛠️ 本地开发

1. 在项目根目录创建 `.dev.vars` 文件，写入你的 Notion Token：

```
N2R_NOTION_TOKEN="your notion token"
```

2. 安装依赖并运行项目：

```bash
npm install
npm run dev
```

欢迎提出 Issue 和 PR！🎉
