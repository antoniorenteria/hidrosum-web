/* ═══════════════════════════════════════════
   HIDROSUM · interacciones y animaciones
   ═══════════════════════════════════════════ */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Header al hacer scroll ── */
  const header = document.getElementById("header");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  /* ── Menú móvil ── */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("nav-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );

  /* ── Reveal on scroll ── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Burbujas flotantes ── */
  function spawnBubbles(container, count) {
    if (!container || reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const size = 10 + Math.random() * 58;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.setProperty("--sway", (Math.random() * 60 - 30).toFixed(0) + "px");
      b.style.animationDuration = (9 + Math.random() * 14).toFixed(1) + "s";
      b.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
      b.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);
      container.appendChild(b);
    }
  }
  // Menos burbujas en pantallas pequeñas: misma magia, mejor rendimiento
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  spawnBubbles(document.getElementById("heroBubbles"), isMobile ? 12 : 26);
  spawnBubbles(document.querySelector(".cta__bubbles"), isMobile ? 8 : 16);
  spawnBubbles(document.querySelector(".section__bubbles"), isMobile ? 7 : 14);

  /* ── Lightbox de galería ── */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "Imagen ampliada");
  lightbox.innerHTML =
    '<button class="lightbox__close" aria-label="Cerrar imagen">✕</button><img src="" alt="">';
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");

  document.querySelectorAll(".gallery__item").forEach((fig) => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox__close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ── FAQ: cerrar los demás al abrir uno ── */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((other) => other !== item && (other.open = false));
    });
  });

  /* ── Año en el footer ── */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
