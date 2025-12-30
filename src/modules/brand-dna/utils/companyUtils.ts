// companyUtils.ts
//
// This file defines utility functions for company-related operations.

/**
 * Generates initials from a company name
 * @param name - The company name
 * @returns The initials (up to 2 characters)
 */
export const getCompanyInitials = (name: string): string => {
  if (!name) return '';
  
  // Split by spaces and get first letters of each word
  const words = name.trim().split(/\s+/);
  
  if (words.length === 0) return '';
  
  if (words.length === 1) {
    // If single word, take first 2 characters
    return name.substring(0, 2).toUpperCase();
  }
  
  // Take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Builds a full logo URL from a logo path and company URL
 * @param logoUrl - The logo URL (can be relative or absolute)
 * @param companyUrl - The company's website URL
 * @returns The full logo URL
 */
export const buildLogoUrl = (logoUrl: string, companyUrl: string): string => {
  if (!logoUrl) return '';
  
  // If it's already a full URL, return it
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }
  
  // If it's a relative path, construct full URL from company URL
  try {
    const companyUrlObj = new URL(companyUrl);
    // If logo starts with /, it's an absolute path on the domain
    if (logoUrl.startsWith('/')) {
      return `${companyUrlObj.origin}${logoUrl}`;
    }
    // Otherwise, it's relative to the company URL
    return new URL(logoUrl, companyUrl).href;
  } catch {
    return logoUrl;
  }
};

