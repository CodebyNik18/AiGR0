/* MOBILE NAVIGATION */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');
const servicesDropdown = document.querySelector('.dropdown');
const servicesTitle = document.querySelector('.dropdown-title');

if (menuToggle && navLinks) {

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    /* Mobile Services dropdown */
    if (servicesDropdown && servicesTitle) {

        servicesTitle.addEventListener('click', (e) => {

            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                servicesDropdown.classList.toggle('open');
            }

        });
    }

    /* Close menu when clicking outside */
    document.addEventListener('click', (e) => {

        if (
            navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');

            if (servicesDropdown) {
                servicesDropdown.classList.remove('open');
            }
        }

    });

    /* Reset when returning to desktop */
    window.addEventListener('resize', () => {

        if (window.innerWidth > 768) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');

            if (servicesDropdown) {
                servicesDropdown.classList.remove('open');
            }
        }

    });
}