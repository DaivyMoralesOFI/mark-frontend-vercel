import { useEffect } from "react";

export const useGoogleFonts = (fonts: string[]) => {
  useEffect(() => {
    if (!fonts || fonts.length === 0) return;

    const validFonts = fonts.filter((font) => font && font.trim() !== "");
    if (validFonts.length === 0) return;

    const fontFamilies = validFonts
      .map((font) => font.replace(/\s+/g, "+"))
      .map(
        (font) =>
          `family=${font}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700`,
      )
      .join("&");

    const linkId = "dynamic-google-fonts";
    let link = document.getElementById(linkId) as HTMLLinkElement;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;

    return () => {
      // We might not want to remove it immediately if other components use it,
      // but the user asked for a custom hook for the node.
      // To keep it simple and clean, we'll keep it there but update the href.
      // If we wanted to be super precise, we'd ref count or just let it persist.
    };
  }, [fonts]);
};
