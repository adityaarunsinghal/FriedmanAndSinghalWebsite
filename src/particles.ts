interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

/** The personal site's quiet, pointer-following constellation background. */
export function startParticles(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const particles: Particle[] = [];
  const frameDuration = 1000 / 30;
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let frame = 0;
  let lastFrame = 0;
  let suspended = false;

  function draw(): void {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ddd";
    context.strokeStyle = "rgb(221 221 221 / 55%)";
    context.lineWidth = 0.2;
    context.beginPath();
    for (const dot of particles) {
      context.moveTo(dot.x + dot.radius, dot.y);
      context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    }
    context.fill();

    const reach = Math.max(width, height) / 10;
    const distance = Math.max(width, height) / 25;
    context.beginPath();
    for (let i = 0; i < particles.length; i++) {
      const from = particles[i];
      if (
        !from ||
        Math.abs(from.x - pointerX) > reach ||
        Math.abs(from.y - pointerY) > reach
      ) {
        continue;
      }
      for (let j = i + 1; j < particles.length; j++) {
        const to = particles[j];
        if (
          to &&
          Math.abs(from.x - to.x) < distance &&
          Math.abs(from.y - to.y) < distance
        ) {
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
        }
      }
    }
    context.stroke();
  }

  function resize(): void {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (!nextWidth || !nextHeight) return;

    for (const dot of particles) {
      dot.x *= nextWidth / (width || nextWidth);
      dot.y *= nextHeight / (height || nextHeight);
    }
    width = nextWidth;
    height = nextHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(
      finePointer.matches ? 350 : 180,
      Math.ceil(width / 3),
    );
    particles.length = Math.min(particles.length, count);
    while (particles.length < count) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random(),
      });
    }
    if (!pointerActive) {
      pointerX = width / 2;
      pointerY = height / 2;
    }
    draw();
  }

  function animate(now: number): void {
    frame = 0;
    if (suspended || document.hidden || motion.matches) return;
    const elapsed = now - lastFrame;
    if (elapsed >= frameDuration) {
      const step = Math.min(elapsed / frameDuration, 2);
      lastFrame = now - (elapsed % frameDuration);
      for (const dot of particles) {
        dot.x += dot.vx * step;
        dot.y += dot.vy * step;
        if (dot.x < 0 || dot.x > width) {
          dot.x = Math.max(0, Math.min(width, dot.x));
          dot.vx *= -1;
        }
        if (dot.y < 0 || dot.y > height) {
          dot.y = Math.max(0, Math.min(height, dot.y));
          dot.vy *= -1;
        }
      }
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function updateAnimation(): void {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = performance.now();
    if (suspended || document.hidden) return;
    resize();
    if (!motion.matches) frame = requestAnimationFrame(animate);
  }

  addEventListener("resize", resize, { passive: true });
  addEventListener(
    "pointermove",
    (event: PointerEvent) => {
      if (!finePointer.matches || motion.matches) return;
      pointerActive = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { passive: true },
  );
  addEventListener(
    "pointerdown",
    (event: PointerEvent) => {
      if (motion.matches) return;
      pointerActive = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { passive: true },
  );
  addEventListener("pointerout", (event: PointerEvent) => {
    if (event.relatedTarget) return;
    pointerActive = false;
    pointerX = width / 2;
    pointerY = height / 2;
  });
  document.addEventListener("visibilitychange", updateAnimation);
  motion.addEventListener("change", updateAnimation);
  finePointer.addEventListener("change", updateAnimation);
  addEventListener("pagehide", () => {
    suspended = true;
    cancelAnimationFrame(frame);
  });
  addEventListener("pageshow", () => {
    suspended = false;
    updateAnimation();
  });
  updateAnimation();
}
