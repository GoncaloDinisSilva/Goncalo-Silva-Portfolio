// Detect if device supports hover (desktop) or not (touch)
const supportsHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

// Section Selection
const homeSection = document.getElementById("home-section");
const aboutSection = document.getElementById("about-section");
const projectsSection = document.getElementById("projects-section");

// nav links
const navHome = document.getElementById("nav-home");
const navAbout = document.getElementById("nav-about");
const navProjects = document.getElementById("nav-projects");

// helper to fade one out then fade the other in
function getCurrentSection() {
  return [homeSection, aboutSection, projectsSection].find(
    (sec) => !sec.classList.contains("hidden")
  );
}

/**
 * returns the nav link that currently has .active
 */
function getCurrentNavLink() {
  return [navHome, navAbout, navProjects].find((link) =>
    link.classList.contains("active")
  );
}

/**
 * Show targetSection by fading out whatever is visible now
 */
function showSection(targetSection, targetNavLink) {
  const fromSection = getCurrentSection();
  const fromNav = getCurrentNavLink();

  // no-op if you clicked the already-active tab
  if (fromSection === targetSection) return;

  // if we're sliding into About, shut off the slider button animations
  if (targetSection.id === "about-section") {
    document.querySelector(".slider-selector").classList.add("disable-unfill");
  }

  // fade out old
  fromSection.classList.add("fade-out-left");
  fromNav.classList.remove("active");
  fromNav.removeAttribute("aria-current");

  fromSection.addEventListener("animationend", function _onOut() {
    fromSection.removeEventListener("animationend", _onOut);
    fromSection.classList.add("hidden");
    fromSection.classList.remove("fade-out-left");

    // fade in new
    targetSection.classList.remove("hidden");
    targetSection.classList.add("fade-in-left");
    targetNavLink.classList.add("active");
    targetNavLink.setAttribute("aria-current", "page");

    targetSection.addEventListener("animationend", function _onIn() {
      targetSection.removeEventListener("animationend", _onIn);
      targetSection.classList.remove("fade-in-left");

      // if we're sliding into About, shut off the slider button animations
      if (targetSection.id === "about-section") {
        const tabWrapper = document.querySelector(".slider-selector");
        tabWrapper.classList.add("disable-unfill");

        // install a one-time listener: only when the user real-hover-enters
        function liftSuppression() {
          tabWrapper.classList.remove("disable-unfill");
          tabWrapper.removeEventListener("mouseenter", liftSuppression);
        }
        tabWrapper.addEventListener("mouseenter", liftSuppression);
      }
      
      // REFRESH SLIDERS when entering their section
      if (targetSection.id === "about-section") {
         if (window.sliderLanguages) window.sliderLanguages.refresh();
         if (window.sliderSoftware) window.sliderSoftware.refresh();
      }
      if (targetSection.id === "projects-section") {
         if (window.sliderProjects) window.sliderProjects.refresh();
      }
    });
  });
}

// wire up clicks
navHome.addEventListener("click", (e) => {
  e.preventDefault();
  showSection(homeSection, navHome);
});
navAbout.addEventListener("click", (e) => {
  e.preventDefault();
  showSection(aboutSection, navAbout);
});
navProjects.addEventListener("click", (e) => {
  e.preventDefault();
  showSection(projectsSection, navProjects);
});
// initialize default state
homeSection.classList.remove("hidden");
aboutSection.classList.add("hidden");
projectsSection.classList.add("hidden");
navHome.classList.add("active");
navHome.setAttribute("aria-current", "page");

// ── Dark/Light Toggle ──
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// initialize theme from localStorage
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  themeIcon.classList.toggle("fa-moon", !isLight);
  themeIcon.classList.toggle("fa-sun", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// ── Accent‐Color Palette ── //
(function () {
  const defaultAccent = "#007bff";
  const savedAccent = localStorage.getItem("accentColor") || defaultAccent;
  const swatches = document.querySelectorAll(".color-swatch");
  const paletteBtn = document.getElementById("color-palette-toggle");
  const paletteContainer = document.querySelector(".color-palette-container");

  function setAccent(color) {
    document.documentElement.style.setProperty("--line-color", color);
    document.body.style.setProperty("--line-color", color);
    localStorage.setItem("accentColor", color);
    swatches.forEach((s) =>
      s.classList.toggle("active", s.dataset.color === color)
    );
  }

  // initialize
  setAccent(savedAccent);

  // on touch devices, click to open/close palette
  if (!supportsHover) {
    paletteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      paletteContainer.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      paletteContainer.classList.remove("open");
    });
  }

  swatches.forEach((swatch) =>
    swatch.addEventListener("click", () => setAccent(swatch.dataset.color))
  );
})();

// ── Profile Card Reveal (tap to open, click outside to close) ── //
(function () {
  // desktop hover is handled purely in CSS
  if (supportsHover) return;

  const cards = document.querySelectorAll(".profile-container");
  cards.forEach((c) => {
    c.addEventListener("click", (e) => {
      e.stopPropagation();
      // close any other open card
      cards.forEach((x) => x !== c && x.classList.remove("open"));
      c.classList.toggle("open");
    });
  });

  document.addEventListener("click", () =>
    cards.forEach((c) => c.classList.remove("open"))
  );
})();

// ── Translations + Typewriter ──
const currentYear = new Date().getFullYear();

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "footer.copy": `© ${currentYear} Gonçalo Silva. All rights reserved.`,
    typewriter: [
      "Web Content Editor",
      "Code Enthusiast",
      "Programming Learner",
    ],
    "about.heading": "About Me",
    "about.description":
      "Hi, I'm Gonçalo! I'm a Web Content Editor and Web Developer who loves crafting responsive, user-interactive experiences. I'm passionate about clean and modern designs, scalable code and learning new tools!",
    "slider.languages": "Languages",
    "slider.softwares": "Softwares",
    "projects.title": "My Projects",
    "projects.project-one":
      "A simple to-do list made with React (node.js) that uses LocalStorage to save all tasks in the browser.",
    "projects.project-two":
      "A simple minefield game to play with your friends locally! This game was developed using HTML, CSS and JavaScript.",
    "projects.coming-soon": "More projects coming soon…",
  },
  pt: {
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.contact": "Contato",
    "footer.copy": `© ${currentYear} Gonçalo Silva. Todos os direitos reservados.`,
    typewriter: [
      "Editor de Conteúdo Web",
      "Apaixonado por Código",
      "Aprendiz de Programação",
    ],
    "about.heading": "Sobre Mim",
    "about.description":
      "Olá, sou o Gonçalo! Sou um editor de conteúdo web e desenvolvedor de websites que adora criar experiências responsivas e interativas com o utilizador. Sou apaixonado por designs simples e modernos, código escalável e por aprender novas ferramentas!",
    "slider.languages": "Linguagens",
    "slider.softwares": "Programas",
    "projects.title": "Os Meus Projetos",
    "projects.project-one":
      "Uma simples lista de tarefas feita com React (node.js) que usa Localstorage para guardar todas as tarefas no browser.",
    "projects.project-two":
      "Um simples jogo de campo de minas para jogares localmente com os teus amigos! Este jogo foi desenvolvido com HTML, CSS e JavaScript.",
    "projects.coming-soon": "Mais projetos em breve…",
  },
};

let currentLang = localStorage.getItem("lang") || "en";
const typeEl = document.getElementById("typewriter");
let twIndex = 0;
let charIndex = 0;
let isDeleting = false;
let twTimer;

// ── Apply translations and reset the typewriter ── //
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerText = translations[currentLang][el.dataset.i18n];
  });
  resetTypewriter(translations[currentLang].typewriter);
}

// ── Typewriter loop ── //
function typewriterLoop(texts) {
  const full = texts[twIndex];
  charIndex += isDeleting ? -1 : 1;
  typeEl.innerText = full.slice(0, charIndex);

  if (!isDeleting && charIndex === full.length) {
    isDeleting = true;
    clearTimeout(twTimer);
    twTimer = setTimeout(() => typewriterLoop(texts), 1000);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    twIndex = (twIndex + 1) % texts.length;
  }
  twTimer = setTimeout(() => typewriterLoop(texts), isDeleting ? 80 : 100);
}

// ── Start or reset the loop ── //
function resetTypewriter(texts) {
  clearTimeout(twTimer);
  twIndex = charIndex = 0;
  isDeleting = false;
  typewriterLoop(texts);
}

// language switcher clicks
document.querySelectorAll(".lang-switcher .lang").forEach((btn) =>
  btn.addEventListener("click", () => {
    const sel = btn.dataset.lang;
    if (sel === currentLang) return;
    currentLang = sel;
    localStorage.setItem("lang", sel);
    document
      .querySelectorAll(".lang-switcher .lang")
      .forEach((l) => l.classList.toggle("active", l.dataset.lang === sel));
    applyTranslations();
  })
);

// initialize translations and typewriter
document
  .querySelectorAll(`.lang-${currentLang}`)
  .forEach((l) => l.classList.add("active"));
applyTranslations();

// ── Hamburger Menu & Swipe-to-Close ──
const hamburger = document.getElementById("hamburger");
const hamburgerIcon = document.getElementById("hamburger-icon");
const navLinks = document.getElementById("nav-links");
const menuOverlay = document.getElementById("menu-overlay");

function closeMobileMenu() {
  navLinks.classList.remove("show");
  menuOverlay.classList.remove("show");
  hamburgerIcon.classList.replace("fa-times", "fa-bars");
  hamburger.setAttribute("aria-label", "Toggle menu");
}

function openMobileMenu() {
  navLinks.classList.add("show");
  menuOverlay.classList.add("show");
  hamburgerIcon.classList.replace("fa-bars", "fa-times");
  hamburger.setAttribute("aria-label", "Close menu");
}

// Toggle menu on hamburger click
hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("show");
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close menu when overlay is clicked
menuOverlay.addEventListener("click", closeMobileMenu);

// Swipe-to-close gesture (mobile only)
let touchStartX = null;
navLinks.addEventListener("touchstart", (e) => {
  if (!navLinks.classList.contains("show")) return;
  touchStartX = e.touches[0].clientX;
});
navLinks.addEventListener("touchmove", (e) => {
  if (touchStartX === null) return;
  const currentX = e.touches[0].clientX;
  const deltaX = currentX - touchStartX;
  if (deltaX > 0) {
    navLinks.style.transform = `translateX(${deltaX}px)`;
  }
});
navLinks.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - touchStartX;
  navLinks.style.transform = ""; // reset any inline transform
  if (deltaX > 50) {
    closeMobileMenu();
  }
  touchStartX = null;
});

// ── Swipe-to-Open Gesture (mobile) w/ Slider Guard ──
let openTouchStartX = null;

// 1) Start tracking only if touch did *not* originate inside a slider
document.addEventListener(
  "touchstart",
  (e) => {
    if (navLinks.classList.contains("show")) return;
    if (e.target.closest(".slider-container")) {
      openTouchStartX = null;
      return;
    }
    openTouchStartX = e.touches[0].clientX;
  },
  { passive: true }
);

// 2) Give user visual feedback (optional)
document.addEventListener(
  "touchmove",
  (e) => {
    if (openTouchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - openTouchStartX;
    if (deltaX < 0) {
      const pct = Math.min(100, 100 + (deltaX / window.innerWidth) * 100);
      navLinks.style.transform = `translateX(${pct}%)`;
    }
  },
  { passive: true }
);

// 3) On release, decide whether to open
document.addEventListener("touchend", (e) => {
  if (openTouchStartX === null) return;
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - openTouchStartX;
  navLinks.style.transform = "";
  if (deltaX < -50 && openTouchStartX > window.innerWidth * 0.7) {
    openMobileMenu();
  }
  openTouchStartX = null;
});

// ── Auto-close Mobile Menu on Nav Link Click ── //
document.querySelectorAll("#nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) {
      closeMobileMenu();
    }
  });
});

/* ── CV Preview Modal ── */
const cvBtn = document.getElementById("cv-preview-footer");
const cvModal = document.getElementById("cv-modal");
const cvClose = document.getElementById("cv-close");
const cvFrame = document.getElementById("cv-frame");

cvBtn.addEventListener("click", () => {
  const lang = localStorage.getItem("lang") || "en";
  const file =
    lang === "pt"
      ? "../assets/pdf/Goncalo_Dinis_Alves_dos_Santos_Silva_CV_PT.pdf"
      : "../assets/pdf/Goncalo_Dinis_Alves_dos_Santos_Silva_CV_EN.pdf";

  if (/Mobi|Android/i.test(navigator.userAgent)) {
    window.open(file, "_blank");
  } else {
    cvFrame.src = file;
    cvModal.classList.add("show");
  }
});

cvClose.addEventListener("click", () => {
  cvModal.classList.remove("show");
  cvFrame.src = "";
});

cvModal.addEventListener("click", (e) => {
  if (e.target === cvModal) {
    cvModal.classList.remove("show");
    cvFrame.src = "";
  }
});

// ── PIXEL-ART SQUARE & ICON GENERATOR ──
(function pixelArt() {
  const overlay = document.getElementById("pixel-overlay");
  const MAX_PARTICLES = 50; 
  
  // original square sizes
  const squareSizes = [6, 10, 14, 20];
  // icon sizes for FontAwesome brands
  const iconSizes = [24, 28, 32];
  // FontAwesome brand classes
  const iconClasses = [
    "fab fa-html5", "fab fa-css3-alt", "fab fa-square-js", "devicon-typescript-plain",
    "devicon-coffeescript-original", "devicon-azuresqldatabase-plain", "fab fa-python",
    "fab fa-java", "fab fa-php", "devicon-c-original", "devicon-cplusplus-plain",
    "devicon-csharp-plain", "fab fa-rust", "devicon-ruby-plain", "devicon-clojure-line",
    "devicon-crystal-original", "devicon-dart-plain", "devicon-elixir-plain",
    "devicon-elm-plain", "devicon-erlang-plain", "devicon-fsharp-plain",
    "devicon-fortran-original", "devicon-go-original-wordmark", "devicon-haskell-plain",
    "devicon-haxe-plain", "devicon-julia-plain-wordmark", "devicon-kotlin-plain",
    "devicon-lua-plain", "devicon-nim-plain", "devicon-objectivec-plain",
    "devicon-ocaml-plain", "devicon-perl-plain", "devicon-prolog-plain",
    "devicon-purescript-original", "devicon-r-plain", "devicon-racket-plain",
    "devicon-scala-plain", "fab fa-swift", "devicon-powershell-plain",
    "devicon-powershell-plain", "fab fa-sass", "devicon-tailwindcss-original",
    "fab fa-bootstrap", "devicon-arduino-plain", "fab fa-react", "devicon-redux-original",
    "fab fa-angular", "devicon-vuejs-plain", "devicon-svelte-plain", "fab fa-magento",
    "fab fa-drupal", "fab fa-wordpress", "devicon-flutter-plain", "devicon-firebase-plain",
  ];
  
  const ICON_PROB = 0.2;
  const DURATION = 1000;
  const BUFFER = 100;
  const occupied = [];

  function isColliding(x, y, size) {
    return occupied.some(
      (box) =>
        x < box.x + box.w &&
        x + size > box.x &&
        y < box.y + box.h &&
        y + size > box.y
    );
  }

  function spawnElement() {
    if (occupied.length >= MAX_PARTICLES) return;

    const isIcon = Math.random() < ICON_PROB;
    let el, size;

    if (isIcon) {
      size = iconSizes[Math.floor(Math.random() * iconSizes.length)];
      el = document.createElement("i");
      iconClasses[Math.floor(Math.random() * iconClasses.length)]
        .split(" ")
        .forEach((c) => el.classList.add(c));
      el.classList.add("pixel-icon");
      el.style.fontSize = size + "px";
    } else {
      size = squareSizes[Math.floor(Math.random() * squareSizes.length)];
      el = document.createElement("div");
      el.classList.add("pixel-square");
      el.style.width = size + "px";
      el.style.height = size + "px";
    }

    let x, y, attempts = 0;
    do {
      x = Math.random() * (overlay.clientWidth - size);
      y = Math.random() * (overlay.clientHeight - size);
      attempts++;
    } while (isColliding(x, y, size) && attempts < 10);

    if (attempts >= 10 && isColliding(x, y, size)) return;

    el.style.left = x + "px";
    el.style.top = y + "px";
    occupied.push({ x, y, w: size, h: size, el });
    overlay.appendChild(el);

    setTimeout(() => {
      if (el.parentNode === overlay) overlay.removeChild(el);
      const idx = occupied.findIndex((box) => box.el === el);
      if (idx > -1) occupied.splice(idx, 1);
    }, DURATION + BUFFER);
  }

  setInterval(spawnElement, 100);
})();

/* ── Letter jumping animation ── */
document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.querySelector(".main-title");
  if (!titleEl) return;

  const text = titleEl.textContent;
  titleEl.textContent = "";

  const lettersToAnimate = [];

  Array.from(text).forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    titleEl.appendChild(span);

    if (char.trim() !== "") {
      span.classList.add("letter");
      lettersToAnimate.push(span);
    }
  });

  const letterDelay = 200;
  const animationLength = 600;
  const pauseAfterCycle = 2000;

  function runSequence() {
    lettersToAnimate.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add("jump");
        setTimeout(() => {
          span.classList.remove("jump");
        }, animationLength);
      }, i * letterDelay);
    });
  }

  runSequence();
  const totalTime = (lettersToAnimate.length - 1) * letterDelay + animationLength + pauseAfterCycle;
  setInterval(runSequence, totalTime);
});

// Sparkle-on-click-or-hold
(function sparkleOnInteraction() {
  const SPARKLE_COUNT = 5;
  const DURATION = 600;
  const INTERVAL = 100;

  let holdInterval = null;
  let mouseX = 0, mouseY = 0;
  let moveListener = null;

  function spawnSparkles(x, y) {
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      document.body.appendChild(sparkle);

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 30;

      sparkle.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          {
            transform: `translate(-50%, -50%) translate(${
              Math.cos(angle) * distance
            }px, ${Math.sin(angle) * distance}px) scale(2)`,
            opacity: 0,
          },
        ],
        { duration: DURATION, easing: "ease-out", fill: "forwards" }
      );

      setTimeout(() => {
        if (sparkle.parentNode === document.body) document.body.removeChild(sparkle);
      }, DURATION);
    }
  }

  document.addEventListener("click", (e) => {
    if (e.button !== 0) return;
    spawnSparkles(e.clientX, e.clientY);
  });

  document.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    moveListener = (evt) => { mouseX = evt.clientX; mouseY = evt.clientY; };
    document.addEventListener("mousemove", moveListener);
    spawnSparkles(mouseX, mouseY);
    holdInterval = setInterval(() => { spawnSparkles(mouseX, mouseY); }, INTERVAL);
  });

  const stopHolding = () => {
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
    if (moveListener) {
      document.removeEventListener("mousemove", moveListener);
      moveListener = null;
    }
  };

  document.addEventListener("mouseup", stopHolding);
  document.addEventListener("mouseleave", stopHolding);
  
  // FIX: Stop spawning if the user starts dragging an image
  document.addEventListener("dragstart", stopHolding);
})();


/* ── SLIDER INIT (Infinite Loop + Mobile Projects Fix) ── */
window.addEventListener("load", () => {
  // 1) Initialize "About" sliders (Languages & Softwares)
  const langContainer = document.getElementById("languages-slider");
  const swContainer = document.getElementById("softwares-slider");
  
  if (langContainer && swContainer) {
    window.sliderLanguages = initSlider(langContainer, { mobileCards: 3 });
    window.sliderSoftware = initSlider(swContainer, { mobileCards: 3 });

    // Tab switching logic
    document.querySelectorAll(".slider-selector button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".slider-selector button")
          .forEach((b) => b.classList.toggle("active", b === btn));

        const targetId = btn.dataset.target;
        [window.sliderLanguages, window.sliderSoftware].forEach((inst) => {
          if (!inst) return;
          const show = inst.container.id === targetId;
          inst.container.classList.toggle("hidden", !show);
          if (show) inst.refresh();
        });
      });
    });

    const activeBtn = document.querySelector(".slider-selector button.active");
    if (activeBtn) activeBtn.click();
  }

  // 2) Initialize "Projects" Slider
  const projContainer = document.getElementById("projects-slider-container");
  if (projContainer) {
    window.sliderProjects = initSlider(projContainer, { 
      mobileCards: 1, 
      desktopDisabled: true 
    });
  }
});

/**
 * Enhanced initSlider to support different configurations and Infinite Looping
 */
function initSlider(container, config = { mobileCards: 3, desktopDisabled: false }) {
  if (!container) return null;

  const track = container.querySelector(".slider-track");
  let slides = Array.from(track.children);
  const dotsWrap = container.querySelector(".slider-dots");
  const viewport = container.querySelector(".slider-viewport");
  const btnLeft = container.querySelector(".slider-btn.left");
  const btnRight = container.querySelector(".slider-btn.right");

  let totalSlides = 0;
  let maxStart = 0;
  let slideIndex = 0;
  let cardWidth = 0;
  let gap = 0;

  function isMobile() {
    return window.innerWidth <= 600;
  }

  function recompute() {
    slides = Array.from(track.children);
    totalSlides = slides.length;

    if (config.desktopDisabled && !isMobile()) {
      track.style.transform = '';
      track.style.transition = '';
      return;
    }

    const cardsPerView = isMobile() ? config.mobileCards : 5;
    maxStart = Math.max(totalSlides - cardsPerView, 0);

    const style = getComputedStyle(track);
    gap = parseInt(style.columnGap || style.gap, 10) || 0;

    // Fix for Projects on Mobile: Calculate width based on Viewport
    if (config.mobileCards === 1 && isMobile()) {
        cardWidth = viewport.getBoundingClientRect().width;
        slides.forEach(s => s.style.minWidth = `${cardWidth}px`);
    } else {
        if (slides[0]) {
             slides.forEach(s => s.style.minWidth = ''); 
             cardWidth = slides[0].getBoundingClientRect().width;
        }
    }
  }

  function updatePosition(smooth = true) {
    if (config.desktopDisabled && !isMobile()) return;

    // ── Infinite Loop Logic ──
    if (slideIndex < 0) {
        slideIndex = maxStart; // Go to last slide
    } else if (slideIndex > maxStart) {
        slideIndex = 0;        // Go to first slide
    }
    // ─────────────────────────

    const offset = slideIndex * (cardWidth + gap);
    track.style.transition = smooth ? "transform 0.3s ease" : "none";
    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
  }

  function setupDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";

    if (config.desktopDisabled && !isMobile()) {
        dotsWrap.style.display = 'none';
        return;
    } else {
        dotsWrap.style.display = 'flex';
    }

    const pages = maxStart + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      if (i === slideIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        slideIndex = i;
        updatePosition();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((dot, idx) => {
      dot.classList.toggle("active", idx === slideIndex);
    });
  }

  if (btnLeft) {
    btnLeft.addEventListener("click", () => {
      slideIndex--;
      updatePosition();
    });
  }
  if (btnRight) {
    btnRight.addEventListener("click", () => {
      slideIndex++;
      updatePosition();
    });
  }

  // Touch / Swipe logic
  let startX = 0;
  if (viewport) {
    viewport.addEventListener("touchstart", (e) => {
      if (config.desktopDisabled && !isMobile()) return;
      startX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      if (config.desktopDisabled && !isMobile()) return;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      
      if (Math.abs(dx) > 50) {
        if (dx > 0) slideIndex--;
        else slideIndex++;
        updatePosition();
      }
    }, { passive: true });
  }

  function refresh() {
    recompute();
    setupDots();
    updatePosition(false);
  }

  window.addEventListener("resize", refresh);
  refresh();

  return { container, refresh };
}

// ─── Invert-spotlight that follows pointer on each card ───
if (supportsHover) {
  document.querySelectorAll(".card").forEach((card) => {
    const RADIUS = 32; // px, adjust to taste

    card.addEventListener("mouseenter", () => {
      // expand mask to desired size
      card.style.setProperty("--mask-size", RADIUS + "px");
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      // compute pointer coords relative to the card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mask-x", x + "px");
      card.style.setProperty("--mask-y", y + "px");
    });

    card.addEventListener("mouseleave", () => {
      // collapse mask
      card.style.setProperty("--mask-size", "0px");
    });
  });
}