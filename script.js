// ============================================
// PRELOADER SECTION
// ============================================
class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.init();
    }

    init() {
        // Hide preloader on window load
        window.addEventListener('load', () => {
            this.startHideSequence();
        });

        // Failsafe: hide preloader after 4 seconds regardless
        setTimeout(() => {
            if (this.preloader && !this.preloader.classList.contains('hidden')) {
                console.log('Failsafe: Hiding preloader');
                this.startHideSequence();
            }
        }, 4000);
    }

    startHideSequence() {
        setTimeout(() => {
            this.hidePreloader();
        }, 2200);
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.classList.add('hidden');
            setTimeout(() => {
                this.preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }
}

// ============================================
// HEADER SECTION
// ============================================
class SpaHeaderManager {
    constructor() {
        this.header = document.querySelector('.spa-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.accordionTriggers = document.querySelectorAll('.accordion-trigger');
        this.logo = document.querySelector('.header-logo');
        this.allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .mega-service-card, .accordion-links a');
        this.megaMenuItems = document.querySelectorAll('.has-mega-menu');
        this.megaMenuTimeout = null;
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleAccordion();
        this.handleLogoClick();
        this.handleSmoothScroll();
        this.handleMegaMenuHover();
    }

    handleScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    handleMegaMenuHover() {
        this.megaMenuItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            
            if (!megaMenu) return;

            // Mouse enter on nav item or mega menu
            const handleMouseEnter = () => {
                clearTimeout(this.megaMenuTimeout);
                megaMenu.style.opacity = '1';
                megaMenu.style.visibility = 'visible';
                megaMenu.style.pointerEvents = 'all';
            };

            // Mouse leave with delay
            const handleMouseLeave = () => {
                this.megaMenuTimeout = setTimeout(() => {
                    megaMenu.style.opacity = '0';
                    megaMenu.style.visibility = 'hidden';
                    megaMenu.style.pointerEvents = 'none';
                }, 200);
            };

            // Attach events to nav item
            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);

            // Attach events to mega menu itself
            megaMenu.addEventListener('mouseenter', handleMouseEnter);
            megaMenu.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    handleMobileMenu() {
        if (!this.mobileToggle || !this.mobileDrawer || !this.mobileOverlay) return;

        // Open/close drawer on toggle click
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close drawer when overlay is clicked
        this.mobileOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close drawer when any nav link is clicked (except accordion trigger)
        const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.accordion-trigger), .accordion-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close drawer on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileDrawer.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileDrawer.classList.toggle('active');
        this.mobileOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.mobileDrawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileDrawer.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close all accordions when menu closes
        this.accordionTriggers.forEach(trigger => {
            trigger.classList.remove('active');
            const accordion = trigger.nextElementSibling;
            if (accordion) {
                accordion.classList.remove('active');
            }
        });
    }

    handleAccordion() {
        this.accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                const accordion = trigger.nextElementSibling;
                const isActive = trigger.classList.contains('active');
                
                // Close all other accordions first
                this.accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        otherTrigger.classList.remove('active');
                        const otherAccordion = otherTrigger.nextElementSibling;
                        if (otherAccordion) {
                            otherAccordion.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current accordion
                if (isActive) {
                    trigger.classList.remove('active');
                    accordion.classList.remove('active');
                } else {
                    trigger.classList.add('active');
                    accordion.classList.add('active');
                }
            });
        });
    }

    handleLogoClick() {
        if (this.logo) {
            this.logo.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    handleSmoothScroll() {
        this.allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle hash links (internal anchor links)
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Calculate offset accounting for fixed header
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ============================================
// HERO SECTION
// ============================================
class HeroSectionManager {
    constructor() {
        // DOM Elements
        this.heroSection = document.querySelector('.hero-section');
        this.swiper = null;
        this.videos = document.querySelectorAll('.slide-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.ctaButtons = document.querySelectorAll('.cta-primary');
        
        // State
        this.currentSlide = 0;
        this.isAutoplayActive = true;
        this.isMobile = window.innerWidth <= 768;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize all hero section functionality
     */
    init() {
        console.log('🌿 Initializing Hero Section...');
        
        this.initializeSwiper();
        this.setupVideoPlayback();
        this.setupScrollIndicator();
        this.setupCTAButtons();
        this.setupParticleEffects();
        this.setupResponsiveHandling();
        this.setupAccessibility();
        
        if (typeof gsap !== 'undefined') {
            this.setupGSAPAnimations();
        }
        
        console.log('✅ Hero Section Initialized');
    }

    /**
     * Initialize Swiper Slider
     */
    initializeSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('❌ Swiper library not loaded');
            return;
        }

        this.swiper = new Swiper('.hero-swiper', {
            // Core Settings
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1200,
            loop: true,
            grabCursor: true,
            
            // Autoplay
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            
            // Navigation
            navigation: {
                nextEl: '.hero-next',
                prevEl: '.hero-prev',
            },
            
            // Pagination
            pagination: {
                el: '.hero-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                    return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
                },
            },
            
            // Keyboard Control
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Touch/Swipe
            touchRatio: 1,
            threshold: 10,
            
            // Events
            on: {
                init: (swiper) => {
                    console.log('📱 Swiper initialized');
                    this.onSlideChange(swiper);
                },
                slideChange: (swiper) => {
                    this.onSlideChange(swiper);
                },
                slideChangeTransitionStart: (swiper) => {
                    this.pauseInactiveVideos(swiper.realIndex);
                },
                slideChangeTransitionEnd: (swiper) => {
                    this.playActiveVideo(swiper.realIndex);
                },
            }
        });
    }

    /**
     * Handle slide change events
     */
    onSlideChange(swiper) {
        this.currentSlide = swiper.realIndex;
        
        // Update analytics or tracking
        this.trackSlideView(this.currentSlide);
        
        // Add custom animations if needed
        this.animateSlideContent(this.currentSlide);
    }

    /**
     * Setup video playback management
     */
    setupVideoPlayback() {
        this.videos.forEach((video, index) => {
            // Preload settings
            video.preload = index === 0 ? 'auto' : 'metadata';
            
            // Load event
            video.addEventListener('loadedmetadata', () => {
                if (index === 0) {
                    this.playVideo(video);
                }
            });

            // Error handling
            video.addEventListener('error', (e) => {
                console.error(`Video ${index} failed to load:`, e);
                this.handleVideoError(video, index);
            });

            // Loop handling
            video.addEventListener('ended', () => {
                video.currentTime = 0;
                this.playVideo(video);
            });

            // Intersection Observer for performance
            this.observeVideo(video);
        });

        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.pauseAllVideos();
        }
    }

    /**
     * Play video with error handling
     */
    playVideo(video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`Video ${video.dataset.index || ''} playing`);
                })
                .catch((error) => {
                    console.warn('Video autoplay prevented:', error);
                    // Try to play on user interaction
                    this.enablePlayOnInteraction(video);
                });
        }
    }

    /**
     * Enable video play on user interaction
     */
    enablePlayOnInteraction(video) {
        const playOnInteraction = () => {
            this.playVideo(video);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
    }

    /**
     * Play video for active slide
     */
    playActiveVideo(slideIndex) {
        if (this.videos[slideIndex]) {
            this.playVideo(this.videos[slideIndex]);
        }
    }

    /**
     * Pause videos for inactive slides
     */
    pauseInactiveVideos(activeIndex) {
        this.videos.forEach((video, index) => {
            if (index !== activeIndex) {
                video.pause();
            }
        });
    }

    /**
     * Pause all videos
     */
    pauseAllVideos() {
        this.videos.forEach(video => video.pause());
    }

    /**
     * Handle video loading errors
     */
    handleVideoError(video, index) {
        const fallbackImage = video.getAttribute('poster');
        if (fallbackImage) {
            const parent = video.parentElement;
            parent.style.backgroundImage = `url(${fallbackImage})`;
            parent.style.backgroundSize = 'cover';
            parent.style.backgroundPosition = 'center';
            video.style.display = 'none';
        }
    }

    /**
     * Observe video with Intersection Observer
     */
    observeVideo(video) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.playVideo(video);
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(video);
    }

    /**
     * Setup scroll indicator functionality
     */
    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        // Click to scroll
        this.scrollIndicator.addEventListener('click', () => {
            this.scrollToNextSection();
        });

        // Hide on scroll
        this.handleScrollIndicatorVisibility();
    }

    /**
     * Scroll to next section
     */
    scrollToNextSection() {
        const nextSection = this.heroSection.nextElementSibling;
        
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Handle scroll indicator visibility
     */
    handleScrollIndicatorVisibility() {
        let rafId = null;
        
        window.addEventListener('scroll', () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (scrolled > 300) {
                    this.scrollIndicator.style.opacity = '0';
                    this.scrollIndicator.style.pointerEvents = 'none';
                } else {
                    this.scrollIndicator.style.opacity = '1';
                    this.scrollIndicator.style.pointerEvents = 'auto';
                }
                
                rafId = null;
            });
        }, { passive: true });
    }

    /**
     * Setup CTA button interactions
     */
    setupCTAButtons() {
        this.ctaButtons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });

            // Magnetic effect on desktop
            if (!this.isMobile) {
                this.addMagneticEffect(button);
            }

            // Track clicks
            button.addEventListener('click', () => {
                this.trackCTAClick(button);
            });
        });
    }

    /**
     * Create ripple effect on button click
     */
    createRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleEffect 0.8s ease-out;
            z-index: 0;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    /**
     * Add magnetic effect to button
     */
    addMagneticEffect(button) {
        const heroSection = this.heroSection;
        
        const magnetic = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            const threshold = 120;
            
            if (distance < threshold) {
                const strength = (threshold - distance) / threshold;
                const moveX = x * strength * 0.4;
                const moveY = y * strength * 0.4;
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        };

        heroSection.addEventListener('mousemove', magnetic);
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    }

    /**
     * Setup particle effects
     */
    setupParticleEffects() {
        const particleContainers = document.querySelectorAll('.particle-container');
        
        particleContainers.forEach((container, index) => {
            const particleType = container.getAttribute('data-particle-type');
            
            if (particleType === 'sparkle') {
                this.createSparkles(container);
            } else if (particleType === 'petals') {
                this.createPetals(container);
            }
        });
    }

    /**
     * Create sparkle particles
     */
    createSparkles(container) {
        const sparkleCount = this.isMobile ? 5 : 10;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle-particle');
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = Math.random() * 3 + 2;
            
            sparkle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(169, 200, 156, 0.8);
                border-radius: 50%;
                left: ${left}%;
                top: -10%;
                box-shadow: 0 0 ${size * 2}px rgba(169, 200, 156, 0.6);
                animation: sparkleFloat ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
            `;
            
            container.appendChild(sparkle);
        }
    }

    /**
     * Create petal particles
     */
    createPetals(container) {
        const petalCount = this.isMobile ? 3 : 6;
        
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal-particle');
            
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 6;
            
            petal.textContent = '🌸';
            petal.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 10 + 15}px;
                left: ${left}%;
                top: -10%;
                opacity: ${Math.random() * 0.4 + 0.3};
                animation: petalFall ${duration}s linear ${delay}s infinite;
                pointer-events: none;
            `;
            
            container.appendChild(petal);
        }
    }

    /**
     * Setup GSAP animations
     */
    setupGSAPAnimations() {
        // Parallax effect on scroll
        gsap.to('.slide-video', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: this.heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // Glass panel parallax
        gsap.to('.glass-panel', {
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: this.heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 2
            }
        });
    }

    /**
     * Animate slide content
     */
    animateSlideContent(slideIndex) {
        const slide = document.querySelectorAll('.swiper-slide')[slideIndex];
        if (!slide) return;

        const title = slide.querySelector('.slide-title');
        const subtitle = slide.querySelector('.slide-subtitle');
        const cta = slide.querySelector('.cta-primary');

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            tl.from(title, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from(subtitle, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4')
            .from(cta, {
                scale: 0.95,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.5)'
            }, '-=0.3');
        }
    }

    /**
     * Setup responsive handling
     */
    setupResponsiveHandling() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            
            resizeTimer = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                if (wasMobile !== this.isMobile) {
                    console.log(`📱 Device changed: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
                    this.handleDeviceChange();
                }

                // Update viewport height
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }, 250);
        });

        // Initial viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    /**
     * Handle device change (mobile/desktop)
     */
    handleDeviceChange() {
        // Rebuild particle effects with appropriate count
        const particleContainers = document.querySelectorAll('.particle-container');
        particleContainers.forEach(container => {
            container.innerHTML = '';
        });
        this.setupParticleEffects();
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Keyboard navigation
        this.heroSection.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.swiper?.slidePrev();
            } else if (e.key === 'ArrowRight') {
                this.swiper?.slideNext();
            }
        });

        // Pause autoplay on focus
        this.heroSection.addEventListener('focusin', () => {
            this.swiper?.autoplay.stop();
        });

        this.heroSection.addEventListener('focusout', () => {
            if (this.isAutoplayActive) {
                this.swiper?.autoplay.start();
            }
        });

        // Reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            this.swiper?.autoplay.stop();
            this.pauseAllVideos();
        }
    }

    /**
     * Track slide view (analytics placeholder)
     */
    trackSlideView(slideIndex) {
        console.log(`📊 Slide ${slideIndex + 1} viewed`);
        // Add your analytics code here
        // Example: gtag('event', 'slide_view', { slide_number: slideIndex + 1 });
    }

    /**
     * Track CTA click (analytics placeholder)
     */
    trackCTAClick(button) {
        const ctaText = button.querySelector('.cta-text')?.textContent || 'Unknown';
        console.log(`📊 CTA clicked: ${ctaText}`);
        // Add your analytics code here
        // Example: gtag('event', 'cta_click', { cta_name: ctaText });
    }
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌿 Laura\'s Beauty Touch - Hero Section Loading...');
    
    // Initialize Hero Section
    const heroManager = new HeroSectionManager();

    // Add custom animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }

        @keyframes sparkleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(110vh) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes petalFall {
            0% {
                transform: translateY(0) rotate(0deg) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(110vh) rotate(720deg) translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Performance optimization
    const criticalElements = document.querySelectorAll('.slide-video, .glass-panel');
    criticalElements.forEach(element => {
        element.style.willChange = 'transform';
    });

    // Remove will-change after animations complete
    setTimeout(() => {
        criticalElements.forEach(element => {
            element.style.willChange = 'auto';
        });
    }, 3000);

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    console.log('✅ Hero Section Ready');
});

// ============================================
// PRELOAD CRITICAL ASSETS
// ============================================
window.addEventListener('load', () => {
    // Preload first video
    const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
    
    console.log('✅ Critical assets preloaded');
});
