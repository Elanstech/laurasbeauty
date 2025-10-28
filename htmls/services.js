/* ============================================
   SERVICES PAGE JAVASCRIPT - LAURA'S BEAUTY TOUCH
   Luxury Interactions & Animations
   ============================================ */

// ============================================
// INITIALIZE AOS ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
    }

    // Initialize parallax effect for hero
    initParallaxEffect();
    
    // Initialize smooth scroll for hero indicator
    initSmoothScroll();
    
    // Initialize card animations
    initCardAnimations();
    
    // Initialize floating decorations
    animateFloatingDecor();
});

// ============================================
// PARALLAX EFFECT FOR HERO
// ============================================
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroBackground) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                
                if (scrolled < window.innerHeight) {
                    heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// SMOOTH SCROLL FUNCTIONALITY
// ============================================
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const targetSection = document.querySelector('.services-grid-section');
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ============================================
// CARD HOVER ANIMATIONS
// ============================================
function initCardAnimations() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Add magnetic effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple CSS
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(169, 200, 156, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        }
        
        @keyframes ripple-animation {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// FLOATING DECORATIVE ELEMENTS ANIMATION
// ============================================
function animateFloatingDecor() {
    const decorElements = document.querySelectorAll('.hero-decor');
    
    decorElements.forEach((decor, index) => {
        const randomDuration = 15 + Math.random() * 10; // 15-25 seconds
        const randomDelay = index * 2;
        
        decor.style.animation = `floatAnimation ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.service-card');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                observer.observe(element);
            });
        }
    }
}

// Initialize scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

// ============================================
// STATS COUNTER ANIMATION
// ============================================
class StatsCounter {
    constructor() {
        this.statsInitialized = false;
        this.init();
    }

    init() {
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsInitialized) {
                    this.animateStats();
                    this.statsInitialized = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                }
            };

            updateCounter();
        });
    }
}

// Initialize stats counter
document.addEventListener('DOMContentLoaded', () => {
    new StatsCounter();
});

// ============================================
// CARD LINK SMOOTH NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const cardLinks = document.querySelectorAll('.card-link');
    
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add a subtle loading animation
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.animation = 'spin 0.5s ease-in-out';
            }
        });
    });
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for resize events
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

// Handle window resize
const handleResize = debounce(() => {
    // Refresh AOS if needed
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Reset card transforms on resize
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// PAGE LOAD OPTIMIZATION
// ============================================
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('page-loaded');
    
    // Trigger any final animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    }, 100);
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to interactive elements
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        const title = card.querySelector('.card-title');
        if (title) {
            card.setAttribute('aria-label', `View ${title.textContent} category`);
        }
    });
    
    // Add keyboard support for cards
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.card-link');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .service-card:focus,
        .card-link:focus,
        .cta-btn:focus {
            outline: 3px solid var(--mint-green);
            outline-offset: 4px;
        }
        
        .service-card:focus {
            transform: translateY(-15px);
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ============================================
// BADGE ANIMATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const badges = document.querySelectorAll('.card-badge');
    
    badges.forEach(badge => {
        // Add subtle floating animation
        setInterval(() => {
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = badge.classList.contains('special-badge') 
                    ? 'pulse 2s ease-in-out infinite' 
                    : 'float 3s ease-in-out infinite';
            }, 10);
        }, 3000);
    });
});

// ============================================
// CTA BUTTONS INTERACTION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px) scale(1.2)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c✨ Laura\'s Beauty Touch - Services Page', 'font-size: 20px; font-weight: bold; color: #A9C89C;');
console.log('%cLuxury treatments await you!', 'font-size: 14px; color: #3B4A2F;');
