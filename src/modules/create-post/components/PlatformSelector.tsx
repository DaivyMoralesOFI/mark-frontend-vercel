// PlatformSelector.tsx
//
// This file defines the PlatformSelector component, which allows users to select one or more target platforms for their post.
// It displays a list of available platforms as selectable buttons, highlights selected platforms, and shows a summary of selected platforms as badges.
// The component is styled with Tailwind CSS and is designed for use in post creation flows.

import { Label } from "@/shared/components/ui/label";
import { PLATFORMS } from "../types/createPostTypes";
import { Badge } from "@/shared/components/ui/badge";
import type {
  AccountsByPlatform,
  SelectedAccountsByPlatform,
} from "../types/createPostTypes";
import React from "react";

/**
 * Props for PlatformSelector
 * @property {string[]} selectedPlatforms - Array of selected platform IDs.
 * @property {(platformId: string) => void} onTogglePlatform - Callback to toggle selection of a platform.
 * @property {SelectedAccountsByPlatform} selectedAccountsByPlatform - Object containing selected accounts by platform.
 * @property {(platformId: string, accountId: string) => void} onSelectAccount - Callback to select an account for a platform.
 */
interface PlatformSelectorProps {
  selectedPlatforms?: string[];
  onTogglePlatform?: (platformId: string) => void;
  selectedAccountsByPlatform: SelectedAccountsByPlatform;
  onSelectAccount: (platformId: string, accountId: string) => void;
}

// Mock de cuentas vinculadas por plataforma
const MOCK_ACCOUNTS: AccountsByPlatform = {
  instagram: [
    { id: "ig-1", username: "@ofiservices", displayName: "Ofiservices" },
    { id: "ig-2", username: "@markagent", displayName: "Mark Agent" },
  ],
  twitter: [
    { id: "tw-1", username: "@ofiservices", displayName: "Ofiservices" },
  ],
  facebook: [
    { id: "fb-1", username: "@ofiservices", displayName: "Ofiservices" },
    { id: "fb-2", username: "@markagent", displayName: "Mark Agent" },
  ],
  linkedin: [
    { id: "li-1", username: "@ofiservices", displayName: "Ofiservices" },
    { id: "li-2", username: "@markagent", displayName: "Mark Agent" },
  ],
  tiktok: [
    { id: "tt-1", username: "@ofiservices", displayName: "Ofiservices" },
    { id: "tt-2", username: "@markagent", displayName: "Mark Agent" },
  ],
};

/**
 * PlatformSelector
 *
 * Renders a list of available platforms as selectable buttons. Selected platforms are highlighted.
 * Displays a summary of selected platforms as badges below the selector.
 * Used in the CreatePostModal to let users choose where to publish their post.
 */
export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms = [],
  onTogglePlatform,
  selectedAccountsByPlatform,
  onSelectAccount,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const dropdownRefs = React.useRef<{
    [platformId: string]: HTMLDivElement | null;
  }>({});

  const handleDropdownToggle = (platformId: string) => {
    setOpenDropdown((prev) => (prev === platformId ? null : platformId));
  };

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        event.target instanceof Node &&
        dropdownRefs.current[openDropdown]?.contains(event.target)
      ) {
        // Click dentro del dropdown, no cerrar
        return;
      }
      setOpenDropdown(null);
    };
    if (openDropdown) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [openDropdown]);

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => {
        const linkedAccounts = MOCK_ACCOUNTS[platform.id] || [];
        const selectedAccountIds =
          selectedAccountsByPlatform[platform.id] || [];
        const isSelected = selectedAccountIds.length > 0;
        return (
          <div key={platform.id} className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTogglePlatform) onTogglePlatform(platform.id);
                handleDropdownToggle(platform.id);
              }}
              className={`p-1 rounded-lg border-0 transition-all flex items-center space-x-2 `}
            >
              {isSelected ? (
                <picture className="w-8 h-8 block relative p-0 m-0">
                  <source src={platform.logo_fill} type="image/svg+xml" />
                  <img src={platform.logo_fill} alt={platform.name} />
                </picture>
              ) : (
                <picture className="w-8 h-8 block relative p-0 m-0">
                  <source src={platform.logo_outline} type="image/svg+xml" />
                  <img src={platform.logo_outline} alt={platform.name} />
                </picture>
              )}
            </button>
            {openDropdown === platform.id && linkedAccounts.length > 0 && (
              <div
                ref={(el) => {
                  dropdownRefs.current[platform.id] = el;
                }}
                className="absolute top-full left-0 mt-2 w-full bg-white border border-purple-200 rounded-xl shadow-2xl z-20 animate-fade-in"
                style={{
                  minWidth: "14rem",
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                }}
              >
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 rounded-t-xl border-b border-blue-100">
                  <span>Accounts</span>
                </div>
                {linkedAccounts.map((account, idx) => (
                  <div
                    key={account.id}
                    className={`px-4 py-2 flex items-center gap-2 cursor-pointer text-sm transition-colors duration-150
                        ${selectedAccountIds.includes(account.id) ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 font-semibold" : "hover:bg-purple-50 border-b border-purple-50"}
                        ${idx !== linkedAccounts.length - 1 ? "border-b border-purple-50" : ""}
                      `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAccount(platform.id, account.id);
                      if (
                        !selectedPlatforms.includes(platform.id) &&
                        onTogglePlatform
                      ) {
                        onTogglePlatform(platform.id);
                      }
                    }}
                  >
                    {account.displayName}{" "}
                    <span className="ml-2 text-gray-400">
                      {account.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
{
  /* Badges para plataformas con cuentas seleccionadas 
      {Object.entries(selectedAccountsByPlatform).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 text-white">
          {Object.entries(selectedAccountsByPlatform).flatMap(
            ([platformId, accountIds]) => {
              const platform = PLATFORMS.find((p) => p.id === platformId);
              if (!platform) return null;
              // Obtener los nombres de las cuentas seleccionadas
              const linkedAccounts = MOCK_ACCOUNTS[platformId] || [];
              const selectedAccountNames = accountIds
                .map((accountId) => {
                  const acc = linkedAccounts.find((a) => a.id === accountId);
                  return acc ? acc.displayName : null;
                })
                .filter(Boolean)
                .join(", ");
              return (
                <Badge key={platformId}>
                  {platform.name}
                  {selectedAccountNames ? ` - ${selectedAccountNames}` : ""}
                </Badge>
              );
            },
          )}
        </div>
      )}*/
}
