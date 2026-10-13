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
 * TRAVAUX — embeds YouTube.
 * Le spot AGL est mis en vedette (autoplay + mute, conformément aux règles
 * des navigateurs modernes). Les autres vidéos se lancent au clic.
 */
const FEATURED_VIDEO = {
  id: "UQqeJcMtSI0",
  title: "Spot Institutionnel — AGL",
  year: "2026",
  desc: "Motion design 2D isométrique, 30 secondes — master TV + version web.",
};

const VIDEOS = [
  {
    id: "-Hip-G_fyDc",
    title: "Documentaire — École de Santé de Libreville",
    year: "2025-2026",
    desc: "Réalisation & montage — film documentaire institutionnel.",
  },
  {
    id: "t_Hq5no7Q3k",
    title: "Régie Live & Streaming",
    year: "2025",
    desc: "Captation & diffusion live — conférences et matchs universitaires.",
  },
  {
    id: "KQeqlzQcWfQ",
    title: "Création audiovisuelle",
    year: "2025",
    desc: "Montage & motion design.",
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
  const photoRef = useParallax<HTMLDivElement>(0.07);
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="reveal reveal-d1 lg:col-span-7" ref={photoRef}>
            <div className="photo-frame">
              <img
                src="/portfolio/about.jpg"
                alt="Junior Mbadinga en plein travail"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="display reveal reveal-d1 text-3xl sm:text-4xl md:text-5xl">
              Donner vie à vos idées, <em className="italic text-accent">image par image</em>.
            </h2>

            <p className="lede reveal reveal-d2 mt-8 max-w-md">
              Basé à Libreville, je crée des vidéos qui marquent — du motion
              design au montage, en passant par le son.
            </p>
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
  const ref = useParallax<HTMLDivElement>(0.12);
  return (
    <section className="camera-banner reveal">
      <div className="camera-banner-img" ref={ref}>
        <img
          src="/portfolio/project-live.jpg"
          alt="Junior Mbadinga en captation, caméra à l'épaule"
          loading="lazy"
        />
      </div>
      <div className="camera-banner-overlay" />
      <p className="camera-banner-caption">
        En captation — la caméra à l'épaule, le regard partout.
      </p>
    </section>
  );
}

/* ============================================================
   TRAVAUX — embeds YouTube (AGL en vedette + 3 vidéos)
   ============================================================ */

function FeaturedVideo() {
  const src = `https://www.youtube.com/embed/${FEATURED_VIDEO.id}?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${FEATURED_VIDEO.id}&playsinline=1&controls=1`;
  return (
    <article className="reveal featured-video">
      <div className="video-eyebrow">
        <span className="video-eyebrow-dot" /> À la une
      </div>
      <div className="embed-wrap embed-wrap-lg">
        <iframe
          src={src}
          title={FEATURED_VIDEO.title}
          loading="eager"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
      <div className="featured-meta">
        <h3 className="display text-2xl sm:text-3xl md:text-4xl">
          {FEATURED_VIDEO.title}
          <span className="text-accent"> — {FEATURED_VIDEO.year}</span>
        </h3>
        <p className="lede mt-4 max-w-2xl">{FEATURED_VIDEO.desc}</p>
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
  const src = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`;
  return (
    <article
      className="reveal video-card"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="embed-wrap">
        <iframe
          src={src}
          title={video.title}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
      <div className="video-card-meta">
        <h3 className="display text-lg sm:text-xl">{video.title}</h3>
        <span className="video-year">{video.year}</span>
      </div>
      <p className="video-desc">{video.desc}</p>
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
