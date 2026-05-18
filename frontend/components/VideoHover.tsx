"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/data/site-types";

export function VideoHover({ media, className = "", style }: { media: MediaAsset; className?: string; style?: CSSProperties }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const retryCount = useRef(0);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);
    const objectFit = style?.objectFit ?? media.fit ?? "cover";

    useEffect(() => {
        const element = videoRef.current;
        if (!element) {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            const timer = globalThis.setTimeout(() => setShouldLoad(true), 0);
            return () => globalThis.clearTimeout(timer);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "240px" },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const element = videoRef.current;
        if (!shouldLoad || !element) {
            return;
        }

        setHasFailed(false);
        void element.play().catch(() => {
            // Browsers may delay autoplay until the video is ready or visible.
        });
    }, [shouldLoad, media.src]);

    function retryLoad() {
        setHasFailed(true);
        setIsReady(false);

        if (retryCount.current >= 1) {
            return;
        }

        retryCount.current += 1;
        setShouldLoad(false);
        window.setTimeout(() => setShouldLoad(true), 600);
    }

    return (
        <span className={`${className} videoFrame`} style={{ ...style, objectFit }}>
            {media.fallbackImage && (!isReady || hasFailed) && (
                <img className="videoFallbackObject" src={media.fallbackImage.src} alt={media.fallbackImage.alt || media.alt} loading="eager" />
            )}
            <video
                ref={videoRef}
                className="videoFrameObject"
                src={shouldLoad ? media.src : undefined}
                muted
                loop
                autoPlay
                playsInline
                preload={shouldLoad ? "metadata" : "none"}
                aria-label={media.alt}
                onCanPlay={() => {
                    setIsReady(true);
                    setHasFailed(false);
                    if (videoRef.current) {
                        void videoRef.current.play().catch(() => undefined);
                    }
                }}
                onError={retryLoad}
            />
        </span>
    );
}
