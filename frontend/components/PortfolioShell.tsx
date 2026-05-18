import type { CSSProperties, ReactNode } from "react";
import type { SiteConfig } from "@/data/site-types";
import { Sidebar } from "./Sidebar";

function getDesignVars(config: SiteConfig) {
    const { sidebar, home, caseStudy } = config.design;

    return {
        "--sidebar-width": `${sidebar.widthVw}vw`,
        "--sidebar-min-width": `${sidebar.minWidth}px`,
        "--sidebar-padding-top": `${sidebar.paddingTop}px`,
        "--sidebar-padding-x": `${sidebar.paddingX}px`,
        "--sidebar-padding-bottom": `${sidebar.paddingBottom}px`,
        "--sidebar-name-size": `${sidebar.nameSize}px`,
        "--sidebar-intro-size": `${sidebar.introSize}px`,
        "--sidebar-nav-size": `${sidebar.navSize}px`,
        "--sidebar-nav-gap": `${sidebar.navGap}px`,
        "--sidebar-intro-gap": `${sidebar.introGap}px`,
        "--sidebar-clock-size": `${sidebar.clockSize}px`,
        "--home-tile-height": `${home.tileHeight}px`,
        "--home-tile-gap": `${home.tileGap}px`,
        "--home-media-scale": home.mediaScale,
        "--home-desktop-preview-width": `${home.desktopPreviewWidth}%`,
        "--home-phone-width": `${home.phoneWidth}px`,
        "--home-phone-min-width": `${home.phoneMinWidth}px`,
        "--home-title-size": `${home.titleSize ?? 16}px`,
        "--home-title-bottom": `${home.titleBottom ?? 24}px`,
        "--home-hover-opacity": `${(home.hoverOpacity ?? 20) / 100}`,
        "--case-hero-height": `${caseStudy.heroHeightVh}vh`,
        "--case-intro-padding-y": `${caseStudy.introPaddingY}px`,
        "--case-intro-padding-x": `${caseStudy.introPaddingX}px`,
        "--case-section-padding-y": `${caseStudy.sectionPaddingY}px`,
        "--case-section-padding-x": `${caseStudy.sectionPaddingX}px`,
        "--case-title-size": `${caseStudy.titleSize}px`,
        "--case-body-size": `${caseStudy.bodySize}px`,
        "--case-media-gap-y": `${caseStudy.mediaGapY ?? caseStudy.mediaGap}px`,
        "--case-media-gap-x": `${caseStudy.mediaGapX ?? caseStudy.mediaGap}px`,
        "--case-media-card-min-height": `${caseStudy.mediaCardMinHeight}px`,
    } as CSSProperties;
}

export function PortfolioShell({ children, config, adminMode = false }: { children: ReactNode; config: SiteConfig; adminMode?: boolean }) {
    return (
        <div className="portfolioShell" style={getDesignVars(config)}>
            <Sidebar profile={config.profile} projects={config.projects} adminMode={adminMode} />
            <main className="contentPane">{children}</main>
        </div>
    );
}
