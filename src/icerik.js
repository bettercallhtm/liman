/* Icerige erisim ve kart secimi.
 *
 * Veri `veri/icerik.json` icinde ve uygulamaya gomulu — calisirken internet
 * gerekmiyor. O dosya elle duzenlenmiyor; `araclar/ayet-cek.js` uretiyor. */
import VERI from "./veri/icerik.json";

export const HALLER = VERI.haller;
export const CEVIRI_ADI = "Elmalılı Hamdi Yazır";
export const KAYNAK_ADI = VERI.kaynak;

export function ayetAl(ref) {
  return VERI.ayetler[ref];
}

export function grubuAl(grup) {
  return grup.map((ref) => VERI.ayetler[ref]).filter(Boolean);
}

export function haliBul(halId) {
  return HALLER.find((h) => h.id === halId);
}

/* Bir ayet grubunun basligi: "Bakara 2:155-157" ya da "Ra'd 13:28" */
export function grupBasligi(grup) {
  const ayetler = grubuAl(grup);
  if (!ayetler.length) return "";
  const ilk = ayetler[0];
  if (ayetler.length === 1) return ilk.sureAdi + " " + ilk.sure + ":" + ilk.ayet;
  const son = ayetler[ayetler.length - 1];
  return ilk.sureAdi + " " + ilk.sure + ":" + ilk.ayet + "-" + son.ayet;
}

/* Gunun ayeti: tarihe gore sabit. Ayni gun icinde uygulama kac kez acilirsa
 * acilsin ayni ayet gelir, ertesi gun degisir. */
function gunSayisi(tarih = new Date()) {
  return Math.floor(
    Date.UTC(tarih.getFullYear(), tarih.getMonth(), tarih.getDate()) / 86400000
  );
}

export function gununAyeti(tarih = new Date()) {
  const refler = Object.keys(VERI.ayetler);
  return VERI.ayetler[refler[gunSayisi(tarih) % refler.length]];
}

export function girisAyeti() {
  return VERI.ayetler[VERI.girisAyeti];
}

/* Kart uretimi.
 *
 * Rastgele degil, "en son gosterilenin bir sonrasi": kullanici ayni hale
 * arka arkaya basinca listede ilerliyor, boylece hem tekrar olmuyor hem de
 * zamanla o halin butun ayetlerini goruyor. */
export function kartUret(halId, sonGosterilen) {
  const hal = haliBul(halId);
  if (!hal) return null;
  const onceki = sonGosterilen && sonGosterilen[halId];
  const ayetIndis = onceki ? (onceki.ayetIndis + 1) % hal.ayetler.length : 0;
  const duaIndis = onceki ? (onceki.duaIndis + 1) % hal.dualar.length : 0;
  const sozIndis = ayetIndis % hal.sozler.length;

  /* Oneriler ayetle ayni hizada donmesin: ikisi birlikte ilerlerse ayni
   * ayet-oneri ucluşunu hep birlikte goruyorsun. Baslangic noktasi ayet ve
   * dua indislerinin toplami. */
  const basla = (ayetIndis + duaIndis) % hal.notlar.length;
  const oneriler = [0, 1, 2].map((i) => hal.notlar[(basla + i) % hal.notlar.length]);

  return {
    halId,
    halAdi: hal.ad,
    renk: hal.renk,
    ayetGrup: hal.ayetler[ayetIndis],
    duaGrup: hal.dualar[duaIndis],
    soz: hal.sozler[sozIndis],
    oneriler,
    ayetIndis,
    duaIndis
  };
}

/* Paylas dugmesinin urettigi metin. Meal ve kaynak her zaman birlikte
 * gidiyor — alintinin nereden geldigi kaybolmasin. */
export function paylasimMetni(kart) {
  const satirlar = [];
  const ayetler = grubuAl(kart.ayetGrup);
  satirlar.push(ayetler.map((a) => a.meal).join(" "));
  satirlar.push("— " + grupBasligi(kart.ayetGrup));
  satirlar.push("");
  const dualar = grubuAl(kart.duaGrup);
  satirlar.push(dualar.map((a) => a.meal).join(" "));
  satirlar.push("— " + grupBasligi(kart.duaGrup));
  satirlar.push("");
  satirlar.push("Meal: " + CEVIRI_ADI + " · Liman");
  return satirlar.join("\n");
}

/* Gunun ayeti de bir kart olarak aciliyor: ayni ekran, ayni kaydetme ve
 * paylasma dugmeleri. Dua yerinde giris ayeti duruyor ("Bana dua edin, size
 * karsilik vereyim") — hangi ayet gelirse gelsin yanina uyan tek dua o. */
export function gununKarti() {
  const ayet = gununAyeti();
  return {
    halId: "gunun",
    halAdi: "Günün ayeti",
    renk: "#C9A961",
    ayetGrup: [ayet.sure + ":" + ayet.ayet],
    duaGrup: [VERI.girisAyeti],
    soz: "Allah'ım, bugün okuduğumu kalbimde bırak. Anladığım kadarını yaşamayı nasip et.",
    oneriler: [
      "Bugün bir kez oku, sonra telefonu bırak. Okuduğun şeyin işini görmesi için biraz sessizlik gerekiyor.",
      "Aklında kalan tek cümleyi bir yere yaz.",
      "Akşam bir daha bak; sabah okuduğun şey akşam başka geliyor."
    ],
    ayetIndis: 0,
    duaIndis: 0
  };
}
