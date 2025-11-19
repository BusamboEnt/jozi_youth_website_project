// Basic interactivity: mobile nav toggle, sample events, and form validation
document.addEventListener('DOMContentLoaded',function(){
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle){ toggle.addEventListener('click',()=>{
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if(nav) nav.style.display = expanded ? 'none' : 'block';
  })}

  // Sample events data
  const events = [
    {title:'Digital Skills Workshop', date:'2025-11-05', desc:'Learn web basics and CV tips.', img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'},
    {title:'Entrepreneurship Bootcamp', date:'2025-11-12', desc:'Start your small business.', img:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'},
    {title:'Community Cleanup', date:'2025-11-20', desc:'Join our community effort to clean local parks.', img:'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80'}
  ];
  const eventsContainer = document.getElementById('events');
  const tpl = document.getElementById('event-template');
  if(eventsContainer && tpl){
    events.forEach(ev=>{
      const clone = tpl.content.cloneNode(true);
      const imgEl = clone.querySelector('.event-img') || clone.querySelector('img.event-img') || clone.querySelector('img');
      if(imgEl) imgEl.src = ev.img;
      clone.querySelector('.event-title').textContent = ev.title;
      clone.querySelector('.event-date').textContent = ev.date;
      clone.querySelector('.event-desc').textContent = ev.desc;
      const btn = clone.querySelector('.register');
      if(btn) btn.addEventListener('click',()=>{
        alert('Thanks — you have registered interest for: ' + ev.title);
      });
      eventsContainer.appendChild(clone);
    })
  }

  // Enquiry form validation + fake submit
  const enquiryForm = document.getElementById('enquiryForm');
  if(enquiryForm){
    enquiryForm.addEventListener('submit',function(e){
      e.preventDefault();
      if(!enquiryForm.checkValidity()){
        enquiryForm.reportValidity();
        return;
      }
      const result = document.getElementById('enquiryResult');
      result.textContent = 'Thank you! Your enquiry has been received.';
      enquiryForm.reset();
    })
  }

  // Contact form: compile an email body and open default mail client
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit',function(e){
      e.preventDefault();
      if(!contactForm.checkValidity()){contactForm.reportValidity();return}
      const fd = new FormData(contactForm);
      const subject = encodeURIComponent(fd.get('subject'));
      const body = encodeURIComponent('Name: '+fd.get('name')+'\nEmail: '+fd.get('email')+'\n\n'+fd.get('message'));
      const to = 'info@joziyouth.org';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    })
  }
});