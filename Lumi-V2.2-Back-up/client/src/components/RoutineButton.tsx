/**
 * RoutineButton — V2.0
 * UX 3–7 ans : grand, lisible, calme, non stimulant.
 */

import React from "react";
import { cn } from "@/lib/utils";

export default function RoutineButton({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-2xl px-5 py-4 md:px-6 md:py-5",
        "border border-white/10 bg-white/5 backdrop-blur-md",
        "transition-[transform,background-color] duration-200",
        "active:scale-[0.99]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:bg-white/7"
      )}
      aria-label={title}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold text-white/90">{title}</div>
          <div className="text-sm text-white/65">{description}</div>
        </div>
      </div>
    </button>
  );
}
