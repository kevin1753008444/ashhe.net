"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "@#$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function getRandomChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export function ScrambleName({ name, href = "/" }: { name: string; href?: string }) {
    const pathname = usePathname();
    const [displayName, setDisplayName] = useState(name);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const runScramble = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        let frame = 0;
        const maxFrames = 20;

        intervalRef.current = setInterval(() => {
            frame += 1;
            const revealCount = Math.ceil((frame / maxFrames) * name.length);
            const settleCount = Math.max(0, Math.floor(((frame - 5) / (maxFrames - 5)) * name.length));
            const nextName = name
                .split("")
                .map((character, index) => {
                    if (index >= revealCount) {
                        return "";
                    }
                    if (character === " " || index < settleCount) {
                        return character;
                    }
                    return getRandomChar();
                })
                .join("");

            setDisplayName(nextName);

            if (frame >= maxFrames) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setDisplayName(name);
            }
        }, 28);
    }, [name]);

    useEffect(() => {
        runScramble();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [pathname, runScramble]);

    return (
        <Link className="siteName" href={href} aria-label="Go to home" onClick={runScramble}>
            {displayName}
        </Link>
    );
}
