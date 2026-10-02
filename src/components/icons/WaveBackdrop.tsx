import { useEffect, useRef, useState } from "react";

import { BOARD_CURVE, wavePath } from "./waveFrames";

/** Seconds for the wave to climb one wavelength: a bulge becomes a dip in half that. */
const WAVE_SECONDS = 18;

function prefersReducedMotion(): boolean {
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The curve every board draws behind its page, its edge one long wave that keeps climbing:
 * bulges sink into dips and dips swell into bulges (user 2026-10-02; not on the boards). Each frame sets the path straight on the element, so
 * React doesn't re-render; the browser holds frames back while the window is hidden. With
 * reduced motion it is the boards' still curve.
 */
export function WaveBackdrop({ className }: { className?: string }) {
  const [still, setStill] = useState(prefersReducedMotion);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setStill(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = path.current;
    if (still || !el) return;
    let frame = requestAnimationFrame(function draw(now) {
      el.setAttribute("d", wavePath(((now / 1000) * 2 * Math.PI) / WAVE_SECONDS));
      frame = requestAnimationFrame(draw);
    });
    return () => cancelAnimationFrame(frame);
  }, [still]);

  return (
    <svg viewBox="0 0 1280 800" aria-hidden="true" className={className} preserveAspectRatio="none">
      <path ref={path} d={still ? BOARD_CURVE : wavePath(0)} style={{ fill: "var(--dc-accent-5)" }} />
    </svg>
  );
}
