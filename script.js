// ============================================
// LAURA'S BEAUTY TOUCH - MAIN JAVASCRIPT
// Natural Luxury Spa 
// ============================================

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
                console.log('⏱️ Failsafe triggered: Hiding preloader');
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
                console.log('✅ Preloader hidden successfully');
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

            const handleMouseEnter = () => {
                clearTimeout(this.megaMenuTimeout);
                megaMenu.style.opacity = '1';
                megaMenu.style.visibility = 'visible';
                megaMenu.style.pointerEvents = 'all';
            };

            const handleMouseLeave = () => {
                this.megaMenuTimeout = setTimeout(() => {
                    megaMenu.style.opacity = '0';
                    megaMenu.style.visibility = 'hidden';
                    megaMenu.style.pointerEvents = 'none';
                }, 200);
            };

            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);
            megaMenu.addEventListener('mouseenter', handleMouseEnter);
            megaMenu.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    handleMobileMenu() {
        if (!this.mobileToggle || !this.mobileDrawer || !this.mobileOverlay) return;

        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.mobileOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.accordion-trigger), .accordion-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

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
                
                this.accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        otherTrigger.classList.remove('active');
                        const otherAccordion = otherTrigger.nextElementSibling;
                        if (otherAccordion) {
                            otherAccordion.classList.remove('active');
                        }
                    }
                });
                
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
                
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
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
class AdvancedHeroManager {
    constructor() {
        this.hero = document.querySelector('.hero');
        if (!this.hero) return;

        this.videoContainers = document.querySelectorAll('.video-container');
        this.videos = document.querySelectorAll('.hero-video');
        this.mobileVideos = document.querySelectorAll('.mobile-hero-video');
        this.bgLayers = document.querySelectorAll('.bg-layer');
        this.floatingElements = document.querySelectorAll('.float-element');
        this.glassPanel = document.querySelector('.glass-panel');
        this.ctaButton = document.getElementById('heroCTA');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.heroHeadline = document.getElementById('heroHeadline');
        this.heroSubtitle = document.getElementById('heroSubtitle');
        
        this.currentLayerIndex = 0;
        this.swiper = null;
        this.isDesktop = window.innerWidth > 768;
        
        this.init();
    }

    init() {
        this.setupVideoPlayback();
        this.initializeGSAP();
        this.setupBackgroundRotation();
        this.setupParallax();
        this.setupFloatingElements();
        this.setupCTAButton();
        this.setupScrollIndicator();
        this.initializeMobileSwiper();
        this.setupIntersectionObserver();
        this.setupResponsiveHandling();
    }

    // ============================================
    // VIDEO PLAYBACK
    // ============================================
    
    setupVideoPlayback() {
        const allVideos = [...this.videos, ...this.mobileVideos];
        
        allVideos.forEach((video, index) => {
            video.preload = index === 0 ? 'auto' : 'metadata';
            
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                    document.addEventListener('click', () => {
                        video.play().catch(() => {});
                    }, { once: true });
                });
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play();
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(video);
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            allVideos.forEach(video => {
                video.pause();
                video.style.opacity = '0.6';
            });
        }
    }

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    
    initializeGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(this.videoContainers, {
                scale: 0.9,
                opacity: 0,
                duration: 1.8,
                stagger: 0.3,
                ease: 'power4.out'
            })
            .from(this.glassPanel, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, '-=1.2')
            .from('.brand-logo', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.8')
            .from([this.heroHeadline, this.heroSubtitle], {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2
            }, '-=0.6')
            .from('.service-tags .tag', {
                x: -20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            }, '-=0.4')
            .from('.cta-button', {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.5)'
            }, '-=0.4')
            .from('.explore-link', {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.4')
            .from(this.scrollIndicator, {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.3');

            gsap.to(this.videoContainers, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

            gsap.to(this.glassPanel, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            this.floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                gsap.to(element, {
                    y: -100 * speed,
                    rotation: 15 * (index % 2 === 0 ? 1 : -1),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: this.hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1 + (index * 0.2)
                    }
                });
            });
        } else {
            console.warn('⚠️ GSAP not loaded - animations disabled');
        }
    }

    // ============================================
    // BACKGROUND ROTATION
    // ============================================
    
    setupBackgroundRotation() {
        if (this.bgLayers.length === 0) return;

        setInterval(() => {
            this.bgLayers.forEach(layer => layer.classList.remove('active'));
            
            this.currentLayerIndex = (this.currentLayerIndex + 1) % this.bgLayers.length;
            this.bgLayers[this.currentLayerIndex].classList.add('active');
        }, 6000);
    }

    // ============================================
    // PARALLAX SCROLLING
    // ============================================
    
    setupParallax() {
        let rafId = null;
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = this.hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                this.videoContainers.forEach((container, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = scrolled * speed;
                    container.style.transform = `translateY(${yPos}px)`;
                });

                this.floatingElements.forEach((element, index) => {
                    const speed = 0.15 + (index * 0.08);
                    const yPos = scrolled * speed;
                    const rotation = scrolled * 0.03 * (index + 1);
                    const xOffset = Math.sin(scrolled * 0.002 + index) * 25;
                    element.style.transform = `translate(${xOffset}px, ${yPos}px) rotate(${rotation}deg)`;
                });
            }
            
            rafId = null;
        };

        window.addEventListener('scroll', () => {
            if (!rafId) {
                rafId = requestAnimationFrame(handleParallax);
            }
        }, { passive: true });
    }

    // ============================================
    // FLOATING ELEMENTS
    // ============================================
    
    setupFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const randomDelay = Math.random() * 3;
            const randomDuration = 6 + Math.random() * 4;
            
            element.style.animationDelay = `${randomDelay}s`;
            element.style.animationDuration = `${randomDuration}s`;
        });
    }

    // ============================================
    // CTA BUTTON
    // ============================================
    
    setupCTAButton() {
        if (!this.ctaButton) return;

        this.ctaButton.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.ctaButton.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.8s ease-out;
            `;
            
            this.ctaButton.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);

            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        if (this.isDesktop) {
            const magnetic = (e) => {
                const rect = this.ctaButton.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const distance = Math.sqrt(x * x + y * y);
                const threshold = 100;
                
                if (distance < threshold) {
                    const strength = (threshold - distance) / threshold;
                    const moveX = x * strength * 0.3;
                    const moveY = y * strength * 0.3;
                    this.ctaButton.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            };

            this.hero.addEventListener('mousemove', magnetic);
            
            this.ctaButton.addEventListener('mouseleave', () => {
                this.ctaButton.style.transform = '';
            });
        }
    }

    // ============================================
    // SCROLL INDICATOR
    // ============================================
    
    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        this.scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.scrollIndicator.style.opacity = '0';
                this.scrollIndicator.style.pointerEvents = 'none';
            } else {
                this.scrollIndicator.style.opacity = '1';
                this.scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }

    // ============================================
    // MOBILE SWIPER
    // ============================================
    
    initializeMobileSwiper() {
        if (typeof Swiper === 'undefined' || this.isDesktop) return;

        const swiperElement = document.querySelector('.hero-swiper');
        if (!swiperElement) return;

        this.swiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1200,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            lazy: {
                loadPrevNext: true,
            },
            on: {
                slideChange: (swiper) => {
                    this.mobileVideos.forEach((video, index) => {
                        if (index === swiper.realIndex) {
                            video.play().catch(() => {});
                        } else {
                            video.pause();
                        }
                    });
                }
            }
        });

        console.log('📱 Mobile Swiper initialized');
    }

    // ============================================
    // INTERSECTION OBSERVER
    // ============================================
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        const elementsToObserve = this.hero.querySelectorAll(
            '.glass-panel, .floating-elements, .scroll-indicator'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // ============================================
    // RESPONSIVE HANDLING
    // ============================================
    
    setupResponsiveHandling() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            
            resizeTimer = setTimeout(() => {
                const wasDesktop = this.isDesktop;
                this.isDesktop = window.innerWidth > 768;
                
                if (wasDesktop !== this.isDesktop) {
                    if (!this.isDesktop && !this.swiper) {
                        this.initializeMobileSwiper();
                    }
                }

                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }, 250);
        });

        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌿 Laura\'s Beauty Touch - Initializing...');

    // Initialize Preloader
    const preloaderManager = new PreloaderManager();
    
    // Initialize Header
    const headerManager = new SpaHeaderManager();
    
    // Initialize Hero
    const heroManager = new AdvancedHeroManager();

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Performance optimization
    const floatingElements = document.querySelectorAll('.header-logo, .header-logo-image');
    floatingElements.forEach(element => {
        element.style.willChange = 'transform';
    });

    const heroVideos = document.querySelectorAll('.hero-video, .mobile-hero-video');
    heroVideos.forEach(video => {
        video.style.willChange = 'transform';
    });

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    console.log('✅ All components initialized successfully');
});

// ============================================
// PRELOAD CRITICAL ASSETS
// ============================================
const preloadVideo = () => {
    const firstVideo = document.querySelector('.video-container.video-2 video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadVideo);
} else {
    preloadVideo();
}
