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
