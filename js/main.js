// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  };
  
  // Initial check and scroll event listener
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
  
  // Handle dark/light theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      // Store theme preference
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }
  
  // Add smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Form submission handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Simulate API call with timeout
      setTimeout(() => {
        const formData = new FormData(this);
        console.log('Form submitted with data:', Object.fromEntries(formData));
        
        // Show success message
        this.reset();
        submitButton.textContent = 'Message Sent!';
        
        // Reset button after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 3000);
      }, 1500);
    });
  }
}); 