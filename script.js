// ============================================
// LIQUID GLASS PRELOADER (Apple-Inspired)
// ============================================
class LiquidGlassPreloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.loadingFill = document.querySelector('.loading-fill');
        this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';
        
        // Handle page load
        window.addEventListener('load', () => {
            console.log('✨ Page loaded - elegant exit...');
            setTimeout(() => {
                this.hidePreloader();
            }, 500);
        });

        // Failsafe timeout
        setTimeout(() => {
            if (this.preloader && !this.preloader.classList.contains('hidden')) {
                console.log('⚡ Failsafe: hiding preloader');
                this.hidePreloader();
            }
        }, 3500);
    }

    hidePreloader() {
        if (!this.preloader) {
            console.log('⚠️ No preloader found');
            document.body.style.overflow = 'auto';
            return;
        }
        
        this.preloader.classList.add('hidden');
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('✅ Welcome to Laura\'s Beauty Touch');
        }, 800);
    }
}

// ============================================
// ENHANCED PREMIUM HEADER
// ============================================
class PremiumHeader {
    constructor() {
        this.header = document.querySelector('.premium-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.submenuTriggers = document.querySelectorAll('.submenu-trigger');
        this.logoWrapper = document.querySelector('.header-logo-wrapper');
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSubmenu();
        this.handleLogoClick();
        this.handleMegaMenuAccessibility();
    }

    handleScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 80) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    handleMobileMenu() {
        if (!this.mobileToggle) return;

        // Toggle menu
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close on overlay click
        this.mobileOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close on link click
        const mobileLinks = document.querySelectorAll('.mobile-link:not(.submenu-trigger), .submenu-list a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close on escape key
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
        
        // Close all submenus
        this.submenuTriggers.forEach(trigger => {
            trigger.classList.remove('active');
            const submenu = trigger.nextElementSibling;
            if (submenu) {
                submenu.classList.remove('active');
            }
        });
    }

    handleSubmenu() {
        this.submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                const submenu = trigger.nextElementSibling;
                const isActive = trigger.classList.contains('active');
                
                // Close other submenus
                this.submenuTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        otherTrigger.classList.remove('active');
                        const otherSubmenu = otherTrigger.nextElementSibling;
                        if (otherSubmenu) {
                            otherSubmenu.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current submenu
                if (isActive) {
                    trigger.classList.remove('active');
                    submenu.classList.remove('active');
                } else {
                    trigger.classList.add('active');
                    submenu.classList.add('active');
                }
            });
        });
    }

    handleLogoClick() {
        if (this.logoWrapper) {
            this.logoWrapper.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Add cursor pointer
            this.logoWrapper.style.cursor = 'pointer';
        }
    }

    handleMegaMenuAccessibility() {
        // Add keyboard navigation for mega menu
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowDown' && serviceItems[index + 1]) {
                    e.preventDefault();
                    serviceItems[index + 1].focus();
                }
                
                if (e.key === 'ArrowUp' && serviceItems[index - 1]) {
                    e.preventDefault();
                    serviceItems[index - 1].focus();
                }
            });
        });
    }
}

// ============================================
// ENHANCED HERO SECTION
// ============================================
class EnhancedHeroSection {
    constructor() {
        this.swiper = null;
        this.videos = document.querySelectorAll('.slide-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.heroSection = document.querySelector('.hero-section');
        this.heroContent = document.querySelectorAll('.hero-content');
        this.currentSlide = 0;
        this.autoScrollTimer = null;
        this.userHovered = false;
        this.scrollOffset = 0;
        
        this.init();
    }

    init() {
        console.log('🌟 Initializing Enhanced Hero Section...');
        
        this.initSwiper();
        this.setupVideos();
        this.createBokehParticles();
        this.setupParallaxScroll();
        this.setupScrollIndicator();
        this.setupAutoScroll();
        this.handleHoverPause();
        
        console.log('✅ Enhanced Hero Section Ready');
    }

    initSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('❌ Swiper library not loaded');
            return;
        }

        this.swiper = new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1400,
            loop: true,
            grabCursor: true,
            
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            },
            
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                    return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
                },
            },
            
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            on: {
                init: () => {
                    this.onSlideChange();
                },
                slideChange: () => {
                    this.onSlideChange();
                },
                slideChangeTransitionStart: () => {
                    this.pauseInactiveVideos();
                },
                slideChangeTransitionEnd: () => {
                    this.playActiveVideo();
                },
            }
        });

        console.log('✅ Swiper Initialized with Enhanced Settings');
    }

    onSlideChange() {
        if (this.swiper) {
            this.currentSlide = this.swiper.realIndex;
            console.log(`📍 Current Slide: ${this.currentSlide + 1}`);
        }
    }

    setupVideos() {
        this.videos.forEach((video, index) => {
            if (index === 0) {
                video.preload = 'auto';
            } else {
                video.preload = 'metadata';
            }

            video.addEventListener('loadedmetadata', () => {
                console.log(`🎬 Video ${index + 1} metadata loaded`);
                if (index === 0) {
                    setTimeout(() => this.playVideo(video), 100);
                }
            });

            video.addEventListener('error', (e) => {
                console.error(`❌ Video ${index + 1} error:`, e);
                this.handleVideoError(video);
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(e => console.log('Loop play prevented'));
            });

            this.observeVideo(video);
        });

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.videos.forEach(video => video.pause());
        }

        // Enable play on first interaction
        this.enablePlayOnFirstInteraction();
    }

    playVideo(video) {
        if (!video) return;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Video playing smoothly');
                })
                .catch(() => {
                    console.log('ℹ️ Autoplay prevented - will play on user interaction');
                });
        }
    }

    enablePlayOnFirstInteraction() {
        const playAllVideos = () => {
            console.log('🎬 User interaction detected - enabling videos');
            this.videos.forEach(video => {
                video.muted = true;
                video.play().catch(e => console.log('Video play failed'));
            });
        };
        
        document.addEventListener('click', playAllVideos, { once: true });
        document.addEventListener('touchstart', playAllVideos, { once: true });
        document.addEventListener('keydown', playAllVideos, { once: true });
    }

    playActiveVideo() {
        if (this.swiper) {
            const activeIndex = this.swiper.realIndex;
            if (this.videos[activeIndex]) {
                const video = this.videos[activeIndex];
                video.muted = true;
                video.play().catch(e => {
                    console.log('Active video play prevented');
                });
            }
        }
    }

    pauseInactiveVideos() {
        if (this.swiper) {
            const activeIndex = this.swiper.realIndex;
            this.videos.forEach((video, index) => {
                if (index !== activeIndex && !video.paused) {
                    video.pause();
                }
            });
        }
    }

    handleVideoError(video) {
        const parent = video.parentElement;
        parent.style.background = 'linear-gradient(135deg, #3B4A2F 0%, #2A3522 100%)';
        video.style.display = 'none';
        console.log('📹 Video error handled with elegant gradient fallback');
    }

    observeVideo(video) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.muted = true;
                        video.play().catch(e => {});
                    } else {
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(video);
    }

    createBokehParticles() {
        const bokehLayers = document.querySelectorAll('.bokeh-layer');
        const isMobile = window.innerWidth <= 768;
        
        bokehLayers.forEach((layer, slideIndex) => {
            const particleCount = isMobile ? 5 : 10;
            
            for (let i = 0; i < particleCount; i++) {
                const bokeh = document.createElement('div');
                bokeh.className = 'bokeh';
                
                const left = Math.random() * 100;
                const delay = Math.random() * 10;
                const duration = Math.random() * 15 + 10;
                const size = Math.random() * 50 + 25;
                const drift = (Math.random() - 0.5) * 120;
                
                bokeh.style.cssText = `
                    left: ${left}%;
                    top: 110%;
                    width: ${size}px;
                    height: ${size}px;
                    animation-delay: ${delay}s;
                    animation-duration: ${duration}s;
                    --drift: ${drift}px;
                `;
                
                layer.appendChild(bokeh);
            }
        });
        
        console.log('✨ Premium bokeh particles created');
    }

    setupParallaxScroll() {
        let rafId = null;
        
        window.addEventListener('scroll', () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                this.scrollOffset = window.pageYOffset;
                
                // Parallax for content
                this.heroContent.forEach((content) => {
                    const parallaxSpeed = 0.5;
                    const yOffset = this.scrollOffset * parallaxSpeed;
                    content.style.transform = `translateZ(60px) translateY(${yOffset}px)`;
                });
                
                // Parallax for videos
                this.videos.forEach((video) => {
                    const parallaxSpeed = 0.25;
                    const yOffset = this.scrollOffset * parallaxSpeed;
                    
                    if (this.scrollOffset < window.innerHeight) {
                        video.style.transform = `translate(-50%, calc(-50% + ${yOffset}px)) scale(1.15)`;
                    }
                });
                
                rafId = null;
            });
        }, { passive: true });
        
        console.log('🌊 Enhanced parallax scroll enabled');
    }

    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        this.scrollIndicator.addEventListener('click', () => {
            this.scrollToNext();
        });

        let rafId = null;
        
        window.addEventListener('scroll', () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (scrolled > 100) {
                    this.scrollIndicator.classList.add('hidden');
                } else {
                    this.scrollIndicator.classList.remove('hidden');
                }
                
                rafId = null;
            });
        }, { passive: true });
        
        console.log('👆 Enhanced scroll indicator ready');
    }

    scrollToNext() {
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

    setupAutoScroll() {
        const autoScrollDelay = 22000; // 22 seconds
        
        this.autoScrollTimer = setTimeout(() => {
            if (!this.userHovered && window.pageYOffset === 0) {
                console.log('🔽 Auto-scrolling to next section...');
                this.scrollToNext();
            }
        }, autoScrollDelay);
        
        console.log('⏰ Auto-scroll scheduled for 22 seconds');
    }

    handleHoverPause() {
        this.heroSection.addEventListener('mouseenter', () => {
            this.userHovered = true;
            console.log('⏸️ Auto-scroll paused (user hovering)');
        });

        this.heroSection.addEventListener('mouseleave', () => {
            console.log('▶️ User left hero area');
        });
    }
}

// ============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
        
        console.log('🔗 Smooth scroll enabled for all anchor links');
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
            console.log(`📸 Native lazy loading enabled for ${images.length} images`);
        }

        // Preload critical resources
        this.preloadCriticalResources();
        
        // Log performance metrics
        this.logPerformanceMetrics();
    }

    preloadCriticalResources() {
        const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
        if (firstVideo) {
            firstVideo.preload = 'auto';
            console.log('🎬 First video preloaded for optimal performance');
        }
    }

    logPerformanceMetrics() {
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
// INITIALIZE ALL COMPONENTS
// ============================================
const initializeWebsite = () => {
    console.log('🌿 Laura\'s Beauty Touch - Simple Luxury');
    console.log('💎 Initializing components...');
    
    new LiquidGlassPreloader();
    new PremiumHeader();
    new EnhancedHeroSection();
    new SmoothScroll();
    new PerformanceOptimizer();
    
    console.log('✅ All components ready');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// Additional page load handler
window.addEventListener('load', () => {
    console.log('✅ Page fully loaded and ready');
    
    // Ensure first video is ready to play
    const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
});

console.log('🌟 Simple Luxury - Script Loaded');
