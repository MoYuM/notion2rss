# Notion2RSS

🌐 [English](README.md) | [简体中文](README-zh.md)

Notion2Rss converts your Notion database into a subscribable RSS feed using Cloudflare Workers.

## 🚀 Getting Started

### Prerequisites

* A Cloudflare account
* A GitHub account
* Connect Cloudflare to your GitHub account

### Step 1: Create a Worker

1. Go to the [Cloudflare Workers dashboard](https://workers.cloudflare.com/) and click **"Import from GitHub"**

   ![image](https://github.com/user-attachments/assets/f9c0a82a-9576-47ae-8815-8f1a40bcbfc7)

2. Choose **"Clone a Git repository via URL"**

   ![image](https://github.com/user-attachments/assets/14e2fed8-cdad-497a-8128-3defc7e9c526)

3. Enter the repository URL:

   ```
   https://github.com/MoYuM/notion2rss
   ```

   ![image](https://github.com/user-attachments/assets/d674b15b-c754-4792-8afd-800f49eaaf34)

4. Customize your Worker and KV namespace name (optional), or simply proceed to the next step

   ![image](https://github.com/user-attachments/assets/dce4416b-8e79-4722-b7d0-83d3d19f5d4a)

5. Wait for the Worker to build and deploy successfully

### Step 2: Set Up Notion Token

6. Go to the settings page of the newly created Worker, and add an environment variable:
   Name: `N2R_NOTION_TOKEN`, Type: **Secret**

   ![image](https://github.com/user-attachments/assets/963c56ad-66aa-44bc-b9fa-cd3fc5c5d79e)

7. Click **Deploy** to apply the environment variable

   ![image](https://github.com/user-attachments/assets/38c7ca79-8b47-4c18-b555-b9e36d888147)

### Step 3: Access Your RSS Feed

8. Visit your Worker URL to access the RSS feed in XML format.
   *Note: The first load may be slow, but subsequent requests will be faster.*

## ⚙️ RSS Configuration

You can customize your RSS feed (e.g., title, icon, author) using environment variables.

To configure them, go to your Worker's settings page and edit the variables section:

![image](https://github.com/user-attachments/assets/67b34950-3644-4f23-b680-9dc5d5778d66)

Example configuration:

```jsonc
{
  "vars": {
    // Notion database ID to convert to RSS
    "N2R_NOTION_DATABASE_ID": "1e6e29bd912180839a35d7dab1e45e66",

    // URL of your Notion blog or site
    "N2R_SITE_URL": "https://moyum.notion.site/moyum-130e29bd912180f7bee6c01cc2b09017",

    // URL of the generated RSS feed
    "N2R_FEED_URL": "https://notion2rss-worker.moyum.workers.dev",

    // Feed title
    "N2R_TITLE": "Moyum's Blog",

    // Language code
    "N2R_LANGUAGE": "zh-CN",

    // Author name
    "N2R_AUTHOR": "moyum",

    // Feed description
    "N2R_DESCRIPTION": "A developer who wants to build interesting things",

    // Feed image/icon
    "N2R_IMAGE_URL": "https://i.imgur.com/7WJRaSx.jpeg"
  }
}
```

## 🛠️ Local Development

1. Create a `.dev.vars` file in the root directory with your Notion token:

```
N2R_NOTION_TOKEN="your notion token"
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Feel free to open issues or submit pull requests to improve this project! 🎉
