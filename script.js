// ============================================
// HERO SECTION MANAGER - REDESIGNED
// Parallax, Auto-scroll, Bokeh Particles
// ============================================

class HeroSection {
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
        console.log('🌿 Initializing Hero Section...');
        
        this.initSwiper();
        this.setupVideos();
        this.createBokehParticles();
        this.setupParallaxScroll();
        this.setupScrollIndicator();
        this.setupAutoScroll();
        this.handleHoverPause();
        
        console.log('✅ Hero Section Ready');
    }

    // ============================================
    // SWIPER INITIALIZATION
    // ============================================
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
            speed: 1200,
            loop: true,
            grabCursor: true,
            
            autoplay: {
                delay: 6000,
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

        console.log('✅ Swiper Initialized');
    }

    onSlideChange() {
        if (this.swiper) {
            this.currentSlide = this.swiper.realIndex;
            console.log(`📍 Slide: ${this.currentSlide + 1}`);
        }
    }

    // ============================================
    // VIDEO MANAGEMENT
    // ============================================
    setupVideos() {
        this.videos.forEach((video, index) => {
            // Set preload strategy
            if (index === 0) {
                video.preload = 'auto';
            } else {
                video.preload = 'metadata';
            }

            // Handle loaded metadata
            video.addEventListener('loadedmetadata', () => {
                console.log(`🎬 Video ${index + 1} loaded`);
                if (index === 0) {
                    setTimeout(() => this.playVideo(video), 100);
                }
            });

            // Error handling
            video.addEventListener('error', (e) => {
                console.error(`❌ Video ${index + 1} error:`, e);
                this.handleVideoError(video);
            });

            // Loop handling
            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(e => console.log('Loop play prevented'));
            });

            // Intersection observer for performance
            this.observeVideo(video);
        });

        // Respect user preferences for reduced motion
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
                    console.log('✅ Video playing');
                })
                .catch(() => {
                    console.log('ℹ️ Autoplay prevented (will play on interaction)');
                });
        }
    }

    enablePlayOnFirstInteraction() {
        const playAllVideos = () => {
            console.log('🎬 User interaction - enabling videos');
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
        console.log('📹 Video error handled with gradient fallback');
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

    // ============================================
    // BOKEH PARTICLES (Replacing Emojis)
    // ============================================
    createBokehParticles() {
        const bokehLayers = document.querySelectorAll('.bokeh-layer');
        const isMobile = window.innerWidth <= 768;
        
        bokehLayers.forEach((layer, slideIndex) => {
            const particleCount = isMobile ? 4 : 8;
            
            for (let i = 0; i < particleCount; i++) {
                const bokeh = document.createElement('div');
                bokeh.className = 'bokeh';
                
                // Random properties
                const left = Math.random() * 100;
                const delay = Math.random() * 8;
                const duration = Math.random() * 12 + 8;
                const size = Math.random() * 40 + 20;
                const drift = (Math.random() - 0.5) * 100;
                
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
        
        console.log('✨ Bokeh particles created');
    }

    // ============================================
    // PARALLAX SCROLL EFFECT
    // ============================================
    setupParallaxScroll() {
        let rafId = null;
        
        window.addEventListener('scroll', () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                this.scrollOffset = window.pageYOffset;
                
                // Apply parallax to hero content
                this.heroContent.forEach((content) => {
                    const parallaxSpeed = 0.4;
                    const yOffset = this.scrollOffset * parallaxSpeed;
                    content.style.transform = `translateZ(60px) translateY(${yOffset}px)`;
                });
                
                // Apply parallax to videos (slower than content)
                this.videos.forEach((video) => {
                    const parallaxSpeed = 0.2;
                    const yOffset = this.scrollOffset * parallaxSpeed;
                    const currentTransform = video.style.transform || 'translate(-50%, -50%) scale(1.15)';
                    
                    // Only apply if hero is still visible
                    if (this.scrollOffset < window.innerHeight) {
                        video.style.transform = `translate(-50%, calc(-50% + ${yOffset}px)) scale(1.15)`;
                    }
                });
                
                rafId = null;
            });
        }, { passive: true });
        
        console.log('🌊 Parallax scroll enabled');
    }

    // ============================================
    // SCROLL INDICATOR
    // ============================================
    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        // Click handler
        this.scrollIndicator.addEventListener('click', () => {
            this.scrollToNext();
        });

        // Hide on scroll
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
        
        console.log('👆 Scroll indicator ready');
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

    // ============================================
    // AUTO-SCROLL FUNCTIONALITY
    // ============================================
    setupAutoScroll() {
        // Calculate total autoplay duration
        // 3 slides × 6 seconds per slide = 18 seconds
        // Add 2 seconds buffer for transitions
        const autoScrollDelay = 20000; // 20 seconds
        
        this.autoScrollTimer = setTimeout(() => {
            // Only auto-scroll if user hasn't hovered
            if (!this.userHovered && window.pageYOffset === 0) {
                console.log('🔽 Auto-scrolling to next section');
                this.scrollToNext();
            }
        }, autoScrollDelay);
        
        console.log('⏰ Auto-scroll scheduled for 20 seconds');
    }

    // ============================================
    // HOVER PAUSE FOR AUTO-SCROLL
    // ============================================
    handleHoverPause() {
        this.heroSection.addEventListener('mouseenter', () => {
            this.userHovered = true;
            console.log('⏸️ Auto-scroll paused (user hovering)');
        });

        this.heroSection.addEventListener('mouseleave', () => {
            // Don't re-enable auto-scroll after user has already hovered
            // This prevents unexpected scrolling
            console.log('▶️ User left hero area');
        });
    }
}

// ============================================
// INITIALIZE
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeroSection();
    });
} else {
    new HeroSection();
}

// Optimize first video on full page load
window.addEventListener('load', () => {
    const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
    console.log('✅ Page fully loaded - Hero optimized');
});

console.log('🌿 Hero Section Script Loaded');
