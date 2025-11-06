/* ================================================
   GALLERY.JS - Laura's Beauty Touch
   Interactive gallery with filtering and lightbox
   ================================================ */

(function() {
    'use strict';

    // ================================================
    // GLOBAL VARIABLES
    // ================================================
    let currentImageIndex = 0;
    let allImages = [];
    let visibleImages = [];

    // ================================================
    // DOM ELEMENTS
    // ================================================
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Lightbox elements
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');

    // ================================================
    // INITIALIZATION
    // ================================================
    function init() {
        // Build image array for lightbox navigation
        buildImageArray();
        
        // Setup event listeners
        setupFilterListeners();
        setupLightboxListeners();
        setupViewButtonListeners();
        setupKeyboardNavigation();
        
        // Animate gallery items on load
        animateGalleryItems();
        
        console.log('Gallery initialized successfully');
    }

    // ================================================
    // BUILD IMAGE ARRAY
    // ================================================
    function buildImageArray() {
        allImages = [];
        
        viewButtons.forEach(button => {
            const imageData = {
                src: button.getAttribute('data-image'),
                title: button.getAttribute('data-title'),
                description: button.getAttribute('data-description'),
                element: button.closest('.gallery-item')
            };
            allImages.push(imageData);
        });
        
        visibleImages = [...allImages];
    }

    // ================================================
    // ANIMATE GALLERY ITEMS ON LOAD
    // ================================================
    function animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                requestAnimationFrame(() => {
                    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }, index * 80);
        });
    }

    // ================================================
    // FILTER FUNCTIONALITY
    // ================================================
    function setupFilterListeners() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                filterGallery(filter);
            });
        });
    }

    function filterGallery(category) {
        visibleImages = [];
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                // Show item
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
                
                // Add to visible images array
                if (allImages[index]) {
                    visibleImages.push(allImages[index]);
                }
            } else {
                // Hide item
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
        
        console.log(`Filtered to: ${category}, Visible images: ${visibleImages.length}`);
    }

    // ================================================
    // VIEW BUTTON LISTENERS
    // ================================================
    function setupViewButtonListeners() {
        viewButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the index in visible images
                const imageSrc = this.getAttribute('data-image');
                const imageIndex = visibleImages.findIndex(img => img.src === imageSrc);
                
                if (imageIndex !== -1) {
                    openLightbox(imageIndex);
                } else {
                    // Fallback to all images if not in visible
                    const allImageIndex = allImages.findIndex(img => img.src === imageSrc);
                    openLightbox(allImageIndex, true);
                }
            });
        });
    }

    // ================================================
    // LIGHTBOX FUNCTIONALITY
    // ================================================
    function setupLightboxListeners() {
        // Close lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
        
        // Navigation
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxNext.addEventListener('click', showNextImage);
        
        // Prevent closing when clicking on image or caption
        lightboxImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        document.querySelector('.lightbox-caption').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    function openLightbox(index, useAllImages = false) {
        const imageArray = useAllImages ? allImages : visibleImages;
        
        if (index < 0 || index >= imageArray.length) return;
        
        currentImageIndex = index;
        const imageData = imageArray[index];
        
        // Set image and content
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.title;
        lightboxTitle.textContent = imageData.title;
        lightboxDescription.textContent = imageData.description;
        
        // Show lightbox with animation
        lightboxModal.style.display = 'flex';
        requestAnimationFrame(() => {
            lightboxModal.classList.add('active');
        });
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Update navigation button visibility
        updateNavigationButtons(imageArray);
        
        console.log(`Opened lightbox: ${imageData.title} (${index + 1}/${imageArray.length})`);
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        
        setTimeout(() => {
            lightboxModal.style.display = 'none';
            // Re-enable body scroll
            document.body.style.overflow = '';
        }, 300);
        
        console.log('Closed lightbox');
    }

    function showPreviousImage() {
        const imageArray = visibleImages.length > 0 ? visibleImages : allImages;
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        updateLightboxImage(imageArray);
    }

    function showNextImage() {
        const imageArray = visibleImages.length > 0 ? visibleImages : allImages;
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        updateLightboxImage(imageArray);
    }

    function updateLightboxImage(imageArray) {
        const imageData = imageArray[currentImageIndex];
        
        // Fade out effect
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.title;
            lightboxTitle.textContent = imageData.title;
            lightboxDescription.textContent = imageData.description;
            
            // Fade in effect
            lightboxImage.style.opacity = '1';
        }, 200);
        
        updateNavigationButtons(imageArray);
        
        console.log(`Navigated to: ${imageData.title} (${currentImageIndex + 1}/${imageArray.length})`);
    }

    function updateNavigationButtons(imageArray) {
        // Show/hide navigation buttons based on array length
        if (imageArray.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    // ================================================
    // KEYBOARD NAVIGATION
    // ================================================
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (!lightboxModal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
    }

    // ================================================
    // SMOOTH SCROLL UTILITY
    // ================================================
    function smoothScrollTo(element) {
        if (!element) return;
        
        const offset = 80; // Account for header height
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // ================================================
    // INTERSECTION OBSERVER (Lazy Load Animation)
    // ================================================
    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe gallery items
        galleryItems.forEach(item => {
            observer.observe(item);
        });
    }

    // ================================================
    // TOUCH SWIPE SUPPORT (Mobile)
    // ================================================
    let touchStartX = 0;
    let touchEndX = 0;
    
    function setupTouchSupport() {
        const lightboxContainer = document.querySelector('.lightbox-container');
        
        lightboxContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightboxContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            showNextImage();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            showPreviousImage();
        }
    }

    // ================================================
    // PERFORMANCE OPTIMIZATION
    // ================================================
    
    // Debounce function for resize events
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
    
    // Handle window resize
    const handleResize = debounce(function() {
        // Recalculate any responsive elements if needed
        console.log('Window resized');
    }, 250);
    
    window.addEventListener('resize', handleResize);

    // ================================================
    // IMAGE PRELOADING
    // ================================================
    function preloadImages() {
        allImages.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
        });
        console.log('Preloading gallery images...');
    }

    // ================================================
    // ERROR HANDLING
    // ================================================
    
    // Handle image loading errors
    document.querySelectorAll('.gallery-image-wrapper img').forEach(img => {
        img.addEventListener('error', function() {
            console.error(`Failed to load image: ${this.src}`);
            this.style.opacity = '0.5';
            this.alt = 'Image failed to load';
        });
    });
    
    lightboxImage.addEventListener('error', function() {
        console.error(`Failed to load lightbox image: ${this.src}`);
        lightboxDescription.textContent = 'Image failed to load. Please try again.';
    });

    // ================================================
    // ANALYTICS TRACKING (Optional)
    // ================================================
    function trackGalleryInteraction(action, label) {
        // Add your analytics tracking here
        console.log(`Gallery interaction: ${action} - ${label}`);
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', action, {
        //         'event_category': 'Gallery',
        //         'event_label': label
        //     });
        // }
    }

    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    function setupAccessibility() {
        // Add ARIA labels to dynamic elements
        lightboxPrev.setAttribute('aria-label', 'Previous image');
        lightboxNext.setAttribute('aria-label', 'Next image');
        lightboxClose.setAttribute('aria-label', 'Close gallery');
        
        // Trap focus within lightbox when open
        lightboxModal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && lightboxModal.classList.contains('active')) {
                const focusableElements = lightboxModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ================================================
    // DOCUMENT READY
    // ================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            setupTouchSupport();
            setupAccessibility();
            preloadImages();
        });
    } else {
        init();
        setupTouchSupport();
        setupAccessibility();
        preloadImages();
    }

    // ================================================
    // EXPOSE PUBLIC API (Optional)
    // ================================================
    window.GalleryAPI = {
        openImage: function(index) {
            openLightbox(index);
        },
        closeGallery: function() {
            closeLightbox();
        },
        filterBy: function(category) {
            filterGallery(category);
        }
    };

})();

/* ================================================
   END OF GALLERY.JS
   ================================================ */
