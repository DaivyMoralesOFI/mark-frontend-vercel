import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Image,
  Type,
  LayoutGrid,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/Tabs";
import { cn } from "@/shared/utils/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AspectRatio = "1:1" | "4:5" | "9:16";
type TextAlign = "left" | "center" | "right";

interface Slide {
  id: string;
  headline: string;
  body: string;
  localBg?: string;      // overrides global bg when set
  localTextColor?: string;
  textAlign: TextAlign;
  imageUrl?: string;
}

interface CarouselSettings {
  title: string;
  aspectRatio: AspectRatio;
  globalBg: string;
  globalTextColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASPECT_CONFIGS: Record<AspectRatio, { w: number; h: number; label: string }> = {
  "1:1":  { w: 1, h: 1,  label: "Square" },
  "4:5":  { w: 4, h: 5,  label: "Portrait" },
  "9:16": { w: 9, h: 16, label: "Story" },
};

const CANVAS_BASE_W = 280;

const BG_PRESETS = [
  { value: "#1a1a2e",   isGradient: false },
  { value: "#0b3948",   isGradient: false },
  { value: "#4A0E4E",   isGradient: false },
  { value: "#D946EF",   isGradient: false },
  { value: "#1e293b",   isGradient: false },
  { value: "#f8fafc",   isGradient: false },
  { value: "linear-gradient(135deg,#667eea,#764ba2)", isGradient: true },
  { value: "linear-gradient(135deg,#f093fb,#f5576c)", isGradient: true },
  { value: "linear-gradient(135deg,#4facfe,#00f2fe)", isGradient: true },
  { value: "linear-gradient(135deg,#43e97b,#38f9d7)", isGradient: true },
  { value: "linear-gradient(135deg,#fa709a,#fee140)", isGradient: true },
  { value: "linear-gradient(135deg,#a18cd1,#fbc2eb)", isGradient: true },
];

const TEXT_COLOR_PRESETS = ["#ffffff", "#1a1a1a", "#D946EF", "#4ac087", "#4facfe", "#f5576c"];

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_SLIDES: Slide[] = [
  {
    id: "s1",
    headline: "Your Brand Story",
    body: "Start with something that stops the scroll.",
    textAlign: "center",
  },
  {
    id: "s2",
    headline: "The Problem",
    body: "Your audience is struggling with this every single day.",
    localBg: "linear-gradient(135deg,#667eea,#764ba2)",
    textAlign: "center",
  },
  {
    id: "s3",
    headline: "Our Solution",
    body: "Here's how we change that in just 3 simple steps.",
    textAlign: "center",
  },
  {
    id: "s4",
    headline: "Take Action",
    body: "Tap the link in bio to get started today.",
    localBg: "#D946EF",
    localTextColor: "#ffffff",
    textAlign: "center",
  },
];

const SEED_SETTINGS: CarouselSettings = {
  title: "New Carousel",
  aspectRatio: "1:1",
  globalBg: "#1a1a2e",
  globalTextColor: "#ffffff",
};

// ─── Helper components ────────────────────────────────────────────────────────

const BgSwatch = ({
  value,
  selected,
  onClick,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-8 h-8 rounded-lg border-2 transition-all flex-shrink-0 hover:scale-110",
      selected ? "border-primary shadow-sm shadow-primary/30" : "border-transparent"
    )}
    style={{
      background: value,
    }}
  />
);

// ─── Slide canvas preview ─────────────────────────────────────────────────────

const SlideCanvas = ({
  slide,
  settings,
  isActive,
  isThumbnail,
  onClick,
}: {
  slide: Slide;
  settings: CarouselSettings;
  isActive?: boolean;
  isThumbnail?: boolean;
  onClick?: () => void;
}) => {
  const { w, h } = ASPECT_CONFIGS[settings.aspectRatio];
  const width  = isThumbnail ? 72 : CANVAS_BASE_W;
  const height = Math.round(width * h / w);
  const bg = slide.localBg ?? settings.globalBg;
  const textColor = slide.localTextColor ?? settings.globalTextColor;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden flex-shrink-0 rounded-xl select-none",
        isThumbnail && "cursor-pointer transition-all hover:opacity-100",
        isThumbnail && !isActive && "opacity-60",
        isThumbnail && isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        !isThumbnail && "shadow-2xl"
      )}
      style={{ width, height, background: bg }}
    >
      {/* Optional image overlay */}
      {slide.imageUrl && (
        <img
          src={slide.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}

      {/* Text content */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center px-4 gap-2",
          slide.textAlign === "center" && "items-center text-center",
          slide.textAlign === "left"   && "items-start text-left",
          slide.textAlign === "right"  && "items-end text-right",
          isThumbnail && "px-2 gap-1"
        )}
        style={{ color: textColor }}
      >
        {slide.headline && (
          <p
            className={cn(
              "font-bold leading-tight",
              isThumbnail ? "text-[8px]" : "text-2xl"
            )}
          >
            {slide.headline}
          </p>
        )}
        {slide.body && (
          <p
            className={cn(
              "leading-snug opacity-80",
              isThumbnail ? "text-[6px]" : "text-sm"
            )}
          >
            {slide.body}
          </p>
        )}
      </div>

      {/* Thumbnail overlay placeholder */}
      {!slide.headline && !slide.body && isThumbnail && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-4 h-4 opacity-20" style={{ color: textColor }} />
        </div>
      )}
    </div>
  );
};

// ─── Left panel — Global settings ─────────────────────────────────────────────

const GlobalSettingsPanel = ({
  settings,
  onChange,
}: {
  settings: CarouselSettings;
  onChange: (s: Partial<CarouselSettings>) => void;
}) => {
  const ratios: AspectRatio[] = ["1:1", "4:5", "9:16"];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Carousel Title
        </label>
        <Input
          value={settings.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="h-9 text-sm bg-surface-container-low border-outline-variant/30"
        />
      </div>

      {/* Aspect ratio */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {ratios.map((r) => {
            const { w, h, label } = ASPECT_CONFIGS[r];
            return (
              <button
                key={r}
                onClick={() => onChange({ aspectRatio: r })}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                  settings.aspectRatio === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant/30 text-on-surface-variant/50 hover:border-outline-variant/60"
                )}
              >
                {/* Mini frame preview */}
                <div
                  className={cn(
                    "rounded border-2 transition-colors",
                    settings.aspectRatio === r ? "border-primary" : "border-current"
                  )}
                  style={{
                    width:  r === "9:16" ? 10 : r === "4:5" ? 12 : 14,
                    height: r === "9:16" ? 18 : r === "4:5" ? 15 : 14,
                  }}
                />
                <span className="text-[11px] font-medium">{r}</span>
                <span className="text-[10px] opacity-60">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global background */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Default Background
        </label>
        <div className="flex flex-wrap gap-2">
          {BG_PRESETS.map((p) => (
            <BgSwatch
              key={p.value}
              value={p.value}
              selected={settings.globalBg === p.value}
              onClick={() => onChange({ globalBg: p.value })}
            />
          ))}
        </div>
      </div>

      {/* Global text color */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Default Text Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {TEXT_COLOR_PRESETS.map((c) => (
            <BgSwatch
              key={c}
              value={c}
              selected={settings.globalTextColor === c}
              onClick={() => onChange({ globalTextColor: c })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Left panel — Slide-specific settings ─────────────────────────────────────

const SlideSettingsPanel = ({
  slide,
  slideIndex,
  total,
  onChange,
}: {
  slide: Slide;
  slideIndex: number;
  total: number;
  onChange: (patch: Partial<Slide>) => void;
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Slide label */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary">{slideIndex + 1}</span>
        </div>
        <span className="text-sm font-medium text-on-surface">
          Slide {slideIndex + 1} of {total}
        </span>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3 h-3" /> Headline
        </label>
        <Input
          value={slide.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          placeholder="Main headline..."
          className="h-9 text-sm bg-surface-container-low border-outline-variant/30"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider flex items-center gap-1.5">
          <AlignLeft className="w-3 h-3" /> Body Text
        </label>
        <textarea
          value={slide.body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder="Supporting copy..."
          rows={3}
          className={cn(
            "w-full rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2",
            "text-sm text-on-surface placeholder:text-on-surface-variant/40",
            "focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50",
            "resize-none"
          )}
        />
      </div>

      {/* Text alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
          Alignment
        </label>
        <div className="flex gap-1.5">
          {(["left", "center", "right"] as TextAlign[]).map((a) => {
            const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
            return (
              <button
                key={a}
                onClick={() => onChange({ textAlign: a })}
                className={cn(
                  "flex-1 h-9 flex items-center justify-center rounded-lg border transition-all",
                  slide.textAlign === a
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant/30 text-on-surface-variant/50 hover:border-outline-variant/60"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Background override */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3 h-3" /> Background
          </label>
          {slide.localBg && (
            <button
              onClick={() => onChange({ localBg: undefined })}
              className="text-[10px] text-on-surface-variant/50 hover:text-error transition-colors"
            >
              Reset to global
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {BG_PRESETS.map((p) => (
            <BgSwatch
              key={p.value}
              value={p.value}
              selected={slide.localBg === p.value}
              onClick={() => onChange({ localBg: p.value })}
            />
          ))}
        </div>
      </div>

      {/* Text color override */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
            Text Color
          </label>
          {slide.localTextColor && (
            <button
              onClick={() => onChange({ localTextColor: undefined })}
              className="text-[10px] text-on-surface-variant/50 hover:text-error transition-colors"
            >
              Reset to global
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TEXT_COLOR_PRESETS.map((c) => (
            <BgSwatch
              key={c}
              value={c}
              selected={slide.localTextColor === c}
              onClick={() => onChange({ localTextColor: c })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const CarouselEditorPage = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Slide[]>(SEED_SLIDES);
  const [settings, setSettings] = useState<CarouselSettings>(SEED_SETTINGS);
  const [activeId, setActiveId] = useState<string>(SEED_SLIDES[0].id);
  const [panelTab, setPanelTab] = useState<"global" | "slide">("slide");
  const filmstripRef = useRef<HTMLDivElement>(null);

  const activeIndex = slides.findIndex((s) => s.id === activeId);
  const activeSlide = slides[activeIndex];

  // ── Slide mutations ──────────────────────────────────────────────────────────

  const patchSlide = useCallback((id: string, patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addSlide = useCallback(() => {
    const id = `s${Date.now()}`;
    const newSlide: Slide = {
      id,
      headline: "New Slide",
      body: "",
      textAlign: "center",
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveId(id);
    setPanelTab("slide");
  }, []);

  const duplicateSlide = useCallback(
    (id: string) => {
      const src = slides.find((s) => s.id === id);
      if (!src) return;
      const newId = `s${Date.now()}`;
      const clone: Slide = { ...src, id: newId };
      setSlides((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        const next = [...prev];
        next.splice(idx + 1, 0, clone);
        return next;
      });
      setActiveId(newId);
    },
    [slides]
  );

  const deleteSlide = useCallback(
    (id: string) => {
      if (slides.length === 1) return;
      const idx = slides.findIndex((s) => s.id === id);
      const newSlides = slides.filter((s) => s.id !== id);
      setSlides(newSlides);
      const newActive = newSlides[Math.min(idx, newSlides.length - 1)];
      setActiveId(newActive.id);
    },
    [slides]
  );

  const goToSlide = useCallback(
    (dir: -1 | 1) => {
      const idx = slides.findIndex((s) => s.id === activeId);
      const next = idx + dir;
      if (next >= 0 && next < slides.length) {
        setActiveId(slides[next].id);
        setPanelTab("slide");
      }
    },
    [slides, activeId]
  );

  return (
    <div className="flex flex-col h-screen bg-surface dark:bg-[#111]">
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="h-14 flex items-center px-4 gap-3 border-b border-outline-variant/20 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-on-surface/5 text-on-surface-variant transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <input
          value={settings.title}
          onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
          className={cn(
            "flex-1 max-w-xs bg-transparent border-none text-sm font-semibold text-on-surface",
            "focus:outline-none focus:ring-0 placeholder:text-on-surface-variant/40"
          )}
        />

        {/* Slide counter */}
        <span className="text-xs text-on-surface-variant/50 hidden sm:block">
          {activeIndex + 1} / {slides.length} slides
        </span>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-outline-variant/40 text-on-surface-variant h-8 text-xs"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </Button>
        <Button
          size="sm"
          className="gap-1.5 bg-primary hover:bg-primary/90 text-on-primary h-8 text-xs"
        >
          <Send className="w-3.5 h-3.5" /> Publish
        </Button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Canvas area ────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest/50 overflow-hidden relative">
          {/* Canvas nav arrows */}
          <button
            onClick={() => goToSlide(-1)}
            disabled={activeIndex === 0}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-10",
              "w-9 h-9 rounded-full bg-surface/90 border border-outline-variant/30 shadow-md",
              "flex items-center justify-center text-on-surface-variant transition-all",
              "hover:bg-surface hover:text-on-surface hover:scale-105",
              "disabled:opacity-30 disabled:pointer-events-none"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => goToSlide(1)}
            disabled={activeIndex === slides.length - 1}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-10",
              "w-9 h-9 rounded-full bg-surface/90 border border-outline-variant/30 shadow-md",
              "flex items-center justify-center text-on-surface-variant transition-all",
              "hover:bg-surface hover:text-on-surface hover:scale-105",
              "disabled:opacity-30 disabled:pointer-events-none"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Active slide canvas */}
          <AnimatePresence mode="wait">
            {activeSlide && (
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
              >
                <SlideCanvas slide={activeSlide} settings={settings} />

                {/* Per-slide quick actions below canvas */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => duplicateSlide(activeId)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Duplicate
                  </button>
                  <button
                    onClick={() => {
                      setPanelTab("slide");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-colors"
                  >
                    <Image className="w-3 h-3" /> Add Image
                  </button>
                  <button
                    onClick={() => deleteSlide(activeId)}
                    disabled={slides.length === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant/60 hover:text-error hover:bg-error/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveId(s.id); setPanelTab("slide"); }}
                className={cn(
                  "rounded-full transition-all",
                  s.id === activeId
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-on-surface/20 hover:bg-on-surface/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────────── */}
        <div className="w-64 border-l border-outline-variant/20 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Tab toggle */}
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <div className="flex rounded-lg bg-surface-container-low p-0.5 gap-0.5">
              <button
                onClick={() => setPanelTab("slide")}
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-medium transition-all",
                  panelTab === "slide"
                    ? "bg-surface text-on-surface shadow-sm"
                    : "text-on-surface-variant/60 hover:text-on-surface"
                )}
              >
                Slide
              </button>
              <button
                onClick={() => setPanelTab("global")}
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-medium transition-all",
                  panelTab === "global"
                    ? "bg-surface text-on-surface shadow-sm"
                    : "text-on-surface-variant/60 hover:text-on-surface"
                )}
              >
                Global
              </button>
            </div>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
            <AnimatePresence mode="wait">
              {panelTab === "global" ? (
                <motion.div
                  key="global"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  <GlobalSettingsPanel
                    settings={settings}
                    onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`slide-${activeId}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeSlide && (
                    <SlideSettingsPanel
                      slide={activeSlide}
                      slideIndex={activeIndex}
                      total={slides.length}
                      onChange={(patch) => patchSlide(activeId, patch)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Filmstrip ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-outline-variant/20 bg-surface flex-shrink-0">
        <div
          ref={filmstripRef}
          className="flex items-center gap-2 px-4 py-3 overflow-x-auto"
        >
          <Reorder.Group
            axis="x"
            values={slides}
            onReorder={setSlides}
            className="flex items-center gap-2"
            as="div"
          >
            {slides.map((slide, i) => (
              <Reorder.Item
                key={slide.id}
                value={slide}
                as="div"
                className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                whileDrag={{ scale: 1.05, zIndex: 50 }}
              >
                <div
                  className="flex flex-col items-center gap-1 group"
                  onClick={() => {
                    setActiveId(slide.id);
                    setPanelTab("slide");
                  }}
                >
                  <div className="relative">
                    <SlideCanvas
                      slide={slide}
                      settings={settings}
                      isActive={slide.id === activeId}
                      isThumbnail
                    />
                    {/* Slide number badge */}
                    <span
                      className={cn(
                        "absolute top-1 left-1 text-[9px] font-bold px-1 rounded",
                        slide.id === activeId
                          ? "bg-primary text-on-primary"
                          : "bg-black/30 text-white"
                      )}
                    >
                      {i + 1}
                    </span>
                    {/* Delete on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                      disabled={slides.length === 1}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-error text-on-error items-center justify-center hidden group-hover:flex disabled:opacity-0 transition-all hover:scale-110"
                    >
                      <span className="text-[9px] font-bold leading-none">×</span>
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Add slide button */}
          <button
            onClick={addSlide}
            className={cn(
              "flex-shrink-0 rounded-xl border-2 border-dashed border-outline-variant/40",
              "flex items-center justify-center gap-1 text-on-surface-variant/50",
              "hover:border-primary/60 hover:text-primary transition-all hover:bg-primary/5",
              "text-xs font-medium"
            )}
            style={{ width: 72, height: 72 }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselEditorPage;
