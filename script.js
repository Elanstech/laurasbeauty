// ============================================
// PRELOADER 
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
// HERO SECTION - JavaScript
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
        
        // Initialize Swiper
        this.initSwiper();
        
        // Setup video controls
        this.setupVideos();
        
        // Setup scroll indicator
        this.setupScrollIndicator();
        
        // Setup particles
        this.createParticles();
        
        // Handle scroll visibility
        this.handleScroll();
        
        console.log('✅ Hero Section Ready');
    }

    initSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library not loaded');
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
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                    return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
                },
            },
            
            // Keyboard
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Touch
            touchRatio: 1,
            threshold: 10,
            
            // Events
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
            console.log(`Slide changed to: ${this.currentSlide}`);
        }
    }

    setupVideos() {
        this.videos.forEach((video, index) => {
            // Preload first video
            if (index === 0) {
                video.preload = 'auto';
            } else {
                video.preload = 'metadata';
            }

            // Load event
            video.addEventListener('loadedmetadata', () => {
                console.log(`Video ${index} loaded`);
                if (index === 0) {
                    // Try to play first video immediately
                    setTimeout(() => this.playVideo(video), 100);
                }
            });

            // Error handling
            video.addEventListener('error', (e) => {
                console.error(`Video ${index} error:`, e);
                this.handleVideoError(video);
            });

            // Loop
            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(e => console.log('Loop play prevented'));
            });

            // Intersection Observer for performance
            this.observeVideo(video);
        });

        // Handle reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.videos.forEach(video => video.pause());
        }

        // Enable play on first user interaction
        this.enablePlayOnFirstInteraction();
    }

    playVideo(video) {
        if (!video) return;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Video playing successfully');
                })
                .catch((error) => {
                    console.log('ℹ️ Video autoplay prevented (normal browser behavior)');
                    // This is expected - will play on user interaction
                });
        }
    }

    enablePlayOnFirstInteraction() {
        const playAllVideos = () => {
            console.log('🎬 User interacted - enabling videos');
            this.videos.forEach(video => {
                video.muted = true; // Ensure muted for autoplay
                video.play().catch(e => console.log('Video play failed'));
            });
            
            // Remove listeners after first interaction
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
                video.muted = true; // Ensure muted
                video.play().catch(e => {
                    console.log('Active video play prevented - will play on interaction');
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
        console.log('Video error handled with gradient background');
    }

    observeVideo(video) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.muted = true;
                        video.play().catch(e => {
                            // Silent catch - normal behavior
                        });
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

        // Click to scroll
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
                
                // Hide scroll indicator on scroll
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
            // Different particles for each slide
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

// Add particle animation styles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatParticle {
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
            transform: translateY(110vh) rotate(360deg) translateX(50px);
            opacity: 0;
        }
    }

    .floating-particle {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(particleStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeroSection();
    });
} else {
    new HeroSection();
}

// Preload critical video on page load
window.addEventListener('load', () => {
    const firstVideo = document.querySelector('.swiper-slide:first-child .slide-video');
    if (firstVideo) {
        firstVideo.preload = 'auto';
    }
});

console.log('🌿 Hero Section Script Loaded');
