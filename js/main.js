/* ===================================
   COLLÈGE MAENDELEO - MAIN JAVASCRIPT
   Interactive Components & Functionality
   =================================== */

(function() {
    'use strict';

    // ============ INITIALIZATION ============
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initTestimonials();
        initFAQ();
        initBackToTop();
        initScrollIndicator();
        initTypingEffect();
    });

    // ============ NAVIGATION ============
    function initNavigation() {
        const nav = document.querySelector('.nav');
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Sticky navigation on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = nav.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============ SCROLL EFFECTS ============
    function initScrollEffects() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 80;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect for hero sections
        const parallaxElements = document.querySelectorAll('.hero, .about-hero');
        
        window.addEventListener('scroll', function() {
            parallaxElements.forEach(element => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // ============ SCROLL ANIMATIONS ============
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.stat-card, .step, .feature-card, .option-card, .leader-card, .faq-item, .testimonial-card'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    // ============ TESTIMONIALS CAROUSEL ============
    function initTestimonials() {
        const track = document.getElementById('testimonialsTrack');
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        
        if (!track || !prevBtn || !nextBtn) return;

        const testimonials = document.querySelectorAll('.testimonial');
        let currentIndex = 0;
        let isAutoPlaying = true;
        let autoPlayInterval;

        function updateCarousel(transition = true) {
            if (transition) {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateCarousel();
        }

        function prevTestimonial() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateCarousel();
        }

        function startAutoPlay() {
            if (isAutoPlaying) {
                autoPlayInterval = setInterval(nextTestimonial, 6000);
            }
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            nextTestimonial();
            startAutoPlay();
        });

        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            prevTestimonial();
            startAutoPlay();
        });

        // Pause on hover
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });

        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextTestimonial();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevTestimonial();
            }
        }

        // Start auto-play
        startAutoPlay();
    }

    // ============ FAQ ACCORDION ============
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    // ============ BACK TO TOP BUTTON ============
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        
        if (!backToTop) {
            // Create back to top button if it doesn't exist
            const btn = document.createElement('div');
            btn.className = 'back-to-top';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(btn);
        }

        const btn = document.querySelector('.back-to-top');

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============ SCROLL INDICATOR ============
    function initScrollIndicator() {
        let indicator = document.querySelector('.scroll-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            document.body.appendChild(indicator);
        }

        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            indicator.style.transform = `scaleX(${scrolled / 100})`;
        });
    }

    // ============ TYPING EFFECT ============
    function initTypingEffect() {
        const typedElement = document.getElementById('typed-text');
        
        if (!typedElement) return;

        const text = typedElement.getAttribute('data-text') || "Le Paradis du Savoir";
        let charIndex = 0;
        
        typedElement.textContent = '';

        function type() {
            if (charIndex < text.length) {
                typedElement.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                // Add blinking cursor effect
                typedElement.classList.add('typing-complete');
            }
        }

        setTimeout(type, 1000);
    }

    // ============ FORM VALIDATION ============
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            const parent = input.parentElement;
            
            // Remove previous error
            const existingError = parent.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            input.classList.remove('error');

            // Validate
            if (!value) {
                isValid = false;
                input.classList.add('error');
                
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = 'Ce champ est requis';
                error.style.color = 'var(--color-danger)';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '5px';
                error.style.display = 'block';
                parent.appendChild(error);
            } else if (input.type === 'email' && !isValidEmail(value)) {
                isValid = false;
                input.classList.add('error');
                
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = 'Email invalide';
                error.style.color = 'var(--color-danger)';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '5px';
                error.style.display = 'block';
                parent.appendChild(error);
            }
        });

        return isValid;
    };

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ============ COUNTER ANIMATION ============
    window.animateCounters = function() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
                }
            }

            updateCounter();
        });
    };

    // ============ IMAGE LAZY LOADING ============
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============ UTILITY FUNCTIONS ============
    
    // Debounce function for performance
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Show notification
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    };

})();

// ============ GLOBAL FUNCTIONS ============

// Video modal handler
function openVideo(videoUrl) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-overlay"></div>
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <iframe src="${videoUrl}?autoplay=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const close = modal.querySelector('.video-modal-close');
    const overlay = modal.querySelector('.video-modal-overlay');

    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }

    close.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    if (validateForm('contactForm')) {
        // Simulate form submission
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        setTimeout(() => {
            showNotification('Message envoyé avec succès!', 'success');
            event.target.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le Message';
        }, 2000);
    }
}
