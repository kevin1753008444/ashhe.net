import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { MediaAsset } from "@/data/site-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads");
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

function getSafeFileName(name: string) {
    const extension = path.extname(name).toLowerCase();
    const baseName = path
        .basename(name, extension)
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
    return `${baseName || "media"}${extension}`;
}

function getUploadPath(src: string) {
    if (!src.startsWith("/uploads/")) {
        return null;
    }

    const relativePath = decodeURIComponent(src.replace(/^\/+/, ""));
    const absolutePath = path.normalize(path.join(PUBLIC_ROOT, relativePath));
    const uploadRoot = `${path.normalize(UPLOAD_DIR)}${path.sep}`;

    if (!absolutePath.startsWith(uploadRoot)) {
        return null;
    }

    return absolutePath;
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Missing file field." }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json({ error: "Unsupported media type." }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const safeName = getSafeFileName(file.name);
    const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const fileName = `${timestamp}-${randomUUID().slice(0, 8)}-${safeName}`;
    const destination = path.join(UPLOAD_DIR, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(destination, bytes);

    const media: MediaAsset = {
        type: file.type.startsWith("video/") || VIDEO_EXTENSIONS.has(extension) ? "video" : "image",
        src: `/uploads/${fileName}`,
        alt: path.basename(safeName, extension).replace(/-/g, " "),
        fit: "cover",
    };

    return NextResponse.json({ media, size: bytes.byteLength });
}

export async function DELETE(request: Request) {
    const body = (await request.json()) as { src?: string };

    if (!body.src) {
        return NextResponse.json({ error: "Missing media src." }, { status: 400 });
    }

    const uploadPath = getUploadPath(body.src);

    if (!uploadPath) {
        return NextResponse.json({ error: "Only /uploads media can be deleted." }, { status: 400 });
    }

    await fs.rm(uploadPath, { force: true });
    return NextResponse.json({ ok: true });
}
