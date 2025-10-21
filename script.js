// ============================================
// ELEGANT PRELOADER
// ============================================
class ElegantPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';
        
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });

        // Failsafe timeout
        setTimeout(() => {
            if (this.preloader && !this.preloader.classList.contains('hidden')) {
                this.hide();
            }
        }, 3000);
    }

    hide() {
        if (!this.preloader) return;
        
        this.preloader.classList.add('hidden');
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 800);
    }
}

// ============================================
// PREMIUM HEADER
// ============================================
class PremiumHeader {
    constructor() {
        this.header = document.querySelector('.premium-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.logoWrapper = document.querySelector('.header-logo-wrapper');
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleLogoClick();
        this.handleSmoothScroll();
    }

    handleScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    if (scrolled > 80) {
                        this.header.classList.add('scrolled');
                    } else {
                        this.header.classList.remove('scrolled');
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }

    handleMobileMenu() {
        if (!this.mobileToggle) return;

        this.mobileToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        this.mobileOverlay.addEventListener('click', () => {
            this.closeMenu();
        });

        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileDrawer.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileDrawer.classList.toggle('active');
        this.mobileOverlay.classList.toggle('active');
        
        if (this.mobileDrawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileDrawer.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleLogoClick() {
        if (this.logoWrapper) {
            this.logoWrapper.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }
}

// ============================================
// HERO VIDEO COLLAGE WITH SMOOTH PLAYBACK
// ============================================
class HeroVideoCollage {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-navigation-dots .dot');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.typedInstances = [];
        this.userInteracted = false;
        
        this.init();
    }

    init() {
        this.setupVideoPlayback();
        this.initTypedAnimations();
        this.setupNavigation();
        this.setupScrollIndicator();
        this.startAutoPlay();
    }

    setupVideoPlayback() {
        // Synchronize all videos to start together
        const syncVideos = () => {
            let allLoaded = true;
            
            this.videos.forEach(video => {
                if (video.readyState < 3) { // HAVE_FUTURE_DATA
                    allLoaded = false;
                }
            });
            
            if (allLoaded && !this.userInteracted) {
                this.userInteracted = true;
                
                // Synchronize start time
                const startTime = 0;
                this.videos.forEach(video => {
                    video.currentTime = startTime;
                    video.muted = true;
                    video.play().catch(e => console.log('Sync play prevented'));
                });
                
                console.log('All videos synchronized and playing');
            }
        };

        // Setup each video with aggressive loading
        this.videos.forEach((video, index) => {
            // Force all attributes for smooth playback
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('muted', '');
            video.preload = 'auto';
            
            // Handle when video can play
            video.addEventListener('canplay', () => {
                console.log(`Video ${index + 1} can play`);
                syncVideos();
            });

            video.addEventListener('canplaythrough', () => {
                console.log(`Video ${index + 1} loaded`);
                syncVideos();
            });

            // Handle video errors
            video.addEventListener('error', (e) => {
                console.error(`Video ${index + 1} error:`, e);
            });

            // Perfect loop without gaps
            video.addEventListener('timeupdate', () => {
                // Loop before the end to avoid gaps
                if (video.currentTime >= video.duration - 0.1) {
                    video.currentTime = 0;
                }
            });

            // Start loading
            video.load();
        });

        // Force play on user interaction
        const enableAllVideos = () => {
            console.log('User interacted - enabling all videos');
            
            // Sync all videos to same timestamp
            const syncTime = this.videos[0].currentTime || 0;
            
            this.videos.forEach(video => {
                video.currentTime = syncTime;
                video.muted = true;
                video.play().then(() => {
                    console.log('Video playing after interaction');
                }).catch(e => {
                    console.log('Play prevented:', e);
                });
            });
        };

        // Listen for user interactions
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, enableAllVideos, { once: true, passive: true });
        });

        // Auto-attempt play after short delay
        setTimeout(() => {
            if (!this.userInteracted) {
                enableAllVideos();
            }
        }, 500);

        // Keep videos in sync periodically
        setInterval(() => {
            if (this.videos.length < 2) return;
            
            const masterVideo = this.videos[0];
            const masterTime = masterVideo.currentTime;
            
            this.videos.forEach((video, index) => {
                if (index === 0) return; // Skip master video
                
                const timeDiff = Math.abs(video.currentTime - masterTime);
                
                // If videos drift more than 0.3 seconds, resync
                if (timeDiff > 0.3) {
                    video.currentTime = masterTime;
                    console.log(`Resynced video ${index + 1}`);
                }
            });
        }, 2000); // Check every 2 seconds

        // Visibility change handler - resync when tab becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const masterTime = this.videos[0].currentTime;
                this.videos.forEach(video => {
                    video.currentTime = masterTime;
                    if (video.paused) {
                        video.play().catch(e => {});
                    }
                });
            }
        });
    }

    initTypedAnimations() {
        // Check if Typed.js is available
        if (typeof Typed === 'undefined') {
            console.log('Typed.js not loaded, using fallback text');
            // Fallback: just show static text
            const fallbacks = {
                '#typed-1': 'Touch',
                '#typed-2': 'of Wellness',
                '#typed-3': 'Natural Glow'
            };
            
            Object.keys(fallbacks).forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.textContent = fallbacks[selector];
                }
            });
            return;
        }

        const typedConfigs = [
            {
                element: '#typed-1',
                strings: ['Touch^1000', 'Sanctuary^1000', 'Experience'],
                typeSpeed: 80,
                backSpeed: 60,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            },
            {
                element: '#typed-2',
                strings: ['of Wellness^1000', 'of Beauty^1000', 'of Luxury'],
                typeSpeed: 80,
                backSpeed: 60,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            },
            {
                element: '#typed-3',
                strings: ['Natural Glow^1000', 'Inner Beauty^1000', 'True Radiance'],
                typeSpeed: 80,
                backSpeed: 60,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            }
        ];

        typedConfigs.forEach(config => {
            if (document.querySelector(config.element)) {
                try {
                    const typed = new Typed(config.element, config);
                    this.typedInstances.push(typed);
                } catch (error) {
                    console.error('Error initializing Typed.js:', error);
                }
            }
        });
    }

    setupNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
    }

    goToSlide(index) {
        // Remove active from all
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active to target
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;
        
        // GSAP animation for smooth transition
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.slides[index], 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }

    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            const nextSlide = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(nextSlide);
        }, 6000);
    }

    resetAutoPlay() {
        clearInterval(this.slideInterval);
        this.startAutoPlay();
    }

    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Hide on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    if (typeof gsap !== 'undefined') {
                        if (scrolled > 100) {
                            gsap.to(this.scrollIndicator, {
                                opacity: 0,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        } else {
                            gsap.to(this.scrollIndicator, {
                                opacity: 1,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    } else {
                        this.scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        this.init();
    }

    init() {
        if (this.testimonials.length === 0) return;
        
        this.setupNavigation();
        this.startAutoplay();
    }

    setupNavigation() {
        this.prevBtn.addEventListener('click', () => {
            this.goToPrev();
            this.resetAutoplay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.goToNext();
            this.resetAutoplay();
        });

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToPrev();
            if (e.key === 'ArrowRight') this.goToNext();
        });
    }

    goToSlide(index) {
        this.testimonials.forEach(t => t.classList.remove('active'));
        this.dots.forEach(d => d.classList.remove('active'));
        
        this.testimonials[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentIndex = index;
        
        // GSAP animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.testimonials[index],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
        }
    }

    goToNext() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goToSlide(nextIndex);
    }

    goToPrev() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.goToNext();
        }, 5000);
    }

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add floating label functionality
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('placeholder', ' ');
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message with GSAP
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    
                    gsap.to(submitBtn, {
                        scale: 1,
                        duration: 0.2
                    });
                    
                    setTimeout(() => {
                        this.form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                }
            });
        } else {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
        
        console.log('Form submitted:', data);
    }
}

// ============================================
// AOS (ANIMATE ON SCROLL) INITIALIZATION
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: false
        });
    }
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Section fade-ins
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Service cards stagger
    if (document.querySelector('.service-card')) {
        gsap.from('.service-card', {
            opacity: 0,
            y: 60,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 75%'
            }
        });
    }
    
    // Feature items animation
    if (document.querySelector('.feature-item')) {
        gsap.from('.feature-item', {
            opacity: 0,
            scale: 0.9,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about-features',
                start: 'top 75%'
            }
        });
    }
    
    // Gallery items
    if (document.querySelector('.gallery-item')) {
        gsap.from('.gallery-item', {
            opacity: 0,
            scale: 0.8,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 75%'
            }
        });
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            console.log(`Native lazy loading for ${images.length} images`);
        } else {
            this.lazyLoadImages();
        }

        // Log performance
        this.logPerformance();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    logPerformance() {
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page load time: ${pageLoadTime}ms`);
            }
        });
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch - Natural Luxury');
    console.log('💎 Initializing components...');
    
    new ElegantPreloader();
    new PremiumHeader();
    new HeroVideoCollage();
    new TestimonialsSlider();
    new ContactForm();
    new PerformanceOptimizer();
    
    // Initialize AOS
    initAOS();
    
    // Initialize GSAP animations with delay
    setTimeout(() => {
        initGSAPAnimations();
    }, 100);
    
    console.log('✅ All components ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

// Additional load handler
window.addEventListener('load', () => {
    console.log('✅ Page fully loaded');
});

console.log('🌟 Natural Luxury - Script Ready');
