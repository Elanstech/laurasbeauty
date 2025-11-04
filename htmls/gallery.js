// ============================================
// GALLERY PAGE FUNCTIONALITY
// ============================================

class GalleryPage {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDesc = document.getElementById('lightboxDesc');
        this.closeLightboxBtn = document.getElementById('closeLightbox');
        this.prevBtn = document.getElementById('prevImage');
        this.nextBtn = document.getElementById('nextImage');
        
        this.currentImageIndex = 0;
        this.visibleImages = [];
        
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupLightbox();
        this.setupScrollIndicator();
        this.initAOS();
        this.updateVisibleImages();
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
    }

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filterValue = btn.getAttribute('data-filter');
                
                // Filter gallery items
                this.filterGallery(filterValue);
            });
        });
    }

    filterGallery(filter) {
        this.galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                // Show item with animation delay
                setTimeout(() => {
                    item.classList.remove('hide');
                }, index * 50);
            } else {
                // Hide item
                item.classList.add('hide');
            }
        });

        // Update visible images for lightbox navigation
        setTimeout(() => {
            this.updateVisibleImages();
        }, 500);
    }

    updateVisibleImages() {
        this.visibleImages = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hide'))
            .map(item => {
                const btn = item.querySelector('.gallery-view-btn');
                return {
                    image: btn.getAttribute('data-image'),
                    title: btn.getAttribute('data-title'),
                    desc: btn.getAttribute('data-desc')
                };
            });
    }

    setupLightbox() {
        // Open lightbox on view button click
        this.galleryItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            const itemInner = item.querySelector('.gallery-item-inner');
            
            const openLightbox = () => {
                const image = viewBtn.getAttribute('data-image');
                const title = viewBtn.getAttribute('data-title');
                const desc = viewBtn.getAttribute('data-desc');
                
                this.openLightbox(image, title, desc);
            };

            viewBtn.addEventListener('click', openLightbox);
            itemInner.addEventListener('click', openLightbox);
        });

        // Close lightbox
        this.closeLightboxBtn.addEventListener('click', () => this.closeLightbox());
        
        // Close on overlay click
        const overlay = this.lightbox.querySelector('.lightbox-overlay');
        overlay.addEventListener('click', () => this.closeLightbox());

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });

        // Navigation
        this.prevBtn.addEventListener('click', () => this.navigateImage('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateImage('next'));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') this.navigateImage('prev');
                if (e.key === 'ArrowRight') this.navigateImage('next');
            }
        });
    }

    openLightbox(image, title, desc) {
        this.lightboxImage.src = image;
        this.lightboxTitle.textContent = title;
        this.lightboxDesc.textContent = desc;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Find current index
        this.currentImageIndex = this.visibleImages.findIndex(img => img.image === image);

        console.log('🖼️ Lightbox opened:', title);
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.lightboxImage.src = '';
        }, 300);

        console.log('❌ Lightbox closed');
    }

    navigateImage(direction) {
        if (direction === 'next') {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.visibleImages.length;
        } else {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.visibleImages.length) % this.visibleImages.length;
        }

        const currentImage = this.visibleImages[this.currentImageIndex];
        this.lightboxImage.src = currentImage.image;
        this.lightboxTitle.textContent = currentImage.title;
        this.lightboxDesc.textContent = currentImage.desc;
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        scrollIndicator.addEventListener('click', () => {
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Hide on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GalleryPage();
    });
} else {
    new GalleryPage();
}

console.log('✅ Gallery page initialized');
