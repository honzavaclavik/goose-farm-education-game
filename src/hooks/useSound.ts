import { useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

type SoundEffect =
  | 'correct'
  | 'wrong'
  | 'click'
  | 'collect'
  | 'feed'
  | 'purchase'
  | 'levelUp'
  | 'streak'
  | 'gooseFever'
  | 'screenTransition'
  | 'buttonHover'
  | 'panelOpen'
  | 'panelClose'
  | 'claimReward'
  | 'achievementUnlock'
  | 'coinDrop';

// Web Audio API zvuky (syntetizované)
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3
) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.value = volume;

  // Fade out
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playMelody(notes: { freq: number; dur: number }[], type: OscillatorType = 'sine') {
  if (!audioContext) return;

  let time = audioContext.currentTime;
  notes.forEach(({ freq, dur }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = type;
    gainNode.gain.value = 0.2;
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + dur);

    oscillator.start(time);
    oscillator.stop(time + dur);
    time += dur * 0.8;
  });
}

function playNoise(duration: number, volume = 0.1) {
  if (!audioContext) return;

  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.value = volume;
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  source.start(audioContext.currentTime);
  source.stop(audioContext.currentTime + duration);
}

const soundEffects: Record<SoundEffect, () => void> = {
  correct: () => {
    // Veselý zvuk - stoupající tón
    playTone(440, 0.1, 'sine');
    setTimeout(() => playTone(554, 0.1, 'sine'), 80);
    setTimeout(() => playTone(659, 0.15, 'sine'), 160);
  },
  wrong: () => {
    // Smutný zvuk - klesající tón
    playTone(330, 0.15, 'square', 0.15);
    setTimeout(() => playTone(262, 0.2, 'square', 0.15), 100);
  },
  click: () => {
    playTone(800, 0.05, 'sine', 0.1);
  },
  collect: () => {
    // Zvuk sbírání - "pling"
    playTone(880, 0.08, 'sine', 0.2);
    setTimeout(() => playTone(1100, 0.1, 'sine', 0.15), 60);
  },
  feed: () => {
    // Zvuk krmení - "munch"
    playTone(200, 0.05, 'sawtooth', 0.15);
    setTimeout(() => playTone(250, 0.05, 'sawtooth', 0.12), 70);
    setTimeout(() => playTone(220, 0.05, 'sawtooth', 0.1), 140);
  },
  purchase: () => {
    // Zvuk nákupu - "ka-ching"
    playMelody([
      { freq: 523, dur: 0.1 },
      { freq: 659, dur: 0.1 },
      { freq: 784, dur: 0.2 },
    ]);
  },
  levelUp: () => {
    // Fanfára level up
    playMelody([
      { freq: 523, dur: 0.15 },
      { freq: 659, dur: 0.15 },
      { freq: 784, dur: 0.15 },
      { freq: 1047, dur: 0.3 },
    ]);
  },
  streak: () => {
    // Streak milestone
    playMelody([
      { freq: 587, dur: 0.08 },
      { freq: 698, dur: 0.08 },
      { freq: 880, dur: 0.15 },
    ]);
  },
  gooseFever: () => {
    // HUSÍ HOREČKA!
    playMelody([
      { freq: 440, dur: 0.1 },
      { freq: 554, dur: 0.1 },
      { freq: 659, dur: 0.1 },
      { freq: 880, dur: 0.1 },
      { freq: 1047, dur: 0.3 },
    ], 'square');
  },
  screenTransition: () => {
    // Soft whoosh - šumivý přechod
    playNoise(0.15, 0.06);
    playTone(400, 0.08, 'sine', 0.05);
  },
  buttonHover: () => {
    // Jemný tick
    playTone(1200, 0.03, 'sine', 0.04);
  },
  panelOpen: () => {
    // Dřevěný creak - stoupající
    playTone(180, 0.1, 'sawtooth', 0.08);
    setTimeout(() => playTone(260, 0.08, 'sine', 0.06), 60);
  },
  panelClose: () => {
    // Dřevěný thud - klesající
    playTone(220, 0.08, 'sawtooth', 0.07);
    setTimeout(() => playTone(150, 0.1, 'sine', 0.05), 50);
  },
  claimReward: () => {
    // Triumfální zvonění
    playMelody([
      { freq: 784, dur: 0.08 },
      { freq: 988, dur: 0.08 },
      { freq: 1175, dur: 0.12 },
      { freq: 1318, dur: 0.2 },
    ]);
  },
  achievementUnlock: () => {
    // Epická fanfára
    playMelody([
      { freq: 523, dur: 0.12 },
      { freq: 659, dur: 0.12 },
      { freq: 784, dur: 0.12 },
      { freq: 1047, dur: 0.15 },
      { freq: 1318, dur: 0.3 },
    ]);
  },
  coinDrop: () => {
    // Metalický zvuk mince
    playTone(2400, 0.04, 'square', 0.08);
    setTimeout(() => playTone(1800, 0.06, 'sine', 0.06), 40);
    setTimeout(() => playTone(2200, 0.04, 'square', 0.04), 80);
  },
};

export function useSound() {
  const { settings } = useGameStore();
  const isInitializedRef = useRef(false);

  // Inicializace AudioContext při první interakci
  useEffect(() => {
    const initAudio = () => {
      if (!isInitializedRef.current && audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
        isInitializedRef.current = true;
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const play = useCallback(
    (sound: SoundEffect) => {
      if (!settings.soundEnabled) return;

      // Resume AudioContext if suspended
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }

      soundEffects[sound]?.();
    },
    [settings.soundEnabled]
  );

  return { play };
}
