/* Telefonda kalan her sey burada. Sunucu yok, hesap yok, internet yok:
 * favoriler de gunluk kaydi da yalnizca cihazda duruyor. Uygulama silinince
 * gidiyorlar — Gizlilik metninde de aynen boyle yaziyor, degistirilirse orasi
 * da degismeli. */
import AsyncStorage from "@react-native-async-storage/async-storage";

const ANAHTAR = {
  favoriler: "dp.favoriler",
  gunluk: "dp.gunluk",
  ayarlar: "dp.ayarlar",
  sonGosterilen: "dp.sonGosterilen"
};

async function oku(anahtar, varsayilan) {
  try {
    const ham = await AsyncStorage.getItem(anahtar);
    if (!ham) return varsayilan;
    return JSON.parse(ham);
  } catch (hata) {
    /* Bozuk kayit uygulamayi acilmaz hale getirmesin: varsayilana don. */
    return varsayilan;
  }
}

async function yaz(anahtar, deger) {
  try {
    await AsyncStorage.setItem(anahtar, JSON.stringify(deger));
  } catch (hata) {
    /* Disk doluysa yapacak bir sey yok; uygulama calismaya devam etsin. */
  }
}

/* ---- Favoriler ---- */

export function favoriKimlik(kart) {
  return kart.halId + "|" + kart.ayetGrup.join(",") + "|" + kart.duaGrup.join(",");
}

export async function favorileriAl() {
  return oku(ANAHTAR.favoriler, []);
}

export async function favoriEkle(kart) {
  const liste = await favorileriAl();
  const kimlik = favoriKimlik(kart);
  if (liste.some((k) => favoriKimlik(k) === kimlik)) return liste;
  const yeni = [{ ...kart, eklendi: Date.now() }, ...liste];
  await yaz(ANAHTAR.favoriler, yeni);
  return yeni;
}

export async function favoriCikar(kart) {
  const liste = await favorileriAl();
  const kimlik = favoriKimlik(kart);
  const yeni = liste.filter((k) => favoriKimlik(k) !== kimlik);
  await yaz(ANAHTAR.favoriler, yeni);
  return yeni;
}

/* ---- Gunluk: hangi gun hangi hal secildi ---- */

export function bugununAnahtari(tarih = new Date()) {
  const ay = String(tarih.getMonth() + 1).padStart(2, "0");
  const gun = String(tarih.getDate()).padStart(2, "0");
  return tarih.getFullYear() + "-" + ay + "-" + gun;
}

export async function gunlugeYaz(halId) {
  const gunluk = await oku(ANAHTAR.gunluk, {});
  gunluk[bugununAnahtari()] = halId;
  /* Gunluk sinirsiz buyumesin: son 120 gun yeterli. */
  const gunler = Object.keys(gunluk).sort();
  while (gunler.length > 120) delete gunluk[gunler.shift()];
  await yaz(ANAHTAR.gunluk, gunluk);
  return gunluk;
}

export async function gunluguAl() {
  return oku(ANAHTAR.gunluk, {});
}

/* ---- Ayarlar ---- */

export const VARSAYILAN_AYARLAR = {
  hatirlaticiAcik: false,
  hatirlaticiSaat: 21,
  hatirlaticiDakika: 0,
  arapcaGoster: true,
  okunusGoster: true
};

export async function ayarlariAl() {
  const kayitli = await oku(ANAHTAR.ayarlar, {});
  return { ...VARSAYILAN_AYARLAR, ...kayitli };
}

export async function ayarlariYaz(ayarlar) {
  await yaz(ANAHTAR.ayarlar, ayarlar);
  return ayarlar;
}

/* ---- Son gosterilen kart ----
 * Ayni hale ust uste basinca ayni ayeti vermemek icin. */

export async function sonGosterilenleriAl() {
  return oku(ANAHTAR.sonGosterilen, {});
}

export async function sonGosterileniYaz(halId, ayetIndis, duaIndis) {
  const hepsi = await oku(ANAHTAR.sonGosterilen, {});
  hepsi[halId] = { ayetIndis, duaIndis };
  await yaz(ANAHTAR.sonGosterilen, hepsi);
}
