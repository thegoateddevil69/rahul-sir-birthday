import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";
import { site } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Messages" },
  { href: "/tribute", label: "Tribute" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.watermark} aria-hidden="true">
        R
      </span>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.rule} aria-hidden="true" />
              With gratitude
            </p>
            <p className={styles.title}>
              Happy birthday, <em>Rahul Sir.</em>
            </p>
            <p className={styles.note}>
              Thank you for the lessons that stayed long after the bell.
            </p>
          </div>
          <Link href="/tribute" className={styles.cta}>
            Read the class tribute
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.bottom}>
          <p className={styles.meta}>
            © 2026 · {site.className}
          </p>
          <nav className={styles.footerNav} aria-label="Footer">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className={styles.meta}>Made with respect &amp; gratitude by your students.</p>
        </div>
      </div>
    </footer>
  );
}
