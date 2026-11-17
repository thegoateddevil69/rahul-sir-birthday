import type { Metadata } from "next";
import { Film } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import VideoGallery from "@/components/VideoGallery";
import { studentVideos } from "@/data/students";
import styles from "./students.module.css";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Short birthday video messages from students, recorded with gratitude for Rahul Sir.",
};

export default function StudentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Video messages"
        title={
          <>
            In their <em>own words.</em>
          </>
        }
        description="Short messages from the students you have taught, recorded for your birthday. Each one is a little thank-you, a small story, and a wish for the year ahead."
        meta={`${String(studentVideos.length).padStart(2, "0")} messages from the class`}
        mark="02"
      />

      <section className={styles.section}>
        <div className={styles.inner}>
          <VideoGallery videos={studentVideos} />

          <div className={styles.note}>
            <Film size={18} strokeWidth={1.5} aria-hidden="true" />
            <p>
              More messages will appear here as they are recorded and added by the class.
              Each card becomes playable the moment its video arrives.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
