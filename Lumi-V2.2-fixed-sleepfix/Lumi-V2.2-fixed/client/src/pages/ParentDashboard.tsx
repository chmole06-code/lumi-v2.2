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
          L'allié des enfants & des parents!
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
              Ouvrir Lumi
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
                  LUMI est un petit allié du quotidien qui accompagne vos enfants dans leurs rituels de la journée (se lever, se calmer, se concentrer, se coucher…), 
              avec douceur et bonne humeur.
Il aide l’enfant à vivre ces moments de transition sereinement, tout en soutenant les parents grâce à un cadre rassurant, simple et 
              bienveillant.

            </div>

            <div className="mt-6 text-xs text-white/45">
             LUMI n’impose rien : il accompagne, encourage et transforme les rituels en moments positifs partagés, favorisant l’autonomie, l’apaisement
              et l’équilibre émotionnel de l’enfant.
            </div>
          </div>
        </div>
        </div>
     </div>
  );
}
