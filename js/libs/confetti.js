/*
    confetti.js — simple confetti cannon without dependencies
    -----------------------------------------------------------
    • Adds a canvas overlay layer
    • Fires a “basic cannon” salvo when the Enter key is pressed
    • API: window.ConfettiCannon.fire(options)

    Integration into HTML:
        <script src="confetti.js" defer></script>

    Optional in the code to fire manually:
        window.ConfettiCannon.fire({ particleCount: 120, spread: 70 });
*/

(function () {
    'use strict';

    const DEFAULT_COLORS = [
        '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'
    ];

    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';

    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '99999'
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.body.contains(canvas)) document.body.appendChild(canvas);
    });

    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0, height = 0;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        // Nutzerkoordinaten = CSS-Pixel
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    let rafId = null;

    function rand(min, max) { return Math.random() * (max - min) + min; }
    function toRad(deg) { return (deg * Math.PI) / 180; }

    function createParticle(x, y, angle, speed, options) {
        const size = rand(6, 12) * options.scalar;
        const color = options.colors[Math.floor(Math.random() * options.colors.length)];
        const shape = options.shapes[Math.floor(Math.random() * options.shapes.length)];

        return {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            color,
            shape,
            rotation: rand(-Math.PI, Math.PI),
            angular: rand(-0.3, 0.3),
            life: 0,
            ticks: options.ticks,
            decay: options.decay,
            gravity: options.gravity,
            alpha: 1
        };
    }

    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        const s = p.size;

        if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // square
            ctx.fillRect(-s / 2, -s / 2, s, s);
        }

        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // Physik: Luftwiderstand/Abklingen & Schwerkraft
            p.vx *= p.decay;
            p.vy *= p.decay;
            p.vy += p.gravity * 0.12;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.angular;

            p.life += 1;
            p.alpha = Math.max(0, 1 - p.life / p.ticks);

            // Entfernen, wenn unsichtbar
            if (p.y - p.size > height || p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            drawParticle(p);
        }

        if (particles.length > 0) {
            rafId = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(rafId);
            rafId = null;
            ctx.clearRect(0, 0, width, height);
        }
    }

    function fire(userOptions = {}) {
        const defaults = {
            particleCount: 80,
            angle: 90,            // Abschusswinkel (90° = nach oben)
            spread: 60,           // Streuwinkel (Grad)
            startVelocity: 45,    // Anfangsgeschwindigkeit
            decay: 0.9,           // Abklingen/Drag pro Frame
            gravity: 1.5,         // Schwerkraft (höher = schneller nach unten)
            scalar: 1,            // globale Skalierung für Partikelgröße
            ticks: 200,           // Lebensdauer
            origin: { x: 0.5, y: 0.7 },
            shapes: ['square', 'circle'],
            colors: DEFAULT_COLORS
        };

        const options = {
            ...defaults,
            ...userOptions,
            origin: { ...defaults.origin, ...(userOptions.origin || {}) },
            shapes: userOptions.shapes || defaults.shapes,
            colors: userOptions.colors || defaults.colors
        };

        const angleRad = toRad(options.angle);
        const spreadRad = toRad(options.spread);

        const originX = width * options.origin.x;
        const originY = height * options.origin.y;

        for (let i = 0; i < options.particleCount; i++) {
            const theta = angleRad + (Math.random() - 0.5) * spreadRad;
            const speed = options.startVelocity * (0.5 + Math.random() * 0.5);
            particles.push(createParticle(originX, originY, theta, speed, options));
        }

        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    // Enter-Handler (verhindert Auslösung in Form-Submits)
    function handleEnter(e) {
        const key = e.key || e.code || e.keyCode;
        const isEnter = key === 'Enter' || key === 'NumpadEnter' || key === 13;
        if (!isEnter) return;

        const active = document.activeElement;
        const tag = active && active.tagName;
        const editable = active && (active.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
        if (editable) return;

        fire({ particleCount: 120, spread: 100, origin: { x: 0.5, y: -0.1 } });
    }

    document.addEventListener('keydown', handleEnter);

    // API bereitstellen
    window.ConfettiCannon = {
        fire,
        canvas,
        destroy() {
            document.removeEventListener('keydown', handleEnter);
            if (rafId) cancelAnimationFrame(rafId);
            particles.length = 0;
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
    };
})();
