import { useState } from "react";

/**
 * Generates initials from a brand/company name
 * @param name - The brand name
 * @returns The initials (up to 2 characters)
 */
const getInitials = (name: string): string => {
  if (!name) return "";

  // Split by spaces and get first letters of each word
  const words = name.trim().split(/\s+/);

  if (words.length === 0) return "";

  if (words.length === 1) {
    // If single word, take first 2 characters
    return name.substring(0, 2).toUpperCase();
  }

  // Take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
};

interface BrandLogoProps {
  name: string;
  logo: string;
  size?: "sm" | "md" | "lg";
}

/**
 * BrandLogo component
 * Displays a brand logo with fallback to initials if the image fails to load
 */
export function BrandLogo({ name, logo, size = "sm" }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  if (!logo || imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${textSize} font-semibold text-muted-foreground`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="max-w-full max-h-full object-contain"
      onError={() => setImageError(true)}
    />
  );
}
