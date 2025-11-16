document.addEventListener('DOMContentLoaded', () => {
    // Set the active nav link based on current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Remove any trailing slashes and match filename
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll event listener for navbar
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(28, 40, 65, 0.95)'; // var(--navy) with opacity
        } else {
            nav.style.background = 'var(--navy)';
        }
    });
});
