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
class PremiumHeader {
    constructor() {
        this.header = document.querySelector('.premium-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.logoWrapper = document.querySelector('.header-logo-wrapper');
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleLogoClick();
        this.handleSmoothScroll();
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

        const mobileLinks = document.querySelectorAll('.mobile-link');
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
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
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
// SPECIALS CAROUSEL
// ============================================

class SpecialsButton {
    constructor() {
        // JSON Path
        this.jsonPath = 'json/specials.json';
        
        // Elements
        this.floatingBtn = document.getElementById('specialsBtn');
        this.specialsCount = document.getElementById('specialsCount');
        this.specialsModal = document.getElementById('specialsModal');
        this.specialsModalOverlay = document.getElementById('specialsModalOverlay');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.specialsGrid = document.getElementById('specialsGrid');
        this.noSpecials = document.getElementById('noSpecials');
        
        // Detail Modal Elements
        this.detailModal = document.getElementById('detailModal');
        this.detailModalOverlay = document.getElementById('detailModalOverlay');
        this.closeDetailBtn = document.getElementById('closeDetailBtn');
        
        // Data
        this.specials = [];
        this.currentSpecial = null;
    }

    async init() {
        try {
            console.log('🎁 Initializing Specials Button System...');
            
            // Load specials from JSON
            await this.loadSpecials();
            
            if (this.specials && this.specials.length > 0) {
                console.log(`✅ Loaded ${this.specials.length} special(s)`);
                
                // Update badge count
                this.updateBadgeCount();
                
                // Render specials grid
                this.renderSpecialsGrid();
                
                // Setup event listeners
                this.setupEventListeners();
                
                // Show floating button
                this.floatingBtn.classList.remove('hidden');
                
                console.log('✅ Specials Button System initialized successfully');
            } else {
                console.log('ℹ️ No specials found - hiding button');
                this.floatingBtn.classList.add('hidden');
            }
        } catch (error) {
            console.error('❌ Error initializing specials button:', error);
            this.floatingBtn.classList.add('hidden');
        }
    }

    async loadSpecials() {
        try {
            const response = await fetch(this.jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.specials = data.specials || [];
            
        } catch (error) {
            console.error('❌ Error loading specials JSON:', error);
            throw error;
        }
    }

    updateBadgeCount() {
        if (this.specialsCount) {
            this.specialsCount.textContent = this.specials.length;
        }
    }

    renderSpecialsGrid() {
        if (!this.specialsGrid) {
            console.error('❌ Specials grid container not found');
            return;
        }

        this.specialsGrid.innerHTML = '';

        if (this.specials.length === 0) {
            if (this.noSpecials) {
                this.noSpecials.style.display = 'block';
            }
            return;
        }

        if (this.noSpecials) {
            this.noSpecials.style.display = 'none';
        }

        this.specials.forEach((special) => {
            const card = this.createSpecialCard(special);
            this.specialsGrid.appendChild(card);
        });
    }

    createSpecialCard(special) {
        const card = document.createElement('div');
        card.className = 'special-grid-card';
        card.dataset.specialId = special.id;
        
        let cardHTML = `
            <div class="special-card-image">
                <img src="${special.image}" alt="${this.escapeHtml(special.title)}" loading="lazy">
        `;
        
        // Add savings badge if applicable
        if (special.savings && special.savings > 0) {
            cardHTML += `
                <div class="card-save-badge">
                    <span class="save-text">SAVE</span>
                    <span class="save-amount">$${special.savings.toFixed(2)}</span>
                </div>
            `;
        }
        
        cardHTML += `</div>`;
        
        // Card content
        cardHTML += `
            <div class="special-card-content">
                <div class="card-brand">${this.escapeHtml(special.brand)}</div>
                <h3 class="card-title">${this.escapeHtml(special.title)}</h3>
        `;
        
        if (special.description) {
            cardHTML += `<p class="card-description">${this.escapeHtml(special.description)}</p>`;
        }
        
        // Price section
        cardHTML += `
            <div class="card-price">
                <span class="card-current-price">$${special.currentPrice}</span>
        `;
        
        if (special.originalPrice && special.originalPrice > 0) {
            cardHTML += `<span class="card-original-price">$${special.originalPrice}</span>`;
        }
        
        cardHTML += `</div>`;
        
        // View details button
        cardHTML += `
                <button type="button" class="card-view-btn">
                    <span>View Details</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        
        card.innerHTML = cardHTML;
        
        // Add click event to open detail modal
        card.addEventListener('click', () => {
            this.openDetailModal(special.id);
        });
        
        return card;
    }

    setupEventListeners() {
        // Open main modal
        if (this.floatingBtn) {
            this.floatingBtn.addEventListener('click', () => {
                this.openMainModal();
            });
        }

        // Close main modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.closeMainModal();
            });
        }

        if (this.specialsModalOverlay) {
            this.specialsModalOverlay.addEventListener('click', () => {
                this.closeMainModal();
            });
        }

        // Close detail modal
        if (this.closeDetailBtn) {
            this.closeDetailBtn.addEventListener('click', () => {
                this.closeDetailModal();
            });
        }

        if (this.detailModalOverlay) {
            this.detailModalOverlay.addEventListener('click', () => {
                this.closeDetailModal();
            });
        }

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.detailModal.classList.contains('active')) {
                    this.closeDetailModal();
                } else if (this.specialsModal.classList.contains('active')) {
                    this.closeMainModal();
                }
            }
        });
    }

    openMainModal() {
        if (this.specialsModal) {
            this.specialsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMainModal() {
        if (this.specialsModal) {
            this.specialsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openDetailModal(specialId) {
        const special = this.specials.find(s => s.id === specialId);
        
        if (!special) {
            console.error('❌ Special not found:', specialId);
            return;
        }

        this.currentSpecial = special;
        this.populateDetailModal(special);

        // Close main modal and open detail modal
        this.closeMainModal();
        
        setTimeout(() => {
            if (this.detailModal) {
                this.detailModal.classList.add('active');
            }
        }, 300);
    }

    populateDetailModal(special) {
        // Image
        const detailImage = document.getElementById('detailImage');
        if (detailImage) {
            detailImage.src = special.image;
            detailImage.alt = special.title;
        }

        // Savings badge
        const detailBadge = document.getElementById('detailBadge');
        const detailSavings = document.getElementById('detailSavings');
        if (special.savings && special.savings > 0) {
            if (detailBadge) detailBadge.style.display = 'flex';
            if (detailSavings) detailSavings.textContent = `$${special.savings.toFixed(2)}`;
        } else {
            if (detailBadge) detailBadge.style.display = 'none';
        }

        // Brand
        const detailBrand = document.getElementById('detailBrand');
        if (detailBrand) detailBrand.textContent = special.brand;

        // Title
        const detailTitle = document.getElementById('detailTitle');
        if (detailTitle) detailTitle.textContent = special.title;

        // Description
        const detailDescription = document.getElementById('detailDescription');
        if (detailDescription) {
            detailDescription.textContent = special.description || '';
            detailDescription.style.display = special.description ? 'block' : 'none';
        }

        // Current price
        const detailCurrentPrice = document.getElementById('detailCurrentPrice');
        if (detailCurrentPrice) {
            detailCurrentPrice.textContent = `$${special.currentPrice}`;
        }

        // Original price
        const detailOriginalPrice = document.getElementById('detailOriginalPrice');
        if (detailOriginalPrice) {
            if (special.originalPrice && special.originalPrice > 0) {
                detailOriginalPrice.textContent = `$${special.originalPrice}`;
                detailOriginalPrice.style.display = 'inline';
            } else {
                detailOriginalPrice.style.display = 'none';
            }
        }

        // Includes list
        const detailIncludesList = document.getElementById('detailIncludesList');
        if (detailIncludesList && special.includes && special.includes.length > 0) {
            detailIncludesList.innerHTML = '';
            special.includes.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                detailIncludesList.appendChild(li);
            });
        }

        // Book button
        const detailBookBtn = document.getElementById('detailBookBtn');
        if (detailBookBtn && special.bookingLink) {
            detailBookBtn.href = special.bookingLink;
        }
    }

    closeDetailModal() {
        if (this.detailModal) {
            this.detailModal.classList.remove('active');
            
            // Reopen main modal after a delay
            setTimeout(() => {
                this.openMainModal();
            }, 300);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
// ELFSIGHT WIDGETS (GOOGLE REVIEWS & INSTAGRAM)
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
            instagramBtn.addEventListener('click', (e) => {
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
    }

    setupButtonTracking() {
        if (this.bookButton) {
            this.bookButton.addEventListener('click', () => {
                console.log('📅 Book Appointment clicked');
                this.createButtonRipple(event);
            });
        }

        if (this.callButton) {
            this.callButton.addEventListener('click', () => {
                console.log('📞 Call button clicked');
                this.createButtonRipple(event);
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
}

// Add button ripple styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
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
document.head.appendChild(contactStyles);

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
        // Add ripple effect on hover
        link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    setupSocialTracking() {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label');
                console.log(`Social link clicked: ${platform}`);
                
                // Add click animation
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
            
            // Create ripple effect
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
}

// Add ripple animation styles
const footerStyles = document.createElement('style');
footerStyles.textContent = `
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
document.head.appendChild(footerStyles);

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

        // Optional: Add a subtle animation feedback
        this.button.style.transform = 'translateY(-3px) scale(1.05)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 200);
    }
}

// ============================================
// FLOATING ACTION BUTTON (FAB) - SIMPLIFIED
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

        // Main FAB toggle
        this.fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFAB();
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.fab-container')) {
                this.closeFAB();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeFAB();
            }
        });

        // Close FAB when clicking any option
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
    console.log('🌿 Laura\'s Beauty Touch');
    console.log('💎 Initializing components...');
    
    // Initialize all components
    new ElegantPreloader();
    new PremiumHeader();
    new HeroVideoCollage();
    new BackToTopButton();
    new FloatingActionButton();
    new TeamSection();
    new SuperFooter();
    
    // Initialize Specials Carousel
    const specialsButton = new SpecialsButton();
    specialsButton.init();
    window.specialsButton = specialsButton;
    
    // Initialize Services Carousel
    const servicesCarousel = new ServicesCarousel();
    servicesCarousel.init();
    window.servicesCarousel = servicesCarousel;
        
    // Initialize Contact Form
    new ContactSection();
    
    // Initialize Elfsight Widgets (Google Reviews & Instagram)
    new ElfsightWidgets();
    new FloatingLeaves();
    new HashtagInteraction();
    
    // Initialize AOS if available
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

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

console.log('🌟 Script loaded and ready');
