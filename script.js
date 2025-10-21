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
// SPECIALS CAROUSEL WITH FIXED MODAL
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
            console.log('📥 Loading specials...');
            
            await this.loadSpecials();
            
            if (this.specials && this.specials.length > 0) {
                console.log(`✅ Loaded ${this.specials.length} special(s)`);
                
                this.renderSpecials();
                this.setupCarousel();
                this.setupNavigation();
                this.setupTouchSupport();
                this.setupResizeHandler();
                this.setupScrollHandler();
                this.setupModal();
                this.startAutoScroll();
                
                console.log('✅ Carousel initialized');
            } else {
                this.showNoSpecialsMessage();
            }
        } catch (error) {
            console.error('❌ Error:', error);
            this.showNoSpecialsMessage();
        }
    }

    async loadSpecials() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.specials = data.specials || [];
    }

    renderSpecials() {
        if (!this.carousel) return;
        
        this.carousel.innerHTML = '';
        
        this.specials.forEach(special => {
            const card = this.createSpecialCard(special);
            this.carousel.appendChild(card);
        });
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

    // ============================================
    // FIXED MODAL
    // ============================================
    
    setupModal() {
        if (!this.modal) {
            console.warn('Modal not found');
            return;
        }
        
        // Event delegation for view details buttons
        this.carousel.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-details-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                
                const specialId = parseInt(btn.dataset.specialId);
                this.openModal(specialId);
            }
        });
        
        // Close button
        if (this.modalClose) {
            this.modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }
        
        // Overlay click
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }
        
        // ESC key
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
        
        // Stop carousel auto-scroll
        this.stopAutoScroll();
        
        // Save scroll position
        this.scrollPosition = window.pageYOffset;
        
        // Populate modal
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
        
        // Lock body scroll
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Show modal
        this.modal.classList.add('active');
        
        console.log('📋 Modal opened:', special.title);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        // Hide modal
        this.modal.classList.remove('active');
        
        // Restore body scroll
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, this.scrollPosition);
        
        // Resume auto-scroll
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
// OTHER COMPONENTS (UNCHANGED)
// ============================================

class OwnerPhotoCarousel {
    constructor() {
        this.carousel = document.querySelector('.owner-carousel');
        if (!this.carousel) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.dots = this.carousel.querySelectorAll('.carousel-dot');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 4000;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.setupDots();
        this.startAutoplay();
        this.setupHoverPause();
    }

    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });
    }

    goToSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentIndex = index;

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.slides[index],
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
            );
        }
    }

    goToNext() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.goToNext();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    setupHoverPause() {
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }
}

class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        this.init();
    }

    init() {
        if (this.testimonials.length === 0) return;
        
        this.setupNavigation();
        this.startAutoplay();
    }

    setupNavigation() {
        this.prevBtn.addEventListener('click', () => {
            this.goToPrev();
            this.resetAutoplay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.goToNext();
            this.resetAutoplay();
        });

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });
    }

    goToSlide(index) {
        this.testimonials.forEach(t => t.classList.remove('active'));
        this.dots.forEach(d => d.classList.remove('active'));
        
        this.testimonials[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentIndex = index;
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.testimonials[index],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
        }
    }

    goToNext() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goToSlide(nextIndex);
    }

    goToPrev() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.goToNext();
        }, 5000);
    }

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
}

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('placeholder', ' ');
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    
                    gsap.to(submitBtn, {
                        scale: 1,
                        duration: 0.2
                    });
                    
                    setTimeout(() => {
                        this.form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                }
            });
        } else {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
        
        console.log('Form submitted:', data);
    }
}

// ============================================
// INITIALIZE
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch');
    console.log('💎 Initializing...');
    
    new ElegantPreloader();
    new PremiumHeader();
    new HeroVideoCollage(); 
    new SpecialsCarousel();
    new OwnerPhotoCarousel();
    new TestimonialsSlider();
    new ContactForm();
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    console.log('✅ Ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}
