/* YAZILAN METNI COZME.
 *
 * Kullanici basindan geceni yaziyor, bu dosya hangi hale denk dustugunu
 * buluyor. Tamamen telefonda calisiyor: metin hicbir yere gonderilmiyor,
 * hicbir yere kaydedilmiyor, uygulama ekrandan cikinca metin kayboluyor.
 *
 * Bunun bir dil modeli olmadigini bilerek yaptik. Bir modele baglamak icin
 * sunucu, anahtar ve para gerekirdi; daha onemlisi insanlarin en ozel
 * cumlelerini baska bir yere gondermek gerekirdi. Kelime sozlugu daha kaba
 * ama dogru yerde kaba: eslesme bulamadiginda uyduruyor degil, "cikaramadim,
 * sen sec" diyor.
 */
import { RISK, SOZLUK } from "./veri/sozluk";

/* Turkce harfleri ASCII'ye indirip kucuk harfe cevirir.
 *
 * toLowerCase() tek basina yetmiyor: "İ" harfi JavaScript'te "i" + ayri bir
 * nokta isaretine donusuyor ve eslesmeler bozuluyor. Ayrica kullanicilarin
 * cogu Turkce karakter kullanmadan yaziyor ("uzgunum"); iki yazim da ayni
 * yere dusmeli. */
const HARFLER = {
  "İ": "i", "I": "i", "ı": "i", "Ş": "s", "ş": "s", "Ğ": "g", "ğ": "g",
  "Ü": "u", "ü": "u", "Ö": "o", "ö": "o", "Ç": "c", "ç": "c",
  "Â": "a", "â": "a", "Î": "i", "î": "i", "Û": "u", "û": "u"
};

export function sadelestir(metin) {
  if (!metin) return "";
  let cikti = "";
  for (const harf of metin) cikti += HARFLER[harf] || harf;
  return cikti
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function maddeyiAyir(madde) {
  const parcalar = madde.split("|");
  return { kok: sadelestir(parcalar[0]), agirlik: Number(parcalar[1]) || 1 };
}

/* Bosluklu madde metnin icinde aynen aranir; tek kelimelik madde ise bir
 * kelimenin BASI olmali. "uzul" maddesi "uzuldum"u yakalar ama "guzul"u
 * yakalamaz. */
function eslesiyorMu(kok, metin, kelimeler) {
  if (kok.includes(" ")) return metin.includes(kok);
  return kelimeler.some((kelime) => kelime.startsWith(kok));
}

export function riskVarMi(metin) {
  const sade = sadelestir(metin);
  const kelimeler = sade.split(" ");
  return RISK.some((madde) => eslesiyorMu(sadelestir(madde), sade, kelimeler));
}

/* Metni cozer.
 *
 * Doner: { durum, risk, siralama }
 *   durum    "bos" | "bulundu" | "bulunamadi"
 *   risk     true ise once yardim ekrani gosterilmeli
 *   siralama [{ halId, puan, eslesenler }] — puana gore azalan
 */
export function metniCoz(metin) {
  const sade = sadelestir(metin);
  if (sade.length < 3) return { durum: "bos", risk: false, siralama: [] };

  const kelimeler = sade.split(" ");
  const siralama = [];

  for (const [halId, maddeler] of Object.entries(SOZLUK)) {
    let puan = 0;
    const eslesenler = [];
    for (const madde of maddeler) {
      const { kok, agirlik } = maddeyiAyir(madde);
      if (eslesiyorMu(kok, sade, kelimeler)) {
        puan += agirlik;
        eslesenler.push(kok);
      }
    }
    if (puan > 0) siralama.push({ halId, puan, eslesenler });
  }

  siralama.sort((a, b) => b.puan - a.puan);

  return {
    durum: siralama.length ? "bulundu" : "bulunamadi",
    risk: riskVarMi(metin),
    siralama
  };
}
