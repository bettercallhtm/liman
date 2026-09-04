/* AYET METINLERINI CEKER — derleme oncesi bir kez calisir, internet ister.
 *
 *     node araclar/ayet-cek.js
 *
 * Ciktisi: src/veri/ayetler.json  (uygulamaya gomulur, calisirken internet
 * gerekmez).
 *
 * NEDEN BOYLE: Kutsal metin elle yazilmaz. secim.js sadece "hangi ayet"
 * diyor, metnin kendisi her zaman kaynaktan geliyor. Boylece yanlis
 * hatirlanmis / eksik yazilmis tek bir kelime bile uygulamaya giremiyor.
 *
 * Kaynak: alquran.cloud (metinler Tanzil.net derlemesinden). Arapca metin
 * Uthmani hatti, okunusu Muhammet Abay ceviriyazisi, meal secim.js'teki
 * CEVIRI ayarina gore.
 */
const fs = require("fs");
const path = require("path");
const { CEVIRI, HALLER, GIRIS_AYETI } = require("./secim.js");
const SURE_ADLARI = require("./sure-adlari.js");

const ARAPCA = "quran-uthmani";
const OKUNUS = "tr.transliteration";
const KOK = path.join(__dirname, "..");
const CIKTI = path.join(KOK, "src", "veri", "icerik.json");

/* Ceviriyazi kaynagi ayn/hemze icin ters tirnak kullaniyor (`me`a`). Ters
 * tirnak Turkce klavyede baska anlama geliyor, okuyunca takiliyor; standart
 * isarete cevriliyor. Metnin kendisine dokunulmuyor. */
function okunusuDuzelt(metin) {
  return metin.replace(/`/g, "ʿ").replace(/\s+/g, " ").trim();
}

function beklet(ms) {
  return new Promise((c) => setTimeout(c, ms));
}

async function ayetCek(referans) {
  const url =
    "https://api.alquran.cloud/v1/ayah/" +
    referans +
    "/editions/" +
    [ARAPCA, OKUNUS, CEVIRI].join(",");

  for (let deneme = 1; deneme <= 4; deneme++) {
    try {
      const cevap = await fetch(url);
      if (!cevap.ok) throw new Error("HTTP " + cevap.status);
      const govde = await cevap.json();
      if (govde.code !== 200 || !Array.isArray(govde.data)) {
        throw new Error("beklenmeyen cevap");
      }
      const parca = {};
      for (const kayit of govde.data) parca[kayit.edition.identifier] = kayit;

      const temel = parca[ARAPCA];
      if (!temel) throw new Error("Arapca metin yok");
      const sureNo = temel.surah.number;
      const ayetNo = temel.numberInSurah;

      /* Ref yanlis yazilmissa (orn. sure 94'un 9. ayeti yok) API baska bir
       * ayet donebiliyor. Sessizce yanlis ayet yayinlamamak icin dogrula. */
      if (sureNo + ":" + ayetNo !== referans) {
        throw new Error(
          "referans tutmadi: istenen " + referans + ", gelen " + sureNo + ":" + ayetNo
        );
      }

      return {
        ref: referans,
        sure: sureNo,
        ayet: ayetNo,
        sureAdi: SURE_ADLARI[sureNo - 1],
        arapca: temel.text.trim(),
        okunus: parca[OKUNUS] ? okunusuDuzelt(parca[OKUNUS].text) : "",
        meal: parca[CEVIRI] ? parca[CEVIRI].text.trim() : ""
      };
    } catch (hata) {
      if (deneme === 4) throw new Error(referans + " cekilemedi: " + hata.message);
      await beklet(400 * deneme);
    }
  }
}

async function calis() {
  const referanslar = [GIRIS_AYETI];
  for (const hal of HALLER) {
    for (const grup of [...hal.ayetler, ...hal.dualar]) {
      for (const ref of grup) if (!referanslar.includes(ref)) referanslar.push(ref);
    }
  }

  console.log(referanslar.length + " ayet cekilecek (meal: " + CEVIRI + ")");
  const ayetler = {};
  let sayac = 0;
  for (const ref of referanslar) {
    ayetler[ref] = await ayetCek(ref);
    sayac++;
    if (sayac % 10 === 0) console.log("  " + sayac + "/" + referanslar.length);
    await beklet(120);
  }

  const eksikMeal = Object.values(ayetler).filter((a) => !a.meal).map((a) => a.ref);
  if (eksikMeal.length) {
    throw new Error("meali bos gelen ayetler var: " + eksikMeal.join(", "));
  }

  const paket = {
    uretim: new Date().toISOString().slice(0, 10),
    ceviri: CEVIRI,
    girisAyeti: GIRIS_AYETI,
    kaynak: "alquran.cloud / Tanzil.net",
    haller: HALLER,
    ayetler
  };

  fs.mkdirSync(path.dirname(CIKTI), { recursive: true });
  fs.writeFileSync(CIKTI, JSON.stringify(paket, null, 1), "utf8");
  console.log("yazildi: " + CIKTI + " (" + referanslar.length + " ayet)");
}

calis().catch((hata) => {
  console.error("HATA: " + hata.message);
  process.exit(1);
});
