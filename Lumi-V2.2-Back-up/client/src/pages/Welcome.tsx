import { useLocation } from "wouter";
import Lumi from "@/components/Lumi";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#05070d] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.6)] p-10">
          {/* Lumi compagnon central */}
          <div className="flex justify-center mb-10">
            <div
              className="relative"
              style={{ animation: "lumiFloat 3.6s ease-in-out infinite", willChange: "transform" }}
            >
              <Lumi state="idle" size="lg" />
            </div>
          </div>

          <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">
            Lumi V1.1
          </h1>
               <p className="text-center text-4xl md:text-5xl text-extrabold max-w-xl mx-auto">
            Mon Petit Allié
          </p>
          <p className="mt-4 text-center text-white/80 max-w-xl mx-auto">
            Un compagnon doux et rassurant pour les enfants pendant l'apprentissage des rituels du quotidien. Une présence calme pour apaiser toute la famille.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 mt-10">
            <button
              type="button"
              onClick={() => setLocation("/game")}
              className="h-14 px-10 rounded-full text-base md:text-lg font-extrabold text-slate-950
                bg-[linear-gradient(135deg,rgba(120,255,240,1),rgba(255,130,205,1))]
                shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                hover:opacity-95 active:scale-[0.98] transition"
            >
              Commencer l’aventure ✨
            </button>

            <button
              type="button"
              onClick={() => setLocation("/parent")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3
                text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Espace parent
            </button>

            <div className="text-xs text-white/60">
              Prototype Lumi-V1.1 — test de présence émotionnelle en famille
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-white/45">
            Créé avec ❤️ pour les enfants (et pour apaiser les parents) par{" "}
<span className="font-semibold text-white/70">SeoEhoHumanrank</span>

          </div>
        </div>
      </div>
    </div>
  );
}
