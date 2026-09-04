/* SOZLUK TESTI — gercek cumleler, beklenen haller.
 *
 *     npm run coz-dene
 *
 * Sozlukte bir agirlik degistirdiginde baska bir cumleyi bozup bozmadigini
 * burada goruyorsun. Yeni kelime ekleyince buraya da o kelimeyi iceren bir
 * cumle ekle — listeyi buyutmek bu isin en ucuz sigortasi.
 *
 * `src/coz.js` ve `src/veri/sozluk.js` uygulama tarafinda ES modulu; bu betik
 * Node'da duz calissin diye import/export satirlarini soyup dosyalari
 * degerlendiriyor. Ayri bir derleme adimi eklemekten daha ucuz.
 */
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");

function yukle(gorece) {
  return fs
    .readFileSync(path.join(KOK, gorece), "utf8")
    .replace(/^import .*$/gm, "")
    .replace(/export (const|function)/g, "$1");
}

const kutu = { exports: {} };
new Function(
  "module",
  "exports",
  yukle("src/veri/sozluk.js") +
    "\n" +
    yukle("src/coz.js") +
    "\nmodule.exports = { metniCoz };"
)(kutu, kutu.exports);
const { metniCoz } = kutu.exports;

/* [cumle, beklenen hal] — "RISK" beklenen deger olarak da yazilabilir.
 * "-" beklenen deger, hicbir eslesme olmamasi gerektigi anlamina gelir. */
const TESTLER = [
  ["Annem geçen hafta vefat etti, çok üzgünüm", "yas"],
  ["Babam rahmetli oldu, çok zor geliyor", "yas"],
  ["Yarın sınavım var çok stresliyim, yetiştiremiyorum", "sinav"],
  ["Kocamla kavga ettik, çok sinirliyim, bağırdım", "ofke"],
  ["Borçlarım var, kirayı ödeyemiyorum", "rizik"],
  ["Ay sonunu getiremiyoruz, maaş yetmiyor", "rizik"],
  ["Kimse beni anlamıyor, yalnızım, arkadaşım yok", "yalnizlik"],
  ["İçim daralıyor, kötü bir şey olacak gibi hissediyorum", "kaygi"],
  ["İşe girdim çok mutluyum elhamdülillah", "sevinc"],
  ["Terfi aldım, kabul aldım", "sevinc"],
  ["Eşimle küs durumdayız, barışmak istiyorum", "affetme"],
  ["Yarın uçakla yola çıkıyorum", "yolculuk"],
  ["Bana iftira attılar, hakkımı arayamıyorum", "haksizlik"],
  ["Annem hasta, hastanede ameliyat olacak", "hastalik"],
  ["Kızım için dua etmek istiyorum", "sevdiklerim"],

  /* Bes yeni hal */
  ["Eşimle sürekli tartışıyoruz, geçinemiyoruz", "iliski"],
  ["Boşanmayı düşünüyorum, ilişkimiz bitti sayılır", "iliski"],
  ["Yıllardır çocuğumuz olmuyor, tüp bebek denedik", "cocuk"],
  ["Hamile kalamıyorum, anne olmak istiyorum", "cocuk"],
  ["Beni aldattı, yıllarca yalan söylemiş", "guven"],
  ["Güvenim sarsıldı, arkamdan iş çevirmişler", "guven"],
  ["Nazar değdi galiba, herkes çok kıskanıyor", "nazar"],
  ["Kem gözden çekiniyorum", "nazar"],
  ["Memleketimi özledim, gurbet çok ağır", "ozlem"],
  ["Annemi özlüyorum, yıllardır göremiyorum", "ozlem"],

  /* Olumsuzluk: eslesen kelimenin ardindan "yok" / "degil" gelirse sayilmaz */
  ["Kaygım yok ama param yok", "rizik"],
  ["Hasta değilim, sadece çok yorgunum", "umutsuzluk"],

  /* Risk */
  ["Ölmek istiyorum artık dayanamıyorum", "RISK"],
  ["Kendime zarar vermeyi düşünüyorum", "RISK"],

  /* Eslesme olmamasi gerekenler */
  ["Bugün hava çok güzeldi", "-"],
  ["Akşam ne pişireceğimi düşünüyorum", "-"]
];

let gecen = 0;
const kalanlar = [];

for (const [cumle, beklenen] of TESTLER) {
  const sonuc = metniCoz(cumle);
  const ilk = sonuc.siralama[0];
  const bulunan = sonuc.risk ? "RISK" : ilk ? ilk.halId : "-";
  const tamam = bulunan === beklenen;
  if (tamam) gecen++;
  else kalanlar.push({ cumle, beklenen, bulunan, sonuc });
}

console.log(gecen + "/" + TESTLER.length + " gecti");

if (kalanlar.length) {
  console.log("");
  for (const k of kalanlar) {
    const ilk3 = k.sonuc.siralama
      .slice(0, 3)
      .map((s) => s.halId + "(" + s.puan + ")")
      .join(" ");
    console.log("KALDI: " + k.cumle);
    console.log("  beklenen: " + k.beklenen + "   bulunan: " + k.bulunan);
    console.log("  siralama: " + (ilk3 || "—"));
  }
  process.exit(1);
}
