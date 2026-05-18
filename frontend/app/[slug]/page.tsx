import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { PortfolioShell } from "@/components/PortfolioShell";
import { getImplementedSlugs, readSiteConfig } from "@/data/site-config";

export const dynamicParams = false;

export async function generateStaticParams() {
    const slugs = await getImplementedSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const config = await readSiteConfig();
    const project = config.projects.find((item) => item.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <PortfolioShell config={config}>
            <CaseStudyPage project={project} />
        </PortfolioShell>
    );
}
