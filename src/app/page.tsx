"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  ArrowUpRight,
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
  { label: "Vidéos", href: "#videos" },
  { label: "Formation", href: "#formation" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = [
  {
    icon: Clapperboard,
    title: "After Effects, Premiere Pro & Photoshop",
    desc: "Suite Adobe maîtrisée pour le montage, l'étalonnage et la post-production.",
  },
  {
    icon: Camera,
    title: "Cadrage, Prise de son & Photographie",
    desc: "Captation propre, cadrage maîtrisé et son net pour des images qui parlent.",
  },
  {
    icon: Sparkles,
    title: "Motion Design 2D & Animation isométrique",
    desc: "Animations fluides en 2D, scènes isométriques et habillages dynamiques.",
  },
  {
    icon: Music4,
    title: "Sound Design — Mixage, effets & voix off",
    desc: "Mixage, sound design et voix off pour donner vie et rythme à vos projets.",
  },
  {
    icon: Eye,
    title: "Sens du détail et rigueur",
    desc: "Une obsession pour le détail, du premier plan à la livraison finale.",
  },
  {
    icon: Zap,
    title: "Adaptation aux nouveaux outils et formats",
    desc: "Curieux et réactif, j'embrasse les nouvelles technologies et formats.",
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

/*
 * VIDEOS — fichiers locaux compressés dans /public/videos/.
 * Déposez vos .mp4 (H.264, 720p/1080p, idéalement < 30-50 Mo)
 * dans le dossier public/videos/ avec les noms ci-dessous.
 * Le lecteur HTML5 natif s'en occupe, sans dépendance externe.
 */
const VIDEOS = [
  {
    title: "Spot Institutionnel AGL",
    year: "2026",
    client: "Africa Global Logistics",
    duration: "0:30",
    desc: "Spot institutionnel mettant en valeur le réseau panafricain d'AGL en motion design 2D isométrique.",
    poster: "/portfolio/project-agl.png",
    src: "/videos/spot-agl.mp4",
  },
  {
    title: "École de Santé de Libreville",
    year: "2025-2026",
    client: "Documentaire institutionnel",
    duration: "Extrait",
    desc: "Film documentaire présentant les formations et infrastructures de l'École de Santé de Libreville.",
    poster: "/portfolio/project-school.jpg",
    src: "/videos/ecole-sante.mp4",
  },
  {
    title: "Régie Live & Streaming",
    year: "2025",
    client: "Événementiel universitaire",
    duration: "Live",
    desc: "Organisation, captation et diffusion live de conférences et matchs universitaires.",
    poster: "/portfolio/project-live.jpg",
    src: "/videos/regie-live.mp4",
  },
];

/* ============================================================
   HOOKS
   ============================================================ */

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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

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
      <span className="unit">{suffix}</span>
    </span>
  );
}

/* ============================================================
   GRAIN + VIGNETTE OVERLAYS
   ============================================================ */

function Atmosphere() {
  return (
    <>
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
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
      <div className="mx-auto flex max-w-[1120px] items-center justify-between">
        <button
          onClick={() => go("#hero")}
          className="brand flex items-center gap-2"
          aria-label="Accueil"
        >
          Junior Mbadinga<span className="dot">.</span>
        </button>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} className="nav-link">
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("#contact")}
            className="btn btn-line btn-sm hidden sm:inline-flex"
          >
            Me contacter
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line-2)] text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-[1120px] rounded-lg border border-[var(--line)] bg-[#0e0e10]/95 p-3 backdrop-blur lg:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-md px-4 py-3 text-left text-sm font-medium text-ink-2 hover:bg-[var(--accent-soft)] hover:text-ink"
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
   HERO
   ============================================================ */

function Hero() {
  const go = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen items-center px-6 pt-32 pb-20"
    >
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        {/* Texte */}
        <div className="lg:col-span-7">
          <h1 className="hero-name reveal reveal-d1">
            Monteur,
            <br />
            <em className="italic">Motion Designer</em>.
          </h1>

          <p className="lede reveal reveal-d2 mt-8 max-w-md">
            Montage, motion design 2D et sound design au service de vos
            projets audiovisuels.
          </p>

          <div className="reveal reveal-d3 mt-10 flex flex-wrap items-center gap-4">
            <button onClick={() => go("#about")} className="btn btn-solid">
              À propos
              <ArrowRight size={16} />
            </button>
            <button onClick={() => go("#contact")} className="btn btn-line">
              Me contacter
            </button>
          </div>

          <p className="reveal reveal-d3 mt-10 flex items-center gap-2 text-sm font-medium text-ink-3">
            <MapPin size={15} className="text-accent" />
            Libreville, Gabon
          </p>
        </div>

        {/* Portrait */}
        <div className="reveal reveal-d2 lg:col-span-5">
          <div className="mx-auto max-w-[380px]">
            <div className="photo-frame aspect-[4/5]">
              <img
                src="/portfolio/portrait.jpg"
                alt="Junior Mbadinga"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="reveal reveal-d1 lg:col-span-5">
            <div className="photo-frame aspect-[4/5]">
              <img
                src="/portfolio/about.jpg"
                alt="Junior Mbadinga en plein travail"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="display reveal reveal-d1 text-3xl sm:text-4xl md:text-5xl">
              Jeune créatif <em className="italic text-accent">passionné</em>,
              je mets mon dynamisme au service de projets audiovisuels
              ambitieux.
            </h2>

            <p className="lede reveal reveal-d2 mt-8 max-w-xl">
              Basé à Libreville, j'allie sens du détail et créativité pour
              donner vie à des idées à travers le motion design, la réalisation
              et le sound design.
            </p>

            <div className="reveal reveal-d3 mt-14 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-10">
              {COUNTERS.map((c) => (
                <div key={c.label} className="flex flex-col gap-3">
                  <Counter target={c.target} suffix={c.suffix} />
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3">
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
   SKILLS
   ============================================================ */

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <p className="reveal lede max-w-2xl">
          Un cocktail de compétences techniques et créatives — montage, motion
          design 2D, sound design, captation et rigueur — au service de vos
          idées.
        </p>

        <div className="reveal reveal-d2 mt-14 border-t border-[var(--line)]">
          <div className="grid md:grid-cols-2 md:gap-x-14">
            {SKILLS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="skill-row">
                  <div className="skill-icon">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="skill-title">{s.title}</h3>
                    <p className="skill-desc mt-1">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VIDEOS (lecteur HTML5 natif, fichiers locaux)
   ============================================================ */

function VideoCard({
  video,
  index,
}: {
  video: (typeof VIDEOS)[number];
  index: number;
}) {
  return (
    <article className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
      <div className="video-card">
        <video
          className="video-native"
          src={video.src}
          poster={video.poster}
          controls
          preload="metadata"
          playsInline
        >
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="display text-xl sm:text-2xl">{video.title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
          {video.year}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink-2">{video.client}</p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-3">
        {video.desc}
      </p>
    </article>
  );
}

function Videos() {
  return (
    <section id="videos" className="section">
      <div className="wrap">
        <p className="reveal lede max-w-2xl">
          Motion design, documentaire et captation live — un aperçu de mon
          travail en audiovisuel.
        </p>

        <div className="mt-16 grid gap-12 lg:gap-16">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.title} video={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FORMATION
   ============================================================ */

function Formation() {
  return (
    <section id="formation" className="section">
      <div className="wrap">
        <p className="reveal lede max-w-2xl">
          Mon parcours de formation en audiovisuel et cinéma.
        </p>

        <div className="reveal reveal-d2 mt-14 max-w-3xl">
          <div className="timeline">
            {TIMELINE.map((t) => (
              <div key={t.title} className="timeline-item">
                <div className="timeline-dot" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {t.period}
                </span>
                <h3 className="display mt-3 text-2xl sm:text-3xl">{t.title}</h3>
                <p className="mt-2 text-sm font-medium text-ink-2">{t.place}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-3">
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
   CONTACT
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
          title: "Message envoyé",
          description: json.message || "Je vous réponds dès que possible.",
        });
        form.reset();
      } else {
        toast({
          title: "Une erreur est survenue",
          description: json?.error || "Réessayez plus tard.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Réseau indisponible",
        description: "Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact-section section">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-5">
            <h2 className="display reveal reveal-d1 text-4xl sm:text-5xl md:text-6xl">
              Travaillons
              <br />
              <em className="italic text-accent">ensemble</em>.
            </h2>
            <p className="lede reveal reveal-d2 mt-8 max-w-md">
              Une idée, un projet, une collaboration ? Écrivez-moi, je vous
              réponds rapidement.
            </p>

            <div className="reveal reveal-d3 mt-12 border-t border-[var(--line)]">
              <a
                href="mailto:kanthjuniormbadinga7@gmail.com"
                className="contact-row"
              >
                <span className="contact-ic">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="contact-label block">Email</span>
                  <span className="contact-value">
                    kanthjuniormbadinga7@gmail.com
                  </span>
                </span>
              </a>
              <a href="tel:+24174784153" className="contact-row">
                <span className="contact-ic">
                  <Phone size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="contact-label block">Téléphone</span>
                  <span className="contact-value">+241 74 78 41 53</span>
                </span>
              </a>
              <div className="contact-row">
                <span className="contact-ic">
                  <MapPin size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="contact-label block">Localisation</span>
                  <span className="contact-value">Libreville, Gabon</span>
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="reveal reveal-d1 lg:col-span-7 lg:pl-10"
          >
            <div className="field mb-8">
              <label htmlFor="name" className="field-label">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Votre nom"
                autoComplete="name"
              />
            </div>
            <div className="field mb-8">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                autoComplete="email"
              />
            </div>
            <div className="field mb-10">
              <label htmlFor="message" className="field-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Parlez-moi de votre projet..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn btn-solid disabled:opacity-60"
            >
              {sending ? "Envoi en cours…" : "Envoyer le message"}
              {!sending && <ArrowRight size={16} />}
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
    <footer className="relative z-10 border-t border-[var(--line)] bg-[var(--bg)] px-6 py-10">
      <div className="wrap flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-base text-ink">
            Junior Mbadinga
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-3">
            Monteur, Motion Designer — © 2026
          </p>
        </div>

        <div className="flex items-center gap-7">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link inline-flex items-center gap-1.5"
          >
            LinkedIn <ArrowUpRight size={13} />
          </a>
          <a
            href="mailto:kanthjuniormbadinga7@gmail.com"
            className="footer-link inline-flex items-center gap-1.5"
          >
            Email <ArrowUpRight size={13} />
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
    <div className="relative min-h-screen">
      <Atmosphere />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <div className="rule" />
        <About />
        <div className="rule" />
        <Skills />
        <div className="rule" />
        <Videos />
        <div className="rule" />
        <Formation />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
