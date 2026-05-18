import { HomePage } from "@/components/HomePage";
import { readSiteConfig } from "@/data/site-config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const config = await readSiteConfig();

    return <HomePage projects={config.projects} adminMode />;
}
