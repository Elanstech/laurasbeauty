// ============================================
// GALLERY PAGE FUNCTIONALITY - COMPLETE
// ============================================

class GalleryPage {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.resultCount = document.getElementById('resultCount');
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDesc = document.getElementById('lightboxDesc');
        this.closeLightboxBtn = document.getElementById('closeLightbox');
        this.prevBtn = document.getElementById('prevImage');
        this.nextBtn = document.getElementById('nextImage');
        this.currentImageNum = document.getElementById('currentImageNum');
        this.totalImages = document.getElementById('totalImages');
        
        this.currentImageIndex = 0;
        this.visibleImages = [];
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupLightbox();
        this.setupScrollIndicator();
        this.initAOS();
        this.updateVisibleImages();
        this.updateCounts();
        console.log('✅ Gallery page initialized');
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
            console.log('📱 AOS animations initialized');
        }
    }

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isAnimating) return;
                
                // Remove active class from all buttons
                this.filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filterValue = btn.getAttribute('data-filter');
                
                // Filter gallery items
                this.filterGallery(filterValue);
                
                console.log(`🔍 Filter applied: ${filterValue}`);
            });
        });
    }

    filterGallery(filter) {
        this.isAnimating = true;
        let visibleCount = 0;
        let delay = 0;

        // First, hide all items that don't match
        this.galleryItems.forEach((item) => {
            const category = item.getAttribute('data-category');
            
            if (filter !== 'all' && category !== filter) {
                item.classList.add('hide');
                item.classList.remove('show');
            }
        });

        // Wait a bit, then show matching items with staggered animation
        setTimeout(() => {
            this.galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    setTimeout(() => {
                        item.classList.remove('hide');
                        item.classList.add('show');
                        visibleCount++;
                        
                        // Update count after last item
                        if (index === this.galleryItems.length - 1) {
                            this.updateResultCount(visibleCount);
                        }
                    }, delay);
                    delay += 50; // Stagger by 50ms
                }
            });

            // Update visible images for lightbox
            setTimeout(() => {
                this.updateVisibleImages();
                this.isAnimating = false;
            }, delay + 100);
        }, 300);
    }

    updateResultCount(count) {
        // Count visible items if count not provided
        if (count === undefined) {
            count = Array.from(this.galleryItems).filter(
                item => !item.classList.contains('hide')
            ).length;
        }

        // Animate the count
        const current = parseInt(this.resultCount.textContent);
        this.animateCount(current, count);
    }

    animateCount(from, to) {
        const duration = 500;
        const steps = 20;
        const increment = (to - from) / steps;
        let current = from;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                this.resultCount.textContent = to;
                clearInterval(timer);
            } else {
                this.resultCount.textContent = Math.round(current);
            }
        }, duration / steps);
    }

    updateCounts() {
        // Count items in each category
        const counts = {
            all: this.galleryItems.length,
            treatments: 0,
            facility: 0,
            team: 0,
            products: 0
        };

        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (counts[category] !== undefined) {
                counts[category]++;
            }
        });

        // Update filter button counts
        this.filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const countElement = btn.querySelector('.filter-count');
            if (countElement && counts[filter] !== undefined) {
                countElement.textContent = counts[filter];
            }
        });

        // Update total images in lightbox
        if (this.totalImages) {
            this.totalImages.textContent = counts.all;
        }

        console.log('📊 Category counts updated:', counts);
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

        console.log(`👁️ ${this.visibleImages.length} visible images updated`);
    }

    setupLightbox() {
        // Open lightbox on view button click
        this.galleryItems.forEach((item) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            const itemInner = item.querySelector('.gallery-item-inner');
            
            const openLightbox = (e) => {
                e.stopPropagation();
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

        console.log('🖼️ Lightbox initialized');
    }

    openLightbox(image, title, desc) {
        this.lightboxImage.src = image;
        this.lightboxTitle.textContent = title;
        this.lightboxDesc.textContent = desc;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Find current index
        this.currentImageIndex = this.visibleImages.findIndex(img => img.image === image);
        
        // Update counter
        if (this.currentImageNum) {
            this.currentImageNum.textContent = this.currentImageIndex + 1;
        }

        console.log(`📸 Lightbox opened: ${title} (${this.currentImageIndex + 1}/${this.visibleImages.length})`);
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
        
        // Add fade transition
        this.lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            this.lightboxImage.src = currentImage.image;
            this.lightboxTitle.textContent = currentImage.title;
            this.lightboxDesc.textContent = currentImage.desc;
            
            if (this.currentImageNum) {
                this.currentImageNum.textContent = this.currentImageIndex + 1;
            }
            
            this.lightboxImage.style.opacity = '1';
        }, 200);

        console.log(`⏭️ Navigated to image ${this.currentImageIndex + 1}/${this.visibleImages.length}`);
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

        console.log('⬇️ Scroll indicator initialized');
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

console.log('🎨 Gallery script loaded');
