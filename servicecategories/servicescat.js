/* ===================================
   SERVICE CATEGORY PAGE SCRIPT
   Laura's Beauty Touch
   =================================== */

// Category configuration mapping
const categoryConfig = {
    facials: {
        jsonFile: 'data/facials.json',
        title: 'Face Treatments',
        subtitle: 'Rejuvenate your skin with our luxurious facial treatments',
        description: 'Discover our range of specialized facial treatments designed to address your unique skincare needs.'
    },
    addons: {
        jsonFile: 'data/addons.json',
        title: 'Add-Ons',
        subtitle: 'Enhance your treatment with our premium add-on services',
        description: 'Elevate your spa experience with our carefully curated selection of treatment enhancements.'
    },
    body: {
        jsonFile: 'data/body.json',
        title: 'Body Treatments',
        subtitle: 'Indulge in full-body relaxation and rejuvenation',
        description: 'Experience ultimate relaxation with our luxurious body treatments designed to revitalize your entire being.'
    },
    specials: {
        jsonFile: 'data/specials.json',
        title: 'Special Offers',
        subtitle: 'Exclusive deals on our premium treatments',
        description: 'Take advantage of our limited-time special offers and seasonal packages.'
    },
    nails: {
        jsonFile: 'data/nails.json',
        title: 'Nail Services',
        subtitle: 'Perfect manicures and pedicures for beautiful hands and feet',
        description: 'Pamper yourself with our professional nail care services and stunning nail art.'
    },
    packages: {
        jsonFile: 'data/packages.json',
        title: 'Spa Packages',
        subtitle: 'Complete wellness experiences combining multiple treatments',
        description: 'Immerse yourself in our curated spa packages designed for ultimate relaxation and transformation.'
    },
    laser: {
        jsonFile: 'data/laser.json',
        title: 'Laser Treatments',
        subtitle: 'Advanced laser technology for skin perfection',
        description: 'Experience cutting-edge laser treatments for hair removal, skin rejuvenation, and more.'
    },
    wax: {
        jsonFile: 'data/wax.json',
        title: 'Waxing Services',
        subtitle: 'Smooth, hair-free skin with our expert waxing treatments',
        description: 'Professional waxing services using premium products for long-lasting smoothness.'
    },
    pmu: {
        jsonFile: 'data/pmu.json',
        title: 'Permanent Makeup',
        subtitle: 'Wake up beautiful with semi-permanent cosmetic enhancements',
        description: 'Enhance your natural beauty with our expertly applied permanent makeup solutions.'
    },
    lashes: {
        jsonFile: 'data/lashes.json',
        title: 'Lash Services',
        subtitle: 'Dramatic, beautiful lashes that enhance your eyes',
        description: 'Transform your look with our professional lash extensions and enhancement services.'
    },
    makeup: {
        jsonFile: 'data/makeup.json',
        title: 'Makeup Services',
        subtitle: 'Professional makeup artistry for any occasion',
        description: 'Look your best with our expert makeup application services for all occasions.'
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCategoryPage();
    initScrollAnimations();
    initBackToTop();
});

/**
 * Initialize the category page
 */
function initCategoryPage() {
    const categoryKey = document.body.getAttribute('data-category');
    
    if (!categoryKey || !categoryConfig[categoryKey]) {
        console.error('Invalid category key:', categoryKey);
        showError('Invalid category');
        return;
    }
    
    const config = categoryConfig[categoryKey];
    
    // Update page content
    updatePageContent(config);
    
    // Load services data
    loadServices(config.jsonFile);
}

/**
 * Update page content with category information
 */
function updatePageContent(config) {
    // Update title and subtitle
    const titleElement = document.getElementById('categoryTitle');
    const subtitleElement = document.getElementById('categorySubtitle');
    const breadcrumbElement = document.getElementById('breadcrumbCurrent');
    const descriptionElement = document.getElementById('sectionDescription');
    
    if (titleElement) titleElement.textContent = config.title;
    if (subtitleElement) subtitleElement.textContent = config.subtitle;
    if (breadcrumbElement) breadcrumbElement.textContent = config.title;
    if (descriptionElement) descriptionElement.textContent = config.description;
    
    // Update page title
    document.title = `${config.title} - Laura's Beauty Touch`;
}

/**
 * Load services from JSON file
 */
async function loadServices(jsonFile) {
    const loadingState = document.getElementById('loadingState');
    const servicesGrid = document.getElementById('servicesGrid');
    const noServicesMessage = document.getElementById('noServices');
    
    try {
        // Show loading state
        if (loadingState) loadingState.style.display = 'block';
        if (servicesGrid) servicesGrid.style.display = 'none';
        if (noServicesMessage) noServicesMessage.style.display = 'none';
        
        // Fetch JSON data
        const response = await fetch(jsonFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide loading state
        if (loadingState) loadingState.style.display = 'none';
        
        // Check if services exist
        if (!data.services || data.services.length === 0) {
            if (noServicesMessage) noServicesMessage.style.display = 'block';
            return;
        }
        
        // Render services
        renderServices(data.services);
        
    } catch (error) {
        console.error('Error loading services:', error);
        showError('Unable to load services. Please try again later.');
    }
}

/**
 * Render services to the grid
 */
function renderServices(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (!servicesGrid) return;
    
    // Clear existing content
    servicesGrid.innerHTML = '';
    servicesGrid.style.display = 'grid';
    
    // Create service cards
    services.forEach((service, index) => {
        const card = createServiceCard(service, index);
        servicesGrid.appendChild(card);
    });
}

/**
 * Create a service card element
 */
function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Service image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'service-image';
    if (service.image) {
        imageDiv.style.backgroundImage = `url('${service.image}')`;
    } else {
        // Default placeholder
        imageDiv.style.backgroundImage = `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800')`;
    }
    
    // Optional badge
    if (service.badge) {
        const badge = document.createElement('div');
        badge.className = 'service-badge';
        badge.textContent = service.badge;
        imageDiv.appendChild(badge);
    }
    
    card.appendChild(imageDiv);
    
    // Service content
    const content = document.createElement('div');
    content.className = 'service-content';
    
    // Header
    const header = document.createElement('div');
    header.className = 'service-header';
    
    const name = document.createElement('h3');
    name.className = 'service-name';
    name.textContent = service.name;
    header.appendChild(name);
    
    content.appendChild(header);
    
    // Meta information (duration and price preview)
    if (service.duration || service.price) {
        const meta = document.createElement('div');
        meta.className = 'service-meta';
        
        if (service.duration) {
            const duration = document.createElement('div');
            duration.className = 'meta-item';
            duration.innerHTML = `<i class="far fa-clock"></i><span>${service.duration}</span>`;
            meta.appendChild(duration);
        }
        
        if (service.price) {
            const price = document.createElement('div');
            price.className = 'meta-item';
            price.innerHTML = `<i class="fas fa-tag"></i><span>From $${service.price}</span>`;
            meta.appendChild(price);
        }
        
        content.appendChild(meta);
    }
    
    // Description
    if (service.description) {
        const description = document.createElement('p');
        description.className = 'service-description';
        description.textContent = service.description;
        content.appendChild(description);
    }
    
    // Footer with price and book button
    const footer = document.createElement('div');
    footer.className = 'service-footer';
    
    if (service.price) {
        const priceDiv = document.createElement('div');
        const priceAmount = document.createElement('div');
        priceAmount.className = 'service-price';
        priceAmount.textContent = `$${service.price}`;
        priceDiv.appendChild(priceAmount);
        
        const priceLabel = document.createElement('span');
        priceLabel.className = 'price-label';
        priceLabel.textContent = service.priceLabel || 'Starting at';
        priceDiv.appendChild(priceLabel);
        
        footer.appendChild(priceDiv);
    }
    
    // Book button
    const bookButton = document.createElement('a');
    bookButton.href = 'contact.html';
    bookButton.className = 'book-button';
    bookButton.innerHTML = '<span>Book Now</span><i class="fas fa-arrow-right"></i>';
    footer.appendChild(bookButton);
    
    content.appendChild(footer);
    card.appendChild(content);
    
    return card;
}

/**
 * Show error message
 */
function showError(message) {
    const loadingState = document.getElementById('loadingState');
    const servicesGrid = document.getElementById('servicesGrid');
    const noServicesMessage = document.getElementById('noServices');
    
    if (loadingState) loadingState.style.display = 'none';
    if (servicesGrid) servicesGrid.style.display = 'none';
    
    if (noServicesMessage) {
        noServicesMessage.style.display = 'block';
        noServicesMessage.querySelector('p').textContent = message;
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
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
    
    // Observe service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => observer.observe(card));
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Format price for display
 */
function formatPrice(price) {
    if (typeof price === 'number') {
        return price.toFixed(2);
    }
    return price;
}

/**
 * Debounce function for scroll events
 */
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
