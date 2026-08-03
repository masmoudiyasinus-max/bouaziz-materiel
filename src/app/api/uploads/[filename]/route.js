import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".gif") contentType = "image/gif";
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
