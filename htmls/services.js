// ============================================
// SERVICES PAGE JAVASCRIPT
// Laura's Beauty Touch - Natural Luxury Spa
// ============================================

'use strict';

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

/**
 * Initialize mobile navigation toggle
 */
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            // Toggle active classes
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') 
                ? 'hidden' 
                : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================

/**
 * Handle navbar appearance on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

/**
 * Intersection Observer for scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => observer.observe(header));

    // Observe CTA section
    const ctaSection = document.querySelector('.services-cta');
    if (ctaSection) {
        observer.observe(ctaSection);
    }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

/**
 * Enable smooth scrolling for all anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
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
// SERVICE CARD INTERACTIONS
// ============================================

/**
 * Enhanced service card hover effects
 */
function initServiceCardInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
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
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

/**
 * Lazy load images for better performance
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

/**
 * Debounce function for performance optimization
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
// SCROLL TO TOP FUNCTIONALITY
// ============================================

/**
 * Show/hide scroll to top button
 */
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    let scrollTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopBtn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }), { passive: true });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// FORM VALIDATION (if contact form present)
// ============================================

/**
 * Basic form validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Create or update error message
                    let errorMsg = input.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    input.classList.remove('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

/**
 * Improve keyboard navigation and accessibility
 */
function initAccessibility() {
    // Add keyboard focus styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('.service-card, .service-btn, .cta-btn');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event listeners
        element.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                element.click();
            }
        });
    });
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

/**
 * Display welcome message in console
 */
function displayConsoleWelcome() {
    console.log(
        '%c✨ Laura\'s Beauty Touch ✨',
        'font-size: 20px; font-weight: bold; color: #3B4A2F; font-family: Playfair Display, serif;'
    );
    console.log(
        '%cServices Page | Designed by Elan | Natural Luxury Spa Experience',
        'font-size: 12px; color: #A9C89C; font-family: Lato, sans-serif;'
    );
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all functions when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initMobileNavigation();
    initNavbarScroll();
    initScrollAnimations();
    initSmoothScroll();
    initServiceCardInteractions();
    initLazyLoading();
    initScrollToTop();
    initFormValidation();
    initAccessibility();
    
    // Display console message
    displayConsoleWelcome();
    
    // Log successful initialization
    console.log('✓ Services page initialized successfully');
});

// ============================================
// HANDLE PAGE VISIBILITY CHANGES
// ============================================

/**
 * Optimize performance when page is not visible
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause animations if needed
        console.log('Page hidden - optimizing performance');
    } else {
        // Page is visible - resume normal operation
        console.log('Page visible - resuming animations');
    }
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
    // You can add error reporting here
});

// ============================================
// EXPORT FOR MODULE USAGE (if needed)
// ============================================

// If you're using ES6 modules, uncomment below:
// export {
//     initMobileNavigation,
//     initScrollAnimations,
//     initServiceCardInteractions
// };
