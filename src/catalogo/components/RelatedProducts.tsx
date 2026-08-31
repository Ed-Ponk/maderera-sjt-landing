"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, ProductCardData } from "./ProductCard";
import { cn } from "@/shared/lib/utils";

const AUTOPLAY_INTERVAL_MS = 5000;
const RESUME_DELAY_MS = 3000;
// Clones asimétricos para el loop: 1 copia del último como prefijo y 4 copias
// del inicio como sufijo. Se requieren K_SUFFIX copias del inicio (no solo 1)
// porque la zona de clon debe ser alcanzable: clientWidth <= K_SUFFIX * pitch.
const K_PREFIX = 1;
const K_SUFFIX = 4;

interface SlideWrapper {
  producto: ProductCardData;
  kind: "real" | "clone-prefix" | "clone-suffix";
  logIndex: number;
}

interface RelatedProductsProps {
  productos: ProductCardData[];
  activeSede: {
    id: string;
    nombre: string;
    slug: string;
    esProximamente: boolean;
  };
  categoriaNombre?: string;
  titulo?: string;
  tituloClassName?: string;
}

type PauseSource = "hover" | "focus" | "touch" | "visibility";

export function RelatedProducts({
  productos,
  activeSede,
  categoriaNombre,
  titulo,
  tituloClassName,
}: RelatedProductsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleId = useId();

  const itemCount = productos.length;
  const [paused, setPaused] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const pauseSourcesRef = useRef<Set<PauseSource>>(new Set());
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(true);
  const activatedRef = useRef(false);

  const title = titulo ?? (categoriaNombre ? `También en ${categoriaNombre}` : "");

  // Clones a cada lado para el loop continuo: [clon del último (K_PREFIX),
  // reales 0..N-1, clones del primero (K_SUFFIX)]. Los saltos entre zona de
  // clon y zona real son instantáneos e imperceptibles porque la vista en
  // ambas posiciones es pixel-idéntica.
  const slides: SlideWrapper[] = useMemo(() => {
    if (itemCount < 2) {
      return productos.map((p, i) => ({
        producto: p,
        kind: "real" as const,
        logIndex: i,
      }));
    }
    return [
      ...productos.slice(-K_PREFIX).map((p, i) => ({
        producto: p,
        kind: "clone-prefix" as const,
        logIndex: itemCount - K_PREFIX + i,
      })),
      ...productos.map((p, i) => ({
        producto: p,
        kind: "real" as const,
        logIndex: i,
      })),
      ...productos.slice(0, K_SUFFIX).map((p, i) => ({
        producto: p,
        kind: "clone-suffix" as const,
        logIndex: i,
      })),
    ];
  }, [productos, itemCount]);

  const scrollToChild = useCallback(
    (physicalIndex: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      if (!track) return;
      const child = track.children[physicalIndex] as HTMLElement | undefined;
      if (!child) return;
      const left =
        child.getBoundingClientRect().left -
        track.getBoundingClientRect().left +
        track.scrollLeft;
      track.scrollTo({ left, behavior });
    },
    []
  );

  const nearestIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return K_PREFIX;
    let best = K_PREFIX;
    let bestDist = Infinity;
    for (let i = 0; i < track.children.length; i++) {
      const child = track.children[i] as HTMLElement;
      const snap =
        child.getBoundingClientRect().left -
        track.getBoundingClientRect().left +
        track.scrollLeft;
      const dist = Math.abs(snap - track.scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, []);

  const isScrollable = useCallback(() => {
    const track = trackRef.current;
    return !!track && track.scrollWidth > track.clientWidth;
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const activateAutoplay = useCallback((announce: boolean) => {
    pausedRef.current = false;
    setPaused(false);
    if (announce && !activatedRef.current) {
      setAnnouncement("Avance automático activado.");
      activatedRef.current = true;
    }
  }, []);

  const pauseAutoplay = useCallback(
    (announce: boolean) => {
      clearResumeTimer();
      if (announce && !pausedRef.current) {
        setAnnouncement("Avance automático pausado.");
      }
      pausedRef.current = true;
      setPaused(true);
    },
    [clearResumeTimer]
  );

  const scheduleResume = useCallback(
    (delay = RESUME_DELAY_MS) => {
      clearResumeTimer();
      resumeTimerRef.current = setTimeout(() => {
        if (reducedMotion || pauseSourcesRef.current.size > 0 || !isScrollable()) {
          return;
        }
        activateAutoplay(true);
      }, delay);
    },
    [activateAutoplay, clearResumeTimer, isScrollable, reducedMotion]
  );

  const setSource = useCallback(
    (source: PauseSource, active: boolean) => {
      const sources = pauseSourcesRef.current;
      if (active) {
        sources.add(source);
        pauseAutoplay(source === "focus");
      } else {
        sources.delete(source);
        if (sources.size === 0) scheduleResume();
      }
    },
    [pauseAutoplay, scheduleResume]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
      const cur = nearestIndexFromScroll();
      let curLogical = cur - K_PREFIX;
      if (curLogical >= itemCount) curLogical -= itemCount;
      if (curLogical < 0) curLogical += itemCount;
      const nextLogical = curLogical + direction;
      let targetPhysical: number;
      if (nextLogical >= itemCount) {
        targetPhysical = K_PREFIX + itemCount;
      } else if (nextLogical < 0) {
        targetPhysical = K_PREFIX - 1;
      } else {
        targetPhysical = K_PREFIX + nextLogical;
      }
      scrollToChild(targetPhysical, reducedMotion ? "auto" : "smooth");
    },
    [itemCount, nearestIndexFromScroll, reducedMotion, scrollToChild]
  );

  const handleScrollEnd = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const idx = nearestIndexFromScroll();
    if (idx >= K_PREFIX + itemCount) {
      scrollToChild(idx - itemCount, "auto");
    } else if (idx < K_PREFIX) {
      scrollToChild(idx + itemCount, "auto");
    }
  }, [itemCount, nearestIndexFromScroll, scrollToChild]);

  const handleArrow = useCallback(
    (direction: 1 | -1) => {
      pauseAutoplay(false);
      step(direction);
      scheduleResume();
    },
    [pauseAutoplay, scheduleResume, step]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scrollend", handleScrollEnd);
    return () => track.removeEventListener("scrollend", handleScrollEnd);
  }, [handleScrollEnd]);

  // El primer hijo del DOM es el clon de prefijo; sin este ajuste el estado
  // inicial (snap-mandatory) mostraría ese clon en lugar de la tarjeta real 0.
  // El salto es anterior al primer paint, por lo que es imperceptible.
  useLayoutEffect(() => {
    if (itemCount < 2) return;
    scrollToChild(K_PREFIX, "auto");
  }, [itemCount, scrollToChild]);

  // El autoplay solo corre mientras el carrusel es visible en el viewport.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) scheduleResume(0);
          else pauseAutoplay(false);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [pauseAutoplay, scheduleResume]);

  useEffect(() => {
    if (paused || reducedMotion || itemCount < 2) return;
    const id = setInterval(() => step(1), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [itemCount, paused, reducedMotion, step]);

  if (itemCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription="carrusel"
      aria-labelledby={titleId}
      onMouseEnter={() => setSource("hover", true)}
      onMouseLeave={() => setSource("hover", false)}
      onTouchStart={() => setSource("touch", true)}
      onTouchEnd={() => setSource("touch", false)}
      onFocus={() => setSource("focus", true)}
      onBlur={() => setSource("focus", false)}
      className="flex flex-col gap-6 w-full"
    >
      <p className="sr-only" role="status">
        {announcement}
      </p>

      <div className="flex items-end justify-between gap-4 border-b-2 border-primary pb-4">
        <h2
          id={titleId}
          className={cn(
            "font-display text-2xl md:text-3xl uppercase tracking-wide text-primary",
            tituloClassName
          )}
        >
          {title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleArrow(-1)}
            aria-label="Anteriores"
            className="w-10 h-10 border-2 border-outline-variant text-on-surface hover:border-secondary hover:text-secondary flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleArrow(1)}
            aria-label="Siguientes"
            className="w-10 h-10 border-2 border-outline-variant text-on-surface hover:border-secondary hover:text-secondary flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-gutter px-gutter pb-2"
      >
        {slides.map(({ producto, kind, logIndex }, physicalIndex) => {
          const isClone = kind !== "real";
          return (
            <div
              key={`${producto.id}-${kind}-${logIndex}`}
              aria-hidden={isClone || undefined}
              inert={isClone || undefined}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={
                kind === "real" ? `Diapositiva ${logIndex + 1} de ${itemCount}` : undefined
              }
              className="flex-none w-[280px] sm:w-[320px] snap-start"
            >
              <ProductCard producto={producto} activeSede={activeSede} />
            </div>
          );
        })}
      </div>
    </section>
  );
}