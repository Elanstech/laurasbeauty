/* ============================================
   SERVICE CATEGORY PAGES - MASTER SCRIPT
   Laura's Beauty Touch
   Shared JavaScript for all service category pages
   ============================================ */

// Category configuration mapping
const categoryConfig = {
    facials: {
        jsonFile: '../data/facials.json',
        title: 'Face Treatments',
        subtitle: 'Rejuvenate your skin with our luxurious facial treatments',
        description: 'Discover our range of specialized facial treatments designed to address your unique skincare needs and reveal your natural radiance.',
        badge: 'Luxury Skincare'
    },
    addons: {
        jsonFile: '../data/addons.json',
        title: 'Add-On Services',
        subtitle: 'Enhance your treatment with our premium add-ons',
        description: 'Elevate your spa experience with our carefully curated selection of treatment enhancements.',
        badge: 'Enhancement Services'
    },
    body: {
        jsonFile: '../data/body.json',
        title: 'Body Treatments',
        subtitle: 'Indulge in full-body relaxation and rejuvenation',
        description: 'Experience ultimate relaxation with our luxurious body treatments designed to revitalize your entire being.',
        badge: 'Full Body Wellness'
    },
    specials: {
        jsonFile: '../data/specials.json',
        title: 'Spa Specials',
        subtitle: 'Refresh, rejuvenate, and reveal your natural beauty',
        description: 'Indulge in our seasonal spa specials designed to relax your body, renew your skin, and elevate your well-being. Enjoy exclusive treatments and luxurious experiences tailored just for you.',
        badge: 'Limited-Time Offers'
    },
    nails: {
        jsonFile: '../data/nails.json',
        title: 'Nail Services',
        subtitle: 'Perfect manicures and pedicures for beautiful hands and feet',
        description: 'Pamper yourself with our professional nail care services and stunning nail art.',
        badge: 'Nail Artistry'
    },
    packages: {
        jsonFile: '../data/packages.json',
        title: 'Spa Packages',
        subtitle: 'Complete wellness experiences combining multiple treatments',
        description: 'Immerse yourself in our curated spa packages designed for ultimate relaxation and transformation.',
        badge: 'Complete Packages'
    },
    laser: {
        jsonFile: '../data/laser.json',
        title: 'Laser Treatments',
        subtitle: 'Advanced laser technology for skin perfection',
        description: 'Experience cutting-edge laser treatments for hair removal, skin rejuvenation, and more.',
        badge: 'Advanced Technology'
    },
    wax: {
        jsonFile: '../data/wax.json',
        title: 'Waxing Services',
        subtitle: 'Smooth, hair-free skin with our expert waxing treatments',
        description: 'Professional waxing services using premium products for long-lasting smoothness.',
        badge: 'Smooth Skin'
    },
    pmu: {
        jsonFile: '../data/pmu.json',
        title: 'Permanent Makeup',
        subtitle: 'Wake up beautiful with semi-permanent cosmetic enhancements',
        description: 'Enhance your natural beauty with our expertly applied permanent makeup solutions.',
        badge: 'Beauty Enhancement'
    },
    lashes: {
        jsonFile: '../data/lashes.json',
        title: 'Lash Services',
        subtitle: 'Dramatic, beautiful lashes that enhance your eyes',
        description: 'Transform your look with our professional lash extensions and enhancement services.',
        badge: 'Lash Enhancement'
    },
    makeup: {
        jsonFile: '../data/makeup.json',
        title: 'Makeup Services',
        subtitle: 'Professional makeup artistry for any occasion',
        description: 'Look your best with our expert makeup application services for all occasions.',
        badge: 'Professional Artistry'
    }
};

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', function() {
    const category = document.body.getAttribute('data-category');
    
    if (category && categoryConfig[category]) {
        initializePage(category);
    } else {
        console.error('Invalid category or category not found');
        showError('Unable to load category information');
    }
    
    initializeHeader();
    initializeMobileMenu();
    initializeBackToTop();
    initializeModal();
});

/**
 * Initialize the page with category data
 */
function initializePage(category) {
    const config = categoryConfig[category];
    updateHeroSection(config);
    loadServices(config.jsonFile);
}

/**
 * Update hero section with category information
 */
function updateHeroSection(config) {
    const categoryBadge = document.getElementById('categoryBadge');
    const categoryTitle = document.getElementById('categoryTitle');
    const categorySubtitle = document.getElementById('categorySubtitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    if (categoryBadge) categoryBadge.textContent = config.badge;
    if (categoryTitle) categoryTitle.textContent = config.title;
    if (categorySubtitle) categorySubtitle.textContent = config.subtitle;
    if (categoryDescription) categoryDescription.textContent = config.description;
}

/**
 * Load services from JSON file
 */
async function loadServices(jsonFile) {
    const loadingState = document.getElementById('loadingState');
    const servicesList = document.getElementById('servicesList');
    const noServicesMessage = document.getElementById('noServices');
    
    try {
        if (loadingState) loadingState.style.display = 'flex';
        if (servicesList) servicesList.style.display = 'none';
        if (noServicesMessage) noServicesMessage.style.display = 'none';
        
        const response = await fetch(jsonFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (loadingState) loadingState.style.display = 'none';
        
        if (!data.services || data.services.length === 0) {
            if (noServicesMessage) noServicesMessage.style.display = 'block';
            return;
        }
        
        renderServices(data.services);
        
    } catch (error) {
        console.error('Error loading services:', error);
        if (loadingState) loadingState.style.display = 'none';
        showError('Unable to load services. Please try again later.');
    }
}

/**
 * Render services to the list
 */
function renderServices(services) {
    const servicesList = document.getElementById('servicesList');
    
    if (!servicesList) return;
    
    servicesList.innerHTML = '';
    servicesList.style.display = 'flex';
    
    services.forEach((service, index) => {
        const serviceItem = createServiceItem(service, index);
        servicesList.appendChild(serviceItem);
    });
}

/**
 * Build the price HTML for a service (used in cards and modal)
 */
function buildPriceHTML(service) {
    let html = '';
    if (service.regularPrice && service.price) {
        html += `<span class="price-original">${service.regularPrice}</span> <span class="price-sale">${service.price}</span>`;
    } else if (service.price) {
        html += `<span>${service.price}</span>`;
    }
    if (service.priceLabel) {
        html += ` <span class="price-save-badge">${service.priceLabel}</span>`;
    }
    return html;
}

/**
 * Create a service item element
 */
function createServiceItem(service, index) {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    // Image Wrapper
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'service-image-wrapper';
    
    const image = document.createElement('div');
    image.className = 'service-image';
    image.style.backgroundImage = service.image
        ? `url('${service.image}')`
        : `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800')`;
    
    const imageOverlay = document.createElement('div');
    imageOverlay.className = 'service-image-overlay';
    
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageOverlay);
    
    if (service.badge) {
        const badge = document.createElement('div');
        badge.className = 'service-badge';
        badge.textContent = service.badge;
        imageWrapper.appendChild(badge);
    }
    
    item.appendChild(imageWrapper);
    
    // Service Content
    const content = document.createElement('div');
    content.className = 'service-content';
    
    // Header
    const header = document.createElement('div');
    header.className = 'service-header';
    
    const name = document.createElement('h3');
    name.className = 'service-name';
    name.textContent = service.name;
    header.appendChild(name);
    
    // Meta Information
    if (service.duration || service.price || service.priceLabel) {
        const meta = document.createElement('div');
        meta.className = 'service-meta';
        
        if (service.duration) {
            const durationItem = document.createElement('div');
            durationItem.className = 'service-meta-item';
            durationItem.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${service.duration}</span>
            `;
            meta.appendChild(durationItem);
        }
        
        if ((service.duration && service.price) || (service.duration && service.priceLabel)) {
            const divider = document.createElement('div');
            divider.className = 'meta-divider';
            meta.appendChild(divider);
        }
        
        if (service.price || service.priceLabel) {
            const priceItem = document.createElement('div');
            priceItem.className = 'service-meta-item';
            priceItem.innerHTML = `<i class="fas fa-tag"></i> ${buildPriceHTML(service)}`;
            meta.appendChild(priceItem);
        }
        
        header.appendChild(meta);
    }
    
    content.appendChild(header);
    
    // Description
    if (service.description) {
        const description = document.createElement('p');
        description.className = 'service-description';
        description.textContent = service.description;
        content.appendChild(description);
    }
    
    // Footer with buttons
    const footer = document.createElement('div');
    footer.className = 'service-footer';
    
    const bookButton = document.createElement('a');
    bookButton.href = service.bookNowUrl || '../htmls/contact.html';
    bookButton.className = 'service-book-button';
    if (service.bookNowUrl) {
        bookButton.target = '_blank';
        bookButton.rel = 'noopener noreferrer';
    }
    bookButton.innerHTML = `
        <span>Book Now</span>
        <i class="fas fa-calendar-check"></i>
    `;
    footer.appendChild(bookButton);
    
    const detailsButton = document.createElement('button');
    detailsButton.className = 'service-details-button';
    detailsButton.innerHTML = `
        <span>View Details</span>
        <i class="fas fa-arrow-right"></i>
    `;
    detailsButton.addEventListener('click', function() {
        openModal(service);
    });
    footer.appendChild(detailsButton);
    
    content.appendChild(footer);
    item.appendChild(content);
    
    return item;
}

/**
 * Open service detail modal
 */
function openModal(service) {
    const modal = document.getElementById('serviceModal');
    const modalImage = document.getElementById('modalImage');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalDuration = document.getElementById('modalDuration');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalFullDescription = document.getElementById('modalFullDescription');
    const modalFullDescriptionWrapper = document.getElementById('modalFullDescriptionWrapper');
    const modalBenefitsList = document.getElementById('modalBenefitsList');
    const modalBenefitsWrapper = document.getElementById('modalBenefitsWrapper');
    
    // Update modal book button with bookNowUrl
    const modalBookButton = document.querySelector('.modal-book-button');
    if (modalBookButton && service.bookNowUrl) {
        modalBookButton.href = service.bookNowUrl;
        modalBookButton.target = '_blank';
        modalBookButton.rel = 'noopener noreferrer';
    } else if (modalBookButton) {
        modalBookButton.href = '../htmls/contact.html';
        modalBookButton.removeAttribute('target');
        modalBookButton.removeAttribute('rel');
    }
    
    if (!modal) return;
    
    // Set image
    if (modalImage && service.image) {
        modalImage.style.backgroundImage = `url('${service.image}')`;
    } else if (modalImage) {
        modalImage.style.backgroundImage = `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800')`;
    }
    
    // Set badge
    if (modalBadge && service.badge) {
        modalBadge.textContent = service.badge;
        modalBadge.style.display = 'block';
    } else if (modalBadge) {
        modalBadge.style.display = 'none';
    }
    
    // Set title
    if (modalTitle) {
        modalTitle.textContent = service.name;
    }
    
    // Set duration
    if (modalDuration && service.duration) {
        modalDuration.textContent = service.duration;
    }
    
    // Set price (original + sale + save badge)
    if (modalPrice && (service.price || service.priceLabel)) {
        modalPrice.innerHTML = buildPriceHTML(service);
    }
    
    // Set description
    if (modalDescription && service.description) {
        modalDescription.textContent = service.description;
    }
    
    // Set full description
    if (modalFullDescription && service.fullDescription) {
        modalFullDescription.textContent = service.fullDescription;
        if (modalFullDescriptionWrapper) {
            modalFullDescriptionWrapper.style.display = 'block';
        }
    } else if (modalFullDescriptionWrapper) {
        modalFullDescriptionWrapper.style.display = 'none';
    }
    
    // Set benefits
    if (modalBenefitsList && service.benefits && service.benefits.length > 0) {
        modalBenefitsList.innerHTML = '';
        service.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            modalBenefitsList.appendChild(li);
        });
        if (modalBenefitsWrapper) {
            modalBenefitsWrapper.style.display = 'block';
        }
    } else if (modalBenefitsWrapper) {
        modalBenefitsWrapper.style.display = 'none';
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Initialize modal event handlers
 */
function initializeModal() {
    const modal = document.getElementById('serviceModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Show error message
 */
function showError(message) {
    const servicesList = document.getElementById('servicesList');
    const noServicesMessage = document.getElementById('noServices');
    
    if (noServicesMessage) {
        noServicesMessage.style.display = 'block';
        const messageText = noServicesMessage.querySelector('p');
        if (messageText) {
            messageText.textContent = message;
        }
    }
    
    if (servicesList) {
        servicesList.style.display = 'none';
    }
}

/**
 * Initialize header functionality
 */
function initializeHeader() {
    const header = document.querySelector('.premium-header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    const megaMenuItems = document.querySelectorAll('.has-megamenu');
    megaMenuItems.forEach(item => {
        let timeout;
        item.addEventListener('mouseenter', function() {
            clearTimeout(timeout);
            this.classList.add('active');
        });
        item.addEventListener('mouseleave', function() {
            timeout = setTimeout(() => {
                this.classList.remove('active');
            }, 200);
        });
    });
}

/**
 * Initialize mobile menu
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.querySelector('.premium-header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

/**
 * Smooth scroll for hero scroll indicator
 */
function initHeroScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const targetSection = document.querySelector('#services-section');
            if (targetSection) {
                const headerHeight = document.querySelector('.premium-header')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }
}

initHeroScrollIndicator();
