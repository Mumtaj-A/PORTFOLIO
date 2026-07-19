document.documentElement.classList.add("js-enabled");

const initPortfolio = () => {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const backToTopButton = document.querySelector(".back-to-top");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  try {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  } catch (err) {
    console.warn("Could not set footer year:", err);
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  const initThreePortfolioScene = () => {
    const canvas = document.getElementById("three-portfolio-scene");
    if (!canvas || !window.THREE || prefersReducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const group = new THREE.Group();
    scene.add(group);

    const primary = new THREE.Color(0x2dd4bf);
    const accent = new THREE.Color(0xf59e0b);
    const blue = new THREE.Color(0x38bdf8);

    const shapes = [
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.TorusGeometry(0.8, 0.2, 16, 48),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
    ];

    const positions = [
      [-4.6, 2.2, -1.5],
      [4.2, 1.2, -2.2],
      [-2.2, -2.3, -1],
      [3.4, -2.1, -1.6],
      [0.6, 2.9, -3],
    ];

    positions.forEach((position, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: [primary, accent, blue][index % 3],
        roughness: 0.45,
        metalness: 0.35,
        transparent: true,
        opacity: 0.58,
      });
      const mesh = new THREE.Mesh(shapes[index % shapes.length], material);
      mesh.position.set(...position);
      mesh.rotation.set(index * 0.4, index * 0.25, index * 0.15);
      mesh.scale.setScalar(0.75 + index * 0.08);
      group.add(mesh);
    });

    const pointsGeometry = new THREE.BufferGeometry();
    const pointCount = 120;
    const positionsArray = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i += 1) {
      positionsArray[i * 3] = (Math.random() - 0.5) * 14;
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsArray, 3),
    );
    const particles = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.018,
        transparent: true,
        opacity: 0.55,
      }),
    );
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.0025;
      group.rotation.x += 0.001;
      group.children.forEach((mesh, index) => {
        mesh.rotation.x += 0.003 + index * 0.0007;
        mesh.rotation.y += 0.004 + index * 0.0006;
      });
      particles.rotation.y -= 0.0008;
      camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();
  };

  const initDepthCards = () => {
    if (prefersReducedMotion || !canHover) return;

    const cards = document.querySelectorAll(
      ".depth-card, .about-content-card, .skills-card, .service-card, .portfolio-card, .contact-info-card, .contact-form-card",
    );

    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = (y / rect.height - 0.5) * -10;
        const rotateY = (x / rect.width - 0.5) * 10;
        card.style.setProperty("--rotate-x", `${rotateX}deg`);
        card.style.setProperty("--rotate-y", `${rotateY}deg`);
        card.style.setProperty("--shine-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--shine-y", `${(y / rect.height) * 100}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");
      });
    });
  };

  try {
    initThreePortfolioScene();
  } catch (err) {
    console.warn("3D scene could not start:", err);
  }

  initDepthCards();

  const navGlow = document.querySelector(".nav-glow");

  const updateNavbarState = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };

  updateNavbarState();

  window.addEventListener("scroll", updateNavbarState, {
    passive: true,
  });

  if (navbar && navGlow) {
    navbar.addEventListener("mousemove", (e) => {
      const rect = navbar.getBoundingClientRect();

      navGlow.style.left = e.clientX - rect.left + "px";
      navGlow.style.top = e.clientY - rect.top + "px";

      navGlow.style.opacity = "1";
    });

    navbar.addEventListener("mouseleave", () => {
      navGlow.style.opacity = "0";
    });
  }

  const updateBackToTopVisibility = () => {
    backToTopButton?.classList.toggle("is-visible", window.scrollY > 400);
  };

  updateBackToTopVisibility();
  window.addEventListener("scroll", updateBackToTopVisibility, {
    passive: true,
  });

  backToTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  const closeMobileMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (window.innerWidth <= 768 && navToggle && navMenu) {
        closeMobileMenu();
      }

      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      event.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 90,

        behavior: "smooth",
      });
    });
  });

  const setActiveLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  };

  setActiveLink();

  window.addEventListener("scroll", setActiveLink, {
    passive: true,
  });

  const revealAnimatedContent = () => {
    document
      .querySelectorAll(
        ".about-content-card, .skills-card, .service-card, .portfolio-card, .contact-info-card, .contact-form-card",
      )
      .forEach((el) => el.classList.add("animated"));

    document.querySelectorAll(".contact-item").forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateX(0)";
    });
  };

  const typingEl = document.querySelector(".typing");
  if (typingEl && window.Typed) {
    new Typed(".typing", {
      strings: [
        "Web Designer",
        "Web Developer",
        "Full Stack Developer",
        "UI/UX Designer",
      ],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  } else if (typingEl) {
    typingEl.textContent = "Web Developer";
  }

  if (!("IntersectionObserver" in window)) {
    revealAnimatedContent();
    return;
  }

  const skillBars = document.querySelectorAll(".skill-progress");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute("data-width");
          entry.target.style.width = `${width}%`;
          entry.target.classList.add("animated");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          setTimeout(() => {
            entry.target.classList.add("animated");
          }, index * 100);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
  );

  document
    .querySelectorAll(".service-card")
    .forEach((el) => animateObserver.observe(el));
  document
    .querySelectorAll(".portfolio-card")
    .forEach((el) => animateObserver.observe(el));
  document
    .querySelectorAll(".about-content-card, .skills-card")
    .forEach((el) => animateObserver.observe(el));
  document
    .querySelectorAll(".contact-info-card, .contact-form-card")
    .forEach((el) => animateObserver.observe(el));

  const contactItems = document.querySelectorAll(".contact-item");
  const contactItemsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateX(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.2 },
  );

  contactItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";
    item.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    contactItemsObserver.observe(item);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      if (href && href !== "#") {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          const offsetTop =
            target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
        }
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 768 &&
      navToggle &&
      navMenu &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navToggle && navMenu) {
      closeMobileMenu();
    }
  });
};

document.addEventListener("DOMContentLoaded", initPortfolio, { once: true });

const initContactForm = () => {
  const WHATSAPP_NUMBER = "919151542665";
  const form = document.querySelector("#contact-form");
  if (!form || form.__whatsappFormHandlerAttached) return;

  form.__whatsappFormHandlerAttached = true;
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = form.querySelector("#name");
    const messageInput = form.querySelector("#message");
    const name = nameInput?.value.trim() || "";
    const message = messageInput?.value.trim() || "";

    if (!name || !message) {
      const firstEmpty = !name ? nameInput : messageInput;
      firstEmpty?.focus();
      return;
    }

    const text = encodeURIComponent(
      `Hello Mumtaj,\n\nMy name is ${name}.\n\n${message}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  });
};

const initPortfolioProgress = () => {
  const progressBlocks = document.querySelectorAll(".portfolio-progress");
  if (!progressBlocks.length) return;

  const animateProgress = (fillEl, percentEl, target) => {
    fillEl.style.width = `${target}%`;

    const start = 0;
    const end = parseInt(target, 10);
    const duration = 900;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      percentEl.textContent = `${value}%`;
      if (fillEl.parentElement) {
        fillEl.parentElement.setAttribute("aria-valuenow", String(value));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        percentEl.textContent = `${end}%`;
        if (fillEl.parentElement) {
          fillEl.parentElement.setAttribute("aria-valuenow", String(end));
        }
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const block = entry.target;
          const fill = block.querySelector(".progress-fill");
          const percent = block.querySelector(".progress-percent");
          const target = fill?.dataset?.progress || null;

          if (
            fill &&
            percent &&
            target &&
            !block.classList.contains("progress-animated")
          ) {
            block.classList.add("progress-animated");
            requestAnimationFrame(() => {
              animateProgress(fill, percent, target);
            });
          }

          obs.unobserve(block);
        }
      });
    },
    { threshold: 0.35 },
  );

  progressBlocks.forEach((block) => {
    const fill = block.querySelector(".progress-fill");
    const percent = block.querySelector(".progress-percent");
    if (fill) fill.style.width = "0%";
    if (percent) percent.textContent = "0%";
    observer.observe(block);
  });
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initContactForm();
    initPortfolioProgress();
  },
  { once: true },
);
// Highlight active section in mobile menu
const mobileLinks = document.querySelectorAll(".mobile-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 150;

    if (window.scrollY >= top) {
      current = section.getAttribute("id");
    }
  });

  mobileLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});
