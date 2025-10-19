// ============================================
// PRELOADER SECTION
// ============================================
class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePreloader();
            }, 2200);
        });
    }

    hidePreloader() {
        this.preloader.classList.add('hidden');
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }
}

// ============================================
// HEADER SECTION
// ============================================
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleNavigation();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScrollTop = scrollTop;
        });
    }

    handleMobileMenu() {
        this.mobileMenuToggle.addEventListener('click', () => {
            this.mobileMenuToggle.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            
            if (this.mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenuToggle.classList.remove('active');
                this.mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    handleNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// HERO SECTION
// ============================================
class HeroManager {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.videoContainers = document.querySelectorAll('.video-container');
        this.videos = document.querySelectorAll('.video-container video');
        this.bgLayers = document.querySelectorAll('.bg-layer');
        this.floatingElements = document.querySelectorAll('.float-element');
        this.currentLayerIndex = 0;
        this.init();
    }

    init() {
        this.handleVideoPlayback();
        this.handleBackgroundRotation();
        this.handleParallax();
        this.handleFloatingElements();
        this.handleButtonAnimations();
    }

    handleVideoPlayback() {
        this.videos.forEach((video, index) => {
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            });

            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play();
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.videoContainers[index]);
        });
    }

    handleBackgroundRotation() {
        setInterval(() => {
            this.bgLayers.forEach(layer => layer.classList.remove('active'));
            
            this.currentLayerIndex = (this.currentLayerIndex + 1) % this.bgLayers.length;
            this.bgLayers[this.currentLayerIndex].classList.add('active');
        }, 5000);
    }

    handleParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            this.videoContainers.forEach((container, index) => {
                const speed = parallaxSpeed * (index + 1) * 0.3;
                container.style.transform = `translateY(${scrolled * speed}px)`;
            });

            this.floatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                const rotate = scrolled * 0.02 * (index + 1);
                element.style.transform = `translate(${Math.sin(scrolled * 0.001) * 20}px, ${yPos}px) rotate(${rotate}deg)`;
            });
        });
    }

    handleFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const randomDelay = Math.random() * 2;
            const randomDuration = 6 + Math.random() * 4;
            element.style.animationDelay = `${randomDelay}s`;
            element.style.animationDuration = `${randomDuration}s`;
        });
    }

    handleButtonAnimations() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--mouse-x', `${x}px`);
                button.style.setProperty('--mouse-y', `${y}px`);
            });

            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        const primaryButton = document.querySelector('.btn-primary');
        const secondaryButton = document.querySelector('.btn-secondary');

        if (primaryButton) {
            primaryButton.addEventListener('click', () => {
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (secondaryButton) {
            secondaryButton.addEventListener('click', () => {
                alert('Video modal would open here - integrate with your video player!');
            });
        }
    }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const preloaderManager = new PreloaderManager();
    const headerManager = new HeaderManager();
    const heroManager = new HeroManager();
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    const bookButtons = document.querySelectorAll('.btn-book, .mobile-btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Booking system would open here - integrate with your scheduling platform!');
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    window.dispatchEvent(new Event('resize'));

    const heroFeatures = document.querySelectorAll('.feature-item');
    heroFeatures.forEach((feature, index) => {
        feature.style.animationDelay = `${1.2 + (index * 0.1)}s`;
    });

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content > *').forEach(el => {
        observer.observe(el);
    });
});
