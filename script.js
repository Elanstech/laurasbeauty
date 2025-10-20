// ============================================
// PRELOADER SECTION
// ============================================
class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePreloader();
            }, 2200);
        });
    }

    hidePreloader() {
        this.preloader.classList.add('hidden');
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const spaHeaderManager = new SpaHeaderManager();
    
    // Add performance optimization for floating animation
    const floatingElements = document.querySelectorAll('.header-logo, .header-logo-image');
    floatingElements.forEach(element => {
        element.style.willChange = 'transform';
    });
    
    // Log initialization (remove in production)
    console.log('🌿 Spa Header with Refined Mega Menu initialized successfully');
});

// ============================================
// HERO SECTION
// ============================================
class HeroManager {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.videoContainers = document.querySelectorAll('.video-container');
        this.videos = document.querySelectorAll('.video-container video');
        this.bgLayers = document.querySelectorAll('.bg-layer');
        this.floatingElements = document.querySelectorAll('.float-element');
        this.currentLayerIndex = 0;
        this.init();
    }

    init() {
        this.handleVideoPlayback();
        this.handleBackgroundRotation();
        this.handleParallax();
        this.handleFloatingElements();
        this.handleButtonAnimations();
    }

    handleVideoPlayback() {
        this.videos.forEach((video, index) => {
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play();
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.videoContainers[index]);
        });
    }

    handleBackgroundRotation() {
        setInterval(() => {
            this.bgLayers.forEach(layer => layer.classList.remove('active'));
            
            this.currentLayerIndex = (this.currentLayerIndex + 1) % this.bgLayers.length;
            this.bgLayers[this.currentLayerIndex].classList.add('active');
        }, 5000);
    }

    handleParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            this.videoContainers.forEach((container, index) => {
                const speed = parallaxSpeed * (index + 1) * 0.3;
                container.style.transform = `translateY(${scrolled * speed}px)`;
            });

            this.floatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                const rotate = scrolled * 0.02 * (index + 1);
                element.style.transform = `translate(${Math.sin(scrolled * 0.001) * 20}px, ${yPos}px) rotate(${rotate}deg)`;
            });
        });
    }

    handleFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const randomDelay = Math.random() * 2;
            const randomDuration = 6 + Math.random() * 4;
            element.style.animationDelay = `${randomDelay}s`;
            element.style.animationDuration = `${randomDuration}s`;
        });
    }

    handleButtonAnimations() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--mouse-x', `${x}px`);
                button.style.setProperty('--mouse-y', `${y}px`);
            });

            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        const primaryButton = document.querySelector('.btn-primary');
        const secondaryButton = document.querySelector('.btn-secondary');

        if (primaryButton) {
            primaryButton.addEventListener('click', () => {
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (secondaryButton) {
            secondaryButton.addEventListener('click', () => {
                alert('Video modal would open here - integrate with your video player!');
            });
        }
    }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const preloaderManager = new PreloaderManager();
    const headerManager = new HeaderManager();
    const heroManager = new HeroManager();
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    const bookButtons = document.querySelectorAll('.btn-book, .mobile-btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Booking system would open here - integrate with your scheduling platform!');
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    window.dispatchEvent(new Event('resize'));

    const heroFeatures = document.querySelectorAll('.feature-item');
    heroFeatures.forEach((feature, index) => {
        feature.style.animationDelay = `${1.2 + (index * 0.1)}s`;
    });

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content > *').forEach(el => {
        observer.observe(el);
    });
});
