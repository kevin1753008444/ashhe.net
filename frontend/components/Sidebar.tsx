import Link from "next/link";
import type { Profile, Project } from "@/data/site-types";
import { LiveClock } from "./LiveClock";
import { ScrambleName } from "./ScrambleName";

export function Sidebar({ profile, projects, adminMode = false }: { profile: Profile; projects: Project[]; adminMode?: boolean }) {
    return (
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
                            <Link className="projectNavItem" href={href} key={project.slug}>
                                <span>{project.navTitle}</span>
                                <span>{project.year}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <LiveClock location={profile.location} />
        </aside>
    );
}
