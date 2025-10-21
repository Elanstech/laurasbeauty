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

        // Failsafe timeout
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
// HERO VIDEO COLLAGE WITH SMOOTH PLAYBACK
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
        console.log('Setting up video playback...');
        
        // Simple video setup - just play and loop
        this.videos.forEach((video, index) => {
            // Set attributes
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.defaultMuted = true;
            
            // Simple play function
            const playVideo = () => {
                const promise = video.play();
                if (promise !== undefined) {
                    promise.then(() => {
                        console.log(`Video ${index + 1} playing`);
                    }).catch(error => {
                        console.log(`Video ${index + 1} autoplay blocked, waiting for interaction`);
                    });
                }
            };
            
            // Try to play when ready
            video.addEventListener('canplay', playVideo, { once: true });
            
            // Handle errors
            video.addEventListener('error', (e) => {
                console.error(`Video ${index + 1} error:`, e);
            });
            
            // Load the video
            video.load();
        });

        // Enable all videos on first user interaction
        let userInteracted = false;
        const enableVideos = () => {
            if (userInteracted) return;
            userInteracted = true;
            
            console.log('User interaction - enabling videos');
            this.videos.forEach((video, index) => {
                video.muted = true;
                video.play().catch(e => {
                    console.log(`Video ${index + 1}:`, e.message);
                });
            });
        };

        // Listen for user interaction
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, enableVideos, { once: true, passive: true });
        });

        // Try to autoplay after page load
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
        // Remove active from all
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active to target
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

        // Hide on scroll
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
// SPECIALS SECTION
// ============================================

class SpecialsCarousel {
    constructor() {
        // Configuration
        this.jsonPath = 'specials.json'; // Path to JSON file
        
        // DOM Elements
        this.carousel = document.getElementById('specialsCarousel');
        this.noSpecialsMessage = document.getElementById('noSpecialsMessage');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        
        // Carousel State
        this.specials = [];
        this.currentPage = 0;
        this.itemsPerPage = this.getItemsPerPage();
        this.totalPages = 0;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 5000; // 5 seconds
        
        // Touch Support
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Resize handler reference
        this.resizeHandler = null;
        this.keyboardHandler = null;
    }

    /**
     * Initialize the carousel
     */
    async init() {
        try {
            console.log('📥 Loading specials from JSON...');
            
            // Load specials from JSON
            await this.loadSpecials();
            
            // Check if we have specials
            if (this.specials && this.specials.length > 0) {
                console.log(`✅ Loaded ${this.specials.length} special(s)`);
                
                // Render special cards
                this.renderSpecials();
                
                // Setup carousel
                this.setupCarousel();
                this.setupNavigation();
                this.setupTouchSupport();
                this.setupResizeHandler();
                this.startAutoScroll();
                
                console.log('✅ Specials carousel initialized successfully');
            } else {
                // Show no specials message
                console.log('ℹ️ No specials in JSON - showing message');
                this.showNoSpecialsMessage();
            }
        } catch (error) {
            console.error('❌ Error initializing carousel:', error);
            this.showNoSpecialsMessage();
        }
    }

    /**
     * Load specials from JSON file
     */
    async loadSpecials() {
        try {
            const response = await fetch(this.jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.specials = data.specials || [];
            
        } catch (error) {
            console.error('Error fetching specials.json:', error);
            this.specials = [];
            throw error;
        }
    }

    /**
     * Render special cards from JSON data
     */
    renderSpecials() {
        if (!this.carousel) {
            console.error('Carousel container not found');
            return;
        }
        
        // Clear existing content
        this.carousel.innerHTML = '';
        
        // Create card for each special
        this.specials.forEach(special => {
            const card = this.createSpecialCard(special);
            this.carousel.appendChild(card);
        });
        
        console.log(`✅ Rendered ${this.specials.length} special card(s)`);
    }

    /**
     * Create a special card element
     */
    createSpecialCard(special) {
        const card = document.createElement('div');
        card.className = 'special-card';
        
        // Add wide class if specified
        if (special.isWide) {
            card.classList.add('special-card-wide');
        }
        
        // Build card HTML
        let cardHTML = '';
        
        // Save badge (only if savings exists)
        if (special.savings && special.savings > 0) {
            cardHTML += `
                <div class="save-badge">
                    <span class="save-text">SAVE</span>
                    <span class="save-amount">$ ${special.savings.toFixed(2)}</span>
                </div>
            `;
        }
        
        // Image
        cardHTML += `
            <div class="special-image">
                <img src="${special.image}" alt="${this.escapeHtml(special.title)}" loading="lazy">
            </div>
        `;
        
        // Content
        cardHTML += `<div class="special-content">`;
        
        // Title
        cardHTML += `<h3 class="special-title">${this.escapeHtml(special.title)}</h3>`;
        
        // Description (optional)
        if (special.description) {
            cardHTML += `<p class="special-description">${this.escapeHtml(special.description)}</p>`;
        }
        
        // Price
        cardHTML += `<div class="special-price">`;
        cardHTML += `<span class="current-price">$ ${special.currentPrice}</span>`;
        
        // Original price (optional)
        if (special.originalPrice && special.originalPrice > 0) {
            cardHTML += `<span class="original-price">$ ${special.originalPrice}</span>`;
        }
        
        cardHTML += `</div>`;
        
        // Brand
        cardHTML += `<p class="special-brand">${this.escapeHtml(special.brand)}</p>`;
        
        // Book button
        cardHTML += `
            <a href="${this.escapeHtml(special.bookingLink)}" class="special-book-btn">
                <span>Book Now</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        `;
        
        cardHTML += `</div>`; // Close special-content
        
        card.innerHTML = cardHTML;
        
        return card;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Setup carousel based on screen size
     */
    setupCarousel() {
        this.itemsPerPage = this.getItemsPerPage();
        const cards = this.carousel.querySelectorAll('.special-card');
        this.totalPages = Math.ceil(cards.length / this.itemsPerPage);
        
        console.log(`📊 Carousel setup: ${cards.length} cards, ${this.itemsPerPage} per page, ${this.totalPages} pages`);
        
        // Create indicators
        this.createIndicators();
        
        // Update navigation visibility
        this.updateNavigationVisibility();
        
        // Show first page
        this.goToPage(0);
    }

    /**
     * Get items per page based on screen width
     */
    getItemsPerPage() {
        const width = window.innerWidth;
        
        if (width < 768) {
            return 1; // Mobile: 1 item
        } else if (width < 1024) {
            return 2; // Tablet: 2 items
        } else {
            return 3; // Desktop: 3 items
        }
    }

    /**
     * Create carousel indicators
     */
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        // Clear existing indicators
        this.indicatorsContainer.innerHTML = '';
        
        // Only show indicators if there's more than one page
        if (this.totalPages <= 1) {
            this.indicatorsContainer.classList.add('hidden');
            return;
        }
        
        this.indicatorsContainer.classList.remove('hidden');
        
        // Create indicator for each page
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

    /**
     * Setup navigation buttons
     */
    setupNavigation() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Remove any existing listeners
        const newPrevBtn = this.prevBtn.cloneNode(true);
        const newNextBtn = this.nextBtn.cloneNode(true);
        this.prevBtn.parentNode.replaceChild(newPrevBtn, this.prevBtn);
        this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
        this.prevBtn = newPrevBtn;
        this.nextBtn = newNextBtn;
        
        // Add click listeners
        this.prevBtn.addEventListener('click', () => {
            this.previousPage();
            this.resetAutoScroll();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextPage();
            this.resetAutoScroll();
        });
        
        // Keyboard navigation
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        this.keyboardHandler = (e) => {
            // Only respond if carousel is visible
            if (this.carousel && !this.carousel.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    this.previousPage();
                    this.resetAutoScroll();
                } else if (e.key === 'ArrowRight') {
                    this.nextPage();
                    this.resetAutoScroll();
                }
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }

    /**
     * Update navigation button visibility
     */
    updateNavigationVisibility() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Hide navigation if only one page or on mobile
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

    /**
     * Go to specific page
     */
    goToPage(pageIndex) {
        // Validate page index
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        
        this.currentPage = pageIndex;
        
        // Update active indicator
        this.updateIndicators();
        
        // Scroll to page (smooth scroll for better UX)
        const cards = this.carousel.querySelectorAll('.special-card');
        const startIndex = pageIndex * this.itemsPerPage;
        
        if (cards[startIndex]) {
            cards[startIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }

    /**
     * Go to next page
     */
    nextPage() {
        if (this.totalPages <= 1) return;
        const nextPage = (this.currentPage + 1) % this.totalPages;
        this.goToPage(nextPage);
    }

    /**
     * Go to previous page
     */
    previousPage() {
        if (this.totalPages <= 1) return;
        const prevPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
        this.goToPage(prevPage);
    }

    /**
     * Update active indicator
     */
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

    /**
     * Setup touch/swipe support for mobile
     */
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

    /**
     * Handle swipe gestures
     */
    handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            // Swiped left - go to next
            this.nextPage();
        } else {
            // Swiped right - go to previous
            this.previousPage();
        }
        
        this.resetAutoScroll();
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        this.resizeHandler = () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                const newItemsPerPage = this.getItemsPerPage();
                
                // Only rebuild if items per page changed
                if (newItemsPerPage !== this.itemsPerPage) {
                    console.log(`📱 Screen size changed: ${this.itemsPerPage} → ${newItemsPerPage} items per page`);
                    this.itemsPerPage = newItemsPerPage;
                    this.setupCarousel();
                }
                
                // Always update navigation visibility on resize
                this.updateNavigationVisibility();
            }, 250);
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Start auto-scroll
     */
    startAutoScroll() {
        // Only auto-scroll if there's more than one page
        if (this.totalPages <= 1) return;
        
        this.stopAutoScroll(); // Clear any existing interval
        
        this.autoScrollInterval = setInterval(() => {
            this.nextPage();
        }, this.autoScrollDelay);
        
        console.log('▶️ Auto-scroll started');
    }

    /**
     * Stop auto-scroll
     */
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    /**
     * Reset auto-scroll (restart timer)
     */
    resetAutoScroll() {
        this.stopAutoScroll();
        this.startAutoScroll();
    }

    /**
     * Show "No Specials" message
     */
    showNoSpecialsMessage() {
        if (!this.noSpecialsMessage || !this.carousel) return;
        
        // Hide carousel and navigation
        this.carousel.classList.add('hidden');
        
        if (this.prevBtn) this.prevBtn.classList.add('hidden');
        if (this.nextBtn) this.nextBtn.classList.add('hidden');
        if (this.indicatorsContainer) this.indicatorsContainer.classList.add('hidden');
        
        // Show no specials message
        this.noSpecialsMessage.classList.add('active');
        
        console.log('ℹ️ Displaying "No current specials" message');
    }

    /**
     * Hide "No Specials" message
     */
    hideNoSpecialsMessage() {
        if (!this.noSpecialsMessage || !this.carousel) return;
        
        // Show carousel
        this.carousel.classList.remove('hidden');
        
        // Hide no specials message
        this.noSpecialsMessage.classList.remove('active');
    }

    /**
     * Cleanup - remove event listeners
     */
    cleanup() {
        this.stopAutoScroll();
        
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
    }
    
    async reload() {
        console.log('🔄 Reloading specials...');
        
        // Cleanup existing listeners
        this.cleanup();
        
        // Reset state
        this.currentPage = 0;
        this.specials = [];
        this.totalPages = 0;
        
        // Hide no specials message
        if (this.noSpecialsMessage) {
            this.noSpecialsMessage.classList.remove('active');
        }
        
        // Reinitialize
        await this.init();
    }
}

let specialsCarousel;

function initSpecialsCarousel() {
    console.log('🌿 Laura\'s Beauty Touch - Specials Carousel');
    console.log('💎 Initializing carousel...');
    
    // Create new carousel instance
    specialsCarousel = new SpecialsCarousel();
    
    // Initialize
    specialsCarousel.init();
    
    // Make carousel globally accessible for debugging/reloading
    window.specialsCarousel = specialsCarousel;
    
    console.log('ℹ️ To reload specials, use: window.specialsCarousel.reload()');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpecialsCarousel);
} else {
    initSpecialsCarousel();
}

console.log('🌟 Specials Carousel Script Loaded');



// ============================================
// TESTIMONIALS SLIDER
// ============================================
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

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToPrev();
            if (e.key === 'ArrowRight') this.goToNext();
        });
    }

    goToSlide(index) {
        this.testimonials.forEach(t => t.classList.remove('active'));
        this.dots.forEach(d => d.classList.remove('active'));
        
        this.testimonials[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentIndex = index;
        
        // GSAP animation
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

// ============================================
// CONTACT FORM
// ============================================
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

        // Add floating label functionality
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('placeholder', ' ');
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message with GSAP
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
// AOS (ANIMATE ON SCROLL) INITIALIZATION
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: false
        });
    }
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Section fade-ins
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Service cards stagger
    if (document.querySelector('.service-card')) {
        gsap.from('.service-card', {
            opacity: 0,
            y: 60,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 75%'
            }
        });
    }
    
    // Feature items animation
    if (document.querySelector('.feature-item')) {
        gsap.from('.feature-item', {
            opacity: 0,
            scale: 0.9,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about-features',
                start: 'top 75%'
            }
        });
    }
    
    // Gallery items
    if (document.querySelector('.gallery-item')) {
        gsap.from('.gallery-item', {
            opacity: 0,
            scale: 0.8,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 75%'
            }
        });
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            console.log(`Native lazy loading for ${images.length} images`);
        } else {
            this.lazyLoadImages();
        }

        // Log performance
        this.logPerformance();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    logPerformance() {
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page load time: ${pageLoadTime}ms`);
            }
        });
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch - Natural Luxury');
    console.log('💎 Initializing components...');
    
    new ElegantPreloader();
    new PremiumHeader();
    new HeroVideoCollage();
    new SpecialsCarousel();
    new TestimonialsSlider();
    new ContactForm();
    new PerformanceOptimizer();
    
    // Initialize AOS
    initAOS();
    
    // Initialize GSAP animations with delay
    setTimeout(() => {
        initGSAPAnimations();
    }, 100);
    
    console.log('✅ All components ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

// Additional load handler
window.addEventListener('load', () => {
    console.log('✅ Page fully loaded');
});

console.log('🌟 Natural Luxury - Script Ready');
