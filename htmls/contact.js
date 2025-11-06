/* ================================================
   CONTACT.JS - Laura's Beauty Touch
   Smooth animations and interactions
   ================================================ */

(function() {
    'use strict';

    // ================================================
    // INITIALIZATION
    // ================================================
    function init() {
        setupSmoothScroll();
        setupScrollAnimations();
        setupMapInteractions();
        optimizeScrollPerformance();
        console.log('Contact page initialized successfully');
    }

    // ================================================
    // OPTIMIZE SCROLL PERFORMANCE
    // ================================================
    function optimizeScrollPerformance() {
        // Enable GPU acceleration for animated elements
        const animatedElements = document.querySelectorAll(
            '.info-card, .map-info-card, .faq-item, .form-feature, .hero-content'
        );
        
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
        
        // Remove will-change after animations complete
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 3000);
    }

    // ================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS - OPTIMIZED
    // ================================================
    function setupSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't prevent default for empty hrefs
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, { passive: false });
        });
        
        // Add scroll behavior to html element
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // ================================================
    // SCROLL ANIMATIONS - OPTIMIZED
    // ================================================
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '50px', // Trigger earlier
            threshold: 0.05 // More sensitive
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smoother animation
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const animatedElements = document.querySelectorAll(
            '.info-card, .map-info-card, .faq-item, .form-feature, .form-wrapper'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)'; // Reduced distance
            el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`; // Faster, shorter delays
            observer.observe(el);
        });
    }

    // ================================================
    // MAP INTERACTIONS
    // ================================================
    function setupMapInteractions() {
        const mapWrapper = document.querySelector('.map-wrapper');
        const mapIframe = document.querySelector('.map-wrapper iframe');
        
        if (!mapWrapper || !mapIframe) return;

        // Prevent scroll on map until clicked
        let clicked = false;
        
        mapWrapper.addEventListener('click', function() {
            if (!clicked) {
                clicked = true;
                mapIframe.style.pointerEvents = 'auto';
            }
        });

        // Reset on mouse leave
        mapWrapper.addEventListener('mouseleave', function() {
            if (clicked) {
                mapIframe.style.pointerEvents = 'none';
                clicked = false;
            }
        });
    }

    // ================================================
    // COUNTER ANIMATION FOR STATS (if needed)
    // ================================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.round(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    // ================================================
    // FORM VALIDATION ENHANCEMENT (if using native forms)
    // ================================================
    function enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        
                        // Remove error class after user starts typing
                        input.addEventListener('input', function() {
                            this.classList.remove('error');
                        }, { once: true });
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    alert('Please fill in all required fields');
                }
            });
        });
    }

    // ================================================
    // CARD HOVER EFFECTS
    // ================================================
    function setupCardHoverEffects() {
        const cards = document.querySelectorAll('.info-card, .map-info-card, .faq-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    // ================================================
    // FAQ ACCORDION (if needed for mobile)
    // ================================================
    function setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question && window.innerWidth < 768) {
                question.style.cursor = 'pointer';
                
                question.addEventListener('click', function() {
                    const answer = item.querySelector('.faq-answer');
                    const isOpen = item.classList.contains('faq-open');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('faq-open');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = null;
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isOpen) {
                        item.classList.remove('faq-open');
                        answer.style.maxHeight = null;
                    } else {
                        item.classList.add('faq-open');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    // ================================================
    // PERFORMANCE OPTIMIZATION
    // ================================================
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for frequent events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ================================================
    // LAZY LOADING FOR IMAGES
    // ================================================
    function setupLazyLoading() {
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

    // ================================================
    // ANALYTICS TRACKING (Optional)
    // ================================================
    function trackContactInteractions() {
        // Track phone clicks
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Phone link clicked:', this.getAttribute('href'));
                // Add your analytics tracking here
            });
        });

        // Track email clicks
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Email link clicked:', this.getAttribute('href'));
                // Add your analytics tracking here
            });
        });

        // Track booking button clicks
        const bookingButtons = document.querySelectorAll('.book-now-btn, .card-link-primary');
        bookingButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Booking button clicked');
                // Add your analytics tracking here
            });
        });
    }

    // ================================================
    // ERROR HANDLING
    // ================================================
    function setupErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('Error occurred:', e.message);
        });

        // Handle promise rejections
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // ================================================
    // DOCUMENT READY
    // ================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            setupCardHoverEffects();
            setupLazyLoading();
            trackContactInteractions();
            setupErrorHandling();
            setupFAQAccordion();
        });
    } else {
        init();
        setupCardHoverEffects();
        setupLazyLoading();
        trackContactInteractions();
        setupErrorHandling();
        setupFAQAccordion();
    }

    // ================================================
    // EXPOSE PUBLIC API (Optional)
    // ================================================
    window.ContactPageAPI = {
        init: init,
        animateCounter: animateCounter
    };

})();

/* ================================================
   END OF CONTACT.JS
   ================================================ */
