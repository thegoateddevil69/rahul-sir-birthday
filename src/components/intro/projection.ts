/** Simulated camera state. All values are in world units (except roll, in radians). */
export type Camera = {
  x: number;
  y: number;
  z: number;
  roll: number;
};

/** Environment parameters tweened by GSAP. */
export type IntroEnv = {
  appearance: number;
  opacity: number;
  calm: number;
  disperse: number;
};

export type PhotoVisibility = {
  opacity: number;
  reveal: number;
  blur: number;
  brightness: number;
  glow: number;
};

export const PARTICLE_NEAR = 14;
export const PARTICLE_FAR = 2600;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Focal length used by the 2D perspective projection. */
export function getFocal(width: number, height: number) {
  return Math.max(540, Math.min(width, height) * 0.92);
}

/**
 * Visibility of a photo plane as the camera approaches and passes it.
 * Everything is driven by camera Z, so the reveal is part of the journey,
 * not an independent slideshow timer.
 */
export function getPhotoVisibility(distance: number, cameraZ: number): PhotoVisibility {
  // Photos appear early and are already fully clear, so each one has a long,
  // calm viewing window instead of a brief close-range "reveal".
  const appearAt = distance - 3200;
  const clearAt = distance - 2400;
  const fadeOutStart = distance - 220;
  const fadeOutEnd = distance + 120;

  const fadeIn = smoothstep(appearAt, clearAt, cameraZ);
  const fadeOut = 1 - smoothstep(fadeOutStart, fadeOutEnd, cameraZ);
  const opacity = fadeIn * fadeOut;

  return {
    opacity,
    reveal: 1,
    blur: 0,
    brightness: 1,
    glow: opacity * 0.45,
  };
}

/**
 * Calm, non-animated placement used for prefers-reduced-motion.
 * Frames sit around the perimeter so the final typography stays clear.
 */
export function getStaticPlacement(index: number) {
  const placements = [
    { cx: 0.16, cy: 0.24, scale: 0.27, rotate: -4 },
    { cx: 0.84, cy: 0.24, scale: 0.25, rotate: 3 },
    { cx: 0.11, cy: 0.58, scale: 0.23, rotate: -3 },
    { cx: 0.89, cy: 0.58, scale: 0.23, rotate: 4 },
    { cx: 0.5, cy: 0.85, scale: 0.24, rotate: 0 },
  ];
  return placements[index % placements.length];
}
