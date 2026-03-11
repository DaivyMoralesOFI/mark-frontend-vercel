// Exact colors from Mark's dark theme (src/index.css)
export const COLORS = {
  // Dark theme surfaces
  bg: "#0F0F0F",
  surface: "rgb(32, 29, 22)",
  surfaceDark: "#121212",
  surfaceCard: "#1C1C1C",
  surfaceOverlay: "#18181B",
  surfaceLowest: "#110e07",
  surfaceLow: "rgb(31, 27, 19)",
  surfaceContainer: "#231f17",

  // Brand
  primary: "#D946EF",
  primaryLight: "#F0ABFC",
  primaryContainer: "#7E1E8A",
  onPrimary: "#5B1064",
  secondary: "#0b3948",
  tertiary: "#629460",

  // Text
  text: "#e6e5e2",
  textLight: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textSubtle: "rgba(230, 229, 226, 0.5)",

  // Borders
  outline: "rgb(120, 115, 105)",
  outlineVariant: "rgb(52, 48, 40)",
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderCard: "rgba(255, 255, 255, 0.07)",

  // Graph node accent colors
  graph: {
    logo: "#3B82F6",
    identity: "#F59E0B",
    colors: "#EC4899",
    typography: "#8B5CF6",
    voice: "#10B981",
  },

  // Brand DNA extractor gradients
  extractorBg: [
    "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(120, 60, 180, 0.40), transparent 65%)",
    "radial-gradient(ellipse 70% 60% at 20% 80%, rgba(180, 50, 100, 0.35), transparent 65%)",
    "radial-gradient(ellipse 60% 50% at 60% 65%, rgba(140, 120, 60, 0.30), transparent 62%)",
    "radial-gradient(ellipse 65% 40% at 50% 60%, rgba(50, 100, 160, 0.35), transparent 68%)",
    "linear-gradient(180deg, #1a1520 0%, #1c1218 100%)",
  ],

  // Sample brand data
  samplePalette: ["#6C5CE7", "#A29BFE", "#FD79A8", "#00CEC9", "#FFEAA7"],
} as const;
