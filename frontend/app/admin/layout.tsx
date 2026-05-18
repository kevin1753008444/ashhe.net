import type { ReactNode } from "react";
import { AdminEditor } from "@/components/AdminEditor";
import { PortfolioShell } from "@/components/PortfolioShell";
import { readSiteConfig } from "@/data/site-config";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const config = await readSiteConfig();

    return (
        <>
            <PortfolioShell config={config} adminMode>
                {children}
            </PortfolioShell>
            <AdminEditor initialConfig={config} />
        </>
    );
}
