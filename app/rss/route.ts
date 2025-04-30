import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'
import RSS from 'rss'

const client = new Client({
    auth: process.env.NOTION_TOKEN,
})

export async function GET() {
    const response = await client.databases.query({ database_id: "969d8b77bb734f3eaa1cc00a245f93d7" })
    
    // 创建 RSS feed
    const feed = new RSS({
        title: '面试题 RSS Feed',
        description: '面试题更新通知',
        feed_url: 'http://localhost:3000/api/rss',
        site_url: 'http://localhost:3000',
        language: 'zh-CN',
        pubDate: new Date(),
    })

    // 添加每个页面作为 RSS 条目
    response.results.forEach((page: any) => {
        const title = page.properties['页面'].title[0]?.plain_text || '无标题'
        const url = page.public_url
        const lastEditedTime = new Date(page.last_edited_time)
        
        feed.item({
            title: title,
            description: `分类: ${page.properties['面试题分类'].select?.name || '未分类'}`,
            url: url,
            date: lastEditedTime,
            categories: [
                page.properties['面试题分类'].select?.name,
                page.properties['频率'].select?.name
            ].filter(Boolean),
        })
    })

    // 设置响应头为 XML
    return new NextResponse(feed.xml(), {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}