// ============================================
// PRELOADER MANAGER
// ============================================
class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';
        
        window.addEventListener('load', () => {
            console.log('🎬 Page loaded, hiding preloader...');
            this.hidePreloader();
        });

        setTimeout(() => {
            if (this.preloader && !this.preloader.classList.contains('hidden')) {
                console.log('⚡ Failsafe: Hiding preloader');
                this.hidePreloader();
            }
        }, 2500);
    }

    hidePreloader() {
        if (!this.preloader) {
            console.log('⚠️ No preloader found');
            document.body.style.overflow = 'auto';
            return;
        }
        
        setTimeout(() => {
            this.preloader.classList.add('hidden');
            
            setTimeout(() => {
                this.preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
                console.log('✅ Preloader hidden, scrolling enabled');
            }, 600);
        }, 1500);
    }
}

// ============================================
// HEADER MANAGER
// ============================================
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.spa-header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.accordionTriggers = document.querySelectorAll('.accordion-trigger');
        this.logo = document.querySelector('.header-logo');
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleAccordion();
        this.handleLogoClick();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    handleMobileMenu() {
        if (!this.mobileToggle) return;

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
}

// ============================================
// HERO SECTION MANAGER
// ============================================
class HeroSection {
    constructor() {
        this.swiper = null;
        this.videos = document.querySelectorAll('.slide-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.heroSection = document.querySelector('.hero-section');
        this.currentSlide = 0;
        
        this.init();
    }

    init() {
        console.log('🌿 Initializing Hero Section...');
        
        this.initSwiper();
        this.setupVideos();
        this.setupScrollIndicator();
        this.createParticles();
        this.handleScroll();
        
        console.log('✅ Hero Section Ready');
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
            speed: 1200,
            loop: true,
            grabCursor: true,
            
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
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
            
            touchRatio: 1,
            threshold: 10,
            
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
            console.log(`Slide: ${this.currentSlide + 1}`);
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
                console.log(`Video ${index} loaded`);
                if (index === 0) {
                    setTimeout(() => this.playVideo(video), 100);
                }
            });

            video.addEventListener('error', (e) => {
                console.error(`Video ${index} error:`, e);
                this.handleVideoError(video);
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(e => console.log('Loop play prevented'));
            });

            this.observeVideo(video);
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.videos.forEach(video => video.pause());
        }

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
            
            document.removeEventListener('click', playAllVideos);
            document.removeEventListener('touchstart', playAllVideos);
            document.removeEventListener('keydown', playAllVideos);
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
        console.log('Video error handled');
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

    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        this.scrollIndicator.addEventListener('click', () => {
            this.scrollToNext();
        });
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

    handleScroll() {
        let rafId = null;
        
        window.addEventListener('scroll', () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (this.scrollIndicator) {
                    if (scrolled > 200) {
                        this.scrollIndicator.style.opacity = '0';
                        this.scrollIndicator.style.pointerEvents = 'none';
                    } else {
                        this.scrollIndicator.style.opacity = '1';
                        this.scrollIndicator.style.pointerEvents = 'auto';
                    }
                }
                
                rafId = null;
            });
        }, { passive: true });
    }

    createParticles() {
        const containers = document.querySelectorAll('.particle-container');
        
        containers.forEach((container, slideIndex) => {
            if (slideIndex === 0) {
                this.createFloatingParticles(container, '✨', 8);
            } else if (slideIndex === 1) {
                this.createFloatingParticles(container, '🌿', 6);
            } else if (slideIndex === 2) {
                this.createFloatingParticles(container, '💫', 7);
            }
        });
    }

    createFloatingParticles(container, emoji, count) {
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? Math.floor(count / 2) : count;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.textContent = emoji;
            
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 6;
            const size = Math.random() * 10 + 15;
            
            particle.style.cssText = `
                position: absolute;
                font-size: ${size}px;
                left: ${left}%;
                top: -10%;
                opacity: ${Math.random() * 0.4 + 0.3};
                animation: floatParticle ${duration}s linear ${delay}s infinite;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
    }
}

// ============================================
// INITIALIZE ALL
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PreloaderManager();
        new HeaderManager();
        new HeroSection();
    });
} else {
    new PreloaderManager();
    new HeaderManager();
    new HeroSection();
}

window.addEventListener('load', () => {
    const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
    console.log('✅ Page fully loaded');
});

console.log('🌿 Hero Section Script Loaded');
