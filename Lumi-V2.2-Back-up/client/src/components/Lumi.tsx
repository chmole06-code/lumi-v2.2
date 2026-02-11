import React, { useEffect, useMemo, useRef } from "react";

export type LumiState =
  | "idle"
  | "brush"
  | "bath"
  | "night"
  | "eat"
  | "pyjama"
  // anciens (si tu les utilisais déjà)
  | "wake"
  | "sad"
  | "tired";

type LumiProps = {
  state: LumiState;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function videoSrcFor(state: LumiState): string {
  switch (state) {
    case "brush":
      return "/videos/lumi/lumi_brush.mp4";
    case "bath":
      return "/videos/lumi/lumi_bath.mp4";
    case "eat":
      return "/videos/lumi/lumi_dinner.mp4";
    case "pyjama":
      return "/videos/lumi/lumi_pyjama.mp4";
    case "night":
      return "/videos/lumi/lumi_night.mp4";
    case "idle":
    default:
      return "/videos/lumi/lumi_idle.mp4";
  }
}

function sizeToPx(size: "sm" | "md" | "lg") {
  if (size === "sm") return "w-[220px] h-[220px] md:w-[260px] md:h-[260px]";
  if (size === "md") return "w-[280px] h-[280px] md:w-[320px] md:h-[320px]";
  return "w-[320px] h-[320px] md:w-[380px] md:h-[380px]";
}

export default function Lumi({ state, pulse = false, size = "lg", className = "" }: LumiProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const src = useMemo(() => videoSrcFor(state), [state]);
  const sizeClass = useMemo(() => sizeToPx(size), [size]);

  const loop = true;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    try {
      v.load();
      const p = v.play();
      if (p && typeof (p as any).catch === "function") (p as any).catch(() => {});
    } catch {
      // ignore
    }
  }, [src]);

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      <div
        className={[
          "relative h-full w-full rounded-full overflow-hidden",
          "ring-1 ring-white/12",
          "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
          pulse ? "" : "",
        ].join(" ")}
      >
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline autoPlay loop={loop}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
