/* HERO CANVAS */
        const canvas = document.getElementById('hero-canvas');
        const ctx = canvas.getContext('2d');
        let W, H;
        function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
        resize(); window.addEventListener('resize', resize);
        class Dot {
            constructor() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .38; this.vy = (Math.random() - .5) * .38; this.r = Math.random() * 1.8 + .5; this.a = Math.random() * .5 + .15; }
            update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,212,255,${this.a})`; ctx.fill(); }
        }
        const dots = Array.from({ length: 65 }, () => new Dot());
        function drawLines() {
            for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d = Math.sqrt(dx * dx + dy * dy);
                if (d < 115) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = `rgba(0,212,255,${.12 * (1 - d / 115)})`; ctx.lineWidth = .8; ctx.stroke(); }
            }
        }
        (function anim() { ctx.clearRect(0, 0, W, H); dots.forEach(d => { d.update(); d.draw(); }); drawLines(); requestAnimationFrame(anim); })();

        /* SCROLL REVEAL */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-label,.section-title,.section-sub,.believe-card,.cta-box,.step,.mission-text,.mission-visual').forEach((el, i) => {
            const parent = el.closest('.believe-grid');
            if (parent) { const idx = Array.from(parent.children).indexOf(el); el.style.transitionDelay = (idx * 90) + 'ms,' + (idx * 90) + 'ms'; }
            obs.observe(el);
        });

        /* MAGNETIC BUTTONS */
        document.querySelectorAll('.btn-primary,.btn-cta,.btn-dark').forEach(btn => {
            btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .1}px,${(e.clientY - r.top - r.height / 2) * .1}px)`; });
            btn.addEventListener('mouseleave', () => btn.style.transform = '');
        });

        document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));