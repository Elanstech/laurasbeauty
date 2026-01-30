// ============================================
// LAURA'S BEAUTY TOUCH - OPTIMIZED MAIN SCRIPT
// Performance optimized with all features preserved
// ============================================

// Utility Functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    createRipple(e, element, color = 'rgba(255, 255, 255, 0.4)') {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
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
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            transform: scale(0);
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
};

// Add global ripple animation style once
if (!document.getElementById('global-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'global-ripple-style';
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// ELEGANT PRELOADER
// ============================================
class ElegantPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        if (this.preloader) this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';
        
        const hidePreloader = () => {
            setTimeout(() => this.hide(), 300);
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader, { once: true });
        }

        setTimeout(() => {
            if (this.preloader && !this.preloader.classList.contains('hidden')) {
                this.hide();
            }
        }, 3000);
    }

    hide() {
        this.preloader.classList.add('hidden');
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
        }, 800);
    }
}

// ============================================
// PREMIUM HEADER WITH MEGA MENU
// ============================================
class PremiumHeaderWithMegaMenu {
    constructor() {
        this.header = document.querySelector('.premium-header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.logoWrapper = document.querySelector('.header-logo-wrapper');
        this.megamenuItem = document.querySelector('.has-megamenu');
        this.megamenuWrapper = document.querySelector('.megamenu-wrapper');
        this.megamenuTimeout = null;
        
        if (this.header) this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleLogoClick();
        this.handleMegaMenu();
        this.handleMobileSubmenu();
    }

    handleScroll() {
        const onScroll = Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            this.header.classList.toggle('scrolled', scrolled > 80);
        }, 100);
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    handleMobileMenu() {
        if (!this.mobileToggle) return;

        this.mobileToggle.addEventListener('click', () => this.toggleMenu());
        this.mobileOverlay?.addEventListener('click', () => this.closeMenu());

        document.querySelectorAll('.mobile-link:not(.mobile-dropdown-trigger)').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileDrawer?.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.mobileDrawer.classList.toggle('active');
        this.mobileToggle.classList.toggle('active', isActive);
        this.mobileOverlay?.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    closeMenu() {
        this.mobileToggle?.classList.remove('active');
        this.mobileDrawer?.classList.remove('active');
        this.mobileOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleLogoClick() {
        this.logoWrapper?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    handleMegaMenu() {
        if (!this.megamenuItem || !this.megamenuWrapper) return;

        const openMenu = () => {
            clearTimeout(this.megamenuTimeout);
            this.openMegaMenu();
        };

        const scheduleClose = (delay) => {
            this.megamenuTimeout = setTimeout(() => this.closeMegaMenu(), delay);
        };

        this.megamenuItem.addEventListener('mouseenter', openMenu);
        this.megamenuItem.addEventListener('mouseleave', () => scheduleClose(300));
        this.megamenuWrapper.addEventListener('mouseenter', () => clearTimeout(this.megamenuTimeout));
        this.megamenuWrapper.addEventListener('mouseleave', () => scheduleClose(200));

        document.addEventListener('click', (e) => {
            if (!this.megamenuItem.contains(e.target)) this.closeMegaMenu(true);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.megamenuWrapper.style.display === 'block') {
                this.closeMegaMenu(true);
            }
        });

        this.setupMegaMenuItems();
    }

    openMegaMenu() {
        this.megamenuWrapper.style.display = 'block';
        const items = this.megamenuWrapper.querySelectorAll('.megamenu-item');
        items.forEach((item, i) => {
            item.style.cssText = 'opacity: 0; transform: translateY(10px);';
            setTimeout(() => {
                item.style.cssText = 'opacity: 1; transform: translateY(0); transition: all 0.3s ease;';
            }, i * 30);
        });
    }

    closeMegaMenu(immediate = false) {
        const items = this.megamenuWrapper.querySelectorAll('.megamenu-item');
        items.forEach(item => item.style.cssText = 'opacity: 0; transform: translateY(10px);');
        setTimeout(() => this.megamenuWrapper.style.display = 'none', immediate ? 0 : 200);
    }

    setupMegaMenuItems() {
        this.megamenuWrapper.querySelectorAll('.megamenu-item').forEach(item => {
            item.addEventListener('click', () => {
                console.log(`📍 ${item.querySelector('.megamenu-item-title')?.textContent}`);
            });
        });
    }

    handleMobileSubmenu() {
        document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parent = trigger.closest('.mobile-has-submenu');
                document.querySelectorAll('.mobile-has-submenu').forEach(item => {
                    if (item !== parent) item.classList.remove('active');
                });
                parent.classList.toggle('active');
            });
        });
    }
}

// ============================================
// GLOBAL SEARCH
// ============================================
class GlobalSearch {
    constructor() {
        this.modal = document.getElementById('searchModal');
        this.overlay = document.getElementById('searchModalOverlay');
        this.input = document.getElementById('globalSearchInput');
        this.clearBtn = document.getElementById('searchClearBtn');
        this.closeBtn = document.getElementById('searchCloseBtn');
        this.headerSearchBtn = document.getElementById('headerSearchBtn');
        this.mobileSearchBtn = document.getElementById('mobileSearchBtn');
        this.quickLinks = document.getElementById('searchQuickLinks');
        this.resultsContainer = document.getElementById('searchResults');
        this.noResults = document.getElementById('searchNoResults');
        this.loadingState = document.getElementById('searchLoading');
        
        this.isOpen = false;
        this.searchData = [];
        this.dataLoaded = false;
        this.selectedIndex = -1;
        this.currentResults = [];
        
        this.dataFiles = [
    { file: '/data/facials.json', category: 'Facials', icon: 'fa-spa', page: '/servicecategories/facials.html' },
    { file: '/data/laser.json', category: 'Laser', icon: 'fa-bolt', page: '/servicecategories/laser.html' },
    { file: '/data/wax.json', category: 'Waxing', icon: 'fa-leaf', page: '/servicecategories/wax.html' },
    { file: '/data/lashes.json', category: 'Lashes', icon: 'fa-eye', page: '/servicecategories/brows-lashes-pmu.html' },
    { file: '/data/nails.json', category: 'Nails', icon: 'fa-hand-sparkles', page: '/servicecategories/nails.html' },
    { file: '/data/body.json', category: 'Body', icon: 'fa-leaf', page: '/servicecategories/body.html' },
    { file: '/data/packages.json', category: 'Packages', icon: 'fa-gift', page: '/servicecategories/packages.html' },
    { file: '/data/makeup.json', category: 'Makeup', icon: 'fa-paint-brush', page: '/servicecategories/makeup.html' },
    { file: '/data/addons.json', category: 'Add-Ons', icon: 'fa-plus-circle', page: '/servicecategories/addons.html' },
    { file: '/data/specials.json', category: 'Specials', icon: 'fa-star', page: '/servicecategories/specials.html' },
    { file: '/data/blog.json', category: 'Blog', icon: 'fa-newspaper', page: '#blog', isBlog: true }
        ];
        
        if (this.modal) this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadAllData();
        console.log('🔍 Global Search initialized');
    }
    
    bindEvents() {
        this.headerSearchBtn?.addEventListener('click', () => this.open());
        this.mobileSearchBtn?.addEventListener('click', () => {
            this.closeMobileMenu();
            this.open();
        });
        
        this.overlay?.addEventListener('click', () => this.close());
        this.closeBtn?.addEventListener('click', () => this.close());
        
        if (this.input) {
            this.input.addEventListener('input', Utils.debounce((e) => this.handleInput(e), 200));
            this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
        
        this.clearBtn?.addEventListener('click', () => this.clearSearch());
        
        document.querySelectorAll('[data-search]').forEach(btn => {
            btn.addEventListener('click', () => {
                const term = btn.getAttribute('data-search');
                this.input.value = term;
                this.performSearch(term);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }
    
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
                    console.warn(`⚠️ Could not load ${item.file}`);
                    return [];
                }
            });
            
            const results = await Promise.all(promises);
            this.searchData = results.flat();
            this.dataLoaded = true;
            console.log(`✅ Loaded ${this.searchData.length} items`);
        } catch (error) {
            console.error('❌ Error loading search data:', error);
        }
        
        this.hideLoading();
        this.showQuickLinks();
    }
    
    processData(data, config) {
        const items = [];
        
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
        } else if (data.services) {
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
    
    handleInput(e) {
        const query = e.target.value.trim();
        this.clearBtn?.classList.toggle('visible', query.length > 0);
        
        if (query.length >= 2) {
            this.performSearch(query);
        } else if (query.length === 0) {
            this.showQuickLinks();
        }
    }
    
    performSearch(query) {
        if (!this.dataLoaded) return;
        
        const searchTerm = query.toLowerCase().trim();
        const results = this.searchData.filter(item => 
            item.searchText.includes(searchTerm) ||
            item.title.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        ).sort((a, b) => {
            const aStart = a.title.toLowerCase().startsWith(searchTerm);
            const bStart = b.title.toLowerCase().startsWith(searchTerm);
            return aStart && !bStart ? -1 : !aStart && bStart ? 1 : 0;
        });
        
        this.currentResults = results;
        this.selectedIndex = -1;
        
        results.length > 0 ? this.displayResults(results, searchTerm) : this.showNoResults();
    }
    
    displayResults(results, searchTerm) {
        this.hideAllStates();
        this.resultsContainer.classList.add('active');
        this.resultsContainer.style.display = 'block';
        
        const grouped = {};
        results.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });
        
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
            
            items.slice(0, 5).forEach(item => {
                const highlightedTitle = this.highlightMatch(item.title, searchTerm);
                const imageHtml = item.image 
                    ? `<img src="${item.image}" alt="${item.title}">`
                    : `<div class="result-image-placeholder"><i class="fas ${item.icon}"></i></div>`;
                
                html += `
                    <a href="${item.url}" class="result-item" target="${item.type === 'service' ? '_blank' : '_self'}">
                        <div class="result-image">${imageHtml}</div>
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
            
            if (items.length > 5) {
                html += `
                    <a href="${items[0].categoryPage || '#'}" class="result-item view-all-link">
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
            
            html += '</div></div>';
        });
        
        this.resultsContainer.innerHTML = html;
        this.resultsContainer.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => this.close());
        });
    }
    
    highlightMatch(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
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
    
    showQuickLinks() {
        this.hideAllStates();
        if (this.quickLinks) this.quickLinks.style.display = 'block';
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
        [this.quickLinks, this.resultsContainer, this.noResults, this.loadingState].forEach(el => {
            if (el) {
                el.classList.remove('active');
                el.style.display = 'none';
            }
        });
    }
    
    clearSearch() {
        this.input.value = '';
        this.clearBtn?.classList.remove('visible');
        this.selectedIndex = -1;
        this.currentResults = [];
        this.showQuickLinks();
        this.input.focus();
    }
    
    open() {
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.input.focus(), 100);
        this.showQuickLinks();
        console.log('🔍 Search opened');
    }
    
    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => this.clearSearch(), 300);
        console.log('🔍 Search closed');
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    closeMobileMenu() {
        const drawer = document.querySelector('.mobile-drawer');
        const overlay = document.querySelector('.mobile-overlay');
        const toggle = document.querySelector('.mobile-toggle');
        
        drawer?.classList.remove('active');
        overlay?.classList.remove('active');
        toggle?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// FLOATING BUTTONS
// ============================================
class FloatingButtons {
    constructor() {
        this.specialsBtn = document.getElementById('specialsBtn');
        this.giftcardBtn = document.getElementById('giftcardBtn');
        this.mobileDrawer = document.querySelector('.mobile-drawer');
        this.isVisible = false;
        this.showDelay = 3000;
        
        if (this.specialsBtn || this.giftcardBtn) this.init();
    }

    init() {
        setTimeout(() => this.show(), this.showDelay);
        this.handleMobileMenu();
        this.trackClicks();
    }

    show() {
        if (!this.mobileDrawer?.classList.contains('active')) {
            this.specialsBtn?.classList.add('visible');
            this.giftcardBtn?.classList.add('visible');
            this.isVisible = true;
        }
    }

    hide() {
        this.specialsBtn?.classList.remove('visible');
        this.giftcardBtn?.classList.remove('visible');
        this.specialsBtn?.classList.add('hidden-mobile');
        this.giftcardBtn?.classList.add('hidden-mobile');
        this.isVisible = false;
    }

    reveal() {
        this.specialsBtn?.classList.remove('hidden-mobile');
        this.giftcardBtn?.classList.remove('hidden-mobile');
        this.specialsBtn?.classList.add('visible');
        this.giftcardBtn?.classList.add('visible');
        this.isVisible = true;
    }

    handleMobileMenu() {
        if (!this.mobileDrawer) return;

        const observer = new MutationObserver(() => {
            const isActive = this.mobileDrawer.classList.contains('active');
            isActive ? this.hide() : setTimeout(() => this.reveal(), 100);
        });

        observer.observe(this.mobileDrawer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    trackClicks() {
        this.specialsBtn?.addEventListener('click', (e) => {
            console.log('🌟 Specials clicked');
            Utils.createRipple(e, this.specialsBtn, 'rgba(169, 200, 156, 0.6)');
        });

        this.giftcardBtn?.addEventListener('click', (e) => {
            console.log('🎁 Gift Card clicked');
            Utils.createRipple(e, this.giftcardBtn, 'rgba(212, 175, 55, 0.6)');
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
        this.videos = document.querySelectorAll('.hero-video');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.currentSlide = 0;
        
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
            this.videos.forEach(video => {
                document.hidden ? video.pause() : video.play().catch(() => {});
            });
        });

        const playVideos = () => {
            this.videos.forEach(video => {
                if (video.paused) video.play().catch(() => {});
            });
        };

        ['click', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, playVideos, { once: true, passive: true });
        });

        window.addEventListener('load', () => {
            setTimeout(playVideos, 300);
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
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        const onScroll = Utils.throttle(() => {
            this.scrollIndicator.style.opacity = window.pageYOffset > 100 ? '0' : '1';
        }, 100);

        window.addEventListener('scroll', onScroll, { passive: true });
    }
}

// ============================================
// VALENTINE'S DAY DECORATIONS
// Add this to your existing script.js file
// ============================================

class ValentinesDecorations {
    constructor() {
        this.badge = document.querySelector('.modern-valentine-badge');
        this.decorations = document.querySelector('.valentines-decoration');
        this.particles = document.querySelectorAll('.particle');
        this.hearts = document.querySelectorAll('.heart-minimal');
        
        if (this.decorations) {
            this.init();
        }
    }

    init() {
        console.log('💕 Valentine\'s Day decorations initialized');
        this.setupBadgeInteraction();
        this.randomizeParticles();
        this.randomizeHearts();
        this.adjustForExistingElements();
    }

    // Make badge clickable and navigate to specials
    setupBadgeInteraction() {
        if (!this.badge) return;

        this.badge.addEventListener('click', (e) => {
            console.log('💝 Valentine\'s badge clicked - navigating to specials');
            
            // Add click animation
            this.badge.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.badge.style.transform = '';
            }, 150);

            // Navigate to specials page
            window.location.href = 'servicecategories/specials.html';
        });

        // Add hover effects
        this.badge.addEventListener('mouseenter', () => {
            const badgeContent = this.badge.querySelector('.badge-content');
            if (badgeContent) {
                badgeContent.style.transform = 'translateX(-3px)';
            }
        });

        this.badge.addEventListener('mouseleave', () => {
            const badgeContent = this.badge.querySelector('.badge-content');
            if (badgeContent) {
                badgeContent.style.transform = 'translateX(0)';
            }
        });

        // Add accessible keyboard support
        this.badge.setAttribute('role', 'button');
        this.badge.setAttribute('tabindex', '0');
        this.badge.setAttribute('aria-label', 'View Valentine\'s Day Special Offers');

        this.badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.badge.click();
            }
        });
    }

    // Randomize particle positions slightly for natural look
    randomizeParticles() {
        if (!this.particles || this.particles.length === 0) return;

        this.particles.forEach(particle => {
            const randomDelay = Math.random() * 3;
            const randomDuration = 8 + Math.random() * 4; // 8-12 seconds
            
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.animationDuration = `${randomDuration}s`;
        });
    }

    // Randomize heart animations for more natural movement
    randomizeHearts() {
        if (!this.hearts || this.hearts.length === 0) return;

        this.hearts.forEach(heart => {
            const randomDuration = 20 + Math.random() * 10; // 20-30 seconds
            heart.style.animationDuration = `${randomDuration}s`;
        });
    }

    // Adjust decorations based on existing page elements
    adjustForExistingElements() {
        // Check if banner is visible and adjust badge position
        const banner = document.querySelector('.sleek-promo-banner');
        if (banner && banner.classList.contains('visible')) {
            this.adjustBadgeForBanner(true);
        }

        // Listen for banner changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('sleek-promo-banner')) {
                    const isVisible = mutation.target.classList.contains('visible');
                    this.adjustBadgeForBanner(isVisible);
                }
            });
        });

        if (banner) {
            observer.observe(banner, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        }

        // Adjust for scrolled header
        window.addEventListener('scroll', Utils.throttle(() => {
            this.adjustBadgeForScroll();
        }, 100), { passive: true });
    }

    adjustBadgeForBanner(isVisible) {
        if (!this.badge) return;
        
        if (isVisible) {
            this.badge.style.top = '170px';
        } else {
            this.badge.style.top = '100px';
        }
    }

    adjustBadgeForScroll() {
        if (!this.badge) return;
        
        const header = document.querySelector('.premium-header');
        const banner = document.querySelector('.sleek-promo-banner');
        const isScrolled = header && header.classList.contains('scrolled');
        const isBannerVisible = banner && banner.classList.contains('visible');

        if (isBannerVisible && isScrolled) {
            this.badge.style.top = '150px';
        } else if (isBannerVisible) {
            this.badge.style.top = '170px';
        } else if (isScrolled) {
            this.badge.style.top = '90px';
        } else {
            this.badge.style.top = '100px';
        }
    }

    // Method to disable decorations (useful for after Valentine's Day)
    disable() {
        if (this.decorations) {
            this.decorations.style.opacity = '0';
            setTimeout(() => {
                this.decorations.style.display = 'none';
            }, 500);
        }
        console.log('💔 Valentine\'s decorations disabled');
    }

    // Method to enable decorations
    enable() {
        if (this.decorations) {
            this.decorations.style.display = 'block';
            setTimeout(() => {
                this.decorations.style.opacity = '1';
            }, 10);
        }
        console.log('💕 Valentine\'s decorations enabled');
    }
}

// ============================================
// AUTO-INITIALIZE VALENTINE'S DECORATIONS
// Only show during Valentine's season
// ============================================

function initValentinesDecorations() {
    const currentDate = new Date();
    const month = currentDate.getMonth(); // 0 = January, 1 = February
    const day = currentDate.getDate();
    
    // Valentine's season: January 20 - February 20
    const isValentinesSeason = (
        (month === 0 && day >= 20) || // January 20-31
        (month === 1 && day <= 20)    // February 1-20
    );

    // Check if decorations exist in DOM
    const decorationsExist = document.querySelector('.valentines-decoration');
    
    if (!decorationsExist) {
        console.log('💔 No Valentine\'s decorations found in HTML');
        return null;
    }

    if (isValentinesSeason) {
        const valentines = new ValentinesDecorations();
        console.log('💝 Valentine\'s season active!');
        return valentines;
    } else {
        // Remove decorations if not Valentine's season
        const decorations = document.querySelector('.valentines-decoration');
        if (decorations) {
            decorations.remove();
            console.log('💔 Valentine\'s season ended - decorations removed');
        }
        return null;
    }
}

// ============================================
// INTEGRATE WITH EXISTING INITIALIZATION
// ============================================

// Store Valentine's instance globally for manual control if needed
let valentinesDecorations = null;

// Add to existing DOMContentLoaded or initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        valentinesDecorations = initValentinesDecorations();
    });
} else {
    valentinesDecorations = initValentinesDecorations();
}

// Optional: Manual control functions
window.valentinesControl = {
    enable: () => {
        if (valentinesDecorations) {
            valentinesDecorations.enable();
        } else {
            console.log('💔 Valentine\'s decorations not initialized');
        }
    },
    disable: () => {
        if (valentinesDecorations) {
            valentinesDecorations.disable();
        } else {
            console.log('💔 Valentine\'s decorations not initialized');
        }
    },
    // Force initialize regardless of date (for testing)
    forceInit: () => {
        const decorationsExist = document.querySelector('.valentines-decoration');
        if (decorationsExist) {
            valentinesDecorations = new ValentinesDecorations();
            console.log('💕 Valentine\'s decorations force initialized');
        } else {
            console.log('💔 No Valentine\'s decorations in HTML to initialize');
        }
    }
};

// ============================================
// COMPATIBILITY WITH EXISTING HERO CLASS
// ============================================

// If you have HeroVideoCollage class, ensure compatibility
if (typeof HeroVideoCollage !== 'undefined') {
    const originalHeroInit = HeroVideoCollage.prototype.init;
    
    HeroVideoCollage.prototype.init = function() {
        // Call original init
        originalInit.call(this);
        
        // Ensure decorations don't interfere with video performance
        const decorations = document.querySelector('.valentines-decoration');
        if (decorations) {
            // Force correct z-index
            decorations.style.zIndex = '2';
            decorations.style.pointerEvents = 'none';
            
            // Ensure badge is clickable
            const badge = document.querySelector('.modern-valentine-badge');
            if (badge) {
                badge.style.pointerEvents = 'auto';
                badge.style.zIndex = '15';
            }
        }
        
        console.log('✅ Valentine\'s decorations compatible with hero videos');
    };
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Reduce animation complexity on low-performance devices
function optimizeForPerformance() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        const decorations = document.querySelector('.valentines-decoration');
        if (decorations) {
            // Disable animations but keep static decorations
            decorations.style.animation = 'none';
            const animatedElements = decorations.querySelectorAll('*');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
            });
            console.log('♿ Reduced motion: Valentine\'s animations disabled');
        }
    }

    // Reduce decorations on mobile for performance
    if (window.innerWidth <= 480) {
        const hearts = document.querySelectorAll('.heart-minimal');
        const particles = document.querySelectorAll('.particle');
        
        // Keep only first 2 hearts on mobile
        hearts.forEach((heart, index) => {
            if (index >= 2) heart.style.display = 'none';
        });
        
        // Keep only first 3 particles on mobile
        particles.forEach((particle, index) => {
            if (index >= 3) particle.style.display = 'none';
        });
        
        console.log('📱 Mobile optimization: Reduced decorations for performance');
    }
}

// Run optimization on load and resize
window.addEventListener('load', optimizeForPerformance);
window.addEventListener('resize', Utils.debounce(optimizeForPerformance, 250));

// ============================================
// CONSOLE EASTER EGG
// ============================================

if (valentinesDecorations) {
    console.log('%c💕 Happy Valentine\'s Day! 💕', 
        'color: #FF69B4; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(255,105,180,0.5);');
    console.log('%cEnjoy our special Valentine\'s offers!', 
        'color: #FF1493; font-size: 14px; font-style: italic;');
}

console.log('✨ Valentine\'s decorations script loaded');

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
        
        if (!this.track || this.slides.length === 0) return;
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.totalSlides = this.slides.length;
        this.maxIndex = this.totalSlides - this.slidesToShow;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.attachEventListeners();
        this.startAutoplay();
        
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        return width <= 768 ? 1 : width <= 1200 ? 2 : 3;
    }
    
    handleResize() {
        const newSlidesToShow = this.getSlidesToShow();
        if (newSlidesToShow !== this.slidesToShow) {
            this.slidesToShow = newSlidesToShow;
            this.maxIndex = this.totalSlides - this.slidesToShow;
            if (this.currentIndex > this.maxIndex) this.currentIndex = this.maxIndex;
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const offset = -(this.currentIndex * (slideWidth + 30));
        this.track.style.transform = `translateX(${offset}px)`;
        
        this.indicators.forEach((ind, i) => ind.classList.toggle('active', i === this.currentIndex));
        
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex >= this.totalSlides - 1 ? '0.5' : '1';
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
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.resetAutoplay();
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    attachEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => this.goToSlide(i));
        });
        
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            }
        });
        
        const wrapper = document.querySelector('.services-carousel-wrapper');
        wrapper?.addEventListener('mouseenter', () => this.stopAutoplay());
        wrapper?.addEventListener('mouseleave', () => this.startAutoplay());
    }
}

// ============================================
// TEAM SECTION
// ============================================
class TeamSection {
    constructor() {
        this.section = document.querySelector('.team-section');
        this.stats = document.querySelectorAll('.team-stat');
        this.animatedStats = new Set();
        
        if (!this.section) return;
        this.init();
    }

    init() {
        this.setupStatsAnimation();
        this.setupButtonEffects();
    }

    setupStatsAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedStats.has(entry.target)) {
                    this.animatedStats.add(entry.target);
                    this.animateStatNumber(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
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
            numberElement.textContent = step >= steps ? targetNumber + suffix : Math.floor(current) + suffix;
            if (step >= steps) clearInterval(timer);
        }, duration / steps);
    }

    setupButtonEffects() {
        const btn = document.querySelector('.btn-meet-team');
        btn?.addEventListener('click', (e) => {
            console.log('🤝 Meet Team clicked');
            Utils.createRipple(e, btn);
        });
    }
}

// ============================================
// BLOG SECTION
// ============================================
class BlogSection {
    constructor() {
        this.blogGrid = document.getElementById('blogGrid');
        this.modal = document.getElementById('blogModal');
        this.modalBody = document.getElementById('blogModalBody');
        this.modalClose = document.getElementById('blogModalClose');
        this.modalOverlay = document.getElementById('blogModalOverlay');
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
        
        if (this.blogGrid) this.init();
    }

    init() {
        this.loadBlogPosts();
        this.setupEventListeners();
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
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
        const postsToShow = showAll ? this.posts : this.posts.slice(0, this.displayCount);
        this.blogGrid.innerHTML = postsToShow.map(post => this.createBlogCard(post)).join('');
        
        if (this.viewAllBtn) {
            this.viewAllBtn.style.display = showAll || this.posts.length <= this.displayCount ? 'none' : 'inline-flex';
        }
        
        this.attachCardEvents();
        
        if (this.isMobile) {
            this.currentSlide = 0;
            this.setupCarousel();
        }
    }

    createBlogCard(post) {
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
                            ${this.formatDate(post.date)}
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
        document.querySelectorAll('.blog-card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(parseInt(link.getAttribute('data-post-id')));
            });
        });
    }

    setupCarousel() {
        if (!this.isMobile) return;
        
        if (this.carouselDots) {
            const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
            this.carouselDots.innerHTML = postsToShow.map((_, i) => 
                `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`
            ).join('');
            
            this.carouselDots.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    this.goToSlide(parseInt(dot.getAttribute('data-slide')));
                });
            });
        }
        
        if (this.blogGrid) {
            this.blogGrid.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            this.blogGrid.addEventListener('touchmove', (e) => {
                this.touchEndX = e.touches[0].clientX;
            }, { passive: true });
            
            this.blogGrid.addEventListener('touchend', () => {
                const diff = this.touchStartX - this.touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.nextSlide() : this.prevSlide();
                }
            });
        }
        
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
        
        const viewportWidth = window.innerWidth;
        const gap = viewportWidth <= 480 ? 15 : 20;
        const padding = viewportWidth <= 480 ? 15 : 20;
        const cardWidth = viewportWidth - (padding * 2);
        const offset = -(this.currentSlide * (cardWidth + gap));
        
        this.blogGrid.style.transform = `translateX(${offset}px)`;
        
        this.carouselDots?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        const postsToShow = this.showingAll ? this.posts : this.posts.slice(0, this.displayCount);
        
        if (this.carouselPrev) {
            this.carouselPrev.disabled = this.currentSlide === 0;
            this.carouselPrev.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        }
        
        if (this.carouselNext) {
            const isLast = this.currentSlide >= postsToShow.length - 1;
            this.carouselNext.disabled = isLast;
            this.carouselNext.style.opacity = isLast ? '0.5' : '1';
        }
    }

    openModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        this.modalBody.innerHTML = `
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
                        ${this.formatDate(post.date)}
                    </span>
                </div>
                <h1 class="blog-modal-title">${post.title}</h1>
            </div>
            <div class="blog-modal-content-text">
                ${post.content}
            </div>
        `;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log(`📖 Blog post: ${post.title}`);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        if (this.modalBody) this.modalBody.scrollTop = 0;
    }

    setupEventListeners() {
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalOverlay?.addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        this.viewAllBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showingAll = true;
            this.renderBlogPosts(true);
        });
        
        this.carouselPrev?.addEventListener('click', () => this.prevSlide());
        this.carouselNext?.addEventListener('click', () => this.nextSlide());
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.currentSlide = 0;
            this.isMobile ? this.setupCarousel() : this.blogGrid.style.transform = '';
        } else if (this.isMobile) {
            setTimeout(() => this.updateCarousel(), 100);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
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
        this.isDragging = false;
        
        if (this.track && this.slides.length > 0) this.init();
    }

    init() {
        this.updateCarousel(false);
        this.bindEvents();
    }

    bindEvents() {
        this.prevButton?.addEventListener('click', () => this.goToPrevious());
        this.nextButton?.addEventListener('click', () => this.goToNext());

        this.indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => this.goToSlide(i));
        });

        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => this.handleSwipe());

        this.track.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.touchStartX = e.clientX;
            this.track.style.cursor = 'grabbing';
        });
        
        this.track.addEventListener('mousemove', (e) => {
            if (this.isDragging) this.touchEndX = e.clientX;
        });
        
        this.track.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.track.style.cursor = 'grab';
                this.handleSwipe();
            }
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.track.style.cursor = 'grab';
            }
        });

        window.addEventListener('resize', Utils.debounce(() => {
            this.updateCarousel(false);
        }, 250));
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
            setTimeout(() => this.isAnimating = false, 400);
        }

        this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;

        this.slides.forEach((slide, i) => slide.classList.toggle('active', i === this.currentIndex));
        this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
            ind.setAttribute('aria-current', i === this.currentIndex ? 'true' : 'false');
        });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) >= 50) {
            diff > 0 ? this.goToNext() : this.goToPrevious();
        }
        this.touchStartX = 0;
        this.touchEndX = 0;
    }
}

// ============================================
// SIMPLE COMPONENTS
// ============================================
class SimpleComponents {
    static initBackToTop() {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;

        const onScroll = Utils.throttle(() => {
            btn.classList.toggle('visible', window.pageYOffset > 300);
        }, 100);

        window.addEventListener('scroll', onScroll, { passive: true });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            btn.style.transform = 'translateY(-3px) scale(1.05)';
            setTimeout(() => btn.style.transform = '', 200);
        });
    }

    static initFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabOptions = document.getElementById('fabOptions');
        if (!fabMain) return;

        let isOpen = false;

        const toggle = () => {
            isOpen = !isOpen;
            fabMain.classList.toggle('active', isOpen);
            fabOptions?.classList.toggle('active', isOpen);
        };

        const close = () => {
            isOpen = false;
            fabMain.classList.remove('active');
            fabOptions?.classList.remove('active');
        };

        fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !e.target.closest('.fab-container')) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) close();
        });

        document.querySelectorAll('.fab-option').forEach(opt => {
            opt.addEventListener('click', () => setTimeout(close, 200));
        });
    }

    static initContactButtons() {
        const bookBtn = document.querySelector('.btn-book-now');
        const callBtn = document.querySelector('.btn-call-now');

        bookBtn?.addEventListener('click', (e) => {
            console.log('📅 Book Appointment');
            Utils.createRipple(e, bookBtn);
        });

        callBtn?.addEventListener('click', (e) => {
            console.log('📞 Call button');
            Utils.createRipple(e, callBtn);
        });
    }

    static initFooter() {
        const year = document.getElementById('currentYear');
        if (year) year.textContent = new Date().getFullYear();

        const ctaBtn = document.querySelector('.footer-cta-btn');
        ctaBtn?.addEventListener('click', (e) => {
            console.log('Footer CTA clicked');
            Utils.createRipple(e, ctaBtn, 'rgba(59, 74, 47, 0.3)');
        });
    }

    static initAboutCarousels() {
        document.querySelectorAll('.about-carousel-section').forEach(section => {
            new AboutCarousel(section);
        });
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================
function initWebsite() {
    console.log('🌿 Laura\'s Beauty Touch - Initializing...');
    
    // Core Components
    new ElegantPreloader();
    new PremiumHeaderWithMegaMenu();
    new GlobalSearch();
    
    // Interactive Elements
    new FloatingButtons();
    new HeroVideoCollage();
    
    // Content Sections
    new ServicesCarousel();
    new TeamSection();
    new BlogSection();
    
    // Simple Components
    SimpleComponents.initBackToTop();
    SimpleComponents.initFAB();
    SimpleComponents.initContactButtons();
    SimpleComponents.initFooter();
    SimpleComponents.initAboutCarousels();
    
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

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebsite);
} else {
    initWebsite();
}

console.log('🌟 Script loaded')
