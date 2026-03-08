/* NAV SCROLL */
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50));

/* HERO PARTICLE NETWORK */
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

const dots = Array.from({ length: 72 }, () => new Dot());

function drawLines() {
    for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = `rgba(0,212,255,${.13 * (1 - d / 115)})`; ctx.lineWidth = .8; ctx.stroke(); }
    }
}

(function animDots() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });
    drawLines();
    requestAnimationFrame(animDots);
})();

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

const revealEls = document.querySelectorAll('.section-label,.section-title,.section-sub,.feature,.service-card,.testi-card,.story-card,.cta-box,.stat,.testi-header h2');
revealEls.forEach((el, i) => {
    const parent = el.closest('.features-grid,.services-grid,.stats-bar,.testi-track,.stories-grid');
    const delay = parent ? (Array.from(parent.children).indexOf(el) * 80) + 'ms' : '0ms';
    el.style.transitionDelay = delay + ', ' + delay;
    obs.observe(el);
});

/* COUNTER */
const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target, target = +el.dataset.target;
            let start = null;
            const step = ts => { if (!start) start = ts; const p = Math.min((ts - start) / 1800, 1), ease = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(ease * target); if (p < 1) requestAnimationFrame(step); else el.textContent = target; };
            requestAnimationFrame(step);
            cntObs.unobserve(el);
        }
    });
}, { threshold: .5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => cntObs.observe(el));

/* TESTIMONIAL SLIDER */
const track = document.getElementById('testiTrack');
const tCards = document.querySelectorAll('.testi-card');
let tIdx = 0;
function slideTo(n) {
    tIdx = Math.max(0, Math.min(n, tCards.length - 1));
    track.style.transform = `translateX(${-tIdx * (tCards[0].offsetWidth + 19.2)}px)`;
}
document.getElementById('testiNext').onclick = () => slideTo(tIdx + 1);
document.getElementById('testiPrev').onclick = () => slideTo(tIdx - 1);

/* TILT ON SERVICE CARDS */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* MAGNETIC BUTTONS */
document.querySelectorAll('.btn-primary,.btn-cta,.btn-dark').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .1}px,${(e.clientY - r.top - r.height / 2) * .1}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

/* PREVENT DEFAULT */
document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

