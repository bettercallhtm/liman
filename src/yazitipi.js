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
 * Yukleme `tema.js` icinde, Lora ile birlikte tek seferde yapiliyor;
 * bilesenler aile adini `useTema().yazi.arapca` ile aliyor. Yuklenene kadar
 * `undefined` donuyor: o sirada metin sistem yazi tipiyle ciziliyor. Fark
 * yalnizca Arapca satirda.
 */

/* Arapca-Hint rakamlari: ayet sonu isaretinin (۝) yanina yaziliyor. Bu
 * bir sayi gosterimi, metnin kendisine dokunmuyor. */
const RAKAM = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export function arapcaRakam(sayi) {
  return String(sayi)
    .split("")
    .map((r) => RAKAM[Number(r)] || r)
    .join("");
}
