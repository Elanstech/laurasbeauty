/* ============================================
   ABOUT PAGE JAVASCRIPT - LAURA'S BEAUTY TOUCH
   Photo Gallery & Interactions
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

    // Initialize Gallery
    const gallery = new PhotoGallery();
    
    // Initialize smooth scroll for hero indicator
    initSmoothScroll();
    
    // Initialize parallax effect for hero
    initParallaxEffect();
});

// ============================================
// PHOTO GALLERY CLASS
// ============================================
class PhotoGallery {
    constructor() {
        this.galleryImages = [
            {
                src: '../images/waiting.jpeg',
                title: 'Waiting Area',
                description: 'Where your journey begins'
            },
            {
                src: '../images/products.jpeg',
                title: 'Premium Products',
                description: 'Natural & organic care'
            },
            {
                src: '../images/spaint.jpeg',
                title: 'Spa Interior',
                description: 'Your peaceful escape'
            },
            {
                src: '../images/treatroom.jpeg',
                title: 'Treatment Room',
                description: 'Where the magic happens'
            },
            {
                src: '../images/team.jpeg',
                title: 'Our Team',
                description: 'Expert care providers'
            },
            {
                src: '../images/microroom.jpeg',
                title: 'Microneedling Suite',
                description: 'Advanced treatments'
            },
            {
                src: '../images/wallart.jpeg',
                title: 'Spa Ambiance',
                description: 'Designed for tranquility'
            },
            {
                src: '../images/brows.jpeg',
                title: 'Brow Artistry',
                description: 'Precision & perfection'
            }
        ];

        this.currentIndex = 0;
        this.modal = document.getElementById('lightboxModal');
        this.modalImage = document.getElementById('lightboxImage');
        this.modalCaption = document.getElementById('lightboxCaption');
        this.modalCounter = document.getElementById('lightboxCounter');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');

        this.init();
    }

    init() {
        // Add click listeners to all gallery view buttons
        const viewButtons = document.querySelectorAll('.gallery-view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                this.openLightbox(index);
            });
        });

        // Add click listeners to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });

        // Modal controls
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousImage());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextImage());
        }

        // Close on overlay click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightbox();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add animation
        this.modalImage.style.opacity = '0';
        this.modalImage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.modalImage.style.transition = 'all 0.4s ease';
            this.modalImage.style.opacity = '1';
            this.modalImage.style.transform = 'scale(1)';
        }, 50);
    }

    closeLightbox() {
        this.modalImage.style.opacity = '0';
        this.modalImage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.updateLightbox();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
        this.updateLightbox();
    }

    updateLightbox() {
        const image = this.galleryImages[this.currentIndex];
        
        // Fade out
        this.modalImage.style.opacity = '0';
        this.modalImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.modalImage.src = image.src;
            this.modalImage.alt = image.title;
            this.modalCaption.textContent = `${image.title} - ${image.description}`;
            this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.galleryImages.length}`;
            
            // Fade in
            setTimeout(() => {
                this.modalImage.style.opacity = '1';
                this.modalImage.style.transform = 'scale(1)';
            }, 50);
        }, 200);
    }
}

// ============================================
// SMOOTH SCROLL FUNCTIONALITY
// ============================================
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const targetSection = document.querySelector('.laura-story-section');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

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
// GALLERY IMAGE LAZY LOADING
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
// REVEAL ANIMATIONS ON SCROLL
// ============================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.credential-card, .commitment-card, .value-item');
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
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
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
// FLOATING DECORATIVE ELEMENTS ANIMATION
// ============================================
function animateFloatingDecor() {
    const decorElements = document.querySelectorAll('.floating-decor');
    
    decorElements.forEach((decor, index) => {
        const randomDuration = 6 + Math.random() * 4; // 6-10 seconds
        const randomDelay = index * 0.5;
        
        decor.style.animation = `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
    });
}

document.addEventListener('DOMContentLoaded', animateFloatingDecor);

// ============================================
// TOUCH SWIPE SUPPORT FOR MOBILE LIGHTBOX
// ============================================
class TouchSwipe {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }

    init() {
        this.element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.minSwipeDistance) {
            if (diff > 0 && this.callbacks.onSwipeLeft) {
                this.callbacks.onSwipeLeft();
            } else if (diff < 0 && this.callbacks.onSwipeRight) {
                this.callbacks.onSwipeRight();
            }
        }
    }
}

// Initialize touch swipe for lightbox
document.addEventListener('DOMContentLoaded', () => {
    const lightboxContent = document.querySelector('.lightbox-content');
    
    if (lightboxContent) {
        new TouchSwipe(lightboxContent, {
            onSwipeLeft: () => {
                const nextBtn = document.getElementById('lightboxNext');
                if (nextBtn) nextBtn.click();
            },
            onSwipeRight: () => {
                const prevBtn = document.getElementById('lightboxPrev');
                if (prevBtn) prevBtn.click();
            }
        });
    }
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
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View gallery image ${index + 1}`);
        item.setAttribute('tabindex', '0');
        
        // Add keyboard support
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item:focus,
        .gallery-view-btn:focus,
        .lightbox-close:focus,
        .lightbox-nav:focus {
            outline: 3px solid var(--mint-green);
            outline-offset: 4px;
        }
    `;
    document.head.appendChild(style);
});

console.log('✨ About page initialized successfully!');
