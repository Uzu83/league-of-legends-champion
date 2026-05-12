"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef } from "react";

type EventData = Record<string, string | number | boolean | null>;

/** Fires a Vercel Analytics custom event once when mounted. Render-as-child safe. */
export function Track({ event, data }: { event: string; data?: EventData }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, data);
  }, [event, data]);
  return null;
}

/**
 * Share button: Web Share API when available, X (Twitter) intent otherwise.
 * Reports a `track()` event on click.
 */
export function ShareButton({
  text,
  url,
  label,
  className,
  event,
  data,
}: {
  text: string;
  url: string;
  label: string;
  className?: string;
  event: string;
  data?: EventData;
}) {
  const onClick = async () => {
    track(event, data);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        // user cancelled or unsupported — fall through to the intent link
      }
    }
    const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
