import { fontFamily, loadFont } from "@remotion/google-fonts/ComicNeue";

loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const comicFontFamily = fontFamily;
