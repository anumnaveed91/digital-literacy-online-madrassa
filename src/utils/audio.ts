// Web Audio API offline sound synthesizer
// Does not require internet connection, fits perfectly with the offline-first mandate

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a happy major arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  } catch (e) {
    console.warn('Audio synthesis neglected by browser policy:', e);
  }
}

export function playFailureSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Audio synthesis neglected by browser policy:', e);
  }
}

export function playKeySound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(400, now + 0.03);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    console.warn('Audio synthesis neglected by browser policy:', e);
  }
}

export function playUrduVoiceSynth(textEn: string, textUr: string, currentLang: 'en' | 'ur') {
  try {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any speech that is currently playing
    window.speechSynthesis.cancel();
    
    const textToSpeak = currentLang === 'ur' ? textUr : textEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Configure voice language selection
    if (currentLang === 'ur') {
      utterance.lang = 'ur-PK';
      utterance.rate = 0.85; // Speak a bit slower for children
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis cancelled or failed:', e);
  }
}
