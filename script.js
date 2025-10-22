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
        this.specialsFloatingBtn = document.getElementById('specialsFloatingBtn'); // ADD THIS LINE
        
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
        this.handleMegaMenu(); // New mega menu functionality
        this.handleMobileSubmenu(); // New mobile submenu functionality
    }

    // ============================================
    // SCROLL HANDLING (from original)
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
    // MOBILE MENU (from original)
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
        // Hide specials floating button when menu opens
        if (this.specialsFloatingBtn) {
            this.specialsFloatingBtn.style.opacity = '0';
            this.specialsFloatingBtn.style.visibility = 'hidden';
            this.specialsFloatingBtn.style.pointerEvents = 'none';
        }
    } else {
        document.body.style.overflow = '';
        // Show specials floating button when menu closes
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
    // Show specials floating button when menu closes
    if (this.specialsFloatingBtn) {
        this.specialsFloatingBtn.style.opacity = '1';
        this.specialsFloatingBtn.style.visibility = 'visible';
        this.specialsFloatingBtn.style.pointerEvents = 'all';
    }


    // ============================================
    // LOGO CLICK (from original)
    // ============================================
    handleLogoClick() {
        if (this.logoWrapper) {
            this.logoWrapper.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ============================================
    // SMOOTH SCROLL (from original)
    // ============================================
    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (this.mobileDrawer && this.mobileDrawer.classList.contains('active')) {
                        this.closeMenu();
                    }
                    
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // ============================================
    // MEGA MENU FUNCTIONALITY (NEW)
    // ============================================
    handleMegaMenu() {
        if (!this.megamenuItem || !this.megamenuWrapper) return;

        // Show mega menu on hover
        this.megamenuItem.addEventListener('mouseenter', () => {
            this.openMegaMenu();
        });

        // Hide mega menu on mouse leave with longer delay
        this.megamenuItem.addEventListener('mouseleave', (e) => {
            // Check if mouse is moving towards the mega menu
            const rect = this.megamenuWrapper.getBoundingClientRect();
            if (e.clientY < rect.top) {
                this.scheduleMegaMenuClose(300); // Longer delay
            }
        });

        // Keep menu open when hovering over it
        this.megamenuWrapper.addEventListener('mouseenter', () => {
            this.cancelMegaMenuClose();
        });

        this.megamenuWrapper.addEventListener('mouseleave', () => {
            this.scheduleMegaMenuClose(200); // Slightly shorter when leaving menu
        });

        // Close mega menu on click outside
        document.addEventListener('click', (e) => {
            if (!this.megamenuItem.contains(e.target)) {
                this.closeMegaMenu(true);
            }
        });

        // Keyboard support - ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.megamenuWrapper.style.display === 'block') {
                this.closeMegaMenu(true);
            }
        });

        // Handle mega menu item interactions
        this.setupMegaMenuItems();
    }

    openMegaMenu() {
        clearTimeout(this.megamenuTimeout);
        this.megamenuWrapper.style.display = 'block';
        
        // Trigger reflow for animation
        void this.megamenuWrapper.offsetWidth;
        
        // Add staggered animation to menu items
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

            // Add click tracking
            item.addEventListener('click', function() {
                const title = this.querySelector('.megamenu-item-title')?.textContent;
                console.log(`📍 Category clicked: ${title}`);
            });
        });
    }

    // ============================================
    // MOBILE SUBMENU ACCORDION (NEW)
    // ============================================
    handleMobileSubmenu() {
        const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-trigger');
        
        mobileDropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent closing the mobile menu
                
                const parentItem = trigger.closest('.mobile-has-submenu');
                const isActive = parentItem.classList.contains('active');
                
                // Close all other submenus
                document.querySelectorAll('.mobile-has-submenu').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('active');
                    }
                });
                
                // Toggle current submenu
                if (isActive) {
                    parentItem.classList.remove('active');
                    console.log('📱 Mobile submenu closed');
                } else {
                    parentItem.classList.add('active');
                    console.log('📱 Mobile submenu opened');
                }
            });
        });

        // Handle submenu link clicks (close mobile menu after navigation)
        const submenuLinks = document.querySelectorAll('.mobile-submenu-link');
        submenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation
                setTimeout(() => {
                    this.closeMenu();
                }, 100);
            });
        });
    }

    // ============================================
    // ENTRANCE ANIMATIONS
    // ============================================
    addEntranceAnimations() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// ============================================
// HERO VIDEO COLLAGE
// ============================================
class HeroVideoCollage {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-navigation-dots .dot');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }

    init() {
        this.setupVideoPlayback();
        this.setupNavigation();
        this.setupScrollIndicator();
        this.startAutoPlay();
    }

    setupVideoPlayback() {
        this.videos.forEach((video, index) => {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.defaultMuted = true;
            
            const playVideo = () => {
                const promise = video.play();
                if (promise !== undefined) {
                    promise.then(() => {
                        console.log(`Video ${index + 1} playing`);
                    }).catch(error => {
                        console.log(`Video ${index + 1} autoplay blocked`);
                    });
                }
            };
            
            video.addEventListener('canplay', playVideo, { once: true });
            video.addEventListener('error', (e) => {
                console.error(`Video ${index + 1} error:`, e);
            });
            
            video.load();
        });

        let userInteracted = false;
        const enableVideos = () => {
            if (userInteracted) return;
            userInteracted = true;
            
            this.videos.forEach((video) => {
                video.muted = true;
                video.play().catch(() => {});
            });
        };

        ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, enableVideos, { once: true, passive: true });
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
        this.carousel = document.getElementById('servicesCarouselTrack');
        this.prevBtn = document.getElementById('servicesPrevBtn');
        this.nextBtn = document.getElementById('servicesNextBtn');
        this.indicatorsContainer = document.getElementById('servicesCarouselIndicators');
        
        this.cards = [];
        this.currentPage = 0;
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = 0;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 5000;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.resizeHandler = null;
        this.keyboardHandler = null;
        this.scrollHandler = null;
    }

    init() {
        console.log('🎨 Starting Services Carousel Initialization...');
        
        if (!this.carousel) {
            console.error('❌ Services carousel track not found!');
            return;
        }
        
        this.cards = Array.from(this.carousel.querySelectorAll('.service-category-card'));
        console.log(`📦 Found ${this.cards.length} service cards`);
        
        if (this.cards.length === 0) {
            console.warn('⚠️ No service cards found');
            return;
        }

        this.setupCarousel();
        this.setupNavigation();
        this.setupTouchSupport();
        this.setupResizeHandler();
        this.setupScrollHandler();
        this.startAutoScroll();

        console.log(`✅ Services Carousel fully initialized`);
    }

    setupCarousel() {
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = Math.ceil(this.cards.length / this.itemsPerPage);
        
        this.createIndicators();
        this.updateNavigationVisibility();
        this.updateIndicators();
    }

    getItemsPerPage() {
        const width = window.innerWidth;
        
        if (width < 768) {
            return 1;
        } else if (width < 1024) {
            return 2;
        } else {
            return 3;
        }
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        if (this.totalPages <= 1) {
            this.indicatorsContainer.classList.add('hidden');
            return;
        }
        
        this.indicatorsContainer.classList.remove('hidden');
        
        for (let i = 0; i < this.totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.classList.add('services-indicator');
            indicator.setAttribute('aria-label', `Go to page ${i + 1}`);
            indicator.setAttribute('type', 'button');
            
            if (i === 0) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                this.goToPage(i);
                this.resetAutoScroll();
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    setupNavigation() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const newPrevBtn = this.prevBtn.cloneNode(true);
        const newNextBtn = this.nextBtn.cloneNode(true);
        this.prevBtn.parentNode.replaceChild(newPrevBtn, this.prevBtn);
        this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
        this.prevBtn = newPrevBtn;
        this.nextBtn = newNextBtn;
        
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousPage();
            this.resetAutoScroll();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextPage();
            this.resetAutoScroll();
        });
        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        this.keyboardHandler = (e) => {
            if (this.carousel && !this.carousel.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousPage();
                    this.resetAutoScroll();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextPage();
                    this.resetAutoScroll();
                }
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }

    updateNavigationVisibility() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const isMobile = window.innerWidth < 768;
        const shouldHide = this.totalPages <= 1 || isMobile;
        
        if (shouldHide) {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
        } else {
            this.prevBtn.classList.remove('hidden');
            this.nextBtn.classList.remove('hidden');
        }
    }

    goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        
        this.currentPage = pageIndex;
        this.updateIndicators();
        
        const startIndex = pageIndex * this.itemsPerPage;
        
        if (this.cards[startIndex]) {
            const cardRect = this.cards[startIndex].getBoundingClientRect();
            const carouselRect = this.carousel.getBoundingClientRect();
            const scrollAmount = cardRect.left - carouselRect.left + this.carousel.scrollLeft;
            
            this.carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    nextPage() {
        if (this.totalPages <= 1) return;
        const nextPage = (this.currentPage + 1) % this.totalPages;
        this.goToPage(nextPage);
    }

    previousPage() {
        if (this.totalPages <= 1) return;
        const prevPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
        this.goToPage(prevPage);
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer?.querySelectorAll('.services-indicator');
        if (!indicators) return;
        
        indicators.forEach((indicator, index) => {
            if (index === this.currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    setupScrollHandler() {
        if (!this.carousel) return;
        
        let scrollTimeout;
        
        if (this.scrollHandler) {
            this.carousel.removeEventListener('scroll', this.scrollHandler);
        }
        
        this.scrollHandler = () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                this.updateCurrentPageFromScroll();
            }, 150);
        };
        
        this.carousel.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    updateCurrentPageFromScroll() {
        if (!this.carousel || this.cards.length === 0) return;
        
        const carouselRect = this.carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;
        
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - carouselCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        const newPage = Math.floor(closestIndex / this.itemsPerPage);
        
        if (newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.updateIndicators();
        }
    }

    setupTouchSupport() {
        if (!this.carousel) return;
        
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoScroll();
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) {
            this.startAutoScroll();
            return;
        }
        
        if (swipeDistance > 0) {
            this.nextPage();
        } else {
            this.previousPage();
        }
        
        this.resetAutoScroll();
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        this.resizeHandler = () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                const newItemsPerPage = this.getItemsPerPage();
                
                if (newItemsPerPage !== this.itemsPerPage) {
                    this.itemsPerPage = newItemsPerPage;
                    this.setupCarousel();
                    this.goToPage(0);
                }
                
                this.updateNavigationVisibility();
            }, 250);
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }

    startAutoScroll() {
        if (this.totalPages <= 1) return;
        
        this.stopAutoScroll();
        
        this.autoScrollInterval = setInterval(() => {
            this.nextPage();
        }, this.autoScrollDelay);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    resetAutoScroll() {
        this.stopAutoScroll();
        this.startAutoScroll();
    }

    cleanup() {
        this.stopAutoScroll();
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        if (this.scrollHandler && this.carousel) {
            this.carousel.removeEventListener('scroll', this.scrollHandler);
        }
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
                    this.handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    handleParallax() {
        const sectionTop = this.teamSection.offsetTop;
        const sectionHeight = this.teamSection.offsetHeight;
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrollPosition + windowHeight > sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
            
            const scrollProgress = (scrollPosition + windowHeight - sectionTop) / (sectionHeight + windowHeight);
            
            this.teamStats.forEach((stat, index) => {
                const speed = (index + 1) * 20;
                const yOffset = (scrollProgress - 0.5) * speed;
                stat.style.transform = `translateY(${yOffset}px)`;
            });
        }
    }

    setupImageEffects() {
        if (!this.teamImageFrame) return;

        this.teamImageFrame.addEventListener('mousemove', (e) => {
            this.handleImageTilt(e);
        });

        this.teamImageFrame.addEventListener('mouseleave', () => {
            this.resetImageTilt();
        });
    }

    handleImageTilt(e) {
        const rect = this.teamImageFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        this.teamImageFrame.style.transform = `
            translateY(-8px) 
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    }

    resetImageTilt() {
        this.teamImageFrame.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    }

    setupButtonEffects() {
        if (!this.meetTeamBtn) return;

        this.meetTeamBtn.addEventListener('click', (e) => {
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
        
        ripple.classList.add('team-ripple');
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupStatsAnimation() {
        if (this.teamStats.length === 0) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumber(entry.target);
                }
            });
        }, observerOptions);

        this.teamStats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateStatNumber(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        if (!numberElement || this.animatedStats.has(numberElement)) return;
        
        this.animatedStats.add(numberElement);
        
        const finalNumber = numberElement.textContent;
        const hasPlus = finalNumber.includes('+');
        const numericValue = parseInt(finalNumber.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = numericValue / 50;
        const stepTime = 30;
        
        numberElement.textContent = '0';
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                numberElement.textContent = finalNumber;
                clearInterval(counter);
            } else {
                numberElement.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }
        }, stepTime);
    }

    addRippleStyles() {
        if (document.getElementById('team-ripple-styles')) return;

        const style = document.createElement('style');
        style.id = 'team-ripple-styles';
        style.textContent = `
            .team-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
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
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// ELFSIGHT WIDGETS
// ============================================
class ElfsightWidgets {
    constructor() {
        this.init();
    }

    init() {
        this.waitForElfsight();
        this.setupInstagramCTA();
        this.setupScrollAnimations();
    }

    waitForElfsight() {
        const checkElfsight = setInterval(() => {
            if (typeof window.eapps !== 'undefined') {
                console.log('✅ Elfsight platform loaded');
                clearInterval(checkElfsight);
                this.enhanceWidgets();
            }
        }, 500);

        setTimeout(() => {
            clearInterval(checkElfsight);
        }, 10000);
    }

    enhanceWidgets() {
        const widgets = document.querySelectorAll('[class*="elfsight-app"]');
        
        widgets.forEach(widget => {
            widget.classList.add('widget-loading');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            widget.classList.remove('widget-loading');
                            widget.classList.add('widget-loaded');
                        }, 1000);
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(widget);
        });
    }

    setupInstagramCTA() {
        const instagramBtn = document.querySelector('.follow-instagram-btn');
        
        if (instagramBtn) {
            instagramBtn.addEventListener('click', () => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                instagramBtn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
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
