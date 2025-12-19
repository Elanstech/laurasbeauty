// ============================================
// LAURA'S BEAUTY TOUCH - MAIN SCRIPT
// ============================================

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
class PremiumHeaderWithMegaMenu {
    constructor() {
        this.header = document.querySelector('.premium-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.logoWrapper = document.querySelector('.header-logo-wrapper');
        
        // Mega Menu specific elements
        this.megamenuItem = document.querySelector('.has-megamenu');
        this.megamenuWrapper = document.querySelector('.megamenu-wrapper');
        this.megamenuTimeout = null;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleLogoClick();
        this.handleSmoothScroll();
        this.handleMegaMenu();
        this.handleMobileSubmenu();
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

        const mobileLinks = document.querySelectorAll('.mobile-link:not(.mobile-dropdown-trigger)');
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
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleMegaMenu() {
        if (!this.megamenuItem || !this.megamenuWrapper) return;

        this.megamenuItem.addEventListener('mouseenter', () => {
            this.cancelMegaMenuClose();
            this.openMegaMenu();
        });

        this.megamenuItem.addEventListener('mouseleave', () => {
            this.scheduleMegaMenuClose(300);
        });

        this.megamenuWrapper.addEventListener('mouseenter', () => {
            this.cancelMegaMenuClose();
        });

        this.megamenuWrapper.addEventListener('mouseleave', () => {
            this.scheduleMegaMenuClose(200);
        });

        document.addEventListener('click', (e) => {
            if (!this.megamenuItem.contains(e.target)) {
                this.closeMegaMenu(true);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.megamenuWrapper.style.display === 'block') {
                this.closeMegaMenu(true);
            }
        });

        this.setupMegaMenuItems();
    }

    openMegaMenu() {
        clearTimeout(this.megamenuTimeout);
        this.megamenuWrapper.style.display = 'block';
        
        void this.megamenuWrapper.offsetWidth;
        
        const menuItems = this.megamenuWrapper.querySelectorAll('.megamenu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 30);
        });
    }

    closeMegaMenu(immediate = false) {
        const menuItems = this.megamenuWrapper.querySelectorAll('.megamenu-item');
        
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
        });
        
        setTimeout(() => {
            this.megamenuWrapper.style.display = 'none';
        }, immediate ? 0 : 200);
    }

    scheduleMegaMenuClose(delay = 200) {
        this.megamenuTimeout = setTimeout(() => {
            this.closeMegaMenu();
        }, delay);
    }

    cancelMegaMenuClose() {
        clearTimeout(this.megamenuTimeout);
    }

    setupMegaMenuItems() {
        const megamenuItems = this.megamenuWrapper.querySelectorAll('.megamenu-item');
        
        megamenuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.megamenu-icon');
                if (icon) {
                    icon.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                }
            });

            item.addEventListener('click', function() {
                const title = this.querySelector('.megamenu-item-title')?.textContent;
                console.log(`📍 Category clicked: ${title}`);
            });
        });
    }

    handleMobileSubmenu() {
        const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-trigger');
        
        mobileDropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const parentItem = trigger.closest('.mobile-has-submenu');
                const isActive = parentItem.classList.contains('active');
                
                document.querySelectorAll('.mobile-has-submenu').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('active');
                    }
                });
                
                parentItem.classList.toggle('active');
            });
        });
    }
}

// ============================================
// FLOATING BUTTONS - SPECIALS & GIFT CARD
// ============================================

class FloatingButtons {
    constructor() {
        this.specialsBtn = document.getElementById('specialsBtn');
        this.giftcardBtn = document.getElementById('giftcardBtn');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.header = document.querySelector('.premium-header');
        
        this.isVisible = false;
        this.showDelay = 3000; // 3 seconds
        this.initTime = Date.now();
        
        this.init();
    }

    init() {
        console.log('✨ Initializing Floating Buttons');
        
        // Show buttons after delay
        this.scheduleShow();
        
        // Handle mobile menu
        this.handleMobileMenu();
        
        // Handle scroll
        this.handleScroll();
        
        // Track clicks
        this.trackClicks();
    }

    scheduleShow() {
        setTimeout(() => {
            this.show();
        }, this.showDelay);
    }

    show() {
        // Check if mobile menu is open
        const isMobileMenuOpen = this.mobileDrawer && 
                                 this.mobileDrawer.classList.contains('active');
        
        if (!isMobileMenuOpen) {
            if (this.specialsBtn) {
                this.specialsBtn.classList.add('visible');
            }
            if (this.giftcardBtn) {
                this.giftcardBtn.classList.add('visible');
            }
            this.isVisible = true;
            console.log('✅ Floating buttons visible');
        }
    }

    hide() {
        if (this.specialsBtn) {
            this.specialsBtn.classList.remove('visible');
            this.specialsBtn.classList.add('hidden-mobile');
        }
        if (this.giftcardBtn) {
            this.giftcardBtn.classList.remove('visible');
            this.giftcardBtn.classList.add('hidden-mobile');
        }
        this.isVisible = false;
        console.log('👋 Floating buttons hidden');
    }

    reveal() {
        if (this.specialsBtn) {
            this.specialsBtn.classList.remove('hidden-mobile');
            this.specialsBtn.classList.add('visible');
        }
        if (this.giftcardBtn) {
            this.giftcardBtn.classList.remove('hidden-mobile');
            this.giftcardBtn.classList.add('visible');
        }
        this.isVisible = true;
        console.log('👀 Floating buttons revealed');
    }

    handleMobileMenu() {
        if (!this.mobileToggle || !this.mobileDrawer) return;

        // Watch for mobile menu state changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isActive = this.mobileDrawer.classList.contains('active');
                    
                    if (isActive) {
                        this.hide();
                    } else {
                        // Only reveal if initial delay has passed
                        setTimeout(() => {
                            if (this.isVisible || Date.now() > this.initTime + this.showDelay) {
                                this.reveal();
                            }
                        }, 100);
                    }
                }
            });
        });

        observer.observe(this.mobileDrawer, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Also listen to toggle button
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                setTimeout(() => {
                    const isActive = this.mobileDrawer.classList.contains('active');
                    if (isActive) {
                        this.hide();
                    } else {
                        this.reveal();
                    }
                }, 50);
            });
        }

        // Listen to overlay clicks
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                setTimeout(() => {
                    this.reveal();
                }, 100);
            });
        }

        console.log('📱 Mobile menu handler attached');
    }

    handleScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    // Update body class for CSS
                    if (scrolled > 80) {
                        document.body.classList.add('scrolled');
                    } else {
                        document.body.classList.remove('scrolled');
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }

    trackClicks() {
        // Track Specials button
        if (this.specialsBtn) {
            this.specialsBtn.addEventListener('click', (e) => {
                console.log('🌟 Specials button clicked');
                this.createRipple(e, this.specialsBtn, 'rgba(169, 200, 156, 0.6)');
            });
        }

        // Track Gift Card button
        if (this.giftcardBtn) {
            this.giftcardBtn.addEventListener('click', (e) => {
                console.log('🎁 Gift Card button clicked');
                this.createRipple(e, this.giftcardBtn, 'rgba(212, 175, 55, 0.6)');
            });
        }
    }

    createRipple(e, button, color) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-expand {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingButtons();
    });
} else {
    new FloatingButtons();
}

// Export for manual initialization if needed
window.FloatingButtons = FloatingButtons;


// ============================================
// BLACK FRIDAY PROMO BUTTON & MODAL
// ============================================

// ============================================
// BLACK FRIDAY PROMO BUTTON & MODAL
// ============================================

class BlackFridayPromo {
    constructor() {
        this.button = document.getElementById('blackfridayBtn');
        this.modal = document.getElementById('blackfridayModal');
        this.overlay = document.getElementById('blackfridayOverlay');
        this.closeBtn = document.getElementById('blackfridayClose');
        this.termsToggle = document.getElementById('termsToggle');
        this.termsContent = document.getElementById('termsContent');
        
        // Countdown timer elements
        this.buttonTimer = document.getElementById('buttonTimer');
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        
        // End date: December 1st, 2025 at 3:00 PM EST
        this.endDate = new Date('2025-12-01T15:00:00-05:00').getTime();
        
        this.isVisible = false;
        this.showDelay = 3000; // 3 seconds
        this.initTime = Date.now();
        
        this.init();
    }

    init() {
        console.log('🎉 Initializing Black Friday Promo');
        
        // Show button after delay
        this.scheduleShow();
        
        // Handle mobile menu
        this.handleMobileMenu();
        
        // Setup modal events
        this.setupModalEvents();
        
        // Setup terms toggle
        this.setupTermsToggle();
        
        // Start countdown timer
        this.startCountdown();
        
        console.log('✅ Black Friday Promo initialized');
    }

    scheduleShow() {
        setTimeout(() => {
            this.show();
        }, this.showDelay);
    }

    show() {
        const isMobileMenuOpen = document.querySelector('.mobile-drawer')?.classList.contains('active');
        
        if (!isMobileMenuOpen && this.button) {
            this.button.classList.add('visible');
            this.isVisible = true;
            console.log('✅ Black Friday button visible');
        }
    }

    hide() {
        if (this.button) {
            this.button.classList.remove('visible');
            this.button.classList.add('hidden-mobile');
            this.isVisible = false;
        }
    }

    reveal() {
        if (this.button) {
            this.button.classList.remove('hidden-mobile');
            this.button.classList.add('visible');
            this.isVisible = true;
        }
    }

    handleMobileMenu() {
        const mobileDrawer = document.querySelector('.mobile-drawer');
        if (!mobileDrawer) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isActive = mobileDrawer.classList.contains('active');
                    
                    if (isActive) {
                        this.hide();
                    } else {
                        setTimeout(() => {
                            if (this.isVisible || Date.now() > this.initTime + this.showDelay) {
                                this.reveal();
                            }
                        }, 100);
                    }
                }
            });
        });

        observer.observe(mobileDrawer, {
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('📱 Mobile menu handler attached');
    }

    setupModalEvents() {
        // Open modal on button click
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Close modal on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }

        // Close modal on close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    setupTermsToggle() {
        if (!this.termsToggle || !this.termsContent) return;

        this.termsToggle.addEventListener('click', () => {
            const isActive = this.termsContent.classList.contains('active');
            
            if (isActive) {
                this.termsContent.classList.remove('active');
                this.termsToggle.classList.remove('active');
            } else {
                this.termsContent.classList.add('active');
                this.termsToggle.classList.add('active');
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('🎉 Black Friday modal opened');
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Close terms if open
            if (this.termsContent?.classList.contains('active')) {
                this.termsContent.classList.remove('active');
                this.termsToggle.classList.remove('active');
            }
            
            console.log('👋 Black Friday modal closed');
        }
    }

    startCountdown() {
        // Update countdown immediately
        this.updateCountdown();
        
        // Update countdown every second
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.endDate - now;

        // If countdown is finished
        if (distance < 0) {
            clearInterval(this.countdownInterval);
            this.displayExpired();
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update button timer (compact format)
        if (this.buttonTimer) {
            if (days > 0) {
                this.buttonTimer.textContent = `Ends in ${days}d ${this.pad(hours)}h`;
            } else if (hours > 0) {
                this.buttonTimer.textContent = `Ends in ${hours}h ${this.pad(minutes)}m`;
            } else {
                this.buttonTimer.textContent = `Ends in ${minutes}m ${this.pad(seconds)}s`;
            }
        }

        // Update modal timer (full display)
        if (this.daysEl) this.daysEl.textContent = this.pad(days);
        if (this.hoursEl) this.hoursEl.textContent = this.pad(hours);
        if (this.minutesEl) this.minutesEl.textContent = this.pad(minutes);
        if (this.secondsEl) this.secondsEl.textContent = this.pad(seconds);
    }

    displayExpired() {
        // Button timer
        if (this.buttonTimer) {
            this.buttonTimer.textContent = 'EXPIRED';
        }

        // Modal timer
        if (this.daysEl) this.daysEl.textContent = '00';
        if (this.hoursEl) this.hoursEl.textContent = '00';
        if (this.minutesEl) this.minutesEl.textContent = '00';
        if (this.secondsEl) this.secondsEl.textContent = '00';

        console.log('⏰ Black Friday promotion has expired');
        
        // Optionally hide the button after expiration
        // setTimeout(() => {
        //     this.button?.classList.remove('visible');
        // }, 5000);
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlackFridayPromo();
    });
} else {
    new BlackFridayPromo();
}

// Export for manual initialization if needed
window.BlackFridayPromo = BlackFridayPromo;

console.log('🎉 Black Friday script loaded');

// ============================================
// HERO VIDEO COLLAGE
// ============================================
class HeroVideoCollage {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-navigation-dots .dot');
        this.videos = document.querySelectorAll('.hero-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        if (this.slides.length === 0) return;
        
        this.init();
    }

    init() {
        this.setupVideos();
        this.setupNavigation();
        this.startAutoPlay();
        this.setupScrollIndicator();
    }

    setupVideos() {
        this.videos.forEach(video => {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            
            video.play().catch(() => {
                video.load();
                setTimeout(() => video.play().catch(() => {}), 1000);
            });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.videos.forEach(video => video.pause());
            } else {
                this.videos.forEach(video => {
                    if (video.paused) video.play().catch(() => {});
                });
            }
        });

        ['click', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                this.videos.forEach(video => {
                    if (video.paused) video.play().catch(() => {});
                });
            }, { once: true, passive: true });
        });

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.videos.forEach(video => {
                    if (video.paused) {
                        video.play().catch(() => {});
                    }
                });
            }, 300);
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
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;
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

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    this.scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ============================================
// SERVICES CAROUSEL
// ============================================
class ServicesCarousel {
    constructor() {
        this.track = document.querySelector('.services-carousel-track');
        this.slides = document.querySelectorAll('.service-tile');
        this.prevBtn = document.querySelector('.services-prev');
        this.nextBtn = document.querySelector('.services-next');
        this.indicators = document.querySelectorAll('.services-indicator');
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.totalSlides = this.slides.length;
        this.maxIndex = this.totalSlides - this.slidesToShow;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isAutoplayEnabled = true;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.attachEventListeners();
        if (this.isAutoplayEnabled) {
            this.startAutoplay();
        }
        window.addEventListener('resize', () => this.handleResize());
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }
    
    handleResize() {
        const newSlidesToShow = this.getSlidesToShow();
        if (newSlidesToShow !== this.slidesToShow) {
            this.slidesToShow = newSlidesToShow;
            this.maxIndex = this.totalSlides - this.slidesToShow;
            if (this.currentIndex > this.maxIndex) {
                this.currentIndex = this.maxIndex;
            }
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 30;
        const offset = -(this.currentIndex * (slideWidth + gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        this.updateIndicators();
        this.updateNavigationButtons();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateNavigationButtons() {
        if (this.currentIndex === 0) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }
        
        if (this.currentIndex >= this.totalSlides - 1) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    nextSlide() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            this.updateCarousel();
        } else if (this.isAutoplayEnabled) {
            this.currentIndex = 0;
            this.updateCarousel();
        }
        this.resetAutoplay();
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
        this.resetAutoplay();
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.currentIndex = 0;
                this.updateCarousel();
            }
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        if (this.isAutoplayEnabled) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }
    
    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }
    
    handleTouchEnd() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());
        
        const carouselWrapper = document.querySelector('.services-carousel-wrapper');
        carouselWrapper.addEventListener('mouseenter', () => {
            if (this.isAutoplayEnabled) {
                this.stopAutoplay();
            }
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            if (this.isAutoplayEnabled) {
                this.startAutoplay();
            }
        });
    }
}

// ============================================
// TEAM SECTION
// ============================================
class TeamSection {
    constructor() {
        this.teamSection = document.querySelector('.team-section');
        this.teamStats = document.querySelectorAll('.team-stat');
        this.teamImageFrame = document.querySelector('.team-image-frame');
        this.meetTeamBtn = document.querySelector('.btn-meet-team');
        this.animatedStats = new Set();
        
        if (!this.teamSection) return;
        
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupImageEffects();
        this.setupButtonEffects();
        this.setupStatsAnimation();
        this.addRippleStyles();
    }

    setupParallax() {
        if (this.teamStats.length === 0) return;

        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const teamOffset = this.teamSection.offsetTop;
                    const parallaxAmount = (scrolled - teamOffset) * 0.1;
                    
                    this.teamStats.forEach((stat, index) => {
                        const direction = index % 2 === 0 ? 1 : -1;
                        stat.style.transform = `translateY(${parallaxAmount * direction}px)`;
                    });
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }

    setupImageEffects() {
        if (!this.teamImageFrame) return;

        this.teamImageFrame.addEventListener('mouseenter', () => {
            this.teamImageFrame.style.transform = 'scale(1.02) rotate(1deg)';
        });

        this.teamImageFrame.addEventListener('mouseleave', () => {
            this.teamImageFrame.style.transform = '';
        });
    }

    setupButtonEffects() {
        if (!this.meetTeamBtn) return;

        this.meetTeamBtn.addEventListener('click', (e) => {
            console.log('🤝 Meet Team button clicked');
            this.createRipple(e);
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.classList.add('team-button-ripple');
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupStatsAnimation() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedStats.has(entry.target)) {
                    this.animatedStats.add(entry.target);
                    this.animateStatNumber(entry.target);
                }
            });
        }, observerOptions);

        this.teamStats.forEach(stat => observer.observe(stat));
    }

    animateStatNumber(stat) {
        const numberElement = stat.querySelector('.stat-number');
        if (!numberElement) return;

        const targetText = numberElement.textContent;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = targetNumber / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                numberElement.textContent = targetNumber + suffix;
                clearInterval(timer);
            } else {
                numberElement.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }

    addRippleStyles() {
        if (document.getElementById('team-ripple-styles')) return;

        const style = document.createElement('style');
        style.id = 'team-ripple-styles';
        style.textContent = `
            .team-button-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: teamRipple 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes teamRipple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .btn-meet-team {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// ENHANCED BLOG SECTION WITH MOBILE CAROUSEL
// ============================================
// ============================================
// ENHANCED BLOG SECTION WITH MOBILE CAROUSEL
// ============================================
class BlogSection {
    constructor() {
        this.blogGrid = document.getElementById('blogGrid');
        this.blogModal = document.getElementById('blogModal');
        this.blogModalBody = document.getElementById('blogModalBody');
        this.blogModalClose = document.getElementById('blogModalClose');
        this.blogModalOverlay = document.getElementById('blogModalOverlay');
        this.viewAllBtn = document.getElementById('viewAllBlogBtn');
        this.carouselPrev = document.getElementById('carouselPrev');
        this.carouselNext = document.getElementById('carouselNext');
        this.carouselDots = document.getElementById('carouselDots');
        
        this.posts = [];
        this.displayCount = 6;
        this.showingAll = false;
        this.currentSlide = 0;
        this.isMobile = window.innerWidth <= 768;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.loadBlogPosts();
        this.setupEventListeners();
        this.handleResize();
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('data/blog.json');
            const data = await response.json();
            this.posts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.renderBlogPosts();
            this.setupCarousel();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showError();
        }
    }

    renderBlogPosts(showAll = false) {
        if (!this.blogGrid) return;
        
        const postsToShow = showAll ? this.posts : this.posts.slice(0, this.displayCount);
        
        this.blogGrid.innerHTML = postsToShow.map(post => this.createBlogCard(post)).join('');
        
        // Update view all button
        if (this.viewAllBtn) {
            if (showAll || this.posts.length <= this.displayCount) {
                this.viewAllBtn.style.display = 'none';
            } else {
                this.viewAllBtn.style.display = 'inline-flex';
            }
        }
        
        // Attach click events to all blog cards
        this.attachCardEvents();
        
        // Setup carousel if mobile
        if (this.isMobile) {
            this.currentSlide = 0;
            this.setupCarousel();
        }
    }

    createBlogCard(post) {
        const formattedDate = this.formatDate(post.date);
        
        return `
            <article class="blog-card" data-post-id="${post.id}">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="blog-card-category">${post.category}</div>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-author">
                            <i class="fas fa-spa"></i>
                            Laura's Beauty Touch
                        </span>
                        <span class="blog-card-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${formattedDate}
                        </span>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <a href="#" class="blog-card-link" data-post-id="${post.id}">
                        Read More
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    attachCardEvents() {
        const blogLinks = document.querySelectorAll('.blog-card-link');
        blogLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(link.getAttribute('data-post-id'));
                this.openModal(postId);
            });
        });
    }

    setupCarousel() {
        if (!this.isMobile) return;
        
        // Create dots for each post
        if (this.carouselDots) {
            const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
            this.carouselDots.innerHTML = postsToShow.map((_, index) => 
                `<button class="carousel-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`
            ).join('');
            
            // Add click events to dots
            const dots = this.carouselDots.querySelectorAll('.carousel-dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const slideIndex = parseInt(dot.getAttribute('data-slide'));
                    this.goToSlide(slideIndex);
                });
            });
        }
        
        // Setup touch events
        if (this.blogGrid) {
            this.blogGrid.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.blogGrid.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.blogGrid.addEventListener('touchend', () => this.handleTouchEnd());
        }
        
        // Update carousel position
        this.updateCarousel();
    }

    goToSlide(index) {
        const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
        if (index < 0 || index >= postsToShow.length) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }

    nextSlide() {
        const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
        if (this.currentSlide < postsToShow.length - 1) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        if (!this.isMobile || !this.blogGrid) return;
        
        const cards = this.blogGrid.querySelectorAll('.blog-card');
        if (cards.length === 0) return;
        
        // Get actual measurements
        const viewportWidth = window.innerWidth;
        const gap = viewportWidth <= 480 ? 15 : 20; // Match CSS gap
        const padding = viewportWidth <= 480 ? 15 : 20; // Match CSS padding
        
        // Card width is viewport minus padding on both sides
        const cardWidth = viewportWidth - (padding * 2);
        
        // Calculate offset: (card width + gap) * current slide index
        const offset = -(this.currentSlide * (cardWidth + gap));
        
        this.blogGrid.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        const dots = this.carouselDots?.querySelectorAll('.carousel-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update arrow states
        const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
        
        if (this.carouselPrev) {
            this.carouselPrev.disabled = this.currentSlide === 0;
            this.carouselPrev.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.carouselPrev.style.cursor = this.currentSlide === 0 ? 'not-allowed' : 'pointer';
        }
        
        if (this.carouselNext) {
            const isLast = this.currentSlide >= postsToShow.length - 1;
            this.carouselNext.disabled = isLast;
            this.carouselNext.style.opacity = isLast ? '0.5' : '1';
            this.carouselNext.style.cursor = isLast ? 'not-allowed' : 'pointer';
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    openModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const formattedDate = this.formatDate(post.date);
        
        this.blogModalBody.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="blog-modal-image">
            <div class="blog-modal-header">
                <div class="blog-modal-meta">
                    <span class="blog-modal-category">${post.category}</span>
                    <span class="blog-modal-author">
                        <i class="fas fa-spa"></i>
                        Laura's Beauty Touch
                    </span>
                    <span class="blog-modal-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                </div>
                <h1 class="blog-modal-title">${post.title}</h1>
            </div>
            <div class="blog-modal-content-text">
                ${post.content}
            </div>
        `;
        
        this.blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log(`📖 Blog post opened: ${post.title}`);
    }

    closeModal() {
        this.blogModal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (this.blogModalBody) {
            this.blogModalBody.scrollTop = 0;
        }
    }

    setupEventListeners() {
        // Close modal events
        if (this.blogModalClose) {
            this.blogModalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.blogModalOverlay) {
            this.blogModalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.blogModal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // View all button
        if (this.viewAllBtn) {
            this.viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showingAll = true;
                this.renderBlogPosts(true);
                console.log('📚 Showing all blog posts');
            });
        }
        
        // Carousel navigation
        if (this.carouselPrev) {
            this.carouselPrev.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.carouselNext) {
            this.carouselNext.addEventListener('click', () => this.nextSlide());
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // If switching between mobile and desktop
        if (wasMobile !== this.isMobile) {
            this.currentSlide = 0;
            if (this.isMobile) {
                this.setupCarousel();
            } else {
                // Reset transform when switching to desktop
                if (this.blogGrid) {
                    this.blogGrid.style.transform = '';
                }
            }
        } else if (this.isMobile) {
            // Update carousel position on resize
            setTimeout(() => {
                this.updateCarousel();
            }, 100);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    showError() {
        if (this.blogGrid) {
            this.blogGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--warm-taupe); margin-bottom: 20px;"></i>
                    <p style="font-family: 'Lato', sans-serif; font-size: 1.1rem; color: var(--charcoal);">
                        Unable to load blog posts. Please try again later.
                    </p>
                </div>
            `;
        }
    }
}

// ============================================
// ELFSIGHT WIDGETS
// ============================================
class ElfsightWidgets {
    constructor() {
        this.reviewsWidget = document.querySelector('.google-reviews-section .elfsight-app');
        this.instagramWidget = document.querySelector('.instagram-section .elfsight-app');
        this.instagramBtn = document.querySelector('.instagram-cta-btn');
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupInstagramButton();
    }

    setupInstagramButton() {
        if (!this.instagramBtn) return;

        this.instagramBtn.addEventListener('click', () => {
            console.log('📸 Instagram CTA clicked');
            
            this.instagramBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.instagramBtn.style.transform = '';
            }, 150);
            
            const ripple = document.createElement('span');
            const rect = this.instagramBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale(0);
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;
            
            if (this.instagramBtn.style.position !== 'relative') {
                this.instagramBtn.style.position = 'relative';
                this.instagramBtn.style.overflow = 'hidden';
            }
            
            ripple.classList.add('ripple-effect');
            this.instagramBtn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    setupScrollAnimations() {
        const reviewsSection = document.querySelector('.google-reviews-section');
        const instagramSection = document.querySelector('.instagram-section');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, observerOptions);

        if (reviewsSection) observer.observe(reviewsSection);
        if (instagramSection) observer.observe(instagramSection);
    }
}

// ============================================
// FLOATING LEAVES ANIMATION
// ============================================
class FloatingLeaves {
    constructor() {
        this.leaves = document.querySelectorAll('.floating-leaf');
        this.init();
    }

    init() {
        if (this.leaves.length === 0) return;

        this.leaves.forEach((leaf) => {
            const randomDelay = Math.random() * 5;
            const randomDuration = 12 + Math.random() * 6;
            
            leaf.style.animationDelay = `${randomDelay}s`;
            leaf.style.animationDuration = `${randomDuration}s`;
        });
    }
}

// ============================================
// INSTAGRAM HASHTAG INTERACTION
// ============================================
class HashtagInteraction {
    constructor() {
        this.hashtags = document.querySelectorAll('.hashtag');
        this.init();
    }

    init() {
        if (this.hashtags.length === 0) return;

        this.hashtags.forEach(hashtag => {
            hashtag.addEventListener('click', () => {
                const hashtagText = hashtag.textContent.replace('#', '');
                const instagramUrl = `https://www.instagram.com/explore/tags/${hashtagText}/`;
                window.open(instagramUrl, '_blank');
            });

            hashtag.style.cursor = 'pointer';
        });
    }
}

// ============================================
// CONTACT SECTION
// ============================================
class ContactSection {
    constructor() {
        this.contactSection = document.querySelector('.contact-section');
        this.bookButton = document.querySelector('.btn-book-now');
        this.callButton = document.querySelector('.btn-call-now');
        this.ctaCards = document.querySelectorAll('.cta-card');
        
        if (!this.contactSection) return;
        
        this.init();
    }

    init() {
        this.setupButtonTracking();
        this.setupCardAnimations();
        this.setupScrollReveal();
        this.addRippleStyles();
    }

    setupButtonTracking() {
        if (this.bookButton) {
            this.bookButton.addEventListener('click', (e) => {
                console.log('📅 Book Appointment clicked');
                this.createButtonRipple(e);
            });
        }

        if (this.callButton) {
            this.callButton.addEventListener('click', (e) => {
                console.log('📞 Call button clicked');
                this.createButtonRipple(e);
            });
        }
    }

    createButtonRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.classList.add('contact-button-ripple');
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupCardAnimations() {
        this.ctaCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card);
            });
        });
    }

    animateCard(card) {
        const icon = card.querySelector('.cta-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('contact-visible');
                }
            });
        }, observerOptions);

        observer.observe(this.contactSection);
    }

    addRippleStyles() {
        if (document.getElementById('contact-ripple-styles')) return;

        const style = document.createElement('style');
        style.id = 'contact-ripple-styles';
        style.textContent = `
            .contact-button-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: contactRipple 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes contactRipple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .btn-book-now,
            .btn-call-now {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// SUPER FOOTER
// ============================================
class SuperFooter {
    constructor() {
        this.footer = document.querySelector('.super-footer');
        this.currentYearElement = document.getElementById('currentYear');
        this.footerLinks = document.querySelectorAll('.footer-link');
        this.socialLinks = document.querySelectorAll('.social-link');
        this.ctaButton = document.querySelector('.footer-cta-btn');
        this.designerLink = document.querySelector('.designer-credit-link');
        
        if (!this.footer) return;
        
        this.init();
    }

    init() {
        this.setCurrentYear();
        this.setupLinkAnimations();
        this.setupSocialTracking();
        this.setupCTATracking();
        this.setupDesignerLink();
        this.setupScrollReveal();
        this.addFooterStyles();
    }

    setCurrentYear() {
        if (this.currentYearElement) {
            const currentYear = new Date().getFullYear();
            this.currentYearElement.textContent = currentYear;
        }
    }

    setupLinkAnimations() {
        this.footerLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.animateLink(e.target);
            });
        });
    }

    animateLink(link) {
        link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    setupSocialTracking() {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label');
                console.log(`Social link clicked: ${platform}`);
                
                link.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            });
        });
    }

    setupCTATracking() {
        if (!this.ctaButton) return;

        this.ctaButton.addEventListener('click', (e) => {
            console.log('Footer CTA clicked: Book Appointment');
            this.createRipple(e);
        });
    }

    setupDesignerLink() {
        if (!this.designerLink) return;

        this.designerLink.addEventListener('click', () => {
            console.log('Designer credit link clicked: Elan\'s Tech World');
        });

        this.designerLink.addEventListener('mouseenter', () => {
            console.log('Designer credit hovered');
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(59, 74, 47, 0.3);
            transform: scale(0);
            animation: footerRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer-visible');
                    this.animateFooterElements();
                }
            });
        }, observerOptions);

        observer.observe(this.footer);
    }

    animateFooterElements() {
        const columns = document.querySelectorAll('.footer-column');
        
        columns.forEach((column, index) => {
            setTimeout(() => {
                column.style.opacity = '0';
                column.style.transform = 'translateY(30px)';
                column.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    column.style.opacity = '1';
                    column.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }

    addFooterStyles() {
        if (document.getElementById('footer-styles')) return;

        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
            @keyframes footerRipple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .footer-visible {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTopBtn');
        this.scrollThreshold = 300;
        
        this.init();
    }

    init() {
        if (!this.button) return;

        this.handleScroll();
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    if (scrolled > this.scrollThreshold) {
                        this.button.classList.add('visible');
                    } else {
                        this.button.classList.remove('visible');
                    }

                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.button.style.transform = 'translateY(-3px) scale(1.05)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 200);
    }
}

// ============================================
// FLOATING ACTION BUTTON (FAB)
// ============================================
class FloatingActionButton {
    constructor() {
        this.fabMain = document.getElementById('fabMain');
        this.fabOptions = document.getElementById('fabOptions');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.fabMain) return;

        this.fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFAB();
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.fab-container')) {
                this.closeFAB();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeFAB();
            }
        });

        const fabOptions = document.querySelectorAll('.fab-option');
        fabOptions.forEach(option => {
            option.addEventListener('click', () => {
                setTimeout(() => this.closeFAB(), 200);
            });
        });
    }

    toggleFAB() {
        if (this.isOpen) {
            this.closeFAB();
        } else {
            this.openFAB();
        }
    }

    openFAB() {
        this.isOpen = true;
        this.fabMain.classList.add('active');
        this.fabOptions.classList.add('active');
        console.log('📱 Contact options opened');
    }

    closeFAB() {
        this.isOpen = false;
        this.fabMain.classList.remove('active');
        this.fabOptions.classList.remove('active');
        console.log('📱 Contact options closed');
    }
}

// ============================================
// ABOUT CAROUSEL
// ============================================
class AboutCarousel {
    constructor(section) {
        this.section = section;
        this.track = section.querySelector('.carousel-track');
        this.slides = Array.from(section.querySelectorAll('.carousel-slide'));
        this.prevButton = section.querySelector('.carousel-arrow-prev');
        this.nextButton = section.querySelector('.carousel-arrow-next');
        this.indicators = Array.from(section.querySelectorAll('.indicator'));
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        if (!this.track || this.slides.length === 0) return;
        
        this.updateCarousel(false);
        this.bindEvents();
    }

    bindEvents() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.goToPrevious());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.goToNext());
        }

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());

        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseUp());
        this.track.addEventListener('mouseleave', () => this.handleMouseUp());

        this.section.addEventListener('keydown', (e) => this.handleKeyboard(e));

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCarousel(false);
            }, 250);
        });
    }

    goToNext() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel(true);
    }

    goToPrevious() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel(true);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateCarousel(true);
    }

    updateCarousel(animate = true) {
        if (animate) {
            this.isAnimating = true;
            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        }

        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
            indicator.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < this.minSwipeDistance) {
            return;
        }

        if (swipeDistance > 0) {
            this.goToNext();
        } else {
            this.goToPrevious();
        }

        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.touchStartX = e.clientX;
        this.track.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.touchEndX = e.clientX;
    }

    handleMouseUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.handleSwipe();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.goToPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.goToNext();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }
}

function initAboutCarousels() {
    const carouselSections = document.querySelectorAll('.about-carousel-section');
    
    carouselSections.forEach(section => {
        new AboutCarousel(section);
    });
}

// ============================================
// HOLIDAY OVERLAY - INTERACTIVE FEATURES
// TO REMOVE: Just delete or comment out this entire section
// ============================================

class HolidayOverlay {
    constructor() {
        this.greetingBanner = document.querySelector('.holiday-greeting-banner');
        this.isEnabled = true;
        
        // Check if holiday overlay exists
        if (!this.greetingBanner) {
            console.log('Holiday overlay not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log('🎄 Holiday overlay initialized!');
        
        // Make greeting banner clickable to highlight specials button
        this.setupGreetingInteraction();
        
        // Performance: Pause animations when tab is hidden
        this.setupVisibilityChange();
        
        // Optional: Auto-hide banner after user reads it
        this.setupAutoHide();
    }
    
    setupGreetingInteraction() {
        if (!this.greetingBanner) return;
        
        // Make banner hoverable
        this.greetingBanner.addEventListener('mouseenter', () => {
            this.greetingBanner.style.transform = 'translateX(-50%) translateY(-3px) scale(1.02)';
            this.greetingBanner.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        this.greetingBanner.addEventListener('mouseleave', () => {
            this.greetingBanner.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        });
        
        // Click on banner to pulse the specials button
        this.greetingBanner.addEventListener('click', () => {
            this.highlightSpecialsButton();
        });
    }
    
    highlightSpecialsButton() {
        const specialsBtn = document.getElementById('specialsBtn');
        
        if (specialsBtn) {
            // Scroll to make sure it's visible
            specialsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add pulsing effect
            specialsBtn.style.animation = 'specialsPulse 1s ease-in-out 3';
            
            // Add temporary glow
            const originalBoxShadow = window.getComputedStyle(specialsBtn).boxShadow;
            specialsBtn.style.boxShadow = '0 0 30px rgba(169, 200, 156, 0.8), 0 0 60px rgba(169, 200, 156, 0.4)';
            
            // Reset after animation
            setTimeout(() => {
                specialsBtn.style.animation = '';
                specialsBtn.style.boxShadow = originalBoxShadow;
            }, 3000);
            
            console.log('✨ Highlighted Specials button!');
        } else {
            console.log('⚠️ Specials button not found');
        }
    }
    
    setupAutoHide() {
        // Optional: Hide banner after 30 seconds
        // Uncomment if you want this feature:
        
        /*
        setTimeout(() => {
            if (this.greetingBanner) {
                this.greetingBanner.style.opacity = '0';
                this.greetingBanner.style.transform = 'translateX(-50%) translateY(-30px)';
                setTimeout(() => {
                    this.greetingBanner.style.display = 'none';
                }, 500);
            }
        }, 30000); // 30 seconds
        */
    }
    
    setupVisibilityChange() {
        // Pause animations when tab is not visible (performance)
        document.addEventListener('visibilitychange', () => {
            const overlay = document.querySelector('.holiday-overlay-wrapper');
            if (!overlay) return;
            
            if (document.hidden) {
                overlay.style.animationPlayState = 'paused';
                const animatedElements = overlay.querySelectorAll('.snowflake, .light, .greeting-icon, .greeting-cta');
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
            } else {
                overlay.style.animationPlayState = 'running';
                const animatedElements = overlay.querySelectorAll('.snowflake, .light, .greeting-icon, .greeting-cta');
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }
}

// Add special pulse animation for the specials button
const style = document.createElement('style');
style.textContent = `
    @keyframes specialsPulse {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-5px) scale(1.1);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// AUTO-INITIALIZE
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HolidayOverlay();
    });
} else {
    new HolidayOverlay();
}

// Export for manual control if needed
window.HolidayOverlay = HolidayOverlay;

console.log('🎄✨ Happy Holidays from Laura\'s Beauty Touch! ✨🎄');

// ============================================
// MAIN INITIALIZATION
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch - Website Loading...');
    console.log('💎 Initializing components...');
    
    // Core Components
    new ElegantPreloader();
    new PremiumHeaderWithMegaMenu();
    new HeroVideoCollage();
    
    // Interactive Elements
    new BackToTopButton();
    new FloatingActionButton();
 
    // Content Sections
    new BlogSection();
    new TeamSection();
    new ContactSection();
    new SuperFooter();
    
    // Services Carousel
    const servicesCarousel = new ServicesCarousel();
    window.servicesCarousel = servicesCarousel;
    
    // About Section Carousels
    initAboutCarousels();
    
    // Third-Party Widgets
    new ElfsightWidgets();
    new FloatingLeaves();
    new HashtagInteraction();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    console.log('✅ All components initialized successfully');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

console.log('🌟 Script loaded and ready');
