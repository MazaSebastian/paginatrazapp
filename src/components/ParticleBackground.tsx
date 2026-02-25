import { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        // Configuration
        const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 6000), 300); // Higher density
        const CONNECTION_DISTANCE = 140;
        const MOUSE_RADIUS = 250;

        interface Particle {
            x: number;
            y: number;
            vx: number; // Interaction velocity (decays)
            vy: number;
            baseVx: number; // Constant drift velocity (permanent)
            baseVy: number;
            size: number;
            color: string;
            density: number;
        }

        let particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000, active: false };

        // Emerald palette
        const colors = ['#22C55E', '#4ADE80', '#16A34A', '#86EFAC'];

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            particles = [];

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const size = Math.random() * 2 + 1;
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: 0,
                    // Constant movement (Faster)
                    baseVx: (Math.random() - 0.5) * 0.5,
                    baseVy: (Math.random() - 0.5) * 0.5,
                    size: size,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    density: (Math.random() * 20) + 1, // Interaction weight
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Mouse Glow
            if (mouse.active) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. Particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Interaction Physics
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < MOUSE_RADIUS) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

                        // Explosive Push
                        const push = force * p.density * 0.8;
                        p.vx -= forceDirectionX * push;
                        p.vy -= forceDirectionY * push;
                    }
                }

                // Update Position (Base Drift + Interaction Push)
                p.x += p.baseVx + p.vx;
                p.y += p.baseVy + p.vy;

                // Friction for interaction velocity only
                p.vx *= 0.94;
                p.vy *= 0.94;

                // Boundary Wrap (Seamless)
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connections
                for (let j = i; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        const opacity = 1 - (dist / CONNECTION_DISTANCE);
                        ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.25})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', init);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
        }

        init();
        draw();

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', init);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[1] pointer-events-none"
        />
    );
};
