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

class GlobalSearch {
    constructor() {
        // DOM Elements
        this.modal = document.getElementById('searchModal');
        this.overlay = document.getElementById('searchModalOverlay');
        this.input = document.getElementById('globalSearchInput');
        this.clearBtn = document.getElementById('searchClearBtn');
        this.closeBtn = document.getElementById('searchCloseBtn');
        this.headerSearchBtn = document.getElementById('headerSearchBtn');
        this.mobileSearchBtn = document.getElementById('mobileSearchBtn');
        
        // Content Containers
        this.quickLinks = document.getElementById('searchQuickLinks');
        this.resultsContainer = document.getElementById('searchResults');
        this.noResults = document.getElementById('searchNoResults');
        this.loadingState = document.getElementById('searchLoading');
        
        // State
        this.isOpen = false;
        this.searchData = [];
        this.dataLoaded = false;
        this.searchTimeout = null;
        this.selectedIndex = -1;
        this.currentResults = [];
        
        // JSON files to load - update paths as needed
        this.dataFiles = [
            { file: 'data/facials.json', category: 'Facials', icon: 'fa-spa', page: 'servicecategories/facials.html' },
            { file: 'data/laser.json', category: 'Laser', icon: 'fa-bolt', page: 'servicecategories/laser.html' },
            { file: 'data/wax.json', category: 'Waxing', icon: 'fa-leaf', page: 'servicecategories/wax.html' },
            { file: 'data/lashes.json', category: 'Lashes', icon: 'fa-eye', page: 'servicecategories/brows-lashes-pmu.html' },
            { file: 'data/nails.json', category: 'Nails', icon: 'fa-hand-sparkles', page: 'servicecategories/nails.html' },
            { file: 'data/body.json', category: 'Body', icon: 'fa-leaf', page: 'servicecategories/body.html' },
            { file: 'data/packages.json', category: 'Packages', icon: 'fa-gift', page: 'servicecategories/packages.html' },
            { file: 'data/makeup.json', category: 'Makeup', icon: 'fa-paint-brush', page: 'servicecategories/makeup.html' },
            { file: 'data/addons.json', category: 'Add-Ons', icon: 'fa-plus-circle', page: 'servicecategories/addons.html' },
            { file: 'data/specials.json', category: 'Specials', icon: 'fa-star', page: 'servicecategories/specials.html' },
            { file: 'data/blog.json', category: 'Blog', icon: 'fa-newspaper', page: '#blog', isBlog: true }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        this.bindEvents();
        this.loadAllData();
        
        console.log('🔍 Global Search initialized');
    }
    
    // ============================================
    // EVENT BINDINGS
    // ============================================
    bindEvents() {
        // Open search
        if (this.headerSearchBtn) {
            this.headerSearchBtn.addEventListener('click', () => this.open());
        }
        if (this.mobileSearchBtn) {
            this.mobileSearchBtn.addEventListener('click', () => {
                this.closeMobileMenu();
                this.open();
            });
        }
        
        // Close search
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Input events
        if (this.input) {
            this.input.addEventListener('input', (e) => this.handleInput(e));
            this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
        
        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearSearch());
        }
        
        // Quick link buttons
        document.querySelectorAll('.quick-link-item[data-search]').forEach(btn => {
            btn.addEventListener('click', () => {
                const term = btn.getAttribute('data-search');
                this.input.value = term;
                this.performSearch(term);
            });
        });
        
        // Suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const term = chip.getAttribute('data-search');
                this.input.value = term;
                this.performSearch(term);
            });
        });
        
        // Keyboard shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    // ============================================
    // DATA LOADING
    // ============================================
    async loadAllData() {
        this.showLoading();
        
        try {
            const promises = this.dataFiles.map(async (item) => {
                try {
                    const response = await fetch(item.file);
                    if (!response.ok) throw new Error(`Failed to load ${item.file}`);
                    const data = await response.json();
                    return this.processData(data, item);
                } catch (error) {
                    console.warn(`⚠️ Could not load ${item.file}:`, error.message);
                    return [];
                }
            });
            
            const results = await Promise.all(promises);
            this.searchData = results.flat();
            this.dataLoaded = true;
            
            console.log(`✅ Loaded ${this.searchData.length} searchable items`);
        } catch (error) {
            console.error('❌ Error loading search data:', error);
        }
        
        this.hideLoading();
        this.showQuickLinks();
    }
    
    processData(data, config) {
        const items = [];
        
        // Handle blog posts
        if (config.isBlog && data.posts) {
            data.posts.forEach(post => {
                items.push({
                    id: post.id,
                    title: post.title,
                    description: post.excerpt || post.description || '',
                    category: 'Blog',
                    icon: config.icon,
                    image: post.image,
                    url: `#blog-${post.id}`,
                    type: 'blog',
                    searchText: `${post.title} ${post.excerpt || ''} ${post.category || ''}`.toLowerCase()
                });
            });
        }
        // Handle services
        else if (data.services) {
            data.services.forEach(service => {
                items.push({
                    id: service.id,
                    title: service.name,
                    description: service.description || '',
                    price: service.price || service.priceLabel || '',
                    duration: service.duration || '',
                    category: config.category,
                    icon: config.icon,
                    image: service.image,
                    url: service.bookNowUrl || config.page,
                    categoryPage: config.page,
                    type: 'service',
                    searchText: `${service.name} ${service.description || ''} ${config.category}`.toLowerCase()
                });
            });
        }
        
        return items;
    }
    
    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    handleInput(e) {
        const query = e.target.value.trim();
        
        // Toggle clear button
        this.clearBtn.classList.toggle('visible', query.length > 0);
        
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else if (query.length === 0) {
                this.showQuickLinks();
            }
        }, 200);
    }
    
    performSearch(query) {
        if (!this.dataLoaded) {
            console.warn('Search data not loaded yet');
            return;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        // Filter results
        const results = this.searchData.filter(item => {
            return item.searchText.includes(searchTerm) ||
                   item.title.toLowerCase().includes(searchTerm) ||
                   item.category.toLowerCase().includes(searchTerm);
        });
        
        // Sort by relevance (title matches first)
        results.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const aStartsWith = aTitle.startsWith(searchTerm);
            const bStartsWith = bTitle.startsWith(searchTerm);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return 0;
        });
        
        this.currentResults = results;
        this.selectedIndex = -1;
        
        if (results.length > 0) {
            this.displayResults(results, searchTerm);
        } else {
            this.showNoResults();
        }
    }
    
    displayResults(results, searchTerm) {
        this.hideAllStates();
        this.resultsContainer.classList.add('active');
        this.resultsContainer.style.display = 'block';
        
        // Group results by category
        const grouped = {};
        results.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });
        
        // Build HTML
        let html = '';
        
        Object.entries(grouped).forEach(([category, items]) => {
            html += `
                <div class="results-group">
                    <div class="results-group-header">
                        <span class="results-group-title">${category}</span>
                        <span class="results-count">${items.length} result${items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div class="results-list">
            `;
            
            items.slice(0, 5).forEach((item, index) => {
                const highlightedTitle = this.highlightMatch(item.title, searchTerm);
                const imageHtml = item.image 
                    ? `<img src="${item.image}" alt="${item.title}">`
                    : `<div class="result-image-placeholder"><i class="fas ${item.icon}"></i></div>`;
                
                html += `
                    <a href="${item.url}" class="result-item" data-index="${index}" target="${item.type === 'service' ? '_blank' : '_self'}">
                        <div class="result-image">
                            ${imageHtml}
                        </div>
                        <div class="result-content">
                            <div class="result-title">${highlightedTitle}</div>
                            <div class="result-meta">
                                <span class="result-category">${item.category}</span>
                                ${item.price ? `<span class="result-price">${item.price}</span>` : ''}
                                ${item.duration ? `<span class="result-duration">${item.duration}</span>` : ''}
                            </div>
                        </div>
                        <i class="fas fa-chevron-right result-arrow"></i>
                    </a>
                `;
            });
            
            // Show "View all" if more than 5 items
            if (items.length > 5) {
                const firstItem = items[0];
                html += `
                    <a href="${firstItem.categoryPage || '#'}" class="result-item view-all-link">
                        <div class="result-image">
                            <div class="result-image-placeholder"><i class="fas fa-arrow-right"></i></div>
                        </div>
                        <div class="result-content">
                            <div class="result-title">View all ${category}</div>
                            <div class="result-meta">
                                <span class="result-category">${items.length - 5} more results</span>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right result-arrow"></i>
                    </a>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        this.resultsContainer.innerHTML = html;
        
        // Add click handlers to results
        this.resultsContainer.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                this.close();
            });
        });
    }
    
    highlightMatch(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    handleKeydown(e) {
        const results = this.resultsContainer.querySelectorAll('.result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelection(results);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(results);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
                    results[this.selectedIndex].click();
                }
                break;
                
            case 'Escape':
                this.close();
                break;
        }
    }
    
    updateSelection(results) {
        results.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
            if (index === this.selectedIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
    
    // ============================================
    // UI STATE MANAGEMENT
    // ============================================
    showQuickLinks() {
        this.hideAllStates();
        if (this.quickLinks) {
            this.quickLinks.style.display = 'block';
        }
    }
    
    showNoResults() {
        this.hideAllStates();
        if (this.noResults) {
            this.noResults.classList.add('active');
            this.noResults.style.display = 'block';
        }
    }
    
    showLoading() {
        this.hideAllStates();
        if (this.loadingState) {
            this.loadingState.classList.add('active');
            this.loadingState.style.display = 'block';
        }
    }
    
    hideLoading() {
        if (this.loadingState) {
            this.loadingState.classList.remove('active');
            this.loadingState.style.display = 'none';
        }
    }
    
    hideAllStates() {
        if (this.quickLinks) this.quickLinks.style.display = 'none';
        if (this.resultsContainer) {
            this.resultsContainer.classList.remove('active');
            this.resultsContainer.style.display = 'none';
        }
        if (this.noResults) {
            this.noResults.classList.remove('active');
            this.noResults.style.display = 'none';
        }
        if (this.loadingState) {
            this.loadingState.classList.remove('active');
            this.loadingState.style.display = 'none';
        }
    }
    
    clearSearch() {
        this.input.value = '';
        this.clearBtn.classList.remove('visible');
        this.selectedIndex = -1;
        this.currentResults = [];
        this.showQuickLinks();
        this.input.focus();
    }
    
    // ============================================
    // MODAL OPEN/CLOSE
    // ============================================
    open() {
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus input after animation
        setTimeout(() => {
            this.input.focus();
        }, 100);
        
        // Show quick links by default
        this.showQuickLinks();
        
        console.log('🔍 Search opened');
    }
    
    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear search after close animation
        setTimeout(() => {
            this.clearSearch();
        }, 300);
        
        console.log('🔍 Search closed');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    closeMobileMenu() {
        const mobileDrawer = document.querySelector('.mobile-drawer');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const mobileToggle = document.querySelector('.mobile-toggle');
        
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    window.globalSearch = new GlobalSearch();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalSearch;
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
// 15% OFF
// ============================================

class SleekPromoBanner {
    constructor() {
        this.banner = document.getElementById('sleekPromoBanner');
        this.closeBtn = document.getElementById('sleekCloseBanner');
        this.daysEl = document.getElementById('sleekDays');
        this.hoursEl = document.getElementById('sleekHours');
        this.minsEl = document.getElementById('sleekMins');
        
        // End date: January 26, 2026 at 11:59 PM EST
        this.endDate = new Date('2026-01-26T23:59:59-05:00').getTime();
        
        this.init();
    }

    init() {
        // Check if dismissed or expired
        const dismissed = localStorage.getItem('sleekPromoDismissed_Jan2026');
        const currentTime = Date.now();
        
        if (dismissed && currentTime < this.endDate) {
            return;
        }
        
        if (currentTime >= this.endDate) {
            return;
        }
        
        // Show banner after slight delay
        setTimeout(() => {
            this.showBanner();
        }, 800);
        
        // Start countdown
        this.startCountdown();
        
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeBanner());
        }
        
        console.log('✨ Sleek promo banner active');
    }

    showBanner() {
        if (this.banner) {
            this.banner.classList.add('visible');
            document.body.classList.add('sleek-banner-visible');
        }
    }

    closeBanner() {
        if (this.banner) {
            this.banner.classList.remove('visible');
            this.banner.classList.add('hidden');
            document.body.classList.remove('sleek-banner-visible');
            localStorage.setItem('sleekPromoDismissed_Jan2026', 'true');
        }
    }

    startCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = Date.now();
        const distance = this.endDate - now;

        if (distance < 0) {
            clearInterval(this.countdownInterval);
            this.closeBanner();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (this.daysEl) this.daysEl.textContent = this.pad(days);
        if (this.hoursEl) this.hoursEl.textContent = this.pad(hours);
        if (this.minsEl) this.minsEl.textContent = this.pad(minutes);
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SleekPromoBanner();
    });
} else {
    new SleekPromoBanner();
}

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
    new SleekPromoBanner();

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
