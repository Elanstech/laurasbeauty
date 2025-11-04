// ============================================
// GALLERY PAGE FUNCTIONALITY
// ============================================

class GalleryPage {
    constructor() {
        this.galleryGrid = document.getElementById('galleryGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.viewButtons = document.querySelectorAll('.gallery-view-btn');
        
        // Lightbox elements
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDescription = document.getElementById('lightboxDescription');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        this.currentImageNumber = document.getElementById('currentImageNumber');
        this.totalImages = document.getElementById('totalImages');
        
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.visibleImages = [];
        
        this.init();
    }
    
    init() {
        if (!this.galleryGrid) return;
        
        this.setupFilters();
        this.setupLightbox();
        this.updateVisibleImages();
        
        console.log('✨ Gallery initialized');
    }
    
    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
                
                // Update active state
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                console.log(`🔍 Filter applied: ${filter}`);
            });
        });
    }
    
    filterGallery(filter) {
        this.currentFilter = filter;
        
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.display = 'block';
                }, 10);
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    if (item.classList.contains('hidden')) {
                        item.style.display = 'none';
                    }
                }, 500);
            }
        });
        
        this.updateVisibleImages();
    }
    
    setupLightbox() {
        // Setup view buttons
        this.viewButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const image = button.getAttribute('data-image');
                const title = button.getAttribute('data-title');
                const description = button.getAttribute('data-description');
                
                this.openLightbox(image, title, description, index);
            });
        });
        
        // Close button
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        // Overlay click
        const overlay = this.lightbox?.querySelector('.lightbox-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeLightbox());
        }
        
        // Navigation buttons
        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', () => this.navigateImage(-1));
        }
        
        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', () => this.navigateImage(1));
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox?.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateImage(1);
            }
        });
        
        // Prevent body scroll when lightbox is open
        if (this.lightbox) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (this.lightbox.classList.contains('active')) {
                            document.body.style.overflow = 'hidden';
                        } else {
                            document.body.style.overflow = '';
                        }
                    }
                });
            });
            
            observer.observe(this.lightbox, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    updateVisibleImages() {
        this.visibleImages = Array.from(this.galleryItems).filter(item => {
            return !item.classList.contains('hidden');
        });
        
        if (this.totalImages) {
            this.totalImages.textContent = this.visibleImages.length;
        }
    }
    
    openLightbox(image, title, description, index) {
        if (!this.lightbox) return;
        
        this.currentImageIndex = index;
        
        this.lightboxImage.src = image;
        this.lightboxImage.alt = title;
        this.lightboxTitle.textContent = title;
        this.lightboxDescription.textContent = description;
        
        if (this.currentImageNumber) {
            this.currentImageNumber.textContent = index + 1;
        }
        
        this.lightbox.classList.add('active');
        
        console.log(`🖼️ Lightbox opened: ${title}`);
    }
    
    closeLightbox() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.remove('active');
        
        console.log('❌ Lightbox closed');
    }
    
    navigateImage(direction) {
        const newIndex = this.currentImageIndex + direction;
        
        if (newIndex < 0 || newIndex >= this.viewButtons.length) {
            return;
        }
        
        this.currentImageIndex = newIndex;
        
        const button = this.viewButtons[newIndex];
        const image = button.getAttribute('data-image');
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        
        this.lightboxImage.src = image;
        this.lightboxImage.alt = title;
        this.lightboxTitle.textContent = title;
        this.lightboxDescription.textContent = description;
        
        if (this.currentImageNumber) {
            this.currentImageNumber.textContent = newIndex + 1;
        }
        
        // Add slide animation
        this.lightboxImage.style.opacity = '0';
        setTimeout(() => {
            this.lightboxImage.style.opacity = '1';
        }, 100);
    }
}

// Initialize Gallery when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('galleryGrid')) {
            new GalleryPage();
        }
    });
} else {
    if (document.getElementById('galleryGrid')) {
        new GalleryPage();
    }
}

// Export for potential use elsewhere
window.GalleryPage = GalleryPage;
