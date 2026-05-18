import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },
    ...(process.env.STATIC_EXPORT === "1"
        ? {
            output: "export" as const,
            trailingSlash: true,
        }
        : {}),
};

export default nextConfig;
