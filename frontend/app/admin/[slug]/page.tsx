import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { getImplementedSlugs, readSiteConfig } from "@/data/site-config";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    const slugs = await getImplementedSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function AdminProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const config = await readSiteConfig();
    const project = config.projects.find((item) => item.slug === slug);

    if (!project) {
        notFound();
    }

    return <CaseStudyPage project={project} />;
}
