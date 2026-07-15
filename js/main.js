/* ═══════════════════════════════════════════
   HIDROSUM · interacciones y animaciones
   ═══════════════════════════════════════════ */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 600px)").matches;

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
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Burbujas sobre fondos degradados (siempre vivas, también en móvil) ── */
  function spawnBubbles(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const size = (isMobile ? 8 : 10) + Math.random() * (isMobile ? 44 : 58);
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
  document.querySelectorAll(".bubbles-zone").forEach((zone) => {
    spawnBubbles(zone, isMobile ? 16 : 26);
  });

  /* ── Lightbox de galería con navegación ── */
  const galleryFigures = [...document.querySelectorAll(".gallery__item")];
  const photos = galleryFigures.map((fig) => ({
    src: fig.querySelector("img").src,
    alt: fig.querySelector("img").alt,
    caption: fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : ""
  }));

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "Galería de Hidrosum");
  lightbox.innerHTML =
    '<button class="lightbox__close" aria-label="Cerrar galería">✕</button>' +
    '<button class="lightbox__prev" aria-label="Foto anterior">‹</button>' +
    '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
    '<button class="lightbox__next" aria-label="Foto siguiente">›</button>';
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");
  const lbCaption = lightbox.querySelector("figcaption");
  let lbIndex = 0;

  function showPhoto(i) {
    lbIndex = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIndex].src;
    lbImg.alt = photos[lbIndex].alt;
    lbCaption.textContent = photos[lbIndex].caption + "  ·  " + (lbIndex + 1) + "/" + photos.length;
  }
  function openLightbox(i) {
    showPhoto(i);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  galleryFigures.forEach((fig, i) => fig.addEventListener("click", () => openLightbox(i)));
  lightbox.querySelector(".lightbox__prev").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(lbIndex - 1); });
  lightbox.querySelector(".lightbox__next").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(lbIndex + 1); });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox__close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
  });

  /* Swipe en el lightbox (móvil) */
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* ── Carrusel de beneficios: deslizar + clic abre galería ── */
  const carousel = document.getElementById("benefitCarousel");
  if (carousel) {
    // Clic en un beneficio → abre la galería en la foto relacionada
    carousel.querySelectorAll(".benefit").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (carousel.dataset.dragged === "1") return;
        openLightbox(parseInt(btn.dataset.photo || "0", 10));
      });
    });

    // Arrastre con mouse (en touch el scroll nativo ya funciona)
    let down = false, startX = 0, startScroll = 0, moved = 0;
    carousel.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = 0;
      startX = e.clientX;
      startScroll = carousel.scrollLeft;
      carousel.dataset.dragged = "0";
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) {
        carousel.classList.add("is-dragging");
        carousel.dataset.dragged = "1";
        carousel.scrollLeft = startScroll - dx;
      }
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      carousel.classList.remove("is-dragging");
      setTimeout(() => { carousel.dataset.dragged = "0"; }, 50);
    });

    // Autodesplazamiento suave hasta que el usuario interactúa
    if (!reducedMotion) {
      let auto = setInterval(() => {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: 1, behavior: "auto" });
        }
      }, 40);
      const stopAuto = () => { clearInterval(auto); auto = null; };
      ["pointerdown", "wheel", "touchstart"].forEach((ev) =>
        carousel.addEventListener(ev, stopAuto, { once: true, passive: true })
      );
    }
  }

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
