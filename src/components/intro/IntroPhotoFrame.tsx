import Image from "next/image";
import type { IntroPhoto } from "@/data/introPhotos";
import styles from "./IntroPhotoFrame.module.css";

type Props = {
  photo: IntroPhoto;
  index: number;
  /** Ref for the transform anchor. The orchestrator writes perspective styles here. */
  anchorRef: (element: HTMLDivElement | null) => void;
};

/**
 * Reusable, data-driven photo plane.
 * Only `src` in src/data/introPhotos.ts needs to change to use a real photograph.
 */
export default function IntroPhotoFrame({ photo, index, anchorRef }: Props) {
  return (
    <div className={styles.anchor} ref={anchorRef}>
      <figure className={styles.frame} style={{ width: photo.width, height: photo.height }}>
        <span className={styles.matte}>
          <span className={styles.imageWrap}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 40vw, 34vw"
              className={styles.image}
              unoptimized
              priority
            />
            <span className={styles.innerShade} aria-hidden="true" />
          </span>
        </span>
        <figcaption className={styles.caption}>
          <span className={styles.captionIndex}>{String(index + 1).padStart(2, "0")}</span>
          <span>{photo.label ?? "Photo slot"}</span>
        </figcaption>
      </figure>
    </div>
  );
}
