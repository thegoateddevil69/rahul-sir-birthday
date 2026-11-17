import {
  PARTICLE_FAR,
  PARTICLE_NEAR,
  clamp,
  getFocal,
  type Camera,
  type IntroEnv,
} from "./projection";

/** Gold, purple and blue accents shared by the dotted field and its streaks. */
const DOT_COLORS = ["#f3d59a", "#b990f5", "#86a9ff"] as const;
const STREAK_COLORS = ["#ffe6b8", "#d7b7ff", "#aec9ff"] as const;

type Particle = {
  x: number;
  y: number;
  z: number;
  /** World-space size, scaled by perspective when projected. */
  size: number;
  /** 0 = far / dim, 1 = mid, 2 = near / bright. */
  tone: 0 | 1 | 2;
  /** Accent colour: 0 = gold, 1 = purple, 2 = blue. */
  color: 0 | 1 | 2;
  vx: number;
  vy: number;
  phase: number;
  /** Projected screen position from the previous frame (for motion blur). */
  psx: number;
  psy: number;
  hasPrev: boolean;
  sx: number;
  sy: number;
  sizeScreen: number;
  alpha: number;
  streak: number;
};

/**
 * Pooled Canvas 2D particle field.
 *
 * The camera moves forward through static world-space particles. Perspective
 * projection makes particles grow and radiate outward as their depth decreases,
 * which creates the illusion of 3D travel without any 3D engine.
 */
export class ParticleEngine {
  width = 0;
  height = 0;
  focal = 800;

  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private buckets: number[][] = [[], [], []];
  private dpr = 1;
  private lastTime = 0;
  private destroyed = false;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.ctx = ctx;
    this.resize();
    window.addEventListener("resize", this.resize, { passive: true });
  }

  resize = () => {
    if (this.destroyed) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.focal = getFocal(this.width, this.height);

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.initParticles();
  };

  private spawnX() {
    const half = (this.width * 0.5 * PARTICLE_FAR) / this.focal;
    return half * 1.35;
  }

  private spawnY() {
    const half = (this.height * 0.5 * PARTICLE_FAR) / this.focal;
    return half * 1.35;
  }

  private spawn(particle: Particle, z: number) {
    particle.x = (Math.random() * 2 - 1) * this.spawnX();
    particle.y = (Math.random() * 2 - 1) * this.spawnY();
    particle.z = z;
    particle.hasPrev = false;
  }

  private initParticles() {
    const area = this.width * this.height;
    const isMobile = this.width < 768;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;

    let count = isMobile ? 1800 : 6000;
    // Scale gently with viewport area so very large / very small screens stay balanced.
    count *= Math.pow(clamp(area / (1440 * 900), 0.45, 1.8), 0.4);
    if (memory <= 2 || cores <= 2) count *= 0.62;
    count = Math.round(clamp(count, 640, 7200));

    this.particles = new Array(count);
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      const tone: 0 | 1 | 2 = roll < 0.56 ? 0 : roll < 0.86 ? 1 : 2;
      const colorRoll = Math.random();
      const color: 0 | 1 | 2 = colorRoll < 0.4 ? 0 : colorRoll < 0.7 ? 1 : 2;
      const particle: Particle = {
        x: 0,
        y: 0,
        z: 0,
        size: tone === 2 ? 2.2 + Math.random() * 2.6 : 1 + Math.random() * 1.7,
        tone,
        color,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        psx: 0,
        psy: 0,
        hasPrev: false,
        sx: 0,
        sy: 0,
        sizeScreen: 1,
        alpha: 0,
        streak: 0,
      };
      this.spawn(particle, PARTICLE_NEAR + Math.random() * (PARTICLE_FAR - PARTICLE_NEAR));
      this.particles[i] = particle;
    }
  }

  /** Draw one still frame (used by the reduced-motion experience). */
  renderOnce() {
    const stillCamera: Camera = { x: 0, y: 0, z: 0, roll: 0 };
    const stillEnv: IntroEnv = { appearance: 1, opacity: 0.55, calm: 1, disperse: 0 };
    this.draw(stillCamera, stillEnv, false);
  }

  render(camera: Camera, env: IntroEnv) {
    this.draw(camera, env, true);
  }

  private draw(camera: Camera, env: IntroEnv, animate: boolean) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    if (env.opacity <= 0.001 || env.appearance <= 0.001) return;

    const now = performance.now();
    const dtScale = animate
      ? clamp((now - (this.lastTime || now)) / 16.667, 0.2, 2)
      : 0;
    this.lastTime = now;

    const t = now * 0.001;
    const drift = animate ? 1 : 0;
    const calmFactor = 1 - env.calm * 0.3;
    const disperse = env.disperse;

    for (let i = 0; i < this.buckets.length; i++) this.buckets[i].length = 0;

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (animate) {
        // A gentle flow field keeps the environment alive without feeling like
        // a flat particle sheet sliding across the screen.
        p.x += (p.vx + Math.sin(p.y * 0.0016 + t * 0.55) * 0.13) * dtScale * drift;
        p.y += (p.vy + Math.cos(p.x * 0.0014 + t * 0.48) * 0.1) * dtScale * drift;
      }

      let depth = p.z - camera.z;
      if (depth <= PARTICLE_NEAR) {
        this.spawn(p, camera.z + PARTICLE_FAR - Math.random() * 280);
        depth = p.z - camera.z;
      }

      const scale = this.focal / depth;
      const sx = cx + (p.x - camera.x) * scale;
      const sy = cy + (p.y - camera.y) * scale;

      // Recycle particles that have swept off screen while still relatively far,
      // keeping density near the camera path and saving draw calls.
      if (
        depth < PARTICLE_FAR * 0.62 &&
        (sx < -240 || sx > this.width + 240 || sy < -240 || sy > this.height + 240)
      ) {
        this.spawn(p, camera.z + PARTICLE_FAR - Math.random() * 280);
        continue;
      }

      const farFade = clamp((PARTICLE_FAR - depth) / (PARTICLE_FAR * 0.42), 0, 1);
      const nearFade = clamp((depth - PARTICLE_NEAR) / (PARTICLE_NEAR * 4), 0, 1);
      const twinkle = 0.78 + Math.sin(t * 1.5 + p.phase) * 0.22;
      const layerAlpha = p.tone === 0 ? 0.17 : p.tone === 1 ? 0.28 : 0.44;

      p.sx = sx;
      p.sy = sy;
      p.sizeScreen = clamp(p.size * scale, 0.7, p.tone === 2 ? 7 : 4.2);
      p.alpha =
        layerAlpha *
        farFade *
        nearFade *
        twinkle *
        env.appearance *
        env.opacity *
        calmFactor *
        (1 - disperse * 0.15);

      if (p.tone === 2 && animate && p.hasPrev) {
        p.streak = Math.min(26, Math.hypot(sx - p.psx, sy - p.psy));
      } else {
        p.streak = 0;
      }

      if (animate) {
        p.psx = sx;
        p.psy = sy;
        p.hasPrev = true;
      }

      this.buckets[p.color].push(i);
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(camera.roll);
    ctx.translate(-cx, -cy);
    ctx.globalCompositeOperation = "lighter";

    for (let c = 0; c < 3; c++) {
      this.drawDots(c, DOT_COLORS[c]);
      this.drawStreaks(c, STREAK_COLORS[c]);
    }

    ctx.restore();
  }

  private drawDots(bucket: number, color: string) {
    const ctx = this.ctx;
    const indices = this.buckets[bucket];
    ctx.fillStyle = color;
    for (let j = 0; j < indices.length; j++) {
      const p = this.particles[indices[j]];
      if (p.alpha <= 0.004) continue;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.sx, p.sy, p.sizeScreen, p.sizeScreen);
    }
    ctx.globalAlpha = 1;
  }

  private drawStreaks(bucket: number, color: string) {
    const ctx = this.ctx;
    const indices = this.buckets[bucket];

    // Motion-blur streaks: a short line from the previous projected position.
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.15;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let j = 0; j < indices.length; j++) {
      const p = this.particles[indices[j]];
      if (p.streak > 2.5) {
        ctx.moveTo(p.psx, p.psy);
        ctx.lineTo(p.sx, p.sy);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  destroy() {
    this.destroyed = true;
    window.removeEventListener("resize", this.resize);
    this.particles = [];
    this.buckets = [[], [], []];
  }
}
