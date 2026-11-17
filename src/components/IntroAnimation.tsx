"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import IntroPhotoFrame from "./intro/IntroPhotoFrame";
import { ParticleEngine } from "./intro/ParticleEngine";
import {
  clamp,
  getPhotoVisibility,
  getStaticPlacement,
  type Camera,
  type IntroEnv,
} from "./intro/projection";
import { introJourney, introPhotos } from "@/data/introPhotos";
import { site } from "@/data/site";
import styles from "./IntroAnimation.module.css";

export default function IntroAnimation() {
  const reduceMotion = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showFinale, setShowFinale] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const finaleRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);

  const cameraRef = useRef<Camera>({ x: 0, y: 0, z: 0, roll: 0 });
  const envRef = useRef<IntroEnv>({ appearance: 0, opacity: 1, calm: 0, disperse: 0 });
  const engineRef = useRef<ParticleEngine | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef(0);
  const finishedRef = useRef(false);
  const overflowRef = useRef("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    overflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowRef.current;
    };
  }, [visible]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setVisible(false);
  }, []);

  /** Writes perspective styles directly to the reusable photo anchors each frame. */
  const updateFrames = useCallback((camera: Camera, env: IntroEnv) => {
    const engine = engineRef.current;
    if (!engine) return;

    const { width, height, focal } = engine;

    for (let i = 0; i < introPhotos.length; i++) {
      const photo = introPhotos[i];
      const element = frameRefs.current[i];
      if (!element) continue;

      const depth = photo.distance - camera.z;
      const visibility = getPhotoVisibility(photo.distance, camera.z);

      if (depth <= 20 || visibility.opacity <= 0.002 || env.opacity <= 0.002) {
        element.style.visibility = "hidden";
        continue;
      }

      // The last photo gets a slightly deeper close-up; the others keep the
      // original cap so their fly-through stays composed.
      const maxScale = i === introPhotos.length - 1 ? 3.4 : 2.8;
      const scale = clamp(focal / depth, 0.05, maxScale);
      const centerX = width * 0.5 + (photo.x - camera.x) * scale;
      const centerY = height * 0.5 + (photo.y - camera.y) * scale;
      const rotate = (photo.rotate ?? 0) + camera.roll * 1.2;

      element.style.visibility = "visible";
      element.style.opacity = String(clamp(visibility.opacity * env.opacity, 0, 1));
      element.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) scale(${scale})`;
      element.style.filter = `blur(${visibility.blur.toFixed(2)}px) brightness(${visibility.brightness.toFixed(2)})`;
      element.style.setProperty("--rim", visibility.glow.toFixed(3));
      element.style.setProperty("--frame-rotate", `${rotate.toFixed(2)}deg`);
    }
  }, []);

  /** The main cinematic journey: GSAP owns the camera, particles and photo reveals. */
  useEffect(() => {
    if (!visible || !mounted || reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new ParticleEngine(canvas);
    engineRef.current = engine;

    const camera = cameraRef.current;
    const env = envRef.current;
    camera.x = 0;
    camera.y = 0;
    camera.z = 0;
    camera.roll = 0;
    env.appearance = 0;
    env.opacity = 1;
    env.calm = 0;
    env.disperse = 0;

    const render = () => {
      // A gentle curved flight path avoids a mechanical, perfectly straight move.
      camera.x = Math.sin(camera.z * 0.00045) * 34;
      camera.y = Math.cos(camera.z * 0.00037) * 20;
      camera.roll = Math.sin(camera.z * 0.00029) * 0.015;

      engine.render(camera, env);
      updateFrames(camera, env);

      if (sceneRef.current) {
        sceneRef.current.style.setProperty("--scene-roll", `${camera.roll.toFixed(4)}rad`);
      }

      rafRef.current = window.requestAnimationFrame(render);
    };
    rafRef.current = window.requestAnimationFrame(render);

    const journeyStart = 0.35;
    const accelEnd = journeyStart + introJourney.accelerationDuration;
    const sustainEnd = accelEnd + introJourney.sustainedDuration;
    const decelEnd = sustainEnd + introJourney.decelerationDuration;
    const finaleAt = sustainEnd + introJourney.decelerationDuration * 0.45;
    const handoffAt = decelEnd + introJourney.finaleHold;

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;

    timeline
      .to(env, { appearance: 1, duration: 2.6, ease: "power1.out" }, 0)
      .fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: decelEnd, ease: "none" },
        0,
      )
      .to(
        camera,
        {
          z: introJourney.accelerationEndZ,
          duration: introJourney.accelerationDuration,
          ease: "power2.in",
        },
        journeyStart,
      )
      .to(
        camera,
        {
          z: introJourney.decelerationStartZ,
          duration: introJourney.sustainedDuration,
          ease: "none",
        },
        accelEnd,
      )
      .to(
        camera,
        {
          z: introJourney.endZ,
          duration: introJourney.decelerationDuration,
          ease: "power2.out",
        },
        sustainEnd,
      )
      .to(
        env,
        { calm: 1, opacity: 0.62, duration: 2.4, ease: "power2.out" },
        finaleAt,
      )
      .call(() => setShowFinale(true), [], finaleAt)
      .to(
        env,
        { disperse: 1, opacity: 0, duration: introJourney.handoffDuration, ease: "power2.inOut" },
        handoffAt,
      )
      .to(
        sceneRef.current,
        {
          opacity: 0,
          scale: 1.04,
          filter: "blur(9px)",
          duration: introJourney.handoffDuration,
          ease: "power2.inOut",
        },
        handoffAt,
      )
      .to(
        finaleRef.current,
        {
          opacity: 0,
          y: -16,
          duration: introJourney.handoffDuration * 0.85,
          ease: "power2.in",
        },
        handoffAt,
      )
      .to(progressRef.current, { opacity: 0, duration: 0.4 }, handoffAt);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      timeline.kill();
      timelineRef.current = null;
      engine.destroy();
      engineRef.current = null;
    };
  }, [visible, mounted, reduceMotion, finish, updateFrames]);

  /** Dignified, near-static version for prefers-reduced-motion. */
  useEffect(() => {
    if (!visible || !mounted || !reduceMotion) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const engine = new ParticleEngine(canvas);
      engineRef.current = engine;
      engine.renderOnce();
    }

    setShowFinale(true);

    const width = window.innerWidth;
    const compact = width < 768;

    introPhotos.forEach((_, index) => {
      const element = frameRefs.current[index];
      if (!element) return;
      const placement = getStaticPlacement(index);
      const scale = placement.scale * (compact ? 0.7 : 1);
      const centerX = width * placement.cx;
      const centerY = window.innerHeight * placement.cy;

      element.style.visibility = "visible";
      element.style.opacity = "0.82";
      element.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) scale(${scale})`;
      element.style.filter = "blur(0px) brightness(0.95)";
      element.style.setProperty("--rim", "0.45");
      element.style.setProperty("--frame-rotate", `${placement.rotate}deg`);
    });

    const auto = window.setTimeout(finish, 2800);
    return () => {
      window.clearTimeout(auto);
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [visible, mounted, reduceMotion, finish]);

  const skip = useCallback(() => {
    if (finishedRef.current) return;

    timelineRef.current?.kill();
    window.cancelAnimationFrame(rafRef.current);
    gsap.killTweensOf([sceneRef.current, finaleRef.current, progressRef.current]);

    const env = envRef.current;
    const handoff = gsap.timeline({ onComplete: finish });
    handoff
      .to(env, { appearance: 0, opacity: 0, disperse: 1, duration: 0.55, ease: "power2.out" }, 0)
      .to(
        sceneRef.current,
        { opacity: 0, scale: 1.025, filter: "blur(6px)", duration: 0.6, ease: "power2.inOut" },
        0,
      )
      .to(finaleRef.current, { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" }, 0)
      .to(progressRef.current, { opacity: 0, duration: 0.3 }, 0);
  }, [finish]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, skip]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          ref={overlayRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Birthday introduction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div ref={sceneRef} className={styles.scene}>
            <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />
            <div className={styles.warmGlow} aria-hidden="true" />
            <div className={styles.vignette} aria-hidden="true" />
            <div className={styles.grain} aria-hidden="true" />

            <div className={styles.photos}>
              {introPhotos.map((photo, index) => (
                <IntroPhotoFrame
                  key={photo.id}
                  photo={photo}
                  index={index}
                  anchorRef={(element) => {
                    frameRefs.current[index] = element;
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.finaleCenter}>
            <motion.div
              ref={finaleRef}
              className={styles.finale}
              initial={{ opacity: 0, y: 18 }}
              animate={showFinale ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: reduceMotion ? 0.3 : 1.15, ease: [0.22, 0.61, 0.36, 1] }}
              aria-hidden={!showFinale}
            >
            <motion.p
              className={styles.kicker}
              initial={{ opacity: 0, letterSpacing: "0.34em" }}
              animate={showFinale ? { opacity: 1, letterSpacing: "0.24em" } : {}}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              A birthday tribute
            </motion.p>

            <h1 className={styles.name}>{site.teacherName}</h1>

            <motion.p
              className={styles.heading}
              initial={{ opacity: 0, y: 12 }}
              animate={showFinale ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Happy Birthday
            </motion.p>

            <motion.div
              className={styles.dates}
              initial={{ opacity: 0, y: 10 }}
              animate={showFinale ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              <span>Birthday · {site.birthdayFull}</span>
            </motion.div>
            </motion.div>
          </div>

          <motion.button
            type="button"
            className={styles.skip}
            onClick={skip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            aria-label="Skip the introduction and enter the tribute"
          >
            Skip intro
          </motion.button>

          <div ref={progressRef} className={styles.progress} aria-hidden="true" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
