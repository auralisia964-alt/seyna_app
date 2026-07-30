import { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Apple,
  Ban,
  Image as ImageIcon,
  Video,
  Wand2,
  MessageSquare,
  Mic,
  FileText,
  Palette,
  Sparkles,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CREDITS_PER_IMAGE = 6;
const CREDITS_PER_VIDEO = 150; // Sora 720p, 12s

const CYCLES = [
  { id: 'mensuel', label: 'Mensuel', mult: 1, suffix: '/mois' },
  { id: 'trimestriel', label: 'Trimestriel (-15%)', mult: 0.85, suffix: '/mois' },
  { id: 'annuel', label: 'Annuel (-30%)', mult: 0.7, suffix: '/mois' },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    oldPrice: 39,
    promoMonthly: 29,
    credits: 300,
    benefit: "Pour tester l'IA et lancer tes premiers visuels sans te ruiner.",
  },
  {
    id: 'pro',
    name: 'Pro',
    oldPrice: 79,
    promoMonthly: 59,
    credits: 750,
    benefit: "Le plan le plus complet pour créer du contenu toutes les semaines.",
    recommended: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    oldPrice: 149,
    promoMonthly: 109,
    credits: 1500,
    benefit: 'Pour les créateurs et petites équipes qui publient en continu.',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    oldPrice: 249,
    promoMonthly: 179,
    credits: 3000,
    benefit: 'Volume maximal pour agences et gros besoins de production.',
  },
];

const COACHING = {
  name: 'Coaching 1:1',
  price: 149,
  benefit: "Un appel stratégique avec un expert pour accélérer tes résultats.",
};

const APPS = [
  { icon: ImageIcon, label: 'Générateur Images', ai: true },
  { icon: Video, label: 'Vidéos UGC', ai: true },
  { icon: Wand2, label: 'Retouche IA', ai: true },
  { icon: MessageSquare, label: 'Chat Assistant', ai: true },
  { icon: Mic, label: 'Voix Off IA', ai: true },
  { icon: FileText, label: 'Scripts & Copy', ai: false },
  { icon: Palette, label: 'Design Studio', ai: false },
  { icon: Sparkles, label: 'Effets Spéciaux', ai: true },
];

const BONUS_MONTHS = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE',
];

const COUNTDOWN_TARGET = new Date('2026-07-31T23:59:59');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function priceForCycle(promoMonthly, cycle) {
  return Math.round(promoMonthly * cycle.mult);
}

function creditsToUsage(credits, ratio) {
  const videoCredits = credits * ratio;
  const imageCredits = credits * (1 - ratio);
  return {
    images: Math.floor(imageCredits / CREDITS_PER_IMAGE),
    videos: Math.floor(videoCredits / CREDITS_PER_VIDEO),
  };
}

function getCountdown(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PricingPage() {
  const [cycleId, setCycleId] = useState('mensuel');
  const [ratio, setRatio] = useState(0.5); // 0 = 100% images, 1 = 100% videos
  const [countdown, setCountdown] = useState(() => getCountdown(COUNTDOWN_TARGET));

  const cycle = useMemo(() => CYCLES.find((c) => c.id === cycleId), [cycleId]);
  const imagePct = Math.round((1 - ratio) * 100);
  const videoPct = 100 - imagePct;
  const bonusMonth = BONUS_MONTHS[new Date().getMonth()];

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown(COUNTDOWN_TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0a1a] text-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl animate-[fadein_0.6s_ease-out]">
        <style>{`
          @keyframes fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* ---------------- Hero ---------------- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Choisis ton plan, <span className="text-purple-400">débloque tes crédits IA</span>
          </h1>
          <p className="mt-3 text-white/50 text-sm sm:text-base">
            Génère des images et des vidéos UGC à la demande. Change de rythme de facturation à tout moment.
          </p>
        </div>

        {/* ---------------- Plan toggle ---------------- */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full bg-white/5 border border-white/10 p-1">
            {CYCLES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCycleId(c.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  cycleId === c.id
                    ? 'bg-white text-black shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- Plan cards ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {PLANS.map((plan) => {
            const price = priceForCycle(plan.promoMonthly, cycle);
            const usage = creditsToUsage(plan.credits, ratio);
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.recommended
                    ? 'bg-gradient-to-b from-purple-900/40 to-white/5 border-2 border-purple-400 shadow-[0_0_45px_rgba(139,92,246,0.35)] scale-[1.03] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]'
                    : 'bg-white/5 border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.07]'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[11px] font-bold tracking-wide px-3 py-1 rounded-full shadow-lg">
                    RECOMMANDÉ
                  </span>
                )}

                <h3 className="text-lg font-semibold mb-3">{plan.name}</h3>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white/40 line-through text-sm">{plan.oldPrice}€</span>
                  <span className="text-3xl font-bold transition-all duration-300">{price}€</span>
                  <span className="text-white/50 text-sm">{cycle.suffix}</span>
                </div>

                <p className="text-white/50 text-sm mt-2 mb-4 leading-relaxed">{plan.benefit}</p>

                <div className="text-xs font-medium text-purple-300 mb-5">
                  {plan.credits.toLocaleString('fr-FR')} crédits IA / mois
                </div>

                {plan.recommended ? (
                  <button className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-lg shadow-purple-500/30">
                    Je me lance →
                  </button>
                ) : (
                  <div className="mt-auto flex items-stretch justify-around pt-4 border-t border-white/10">
                    <div className="text-center px-2">
                      <div className="text-xl font-bold transition-all duration-300">{usage.images}</div>
                      <div className="text-[11px] text-white/45">images</div>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center px-2">
                      <div className="text-xl font-bold transition-all duration-300">{usage.videos}</div>
                      <div className="text-[11px] text-white/45">vidéos UGC</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ---------------- Coaching add-on ---------------- */}
        <div className="mb-14 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white/80">{COACHING.name}</div>
            <div className="text-xs text-white/45 mt-1">{COACHING.benefit}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{COACHING.price}€</span>
            <button className="px-4 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:border-purple-400 hover:text-white transition-all duration-300">
              Réserver un appel
            </button>
          </div>
        </div>

        {/* ---------------- Simulator ---------------- */}
        <div className="mb-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-center mb-1">Avec tes crédits, tu génères quoi ?</h2>
          <p className="text-center text-purple-300 text-sm font-medium mb-6 transition-all duration-300">
            {imagePct}% images · {videoPct}% vidéos UGC
          </p>

          <input
            type="range"
            min={0}
            max={100}
            value={ratio * 100}
            onChange={(e) => setRatio(Number(e.target.value) / 100)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-purple-500 via-white/20 to-purple-500 accent-purple-400"
          />

          <div className="flex justify-between text-xs text-white/45 mt-2 mb-8">
            <span>100% images</span>
            <span>100% vidéos UGC</span>
          </div>

          <p className="text-center text-[11px] text-white/35">
            Base : {CREDITS_PER_IMAGE} crédits / image · ~{CREDITS_PER_VIDEO} crédits / vidéo UGC (Sora 720p, 12s)
          </p>
        </div>

        {/* ---------------- Guarantee ---------------- */}
        <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/5 p-5 flex items-center gap-4">
          <ShieldCheck className="w-9 h-9 text-green-400 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-300">Garantie 14 jours</div>
            <div className="text-sm text-white/50">Satisfait ou remboursé, sans question posée.</div>
          </div>
        </div>

        {/* ---------------- Trust badges ---------------- */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {[
            { icon: ShieldCheck, label: 'Paiement sécurisé' },
            { icon: CreditCard, label: 'Stripe · CB' },
            { icon: Apple, label: 'Apple Pay' },
            { icon: Ban, label: 'Annulable en 1 clic' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/60"
            >
              <Icon className="w-4 h-4" />
              {label}
            </div>
          ))}
        </div>

        {/* ---------------- Countdown / bonus ---------------- */}
        <div className="mb-14 rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-900/30 to-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-block bg-purple-500 text-white text-[11px] font-bold tracking-wide px-3 py-1 rounded-full mb-2">
                BONUS {bonusMonth}
              </span>
              <div className="text-lg font-semibold">Formation Création IA offerte</div>
              <div className="text-sm text-white/50 mt-1">
                <span className="line-through text-white/35 mr-2">197€</span>
                <span className="text-green-400 font-semibold">OFFERTE</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {[
                { v: countdown.days, l: 'Jours' },
                { v: countdown.hours, l: 'Heures' },
                { v: countdown.minutes, l: 'Min' },
                { v: countdown.seconds, l: 'Sec' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center bg-black/30 rounded-xl px-3 py-2 min-w-[56px]">
                  <div className="text-xl font-bold tabular-nums transition-all duration-300">{pad(v)}</div>
                  <div className="text-[10px] text-white/45 uppercase tracking-wide">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Apps grid ---------------- */}
        <div>
          <h2 className="text-center text-sm font-bold tracking-widest text-white/50 mb-6">
            {APPS.length} APPS INCLUS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {APPS.map(({ icon: Icon, label, ai }) => (
              <div
                key={label}
                className="relative flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-purple-400/40 hover:bg-white/[0.06] transition-all duration-300"
              >
                {ai && (
                  <span className="absolute top-2 right-2 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    AI
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-300 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
