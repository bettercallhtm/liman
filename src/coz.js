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
 *
 * Sozlugu degistirdikten sonra `npm run coz-dene` calistir: gercek cumlelerle
 * kurulmus bir test listesi var, bir agirligi degistirirken baska bir cumleyi
 * bozdugunu orada goruyorsun.
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

/* Olumsuzluk isaretleri. Turkce'de olumsuzluk eslestigimiz kelimeden SONRA
 * geliyor: "kaygim yok", "uzgun degilim", "hasta degilim". Bu yuzden bir
 * eslesme bulundugunda ardindaki iki kelimeye bakiliyor; olumsuzluk varsa o
 * eslesme sayilmiyor.
 *
 * "kimsem yok" gibi maddeler bundan etkilenmiyor, cunku onlar zaten cok
 * kelimeli madde olarak yaziliyor ve olumsuzluk kontrolu maddenin bittigi
 * yerden SONRAYA bakiyor. */
const OLUMSUZ = ["degil", "yok"];

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

function olumsuzlanmisMi(kelimeler, indis) {
  for (let i = indis; i < Math.min(indis + 2, kelimeler.length); i++) {
    if (OLUMSUZ.some((ek) => kelimeler[i].startsWith(ek))) return true;
  }
  return false;
}

/* Bir maddenin metinde gecip gecmedigi.
 *
 * Tek kelimelik madde bir kelimenin BASI olmali: "uzul" maddesi "uzuldum"u
 * yakalar, "guzul"u yakalamaz. Cok kelimelik madde ardisik kelimelere
 * oturmali; son kelimesi ek alabilir, oncekiler tam eslesir. Iki durumda da
 * maddeden sonraki kelimelerde olumsuzluk varsa eslesme sayilmiyor. */
function eslesmeVarMi(kok, kelimeler) {
  const parcalar = kok.split(" ");

  for (let i = 0; i <= kelimeler.length - parcalar.length; i++) {
    let tuttu = true;
    for (let j = 0; j < parcalar.length; j++) {
      const sonMu = j === parcalar.length - 1;
      const uyuyor = sonMu
        ? kelimeler[i + j].startsWith(parcalar[j])
        : kelimeler[i + j] === parcalar[j];
      if (!uyuyor) {
        tuttu = false;
        break;
      }
    }
    if (tuttu && !olumsuzlanmisMi(kelimeler, i + parcalar.length)) return true;
  }
  return false;
}

export function riskVarMi(metin) {
  const kelimeler = sadelestir(metin).split(" ");
  return RISK.some((madde) => eslesmeVarMi(sadelestir(madde), kelimeler));
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
      if (eslesmeVarMi(kok, kelimeler)) {
        puan += agirlik;
        eslesenler.push(kok);
      }
    }
    if (puan > 0) siralama.push({ halId, puan, eslesenler });
  }

  /* Puan esitse daha cok ayri kelimeyle eslesen kazanir: tek bir agir
   * kelimeye dayanan eslesme, uc ayri kelimenin isaret ettiginden zayif. */
  siralama.sort(
    (a, b) => b.puan - a.puan || b.eslesenler.length - a.eslesenler.length
  );

  return {
    durum: siralama.length ? "bulundu" : "bulunamadi",
    risk: riskVarMi(metin),
    siralama
  };
}
