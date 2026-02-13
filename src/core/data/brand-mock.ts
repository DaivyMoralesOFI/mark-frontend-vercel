import { Brand } from "@/core/schemas/brand-schema";

export const brandMock: Brand = {
  uuid: "mock-brand-001",
  create_at: {
    seconds: 1707600000,
    nanoseconds: 0,
  },
  update_at: {
    seconds: 1707600000,
    nanoseconds: 0,
  },
  identity: {
    name: "OFI Services",
    slug: "ofi-services",
    url: "https://www.ofiservices.com/",
    logo_url: "https://uploads.magnetme-images.com/b6ef6eec4cf95e65643013e.png",
  },
  brand_dna: {
    color_pallete: {
      primary: "#6C5CE7",
      secondary: "#A29BFE",
      accent: "#FD79A8",
      complementary: ["#00CEC9", "#FFEAA7", "#55EFC4"],
    },
    typography: {
      headings: {
        font_family: "Inter",
        category: "Sans-serif",
        url_link: "https://fonts.google.com/specimen/Inter",
      },
      body: {
        font_family: "Roboto",
        category: "Sans-serif",
        url_link: "https://fonts.google.com/specimen/Roboto",
      },
    },
  },
  brand_tone_mood: {
    description:
      "A modern, creative, and professional brand that inspires innovation and artistic expression.",
    keywords: ["creative", "modern", "innovative", "professional", "artistic"],
    voice: "Friendly yet professional, inspiring and clear",
  },
  isActive: true,
};
