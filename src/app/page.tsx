import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clapperboard,
  Heart,
} from "lucide-react";
import HeroArt from "@/components/HeroArt";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import { studentVideos } from "@/data/students";
import styles from "./page.module.css";

const parts = [
  {
    href: "/students",
    number: "01",
    title: "Messages",
    description: "Short birthday videos from the students you have taught.",
    meta: `${String(studentVideos.length).padStart(2, "0")} video messages`,
    icon: Clapperboard,
  },
  {
    href: "/tribute",
    number: "02",
    title: "The Tribute",
    description: "A final birthday letter from all of us, to you.",
    meta: site.className,
    icon: Heart,
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Reveal>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowRule} aria-hidden="true" />
                A birthday tribute · 2026
              </p>
            </Reveal>

            <h1 className={styles.title}>
              <span className={styles.titleLine}>
                <span>Happy</span>
              </span>
              <span className={styles.titleLine}>
                <span>birthday,</span>
              </span>
              <span className={`${styles.titleLine} ${styles.titleAccent}`}>
                <span>
                  <em>{site.teacherName}.</em>
                </span>
              </span>
            </h1>

            <Reveal delay={0.1}>
              <p className={styles.lead}>
                For the teacher who made mathematics feel like a language and computing feel
                like a superpower — a small tribute from all of us.
              </p>

              <div className={styles.dateRow}>
                <span className={styles.dateIcon} aria-hidden="true">
                  <CalendarDays size={18} strokeWidth={1.6} />
                </span>
                <p className={styles.dateText}>
                  <strong>{site.birthdayFull}</strong>
                  <span>Happy birthday, {site.teacherName}.</span>
                </p>
              </div>

              <div className={styles.actions}>
                <Link href="/tribute" className={styles.primaryButton}>
                  Read the class tribute
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="/students" className={styles.secondaryButton}>
                  Watch the messages
                </Link>
              </div>
            </Reveal>
          </div>

          <HeroArt />
        </div>
      </section>

      <section className={styles.noteSection} aria-labelledby="note-heading">
        <div className={styles.noteInner}>
          <Reveal>
            <p className={styles.centreLabel}>
              <span className={styles.labelRule} aria-hidden="true" />
              A note from the class
              <span className={styles.labelRule} aria-hidden="true" />
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <blockquote className={styles.quote} id="note-heading">
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              You made equations feel like stories, and code feel like possibility. More than
              the subjects, you taught us to be curious — and that is the lesson we will keep.
            </blockquote>
            <p className={styles.signature}>
              — {site.className}
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.partsSection} aria-labelledby="parts-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <Reveal>
              <p className={styles.label}>
                <span className={styles.labelRule} aria-hidden="true" />
                The tribute
              </p>
              <h2 className={styles.sectionTitle} id="parts-heading">
                Every part of this, <em>for you.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={styles.sectionIntro}>
                Browse at your own pace. This is our way of saying thank you — one
                message, one moment at a time.
              </p>
            </Reveal>
          </div>

          <div className={styles.partsGrid}>
            {parts.map((part, index) => {
              const Icon = part.icon;
              return (
                <Reveal key={part.href} delay={index * 0.06}>
                  <Link href={part.href} className={styles.partCard}>
                    <div className={styles.partTop}>
                      <span className={styles.partNumber}>{part.number}</span>
                      <span className={styles.partIcon} aria-hidden="true">
                        <Icon size={19} strokeWidth={1.5} />
                      </span>
                    </div>
                    <h3 className={styles.partTitle}>{part.title}</h3>
                    <p className={styles.partDescription}>{part.description}</p>
                    <div className={styles.partFoot}>
                      <span className={styles.partMeta}>{part.meta}</span>
                      <span className={styles.partArrow} aria-hidden="true">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.bannerSection}>
        <div className={styles.container}>
          <Reveal>
            <div className={styles.banner}>
              <span className={styles.bannerMark} aria-hidden="true">
                “
              </span>
              <p className={styles.bannerQuote}>
                Some teachers teach a subject.
                <br />
                <em>You taught us how to think.</em>
              </p>
              <Link href="/tribute" className={styles.bannerLink}>
                Read the class tribute
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
