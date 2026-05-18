import { NextResponse } from "next/server";
import { readSiteConfig, writeSiteConfig } from "@/data/site-config";
import type { SiteConfig } from "@/data/site-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSiteConfig(value: unknown): value is SiteConfig {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as Partial<SiteConfig>;
    return Boolean(candidate.profile && candidate.design && Array.isArray(candidate.projects));
}

export async function GET() {
    const config = await readSiteConfig();
    return NextResponse.json(config, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

export async function PUT(request: Request) {
    const nextConfig = (await request.json()) as unknown;

    if (!isSiteConfig(nextConfig)) {
        return NextResponse.json({ error: "Invalid site config payload." }, { status: 400 });
    }

    await writeSiteConfig(nextConfig, "Updated from admin console");
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
