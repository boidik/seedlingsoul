/* ==========================================================================
   Aiswarya Chakravorty | Seedling Soul Institute
   CMS Data Hydration + Interactive Slideshow, Galleries, and Lightbox
   ========================================================================== */

(function () {
  "use strict";

  const isSubPage = document.body.classList.contains("page-sub");
  const basePath = isSubPage ? "../" : "";

  const QUOTE_SVG =
    '<svg class="quote-mark-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 19.7 200 161.209" aria-hidden="true">' +
    '<path d="M78.2 19.8L85.7 33c.8 1.4 1.7 2.9 2.7 4.5-3.9 2.3-7.7 4.7-11.5 6.9-12.7 7.3-24.2 16.2-33.4 27.8-8.9 11.2-13 24.1-14.3 38.5 4.4 0 8.6-.4 12.8.1 6.8.7 13.9 1.1 20.3 3.3 13.1 4.4 19.5 14.3 20.7 27.9.6 7.4-.5 14.4-4.2 20.9-7.8 13.6-20.5 19.7-37.3 17.5-21.8-2.6-33.5-13.5-38.7-36.3-1.2-5.3-1.9-10.7-2.8-16v-15.4c.2-.6.5-1.2.6-1.9 1-10 4-19.3 8.8-28.1 11.1-20.4 27-36.3 46.3-48.9 7.2-4.7 14.5-9.4 21.8-14.1.2.1.4.1.7.1z"></path>' +
    '<path d="M189.4 19.8c3.5 5.8 6.9 11.6 10.6 17.8-1.7 1-3.4 2.1-5.1 3-13.4 7.8-26.3 16.1-36.8 27.9-10.7 12-15.9 26-17.4 42.3 1.4 0 2.8-.1 4.2 0 8.3.6 16.8.2 24.8 2.1 18.9 4.4 26.1 18.9 24.8 36.6-1.3 16.9-15.3 30.5-31.9 31.3-12.2.6-23.9-1.1-33.5-9.5-8.7-7.6-12.6-17.9-15.1-28.8-7.2-32.2 2.1-59.7 23.9-83.6 11-12 23.8-21.8 37.6-30.3 4.5-2.8 8.8-5.8 13.3-8.8h.6z"></path>' +
    "</svg>";

  const MAP_PIN_SVG =
    '<svg class="clinic-map-icon" viewBox="0 0 200 200" aria-hidden="true">' +
    '<path d="M157.367 66.82c-3.105-14.146-10.205-25.614-21.1-34.083-14.606-11.356-31.093-15.144-48.998-11.261-10.993 2.385-20.647 7.708-28.696 15.821-8.462 8.531-13.882 18.86-16.109 30.7-1.122 5.953-1.262 11.473-.43 16.874.862 5.609 2.729 10.685 4.442 14.912 4.273 10.539 9.918 20.076 14.358 27.205 8.241 13.235 17.874 26.672 29.45 41.082a248.399 248.399 0 0 0 3.199 3.874l6.694 8.057 5.455-6.944c13.755-16.57 25.171-32.357 34.9-48.262 6.309-10.316 10.816-19.203 14.182-27.969 3.898-10.164 4.793-20.259 2.653-30.006zM119.04 91.152c-5.093 5.141-11.835 7.976-18.984 7.983h-.025c-14.797.001-26.848-12.115-26.872-27.02-.023-14.812 11.962-26.911 26.717-26.972 7.134-.006 13.868 2.764 18.978 7.868 5.141 5.136 7.982 11.955 8 19.2.019 7.109-2.756 13.835-7.814 18.941z"></path>' +
    "</svg>";

  function resolveAsset(path) {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
    return basePath + path.replace(/^\/+/, "");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInlineMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  async function fetchJson(relPath) {
    const res = await fetch(basePath + relPath, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch " + relPath);
    return res.json();
  }

  /* ------------------------------------------------------------------------
     CMS Hydration: Footer (All Pages)
     ------------------------------------------------------------------------ */
  async function hydrateFooter() {
    try {
      const site = await fetchJson("data/site.json");
      const emailEl = document.querySelector(".footer-email");
      if (emailEl && site.email) {
        emailEl.textContent = site.email;
        emailEl.href = "mailto:" + site.email;
      }
      const phoneEl = document.querySelector(".footer-phone");
      if (phoneEl && site.phoneDisplay) {
        phoneEl.textContent = site.phoneDisplay;
        phoneEl.href = "tel:" + (site.phoneTel || site.phoneDisplay.replace(/\s+/g, ""));
      }
      const copyEl = document.querySelector(".footer-copyright");
      if (copyEl && site.copyright) {
        copyEl.textContent = site.copyright;
      }
      const socialLinks = document.querySelectorAll(".social-row .social-link");
      const urls = [site.whatsappUrl, site.facebookUrl, site.instagramUrl, site.linkedinUrl];
      socialLinks.forEach((a, i) => {
        if (urls[i]) a.href = urls[i];
      });
    } catch (_) {
      /* Keep static fallback */
    }
  }

  /* ------------------------------------------------------------------------
     CMS Hydration: Home Page
     ------------------------------------------------------------------------ */
  async function hydrateHome() {
    if (!document.body.classList.contains("page-home")) return;
    try {
      const data = await fetchJson("data/home.json");

      const setText = (sel, val) => {
        const el = document.querySelector(sel);
        if (el && val !== undefined) el.textContent = val;
      };

      setText(".hero-lead", data.heroLead);
      setText(".hero-name", data.heroName);
      setText(".hero-subtitle", data.heroSubtitle);
      setText(".hero-rci", data.heroRci);
      setText(".hero-cta-btn", data.heroCtaText);

      setText("#about-preview-heading", data.aboutTitle);
      setText(".about-preview-name", data.aboutName);
      setText(".know-more-btn", data.aboutCtaText);

      const detailsEl = document.querySelector(".about-preview-details");
      if (detailsEl && Array.isArray(data.aboutDetails)) {
        const regLine = data.aboutRegNo
          ? `<p>REGN. NO.: <strong>${escapeHtml(data.aboutRegNo)}</strong></p>`
          : "";
        const lines = data.aboutDetails.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
        detailsEl.innerHTML = regLine + lines;
      }

      const aboutPhotoEl = document.querySelector(".about-preview-photo");
      if (aboutPhotoEl && data.aboutPhoto) {
        aboutPhotoEl.src = resolveAsset(data.aboutPhoto);
      }

      setText("#expertise-heading", data.expertiseHeading);
      const expGrid = document.querySelector(".expertise-grid");
      if (expGrid && Array.isArray(data.expertiseItems)) {
        expGrid.innerHTML = data.expertiseItems
          .map(
            (item, i) =>
              `<div class="expertise-item"><span class="expertise-num">${i + 1}.</span><p class="expertise-title">${escapeHtml(item)}</p></div>`
          )
          .join("");
      }

      setText("#getting-help-heading", data.gettingHelpTitle);
      const wcImg = document.querySelector(".wordcloud-img");
      if (wcImg && data.gettingHelpImage) {
        wcImg.src = resolveAsset(data.gettingHelpImage);
      }
      setText(".getting-help-copy", data.gettingHelpText);

      const slideshow = document.querySelector("[data-quote-slideshow]");
      if (slideshow && Array.isArray(data.quotes) && data.quotes.length > 0) {
        const track = slideshow.querySelector(".quote-slides-track");
        const dotsWrap = slideshow.querySelector(".slideshow-dots");
        if (track && dotsWrap) {
          track.innerHTML = data.quotes
            .map(
              (q, i) =>
                `<article class="quote-slide${i === 0 ? " is-active" : ""}" style="background-color:${escapeHtml(
                  q.bgColor || "#FADCD6"
                )}" aria-hidden="${i === 0 ? "false" : "true"}">` +
                `<div class="quote-slide-inner">${QUOTE_SVG}<div class="quote-body">` +
                `<p class="quote-text">${escapeHtml(q.text)}</p>` +
                `<p class="quote-author">${escapeHtml(q.author)}</p>` +
                `</div></div></article>`
            )
            .join("");

          dotsWrap.innerHTML = data.quotes
            .map(
              (_, i) =>
                `<li><button type="button" class="slideshow-dot${i === 0 ? " is-active" : ""}" aria-label="Slide ${
                  i + 1
                }" aria-selected="${i === 0 ? "true" : "false"}"></button></li>`
            )
            .join("");
        }
      }
    } catch (_) {
      /* Keep static fallback */
    }
  }

  /* ------------------------------------------------------------------------
     CMS Hydration: About Me Page
     ------------------------------------------------------------------------ */
  async function hydrateAbout() {
    const eventsContainer = document.querySelector(".events-section");
    if (!eventsContainer) return;
    try {
      const data = await fetchJson("data/about.json");

      const titleEl = document.querySelector("#about-me-title");
      if (titleEl && data.pageTitle) titleEl.textContent = data.pageTitle;
      const tagEl = document.querySelector(".about-tagline");
      if (tagEl && data.tagline) tagEl.textContent = data.tagline;
      const bioEl = document.querySelector(".about-bio-text");
      if (bioEl && data.bio) bioEl.innerHTML = formatInlineMarkdown(data.bio);
      const ctaEl = document.querySelector(".about-cta-btn");
      if (ctaEl && data.ctaText) ctaEl.textContent = data.ctaText;
      const portraitEl = document.querySelector(".about-portrait-img");
      if (portraitEl && data.portrait) portraitEl.src = resolveAsset(data.portrait);

      if (Array.isArray(data.events)) {
        eventsContainer.innerHTML = data.events
          .map((ev, idx) => {
            const imgs = Array.isArray(ev.images) ? ev.images : [];
            const themeClass = ev.colorTheme === "lime" ? "event-card--lime" : "event-card--peach";
            const reverse = idx % 2 === 1;
            const navControls =
              imgs.length > 1
                ? `<button type="button" class="pro-gallery-btn pro-gallery-btn--prev" data-gallery-prev aria-label="Previous image">&#10094;</button>` +
                  `<button type="button" class="pro-gallery-btn pro-gallery-btn--next" data-gallery-next aria-label="Next image">&#10095;</button>`
                : "";

            const galleryHtml =
              `<div class="pro-gallery" data-gallery aria-roledescription="carousel" aria-label="Event Gallery ${idx + 1}">` +
              `<div class="pro-gallery-stage">` +
              imgs
                .map(
                  (img, i) =>
                    `<div class="pro-gallery-slide${i === 0 ? " is-active" : ""}">` +
                    `<img src="${escapeHtml(resolveAsset(img.src))}" alt="${escapeHtml(
                      img.alt || ""
                    )}" class="pro-gallery-img" data-zoomable />` +
                    `</div>`
                )
                .join("") +
              `</div>${navControls}` +
              `<span class="pro-gallery-counter" data-gallery-counter>1/${Math.max(1, imgs.length)}</span>` +
              `</div>`;

            const cardHtml = `<div class="event-card ${themeClass}"><p>${escapeHtml(ev.description)}</p></div>`;

            return `<div class="event-row${reverse ? " event-row--reverse" : ""}">${
              reverse ? cardHtml + galleryHtml : galleryHtml + cardHtml
            }</div>`;
          })
          .join("");
      }
    } catch (_) {
      /* Keep static fallback */
    }
  }

  /* ------------------------------------------------------------------------
     CMS Hydration: Appointments Page
     ------------------------------------------------------------------------ */
  async function hydrateAppointments() {
    const clinicList = document.querySelector(".clinic-list");
    if (!clinicList) return;
    try {
      const data = await fetchJson("data/appointments.json");

      const introEl = document.querySelector(".appointments-intro");
      if (introEl && data.intro) introEl.textContent = data.intro;

      if (Array.isArray(data.clinics)) {
        clinicList.innerHTML = data.clinics
          .map(
            (c) =>
              `<article class="clinic-card">` +
              `<h2 class="clinic-name">${escapeHtml(c.name)}</h2>` +
              `<a href="${escapeHtml(c.mapUrl)}" target="_blank" rel="noopener noreferrer" class="clinic-location">${escapeHtml(c.area)}</a>` +
              `<p class="clinic-days">${escapeHtml(c.days)}</p>` +
              `<a href="${escapeHtml(c.mapUrl)}" target="_blank" rel="noopener noreferrer" class="clinic-map-tab" aria-label="${escapeHtml(
                c.name
              )} location on Google Maps">${MAP_PIN_SVG}</a>` +
              `</article>`
          )
          .join("");
      }

      const callBtn = document.querySelector(".call-book-btn");
      if (callBtn) {
        if (data.bookingPhone) callBtn.href = "tel:" + data.bookingPhone.replace(/\s+/g, "");
        const span = callBtn.querySelector("span");
        if (span && data.callButtonText) span.textContent = data.callButtonText;
      }
    } catch (_) {
      /* Keep static fallback */
    }
  }

  /* ------------------------------------------------------------------------
     Interactive Initializers
     ------------------------------------------------------------------------ */
  function initSlideshow() {
    const slideshow = document.querySelector("[data-quote-slideshow]");
    if (!slideshow) return;
    const slides = Array.from(slideshow.querySelectorAll(".quote-slide"));
    const dots = Array.from(slideshow.querySelectorAll(".slideshow-dot"));
    const prevBtn = slideshow.querySelector("[data-slide-prev]");
    const nextBtn = slideshow.querySelector("[data-slide-next]");
    if (slides.length === 0) return;

    let currentIndex = 0;
    let timer = null;

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === currentIndex);
        slide.setAttribute("aria-hidden", i === currentIndex ? "false" : "true");
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === currentIndex);
        dot.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      });
    }

    function startAuto() {
      stopAuto();
      timer = window.setInterval(() => goToSlide(currentIndex + 1), 6000);
    }

    function stopAuto() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goToSlide(i);
        startAuto();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        startAuto();
      });
    }

    slideshow.addEventListener("mouseenter", stopAuto);
    slideshow.addEventListener("mouseleave", startAuto);

    goToSlide(0);
    startAuto();
  }

  function initGalleries() {
    const galleries = Array.from(document.querySelectorAll("[data-gallery]"));
    galleries.forEach((gallery) => {
      const slides = Array.from(gallery.querySelectorAll(".pro-gallery-slide"));
      const counter = gallery.querySelector("[data-gallery-counter]");
      const prevBtn = gallery.querySelector("[data-gallery-prev]");
      const nextBtn = gallery.querySelector("[data-gallery-next]");
      if (slides.length === 0) return;

      let idx = 0;
      let autoTimer = null;

      function show(newIdx) {
        idx = (newIdx + slides.length) % slides.length;
        slides.forEach((s, i) => {
          s.classList.toggle("is-active", i === idx);
        });
        if (counter) {
          counter.textContent = `${idx + 1}/${slides.length}`;
        }
      }

      function startGalleryAuto() {
        if (slides.length <= 1) return;
        stopGalleryAuto();
        autoTimer = window.setInterval(() => show(idx + 1), 5000);
      }

      function stopGalleryAuto() {
        if (autoTimer) {
          window.clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          show(idx - 1);
          startGalleryAuto();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          show(idx + 1);
          startGalleryAuto();
        });
      }

      gallery.addEventListener("mouseenter", stopGalleryAuto);
      gallery.addEventListener("mouseleave", startGalleryAuto);

      show(0);
      startGalleryAuto();
    });
  }

  function initLightbox() {
    const modal = document.getElementById("lightboxModal");
    const modalImg = document.getElementById("lightboxImg");
    const modalCaption = document.getElementById("lightboxCaption");
    const modalClose = document.getElementById("lightboxClose");

    function openLightbox(src, alt) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      modalImg.alt = alt || "";
      if (modalCaption) {
        modalCaption.textContent = alt || "";
      }
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-zoomable]");
      if (!target) return;
      const img = target.tagName === "IMG" ? target : target.querySelector("img");
      if (img) openLightbox(img.src, img.alt);
    });

    if (modalClose) {
      modalClose.addEventListener("click", closeLightbox);
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeLightbox();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  async function boot() {
    await Promise.all([hydrateFooter(), hydrateHome(), hydrateAbout(), hydrateAppointments()]);
    initSlideshow();
    initGalleries();
    initLightbox();
  }

  boot();
})();
