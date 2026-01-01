// Simple WebAudio-based sounds for moves and win/lose
let audioCtx = null;
function ensureCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(frequency, duration = 0.12, type = 'sine', volume = 0.08) {
  try {
    ensureCtx();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = frequency;
    g.gain.value = volume;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // ignore if audio blocked
  }
}

export function playMoveSound(isOpponent = false) {
  // opponent moves use a slightly lower pitch and longer tone
  if (isOpponent) playTone(400, 0.18, 'square', 0.09);
  else playTone(600, 0.12, 'sine', 0.08);
}

export function playWinSound(isWinner = true) {
  if (isWinner) {
    playTone(880, 0.22, 'sine', 0.13);
    setTimeout(() => playTone(1100, 0.2, 'sine', 0.11), 160);
  } else {
    playTone(220, 0.25, 'sawtooth', 0.14);
  }
}

export function unlockAudioOnUserGesture() {
  // Some browsers block audio until user gesture; resume context on first click
  try {
    ensureCtx();
    if (audioCtx.state === 'suspended') {
      const resume = () => {
        audioCtx.resume();
        window.removeEventListener('click', resume);
      };
      window.addEventListener('click', resume);
    }
  } catch (e) {}
}

export default { playMoveSound, playWinSound, unlockAudioOnUserGesture };
