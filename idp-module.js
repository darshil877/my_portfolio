/* ==========================================================================
   AETHER — Live Integrated Development Pipeline (IDP) module
   ========================================================================== */

function getEl(sel, root = document) {
    return root.querySelector(sel);
}

function getAll(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
}

const FILES = {
    'Identity.json': {
        blocks: [
            { type: 'comment', text: '{' },
            { type: 'attr', text: '  "engineer": "Darshil Singh",' },
            { type: 'code', text: '  "academic_track": "B.Tech in Computer Science and Engineering (Software Engineering) // SRM KTR",' },


            { type: 'code', text: '  "specialization": "Software Engineering",' },





            { type: 'attr', text: '  "core_competence": [' },
            { type: 'code', text: '    "Vanilla Web Architecture",' },
            { type: 'code', text: '    "React.js & Node.js Systems",' },
            { type: 'code', text: '    "High-Fidelity WebGL Shaders",' },
            { type: 'code', text: '    "Premiere Pro & After Effects Production"' },

            { type: 'attr', text: '  ],' },

            { type: 'code', text: '  "development_philosophy": "Bridging the gap between raw full-stack backend stability and stunning interactive frontend performance.",' },
            { type: 'code', text: '  "operational_status": "Active // Pursuing High-Impact Technical Roles & Open Source Engineering",' },
            { type: 'code', text: '  "performance_guarantee": "Flawless rendering loops, strict responsive layout optimization, zero-clutter custom system design."' },

            { type: 'comment', text: '}' },
        ],
    },


    'Workflow.config.js': {
        blocks: [
            { type: 'comment', text: 'class DevelopmentPipeline {' },
            { type: 'fn', text: '  constructor() {' },
            { type: 'attr', text: '    this.phase1 = "01_Ideation // Deconstructing complex project scopes into clean, modular logic blueprints";' },
            { type: 'attr', text: '    this.phase2 = "02_Architecture // Designing bulletproof, high-performance full-stack data nodes";' },
            { type: 'attr', text: '    this.phase3 = "03_Motion_Design // Injecting fluid Three.js components and lightweight interactive visuals";' },
            { type: 'attr', text: '    this.phase4 = "04_Optimization // Aggressive asset compression to maintain absolute 60FPS fluid execution";' },
            { type: 'code', text: '    this.engine_status = "READY // System compiled with zero reliance on generic, sluggish templates";' },
            { type: 'fn', text: '  }' },
            { type: 'comment', text: '}' },
            { type: 'code', text: '' },
        ],
    },

    'Philosophy.log': {
        blocks: [
            { type: 'comment', text: '[12:00:01] [SYSTEM_INIT] Initializing creative portfolio transmission protocol...' },
            { type: 'code', text: '[12:00:03] [VAL_METRIC] "A premium website shouldn\u2019t just exist\u2014it must captivate and function flawlessly."' },
            { type: 'attr', text: '[12:00:04] [CORE_STAND] Rejecting heavy, unoptimized plugins. Embracing lightweight, custom vanilla engineering.' },
            { type: 'code', text: '[12:00:06] [UI_MONITOR] Recalculating responsive viewport boundaries for pixel-perfect structural layouts.' },
            { type: 'code', text: '[12:00:07] [UX_EXECUTE] Elevating micro-interactions to create a powerful, unforgettable user experience.' },
            { type: 'attr', text: '[12:00:09] [ALIGNED] Pushing artistic and technical limits across every single line of code written.' },
            { type: 'code', text: '[12:00:10] [STATUS] System running at maximum optimization levels. Creative channels fully operational.' },
            { type: 'code', text: '' },
        ],
    },

    'Advantage.md': {
        blocks: [
            { type: 'code', text: '# Core Architectural Advantages:' },
            { type: 'comment', text: '- Dual-Engine Proficiency // Mastering robust server-side processing and sleek UI interfaces simultaneously.' },
            { type: 'comment', text: '- High-Fidelity Asset Control // Optimizing media and 3D visual environments with near-zero bundle footprints.' },
            { type: 'comment', text: '- Technical Rigor & Focus // Deep layout control, high-quality type safety, and clean code documentation.' },
            { type: 'comment', text: '- Elite Creative Domain // Active technical collaborator translating raw project briefs into polished masterpieces.' },
            { type: 'comment', text: '- Security & Precision // Formulating clean, secure data handshake channels across the full app infrastructure.' },
            { type: 'code', text: '' },
            { type: 'code', text: 'IMPLEMENTATION DIRECTIONS:' },
            { type: 'attr', text: '- Inject these exact text strings into the auto-typing animation array of your script component.' },
            { type: 'attr', text: '- Ensure all existing CSS color variables (neon cyans for strings/attributes, fuchsias for keywords, desaturated slates for tags/comments) apply smoothly to this new text layout.' },
            { type: 'attr', text: '- Maintain the vertical grid borders, the bottom monitoring tray (\u2018FPS: 71.70\u2019, \u2018STATUS: COMPILED // SUCCESS\u2019), and do not disrupt any other element on the web page.' },
        ],
    },
};


function progressiveType(preEl, blocks) {
    preEl.innerHTML = '';
    let i = 0;

    const step = () => {
        if (i >= blocks.length) return;

        const b = blocks[i];
        const line = document.createElement('div');
        line.className = `idp-line idp-${b.type}`;
        line.textContent = '';
        preEl.appendChild(line);

        const target = b.text;
        let j = 0;

        const charStep = () => {
            j++;
            line.textContent = target.slice(0, j);
            const done = j >= target.length;
            if (!done) {
                setTimeout(charStep, 3 + Math.random() * 8);
            } else {
                i++;
                setTimeout(step, 18 + Math.random() * 32);
            }
        };

        setTimeout(charStep, 8 + Math.random() * 14);
    };

    step();
}

function startFpsCounter(fpsEl, statusEl) {
    const samples = [];
    let last = performance.now();
    let rafId = 0;

    const tick = () => {
        const now = performance.now();
        const dt = now - last;
        last = now;

        const fps = 1000 / Math.max(dt, 0.0001);
        samples.push(fps);
        if (samples.length > 12) samples.shift();

        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        fpsEl.textContent = avg.toFixed(2);

        rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    setTimeout(() => {
        statusEl.textContent = 'COMPILED // SUCCESS';
    }, 250);

    return () => cancelAnimationFrame(rafId);
}

function attachTabHandlers(root) {
    const terminal = getEl('#idp-terminal', root);
    const fpsEl = getEl('#idp-fps', root);
    const statusEl = getEl('#idp-status', root);
    const tabs = getAll('.idp-ide-tabs [data-file]', root);

    if (!terminal || !fpsEl || !statusEl || !tabs.length) return () => { };

    const cleanupFps = startFpsCounter(fpsEl, statusEl);

    let typingTimer = null;

    const activate = (fileName) => {
        tabs.forEach((t) => {
            t.classList.toggle('idp-tab-active', t.getAttribute('data-file') === fileName);
        });

        if (!FILES[fileName]) {
            terminal.innerHTML = '';
            progressiveType(terminal, [
                { type: 'comment', text: `// Unknown file: ${fileName}` },
                { type: 'code', text: 'STATUS: COMPILED // FALLBACK' },
            ]);
            statusEl.textContent = 'COMPILED // SUCCESS';
            return;
        }

        const file = FILES[fileName];


        // If the file is missing, keep terminal stable and show a clear message.
        // This prevents Advantage.md (and any other) from appearing blank.
        if (!FILES[fileName]) {
            terminal.innerHTML = '';
            progressiveType(terminal, [
                { type: 'comment', text: `// Unknown file: ${fileName}` },
                { type: 'code', text: 'STATUS: COMPILED // FALLBACK' },
            ]);
            statusEl.textContent = 'COMPILED // SUCCESS';
            return;
        }


        if (typingTimer) clearTimeout(typingTimer);
        terminal.innerHTML = '';

        // Progressive typing
        progressiveType(terminal, file.blocks);
        statusEl.textContent = 'COMPILED // SUCCESS';
    };

    tabs.forEach((tab) => {
        tab.addEventListener('mouseenter', () => activate(tab.getAttribute('data-file')));
        tab.addEventListener('click', () => activate(tab.getAttribute('data-file')));
    });

    // Default tab: show the first new storyteller file on load.
    activate(tabs[0].getAttribute('data-file'));


    return () => {
        cleanupFps();
        if (typingTimer) clearTimeout(typingTimer);
    };
}

function attachHoverBridge(root) {
    const leftCards = getAll('.hologram-tilt-card', document);
    if (!leftCards.length) return;

    const map = [
        { matcher: /webgl|three\.js|shader/i, file: 'Shader.glsl' },
        { matcher: /typescript|node\.js|server|backend/i, file: 'Server.js' },
        { matcher: /canvas|renderer/i, file: 'Canvas.ts' },
        { matcher: /react|app\.jsx|component/i, file: 'App.jsx' },
    ];

    let lastFile = null;

    leftCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            const text = card.textContent || '';
            const hit = map.find((m) => m.matcher.test(text));
            if (!hit) return;
            if (lastFile === hit.file) return;
            lastFile = hit.file;

            const targetTab = getEl(`.idp-ide-tabs [data-file="${hit.file}"]`, root);
            if (!targetTab) return;

            targetTab.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

            // Preview flash
            root.classList.add('idp-bridge-pulse');
            setTimeout(() => root.classList.remove('idp-bridge-pulse'), 220);
        });
    });
}

export function initializeIDP() {
    const root = getEl('#idp-container');
    if (!root) return;

    if (root.__idp_cleanup__) {
        try {
            root.__idp_cleanup__();
        } catch (e) { }
    }

    const cleanup = attachTabHandlers(root);
    attachHoverBridge(root);
    root.__idp_cleanup__ = cleanup;
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => initializeIDP());
} else {
    initializeIDP();
}

