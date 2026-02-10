/**
 * Hook useSounds - Gestion des sons du jeu
 * 
 * Génère des sons simples avec l'API Web Audio
 * Pas de dépendances externes, tout en JavaScript pur
 */

export function useSounds() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  const playSound = (type: 'success' | 'giggle' | 'yawn' | 'sad') => {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    switch (type) {
      case 'success':
        // Son de succès : deux notes montantes
        osc.frequency.setValueAtTime(523.25, now); // Do
        osc.frequency.setValueAtTime(659.25, now + 0.1); // Mi
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'giggle':
        // Rire : notes courtes et rapides
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'yawn':
        // Bâillement : note grave qui descend
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;

      case 'sad':
        // Triste : notes descendantes
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(300, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
    }
  };

  return { playSound };
}
