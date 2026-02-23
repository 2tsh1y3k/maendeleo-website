/* =========================================
   COLLÈGE MAENDELEO - ANIMATIONS MODULE
   Scroll Animations & Interactive Effects
   ========================================= */

class Animations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupBackToTop();
    this.setupTypingEffect();
    this.setupFAQ();
    this.setupCounters();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll(`
      .card,
      .stat-card,
      .section-card,
      .option-card,
      .testimonial-card,
      .faq-item,
      .hero__stat
    `);

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  setupBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTop = document.querySelector('.btn--back-to-top');
    
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'btn btn--back-to-top';
      backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
      backToTop.setAttribute('aria-label', 'Retour en haut');
      document.body.appendChild(backToTop);
    }

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    // Smooth scroll to top
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupTypingEffect() {
    const typingElement = document.querySelector('.hero__typing');
    
    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text') || typingElement.textContent;
    typingElement.textContent = '';
    
    let charIndex = 0;

    const type = () => {
      if (charIndex < text.length) {
        typingElement.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
      } else {
        typingElement.classList.add('typing-complete');
      }
    };

    // Start typing after a delay
    setTimeout(type, 1000);
  }

  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      if (question) {
        question.addEventListener('click', () => {
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

  setupCounters() {
    const counterElements = document.querySelectorAll('.stat-card__value, .hero__stat-value');
    
    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counterElements.forEach(el => {
      observer.observe(el);
    });
  }

  animateCounter(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasPlus = text.includes('+');
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    
    if (isNaN(target)) return;

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        element.textContent = Math.ceil(current) + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
      }
    };

    updateCounter();
  }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Animations();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
}
