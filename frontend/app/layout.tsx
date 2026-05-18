import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Yiqi's hub",
    description: "Product Design",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
