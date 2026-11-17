import Reveal from "./Reveal";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  meta?: string;
  mark?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  mark,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {mark ? (
        <span className={styles.mark} aria-hidden="true">
          {mark}
        </span>
      ) : null}

      <div className={styles.inner}>
        <Reveal>
          <p className={styles.eyebrow}>
            <span className={styles.rule} aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
          {meta ? (
            <p className={styles.meta}>
              <span className={styles.dot} aria-hidden="true" />
              {meta}
            </p>
          ) : null}
        </Reveal>
      </div>
    </header>
  );
}
