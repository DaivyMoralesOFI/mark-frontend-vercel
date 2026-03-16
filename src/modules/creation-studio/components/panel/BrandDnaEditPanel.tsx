import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Plus,
  Trash2,
  Palette,
  Type,
  Megaphone,
  User,
  Check,
  Link,
  Loader2,
} from "lucide-react";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { cn } from "@/shared/utils/utils";
import { useUpdateBrandDna } from "@/modules/creation-studio/hooks/useBrands";

interface BrandDnaEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brandData: BrandExtractor;
}

// ── Small reusable field primitives ────────────────────────────────────────────

const SectionHeader = ({
  icon: Icon,
  label,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className={cn("p-1.5 rounded-lg", iconBg)}>
      <Icon className={cn("w-3.5 h-3.5", iconColor)} strokeWidth={2.5} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
      {label}
    </span>
  </div>
);

const FieldRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-surface-container/50 dark:bg-white/[0.04] border border-outline-variant/30 dark:border-white/[0.06] rounded-xl px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors";

const textareaCls = cn(
  inputCls,
  "resize-none leading-relaxed min-h-[72px]",
);

// ── Color swatch with native picker ────────────────────────────────────────────

const ColorSwatch = ({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (hex: string) => void;
  size?: "sm" | "md";
}) => {
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(value);

  return (
    <div className="flex items-center gap-2">
      <label className="relative cursor-pointer shrink-0 group">
        <div
          className={cn(
            "rounded-lg border-2 border-white/20 dark:border-black/20 shadow-sm transition-transform group-hover:scale-105",
            size === "sm" ? "w-7 h-7" : "w-9 h-9",
          )}
          style={{ backgroundColor: isValid ? value : "#888" }}
        />
        <input
          type="color"
          value={isValid ? value : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <input
        type="text"
        value={value}
        maxLength={7}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        className="flex-1 bg-transparent border border-outline-variant/20 dark:border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs font-mono text-on-surface focus:outline-none focus:border-primary/40 transition-colors uppercase"
        placeholder="#000000"
      />
    </div>
  );
};

// ── Main panel ─────────────────────────────────────────────────────────────────

const BrandDnaEditPanel = ({
  isOpen,
  onClose,
  brandData,
}: BrandDnaEditPanelProps) => {
  const [draft, setDraft] = useState<BrandExtractor>(() =>
    JSON.parse(JSON.stringify(brandData)),
  );
  const [newTone, setNewTone] = useState("");
  const { mutate: updateDna, isPending, isSuccess } = useUpdateBrandDna();

  // Re-hydrate draft every time the panel opens
  useEffect(() => {
    if (isOpen) {
      setDraft(JSON.parse(JSON.stringify(brandData)));
    }
  }, [isOpen, brandData]);

  // ── Update helpers ──────────────────────────────────────────────────────────

  const updateIdentity = (key: keyof BrandExtractor["brand_identity"], value: string) =>
    setDraft((d) => ({
      ...d,
      brand_identity: { ...d.brand_identity, [key]: value },
    }));

  const updatePaletteColor = (index: number, hex: string) =>
    setDraft((d) => {
      const palette = [...d.color_system.source_palette];
      palette[index] = hex;
      return { ...d, color_system: { ...d.color_system, source_palette: palette } };
    });

  const updateRole = (
    role: keyof BrandExtractor["color_system"]["roles"],
    hex: string,
  ) =>
    setDraft((d) => ({
      ...d,
      color_system: {
        ...d.color_system,
        roles: {
          ...d.color_system.roles,
          [role]: { ...d.color_system.roles[role], hex },
        },
      },
    }));

  const updateHeadings = (
    key: keyof BrandExtractor["typography"]["headings"],
    value: string,
  ) =>
    setDraft((d) => ({
      ...d,
      typography: {
        ...d.typography,
        headings: { ...d.typography.headings, [key]: value },
      },
    }));

  const updateBody = (
    key: keyof BrandExtractor["typography"]["body"],
    value: string,
  ) =>
    setDraft((d) => ({
      ...d,
      typography: {
        ...d.typography,
        body: { ...d.typography.body, [key]: value },
      },
    }));

  const updateVoice = (
    key: keyof BrandExtractor["brand_voice"],
    value: string,
  ) =>
    setDraft((d) => ({
      ...d,
      brand_voice: { ...d.brand_voice, [key]: value },
    }));

  const removeTone = (index: number) =>
    setDraft((d) => ({
      ...d,
      brand_voice: {
        ...d.brand_voice,
        tone_of_voice: d.brand_voice.tone_of_voice.filter((_, i) => i !== index),
      },
    }));

  const addTone = () => {
    const tone = newTone.trim();
    if (!tone || draft.brand_voice.tone_of_voice.includes(tone)) return;
    setDraft((d) => ({
      ...d,
      brand_voice: {
        ...d.brand_voice,
        tone_of_voice: [...d.brand_voice.tone_of_voice, tone],
      },
    }));
    setNewTone("");
  };

  const updateLogoUrl = (url: string) =>
    setDraft((d) => ({
      ...d,
      brand_identity: {
        ...d.brand_identity,
        logo: { ...d.brand_identity.logo, url },
      },
    }));

  const handleSave = () => {
    const uuid = draft._meta.uuid;
    updateDna(
      { uuid, draft },
      { onSuccess: () => setTimeout(onClose, 600) },
    );
  };

  const keyRoles: { key: keyof BrandExtractor["color_system"]["roles"]; label: string }[] = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "tertiary", label: "Tertiary" },
    { key: "surface", label: "Surface" },
    { key: "outline", label: "Outline" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2000] bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-[400px] z-[2001] flex flex-col bg-surface-container-lowest dark:bg-[#111111] border-l border-outline-variant/30 dark:border-white/[0.06] shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 dark:border-white/[0.05] shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-on-surface">
                  Edit Brand DNA
                </h2>
                <p className="text-[11px] text-on-surface-variant/50 mt-0.5">
                  {draft.brand_identity.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant/50 hover:text-on-surface hover:bg-on-surface/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-7">

              {/* ── Identity ─────────────────────────────── */}
              <section>
                <SectionHeader
                  icon={User}
                  label="Identity"
                  iconBg="bg-blue-500/10"
                  iconColor="text-blue-500"
                />
                <div className="flex flex-col gap-3.5">
                  <FieldRow label="Brand Name">
                    <input
                      className={inputCls}
                      value={draft.brand_identity.name}
                      onChange={(e) => updateIdentity("name", e.target.value)}
                      placeholder="Brand name"
                    />
                  </FieldRow>
                  <FieldRow label="Industry">
                    <input
                      className={inputCls}
                      value={draft.brand_identity.industry}
                      onChange={(e) => updateIdentity("industry", e.target.value)}
                      placeholder="e.g. Technology"
                    />
                  </FieldRow>
                  <FieldRow label="Brand Archetype">
                    <input
                      className={inputCls}
                      value={draft.brand_identity.brand_archetype}
                      onChange={(e) => updateIdentity("brand_archetype", e.target.value)}
                      placeholder="e.g. The Creator"
                    />
                  </FieldRow>
                  <FieldRow label="Logo URL">
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/30" />
                      <input
                        className={cn(inputCls, "pl-8")}
                        value={draft.brand_identity.logo.url}
                        onChange={(e) => updateLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        type="url"
                      />
                    </div>
                  </FieldRow>
                </div>
              </section>

              {/* ── Colors ───────────────────────────────── */}
              <section>
                <SectionHeader
                  icon={Palette}
                  label="Colors"
                  iconBg="bg-pink-500/10"
                  iconColor="text-pink-500"
                />
                <div className="flex flex-col gap-4">
                  {/* Source palette */}
                  <FieldRow label="Source Palette">
                    <div className="flex flex-col gap-2">
                      {draft.color_system.source_palette.map((hex, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-on-surface-variant/30 w-4 font-mono shrink-0">
                            {i + 1}
                          </span>
                          <ColorSwatch
                            value={hex}
                            onChange={(v) => updatePaletteColor(i, v)}
                            size="sm"
                          />
                          <button
                            onClick={() =>
                              setDraft((d) => ({
                                ...d,
                                color_system: {
                                  ...d.color_system,
                                  source_palette: d.color_system.source_palette.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                },
                              }))
                            }
                            className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant/20 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            color_system: {
                              ...d.color_system,
                              source_palette: [
                                ...d.color_system.source_palette,
                                "#CCCCCC",
                              ],
                            },
                          }))
                        }
                        className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant/40 hover:text-primary transition-colors mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add color
                      </button>
                    </div>
                  </FieldRow>

                  {/* Key roles */}
                  <FieldRow label="Key Roles">
                    <div className="flex flex-col gap-2">
                      {keyRoles.map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-[11px] text-on-surface-variant/50 w-20 shrink-0">
                            {label}
                          </span>
                          <ColorSwatch
                            value={draft.color_system.roles[key].hex}
                            onChange={(v) => updateRole(key, v)}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </FieldRow>
                </div>
              </section>

              {/* ── Typography ───────────────────────────── */}
              <section>
                <SectionHeader
                  icon={Type}
                  label="Typography"
                  iconBg="bg-emerald-500/10"
                  iconColor="text-emerald-500"
                />
                <div className="flex flex-col gap-4">
                  {/* Headings */}
                  <div className="bg-surface-container/40 dark:bg-white/[0.02] rounded-2xl p-3.5 border border-outline-variant/10 dark:border-white/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-3 block">
                      Headings
                    </span>
                    <div className="flex flex-col gap-3">
                      <FieldRow label="Font Family">
                        <input
                          className={inputCls}
                          value={draft.typography.headings.font_family}
                          onChange={(e) => updateHeadings("font_family", e.target.value)}
                          placeholder="e.g. Inter"
                        />
                      </FieldRow>
                      <FieldRow label="Personality Signal">
                        <input
                          className={inputCls}
                          value={draft.typography.headings.personality_signal}
                          onChange={(e) =>
                            updateHeadings("personality_signal", e.target.value)
                          }
                          placeholder="e.g. Modern, confident"
                        />
                      </FieldRow>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-surface-container/40 dark:bg-white/[0.02] rounded-2xl p-3.5 border border-outline-variant/10 dark:border-white/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-3 block">
                      Body
                    </span>
                    <div className="flex flex-col gap-3">
                      <FieldRow label="Font Family">
                        <input
                          className={inputCls}
                          value={draft.typography.body.font_family}
                          onChange={(e) => updateBody("font_family", e.target.value)}
                          placeholder="e.g. Roboto"
                        />
                      </FieldRow>
                      <FieldRow label="Personality Signal">
                        <input
                          className={inputCls}
                          value={draft.typography.body.personality_signal}
                          onChange={(e) =>
                            updateBody("personality_signal", e.target.value)
                          }
                          placeholder="e.g. Clean, readable"
                        />
                      </FieldRow>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Brand Voice ──────────────────────────── */}
              <section>
                <SectionHeader
                  icon={Megaphone}
                  label="Brand Voice"
                  iconBg="bg-purple-500/10"
                  iconColor="text-purple-500"
                />
                <div className="flex flex-col gap-3.5">
                  {/* Tone of voice tags */}
                  <FieldRow label="Tone of Voice">
                    <div className="flex flex-wrap gap-1.5 p-3 bg-surface-container/40 dark:bg-white/[0.02] border border-outline-variant/20 dark:border-white/[0.04] rounded-xl min-h-[44px]">
                      {draft.brand_voice.tone_of_voice.map((tone, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/15"
                        >
                          {tone}
                          <button
                            onClick={() => removeTone(i)}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors ml-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                      <input
                        value={newTone}
                        onChange={(e) => setNewTone(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTone();
                          }
                        }}
                        placeholder="Add tone…"
                        className="text-[11px] bg-transparent border-none focus:outline-none text-on-surface placeholder:text-on-surface-variant/30 min-w-[80px] flex-1"
                      />
                    </div>
                  </FieldRow>

                  <FieldRow label="Communication Style">
                    <textarea
                      className={textareaCls}
                      value={draft.brand_voice.communication_style}
                      onChange={(e) =>
                        updateVoice("communication_style", e.target.value)
                      }
                      placeholder="Describe the communication style…"
                      rows={2}
                    />
                  </FieldRow>

                  <FieldRow label="Target Audience">
                    <textarea
                      className={textareaCls}
                      value={draft.brand_voice.target_audience}
                      onChange={(e) =>
                        updateVoice("target_audience", e.target.value)
                      }
                      placeholder="Who is the brand speaking to?"
                      rows={2}
                    />
                  </FieldRow>

                  <FieldRow label="Positioning Statement">
                    <textarea
                      className={textareaCls}
                      value={draft.brand_voice.positioning_statement}
                      onChange={(e) =>
                        updateVoice("positioning_statement", e.target.value)
                      }
                      placeholder="How does the brand position itself?"
                      rows={3}
                    />
                  </FieldRow>
                </div>
              </section>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-4 border-t border-outline-variant/20 dark:border-white/[0.05] shrink-0 bg-surface-container-lowest dark:bg-[#111111]">
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 dark:border-white/[0.08] text-sm font-medium text-on-surface-variant/70 hover:bg-on-surface/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending || isSuccess}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed",
                    isSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-on-surface dark:bg-on-surface text-surface hover:opacity-90 disabled:opacity-60",
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BrandDnaEditPanel;
