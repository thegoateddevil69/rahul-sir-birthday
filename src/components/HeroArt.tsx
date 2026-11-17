"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import styles from "./HeroArt.module.css";
import { site } from "@/data/site";

export default function HeroArt() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let onPointerMove: ((event: PointerEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const glyphA = root.querySelector<HTMLElement>("[data-glyph-a]");
      const glyphB = root.querySelector<HTMLElement>("[data-glyph-b]");
      const glyphC = root.querySelector<HTMLElement>("[data-glyph-c]");

      gsap.to("[data-float]", {
        y: -9,
        duration: 5.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const moveA = glyphA ? gsap.quickTo(glyphA, "x", { duration: 1, ease: "power3.out" }) : null;
      const moveAY = glyphA ? gsap.quickTo(glyphA, "y", { duration: 1, ease: "power3.out" }) : null;
      const moveB = glyphB ? gsap.quickTo(glyphB, "x", { duration: 1.2, ease: "power3.out" }) : null;
      const moveBY = glyphB ? gsap.quickTo(glyphB, "y", { duration: 1.2, ease: "power3.out" }) : null;
      const moveC = glyphC ? gsap.quickTo(glyphC, "x", { duration: 1.4, ease: "power3.out" }) : null;
      const moveCY = glyphC ? gsap.quickTo(glyphC, "y", { duration: 1.4, ease: "power3.out" }) : null;

      onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        moveA?.(px * 22);
        moveAY?.(py * 22);
        moveB?.(px * -28);
        moveBY?.(py * -28);
        moveC?.(px * 16);
        moveCY?.(py * -16);
      };

      window.addEventListener("pointermove", onPointerMove);
    }, root);

    return () => {
      if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
      ctx.revert();
    };
  }, [reduceMotion]);

  return (
    <div className={styles.art} ref={rootRef}>
      <div className={styles.panel}>
        <div className={styles.grid} aria-hidden="true" />
        <span className={styles.orbit} aria-hidden="true" />
        <span className={styles.orbitInner} aria-hidden="true" />

        <span className={`${styles.glyph} ${styles.glyphA}`} data-glyph-a aria-hidden="true">
          ∑
        </span>
        <span className={`${styles.glyph} ${styles.glyphB}`} data-glyph-b aria-hidden="true">
          {"{ }"}
        </span>
        <span className={`${styles.glyph} ${styles.glyphC}`} data-glyph-c aria-hidden="true">
          ∞
        </span>

        <div className={styles.cardFrame}>
          <div className={styles.card} data-float>
            <span className={styles.cornerTop} aria-hidden="true" />
            <span className={styles.cornerBottom} aria-hidden="true" />

            <p className={styles.kicker}>A birthday tribute to</p>

            <div className={styles.monogramWrap} aria-hidden="true">
              <span className={styles.monogramRing} />
              <span className={styles.monogram}>R</span>
            </div>

            <p className={styles.name}>{site.teacherName}</p>
            <p className={styles.subject}>{site.subjects}</p>

            <div className={styles.rule} aria-hidden="true">
              <span />
              <span className={styles.ruleGlyphs}>∑ · ∞ · {"{ }"}</span>
              <span />
            </div>

            <p className={styles.date}>{site.birthdayShort}</p>
            <p className={styles.from}>From all of us</p>
          </div>
        </div>

        <span className={styles.sideNote} aria-hidden="true">
          With gratitude · {site.className}
        </span>
      </div>

      <p className={styles.caption}>
        “A teacher who believed in us before we believed in ourselves.”
      </p>
    </div>
  );
}
