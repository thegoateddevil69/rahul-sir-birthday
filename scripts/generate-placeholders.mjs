import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const glyphs = ["∑", "π", "∫", "∞", "√", "Δ", "λ", "{ }", "</>"];
const palettes = [
  ["#0b1220", "#111a2e", "#22d3ee"],
  ["#08101d", "#121c33", "#7dd3fc"],
  ["#0a1424", "#101b31", "#a78bfa"],
  ["#07111f", "#0f1b30", "#34d399"],
  ["#0b1322", "#132038", "#22d3ee"],
  ["#091221", "#121d34", "#a78bfa"],
];

function frame(w, h, i, palette) {
  const [light, mid, accent] = palette;
  return `
  <defs>
    <linearGradient id="bg-${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${mid}"/>
    </linearGradient>
    <radialGradient id="glow-${i}" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid-${i}" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M52 0H0V52" fill="none" stroke="#7dd3fc" stroke-opacity="0.12"/>
    </pattern>
  </defs>`;
}

function gallerySvg(i, glyph, palette) {
  const index = String(i + 1).padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125" role="img">
  ${frame(900, 1125, i, palette)}
  <rect width="900" height="1125" fill="url(#bg-${i})"/>
  <rect width="900" height="1125" fill="url(#grid-${i})"/>
  <rect width="900" height="1125" fill="url(#glow-${i})"/>
  <rect x="30" y="30" width="840" height="1065" fill="none" stroke="${palette[2]}" stroke-opacity="0.4"/>
  <rect x="42" y="42" width="816" height="1041" fill="none" stroke="#7dd3fc" stroke-opacity="0.18"/>
  <circle cx="450" cy="520" r="248" fill="none" stroke="${palette[2]}" stroke-opacity="0.28"/>
  <circle cx="450" cy="520" r="286" fill="none" stroke="${palette[2]}" stroke-opacity="0.14" stroke-dasharray="2 10"/>
  <path d="M204 700 C 300 430, 600 430, 696 700" fill="none" stroke="#a78bfa" stroke-opacity="0.22"/>
  <circle cx="696" cy="700" r="5" fill="${palette[2]}" fill-opacity="0.6"/>
  <circle cx="204" cy="700" r="5" fill="${palette[2]}" fill-opacity="0.6"/>
  <text x="450" y="590" text-anchor="middle" font-family="monospace" font-weight="600" font-size="210" fill="${palette[2]}" fill-opacity="0.55">${glyph}</text>
  <text x="70" y="100" font-family="monospace" font-size="20" letter-spacing="4" fill="#b7c7e6" fill-opacity="0.85">RAHUL SIR · A TRIBUTE</text>
  <text x="830" y="100" text-anchor="end" font-family="monospace" font-size="18" letter-spacing="3" fill="#7f93b8" fill-opacity="0.9">${index}</text>
  <line x1="70" y1="1000" x2="830" y2="1000" stroke="${palette[2]}" stroke-opacity="0.35"/>
  <text x="70" y="1046" font-family="monospace" font-size="20" letter-spacing="3" fill="#b7c7e6" fill-opacity="0.85">PHOTOGRAPH ${index}</text>
  <text x="830" y="1046" text-anchor="end" font-family="monospace" font-size="18" letter-spacing="3" fill="#7f93b8" fill-opacity="0.9">30 · 11 · 2026</text>
</svg>`;
}

function videoSvg(i, glyph, palette) {
  const index = String(i + 1).padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img">
  ${frame(1280, 720, 100 + i, palette)}
  <rect width="1280" height="720" fill="url(#bg-${100 + i})"/>
  <rect width="1280" height="720" fill="url(#grid-${100 + i})"/>
  <rect width="1280" height="720" fill="url(#glow-${100 + i})"/>
  <rect x="26" y="26" width="1228" height="668" fill="none" stroke="${palette[2]}" stroke-opacity="0.38"/>
  <circle cx="640" cy="330" r="156" fill="none" stroke="${palette[2]}" stroke-opacity="0.3"/>
  <circle cx="640" cy="330" r="184" fill="none" stroke="#a78bfa" stroke-opacity="0.16" stroke-dasharray="2 10"/>
  <text x="640" y="398" text-anchor="middle" font-family="monospace" font-weight="600" font-size="160" fill="${palette[2]}" fill-opacity="0.5">${glyph}</text>
  <text x="62" y="82" font-family="monospace" font-size="20" letter-spacing="4" fill="#b7c7e6" fill-opacity="0.85">A MESSAGE FOR RAHUL SIR</text>
  <text x="1218" y="82" text-anchor="end" font-family="monospace" font-size="18" letter-spacing="3" fill="#7f93b8" fill-opacity="0.9">${index}</text>
  <line x1="62" y1="632" x2="1218" y2="632" stroke="${palette[2]}" stroke-opacity="0.32"/>
  <text x="62" y="676" font-family="monospace" font-size="20" letter-spacing="4" fill="#b7c7e6" fill-opacity="0.85">STUDENT ${index}</text>
  <text x="1218" y="676" text-anchor="end" font-family="monospace" font-size="18" letter-spacing="3" fill="#7f93b8" fill-opacity="0.9">VIDEO MESSAGE</text>
</svg>`;
}

for (let i = 0; i < 9; i++) {
  const palette = palettes[i % palettes.length];
  fs.writeFileSync(
    path.join(outDir, `gallery-${String(i + 1).padStart(2, "0")}.svg`),
    gallerySvg(i, glyphs[i], palette),
  );
  fs.writeFileSync(
    path.join(outDir, `video-${String(i + 1).padStart(2, "0")}.svg`),
    videoSvg(i, glyphs[i], palette),
  );
}

console.log("Generated 18 placeholder illustrations in public/images");
