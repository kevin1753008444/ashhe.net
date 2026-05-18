"use client";

import { useEffect, useState } from "react";

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export function LiveClock({ location }: { location: string }) {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const initialTimer = window.setTimeout(() => setNow(new Date()), 0);
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => {
            window.clearTimeout(initialTimer);
            window.clearInterval(timer);
        };
    }, []);

    return (
        <div className="clockBlock" aria-label="Current date and location">
            <div>{now ? formatDate(now) : "\u00a0"}</div>
            <div>{location}</div>
        </div>
    );
}
