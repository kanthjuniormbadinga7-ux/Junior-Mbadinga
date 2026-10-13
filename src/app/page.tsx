"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  ArrowUpRight,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  X,
} from "lucide-react";

/* ============================================================
   DATA
   ============================================================ */

const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "À propos", href: "#about" },
  { label: "Travaux", href: "#travaux" },
  { label: "Formation", href: "#formation" },
  { label: "Contact", href: "#contact" },
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

/*
 * TRAVAUX — embeds YouTube via pattern clic-pour-jouer.
 * Les miniatures utilisent les vraies thumbnails YouTube (i.ytimg.com).
 * Si la miniature n'est pas encore disponible (vidéo en cours d'upload),
 * un fond sombre s'affiche avec le bouton play — pas de miniature fictive.
 */
const FEATURED_VIDEO = {
  id: "UQqeJcMtSI0",
  title: "Spot Institutionnel — AGL",
  year: "2026",
};

const VIDEOS = [
  {
    id: "-Hip-G_fyDc",
    title: "Documentaire — École de Santé de Libreville",
    year: "2025-2026",
  },
  {
    id: "t_Hq5no7Q3k",
    title: "Édit — But de Bouanga",
    year: "2025",
  },
  {
    id: "KQeqlzQcWfQ",
    title: "Vidéo PNCD",
    year: "2025",
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

/** Subtle premium parallax on an element based on its position in viewport. */
function useParallax<T extends HTMLElement>(strength = 0.06) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 (bottom entering) → 0 (centered) → +1 (top leaving)
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const y = Math.max(-1, Math.min(1, progress)) * strength * 100;
        el.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);
  return ref;
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
  const portraitRef = useParallax<HTMLDivElement>(0.05);

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
          <div className="mx-auto max-w-[380px]" ref={portraitRef}>
            <div className="photo-frame">
              <img
                src="/Junior-Mbadinga/portfolio/portrait.jpg"
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
  const photoRef = useParallax<HTMLDivElement>(0.07);
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="reveal reveal-d1 lg:col-span-7" ref={photoRef}>
            <div className="photo-frame">
              <img
                src="/Junior-Mbadinga/portfolio/about.jpg"
                alt="Junior Mbadinga en plein travail"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="display reveal reveal-d1 text-3xl sm:text-4xl md:text-5xl">
              Donner vie à vos idées, <em className="italic text-accent">image par image</em>.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CAMERA BANNER — bannière cinématique parallaxe
   ============================================================ */

function CameraBanner() {
  const ref = useParallax<HTMLDivElement>(0.1);
  return (
    <section className="camera-banner reveal">
      <div className="camera-banner-grid">
        <div className="camera-banner-photo" ref={ref}>
          <img
            src="/Junior-Mbadinga/portfolio/project-live.jpg"
            alt="Junior Mbadinga en captation, caméra à l'épaule"
            loading="lazy"
          />
        </div>
        <div className="camera-banner-text">
          <span className="camera-banner-eyebrow">Sur le terrain</span>
          <p className="camera-banner-quote">
            « Donnez-moi une idée, je vous rends une image qui reste. »
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TRAVAUX — embeds YouTube (AGL en vedette + 3 vidéos)
   ============================================================ */

function VideoPlayButton({ size = "lg" }: { size?: "lg" | "sm" }) {
  return (
    <span className={`play-overlay play-overlay-${size}`} aria-hidden>
      <span className="play-circle">
        <Play size={size === "lg" ? 30 : 22} fill="currentColor" strokeWidth={0} />
      </span>
    </span>
  );
}

/** Thumbnail YouTube réel avec fallback sombre si indisponible. */
function YoutubeThumb({ id, title }: { id: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="poster-fallback" aria-hidden />;
  }
  return (
    <img
      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
      alt={title}
      className="poster-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function YouTubeEmbed({
  id,
  title,
  large = false,
}: {
  id: string;
  title: string;
  large?: boolean;
}) {
  // youtube-nocookie.com = mode privacy-enhanced de YouTube (moins de bot check)
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1&playsinline=1`;
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      className={large ? "embed-iframe embed-iframe-lg" : "embed-iframe"}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}

function FeaturedVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="reveal featured-video">
      <div className="video-eyebrow">
        <span className="video-eyebrow-dot" /> À la une
      </div>
      <div className="embed-wrap embed-wrap-lg">
        {playing ? (
          <YouTubeEmbed id={FEATURED_VIDEO.id} title={FEATURED_VIDEO.title} large />
        ) : (
          <button
            type="button"
            className="poster-btn"
            onClick={() => setPlaying(true)}
            aria-label={`Lire la vidéo : ${FEATURED_VIDEO.title}`}
          >
            <YoutubeThumb id={FEATURED_VIDEO.id} title={FEATURED_VIDEO.title} />
            <VideoPlayButton size="lg" />
          </button>
        )}
      </div>
      <div className="featured-meta">
        <h3 className="display text-2xl sm:text-3xl md:text-4xl">
          {FEATURED_VIDEO.title}
          <span className="text-accent"> — {FEATURED_VIDEO.year}</span>
        </h3>
      </div>
    </article>
  );
}

function VideoCard({
  video,
  index,
}: {
  video: (typeof VIDEOS)[number];
  index: number;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <article
      className="reveal video-card"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="embed-wrap">
        {playing ? (
          <YouTubeEmbed id={video.id} title={video.title} />
        ) : (
          <button
            type="button"
            className="poster-btn"
            onClick={() => setPlaying(true)}
            aria-label={`Lire la vidéo : ${video.title}`}
          >
            <YoutubeThumb id={video.id} title={video.title} />
            <VideoPlayButton size="sm" />
          </button>
        )}
      </div>
      <div className="video-card-meta">
        <h3 className="display text-lg sm:text-xl">{video.title}</h3>
        <span className="video-year">{video.year}</span>
      </div>
    </article>
  );
}

function Travaux() {
  return (
    <section id="travaux" className="section">
      <div className="wrap">
        <FeaturedVideo />

        <div className="videos-grid mt-20">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio — Message de ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}\n${email}`
    );
    window.location.href = `mailto:kanthjuniormbadinga7@gmail.com?subject=${subject}&body=${body}`;
    toast({
      title: "Votre client mail va s'ouvrir",
      description: "Le message est pré-rempli, il ne vous reste qu'à l'envoyer.",
    });
    form.reset();
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
            <button type="submit" className="btn btn-solid">
              Envoyer le message
              <ArrowRight size={16} />
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
        <CameraBanner />
        <Travaux />
        <div className="rule" />
        <Formation />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
