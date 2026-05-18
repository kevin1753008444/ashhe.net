"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@/data/site-types";
import { Sidebar } from "./Sidebar";

function getDesignVars(config: SiteConfig) {
    const { sidebar, home, caseStudy, responsive } = config.design;

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
        "--compact-sidebar-width": `${responsive.compactSidebarWidthVw}vw`,
        "--compact-sidebar-min-width": `${responsive.compactSidebarMinWidth}px`,
        "--compact-sidebar-padding-x": `${responsive.compactSidebarPaddingX}px`,
        "--compact-sidebar-name-size": `${responsive.compactSidebarNameSize}px`,
        "--compact-sidebar-intro-size": `${responsive.compactSidebarIntroSize}px`,
        "--compact-sidebar-nav-size": `${responsive.compactSidebarNavSize}px`,
        "--compact-sidebar-nav-gap": `${responsive.compactSidebarNavGap}px`,
        "--compact-gallery-scale": responsive.compactGalleryScale,
        "--mobile-header-height": `${responsive.mobileHeaderHeight}px`,
        "--mobile-page-padding": `${responsive.mobilePagePadding}px`,
        "--mobile-menu-padding": `${responsive.mobileMenuPadding}px`,
        "--mobile-menu-name-size": `${responsive.mobileMenuNameSize}px`,
        "--mobile-menu-intro-size": `${responsive.mobileMenuIntroSize}px`,
        "--mobile-menu-nav-size": `${responsive.mobileMenuNavSize}px`,
        "--mobile-tile-height": `${responsive.mobileTileHeight}px`,
        "--mobile-tile-gap": `${responsive.mobileTileGap}px`,
        "--mobile-tile-padding": `${responsive.mobileTilePadding}px`,
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
    const [mode, setMode] = useState<"full" | "compact" | "mobile">("full");
    const [menuOpen, setMenuOpen] = useState(false);
    const { responsive } = config.design;

    useEffect(() => {
        const updateMode = () => {
            const width = window.innerWidth;
            const nextMode = width <= responsive.mobileBreakpoint
                ? "mobile"
                : width <= responsive.compactBreakpoint
                  ? "compact"
                  : "full";
            setMode(nextMode);
            if (nextMode !== "mobile") {
                setMenuOpen(false);
            }
        };

        updateMode();
        window.addEventListener("resize", updateMode);
        return () => window.removeEventListener("resize", updateMode);
    }, [responsive.compactBreakpoint, responsive.mobileBreakpoint]);

    return (
        <div className="portfolioShell" data-responsive-mode={mode} data-menu-open={menuOpen} style={getDesignVars(config)}>
            <Sidebar
                profile={config.profile}
                projects={config.projects}
                adminMode={adminMode}
                menuOpen={menuOpen}
                onToggleMenu={() => setMenuOpen((open) => !open)}
                onCloseMenu={() => setMenuOpen(false)}
            />
            <main className="contentPane">{children}</main>
        </div>
    );
}
