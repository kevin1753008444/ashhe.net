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
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="clockBlock" aria-label="Current date and location">
            <div>{formatDate(now)}</div>
            <div>{location}</div>
        </div>
    );
}
