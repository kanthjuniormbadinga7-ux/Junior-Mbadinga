"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowRight,
  Camera,
  Clapperboard,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Music4,
  Phone,
  Sparkles,
  X,
  Zap,
  Eye,
} from "lucide-react";

/* ============================================================
   DATA
   ============================================================ */

const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "À propos", href: "#about" },
  { label: "Compétences", href: "#skills" },
  { label: "Projets", href: "#projects" },
  { label: "Formation", href: "#formation" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = [
  {
    icon: Clapperboard,
    emoji: "🎬",
    title: "After Effects, Premiere Pro & Photoshop",
    desc: "Suite Adobe maîtrisée pour le montage, l'étalonnage et la post-production.",
  },
  {
    icon: Camera,
    emoji: "📷",
    title: "Cadrage, Prise de son & Photographie",
    desc: "Captation propre, cadrage maîtrisé et son net pour des images qui parlent.",
  },
  {
    icon: Sparkles,
    emoji: "🎨",
    title: "Motion Design 2D & Animation isométrique",
    desc: "Animations fluides en 2D, scènes isométriques et habillages dynamiques.",
  },
  {
    icon: Music4,
    emoji: "🎵",
    title: "Sound Design — Mixage musique, effets & voix off",
    desc: "Mixage, sound design et voix off pour donner vie et rythme à vos projets.",
  },
  {
    icon: Eye,
    emoji: "👁️",
    title: "Sens du détail et rigueur",
    desc: "Une obsession pour le détail, du premier plan à la livraison finale.",
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Capacité d'adaptation aux nouveaux outils et formats",
    desc: "Curieux et réactif, j'embrasse les nouvelles technologies et formats.",
  },
];

const PROJECTS = [
  {
    title: "Spot Institutionnel AGL",
    year: "2026",
    badge: "Motion Design 2D · 30 secondes · Clé en main",
    desc: "Spot institutionnel réalisé pour Africa Global Logistics, mettant en valeur le réseau panafricain en 2D isométrique.",
    poster: "/portfolio/project-agl.png",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    type: "video" as const,
  },
  {
    title: "Documentaire École de Santé de Libreville",
    year: "2025-2026",
    badge: "Réalisation · Montage · Documentaire",
    desc: "Film documentaire institutionnel présentant les formations et infrastructures de l'École de Santé de Libreville.",
    poster: "/portfolio/project-school.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    type: "video" as const,
  },
  {
    title: "Régie Live & Streaming",
    year: "2025",
    badge: "Live · Streaming · Événementiel",
    desc: "Organisation, captation et diffusion live de conférences et matchs universitaires.",
    poster: "/portfolio/project-live.jpg",
    type: "photo" as const,
  },
];

const TIMELINE = [
  {
    period: "2025 — Présent",
    title: "Licence Professionnelle Audiovisuel et Cinéma",
    place: "EM Gabon Université",
    desc: "Formation axée sur la réalisation, le montage et la production audiovisuelle.",
  },
  {
    period: "2024",
    title: "Baccalauréat Série Littéraire",
    place: "Gabon",
    desc: "Obtention du baccalauréat série L, fondement d'une sensibilité narrative et créative.",
  },
];

const COUNTERS = [
  { target: 3, suffix: "", label: "Projets réalisés" },
  { target: 2, suffix: "", label: "Ans d'expérience" },
  { target: 100, suffix: "%", label: "Passion" },
];

/* ============================================================
   HOOKS
   ============================================================ */

/** Reveal-on-scroll using IntersectionObserver. Adds .is-visible to .reveal nodes. */
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Animated number counter that triggers when scrolled into view. */
function Counter({
  target,
  suffix,
  duration = 1600,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(eased * target));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="counter-num">
      {value}
      {suffix}
    </span>
  );
}

/** Typing effect for the hero subtitle. */
function useTyping(text: string, speed = 70, startDelay = 600) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(function step() {
      if (i <= text.length) {
        setOut(text.slice(0, i));
        i += 1;
        timer = setTimeout(step, speed);
      }
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);
  return out;
}

/* ============================================================
   PARTICLES CANVAS (réseau / flux de données)
   ============================================================ */

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const COUNT_BY_AREA = 0.00009; // density
    const MAX_DIST = 150;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        140,
        Math.max(36, Math.floor(width * height * COUNT_BY_AREA))
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      }));
    }

    const mouse = { x: -9999, y: -9999 };
    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(46, 204, 113, 0.7)";
        ctx.fill();
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.strokeStyle = `rgba(46, 204, 113, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // link to mouse
        const a = particles[i];
        const dx = a.x - mouse.x;
        const dy = a.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.5;
          ctx.strokeStyle = `rgba(46, 204, 113, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    if (!reduce) {
      raf = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    } else {
      // static frame
      draw();
      cancelAnimationFrame(raf);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden />;
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      const t = e.target as HTMLElement;
      const hover = !!t.closest(
        "a, button, input, textarea, .skill-card, .project-card, .contact-row, [data-hover]"
      );
      dot.classList.toggle("is-hover", hover);
      ring.classList.toggle("is-hover", hover);
    }

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          onClick={() => go("#hero")}
          className="flex items-center gap-2"
          aria-label="Accueil"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald text-[#04130a] font-black">
            JM
          </span>
          <span className="hidden text-sm font-bold tracking-wide text-white sm:block">
            Junior<span className="text-emerald"> Mbadinga</span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="nav-link"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("#contact")}
            className="btn-emerald hidden !px-5 !py-2.5 !text-sm sm:inline-flex"
          >
            Me contacter
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--navy-border)] text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-2xl border border-[var(--navy-border)] bg-[#0a0f1a]/95 p-4 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#c6d2e0] hover:bg-[rgba(46,204,113,0.1)] hover:text-emerald"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   SECTION: HERO
   ============================================================ */

function Hero() {
  const subtitle = "Motion Designer & Créateur Audiovisuel";
  const typed = useTyping(subtitle);

  const go = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* gradient orbs */}
      <div
        className="orb"
        style={{
          width: 460,
          height: 460,
          background: "#2ecc71",
          top: "-120px",
          left: "-120px",
          opacity: 0.18,
        }}
      />
      <div
        className="orb"
        style={{
          width: 520,
          height: 520,
          background: "#2ecc71",
          bottom: "-180px",
          right: "-160px",
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Photo */}
        <div className="reveal flex justify-center lg:justify-start">
          <div className="hero-photo-wrap">
            <div className="hero-photo-ring-2" />
            <div className="hero-photo-ring" />
            <img
              src="/portfolio/portrait.jpg"
              alt="Junior Mbadinga, Motion Designer & Créateur Audiovisuel"
              className="hero-photo"
              loading="eager"
            />
          </div>
        </div>

        {/* Texte */}
        <div className="text-center lg:text-left">
          <span className="eyebrow reveal">Portfolio · 2026</span>
          <h1 className="hero-title reveal reveal-delay-1 mt-4">
            Junior
            <br />
            Mbadinga
          </h1>
          <div className="reveal reveal-delay-2 mt-5">
            <span className="typing-text">
              {typed}
              <span className="typing-caret" />
            </span>
          </div>
          <p className="reveal reveal-delay-3 mt-5 flex items-center justify-center gap-2 text-base font-medium text-[#9aa8ba] lg:justify-start">
            <MapPin size={18} className="text-emerald" />
            Libreville, Gabon
          </p>
          <div className="reveal reveal-delay-4 mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button onClick={() => go("#projects")} className="btn-emerald">
              Voir mes projets
              <ArrowRight size={18} />
            </button>
            <button onClick={() => go("#contact")} className="btn-ghost">
              Me contacter
            </button>
          </div>
        </div>
      </div>

      {/* Bounce arrow */}
      <button
        onClick={() => go("#about")}
        className="bounce-arrow absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[#9aa8ba] hover:text-emerald"
        aria-label="Défiler vers le bas"
      >
        <ArrowDown size={28} />
      </button>
    </section>
  );
}

/* ============================================================
   SECTION: ABOUT
   ============================================================ */

function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[rgba(46,204,113,0.25)] to-transparent blur-2xl" />
              <img
                src="/portfolio/about.jpg"
                alt="Junior Mbadinga en plein travail"
                className="relative aspect-square w-full rounded-[2rem] border border-[var(--navy-border)] object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-3 rounded-2xl border border-[var(--navy-border)] bg-[#0f1726] px-5 py-3 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9aa8ba]">
                  Disponible
                </p>
                <p className="text-sm font-bold text-emerald">pour vos projets</p>
              </div>
            </div>
          </div>

          <div>
            <span className="eyebrow reveal">À propos</span>
            <h2 className="section-title reveal reveal-delay-1 mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
              Jeune créatif <span className="text-emerald">passionné</span>
            </h2>
            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[#c6d2e0]">
              Jeune créatif passionné, je souhaite mettre mon dynamisme et ma
              créativité au service de projets audiovisuels ambitieux et
              innovants.
            </p>

            <div className="reveal reveal-delay-3 mt-10 grid grid-cols-3 gap-4">
              {COUNTERS.map((c) => (
                <div
                  key={c.label}
                  className="glass-card flex flex-col items-center gap-2 p-5 text-center"
                >
                  <Counter target={c.target} suffix={c.suffix} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa8ba] sm:text-sm">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: SKILLS
   ============================================================ */

function Skills() {
  return (
    <section id="skills" className="section-pad relative">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow reveal mx-auto justify-center">
            Compétences
          </span>
          <h2 className="section-title reveal reveal-delay-1 mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
            Ce que je sais <span className="text-emerald">faire</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-[#9aa8ba]">
            Un cocktail de compétences techniques et créatives au service de
            vos idées.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`skill-card glass-card reveal p-6 reveal-delay-${
                  (i % 3) + 1
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(46,204,113,0.12)] text-emerald">
                    <Icon size={26} />
                  </div>
                  <span className="skill-icon" aria-hidden>
                    {s.emoji}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9aa8ba]">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: PROJECTS
   ============================================================ */

function Projects() {
  return (
    <section id="projects" className="section-pad relative">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow reveal mx-auto justify-center">Projets</span>
          <h2 className="section-title reveal reveal-delay-1 mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
            Mes <span className="text-emerald">réalisations</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-[#9aa8ba]">
            Un aperçu de mes projets récents en motion design, documentaire et
            streaming live.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className={`project-card reveal reveal-delay-${i + 1} flex flex-col`}
            >
              <div className="project-media aspect-video">
                {p.type === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    poster={p.poster}
                    controls
                    preload="metadata"
                    playsInline
                  >
                    <source src={p.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={p.poster}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="project-overlay">
                  <span className="rounded-full bg-[#04130a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald">
                    Voir le projet
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="project-badge">{p.badge}</span>
                  <span className="text-xs font-bold text-[#5d6b7e]">
                    {p.year}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#9aa8ba]">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: FORMATION (timeline)
   ============================================================ */

function Formation() {
  return (
    <section id="formation" className="section-pad relative">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center">
          <span className="eyebrow reveal mx-auto justify-center">
            Formation
          </span>
          <h2 className="section-title reveal reveal-delay-1 mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
            Mon <span className="text-emerald">parcours</span>
          </h2>
        </div>

        <div className="reveal reveal-delay-2 mt-14">
          <div className="timeline">
            {TIMELINE.map((t) => (
              <div key={t.title} className="timeline-item">
                <div className="timeline-dot" />
                <span className="text-sm font-bold uppercase tracking-widest text-emerald">
                  {t.period}
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">{t.title}</h3>
                <p className="mt-1 text-sm font-semibold text-[#c6d2e0]">
                  {t.place}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9aa8ba]">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: CONTACT
   ============================================================ */

function Contact() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
    };
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        toast({
          title: "Message envoyé !",
          description: json.message || "Je vous réponds très vite.",
        });
        form.reset();
      } else {
        toast({
          title: "Oups",
          description: json?.error || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Oups",
        description: "Réseau indisponible, réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact-section section-pad relative">
      <div
        className="orb"
        style={{
          width: 480,
          height: 480,
          background: "#2ecc71",
          top: "10%",
          right: "-160px",
          opacity: 0.12,
        }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow reveal mx-auto justify-center">Contact</span>
          <h2 className="section-title reveal reveal-delay-1 mt-4 text-3xl text-white sm:text-4xl md:text-5xl">
            Travaillons <span className="text-emerald">ensemble</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-[#9aa8ba]">
            Une idée, un projet, une collaboration ? Écrivez-moi.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Coordonnées */}
          <div className="reveal flex flex-col justify-center gap-6">
            <a
              href="mailto:kanthjuniormbadinga7@gmail.com"
              className="contact-row flex items-center gap-4"
            >
              <span className="contact-icon">
                <Mail size={22} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-[#9aa8ba]">
                  Email
                </span>
                <span className="text-sm font-semibold text-white sm:text-base">
                  kanthjuniormbadinga7@gmail.com
                </span>
              </span>
            </a>

            <a href="tel:+24174784153" className="contact-row flex items-center gap-4">
              <span className="contact-icon">
                <Phone size={22} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-[#9aa8ba]">
                  Téléphone
                </span>
                <span className="text-sm font-semibold text-white sm:text-base">
                  +241 74 78 41 53
                </span>
              </span>
            </a>

            <div className="contact-row flex items-center gap-4">
              <span className="contact-icon">
                <MapPin size={22} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-[#9aa8ba]">
                  Localisation
                </span>
                <span className="text-sm font-semibold text-white sm:text-base">
                  Libreville, Gabon
                </span>
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={onSubmit}
            className="reveal reveal-delay-1 glass-card flex flex-col gap-4 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-white">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Votre nom"
                className="contact-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="contact-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Parlez-moi de votre projet..."
                className="contact-input resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-emerald mt-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Envoi en cours..." : "Envoyer"}
              {!sending && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="relative border-t border-[var(--navy-border)] bg-[#060b14] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-sm font-bold text-white">
            Junior Mbadinga <span className="text-emerald">© 2026</span>
          </p>
          <p className="mt-1 text-xs text-[#9aa8ba]">
            Motion Designer & Créateur Audiovisuel
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link flex items-center gap-2"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link flex items-center gap-2"
          >
            <Github size={18} /> GitHub
          </a>
          <a
            href="mailto:kanthjuniormbadinga7@gmail.com"
            className="footer-link flex items-center gap-2"
          >
            <Mail size={18} /> Email
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function Home() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10">
        <Hero />

        <div className="divider-glow" />
        <About />

        <div className="divider-glow" />
        <Skills />

        <div className="divider-glow" />
        <Projects />

        <div className="divider-glow" />
        <Formation />

        <div className="divider-glow" />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
