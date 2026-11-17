export type IntroPhoto = {
  id: string;
  src: string;
  alt: string;
  label?: string;
  /** Position along the simulated camera path (world Z units). */
  distance: number;
  /** World-space horizontal / vertical offset from the camera path. */
  x: number;
  y: number;
  /** World-space dimensions. Perspective scaling is applied at render time. */
  width: number;
  height: number;
  /** Slight tilt in degrees, so each encounter feels distinct. */
  rotate?: number;
};

/**
 * Five reusable photo planes placed at different points along the camera journey.
 *
 * Only this file needs to change to use different photos. The animation
 * code never touches image sources: distance, position and size are data-driven,
 * and each reveal moment follows from its distance along the camera path.
 */
export const introPhotos: IntroPhoto[] = [
  {
    id: "intro-photo-01",
    src: "/photos/1.jpeg",
    alt: "Rahul Sir — photograph 01",
    label: "Memory 01",
    distance: 2400,
    x: -540,
    y: -180,
    width: 460,
    height: 547,
    rotate: -4,
  },
  {
    id: "intro-photo-02",
    src: "/photos/2.jpeg",
    alt: "Rahul Sir — photograph 02",
    label: "Memory 02",
    distance: 5000,
    x: 570,
    y: 130,
    width: 420,
    height: 571,
    rotate: 3,
  },
  {
    id: "intro-photo-03",
    src: "/photos/3.jpeg",
    alt: "Rahul Sir — photograph 03",
    label: "Memory 03",
    distance: 7600,
    x: -210,
    y: 310,
    width: 320,
    height: 663,
    rotate: -2,
  },
  {
    id: "intro-photo-04",
    src: "/photos/4.jpeg",
    alt: "Rahul Sir — photograph 04",
    label: "Memory 04",
    distance: 10200,
    x: 630,
    y: -260,
    width: 300,
    height: 610,
    rotate: 5,
  },
  {
    id: "intro-photo-05",
    src: "/photos/5.jpeg",
    alt: "Rahul Sir — photograph 05",
    label: "Memory 05",
    // Kept close to the end of the path so the camera slows down in front of it.
    distance: 14450,
    // Offset downward so the close-up frames the face instead of the lower body.
    x: 5,
    y: 250,
    width: 520,
    height: 702,
    rotate: 0,
  },
];

/** Camera journey timing. Kept here so pacing can be tuned without touching components. */
export const introJourney = {
  /** Camera accelerates from 0 to this Z position. */
  accelerationEndZ: 1500,
  /** Camera sustains its speed until this Z position. */
  decelerationStartZ: 13200,
  /** Final camera Z position after cinematic deceleration. */
  endZ: 14600,
  accelerationDuration: 1.8,
  sustainedDuration: 11.3,
  decelerationDuration: 2.1,
  /** Quiet composed moment before the dissolve. */
  finaleHold: 2.0,
  handoffDuration: 1.1,
} as const;
