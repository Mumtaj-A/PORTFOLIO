/**
 * MUMTAJ ALI — PROFESSIONAL PORTFOLIO SCRIPT
 * High-performance, modular, accessible vanilla JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // Shared Subtle Touch Haptic Feedback Helper (Android & Supported Devices)
  const triggerHaptic = (duration = 10) => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(duration);
      }
    } catch (e) {}
  };

  // Shared Toast Notification Helper
  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };

  // Shared Smooth Scroll Helper with Dynamic Navbar Offset
  const scrollToTarget = (targetId) => {
    const cleanId = (targetId || "").replace("#", "");
    const targetEl =
      document.getElementById(cleanId) ||
      (cleanId === "hero" ? document.getElementById("home") : null);
    if (!targetEl) return;

    if (cleanId === "home" || cleanId === "hero") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const navHeight =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
    const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - (navHeight + 12);

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (DARK & LIGHT MODE WITH PREFERS-COLOR-SCHEME & STORAGE SYNC)
     -------------------------------------------------------------------------- */
  const initTheme = () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

    const getSystemTheme = () =>
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

    const applyTheme = (theme) => {
      const activeTheme = theme === "light" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", activeTheme);

      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", activeTheme === "light" ? "#f8fafc" : "#090a10");
      }

      const nextModeText = activeTheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";

      if (themeToggleBtn) {
        themeToggleBtn.setAttribute("aria-label", nextModeText);
        themeToggleBtn.setAttribute("title", nextModeText);
      }

      // Dispatch custom event for reactive theme listeners
      window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme: activeTheme } }));
    };

    // Determine initial theme: attribute already set by head script, or localStorage, or prefers-color-scheme
    const getInitialTheme = () => {
      const fromAttr = document.documentElement.getAttribute("data-theme");
      if (fromAttr === "light" || fromAttr === "dark") return fromAttr;
      try {
        const saved = localStorage.getItem("themePreference");
        if (saved === "light" || saved === "dark") return saved;
      } catch (e) {}
      return getSystemTheme();
    };

    const currentTheme = getInitialTheme();
    applyTheme(currentTheme);

    const handleThemeToggle = () => {
      triggerHaptic(12);
      const isCurrentlyLight = document.documentElement.getAttribute("data-theme") === "light";
      const targetTheme = isCurrentlyLight ? "dark" : "light";
      const systemPreference = getSystemTheme();

      // If user reverts to match their system preference, remove stored override
      if (targetTheme === systemPreference) {
        try {
          localStorage.removeItem("themePreference");
        } catch (e) {}
        if (metaColorScheme) metaColorScheme.setAttribute("content", "light dark");
      } else {
        try {
          localStorage.setItem("themePreference", targetTheme);
        } catch (e) {}
        if (metaColorScheme) metaColorScheme.setAttribute("content", targetTheme);
      }

      applyTheme(targetTheme);
    };

    themeToggleBtn?.addEventListener("click", handleThemeToggle);

    // Sync with system OS preference changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        try {
          const hasManualPreference = localStorage.getItem("themePreference");
          if (!hasManualPreference) {
            applyTheme(e.matches ? "light" : "dark", false);
          }
        } catch (err) {}
      });
    }

    // Cross-tab synchronization via storage event
    window.addEventListener("storage", (e) => {
      if (e.key === "themePreference" && (e.newValue === "light" || e.newValue === "dark")) {
        applyTheme(e.newValue, false);
      }
    });
  };

  /* --------------------------------------------------------------------------
     2. NAVBAR SCROLL & ACTIVE SECTION OBSERVER
     -------------------------------------------------------------------------- */
  const initNavbar = () => {
    const navbar = document.getElementById("navbar");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const dockLinks = Array.from(document.querySelectorAll(".mobile-dock-btn"));
    const sections = Array.from(document.querySelectorAll("section[id]"));

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    let ticking = false;
    const scrollThreshold = 8; // Minimum scroll delta to avoid micro jitter

    const updateNavbarOnScroll = () => {
      if (!navbar) {
        ticking = false;
        return;
      }

      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const scrollDelta = currentScrollY - lastScrollY;
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

      // Toggle subtle background glass shadow
      if (currentScrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      // Hide navbar when scrolling DOWN, reveal when scrolling UP
      // Always show when near the very top of the page
      if (currentScrollY <= 40) {
        navbar.classList.remove("nav-hidden");
      } else if (
        scrollDelta > scrollThreshold &&
        currentScrollY > 80 &&
        currentScrollY < maxScrollY - 20
      ) {
        // Scrolling DOWN -> Hide Navbar
        navbar.classList.add("nav-hidden");
      } else if (scrollDelta < -scrollThreshold) {
        // Scrolling UP -> Reveal Navbar
        navbar.classList.remove("nav-hidden");
      }

      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbarOnScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateNavbarOnScroll();

    // Section Observer for Active Navigation Links (Desktop & Mobile Dock)
    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute("id");

              navLinks.forEach((link) => {
                const href = link.getAttribute("href")?.replace("#", "");
                if (href === currentId) {
                  link.classList.add("active");
                } else {
                  link.classList.remove("active");
                }
              });

              dockLinks.forEach((link) => {
                const href = link.getAttribute("href")?.replace("#", "");
                if (href === currentId) {
                  link.classList.add("active");
                } else {
                  link.classList.remove("active");
                }
              });
            }
          });
        },
        {
          rootMargin: "-25% 0px -65% 0px",
          threshold: 0,
        }
      );

      sections.forEach((sec) => sectionObserver.observe(sec));
    }

    // Smooth Scroll & Touch Navigation for Mobile Glass Dock Items
    dockLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        triggerHaptic(12);
        const href = link.getAttribute("href") || "";
        scrollToTarget(href);

        dockLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // Smooth Scroll for Desktop Navigation Links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("#")) {
          e.preventDefault();
          triggerHaptic(8);
          scrollToTarget(href);
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     3. TYPED.JS INITIALIZATION
     -------------------------------------------------------------------------- */
  const initTyping = () => {
    const target = document.getElementById("typed-target");
    if (!target) return;

    if (window.Typed) {
      new window.Typed("#typed-target", {
        strings: [
          "Next.js & React Web Apps",
          "Modern Responsive Frontends",
          "Full Stack Web Systems",
          "Scalable Laravel Backends",
          "Intuitive UI/UX Interfaces",
        ],
        typeSpeed: 60,
        backSpeed: 35,
        backDelay: 2000,
        startDelay: 400,
        loop: true,
        showCursor: true,
        cursorChar: "|",
      });
    } else {
      target.textContent = "Next.js & React Web Apps";
    }
  };

  /* --------------------------------------------------------------------------
     5. LIQUID GLASS SPECULAR SPOTLIGHT TRACKING (MOUSE & MOBILE TOUCH)
     -------------------------------------------------------------------------- */
  const initLiquidGlass = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const liquidElements = document.querySelectorAll(
      ".card-surface, .project-card, .profile-card, .nav-container, .service-card, .skill-category-card, .timeline-card, .contact-info-card, .contact-form-card, .whatsapp-card"
    );

    const setPosition = (el, clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);
    };

    liquidElements.forEach((el) => {
      // Desktop Mouse Tracking
      el.addEventListener(
        "pointermove",
        (e) => {
          setPosition(el, e.clientX, e.clientY);
        },
        { passive: true }
      );

      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--mouse-x", `-500px`);
        el.style.setProperty("--mouse-y", `-500px`);
      });

      // Mobile Touch Response (Android & iOS)
      el.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches && e.touches[0]) {
            setPosition(el, e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );

      el.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches && e.touches[0]) {
            setPosition(el, e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );

      el.addEventListener(
        "touchend",
        () => {
          setTimeout(() => {
            el.style.setProperty("--mouse-x", `-500px`);
            el.style.setProperty("--mouse-y", `-500px`);
          }, 500);
        },
        { passive: true }
      );
    });
  };

  /* --------------------------------------------------------------------------
     7. PROJECT FILTERING
     -------------------------------------------------------------------------- */
  const initProjectFilters = () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        triggerHaptic(8);

        filterButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const selected = btn.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (selected === "all" || category === selected) {
            card.style.display = "flex";
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  };

  /* --------------------------------------------------------------------------
     8. PROJECT DETAIL MODAL DIALOG
     -------------------------------------------------------------------------- */
  const initProjectModal = () => {
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("modal-content");
    const closeBtn = document.getElementById("modal-close-btn");
    const triggerButtons = document.querySelectorAll(".view-details-btn");

    if (!modal || !modalContent) return;

    const projectData = {
      giftstore: {
        title: "GiftStore E-Commerce Platform",
        category: "Full Stack • Laravel & MySQL",
        image: "assets/portfolio4.png",
        description:
          "GiftStore is a complete end-to-end e-commerce solution engineered with Laravel MVC. It delivers a streamlined customer shopping experience from product catalog browsing to cart management, address verification, and order placement. An operational administrative portal empowers store owners to manage inventory, catalog taxonomies, customers, and order dispatch statuses.",
        highlights: [
          "Engineered reactive shopping cart and order calculation state logic.",
          "Implemented comprehensive admin dashboard for products, categories, stock, and orders.",
          "Role-based authentication securing client accounts and staff management.",
          "Optimized MySQL relational schema with indexing on high-traffic product search queries.",
        ],
        stack: ["Laravel", "PHP 8+", "MySQL", "JavaScript", "Blade", "Bootstrap 5"],
        github: "https://github.com/Mumtaj-A/giftstore",
      },
      sms: {
        title: "Student Management System",
        category: "Academic Software • Internship Build",
        image: "assets/portfolio5.png",
        description:
          "Developed during my engineering internship at Simar Technology (Hoshiarpur, Punjab), this comprehensive software automates student lifecycle management for schools and academies. It digitizes student admissions, multi-class assignment, daily attendance recording, and term examination grade reporting.",
        highlights: [
          "Engineered 3-tier Role-Based Access Control (RBAC): Administrator, Teacher, and Student.",
          "Automated term report card computation and printable/PDF grade sheet generation.",
          "Interactive student attendance matrix with daily percentage metrics and alert flagging.",
          "Clean responsive UI built with HTML5, CSS3, Bootstrap, and JavaScript.",
        ],
        stack: ["Core PHP", "MySQL", "Bootstrap 5", "JavaScript", "XAMPP"],
        github: "https://github.com/Mumtaj-A",
      },
      blog: {
        title: "Dynamic Blog & Content Platform",
        category: "Full Stack • Laravel MVC",
        image: "assets/portfolio3.png",
        description:
          "A high-performance dynamic publishing platform designed for seamless content distribution and editorial management. Built using Laravel's robust MVC architecture, the platform features clean URL slug routing, rich author workflows, multi-category tagging, and user engagement streams.",
        highlights: [
          "Role-based publishing workflows separating Authors, Editors, and Administrators.",
          "SEO-optimized architecture with automated slug generation and OpenGraph metadata.",
          "Comment streams with hierarchical replies and moderation queues.",
          "Efficient pagination and database queries via Laravel Eloquent ORM.",
        ],
        stack: ["Laravel", "PHP", "MySQL", "JavaScript", "HTML5", "CSS3"],
        github: "https://github.com/Mumtaj-A",
      },
      facerecog: {
        title: "Face Recognition Attendance System",
        category: "Computer Vision & AI • Python",
        image: "assets/portfolio1.png",
        description:
          "An intelligent biometric attendance automation application built with Python and OpenCV. The system captures live video feeds via webcam, detects facial bounding boxes, extracts distinctive biometric feature vectors, matches against registered identity profiles, and instantly records timestamps into an attendance log.",
        highlights: [
          "Real-time facial detection and feature vector extraction via OpenCV pipelines.",
          "Automated anti-duplicate verification ensuring single daily attendance logging.",
          "Exportable attendance logs formatted for administrative spreadsheets and databases.",
          "User-friendly GUI interface built for front-desk deployment.",
        ],
        stack: ["Python", "OpenCV", "NumPy", "Tkinter / GUI", "CSV / SQLite"],
        github: "https://github.com/Mumtaj-A",
      },
      noteshare: {
        title: "Note Sharing & Academic Portal",
        category: "Web Application • PHP & MySQL",
        image: "assets/portfolio6.png",
        description:
          "A collaborative digital library that empowers university students and teachers to share notes, previous examination questions, and study guides. Built with security and ease-of-use as core tenets, it includes automated file validation, categorized subject listings, and fast full-text searching.",
        highlights: [
          "MIME-type validation and size restriction safeguards on multi-format file uploads.",
          "Hierarchical subject, semester, and course taxonomy filtering.",
          "Student download counter, rating system, and peer review feedback.",
          "Centralized admin queue for reviewing and approving newly submitted lecture notes.",
        ],
        stack: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3"],
        github: "https://github.com/Mumtaj-A",
      },
      snake: {
        title: "Classic Snake Game Engine",
        category: "Algorithmic Game Logic • C++",
        image: "assets/portfolio2.png",
        description:
          "An algorithmic 2D grid game engine developed in modern C++. The project demonstrates core computer science principles including 2D coordinate transformation, real-time non-blocking input handling, collision boundary algorithms, dynamic speed throttling, and persistent high-score tracking.",
        highlights: [
          "Zero external dependencies: pure standard C++ implementation.",
          "Dynamic velocity scaling based on snake length and score thresholds.",
          "Efficient coordinate queue data structure for smooth segment body updates.",
          "Boundary wrapping and obstacle collision state management.",
        ],
        stack: ["C++", "Data Structures", "Algorithms", "Game Logic"],
        github: "https://github.com/Mumtaj-A/Snake-game-in-cpp",
      },
    };

    triggerButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const projectKey = btn.getAttribute("data-project");
        const data = projectData[projectKey];
        if (!data) return;

        modalContent.innerHTML = `
          <img src="${data.image}" alt="${data.title}" class="modal-hero-img" loading="lazy" />
          <span class="modal-category">${data.category}</span>
          <h3 class="modal-title" id="modal-title">${data.title}</h3>
          <p class="modal-desc">${data.description}</p>
          <div class="modal-highlights">
            <h4>Key Architectural Highlights</h4>
            <ul>
              ${data.highlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="modal-tech-stack">
            ${data.stack.map((tag) => `<span class="tech-tag">${tag}</span>`).join("")}
          </div>
          <div class="modal-actions">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <i class="fab fa-github"></i>
              <span>View Repository on GitHub</span>
            </a>
            <a href="#contact" class="btn btn-secondary modal-contact-trigger">
              <i class="fas fa-comments"></i>
              <span>Discuss Similar Project</span>
            </a>
          </div>
        `;

        const modalContact = modalContent.querySelector(".modal-contact-trigger");
        modalContact?.addEventListener("click", () => {
          modal.close();
        });

        triggerHaptic(15);
        modal.showModal();
      });
    });

    closeBtn?.addEventListener("click", () => modal.close());

    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        modal.close();
      }
    });
  };

  /* --------------------------------------------------------------------------
     9. ACCESSIBLE CONTACT FORM VALIDATION & ACTIONS
     -------------------------------------------------------------------------- */
  const initContactForm = () => {
    const form = document.getElementById("contact-form");
    const emailFallbackBtn = document.getElementById("email-fallback-btn");
    const WHATSAPP_NUMBER = "919151542665";

    if (!form) return;

    // Synchronize ARIA invalid state with visual :user-invalid state
    const syncAria = (input) => {
      if (!input || !input.checkValidity) return;
      const isInvalid = input.matches(":user-invalid") || input.classList.contains("user-invalid-fallback");
      input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    };

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => syncAria(field));
      field.addEventListener("input", () => {
        if (field.hasAttribute("aria-invalid")) syncAria(field);
      });
    });

    const getFormData = () => {
      const name = form.querySelector("#contact-name")?.value.trim() || "";
      const email = form.querySelector("#contact-email")?.value.trim() || "";
      const subject = form.querySelector("#contact-subject")?.value || "New Project Inquiry";
      const message = form.querySelector("#contact-message")?.value.trim() || "";
      return { name, email, subject, message };
    };

    const validateForm = () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return false;
      }
      return true;
    };

    // Primary: WhatsApp Message
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerHaptic(12);

      if (!validateForm()) {
        const firstInvalid = form.querySelector(":invalid");
        firstInvalid?.focus();
        showToast("Please fill in your name, email, and message to send.");
        return;
      }

      const { name, email, subject, message } = getFormData();
      const text = encodeURIComponent(
        `Hello Mumtaj,\n\nName: ${name}\nEmail: ${email}\nInquiry: ${subject}\n\nMessage:\n${message}`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
      showToast("Opening WhatsApp to send your message...");
    });

    // Secondary: Direct Email Client Draft
    emailFallbackBtn?.addEventListener("click", () => {
      triggerHaptic(10);
      const { name, email, subject, message } = getFormData();
      const subjectText = name ? `[Portfolio] ${subject} - ${name}` : `[Portfolio] Project Inquiry`;
      const bodyText = message
        ? `Name: ${name}\nEmail: ${email}\nInquiry Type: ${subject}\n\nMessage:\n${message}`
        : `Hi Mumtaj,\n\nI would like to discuss a project with you.`;
      const mailtoUrl = `mailto:alimumtaj132@gmail.com?subject=${encodeURIComponent(
        subjectText
      )}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailtoUrl;
    });
  };

  /* --------------------------------------------------------------------------
     10. COPY TO CLIPBOARD WITH TOAST
     -------------------------------------------------------------------------- */
  const initCopyToClipboard = () => {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        triggerHaptic(15);

        const textToCopy = btn.getAttribute("data-copy");
        if (!textToCopy) return;

        let success = false;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            success = true;
          }
        } catch (err) {}

        if (!success) {
          try {
            const textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            textarea.style.position = "fixed";
            textarea.style.top = "0";
            textarea.style.left = "0";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            success = document.execCommand("copy");
            document.body.removeChild(textarea);
          } catch (e) {}
        }

        if (success) {
          const icon = btn.querySelector("i");
          if (icon) {
            icon.className = "fas fa-check";
            setTimeout(() => {
              icon.className = "far fa-copy";
            }, 2000);
          }
          showToast(`Copied to clipboard: ${textToCopy}`);
        } else {
          showToast(`Could not copy: ${textToCopy}`);
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     11. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    const handleScroll = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      if (scrollPos > 300) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerHaptic(10);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  /* --------------------------------------------------------------------------
     12. FOOTER YEAR UPDATE
     -------------------------------------------------------------------------- */
  const initFooterYear = () => {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  // Run all initialization routines
  initTheme();
  initNavbar();
  initTyping();
  initLiquidGlass();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initCopyToClipboard();
  initBackToTop();
  initFooterYear();
});
