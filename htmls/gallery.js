/* ============================================
   GALLERY PAGE JAVASCRIPT
   Laura's Beauty Touch - Interactive Gallery
   ============================================ */

// ============================================
// WAIT FOR DOM TO LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all gallery features
    initializeGalleryFilters();
    initializeLightbox();
    initializeScrollAnimations();
    initializeHeroScroll();
    
    console.log('Gallery page loaded successfully!');
});

// ============================================
// GALLERY FILTER FUNCTIONALITY
// ============================================
function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    if (!filterButtons.length || !galleryCards.length) {
        console.log('Filter elements not found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery cards with smooth animation
            filterGalleryCards(galleryCards, filterValue);
        });
    });
}

function filterGalleryCards(cards, filter) {
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        // Add hide animation
        card.classList.add('hide');
        
        // Wait for hide animation, then show/hide based on filter
        setTimeout(() => {
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.classList.remove('hide');
                card.classList.add('show');
                
                // Stagger the show animation
                setTimeout(() => {
                    card.classList.remove('show');
                }, 500);
            } else {
                card.style.display = 'none';
                card.classList.remove('hide');
            }
        }, 300);
    });
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
function initializeLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (!lightboxModal) {
        console.log('Lightbox modal not found');
        return;
    }
    
    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, title, description) {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    
    if (!lightboxModal || !lightboxImage || !lightboxTitle || !lightboxDesc) {
        console.log('Lightbox elements not found');
        return;
    }
    
    // Set content
    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = description;
    
    // Show lightbox
    lightboxModal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (!lightboxModal) {
        return;
    }
    
    // Hide lightbox
    lightboxModal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear image after animation completes
    setTimeout(() => {
        const lightboxImage = document.getElementById('lightboxImage');
        if (lightboxImage) {
            lightboxImage.src = '';
        }
    }, 400);
}

// Make functions globally available for onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe gallery cards
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe filter section
    const filterSection = document.querySelector('.gallery-filter-section');
    if (filterSection) {
        observer.observe(filterSection);
    }
}

// ============================================
// HERO SCROLL INDICATOR
// ============================================
function initializeHeroScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    const gallerySection = document.querySelector('.gallery-filter-section');
    
    if (scrollIndicator && gallerySection) {
        scrollIndicator.addEventListener('click', function() {
            gallerySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL FOR ALL INTERNAL LINKS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION - LAZY LOADING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add fade-in effect when image loads
                    img.addEventListener('load', function() {
                        img.style.opacity = '1';
                    });
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            imageObserver.observe(img);
        });
    }
});

// ============================================
// RESPONSIVE IMAGE QUALITY
// ============================================
function optimizeImageQuality() {
    const images = document.querySelectorAll('.gallery-card-inner img');
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    if (devicePixelRatio > 1) {
        images.forEach(img => {
            img.style.imageRendering = 'crisp-edges';
        });
    }
}

// Call on load and resize
window.addEventListener('load', optimizeImageQuality);
window.addEventListener('resize', debounce(optimizeImageQuality, 250));

// ============================================
// UTILITY: DEBOUNCE FUNCTION
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// GALLERY STATISTICS (OPTIONAL)
// ============================================
function updateGalleryStats() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const categories = {};
    
    galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('Gallery Statistics:', {
        totalImages: galleryCards.length,
        categories: categories
    });
}

// Call on load
window.addEventListener('load', updateGalleryStats);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
function enhanceAccessibility() {
    // Add keyboard navigation for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' && filterButtons[index + 1]) {
                filterButtons[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && filterButtons[index - 1]) {
                filterButtons[index - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Add keyboard navigation for gallery cards
    const galleryCards = document.querySelectorAll('.gallery-view-btn');
    
    galleryCards.forEach(btn => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// ============================================
// TOUCH GESTURES FOR MOBILE
// ============================================
function initializeTouchGestures() {
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (!lightboxModal) {
        return;
    }
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    lightboxModal.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    lightboxModal.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        const swipeDistance = touchEndY - touchStartY;
        
        // Swipe down to close (minimum 100px swipe)
        if (swipeDistance > 100) {
            closeLightbox();
        }
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', initializeTouchGestures);

// ============================================
// PRELOAD IMAGES FOR BETTER PERFORMANCE
// ============================================
function preloadImages() {
    const images = document.querySelectorAll('.gallery-card-inner img');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImage = new Image();
            preloadImage.src = src;
        }
    });
}

// Preload images after page load
window.addEventListener('load', function() {
    setTimeout(preloadImages, 1000);
});

// ============================================
// DYNAMIC GRID LAYOUT ADJUSTMENT
// ============================================
function adjustGridLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const cards = document.querySelectorAll('.gallery-card');
    
    if (!galleryGrid || !cards.length) {
        return;
    }
    
    const windowWidth = window.innerWidth;
    
    // Adjust grid columns based on screen size
    if (windowWidth >= 1920) {
        galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(450px, 1fr))';
    } else if (windowWidth >= 1024) {
        galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(380px, 1fr))';
    } else if (windowWidth >= 768) {
        galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    } else {
        galleryGrid.style.gridTemplateColumns = '1fr';
    }
}

// Call on load and resize
window.addEventListener('load', adjustGridLayout);
window.addEventListener('resize', debounce(adjustGridLayout, 250));

// ============================================
// ERROR HANDLING FOR IMAGES
// ============================================
function handleImageErrors() {
    const images = document.querySelectorAll('.gallery-card-inner img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', img.src);
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #A9C89C 0%, #3B4A2F 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: 'Lato', sans-serif;
                font-size: 1.2rem;
                text-align: center;
                padding: 20px;
            `;
            placeholder.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; opacity: 0.5;"></i>';
            
            // Replace image with placeholder
            img.parentElement.replaceChild(placeholder, img);
        });
    });
}

// Call on load
window.addEventListener('load', handleImageErrors);

// ============================================
// CONSOLE LOGGING (FOR DEBUGGING)
// ============================================
console.log('%c🌿 Laura\'s Beauty Touch Gallery', 'color: #A9C89C; font-size: 20px; font-weight: bold;');
console.log('%cGallery page loaded successfully!', 'color: #3B4A2F; font-size: 14px;');
console.log('%cAll features initialized:', 'color: #B6A98C; font-size: 12px;');
console.log('✓ Filter functionality');
console.log('✓ Lightbox modal');
console.log('✓ Scroll animations');
console.log('✓ Responsive layout');
console.log('✓ Touch gestures');
console.log('✓ Accessibility features');

// ============================================
// EXPORT FUNCTIONS (IF NEEDED FOR TESTING)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openLightbox,
        closeLightbox,
        filterGalleryCards
    };
}
