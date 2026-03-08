(() => {
    const body = document.body;
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdown = navLinks ? navLinks.querySelector('.dropdown') : null;
    const dropdownTitle = dropdown ? dropdown.querySelector('.dropdown-title') : null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileBreakpoint = window.matchMedia('(max-width: 992px)');

    const isMobileViewport = () => mobileBreakpoint.matches;

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
                if (link.classList.contains('dropdown-title') && isMobileViewport()) {
                    event.preventDefault();
                    const isOpen = dropdown ? dropdown.classList.toggle('open') : false;
                    if (dropdownTitle) {
                        dropdownTitle.setAttribute('aria-expanded', String(isOpen));
                    }
                    return;
                }

                if (isMobileViewport()) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!isMobileViewport()) {
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

        const closeOnResize = () => {
            if (!isMobileViewport()) {
                closeMenu();
            }
        };

        if (typeof mobileBreakpoint.addEventListener === 'function') {
            mobileBreakpoint.addEventListener('change', closeOnResize);
        } else if (typeof mobileBreakpoint.addListener === 'function') {
            mobileBreakpoint.addListener(closeOnResize);
        }
    }

    if (dropdown) {
        dropdown.addEventListener('mouseenter', () => {
            if (!isMobileViewport() && dropdownTitle) {
                dropdownTitle.setAttribute('aria-expanded', 'true');
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (!isMobileViewport() && dropdownTitle) {
                dropdownTitle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let width = 0;
            let height = 0;
            let dotCount = 0;
            let maxDistance = 0;
            let dots = [];
            let animationId = null;

            class Dot {
                constructor() {
                    this.reset();
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                }

                reset() {
                    this.vx = (Math.random() - 0.5) * 0.36;
                    this.vy = (Math.random() - 0.5) * 0.36;
                    this.r = Math.random() * 1.7 + 0.45;
                    this.a = Math.random() * 0.5 + 0.12;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > width) {
                        this.vx *= -1;
                    }

                    if (this.y < 0 || this.y > height) {
                        this.vy *= -1;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0,212,255,${this.a})`;
                    ctx.fill();
                }
            }

            const computeCanvasDensity = () => {
                const viewport = window.innerWidth;
                if (viewport <= 480) {
                    dotCount = 26;
                    maxDistance = 82;
                    return;
                }
                if (viewport <= 768) {
                    dotCount = 36;
                    maxDistance = 95;
                    return;
                }
                dotCount = 65;
                maxDistance = 115;
            };

            const buildDots = () => {
                dots = Array.from({ length: dotCount }, () => new Dot());
            };

            const resize = () => {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                computeCanvasDensity();
                buildDots();
            };

            const drawLines = () => {
                for (let i = 0; i < dots.length; i += 1) {
                    for (let j = i + 1; j < dots.length; j += 1) {
                        const dx = dots[i].x - dots[j].x;
                        const dy = dots[i].y - dots[j].y;
                        const distance = Math.hypot(dx, dy);
                        if (distance < maxDistance) {
                            ctx.beginPath();
                            ctx.moveTo(dots[i].x, dots[i].y);
                            ctx.lineTo(dots[j].x, dots[j].y);
                            ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - distance / maxDistance)})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            };

            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                dots.forEach((dot) => {
                    dot.update();
                    dot.draw();
                });
                drawLines();
                animationId = window.requestAnimationFrame(animate);
            };

            resize();
            animate();

            window.addEventListener('resize', () => {
                if (animationId) {
                    window.cancelAnimationFrame(animationId);
                }
                resize();
                animate();
            });
        }
    }

    const revealTargets = document.querySelectorAll(
        '.section-label,.section-title,.section-sub,.believe-card,.cta-box,.step,.mission-text,.mission-visual'
    );

    const setStaggerDelay = (element) => {
        const parent = element.closest('.believe-grid,.approach-steps');
        if (!parent) {
            return;
        }
        const index = Array.from(parent.children).indexOf(element);
        if (index >= 0) {
            const delay = `${index * 90}ms`;
            element.style.transitionDelay = `${delay}, ${delay}`;
        }
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealTargets.forEach((element) => {
            setStaggerDelay(element);
            observer.observe(element);
        });
    } else {
        revealTargets.forEach((element) => {
            element.classList.add('visible');
        });
    }

    if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
        document.querySelectorAll('.btn-primary,.btn-cta,.btn-dark').forEach((button) => {
            button.addEventListener('mousemove', (event) => {
                const bounds = button.getBoundingClientRect();
                const x = (event.clientX - bounds.left - bounds.width / 2) * 0.1;
                const y = (event.clientY - bounds.top - bounds.height / 2) * 0.1;
                button.style.transform = `translate(${x}px, ${y}px)`;
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    document.querySelectorAll('a[href="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => event.preventDefault());
    });
})();
