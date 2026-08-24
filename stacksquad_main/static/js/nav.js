(() => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdown = navLinks ? navLinks.querySelector('.dropdown') : null;
    const dropdownTitle = dropdown ? dropdown.querySelector('.dropdown-title') : null;
    const mobileQuery = window.matchMedia('(max-width: 992px)');

    const isMobile = () => mobileQuery.matches;
    const syncNavOffset = () => {
        if (!navbar) {
            return;
        }

        const navHeight = Math.round(navbar.getBoundingClientRect().height || navbar.offsetHeight || 72);
        document.documentElement.style.setProperty('--nav-offset', `${navHeight}px`);
    };

    syncNavOffset();
    window.addEventListener('resize', syncNavOffset);

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncNavOffset);
    }

    const closeDropdown = () => {
        if (!dropdown || !dropdownTitle) {
            return;
        }
        dropdown.classList.remove('open');
        dropdownTitle.setAttribute('aria-expanded', 'false');
    };

    const closeMenu = () => {
        if (!navLinks || !menuToggle) {
            return;
        }
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
        closeDropdown();
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            syncNavOffset();
            const shouldOpen = !navLinks.classList.contains('open');
            navLinks.classList.toggle('open', shouldOpen);
            menuToggle.classList.toggle('open', shouldOpen);
            menuToggle.setAttribute('aria-expanded', String(shouldOpen));
            body.classList.toggle('menu-open', shouldOpen);

            if (!shouldOpen) {
                closeDropdown();
            }
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (event) => {
                if (isMobile() && link.classList.contains('dropdown-title')) {
                    event.preventDefault();
                    if (dropdown && dropdownTitle) {
                        const opened = dropdown.classList.toggle('open');
                        dropdownTitle.setAttribute('aria-expanded', String(opened));
                    }
                    return;
                }

                if (isMobile()) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!isMobile()) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Node)) {
                return;
            }

            if (!navLinks.contains(target) && !menuToggle.contains(target)) {
                closeMenu();
            }
        });

        const onBreakpointChange = () => {
            syncNavOffset();
            if (!isMobile()) {
                closeMenu();
            }
        };

        if (typeof mobileQuery.addEventListener === 'function') {
            mobileQuery.addEventListener('change', onBreakpointChange);
        } else if (typeof mobileQuery.addListener === 'function') {
            mobileQuery.addListener(onBreakpointChange);
        }
    }

    if (dropdown && dropdownTitle) {
        dropdown.addEventListener('mouseenter', () => {
            if (!isMobile()) {
                dropdownTitle.setAttribute('aria-expanded', 'true');
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (!isMobile()) {
                dropdownTitle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
})();

var canvas = document.getElementById('hero-canvas'), ctx = canvas.getContext('2d'), W, H;
function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
resize(); window.addEventListener('resize', resize);
function Dot() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4; this.r = Math.random() * 1.6 + .5; this.a = Math.random() * .45 + .15; }
Dot.prototype.update = function () { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; };
Dot.prototype.draw = function () { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,212,255,' + this.a + ')'; ctx.fill(); };
var dots = []; for (var i = 0; i < 55; i++)dots.push(new Dot());
function drawLines() { for (var i = 0; i < dots.length; i++)for (var j = i + 1; j < dots.length; j++) { var dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 110) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = 'rgba(0,212,255,' + (.11 * (1 - d / 110)) + ')'; ctx.lineWidth = .8; ctx.stroke(); } } }
function anim() { ctx.clearRect(0, 0, W, H); for (var i = 0; i < dots.length; i++) { dots[i].update(); dots[i].draw(); } drawLines(); requestAnimationFrame(anim); } anim();
var obs = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.1 });
document.querySelectorAll('.section-label,.section-title,.section-sub,.inc-card,.process-step,.tool-chip,.faq-item,.cta-box,.stat-item').forEach(function (el) { var parent = el.closest('.included-grid,.tools-flex,.faq-list,.stats-row'); if (parent) { var idx = Array.from(parent.children).indexOf(el); el.style.transitionDelay = (idx * 70) + 'ms,' + (idx * 70) + 'ms'; } obs.observe(el); });
var cObs = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { var el = e.target, t = +el.dataset.target, s = null; function step(ts) { if (!s) s = ts; var p = Math.min((ts - s) / 1600, 1), ease = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(ease * t); if (p < 1) requestAnimationFrame(step); else el.textContent = t; } requestAnimationFrame(step); cObs.unobserve(el); } }); }, { threshold: .5 });
document.querySelectorAll('.stat-n[data-target]').forEach(function (el) { cObs.observe(el); });
document.querySelectorAll('.faq-q').forEach(function (q) { q.addEventListener('click', function () { var item = q.parentElement; var open = item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); }); if (!open) item.classList.add('open'); }); });
document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });