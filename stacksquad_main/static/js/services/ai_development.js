/* HERO CANVAS */
var canvas = document.getElementById('hero-canvas');
var ctx = canvas.getContext('2d');
var W, H;
function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', resize);

function Dot() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r = Math.random() * 1.6 + .5;
    this.a = Math.random() * .45 + .15;
}
Dot.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
};
Dot.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,212,255,' + this.a + ')';
    ctx.fill();
};

var dots = [];
for (var i = 0; i < 60; i++) dots.push(new Dot());

function drawLines() {
    for (var i = 0; i < dots.length; i++) {
        for (var j = i + 1; j < dots.length; j++) {
            var dx = dots[i].x - dots[j].x;
            var dy = dots[i].y - dots[j].y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 110) {
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = 'rgba(0,212,255,' + (.11 * (1 - d / 110)) + ')';
                ctx.lineWidth = .8;
                ctx.stroke();
            }
        }
    }
}

function anim() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) { dots[i].update(); dots[i].draw(); }
    drawLines();
    requestAnimationFrame(anim);
}
anim();

/* SCROLL REVEAL */
var sections = document.querySelectorAll('.service-section, .cta-box');
var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1 });
sections.forEach(function (s) { obs.observe(s); });

/* SMOOTH SCROLL FOR NAV PILLS */
document.querySelectorAll('.snav-pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(pill.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        }
        document.querySelectorAll('.snav-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
    });
});

/* PREVENT DEFAULT */
document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
});