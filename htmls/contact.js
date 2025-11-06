/* ================================================
   CONTACT.JS - Laura's Beauty Touch
   Simple, Clean, No Performance Issues
   ================================================ */

(function() {
    'use strict';

    // ================================================
    // SMOOTH SCROLL
    // ================================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ================================================
    // MAP INTERACTION
    // ================================================
    function initMapInteraction() {
        const mapEmbed = document.querySelector('.map-embed iframe');
        
        if (!mapEmbed) return;

        // Prevent accidental scroll on map
        mapEmbed.style.pointerEvents = 'none';
        
        document.querySelector('.map-embed').addEventListener('click', function() {
            mapEmbed.style.pointerEvents = 'auto';
        });
        
        document.querySelector('.map-embed').addEventListener('mouseleave', function() {
            mapEmbed.style.pointerEvents = 'none';
        });
    }

    // ================================================
    // ANALYTICS (Optional)
    // ================================================
    function trackContactActions() {
        // Track phone clicks
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('Phone clicked:', this.href);
            });
        });

        // Track email clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('Email clicked:', this.href);
            });
        });

        // Track booking clicks
        document.querySelectorAll('.banner-btn, .card-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Button clicked:', this.textContent);
            });
        });
    }

    // ================================================
    // INIT
    // ================================================
    function init() {
        initSmoothScroll();
        initMapInteraction();
        trackContactActions();
        console.log('Contact page ready');
    }

    // ================================================
    // DOM READY
    // ================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
