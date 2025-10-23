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
        this.specialsFloatingBtn = document.getElementById('specialsFloatingBtn');
        
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

    // ============================================
    // SCROLL HANDLING
    // ============================================
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

    // ============================================
    // MOBILE MENU
    // ============================================
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
            if (this.specialsFloatingBtn) {
                this.specialsFloatingBtn.style.opacity = '0';
                this.specialsFloatingBtn.style.visibility = 'hidden';
                this.specialsFloatingBtn.style.pointerEvents = 'none';
            }
        } else {
            document.body.style.overflow = '';
            if (this.specialsFloatingBtn) {
                this.specialsFloatingBtn.style.opacity = '1';
                this.specialsFloatingBtn.style.visibility = 'visible';
                this.specialsFloatingBtn.style.pointerEvents = 'all';
            }
        }
    }

    closeMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileDrawer.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (this.specialsFloatingBtn) {
            this.specialsFloatingBtn.style.opacity = '1';
            this.specialsFloatingBtn.style.visibility = 'visible';
            this.specialsFloatingBtn.style.pointerEvents = 'all';
        }
    }

    // ============================================
    // LOGO CLICK
    // ============================================
    handleLogoClick() {
        if (this.logoWrapper) {
            this.logoWrapper.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
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

    // ============================================
    // MEGA MENU
    // ============================================
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

        console.log('🎯 Mega menu opened');
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

        console.log('🎯 Mega menu closed');
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

    // ============================================
    // MOBILE SUBMENU ACCORDION
    // ============================================
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
                
                console.log(`📱 Mobile submenu ${isActive ? 'closed' : 'opened'}`);
            });
        });
    }
}

// ============================================
// HERO VIDEO COLLAGE
// ============================================
class HeroVideoCollage {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-navigation-dots .dot');
        this.videos = document.querySelectorAll('.hero-video-item video');
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
        
        if (this.currentIndex >= this.maxIndex) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index > this.maxIndex) return;
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
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
            if (this.currentIndex < this.maxIndex) {
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

document.addEventListener('DOMContentLoaded', () => {
    const servicesCarousel = new ServicesCarousel();
});

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
        
        if (!this.footer) return;
        
        this.init();
    }

    init() {
        this.setCurrentYear();
        this.setupLinkAnimations();
        this.setupSocialTracking();
        this.setupCTATracking();
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

        // Apply transform on ALL screen sizes
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

// ============================================
// INITIALIZE ABOUT CAROUSELS
// ============================================
function initAboutCarousels() {
    const carouselSections = document.querySelectorAll('.about-carousel-section');
    
    carouselSections.forEach(section => {
        new AboutCarousel(section);
    });
}

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
    new TeamSection();
    new ContactSection();
    new SuperFooter();
    
    // Services Carousel
    const servicesCarousel = new ServicesCarousel();
    servicesCarousel.init();
    window.servicesCarousel = servicesCarousel;
    
    // About Section Carousels (NEW)
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
