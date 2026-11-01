import { getCelebrationMessage } from "./celebration";
import { startParticles } from "./particles";

const canvas = document.querySelector<HTMLCanvasElement>("#particles");
if (canvas) startParticles(canvas);

const button = document.querySelector<HTMLButtonElement>("#greeting-button");
const greeting = document.querySelector<HTMLElement>("#greeting");
const celebration = document.querySelector<HTMLElement>("#celebration");

button?.addEventListener(
  "click",
  async () => {
    if (!greeting || !celebration) return;

    celebration.textContent = getCelebrationMessage();
    greeting.hidden = true;
    celebration.hidden = false;
    celebration.focus({ preventScroll: true });

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      // Fetch the celebration effect only after someone discovers the greeting.
      const { default: confetti } = await import("canvas-confetti");
      const options = {
        particleCount: 90,
        spread: 85,
        startVelocity: 36,
        ticks: 200,
        gravity: 0.85,
        colors: ["#ffe2a8", "#c5d5ff", "#f7abc7", "#ffffff"],
        disableForReducedMotion: true,
      };

      void confetti({ ...options, angle: 60, origin: { x: 0, y: 0.65 } });
      void confetti({ ...options, angle: 120, origin: { x: 1, y: 0.65 } });
    } catch {
      // The message still appears if the optional animation cannot be loaded.
    }
  },
  { once: true },
);
