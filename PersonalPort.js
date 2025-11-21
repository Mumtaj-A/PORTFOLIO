document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Set active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Typed.js for typing effect
    if (document.querySelector('.typing')) {
        new Typed('.typing', {
            strings: ['Web Designer', 'Web Developer', 'Full Stack Developer', 'UI/UX Designer'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Enhanced animation observer with staggered delays
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100); // Stagger animation
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Observe service cards with stagger
    document.querySelectorAll('.service-card').forEach((el, index) => {
        animateObserver.observe(el);
    });

    // Observe portfolio cards with stagger
    document.querySelectorAll('.portfolio-card').forEach((el, index) => {
        animateObserver.observe(el);
    });

    // Observe about section cards
    document.querySelectorAll('.about-content-card, .skills-card').forEach((el) => {
        animateObserver.observe(el);
    });

    // Observe contact cards
    document.querySelectorAll('.contact-info-card, .contact-form-card').forEach((el) => {
        animateObserver.observe(el);
    });

    // Animate contact items
    const contactItems = document.querySelectorAll('.contact-item');
    const contactItemsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2
    });

    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        contactItemsObserver.observe(item);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Download CV handler: fetches the PDF and forces a download (works on mobile/desktop)
document.addEventListener('DOMContentLoaded', () => {
  const dl = document.getElementById('download-cv');
  if (!dl) return;

  // local helper if global showToast isn't available
  function localToast(msg, type = 'info', dur = 3500) {
    if (typeof window.showToast === 'function') return window.showToast(msg, type, dur);
    const el = document.getElementById('form-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('toast-info','toast-success','toast-error');
    el.classList.add('show', `toast-${type}`);
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => el.classList.remove('show'), dur);
  }

  dl.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = dl.getAttribute('href');
    const filename = dl.getAttribute('download') || 'download.pdf';

    // Show preparing toast
    localToast('Preparing download…', 'info', 60000);
    dl.classList && dl.classList.add('is-loading');
    dl.setAttribute('aria-disabled', 'true');

    try {
      const resp = await fetch(url, { cache: 'no-cache' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();

      // Create a temporary link and force download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();

      localToast('Download started — check your device.', 'success', 4000);
    } catch (err) {
      console.error('Download error', err);
      localToast('Unable to download file. Opening in a new tab.', 'error', 5000);
      // fallback: open the file in a new tab
      window.open(url, '_blank', 'noopener');
    } finally {
      dl.classList && dl.classList.remove('is-loading');
      dl.removeAttribute('aria-disabled');
    }
  });
});



/**
 * PersonalPort.js (fixed)
 * Netlify-compatible AJAX form handler
 *
 * - Posts to '/' (safe for Netlify Forms)
 * - Sends FormData (don't set Content-Type manually)
 * - Works with Netlify built-in reCAPTCHA & Google v2
 * - Shows inline thank-you and accessible toast
 * - Includes fallback timer and loading state
 *
 * Place this script so it runs after the form is present in the DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Prefer #contact-form, fallback to form[name="contact"]
  const form = document.querySelector('#contact-form') || document.querySelector('form[name="contact"]');
  if (!form) {
    console.warn('Contact form not found. Make sure #contact-form or form[name="contact"] exists.');
    return;
  }

  // Prevent double-binding
  if (form.__netlifyFormHandlerAttached) return;
  form.__netlifyFormHandlerAttached = true;

  const submitBtn = document.getElementById('submit-btn') || form.querySelector('button[type="submit"]');
  const thankYou = document.getElementById('thank-you');
  const formToast = document.getElementById('form-toast');

  /* ------------------ UI helpers ------------------ */
  function showToast(message, type = 'info', duration = 3500) {
    try {
      if (!formToast) {
        // Fallback for debugging / minimal setups
        try { window.alert(message); } catch (e) { console.log(message); }
        return;
      }
      formToast.textContent = message;
      formToast.classList.remove('toast-info', 'toast-success', 'toast-error');
      formToast.classList.add('show', `toast-${type}`);
      formToast.setAttribute('aria-live', 'polite');

      clearTimeout(formToast._hideTimeout);
      formToast._hideTimeout = setTimeout(() => {
        formToast.classList.remove('show');
      }, duration);
    } catch (err) {
      console.warn('showToast error', err);
    }
  }

  function showLoading() {
    if (!submitBtn) return;
    if (typeof submitBtn.dataset.origHtml === 'undefined') {
      submitBtn.dataset.origHtml = submitBtn.innerHTML;
    }
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
    submitBtn.classList && submitBtn.classList.add('is-loading');
    showToast('Sending message…', 'info', 60000); // long toast while sending
  }

  function clearLoading() {
    if (!submitBtn) return;
    if (typeof submitBtn.dataset.origHtml !== 'undefined') {
      submitBtn.innerHTML = submitBtn.dataset.origHtml;
      delete submitBtn.dataset.origHtml;
    }
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-disabled');
    submitBtn.classList && submitBtn.classList.remove('is-loading');
  }

  function focusAndScroll(el) {
    if (!el) return;
    try { el.focus({ preventScroll: false }); } catch (e) { try { el.focus(); } catch (e) {} }
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
  }

  /* ------------------ Validation & reCAPTCHA ------------------ */
  function firstEmptyRequired() {
    const required = Array.from(form.querySelectorAll('[required]'));
    return required.find(input => {
      if (input.type === 'checkbox' || input.type === 'radio') return !input.checked;
      return String(input.value || '').trim().length === 0;
    }) || null;
  }

  function recaptchaChecked() {
    const gResp = form.querySelector('textarea[name="g-recaptcha-response"], input[name="g-recaptcha-response"]');
    if (!gResp) return true; // no explicit Google reCAPTCHA present -> OK
    return String(gResp.value || '').trim().length > 0;
  }

  /* ------------------ Fallback timer ------------------ */
  let fallbackTimeout = null;
  let visibilityHandler = null;

  function startFallback() {
    stopFallback();
    fallbackTimeout = setTimeout(() => {
      if (document.contains(form) && submitBtn && submitBtn.disabled) {
        clearLoading();
        showToast('Submission timeout — try again.', 'error', 5000);
        console.warn('Submission took too long; re-enabled the form.');
      }
    }, 15000);

    visibilityHandler = () => {
      if (document.visibilityState === 'hidden') stopFallback();
    };

    window.addEventListener('pagehide', stopFallback);
    window.addEventListener('beforeunload', stopFallback);
    document.addEventListener('visibilitychange', visibilityHandler);
  }

  function stopFallback() {
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
      fallbackTimeout = null;
    }
    clearLoading();
    window.removeEventListener('pagehide', stopFallback);
    window.removeEventListener('beforeunload', stopFallback);
    if (visibilityHandler) {
      document.removeEventListener('visibilitychange', visibilityHandler);
      visibilityHandler = null;
    }
  }

  /* ------------------ Inline thank you ------------------ */
  function showInlineThankYou() {
    if (!thankYou) {
      console.warn('Thank you element not found - expected #thank-you');
      return;
    }
    try {
      form.style.display = 'none';
      thankYou.style.display = ''; // let CSS control presentation
      thankYou.classList.add('show');
      thankYou.setAttribute('tabindex', '-1');
      thankYou.focus();
    } catch (e) {
      console.warn('Unable to show inline thank-you', e);
    }
  }

  /* ------------------ Submit handler ------------------ */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate required
    const invalid = Array.from(form.querySelectorAll('[required]')).some(input => {
      if (input.type === 'checkbox' || input.type === 'radio') return !input.checked;
      return String(input.value || '').trim().length === 0;
    });

    if (invalid) {
      const first = firstEmptyRequired();
      if (first) focusAndScroll(first);
      showToast('Please fill all required fields before sending.', 'error', 4500);
      try { alert('Please fill all required fields before sending.'); } catch (e) {}
      return;
    }

    // reCAPTCHA check
    if (!recaptchaChecked()) {
      const recaptchaArea = form.querySelector('.g-recaptcha, [data-netlify-recaptcha]');
      if (recaptchaArea) focusAndScroll(recaptchaArea);
      showToast('Please complete the reCAPTCHA before submitting.', 'error', 4500);
      try { alert('Please complete the reCAPTCHA before submitting.'); } catch (e) {}
      return;
    }

    // Show loading + start fallback
    showLoading();
    startFallback();

    try {
      const formData = new FormData(form);

      // SAFE default: always post to root so Netlify captures the submission
      const postUrl = '/';
      console.log('Submitting form to', postUrl);

      const response = await fetch(postUrl, {
        method: 'POST',
        body: formData,
        // credentials: 'same-origin' // optional if you need cookies
      });

      if (response.ok) {
        stopFallback();
        console.log('Form submitted successfully to Netlify');
        showToast('Message sent successfully!', 'success', 4000);
        showInlineThankYou();

        setTimeout(() => {
          try { if (thankYou) thankYou.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
        }, 300);

      } else {
        const text = await response.text().catch(() => '');
        console.error('Netlify form submission failed with status:', response.status, text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      stopFallback();
      showToast('Unable to send message. Please check your connection and try again.', 'error', 7000);
    }
  });

  // Expose helper to programmatically show thank-you if needed
  form.showInlineThankYou = showInlineThankYou;
});



// Portfolio progress animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const progressBlocks = document.querySelectorAll('.portfolio-progress');

    if (!progressBlocks.length) return;

    const animateProgress = (fillEl, percentEl, target) => {
        // animate width
        fillEl.style.width = target + '%';

        // animate counter
        const start = 0;
        const end = parseInt(target, 10);
        const duration = 900; // ms
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            percentEl.textContent = value + '%';
            // update aria-valuenow on the parent progress-bar for accessibility
            if (fillEl && fillEl.parentElement) {
                fillEl.parentElement.setAttribute('aria-valuenow', String(value));
            }
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                percentEl.textContent = end + '%';
                if (fillEl && fillEl.parentElement) {
                    fillEl.parentElement.setAttribute('aria-valuenow', String(end));
                }
            }
        }

        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const block = entry.target;
                const fill = block.querySelector('.progress-fill');
                const percent = block.querySelector('.progress-percent');
                const target = fill && fill.dataset && fill.dataset.progress ? fill.dataset.progress : null;
                if (fill && percent && target) {
                    // prevent re-running
                    if (!block.classList.contains('progress-animated')) {
                        block.classList.add('progress-animated');
                        // force layout then animate
                        requestAnimationFrame(() => {
                            animateProgress(fill, percent, target);
                        });
                    }
                }
                // if all animated, unobserve
                obs.unobserve(block);
            }
        });
    }, { threshold: 0.35 });

    progressBlocks.forEach(b => {
        // ensure initial state
        const fill = b.querySelector('.progress-fill');
        const percent = b.querySelector('.progress-percent');
        if (fill) fill.style.width = '0%';
        if (percent) percent.textContent = '0%';
        observer.observe(b);
    });
});
