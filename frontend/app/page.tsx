import { HomePage } from "@/components/HomePage";
import { PortfolioShell } from "@/components/PortfolioShell";
import { readSiteConfig } from "@/data/site-config";

export default async function Page() {
    const config = await readSiteConfig();

    return (
        <PortfolioShell config={config}>
            <HomePage projects={config.projects} />
        </PortfolioShell>
    );
}
