/* NAV SCROLL */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* HERO PARTICLE NETWORK */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    if (ctx) {
        let W;
        let H;

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        class Dot {
            constructor() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.38;
                this.vy = (Math.random() - 0.5) * 0.38;
                this.r = Math.random() * 1.8 + 0.5;
                this.a = Math.random() * 0.5 + 0.15;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,212,255,${this.a})`;
                ctx.fill();
            }
        }

        const dots = Array.from({ length: 72 }, () => new Dot());

        const drawLines = () => {
            for (let i = 0; i < dots.length; i += 1) {
                for (let j = i + 1; j < dots.length; j += 1) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const d = Math.hypot(dx, dy);
                    if (d < 115) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(0,212,255,${0.13 * (1 - d / 115)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        (function animDots() {
            ctx.clearRect(0, 0, W, H);
            dots.forEach((dot) => {
                dot.update();
                dot.draw();
            });
            drawLines();
            requestAnimationFrame(animDots);
        }());
    }
}

/* SCROLL REVEAL */
const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

const revealEls = document.querySelectorAll('.section-label,.section-title,.section-sub,.feature,.service-card,.testi-card,.story-card,.cta-box,.stat,.testi-header h2');
revealEls.forEach((el) => {
    const parent = el.closest('.features-grid,.services-grid,.stats-bar,.testi-track,.stories-grid');
    const delay = parent ? `${Array.from(parent.children).indexOf(el) * 80}ms` : '0ms';
    el.style.transitionDelay = `${delay}, ${delay}`;
    obs.observe(el);
});

/* COUNTER */
const cntObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.target || 0);
            let start = null;

            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / 1800, 1);
                const ease = 1 - ((1 - p) ** 3);
                el.textContent = Math.floor(ease * target);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };

            requestAnimationFrame(step);
            cntObs.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach((el) => cntObs.observe(el));

/* TESTIMONIAL SLIDER */
(() => {
    const track = document.getElementById('testiTrack');
    const viewport = document.querySelector('.testi-viewport');
    const btnPrev = document.getElementById('testiPrev');
    const btnNext = document.getElementById('testiNext');
    const dotsWrap = document.getElementById('testiDots');
    const curEl = document.getElementById('testiCurrent');
    const totEl = document.getElementById('testiTotal');

    if (!track || !viewport || !btnPrev || !btnNext || !dotsWrap || !curEl || !totEl) return;

    const cards = [...track.querySelectorAll('.testi-card')];
    const total = cards.length;
    let idx = 0;
    let startX = 0;
    let maxIndex = 0;

    if (!total) return;

    totEl.textContent = total;
    dotsWrap.innerHTML = '';

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `testi-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const getTrackGap = () => {
        const styles = window.getComputedStyle(track);
        return Number.parseFloat(styles.gap || '0') || 0;
    };

    const getCardStep = () => {
        if (!cards[0]) return 0;
        return cards[0].getBoundingClientRect().width + getTrackGap();
    };

    const render = () => {
        const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
        const step = getCardStep();
        maxIndex = step > 0 ? Math.ceil(maxOffset / step) : 0;
        idx = Math.max(0, Math.min(idx, maxIndex));

        const offset = Math.min(maxOffset, idx * step);
        track.style.transform = `translateX(-${offset}px)`;

        [...dotsWrap.children].forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });

        curEl.textContent = String(Math.min(idx + 1, total));
        btnPrev.disabled = idx === 0;
        btnNext.disabled = idx >= maxIndex || maxOffset <= 1;
    };

    function goTo(n) {
        idx = Math.max(0, Math.min(n, maxIndex));
        render();
    }

    btnPrev.addEventListener('click', () => goTo(idx - 1));
    btnNext.addEventListener('click', () => goTo(idx + 1));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') goTo(idx - 1);
        if (event.key === 'ArrowRight') goTo(idx + 1);
    });

    track.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (event) => {
        const diff = startX - event.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? idx + 1 : idx - 1);
    }, { passive: true });

    window.addEventListener('resize', render);
    render();
})();

/* TILT ON SERVICE CARDS */
document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* MAGNETIC BUTTONS */
document.querySelectorAll('.btn-primary,.btn-cta,.btn-dark').forEach((btn) => {
    btn.addEventListener('mousemove', (event) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * 0.1}px,${(event.clientY - r.top - r.height / 2) * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* PREVENT DEFAULT */
document.querySelectorAll('a[href="#"]').forEach((a) => {
    a.addEventListener('click', (event) => event.preventDefault());
});

/* ═════════════════════════════════════════════
   TESTIMONIALS SHOWCASE — JS
   Needs the ts-* HTML skeleton already on the
   page (see testimonials-section.html).
   ═════════════════════════════════════════════ */
(function () {
    const data = [
        {
            name: "Lara K.", role: "Owner, Shade Hub",
            quote: "He delivers every single one of my projects as soon as possible! I was hesitant at first, but they nailed it. AiGR0 is a professional — I think he may be the best I've experienced. I will continue using AiGR0 for the rest of my career.",
            initials: "LK", gradient: "linear-gradient(135deg,#0d7377,#0d9ba1)"
        },
        {
            name: "Ninya Z.", role: "San Diego, CA",
            quote: "Where do I begin? The amazing treatment I got was outstanding! Anuj made it very simple showing me the ins and outs, making my website exactly how I wanted it. I just love how it was perfectly put together. Thank you tons! Couldn't have done it without you!",
            initials: "NZ", gradient: "linear-gradient(135deg,#1a6b5a,#27a080)"
        },
        {
            name: "American Savings Z.", role: "Sacramento/Roseville, CA",
            quote: "Anuj and his Staff have gone above and beyond in catering to my website needs. They have been very accommodating and attentive to customization, making sure fonts, ideas, and formatting were exactly as desired. I couldn't be happier!",
            initials: "AS", gradient: "linear-gradient(135deg,#4a3a8c,#7c5cfc)"
        },
        {
            name: "John I.", role: "Australia",
            quote: "This agency was super helpful and very responsive to all my questions. I felt that they heard me and were able to help bring out the best in my business with their social ads. Arianna set clear goals from the start and kept us updated every step of the way.",
            initials: "JI", gradient: "linear-gradient(135deg,#4a3a8c,#7c5cfc)"
        },
        {
            name: "Zack", role: "Canada",
            quote: "I want to thank Anuj for helping me improve my digital IQ and significantly boosting my sales. Their expertise in digital marketing has been invaluable — from improving campaigns to better targeting and optimization.",
            initials: "Z", gradient: "linear-gradient(135deg,#4a3a8c,#7c5cfc)"
        },
        {
            name: "Frank R.", role: "Malaysia",
            quote: "One of the most helpful experiences I've ever had working with an agency. True problem solvers with a kind attitude! Had the best time working through some things. Huge shoutout and thanks to Anuj and Aditya!",
            initials: "FR", gradient: "linear-gradient(135deg,#4a3a8c,#7c5cfc)"
        }
    ];

    const stage = document.getElementById('tsStage');
    const dotsWrap = document.getElementById('tsDots');
    const currentEl = document.getElementById('tsCurrent');
    const totalEl = document.getElementById('tsTotal');
    const barFill = document.getElementById('tsBarFill');

    let active = 2;
    let autoplayTimer = null;

    totalEl.textContent = String(data.length).padStart(2, '0');

    const cards = data.map((t, i) => {
        const card = document.createElement('div');
        card.className = 't-card';
        card.innerHTML = `
      <div class="t-corner"></div>
      <div class="t-mark">&#8221;</div>
      <div class="t-inner">
        <div class="t-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="t-quote">${t.quote}</p>
        <div class="t-person">
          <div class="t-avatar" style="background:${t.gradient}">${t.initials}</div>
          <div>
            <div class="t-name">${t.name}</div>
            <div class="t-role">${t.role}</div>
          </div>
        </div>
      </div>
      <div class="t-shine"></div>
    `;
        card.addEventListener('click', () => setActive(i, true));
        stage.appendChild(card);
        return card;
    });

    const dots = data.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'ts-dot';
        d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        d.addEventListener('click', () => setActive(i, true));
        dotsWrap.appendChild(d);
        return d;
    });

    function layout() {
        const n = data.length;
        cards.forEach((card, i) => {
            let diff = i - active;
            if (diff > n / 2) diff -= n;
            if (diff < -n / 2) diff += n;

            const abs = Math.abs(diff);
            const off = diff * 235;
            let scl = 1, op = 1, z = 10 - abs;

            if (diff === 0) { scl = 1; op = 1; }
            else if (abs === 1) { scl = .82; op = .55; }
            else if (abs === 2) { scl = .68; op = .22; }
            else { scl = .6; op = 0; }

            card.style.setProperty('--off', off + 'px');
            card.style.setProperty('--scl', scl);
            card.style.setProperty('--op', op);
            card.style.setProperty('--z', z);
            card.classList.toggle('is-active', diff === 0);
            card.style.pointerEvents = op < .08 ? 'none' : 'auto';
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === active));
        currentEl.textContent = String(active + 1).padStart(2, '0');
        barFill.style.width = (100 / data.length) + '%';
        barFill.style.left = ((100 / data.length) * active) + '%';
    }

    function setActive(i, userTriggered) {
        active = (i + data.length) % data.length;
        layout();
        if (userTriggered) restartAutoplay();
    }

    function next() { setActive(active + 1); }
    function prev() { setActive(active - 1); }

    document.getElementById('tsNext').addEventListener('click', () => { next(); restartAutoplay(); });
    document.getElementById('tsPrev').addEventListener('click', () => { prev(); restartAutoplay(); });

    function startAutoplay() {
        autoplayTimer = setInterval(next, 4800);
    }
    function restartAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    const outer = document.querySelector('.ts-stage-outer');
    outer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    outer.addEventListener('mouseleave', startAutoplay);

    layout();
    startAutoplay();
})();