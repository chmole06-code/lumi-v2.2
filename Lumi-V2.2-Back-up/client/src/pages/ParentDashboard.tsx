import { useLocation } from "wouter";
import Lumi from "@/components/Lumi";

export default function ParentDashboard() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#05070d] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Espace parent</h1>
            <p className="mt-2 text-white/70">
              Contrôle calme. Aucun mécanisme addictif, aucune “gamification”.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => setLocation("/game")}
              className="rounded-2xl bg-white text-slate-950 px-4 py-2 text-sm font-extrabold hover:opacity-95 active:scale-[0.99] transition"
            >
              Lumi le petit alié des rituels du soir 
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
            <div className="text-sm text-white/70">Présence</div>
            <div className="mt-6 flex justify-center" style={{ animation: "lumiFloat 3.6s ease-in-out infinite" }}>
              <Lumi state="idle" size="lg" />
            </div>
            <div className="mt-6 text-center text-sm text-white/70">
              "Mode normal (Lumi présent)."
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/70">Contrôles</div>

            <div className="mt-6 text-sm text-white/70">
              Apaiser et encourager les enfants et les parents après une journée bien remplie.
            </div>

            <div className="mt-6 text-xs text-white/45">
              Objectif : Ethique, accompagnement et encouragements & sérénité. Pas de badges, pas de streaks, pas de récompenses.
            </div>
          </div>
        </div>
        </div>
     </div>
  );
}
