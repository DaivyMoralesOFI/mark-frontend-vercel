import { PlatformProfile } from "../data/mockData";
import { Badge } from "@/shared/components/ui/badge";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    Facebook: FacebookIcon,
    LinkedIn: LinkedInIcon,
};

interface PlatformHeaderProps {
    profile: PlatformProfile;
}

export const PlatformHeader = ({ profile }: PlatformHeaderProps) => {
    const IconComponent = platformIcons[profile.name];

    return (
        <div className="flex items-center">
            <div className="flex items-center gap-4">
                {/* Platform Icon */}
                {IconComponent && (
                    <IconComponent className="w-8 h-8" />
                )}

                {/* Platform Info */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {profile.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700 border-green-200 border rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-none hover:bg-green-50"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block" />
                            {profile.status}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};
