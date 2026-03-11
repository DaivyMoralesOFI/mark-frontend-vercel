import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadPathwayGothicOne } from "@remotion/google-fonts/PathwayGothicOne";

const poppins = loadPoppins();
const pathwayGothic = loadPathwayGothicOne();

export const FONTS = {
  text: poppins.fontFamily,
  title: pathwayGothic.fontFamily,
} as const;
