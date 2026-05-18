import type { Metadata } from "next";
import { readSiteConfig } from "@/data/site-config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const config = await readSiteConfig();

    return {
        title: config.site.title,
        description: config.site.description,
        icons: {
            icon: config.site.icon,
        },
    };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
