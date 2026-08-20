document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Scroll Reveal Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Triggers slightly before reaching view
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });

  // --- 2. Hero Slider Logic ---
  let currentSlide = 0;
  const track = document.getElementById('sliderTrack');
  const sliderWrapper = document.getElementById('sliderWrapper');
  const dots = document.querySelectorAll('.dot');
  const slides = document.querySelectorAll('.slide');

  if (!track || !slides.length) return;

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  window.moveSlide = function(direction) {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateSlider();
  };

  window.goToSlide = function(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
  };

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  sliderWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) > 50) {
      moveSlide(distance < 0 ? 1 : -1);
    }
  }, { passive: true });
});

/**
 * ==========================================================================
 * EC Landing / EarlyRepair Integration & Webhook Handler
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global event delegation for category tab filtering
  const tabsContainer = document.querySelector('.integration-tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const tabButton = e.target.closest('.tab-btn');
      if (!tabButton) return;

      const category = tabButton.getAttribute('data-category');
      filterIntegrations(category, tabButton);
    });
  }

  // Global event delegation for integration card toggles
  const gridContainer = document.querySelector('.integrations-grid');
  if (gridContainer) {
    gridContainer.addEventListener('click', (e) => {
      const cardElement = e.target.closest('.integration-card');
      if (!cardElement) return;

      toggleIntegrationCard(cardElement);
    });
  }
});

/**
 * Filter Cards by Category Tab
 * @param {string} category - Category data attribute ('all', 'dispatchers', 'parts', 'communication', 'billing')
 * @param {HTMLElement} activeBtn - The clicked button element
 */
function filterIntegrations(category, activeBtn) {
  // Update Active Tab Button Styling
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((btn) => btn.classList.remove('active'));
  activeBtn.classList.add('active');

  // Filter Cards & Reset Expanded States
  const cards = document.querySelectorAll('.integration-card');
  cards.forEach((card) => {
    card.classList.remove('active'); // Close expanded details on tab switch

    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/**
 * Toggle Accordion Feature Checklist
 * @param {HTMLElement} cardElement - The target .integration-card element
 */
function toggleIntegrationCard(cardElement) {
  const allCards = document.querySelectorAll('.integration-card');

  // Close all other cards (Accordion behavior)
  allCards.forEach((c) => {
    if (c !== cardElement) {
      c.classList.remove('active');
    }
  });

  // Toggle selected card state
  cardElement.classList.toggle('active');
}


/* ==========================================================================
   STACKED SCROLLING FEATURES EFFECT (Blur & Scale)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.feature-card');
  let ticking = false; // Acts as a lock so we don't queue up unnecessary frames

  function updateCardsOnScroll() {
    // 1. Loop through each card
    cards.forEach((card, index) => {
      // Get the next card to determine how close it is to overlapping
      const nextCard = cards[index + 1];
      
      if (nextCard) {
        const currentRect = card.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        
        // Calculate the distance between the top of this card and the top of the next card
        const distance = nextRect.top - currentRect.top;
        
        // Calculate effects based on how close the next card is
        // (You can tweak the '400' divisor to make the fade/shrink happen faster or slower)
        let progress = 1 - (distance / 200); 
        
        // Clamp the progress between 0 and 1 so it doesn't over-animate
        progress = Math.max(0, Math.min(1, progress));

        // If the next card is starting to overlap, apply the shrink and blur
        if (progress > 0) {
          // Shrinks from 1 down to 0.9
          const scaleValue = 1 - (progress * 0.1); 
          // Blurs from 0px up to 5px
          const blurValue = progress * 5; 
          
          card.style.transform = `scale(${scaleValue})`;
          card.style.filter = `blur(${blurValue}px)`;
        } else {
          // Reset to default if not overlapping
          card.style.transform = `scale(1)`;
          card.style.filter = `blur(0px)`;
        }
      }
    });

    // 2. Unlock the ticking variable so the next frame can run
    ticking = false;
  }

  // 3. The Optimized Scroll Listener
  window.addEventListener('scroll', () => {
    if (!ticking) {
      // requestAnimationFrame waits for the optimal moment to render the frame (smooth 60fps)
      window.requestAnimationFrame(updateCardsOnScroll);
      ticking = true;
    }
  });
  
  // 4. Run once on load to ensure initial state is correct
  updateCardsOnScroll();
});

