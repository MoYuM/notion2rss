# Notion2Rss

notion2rss 借助 cloudflare workers 将 notion 的 database 转换为 rss 订阅源。

## 使用方法

准备：
- cloudflare 账户
- GitHub 账户
- cloudflare 连接到你的 github 账号上

1. 新建一个 worker，新建方式选择「导入储存库」

![image](https://github.com/user-attachments/assets/f9c0a82a-9576-47ae-8815-8f1a40bcbfc7)

2. 选择「通过 Git URL 克隆公共存储库」
   
![image](https://github.com/user-attachments/assets/14e2fed8-cdad-497a-8128-3defc7e9c526)

3. 输入 `https://github.com/MoYuM/notion2rss`

![image](https://github.com/user-attachments/assets/d674b15b-c754-4792-8afd-800f49eaaf34)

4. 配置你的 worker，这里可以自定义 worker 和 kv 的名字，当然你也可以直接点下一步

![image](https://github.com/user-attachments/assets/dce4416b-8e79-4722-b7d0-83d3d19f5d4a)

5. 等待创建和部署成功


7. 配置 notion token，进入刚刚创建好的 worker 的设置页面，添加一个变量

![image](https://github.com/user-attachments/assets/963c56ad-66aa-44bc-b9fa-cd3fc5c5d79e)

变量名称为 `N2R_NOTION_TOKEN`，类型选 `密钥`，最后点击部署，让变量生效

![image](https://github.com/user-attachments/assets/5e811938-5927-4457-9b67-6020752d67c8)

8. 完成！访问你的 worker 地址就可以看到 feed 的 xml了。第一次加载可能会有些缓慢，第二次就好了。

## 配置 RSS

你可以使用环境变量配置你的 RSS，例如标题、icon、作者等等。方法为：进入 worker 的设置页面，点击变量的编辑按钮即可

![image](https://github.com/user-attachments/assets/67b34950-3644-4f23-b680-9dc5d5778d66)

具体配置如下：
```js
{
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

## 开发

1. 配置 notion token

项目根目录新建 `.dev.vars` 文件，里面写上你的 token 即可，这样在本地开发中也能读取到 token 了

```
N2R_NOTION_TOKEN="your notion token"
```

2. 运行项目
```bash
npm i
npm run dev
```
