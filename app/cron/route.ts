import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 检查是否需要更新 feed
const shouldUpdateFeed = () => {
  const filePath = path.join(process.cwd(), 'public', 'feed.xml');

  // 如果文件不存在，需要更新
  if (!fs.existsSync(filePath)) {
    return true;
  }

  // 获取文件最后修改时间
  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime;
  const now = new Date();

  // 如果文件超过 2 小时未更新，需要更新
  const twoHours = 2 * 60 * 60 * 1000;
  return now.getTime() - lastModified.getTime() > twoHours;
};

export async function GET() {
  try {
    // 检查是否需要更新
    if (!shouldUpdateFeed()) {
      return new NextResponse('Feed is up to date', { status: 200 });
    }

    // 触发 build 接口
    const buildResponse = await fetch(`${process.env.N2R_SITE_URL || 'http://localhost:3000'}/build`);

    if (!buildResponse.ok) {
      return new NextResponse('Failed to generate RSS feed', { status: 500 });
    }

    return new NextResponse('Feed updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 