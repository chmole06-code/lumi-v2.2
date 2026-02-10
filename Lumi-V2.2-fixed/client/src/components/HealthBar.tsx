/**
 * Composant HealthBar - Indicateur de santé de Lumi
 * 
 * Design: Magical Storybook
 * - Cœurs pulsants pour la santé
 * - Dégradé de couleur selon le niveau
 * - Animation fluide des changements
 */

import React from 'react';

interface HealthBarProps {
  health: number; // 0-100
  maxHealth?: number;
}

export default function HealthBar({ health, maxHealth = 100 }: HealthBarProps) {
  const percentage = Math.min(Math.max(health, 0), maxHealth) / maxHealth;
  
  // Déterminer la couleur selon la santé
  let barColor = '#40E0D0'; // Turquoise (bon)
  if (percentage < 0.3) {
    barColor = '#FF6B6B'; // Rouge (critique)
  } else if (percentage < 0.6) {
    barColor = '#FFD700'; // Or (moyen)
  }

  const hearts = Math.ceil((health / maxHealth) * 5);

  return (
    <div className="w-full space-y-3">
      {/* Barre de santé */}
      <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden border-2 border-accent">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${percentage * 100}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            boxShadow: `0 0 10px ${barColor}`,
          }}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
      </div>

      {/* Cœurs */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`text-2xl transition-all duration-300 ${
              i < hearts ? 'animate-pulse' : 'opacity-30'
            }`}
            style={{
              animation: i < hearts ? 'heartbeat 1.5s ease-in-out infinite' : 'none',
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Texte de santé */}
      <div className="text-center text-sm font-semibold text-accent">
        Santé: {Math.round(health)}/{maxHealth}
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
