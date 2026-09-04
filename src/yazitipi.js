/* Arapca metnin yazi tipi.
 *
 * Sistemin varsayilan yazi tipi Arapca'yi ciziyor ama Kur'an metni icin
 * yapilmamis: harekeler harflerin uzerine dogru oturmuyor, satirlar sikisik
 * cikiyor ve ekran ucuz gorunuyor. Amiri Quran tam bu is icin cizilmis
 * (Uthmani hatti, hareke yerlesimi dogru) ve 134 KB — pakete gomulmesi
 * kazandirdigi seyin yaninda ucuz kaliyor.
 *
 * Lisans: SIL Open Font License 1.1 (assets/yazitipi/OFL.txt). Gomulu
 * dagitima izin veriyor; tek sart lisans metninin yaninda durmasi, o yuzden
 * OFL.txt depoda ve pakette.
 *
 * Yuklenene kadar `undefined` donuyor: o sirada metin sistem yazi tipiyle
 * ciziliyor. Uygulamayi bir yukleme ekraninin arkasinda bekletmektense ilk
 * karede sistem yazisiyla gostermek daha iyi — fark yalnizca Arapca satirda.
 */
import { useFonts } from "expo-font";

export const ARAPCA_AILE = "AmiriQuran";

export function useArapcaYaziTipi() {
  const [yuklendi] = useFonts({
    [ARAPCA_AILE]: require("../assets/yazitipi/AmiriQuran-Regular.ttf")
  });
  return yuklendi ? ARAPCA_AILE : undefined;
}
