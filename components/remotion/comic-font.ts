import {
  fontFamily as comicFamily,
  loadFont as loadComicFont,
} from "@remotion/google-fonts/ComicNeue";
import {
  fontFamily as neonFamily,
  loadFont as loadNeonFont,
} from "@remotion/google-fonts/Orbitron";
import {
  fontFamily as sunsetFamily,
  loadFont as loadSunsetFont,
} from "@remotion/google-fonts/Nunito";

loadComicFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

loadNeonFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

loadSunsetFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

export const comicFontFamily = comicFamily;
export const neonFontFamily = neonFamily;
export const sunsetFontFamily = sunsetFamily;
