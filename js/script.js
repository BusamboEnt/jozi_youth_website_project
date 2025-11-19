// Basic interactivity: mobile nav toggle, sample events, and form validation
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.style.display = expanded ? 'none' : 'block';
    })
  }

  // Sample events data
  const events = [
    { title: 'Digital Skills Workshop', date: '2025-11-05', desc: 'Learn web basics and CV tips.', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
    { title: 'Entrepreneurship Bootcamp', date: '2025-11-12', desc: 'Start your small business.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80' },
    { title: 'Community Cleanup', date: '2025-11-20', desc: 'Join our community effort to clean local parks.', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80' }
  ];

  const eventsContainer = document.getElementById('events');
  const tpl = document.getElementById('event-template');
  const searchInput = document.getElementById('eventSearch');

  function renderEvents(filterText = '') {
    if (!eventsContainer || !tpl) return;
    eventsContainer.innerHTML = '';

    const filtered = events.filter(ev =>
      ev.title.toLowerCase().includes(filterText.toLowerCase()) ||
      ev.desc.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      eventsContainer.innerHTML = '<p>No events found.</p>';
      return;
    }

    filtered.forEach(ev => {
      const clone = tpl.content.cloneNode(true);
      const imgEl = clone.querySelector('.event-img') || clone.querySelector('img.event-img') || clone.querySelector('img');

      if (imgEl) {
        const baseUrl = ev.img.split('?')[0];
        imgEl.src = `${baseUrl}?auto=format&fit=crop&w=800&q=80`;
        // Add click handler for lightbox
        imgEl.style.cursor = 'pointer';
        imgEl.addEventListener('click', () => openLightbox(imgEl.src, ev.title));
      }

      clone.querySelector('.event-title').textContent = ev.title;
      clone.querySelector('.event-date').textContent = ev.date;
      clone.querySelector('.event-desc').textContent = ev.desc;

      const btn = clone.querySelector('.register');
      if (btn) btn.addEventListener('click', () => {
        alert('Thanks — you have registered interest for: ' + ev.title);
      });

      eventsContainer.appendChild(clone);
    });
  }

  // Initial render
  renderEvents();

  // Search Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderEvents(e.target.value);
    });
  }

  // Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    lightbox.style.display = 'flex'; // Override hidden attribute style
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.hidden = true;
      lightbox.style.display = 'none';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.hidden = true;
        lightbox.style.display = 'none';
      }
    });
  }

  // FAQ Accordion Logic
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const expanded = acc.getAttribute('aria-expanded') === 'true';
      acc.setAttribute('aria-expanded', String(!expanded));
      const content = acc.nextElementSibling;
      content.hidden = expanded;
      acc.querySelector('.icon').textContent = expanded ? '+' : '-';
    });
  });

  // Leaflet Map Logic
  const mapContainer = document.getElementById('map');
  if (mapContainer && window.L) {
    // Coordinates for Johannesburg
    const map = L.map('map').setView([-26.2041, 28.0473], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([-26.2041, 28.0473]).addTo(map)
      .bindPopup('<b>Jozi Youth HQ</b><br>Johannesburg, South Africa.')
      .openPopup();
  }

  // Enquiry form validation + fake AJAX submit
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    // Real-time validation
    const inputs = enquiryForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.parentElement.classList.remove('error');
        }
      });
    });

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!enquiryForm.checkValidity()) {
        enquiryForm.reportValidity();
        return;
      }

      // Simulate AJAX
      const btn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      enquiryForm.classList.add('loading');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        enquiryForm.classList.remove('loading');

        const fd = new FormData(enquiryForm);
        const type = fd.get('type');
        let message = 'Thank you! Your enquiry has been received.';

        if (type === 'volunteer') {
          message = 'Thanks for volunteering! Our coordinator will contact you shortly with next steps.';
        } else if (type === 'sponsor') {
          message = 'Thank you for your interest in sponsoring. We will be in touch to discuss partnership opportunities.';
        } else if (type === 'workshop') {
          message = 'Registration received! We look forward to seeing you at the workshop.';
        }

        const result = document.getElementById('enquiryResult');
        result.innerHTML = `<div class="success-message">${message}</div>`;
        enquiryForm.reset();
      }, 1500); // 1.5s simulated delay
    })
  }

  // Contact form: compile an email body and open default mail client
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return }
      const fd = new FormData(contactForm);
      const subject = encodeURIComponent(fd.get('subject'));
      const body = encodeURIComponent('Name: ' + fd.get('name') + '\nEmail: ' + fd.get('email') + '\n\n' + fd.get('message'));
      const to = 'info@joziyouth.org';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    })
  }
});