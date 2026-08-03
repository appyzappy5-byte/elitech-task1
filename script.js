// ============================================
// MORROW MARKET - INTERACTIVE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCartFunctionality();
    initWishlistFunctionality();
    initNewsletterForms();
    initSmoothScroll();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-categories') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Add scroll effect to navigation
    let lastScroll = 0;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(function(el) {
        observer.observe(el);
    });
    
    // Add fade-in class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Staggered animation for grids
    const grids = document.querySelectorAll('.collections-grid, .benefits-grid, .products-grid, .testimonials-grid');
    grids.forEach(function(grid) {
        const cards = grid.querySelectorAll('.collection-card, .benefit-card, .product-card, .testimonial-card');
        cards.forEach(function(card, index) {
            card.classList.add('fade-in');
            card.style.transitionDelay = (index * 0.1) + 's';
            observer.observe(card);
        });
    });
}

// ============================================
// CART FUNCTIONALITY
// ============================================
function initCartFunctionality() {
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.btn-product');
    let cartItems = 0;
    
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Increment cart count
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                cartCount.classList.add('active');
            }
            
            // Button feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--color-accent)';
            button.style.color = 'white';
            
            setTimeout(function() {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1500);
        });
    });
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================
function initWishlistFunctionality() {
    const wishlistButtons = document.querySelectorAll('.product-wishlist');
    
    wishlistButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const svg = button.querySelector('svg');
            
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                svg.setAttribute('fill', 'none');
                svg.style.color = 'var(--color-text-secondary)';
            } else {
                button.classList.add('active');
                svg.setAttribute('fill', '#C14444');
                svg.style.color = '#C14444';
            }
        });
    });
}

// ============================================
// NEWSLETTER FORMS
// ============================================
function initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .cta-form');
    
    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            const email = emailInput.value;
            
            if (email && isValidEmail(email)) {
                // Success state
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Subscribed!';
                submitButton.disabled = true;
                submitButton.style.backgroundColor = 'var(--color-accent)';
                
                emailInput.value = '';
                
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 2000);
            } else {
                // Error state
                emailInput.style.borderColor = '#C14444';
                emailInput.placeholder = 'Please enter a valid email';
                
                setTimeout(function() {
                    emailInput.style.borderColor = '';
                    emailInput.placeholder = 'Your email address';
                }, 2000);
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                const targetPosition = targetElement.offsetTop - 72; // Account for fixed nav
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// ============================================
// LAZY LOADING IMAGES (Future Enhancement)
// ============================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// PRODUCT HOVER EFFECTS
// ============================================
function initProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(function(card) {
        const productImage = card.querySelector('.product-image');
        
        card.addEventListener('mouseenter', function() {
            if (productImage) {
                productImage.style.transform = 'scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (productImage) {
                productImage.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize product hover effects
initProductHoverEffects();

// ============================================
// SEARCH FUNCTIONALITY (Placeholder)
// ============================================
function initSearch() {
    const searchButton = document.querySelector('.nav-icon[aria-label="Search"]');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Placeholder for search modal/overlay
            console.log('Search functionality would open here');
        });
    }
}

initSearch();

// ============================================
// ACCOUNT FUNCTIONALITY (Placeholder)
// ============================================
function initAccount() {
    const accountButton = document.querySelector('.nav-icon[aria-label="Account"]');
    
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            // Placeholder for account modal/redirect
            console.log('Account functionality would open here');
        });
    }
}

initAccount();