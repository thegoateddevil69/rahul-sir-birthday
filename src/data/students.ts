export type StudentVideo = {
  id: string;
  name: string;
  /** Add a file in /public/videos and point to it here, e.g. "/videos/student-01.mp4". */
  videoSrc?: string;
  poster: string;
  /** Optional short label, e.g. a section or house. */
  note?: string;
};

/**
 * Placeholder names and posters are used until contributions arrive.
 * When a video is ready, add it to /public/videos and set `videoSrc`.
 * Cards with a video automatically become playable.
 */
export const studentVideos: StudentVideo[] = [
  { id: "student-01", name: "Student 01", poster: "/images/video-01.svg" },
  { id: "student-02", name: "Student 02", poster: "/images/video-02.svg" },
  { id: "student-03", name: "Student 03", poster: "/images/video-03.svg" },
  { id: "student-04", name: "Student 04", poster: "/images/video-04.svg" },
  { id: "student-05", name: "Student 05", poster: "/images/video-05.svg" },
  { id: "student-06", name: "Student 06", poster: "/images/video-06.svg" },
  { id: "student-07", name: "Student 07", poster: "/images/video-07.svg" },
  { id: "student-08", name: "Student 08", poster: "/images/video-08.svg" },
  { id: "student-09", name: "Student 09", poster: "/images/video-09.svg" },
];

export const participantNames = studentVideos.map((student) => student.name);
