/* ==========================================================================
   AETHER — Premium Dynamic Web Application Architecture (app.js)
   ========================================================================== */

import { initializePremium3DScenes } from './3d-effects.js';
import { initWhatsAppContactHandler } from './app.whatsapp.js';
import { initWhatsAppFabVisibility } from './app.whatsapp-fab-check.js';



/* --------------------------------------------------------------------------
   1. ASYNCHRONOUS PROJECTS WORKLOAD HANDLER (WITH TOP CAP & EXTRA BADGE)
   -------------------------------------------------------------------------- */
async function orchestrateDynamicProjects() {
  const gridContainer = document.getElementById('projects-grid');
  const statusTextPlaceholder = document.getElementById('pipeline-status-text');
  if (!gridContainer) return;

  try {
    const { PROJECTS_CONFIG } = await import('./projects-config.js');
    const totalProjectsCount = Array.isArray(PROJECTS_CONFIG)
      ? PROJECTS_CONFIG.length
      : 0;

    // 1. DYNAMIC TOP COUNTER STATUS (Updates the top of the HTML layout)
    if (statusTextPlaceholder) {
      if (totalProjectsCount > 6) {
        const extraCount = totalProjectsCount - 6;
        statusTextPlaceholder.textContent = `SYSTEMS ONLINE (+${extraCount} ARCHIVED PIPELINES)`;
        statusTextPlaceholder.classList.add('text-purple-400');
      } else {
        statusTextPlaceholder.textContent = 'SYSTEMS ONLINE';
        statusTextPlaceholder.classList.remove('text-purple-400');
      }
    }

    // 2. MAIN GRID LIMITATION (Strictly cap at the top 6 main projects)
    const projectsArray = Array.isArray(PROJECTS_CONFIG)
      ? PROJECTS_CONFIG.slice(0, 6)
      : [];

    gridContainer.innerHTML = '';

    projectsArray.forEach((project) => {
      const cardWrapper = document.createElement('article');
      cardWrapper.className =
        'group relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col justify-between project-card';

      const glowHelper = document.createElement('div');
      glowHelper.className =
        'absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10';
      cardWrapper.appendChild(glowHelper);

      // Wrapper for Top Content (Media + Text) to keep layout equal
      const topContentWrapper = document.createElement('div');

      // --- Media Player Container (Hover Video Engine) ---
      const mediaSection = document.createElement('div');
      mediaSection.className =
        'relative w-full aspect-video bg-black/40 border-b border-white/10 overflow-hidden rounded-t-2xl project-card-media';

      if (project.videoSrc || project.image) {
        const imgMarkup = project.image
          ? `<img src="${project.image}" alt="${project.title}" loading="lazy" class="w-full h-full object-cover object-center project-thumbnail-img transition-opacity duration-300" />`
          : `<div class="w-full h-full bg-slate-900"></div>`;

        mediaSection.innerHTML = imgMarkup + `
          <div class="video-preview-viewport absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-20 flex items-center justify-center bg-black/90"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
          <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase text-violet-300">
            Hover Preview
          </div>
        `;
      }
      topContentWrapper.appendChild(mediaSection);

      // --- Card Content Setup ---
      const contentContainer = document.createElement('div');
      contentContainer.className = 'p-6 space-y-4';

      const titleNode = document.createElement('h3');
      titleNode.className = 'text-xl font-bold font-sans text-white tracking-tight group-hover:text-violet-300 transition-colors';
      titleNode.textContent = project.title;

      const taglineNode = document.createElement('p');
      taglineNode.className = 'text-sm text-slate-400 font-medium leading-relaxed max-w-none';
      taglineNode.textContent = project.tagline || project.description || '—';

      contentContainer.appendChild(titleNode);
      contentContainer.appendChild(taglineNode);

      // Tech Badges Pipeline
      const techWrapper = document.createElement('div');
      techWrapper.className = 'flex flex-wrap gap-1.5 pt-2';
      if (Array.isArray(project.tech)) {
        project.tech.forEach((techToken) => {
          const badge = document.createElement('span');
          badge.className =
            'text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 bg-white/5 text-gray-300 rounded-md border border-white/5 hover:bg-white/10';
          badge.textContent = techToken;
          techWrapper.appendChild(badge);
        });
      }
      contentContainer.appendChild(techWrapper);

      topContentWrapper.appendChild(contentContainer);
      cardWrapper.appendChild(topContentWrapper);

      // --- NEW: Card Action Footer (Open Button) ---
      const actionContainer = document.createElement('div');
      actionContainer.className = 'p-6 pt-0 flex items-center gap-3';

      const liveLink = project.liveUrl ? project.liveUrl : '#';
      const targetAttr = project.liveUrl ? 'target="_blank" rel="noopener noreferrer"' : '';

      actionContainer.innerHTML = `
        <a href="${liveLink}" ${targetAttr} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500/30 hover:border-violet-400 transition-all shadow-lg shadow-violet-500/10 project-card-action">
          <span>Open</span>
          <svg class="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      `;
      cardWrapper.appendChild(actionContainer);

      gridContainer.appendChild(cardWrapper);

      // Used by hover engine
      cardWrapper.dataset.projectId = project.id || '';
      cardWrapper.dataset.videoSrc = project.videoSrc || '';
    });

    // Attach volatile hover video engine
    bindProjectHoverEngines();
  } catch (err) {
    console.error('❌ Dynamic projects orchestration pipeline failure:', err);
  }
}


/* --------------------------------------------------------------------------
   VOLATILE VIDEO PREVIEW HOVER ENGINE (memory-safe)
   -------------------------------------------------------------------------- */
function bindProjectHoverEngine(cardElement, videoSrc) {
  if (!cardElement || !videoSrc) return;

  const viewport = cardElement.querySelector('.video-preview-viewport');
  if (!viewport) return;

  viewport.classList.remove('opacity-100');
  viewport.classList.add(
    'absolute',
    'top-0',
    'left-0',
    'w-full',
    'h-full',
    'z-20'
  );

  if (cardElement.__projectHoverBound) return;
  cardElement.__projectHoverBound = true;

  const onEnter = () => {
    if (!videoSrc) return;

    viewport.innerHTML = '';

    const videoNode = document.createElement('video');
    videoNode.src = videoSrc;
    videoNode.muted = true;
    videoNode.loop = true;
    videoNode.playsInline = true;
    videoNode.setAttribute('preload', 'auto');
    videoNode.className = 'w-full h-full object-contain bg-black/20 rounded-2xl';

    viewport.appendChild(videoNode);

    viewport.style.opacity = '1';
    viewport.classList.remove('opacity-0');
    viewport.classList.add('opacity-100');

    const p = videoNode.play();
    if (p && typeof p.catch === 'function') p.catch(() => { });
  };

  const onLeave = () => {
    viewport.style.opacity = '0';
    viewport.classList.remove('opacity-100');
    viewport.classList.add('opacity-0');

    const video = viewport.querySelector('video');
    try {
      if (video && typeof video.pause === 'function') video.pause();
    } catch { }

    try {
      if (video) video.remove();
    } catch { }

    viewport.innerHTML = '';
  };

  cardElement.addEventListener('mouseenter', onEnter);
  cardElement.addEventListener('mouseleave', onLeave);
}

function bindProjectHoverEngines() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards || cards.length === 0) return;

  cards.forEach((card) => {
    const videoSrc = card.dataset.videoSrc || '';
    bindProjectHoverEngine(card, videoSrc);
  });
}

/* --------------------------------------------------------------------------
   Projects portal workflow: render all projects into an expanded view.
   -------------------------------------------------------------------------- */
async function initProjectsPortalWorkflow() {
  const trigger = document.getElementById('see-more-trigger');
  const closeBtn = document.getElementById('projects-portal-close');
  const portal = document.getElementById('projects-portal');
  const portalGrid = document.getElementById('projects-portal-grid');

  if (!trigger || !portal || !portalGrid || !closeBtn) return;

  const renderCards = async (targetEl, items) => {
    targetEl.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
    targetEl.appendChild(grid);

    const fallbackImg =
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80';

    items.forEach((project) => {
      const cardWrapper = document.createElement('article');
      cardWrapper.className =
        'group relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col justify-between project-card';

      const glowHelper = document.createElement('div');
      glowHelper.className =
        'absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10';
      cardWrapper.appendChild(glowHelper);

      const tagsMarkup = (project.tech || [])
        .map(
          (tag) =>
            `<span class="text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 bg-white/5 text-gray-300 rounded-md border border-white/5 hover:bg-white/10">${String(tag)}</span>`
        )
        .join('');

      const descriptionMarkup = project.tagline
        ? project.tagline
        : project.description || '—';

      const imgSrcMarkup = project.image
        ? project.image
        : fallbackImg;

      const liveLink = project.liveUrl ? project.liveUrl : '#';
      const targetAttr = project.liveUrl ? 'target="_blank" rel="noopener noreferrer"' : '';

      cardWrapper.innerHTML += `
        <div>
          <div class="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-black/40 border-b border-white/10 project-card-media">
            <img
              src="${imgSrcMarkup}"
              alt="${project.title}"
              loading="lazy"
              class="project-thumbnail-img w-full h-full object-cover transition-opacity duration-300"
            />
            <div class="video-preview-viewport absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-20 flex items-center justify-center bg-black/90"></div>

            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase text-violet-300">
              Hover Preview
            </div>
          </div>

          <div class="p-6 space-y-4">
            <h3 class="text-xl font-bold font-sans text-white tracking-tight group-hover:text-violet-300 transition-colors">${project.title}</h3>
            <p class="text-sm text-slate-400 font-medium leading-relaxed max-w-none">${descriptionMarkup}</p>
            <div class="flex flex-wrap gap-1.5 pt-2">${tagsMarkup}</div>
          </div>
        </div>

        <div class="p-6 pt-0 flex items-center gap-3">
          <a href="${liveLink}" ${targetAttr} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500/30 hover:border-violet-400 transition-all shadow-lg shadow-violet-500/10 project-card-action" data-project-id="${project.id}">
            <span>Open</span>
            <svg class="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      `;

      cardWrapper.dataset.projectId = project.id || '';
      cardWrapper.dataset.videoSrc = project.videoSrc || '';

      grid.appendChild(cardWrapper);
    });

    bindProjectHoverEngines();
  };

  const openPortal = async () => {
    const { PROJECTS_CONFIG } = await import('./projects-config.js');
    portal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    await renderCards(portalGrid, Array.isArray(PROJECTS_CONFIG) ? PROJECTS_CONFIG : []);
  };

  const closePortal = () => {
    portal.classList.add('hidden');
    document.body.style.overflow = '';

    document.querySelectorAll('.project-card').forEach((card) => {
      try {
        const viewport = card.querySelector('.video-preview-viewport');
        if (viewport) viewport.innerHTML = '';
      } catch { }
      card.__projectHoverBound = card.__projectHoverBound || false;
    });

    portalGrid.innerHTML = '';
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openPortal().catch(console.error);
  });

  closeBtn.addEventListener('click', () => closePortal());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !portal.classList.contains('hidden')) {
      closePortal();
    }
  });

  portal.addEventListener('click', (e) => {
    if (e.target === portal) closePortal();
  });
}

/* --------------------------------------------------------------------------
   2. 3D HOLOGRAPHIC HOVER MATRIX TILT ALGORITHM
   -------------------------------------------------------------------------- */
function initHologramHoverMatrix() {
  const hoverCards = document.querySelectorAll('.hologram-tilt-card');

  hoverCards.forEach((card) => {
    const innerBox = card.querySelector('.hologram-tilt-inner');
    if (!innerBox) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      innerBox.style.setProperty('--mouse-x', `${x}px`);
      innerBox.style.setProperty('--mouse-y', `${y}px`);
      innerBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      innerBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

/* --------------------------------------------------------------------------
   3. ULTRA-SMOOTH CUSTOM CYBER CURSOR ENGINE
   -------------------------------------------------------------------------- */
function initCustomCyberCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    dot.style.opacity = '1';
  });

  function renderCursorAnimation() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursorAnimation);
  }
  renderCursorAnimation();

  const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, .hologram-tilt-card, canvas'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('interactive'));
    el.addEventListener('mouseleave', () => ring.classList.remove('interactive'));
  });
}

/* --------------------------------------------------------------------------
   4. PRODUCTION PRELOADER LIFECYCLE
   -------------------------------------------------------------------------- */
function orchestrateWebsitePreloader() {
  const preloader = document.getElementById('page-preloader');
  if (!preloader) return;

  const dismiss = () => preloader.classList.add('finished');

  if (document.readyState === 'complete') {
    dismiss();
    return;
  }

  window.addEventListener('load', dismiss, { once: true });
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') dismiss();
  });
}

/* --------------------------------------------------------------------------
   5. SPLIT-LAYOUT CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedbackStatus = document.getElementById('form-feedback-status');
  const btnText = document.getElementById('submit-btn-text');

  if (!form || !feedbackStatus || !btnText) return;

  // Note: WhatsApp integration + validation intercepts the submit.
  // This handler only keeps the UI feedback in sync when needed.
  form.addEventListener('submit', () => {
    btnText.textContent = 'Transmitting Message...';
    const btn = form.querySelector('button');
    if (btn) btn.disabled = true;

    setTimeout(() => {
      // In WhatsApp flow, the page will typically open in a new tab.
      // Still keep UX consistent if user returns.
      feedbackStatus.classList.remove('hidden');
      btnText.textContent = 'Send Another Message →';
      if (btn) btn.disabled = false;

      setTimeout(() => {
        feedbackStatus.classList.add('hidden');
        btnText.textContent = 'Transmit Message →';
      }, 6000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   6. CINEMATIC SCROLL REVEAL UTILITIES
   -------------------------------------------------------------------------- */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   MAIN APPLICATION BOOTSTRAPPER
   -------------------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  console.log('✓ DOM Application Ready. Booting Core Architecture...');

  orchestrateWebsitePreloader();

  try {
    initializePremium3DScenes();
  } catch (err) {
    console.error('❌ Premium 3D scenes failed to initialize:', err);
  }

  // Render and wire the project hover pipeline
  orchestrateDynamicProjects().catch((err) => {
    console.error('❌ Dynamic projects load failed:', err);
  });

  initProjectsPortalWorkflow().catch?.((e) => console.error(e));

  try {
    initHologramHoverMatrix();
  } catch (e) {
    console.error(e);
  }
  try {
    initCustomCyberCursor();
  } catch (e) {
    console.error(e);
  }
  // Contact form is now WhatsApp integrated with validation.
  // Existing visual feedback handler is kept, but submit is intercepted by WhatsApp logic.
  try {
    initWhatsAppContactHandler({ formId: 'contact-form', phoneNumber: '917257896988' });
  } catch (e) {
    console.error(e);
  }

  try {
    initWhatsAppFabVisibility();
  } catch (e) {
    console.error(e);
  }


  try {
    initContactForm();
  } catch (e) {
    console.error(e);
  }

  try {
    initSmoothNav();
  } catch (e) {
    console.error(e);
  }
});