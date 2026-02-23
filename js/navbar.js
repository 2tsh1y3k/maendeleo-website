/* =========================================
   COLLÈGE MAENDELEO - NAVBAR MODULE
   Navigation Interactions & Scroll Effects
   ========================================= */

class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.toggle = document.getElementById('navbarToggle');
    this.menu = document.querySelector('.navbar__menu');
    this.overlay = document.querySelector('.navbar__overlay');
    this.links = document.querySelectorAll('.navbar__menu-link');
    
    this.init();
  }

  init() {
    if (!this.navbar) return;
    
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupActiveLink();
    this.setupSmoothScroll();
  }

  setupScrollEffect() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add scrolled class when scrolled down
      if (currentScroll > 100) {
        this.navbar.classList.add('navbar--scrolled');
      } else {
        this.navbar.classList.remove('navbar--scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  setupMobileMenu() {
    if (!this.toggle || !this.menu) return;
    
    // Toggle mobile menu
    this.toggle.addEventListener('click', () => {
      this.toggleMenu();
    });
    
    // Close menu when clicking overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }
    
    // Close menu when clicking a link
    this.links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          this.closeMenu();
        }
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menu.classList.contains('navbar__menu--active')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isActive = this.menu.classList.toggle('navbar__menu--active');
    this.toggle.classList.toggle('navbar__toggle--active');
    
    if (this.overlay) {
      this.overlay.classList.toggle('navbar__overlay--active');
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMenu() {
    this.menu.classList.remove('navbar__menu--active');
    this.toggle.classList.remove('navbar__toggle--active');
    
    if (this.overlay) {
      this.overlay.classList.remove('navbar__overlay--active');
    }
    
    document.body.style.overflow = '';
  }

  setupActiveLink() {
    const currentPath = window.location.pathname;
    
    this.links.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath) {
        link.classList.add('navbar__menu-link--active');
      }
    });
  }

  setupSmoothScroll() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only smooth scroll for anchor links on same page
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

// Initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navbar;
}
