import React, { useEffect, useRef } from 'react';

type Props = {
  className?: string;
};

const NUM_PARTICLES = 60;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const ParticlesBackground: React.FC<Props> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasEl = canvas as HTMLCanvasElement;
    const ctxEl = ctx as CanvasRenderingContext2D;

    let width = 0;
    let height = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const particles = Array.from({ length: NUM_PARTICLES }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: rand(-0.0005, 0.0005),
      vy: rand(-0.0005, 0.0005),
      r: rand(0.6, 1.8),
    }));

    function resize() {
      width = canvasEl.clientWidth;
      height = canvasEl.clientHeight;
      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctxEl.clearRect(0, 0, width, height);
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < Math.min(width, height) * 0.18) {
            const alpha = 0.12 * (1 - dist / (Math.min(width, height) * 0.18));
            ctxEl.beginPath();
            ctxEl.moveTo(a.x * width, a.y * height);
            ctxEl.lineTo(b.x * width, b.y * height);
            ctxEl.strokeStyle = `rgba(84, 144, 255, ${alpha})`;
            ctxEl.lineWidth = 0.6;
            ctxEl.stroke();
          }
        }
      }

      // draw particles
      for (const p of particles) {
        ctxEl.beginPath();
        ctxEl.fillStyle = 'rgba(84,144,255,0.95)';
        ctxEl.globalAlpha = 0.95;
        ctxEl.arc(p.x * width, p.y * height, p.r * 1.8, 0, Math.PI * 2);
        ctxEl.fill();
        ctxEl.globalAlpha = 1;
      }
    }

    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      for (const p of particles) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        if (p.x < 0) p.x = 0;
        if (p.y < 0) p.y = 0;
        if (p.x > 1) p.x = 1;
        if (p.y > 1) p.y = 1;
        // slight oscillation
        p.vx += rand(-0.00008, 0.00008);
        p.vy += rand(-0.00008, 0.00008);
        p.vx = Math.max(-0.0012, Math.min(0.0012, p.vx));
        p.vy = Math.max(-0.0012, Math.min(0.0012, p.vy));
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />;
};

export default ParticlesBackground;
