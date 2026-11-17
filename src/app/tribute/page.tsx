import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import { participantNames } from "@/data/students";
import styles from "./tribute.module.css";

export const metadata: Metadata = {
  title: "Tribute",
  description:
    "A collective birthday message from the class to Rahul Sir — with gratitude, respect and admiration.",
};

export default function TributePage() {
  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <Reveal>
          <p className={styles.eyebrow}>
            <span className={styles.rule} aria-hidden="true" />
            A final word
            <span className={styles.rule} aria-hidden="true" />
          </p>
          <h1 className={styles.title}>
            For you,
            <br />
            <em>Rahul Sir.</em>
          </h1>
          <p className={styles.date}>Happy birthday · {site.birthdayFull}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className={styles.letter}>
            <p>
              Some teachers teach a subject. The rare ones teach you how to see — how a proof
              can be beautiful, how a problem can be patient, and how an idea, once
              understood, can change the way you move through the world.
            </p>
            <p>
              In your classes, mathematics was never just numbers on a board, and computing
              was never just lines on a screen. They were ways of thinking clearly, of being
              curious, of trying again. You made difficult things feel possible, and you
              made all of us feel that we were capable of more than we knew.
            </p>
            <p>
              On your birthday, we wanted to give something back — not as grand as what you
              have given us, but honest. These messages are small pieces of a much larger
              thank you.
            </p>
            <p className={styles.closing}>
              We wish you a year of good health, quiet joys, and the same wonder you bring
              into every room. Happy birthday, Rahul Sir.
            </p>

            <div className={styles.signoff}>
              <span className={styles.signRule} aria-hidden="true" />
              <p>
                With respect, affection, and gratitude,
                <br />
                <strong>{site.className}</strong>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <section className={styles.namesSection} aria-labelledby="participants-heading">
            <div className={styles.namesHead}>
              <p className={styles.sectionLabel}>
                <span className={styles.smallRule} aria-hidden="true" />
                With love from
              </p>
              <h2 className={styles.sectionTitle} id="participants-heading">
                Every one of us.
              </h2>
            </div>

            <ul className={styles.namesGrid}>
              {participantNames.map((name) => (
                <li key={name} className={styles.nameItem}>
                  {name}
                </li>
              ))}
            </ul>
            <p className={styles.namesNote}>
              Names will be added here as each student’s contribution is collected.
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.16}>
          <div className={styles.finale}>
            <Heart size={18} className={styles.heart} aria-hidden="true" />
            <p className={styles.finaleText}>
              Happy birthday, <em>{site.teacherName}.</em>
            </p>
            <p className={styles.finaleSub}>Thank you for everything.</p>
            <Link href="/" className={styles.homeLink}>
              <ArrowLeft size={15} aria-hidden="true" />
              Return home
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
