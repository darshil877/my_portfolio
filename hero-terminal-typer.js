/**
 * Hero terminal typewriter loop for the glassmorphic hero video overlay.
 * Runs independently of WebGL scenes.
 */

const PHRASES = [
    "TURNING IDEAS INTO REALITIES :-]",
    "THAT'S WHAT I DO.",
    "I BUILD !!",
    "I ARCHITECT INTERACTIVE WEB SYSTEMS :)",
];

const TYPE_SPEED_MS = 55;
const DELETE_SPEED_MS = 40;
const PAUSE_AT_COMPLETE_MS = 2000;
const PAUSE_BEFORE_NEXT_PHRASE_MS = 500;

function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function runTerminalTyper() {
    const target = document.getElementById('terminal-type-target');
    if (!target) return;

    let phraseIndex = 0;

    while (true) {
        const phrase = PHRASES[phraseIndex % PHRASES.length];
        phraseIndex++;

        // Type forward
        for (let i = 0; i < phrase.length; i++) {
            target.textContent = phrase.slice(0, i + 1);
            await wait(TYPE_SPEED_MS);
        }

        await wait(PAUSE_AT_COMPLETE_MS);

        // Delete backward
        for (let i = phrase.length; i >= 0; i--) {
            target.textContent = phrase.slice(0, i);
            await wait(DELETE_SPEED_MS);
        }

        await wait(PAUSE_BEFORE_NEXT_PHRASE_MS);
    }
}

// Start after DOM is ready (no dependency on WebGL)
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runTerminalTyper);
} else {
    runTerminalTyper();
}

