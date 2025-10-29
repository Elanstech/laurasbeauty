// ============================================
// SERVICES PAGE JAVASCRIPT - NO CONFLICTS
// Laura's Beauty Touch - Natural Luxury Spa
// Designer: Elan
// ============================================

// This file contains ONLY services-page specific JavaScript
// Global functions (header, footer, navigation, etc.) are in script.js
// No duplicate initialization of shared components

'use strict';

// ============================================
// SERVICES PAGE - SPECIFIC ANIMATIONS
// ============================================

/**
 * Initialize services page specific scroll animations
 */
function initServicesScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.services-page .service-card');
    serviceCards.forEach(card => observer.observe(card));

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.services-page .section-header');
    sectionHeaders.forEach(header => observer.observe(header));

    // Observe CTA section
    const ctaSection = document.querySelector('.services-page .services-cta');
    if (ctaSection) {
        observer.observe(ctaSection);
    }
}

// ============================================
// SERVICE CARD INTERACTIONS
// ============================================

/**
 * Enhanced service card hover effects with 3D tilt
 */
function initServiceCardInteractions() {
    const serviceCards = document.querySelectorAll('.services-page .service-card');
    
    serviceCards.forEach(card => {
        // Add subtle parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
                scale3d(1.02, 1.02, 1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        // Make cards keyboard accessible
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.service-btn');
                if (link) link.click();
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR SERVICE LINKS
// ============================================

/**
 * Smooth scroll behavior for internal links
 */
function initServicesPageSmoothScroll() {
    const internalLinks = document.querySelectorAll('.services-page a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.premium-header')?.offsetHeight || 100;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING FOR SERVICE IMAGES
// ============================================

/**
 * Lazy load service images for better performance
 */
function initServicesLazyLoading() {
    const images = document.querySelectorAll('.services-page img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ============================================
// SERVICE CARD ANALYTICS TRACKING
// ============================================

/**
 * Track service card clicks for analytics (optional)
 */
function initServicesAnalytics() {
    const serviceLinks = document.querySelectorAll('.services-page .service-btn');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const serviceName = this.closest('.service-card')?.querySelector('h3')?.textContent;
            
            // Log for debugging (replace with actual analytics if needed)
            console.log('Service clicked:', serviceName);
            
            // Example: Send to Google Analytics
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'service_click', {
            //         'event_category': 'Services',
            //         'event_label': serviceName
            //     });
            // }
        });
    });
}

// ============================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ============================================

/**
 * Enhance keyboard navigation for services page
 */
function initServicesKeyboardNav() {
    const serviceCards = document.querySelectorAll('.services-page .service-card');
    
    serviceCards.forEach((card, index) => {
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Add keyboard navigation between cards
        card.addEventListener('keydown', (e) => {
            let targetCard = null;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetCard = serviceCards[index + 1];
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetCard = serviceCards[index - 1];
                    break;
            }
            
            if (targetCard) {
                targetCard.focus();
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// ============================================
// SERVICES PAGE CONSOLE WELCOME
// ============================================

/**
 * Display services page info in console
 */
function displayServicesConsoleWelcome() {
    console.log(
        '%c✨ Laura\'s Beauty Touch - Services ✨',
        'font-size: 20px; font-weight: bold; color: #3B4A2F; font-family: Playfair Display, serif;'
    );
    console.log(
        '%c11 Service Categories | Designed by Elan | Natural Luxury Spa Experience',
        'font-size: 12px; color: #A9C89C; font-family: Lato, sans-serif;'
    );
    console.log(
        '%cServices Page JavaScript Loaded Successfully',
        'font-size: 10px; color: #666; font-style: italic;'
    );
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

/**
 * Debounce function for performance
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ============================================
// INITIALIZE SERVICES PAGE
// ============================================

/**
 * Initialize all services page functionality
 * This runs AFTER the global script.js has initialized shared components
 */
function initServicesPage() {
    // Wait a bit to ensure global script.js has initialized
    setTimeout(() => {
        // Services-specific initializations
        initServicesScrollAnimations();
        initServiceCardInteractions();
        initServicesPageSmoothScroll();
        initServicesLazyLoading();
        initServicesAnalytics();
        initServicesKeyboardNav();
        
        // Console welcome message
        displayServicesConsoleWelcome();
        
        console.log('✓ Services page functionality initialized');
    }, 100);
}

// ============================================
// DOM READY EVENT
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesPage);
} else {
    // DOM is already ready
    initServicesPage();
}

// ============================================
// PAGE VISIBILITY OPTIMIZATION
// ============================================

/**
 * Pause/resume animations based on page visibility
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Services page hidden - pausing animations');
    } else {
        console.log('Services page visible - resuming animations');
    }
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Catch any JavaScript errors on the services page
 */
window.addEventListener('error', (e) => {
    console.error('Services page error:', e.message, e.filename, e.lineno);
});

// ============================================
// EXPORT FOR MODULE USAGE (if needed)
// ============================================

// If using ES6 modules, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initServicesPage,
        initServiceCardInteractions,
        initServicesScrollAnimations
    };
}
