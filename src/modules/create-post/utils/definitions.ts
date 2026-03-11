import {
  BookOpen,
  CircleFadingPlus,
  CloudUpload,
  Film,
  ImageIcon,
  LayoutGrid,

  Megaphone,
  Paperclip,
  TicketCheck,
  Tv,
} from "lucide-react";

import instagramOutline from "@/assets/logos/instagram-outline.avif";
import instagramFill from "@/assets/logos/instagram-fillment.avif";
import twitterOutline from "@/assets/logos/x-outline.avif";
import twitterFill from "@/assets/logos/x-fillment.avif";
import facebookOutline from "@/assets/logos/facebook-outline.avif";
import facebookFill from "@/assets/logos/facebook-fillment.avif";
import linkedinOutline from "@/assets/logos/linkedin-outline.avif";
import linkedinFill from "@/assets/logos/linkedin-fillment.avif";
import tiktokOutline from "@/assets/logos/tiktok-outline.avif";
import tiktokFill from "@/assets/logos/tiktok-fillment.avif";
import {
  PostTone,
  PostType,
  Platform,
  Tools,
} from "@/modules/create-post/types/ContentType";

export const postTone: PostTone[] = [
  { value: "promotional", label: "Promotional", icon: TicketCheck },
  { value: "educational", label: "Educational", icon: BookOpen },
  { value: "entertainment", label: "Entertainment", icon: Tv },
  { value: "announcement", label: "Announcement", icon: Megaphone },
  {
    value: "user-generated",
    label: "User Generated Content",
    icon: CircleFadingPlus,
  },
];

export const postType: PostType[] = [
  { value: "post", label: "Post", icon: ImageIcon },
  { value: "carrousel", label: "Carrousel", icon: LayoutGrid },
  { value: "story", label: "Story", icon: CircleFadingPlus },
  { value: "reel", label: "Reel", icon: Film },
];

export const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    logo_outline: instagramOutline,
    logo_fill: instagramFill,
    color: "bg-pink-500",
  },
  {
    id: "twitter",
    name: "Twitter",
    logo_outline: twitterOutline,
    logo_fill: twitterFill,
    color: "bg-blue-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    logo_outline: facebookOutline,
    logo_fill: facebookFill,
    color: "bg-blue-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo_outline: linkedinOutline,
    logo_fill: linkedinFill,
    color: "bg-blue-700",
  },
  {
    id: "tiktok",
    name: "TikTok",
    logo_outline: tiktokOutline,
    logo_fill: tiktokFill,
    color: "bg-black",
  },
];

export const tools: Tools[] = [
  { value: "attach-file", label: "Attach File", icon: Paperclip },
  { value: "from-drive", label: "From Drive", icon: CloudUpload },
];
