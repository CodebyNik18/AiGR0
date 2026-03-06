(function () {
    var c = document.getElementById('bgCanvas');
    var ctx = c.getContext('2d');
    var W, H, pts = [];

    function resize() {
        W = c.width = c.offsetWidth;
        H = c.height = c.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Pt() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .28;
        this.vy = (Math.random() - .5) * .28;
        this.r = Math.random() * 1.4 + .4;
        this.a = Math.random() * .5 + .1;
    }
    Pt.prototype.tick = function () {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    };

    for (var i = 0; i < 70; i++) pts.push(new Pt());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
            pts[i].tick();
            ctx.beginPath();
            ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,212,255,' + pts[i].a + ')';
            ctx.fill();
            for (var j = i + 1; j < pts.length; j++) {
                var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = 'rgba(0,212,255,' + (.09 * (1 - d / 120)) + ')';
                    ctx.lineWidth = .6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();