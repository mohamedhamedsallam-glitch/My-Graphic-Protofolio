/* ==========================================================================
   PORTFOLIO 2026 — INTERACTIVE DECK ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  let lightboxList = [];
  let currentLightboxIdx = 0;

  /* ------------------------------------------------------------------------
     1. POPULATE PROFILE & CONTACT
  ------------------------------------------------------------------------ */
  function renderProfile() {
    const p = data.profile;
    const bioEl = document.getElementById("aboutBio");
    if (bioEl) bioEl.textContent = p.bio;
    document.getElementById("emailDisplay").textContent = p.email;
    const phoneEl = document.getElementById("phoneDisplay");
    if (phoneEl && p.phone) phoneEl.textContent = p.phone;

    document.getElementById("contactSocials").innerHTML = p.socials
      .map(
        (s) => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-pill">
          <span>${s.label}</span>
          <span style="opacity:0.6">↗</span>
        </a>`
      )
      .join("");
  }

  /* ------------------------------------------------------------------------
     2. LIVE CODED SLIDE RENDERERS (Social 3-Card Grids, Logofolio 8-Logo Grids, Branding Editorial Slides)
  ------------------------------------------------------------------------ */
  function renderSocialSlides() {
    const container = document.getElementById("socialSlidesContainer");
    if (!container) return;

    const items = data.socialSlides;
    const flatCards = [];
    items.forEach((slide) => {
      (slide.cards || []).forEach((card) => {
        flatCards.push({
          id: card.id,
          title: card.title,
          categoryLabel: slide.categoryLabel,
          image: card.image
        });
      });
    });

    let runningCardIdx = 0;

    container.innerHTML = items
      .map((slide, rowIdx) => {
        const cardsHtml = (slide.cards || [])
          .map((card, cIdx) => {
            const globalIdx = runningCardIdx++;
            return `
              <article
                class="live-social-card"
                data-card-idx="${globalIdx}"
                style="--stagger:${cIdx}"
                tabindex="0"
                role="button"
                aria-label="View ${card.title}"
              >
                <div class="live-social-card-frame">
                  <img
                    src="${card.image}?v=4k"
                    alt="${card.title}"
                    loading="lazy"
                    decoding="async"
                  />
                  <div class="live-card-overlay">
                    <span class="live-card-tag">${slide.categoryLabel}</span>
                    <span class="live-card-zoom">⤢ VIEW DESIGN</span>
                  </div>
                </div>
              </article>`;
          })
          .join("");

        return `
          <section class="deck-slide deck-live-social-slide" data-slide-idx="${rowIdx}">
            <div class="live-social-ambient" aria-hidden="true"></div>
            <div class="live-social-stage">
              <div class="live-social-grid">
                ${cardsHtml}
              </div>
            </div>
          </section>`;
      })
      .join("");

    container.querySelectorAll(".live-social-card").forEach((cardEl) => {
      const openFn = () => openLightbox(flatCards, Number(cardEl.getAttribute("data-card-idx")));
      cardEl.addEventListener("click", openFn);
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFn();
        }
      });
    });
  }

  function renderLogofolioSlides() {
    const container = document.getElementById("logofolioSlidesContainer");
    if (!container) return;

    const allLogos = [];
    data.logofolioSlides.forEach((slide) => {
      (slide.logos || []).forEach((lg) => {
        allLogos.push({
          id: lg.id,
          title: lg.name,
          categoryLabel: slide.categoryLabel,
          image: lg.image
        });
      });
    });

    let runningLogoIdx = 0;

    container.innerHTML = data.logofolioSlides
      .map((slide, sIdx) => {
        const count = slide.logos ? slide.logos.length : 0;
        const cols = count > 10 ? 6 : count > 8 ? 5 : 4;
        const logosHtml = (slide.logos || [])
          .map((lg, lIdx) => {
            const globalIdx = runningLogoIdx++;
            return `
              <button
                type="button"
                class="live-logo-cell"
                data-logo-idx="${globalIdx}"
                style="--stagger:${lIdx}"
                aria-label="Zoom ${lg.name}"
              >
                <img src="${lg.image}?v=mnu11" alt="${lg.name}" loading="lazy" decoding="async" />
                <span class="live-logo-caption">${lg.name}</span>
              </button>`;
          })
          .join("");

        return `
          <section class="deck-slide deck-live-logofolio-slide" data-slide-idx="${sIdx}">
            <div class="live-logofolio-streaks" aria-hidden="true"></div>
            <div class="live-logofolio-stage">
              <header class="live-logofolio-top">
                <div class="lg-mini-emblem" aria-label="LOGOFOLIO">
                  <div class="lg-mini-stack">
                    <span>LOG</span>
                    <span>FOLI</span>
                  </div>
                  <span class="lg-mini-o">O</span>
                </div>
              </header>
              <div class="live-logofolio-grid cols-${cols}">
                ${logosHtml}
              </div>
            </div>
          </section>`;
      })
      .join("");

    container.querySelectorAll(".live-logo-cell").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(allLogos, Number(btn.getAttribute("data-logo-idx")));
      });
    });
  }

  function renderBrandingSlides() {
    const container = document.getElementById("brandingSlidesContainer");
    if (!container) return;

    const items = data.brandingSlides;

    container.innerHTML = items
      .map((slide, idx) => {
        const swatchesHtml = (slide.colors || [])
          .map(
            (hex) => `
            <button
              type="button"
              class="live-brand-swatch"
              data-hex="${hex}"
              style="--swatch:${hex}"
              title="Copy ${hex}"
              aria-label="Copy color ${hex}"
            >
              <span>${hex}</span>
            </button>`
          )
          .join("");

        return `
          <section class="deck-slide deck-live-branding-slide" data-slide-idx="${idx}">
            <div class="live-branding-ambient" aria-hidden="true"></div>
            <div class="live-branding-stage">
              <!-- Left Editorial Column (Real Typography + Transparent Brand Mark + Live Bio) -->
              <div class="live-branding-left">
                <div class="live-br-heading" aria-label="BRANDING">
                  <span>BRAN</span>
                  <span>DING</span>
                </div>

                <div class="live-br-logo-wrap">
                  <img src="${slide.logo}?v=live1" alt="${slide.brandName} Logo" class="live-br-logo-img" loading="lazy" decoding="async" />
                </div>

                <div class="live-br-story">
                  <p class="live-br-desc">${slide.description}</p>
                  <div class="live-br-swatches">
                    ${swatchesHtml}
                  </div>
                </div>
              </div>

              <!-- Right Interactive Bento Showcase Board -->
              <div
                class="live-branding-right"
                data-brand-idx="${idx}"
                tabindex="0"
                role="button"
                aria-label="Zoom ${slide.title} Brand Board"
              >
                <img src="${slide.boardImage}?v=live1" alt="${slide.title}" class="live-br-board-img" loading="lazy" decoding="async" />
                <div class="slide-hover-badge">
                  <span>${slide.categoryLabel}</span>
                  <span>⤢ FULL BOARD</span>
                </div>
              </div>
            </div>
          </section>`;
      })
      .join("");

    container.querySelectorAll(".live-branding-right").forEach((boardEl) => {
      const openFn = () => openLightbox(items, Number(boardEl.getAttribute("data-brand-idx")));
      boardEl.addEventListener("click", openFn);
      boardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFn();
        }
      });
    });

    container.querySelectorAll(".live-brand-swatch").forEach((sw) => {
      sw.addEventListener("click", (e) => {
        e.stopPropagation();
        copyText(sw.getAttribute("data-hex"));
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. FULL-SLIDE LIGHTBOX
  ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");

  function renderLightboxSlide() {
    const item = lightboxList[currentLightboxIdx];
    if (!item) return;
    lightboxImg.src = `${item.image}?v=4k`;
    lightboxImg.alt = item.title;
    lightboxCategory.textContent = item.categoryLabel;
    lightboxTitle.textContent = item.title;
    lightboxCounter.textContent = `${String(currentLightboxIdx + 1).padStart(2, "0")} / ${String(lightboxList.length).padStart(2, "0")}`;
  }

  function openLightbox(list, index) {
    lightboxList = list;
    currentLightboxIdx = index;
    renderLightboxSlide();
    lightboxModal.classList.add("open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxModal.classList.remove("open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => {
    currentLightboxIdx = (currentLightboxIdx - 1 + lightboxList.length) % lightboxList.length;
    renderLightboxSlide();
  });
  document.getElementById("lightboxNext").addEventListener("click", () => {
    currentLightboxIdx = (currentLightboxIdx + 1) % lightboxList.length;
    renderLightboxSlide();
  });
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightboxModal.classList.contains("open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") document.getElementById("lightboxPrev").click();
      if (e.key === "ArrowRight") document.getElementById("lightboxNext").click();
    }
  });

  /* ------------------------------------------------------------------------
     5. CLIPBOARD & TOAST
  ------------------------------------------------------------------------ */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(`Copied ${text}`));
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(`Copied ${text}`);
    }
  }

  document.getElementById("copyEmailBtn").addEventListener("click", () => {
    copyText(data.profile.email);
    const hint = document.getElementById("copyHint");
    hint.textContent = "COPIED ✓";
    setTimeout(() => (hint.textContent = "COPY"), 2000);
  });

  const copyPhoneBtn = document.getElementById("copyPhoneBtn");
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener("click", () => {
      copyText(data.profile.phone);
      const hint = document.getElementById("copyPhoneHint");
      hint.textContent = "COPIED ✓";
      setTimeout(() => (hint.textContent = "COPY"), 2000);
    });
  }

  /* ------------------------------------------------------------------------
     6. SCROLL PROGRESS & REVEAL
  ------------------------------------------------------------------------ */
  const scrollProgress = document.getElementById("scrollProgress");

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
    },
    { passive: true }
  );

  // Initialize all sections
  renderProfile();
  renderSocialSlides("all");
  renderLogofolioSlides();
  renderBrandingSlides();

  /* ------------------------------------------------------------------------
     7. FULL-VIEWPORT SLIDE TRANSITION ENGINE & HUD NAVIGATION
  ------------------------------------------------------------------------ */
  let allDeckSlides = [];
  let activeSlideIndex = 0;
  let slideObserver = null;

  const hudCurrentEl = document.getElementById("hudCurrent");
  const hudTotalEl = document.getElementById("hudTotal");
  const hudPrevBtn = document.getElementById("hudPrevBtn");
  const hudNextBtn = document.getElementById("hudNextBtn");
  const topNavChips = document.querySelectorAll(".nav-chip");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  function getSlideSectionKey(slideEl) {
    if (!slideEl) return "hero";
    if (slideEl.id) return slideEl.id;
    if (slideEl.closest(".deck-social-wrapper")) return "social-media";
    if (slideEl.closest(".deck-logofolio-wrapper")) return "logofolio";
    if (slideEl.closest(".deck-branding-wrapper")) return "branding";
    return "hero";
  }

  function updateHud(index) {
    activeSlideIndex = index;
    if (hudCurrentEl) {
      hudCurrentEl.textContent = String(index + 1).padStart(2, "0");
    }
    if (hudTotalEl) {
      hudTotalEl.textContent = String(allDeckSlides.length).padStart(2, "0");
    }
    if (hudPrevBtn) hudPrevBtn.disabled = index <= 0;
    if (hudNextBtn) hudNextBtn.disabled = index >= allDeckSlides.length - 1;

    // Highlight active section in Top Navigation Dock
    const activeKey = getSlideSectionKey(allDeckSlides[index]);
    topNavChips.forEach((chip) => {
      chip.classList.toggle("active", chip.getAttribute("data-section") === activeKey);
    });
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= allDeckSlides.length) return;
    allDeckSlides[index].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setupFullScreenSlides(scrollFirstSocial = false) {
    if (slideObserver) {
      slideObserver.disconnect();
    }

    allDeckSlides = Array.from(document.querySelectorAll(".deck-slide"));

    slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slide = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            allDeckSlides.forEach((s) => {
              if (s !== slide) s.classList.remove("slide-active");
            });
            slide.classList.add("slide-active");
            slide.classList.add("slide-visited");
            const idx = allDeckSlides.indexOf(slide);
            if (idx !== -1) updateHud(idx);
          }
        });
      },
      {
        threshold: [0.2, 0.48, 0.75]
      }
    );

    allDeckSlides.forEach((slide, idx) => {
      if (idx === 0) {
        slide.classList.add("slide-active", "slide-visited");
      }
      slideObserver.observe(slide);
    });

    updateHud(activeSlideIndex < allDeckSlides.length ? activeSlideIndex : 0);

    if (scrollFirstSocial) {
      const firstSocial = document.querySelector("#socialSlidesContainer .deck-slide");
      if (firstSocial) {
        firstSocial.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  setupFullScreenSlides(false);

  if (hudPrevBtn) {
    hudPrevBtn.addEventListener("click", () => scrollToSlide(activeSlideIndex - 1));
  }
  if (hudNextBtn) {
    hudNextBtn.addEventListener("click", () => scrollToSlide(activeSlideIndex + 1));
  }

  // Smooth Wheel Controller (One Wheel Gesture = One Clean Slide Transition)
  let wheelLocked = false;
  window.addEventListener(
    "wheel",
    (e) => {
      if (lightboxModal.classList.contains("open")) return;
      if (Math.abs(e.deltaY) < 18) return;
      e.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      if (e.deltaY > 0) {
        scrollToSlide(activeSlideIndex + 1);
      } else {
        scrollToSlide(activeSlideIndex - 1);
      }
      setTimeout(() => {
        wheelLocked = false;
      }, 680);
    },
    { passive: false }
  );

  // Fullscreen Mode Toggle
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullScreen);
  }

  // Keyboard navigation between slides when Lightbox is closed
  document.addEventListener("keydown", (e) => {
    if (lightboxModal.classList.contains("open")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      scrollToSlide(activeSlideIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      scrollToSlide(activeSlideIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToSlide(allDeckSlides.length - 1);
    } else if (e.key === "f" || e.key === "F") {
      toggleFullScreen();
    }
  });
});
