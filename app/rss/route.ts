import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "feed.xml");

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      // 如果文件不存在，触发 build 接口
      const buildResponse = await fetch(
        `${process.env.N2R_SITE_URL || "http://localhost:3000"}/build`
      );

      if (!buildResponse.ok) {
        return new NextResponse("Failed to generate RSS feed", { status: 500 });
      }

      // 再次检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return new NextResponse("RSS feed not found after generation", {
          status: 404,
        });
      }
    }

    // 读取文件内容
    const xml = fs.readFileSync(filePath, "utf-8");

    // 返回文件内容
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": 'attachment; filename="feed.xml"',
      },
    });
  } catch (error) {
    console.error("Error reading RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
