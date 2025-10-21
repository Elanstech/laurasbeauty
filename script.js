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
            const aboutSection = document.querySelector('#about-owner');
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
// SPECIALS CAROUSEL - FIXED VERSION
// ============================================
class SpecialsCarousel {
    constructor() {
        this.jsonPath = 'json/specials.json';
        
        this.carousel = document.getElementById('specialsCarousel');
        this.noSpecialsMessage = document.getElementById('noSpecialsMessage');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        
        this.modal = document.getElementById('packageModal');
        this.modalOverlay = this.modal?.querySelector('.modal-overlay');
        this.modalClose = this.modal?.querySelector('.modal-close');
        
        this.specials = [];
        this.currentPage = 0;
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = 0;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 5000;
        this.scrollPosition = 0;
        
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.resizeHandler = null;
        this.keyboardHandler = null;
        this.scrollHandler = null;
    }

    async init() {
        try {
            console.log('📥 Loading specials from:', this.jsonPath);
            
            await this.loadSpecials();
            
            if (this.specials && this.specials.length > 0) {
                console.log(`✅ Loaded ${this.specials.length} special(s)`);
                console.log('First special:', this.specials[0]);
                
                this.renderSpecials();
                this.setupCarousel();
                this.setupNavigation();
                this.setupTouchSupport();
                this.setupResizeHandler();
                this.setupScrollHandler();
                this.setupModal();
                this.startAutoScroll();
                
                console.log('✅ Carousel initialized successfully');
            } else {
                console.log('ℹ️ No specials found - showing fallback message');
                this.showNoSpecialsMessage();
            }
        } catch (error) {
            console.error('❌ Error initializing carousel:', error);
            this.showNoSpecialsMessage();
        }
    }

    async loadSpecials() {
        try {
            const response = await fetch(this.jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📦 JSON data loaded:', data);
            this.specials = data.specials || [];
            
        } catch (error) {
            console.error('❌ Error loading JSON:', error);
            throw error;
        }
    }

    renderSpecials() {
        if (!this.carousel) {
            console.error('❌ Carousel container not found!');
            return;
        }
        
        console.log('🎨 Rendering', this.specials.length, 'specials...');
        this.carousel.innerHTML = '';
        
        this.specials.forEach((special, index) => {
            console.log(`Creating card ${index + 1}:`, special.title);
            const card = this.createSpecialCard(special);
            this.carousel.appendChild(card);
        });
        
        console.log('✅ Cards rendered. Carousel HTML:', this.carousel.innerHTML.length, 'chars');
    }

    createSpecialCard(special) {
        const card = document.createElement('div');
        card.className = 'special-card';
        
        if (special.isWide) {
            card.classList.add('special-card-wide');
        }
        
        let cardHTML = '';
        
        if (special.savings && special.savings > 0) {
            cardHTML += `
                <div class="save-badge">
                    <span class="save-text">SAVE</span>
                    <span class="save-amount">$${special.savings.toFixed(2)}</span>
                </div>
            `;
        }
        
        cardHTML += `
            <div class="special-image">
                <img src="${special.image}" alt="${this.escapeHtml(special.title)}" loading="lazy">
            </div>
        `;
        
        cardHTML += `<div class="special-content">`;
        cardHTML += `<h3 class="special-title">${this.escapeHtml(special.title)}</h3>`;
        
        if (special.description) {
            cardHTML += `<p class="special-description">${this.escapeHtml(special.description)}</p>`;
        }
        
        cardHTML += `<div class="special-price">`;
        cardHTML += `<span class="current-price">$${special.currentPrice}</span>`;
        
        if (special.originalPrice && special.originalPrice > 0) {
            cardHTML += `<span class="original-price">$${special.originalPrice}</span>`;
        }
        
        cardHTML += `</div>`;
        cardHTML += `<p class="special-brand">${this.escapeHtml(special.brand)}</p>`;
        
        cardHTML += `
            <button type="button" class="special-book-btn view-details-btn" data-special-id="${special.id}">
                <span>View Details</span>
                <i class="fas fa-info-circle"></i>
            </button>
        `;
        
        cardHTML += `</div>`;
        
        card.innerHTML = cardHTML;
        
        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupCarousel() {
        this.itemsPerPage = this.getItemsPerPage();
        const cards = this.carousel.querySelectorAll('.special-card');
        this.totalPages = Math.ceil(cards.length / this.itemsPerPage);
        
        console.log(`📊 Setup: ${cards.length} cards, ${this.itemsPerPage}/page, ${this.totalPages} pages`);
        
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
            indicator.classList.add('carousel-indicator');
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
            if (this.modal && this.modal.classList.contains('active')) return;
            
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
        
        const cards = this.carousel.querySelectorAll('.special-card');
        const startIndex = pageIndex * this.itemsPerPage;
        
        if (cards[startIndex]) {
            const cardRect = cards[startIndex].getBoundingClientRect();
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
        const indicators = this.indicatorsContainer?.querySelectorAll('.carousel-indicator');
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
        if (!this.carousel) return;
        
        const cards = this.carousel.querySelectorAll('.special-card');
        if (cards.length === 0) return;
        
        const carouselRect = this.carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;
        
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        cards.forEach((card, index) => {
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
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
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

    setupModal() {
        if (!this.modal) {
            console.warn('Modal not found');
            return;
        }
        
        this.carousel.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-details-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                
                const specialId = parseInt(btn.dataset.specialId);
                this.openModal(specialId);
            }
        });
        
        if (this.modalClose) {
            this.modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                e.preventDefault();
                this.closeModal();
            }
        });
    }
    
    openModal(specialId) {
        const special = this.specials.find(s => s.id === specialId);
        if (!special) {
            console.error('Special not found:', specialId);
            return;
        }
        
        this.stopAutoScroll();
        this.scrollPosition = window.pageYOffset;
        
        const modalImage = document.getElementById('modalImage');
        const modalBadge = document.getElementById('modalBadge');
        const modalSavings = document.getElementById('modalSavings');
        const modalBrand = document.getElementById('modalBrand');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalCurrentPrice = document.getElementById('modalCurrentPrice');
        const modalOriginalPrice = document.getElementById('modalOriginalPrice');
        const includesList = document.getElementById('includesList');
        const modalBookBtn = document.getElementById('modalBookBtn');
        
        if (modalImage) {
            modalImage.src = special.image;
            modalImage.alt = special.title;
        }
        
        if (special.savings && special.savings > 0 && modalBadge && modalSavings) {
            modalBadge.style.display = 'flex';
            modalSavings.textContent = `$${special.savings.toFixed(2)}`;
        } else if (modalBadge) {
            modalBadge.style.display = 'none';
        }
        
        if (modalBrand) modalBrand.textContent = special.brand;
        if (modalTitle) modalTitle.textContent = special.title;
        if (modalDescription) {
            modalDescription.textContent = special.description || '';
            modalDescription.style.display = special.description ? 'block' : 'none';
        }
        if (modalCurrentPrice) modalCurrentPrice.textContent = `$${special.currentPrice}`;
        
        if (special.originalPrice && special.originalPrice > 0 && modalOriginalPrice) {
            modalOriginalPrice.textContent = `$${special.originalPrice}`;
            modalOriginalPrice.style.display = 'inline';
        } else if (modalOriginalPrice) {
            modalOriginalPrice.style.display = 'none';
        }
        
        if (includesList && special.includes && special.includes.length > 0) {
            includesList.innerHTML = '';
            special.includes.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                includesList.appendChild(li);
            });
        }
        
        if (modalBookBtn) {
            modalBookBtn.href = special.bookingLink;
        }
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        this.modal.classList.add('active');
        
        console.log('📋 Modal opened:', special.title);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        window.scrollTo(0, this.scrollPosition);
        
        this.startAutoScroll();
        
        console.log('✖️ Modal closed');
    }

    showNoSpecialsMessage() {
        if (!this.noSpecialsMessage || !this.carousel) return;
        
        this.carousel.classList.add('hidden');
        
        if (this.prevBtn) this.prevBtn.classList.add('hidden');
        if (this.nextBtn) this.nextBtn.classList.add('hidden');
        if (this.indicatorsContainer) this.indicatorsContainer.classList.add('hidden');
        
        this.noSpecialsMessage.classList.add('active');
        
        console.log('ℹ️ No specials message displayed');
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
    
    async reload() {
        console.log('🔄 Reloading...');
        this.cleanup();
        this.currentPage = 0;
        this.specials = [];
        this.totalPages = 0;
        
        if (this.noSpecialsMessage) {
            this.noSpecialsMessage.classList.remove('active');
        }
        
        await this.init();
    }
}

// ============================================
// SERVICES SECTION
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
        this.scrollHandler = null;
        
        // Bind methods to preserve context
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }

    init() {
        console.log('🎨 Starting Services Carousel Initialization...');
        
        if (!this.carousel) {
            console.error('❌ Services carousel track not found! ID: servicesCarouselTrack');
            return;
        }
        console.log('✅ Carousel track found');

        if (!this.prevBtn) {
            console.error('❌ Previous button not found! ID: servicesPrevBtn');
        } else {
            console.log('✅ Previous button found');
        }

        if (!this.nextBtn) {
            console.error('❌ Next button not found! ID: servicesNextBtn');
        } else {
            console.log('✅ Next button found');
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

        console.log(`✅ Services Carousel fully initialized with ${this.cards.length} cards`);
    }

    setupCarousel() {
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = Math.ceil(this.cards.length / this.itemsPerPage);
        
        console.log(`📊 Carousel Setup: ${this.cards.length} cards, ${this.itemsPerPage} per page, ${this.totalPages} total pages`);
        
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
        if (!this.indicatorsContainer) {
            console.warn('⚠️ Indicators container not found');
            return;
        }
        
        this.indicatorsContainer.innerHTML = '';
        
        if (this.totalPages <= 1) {
            this.indicatorsContainer.classList.add('hidden');
            console.log('ℹ️ Only 1 page, hiding indicators');
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
                console.log(`📍 Indicator ${i + 1} clicked`);
                this.goToPage(i);
                this.resetAutoScroll();
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
        
        console.log(`✅ Created ${this.totalPages} indicators`);
    }

    setupNavigation() {
        if (!this.prevBtn || !this.nextBtn) {
            console.warn('⚠️ Navigation buttons not available');
            return;
        }
        
        // Remove any existing listeners
        this.prevBtn.removeEventListener('click', this.handlePrevClick);
        this.nextBtn.removeEventListener('click', this.handleNextClick);
        
        // Add fresh listeners
        this.prevBtn.addEventListener('click', this.handlePrevClick);
        this.nextBtn.addEventListener('click', this.handleNextClick);
        
        console.log('✅ Navigation buttons configured with event listeners');
    }

    handlePrevClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('⬅️ PREVIOUS BUTTON CLICKED - Current page:', this.currentPage + 1);
        this.previousPage();
        this.resetAutoScroll();
    }

    handleNextClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('➡️ NEXT BUTTON CLICKED - Current page:', this.currentPage + 1);
        this.nextPage();
        this.resetAutoScroll();
    }

    updateNavigationVisibility() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const isMobile = window.innerWidth < 768;
        const shouldHide = this.totalPages <= 1 || isMobile;
        
        console.log(`🔍 Navigation visibility - Mobile: ${isMobile}, Total pages: ${this.totalPages}, Should hide: ${shouldHide}`);
        
        if (shouldHide) {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
            console.log('👻 Navigation buttons hidden');
        } else {
            this.prevBtn.classList.remove('hidden');
            this.nextBtn.classList.remove('hidden');
            console.log('👁️ Navigation buttons visible');
        }
    }

    goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.totalPages) {
            console.warn(`⚠️ Invalid page index: ${pageIndex}`);
            return;
        }
        
        console.log(`📄 Navigating from page ${this.currentPage + 1} to page ${pageIndex + 1}`);
        
        this.currentPage = pageIndex;
        this.updateIndicators();
        
        const startIndex = pageIndex * this.itemsPerPage;
        console.log(`📍 Scrolling to card index: ${startIndex}`);
        
        if (this.cards[startIndex]) {
            const cardRect = this.cards[startIndex].getBoundingClientRect();
            const carouselRect = this.carousel.getBoundingClientRect();
            const scrollAmount = cardRect.left - carouselRect.left + this.carousel.scrollLeft;
            
            console.log(`📏 Scroll amount: ${scrollAmount}px`);
            
            this.carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            console.error(`❌ Card at index ${startIndex} not found`);
        }
    }

    nextPage() {
        if (this.totalPages <= 1) {
            console.log('ℹ️ Only 1 page, cannot go to next');
            return;
        }
        const nextPage = (this.currentPage + 1) % this.totalPages;
        console.log(`➡️ Next page calculation: (${this.currentPage} + 1) % ${this.totalPages} = ${nextPage}`);
        this.goToPage(nextPage);
    }

    previousPage() {
        if (this.totalPages <= 1) {
            console.log('ℹ️ Only 1 page, cannot go to previous');
            return;
        }
        const prevPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
        console.log(`⬅️ Previous page calculation: (${this.currentPage} - 1 + ${this.totalPages}) % ${this.totalPages} = ${prevPage}`);
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
        
        this.scrollHandler = () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                this.updateCurrentPageFromScroll();
            }, 150);
        };
        
        this.carousel.addEventListener('scroll', this.scrollHandler, { passive: true });
        console.log('✅ Scroll handler configured');
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
        
        console.log('✅ Touch support configured');
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) {
            this.startAutoScroll();
            return;
        }
        
        console.log(`👆 Swipe detected: ${swipeDistance > 0 ? 'Left' : 'Right'}`);
        
        if (swipeDistance > 0) {
            this.nextPage();
        } else {
            this.previousPage();
        }
        
        this.resetAutoScroll();
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        this.resizeHandler = () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                const newItemsPerPage = this.getItemsPerPage();
                
                if (newItemsPerPage !== this.itemsPerPage) {
                    console.log(`🔄 Resize detected - Items per page changed from ${this.itemsPerPage} to ${newItemsPerPage}`);
                    this.itemsPerPage = newItemsPerPage;
                    this.setupCarousel();
                    this.goToPage(0);
                }
                
                this.updateNavigationVisibility();
            }, 250);
        };
        
        window.addEventListener('resize', this.resizeHandler);
        console.log('✅ Resize handler configured');
    }

    startAutoScroll() {
        if (this.totalPages <= 1) return;
        
        this.stopAutoScroll();
        
        this.autoScrollInterval = setInterval(() => {
            console.log('⏰ Auto-scroll triggered');
            this.nextPage();
        }, this.autoScrollDelay);
        
        console.log(`✅ Auto-scroll started (${this.autoScrollDelay}ms interval)`);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
            console.log('⏸️ Auto-scroll stopped');
        }
    }

    resetAutoScroll() {
        console.log('🔄 Resetting auto-scroll');
        this.stopAutoScroll();
        this.startAutoScroll();
    }

    cleanup() {
        console.log('🧹 Cleaning up Services Carousel');
        this.stopAutoScroll();
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        if (this.scrollHandler && this.carousel) {
            this.carousel.removeEventListener('scroll', this.scrollHandler);
        }
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.handlePrevClick);
        }
        
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.handleNextClick);
        }
    }
}

// ============================================
// MAIN INITIALIZATION - FIXED
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch');
    console.log('💎 Initializing components...');
    
    // Initialize all components
    new ElegantPreloader();
    new PremiumHeader();
    new HeroVideoCollage();
    new SpecialsCarousel();
    new ServicesCarousel();

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    console.log('✅ All components initialized');
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

console.log('🌟 Script loaded and ready');
