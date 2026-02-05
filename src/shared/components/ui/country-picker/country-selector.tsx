import { useState, useMemo, forwardRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "./countries";
import { cn } from "@/core/lib/utils";
import "flag-icons/css/flag-icons.min.css";

interface CountrySelectorProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const CountrySelector = forwardRef<HTMLButtonElement, CountrySelectorProps>(
  ({ id, value, onChange, disabled = false, placeholder = "Select a country", className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedCountry = useMemo(
      () => COUNTRIES.find((country) => country.value === value),
      [value]
    );

    const filteredCountries = useMemo(() => {
      if (!searchQuery) return COUNTRIES;

      return COUNTRIES.filter((country) =>
        country.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery]);

    const handleSelect = (countryValue: string) => {
      onChange?.(countryValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div className="relative w-full">
        <button
          ref={ref}
          id={id}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1 text-sm shadow-xs transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <span className={`fi fi-${selectedCountry.value.toLocaleLowerCase()}`}></span>
              <span>{selectedCountry.title}</span>
            </span>
          ) : (
            <span className="text-outline-variant">{placeholder}</span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-1 w-full rounded-md border bg-surface-container-lowest shadow-lg"
              >
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-surface-container-lowest px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="max-h-[300px] bg-surface-container-lowest overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {filteredCountries.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No country found
                    </div>
                  ) : (
                    <div className="p-1">
                      {filteredCountries.map((country) => (
                        <button
                          key={country.value}
                          type="button"
                          onClick={() => handleSelect(country.title)}
                          className={cn(
                            "relative flex gap-2 w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground",
                            value === country.value && "bg-accent"
                          )}
                        >
                          <span className={`fi fi-${country.value.toLocaleLowerCase()}`}></span>
                          <span className="flex-1 text-left">{country.title}</span>
                          {value === country.value && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CountrySelector.displayName = "CountrySelector";
