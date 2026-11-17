"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clapperboard, Play, User } from "lucide-react";
import styles from "./VideoGallery.module.css";
import type { StudentVideo } from "@/data/students";

export default function VideoGallery({ videos }: { videos: StudentVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const refs = videoRefs.current;
    Object.entries(refs).forEach(([id, node]) => {
      if (!node || id === activeId) return;
      node.pause();
      try {
        node.currentTime = 0;
      } catch {
        // The current time can throw if the media has not loaded yet.
      }
    });
  }, [activeId]);

  return (
    <div className={styles.grid}>
      {videos.map((video, index) => {
        const isActive = activeId === video.id;
        const hasVideo = Boolean(video.videoSrc);

        return (
          <motion.article
            key={video.id}
            className={styles.card}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.65,
              delay: (index % 3) * 0.06,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className={styles.media}>
              {hasVideo && isActive ? (
                <video
                  ref={(node) => {
                    videoRefs.current[video.id] = node;
                  }}
                  className={styles.video}
                  src={video.videoSrc}
                  poster={video.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onEnded={() => setActiveId(null)}
                />
              ) : (
                <button
                  type="button"
                  className={styles.posterButton}
                  onClick={() => {
                    if (hasVideo) setActiveId(video.id);
                  }}
                  aria-label={
                    hasVideo
                      ? `Play birthday message from ${video.name}`
                      : `Video message from ${video.name} (not added yet)`
                  }
                >
                  <Image
                    src={video.poster}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className={styles.posterImage}
                    unoptimized
                  />
                  <span className={styles.posterShade} aria-hidden="true" />

                  {hasVideo ? (
                    <span className={styles.playControl} aria-hidden="true">
                      <span className={styles.playDisc}>
                        <Play size={18} fill="currentColor" strokeWidth={0} />
                      </span>
                      <span className={styles.playLabel}>Play message</span>
                    </span>
                  ) : (
                    <span className={styles.pendingBadge}>
                      <Clapperboard size={14} aria-hidden="true" />
                      Message arriving soon
                    </span>
                  )}
                </button>
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.avatar} aria-hidden="true">
                <User size={16} strokeWidth={1.6} />
              </div>
              <div className={styles.infoText}>
                <p className={styles.name}>{video.name}</p>
                <p className={styles.meta}>
                  {video.note ? video.note : "Birthday message"}
                  {hasVideo ? " · ready to watch" : ""}
                </p>
              </div>
              <span className={styles.index}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
