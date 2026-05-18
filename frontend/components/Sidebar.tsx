import Link from "next/link";
import type { Profile, Project } from "@/data/site-types";
import { LiveClock } from "./LiveClock";
import { ScrambleName } from "./ScrambleName";

export function Sidebar({
    profile,
    projects,
    adminMode = false,
    menuOpen = false,
    onToggleMenu,
    onCloseMenu,
}: {
    profile: Profile;
    projects: Project[];
    adminMode?: boolean;
    menuOpen?: boolean;
    onToggleMenu?: () => void;
    onCloseMenu?: () => void;
}) {
    return (
        <>
            <header className="mobileTopbar">
                <ScrambleName name={profile.name} href={adminMode ? "/admin" : "/"} />
                <button type="button" className="mobileMenuButton" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={onToggleMenu}>
                    <span />
                    <span />
                </button>
            </header>
            <aside className="sidebar">
            <div>
                <ScrambleName name={profile.name} href={adminMode ? "/admin" : "/"} />
                <div className="profileIntro">
                    {profile.intro.map((line) => (
                        <div key={line}>{line}</div>
                    ))}
                </div>
                <nav className="projectNav" aria-label="Portfolio projects">
                    {projects.map((project) => {
                        const href = `${adminMode ? "/admin" : ""}/${project.slug}`;
                        return (
                            <Link className="projectNavItem" href={href} key={project.slug} onClick={onCloseMenu}>
                                <span>{project.navTitle}</span>
                                <span>{project.year}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <LiveClock location={profile.location} />
            </aside>
        </>
    );
}
