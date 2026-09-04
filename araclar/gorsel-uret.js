/* SIMGE VE ACILIS GORSELLERI
 *
 *     node araclar/gorsel-uret.js
 *
 * Kaynak: araclar/logo.png — iki panelli marka gorseli. Solda krem zeminli
 * el yazisi kelime markasi ve "ruh haline gore dua" satiri, sagda lacivert
 * zeminli serif "Liman" simgesi. Betik bu iki paneli kendisi buluyor
 * (aralarindaki beyaz bosluga bakarak), gereken parcayi kirpip olcekliyor.
 *
 * Neden kaynaktan turetiyoruz: Play'in istedigi olculer (512, 1024, 1024x500)
 * ve Android'in uyarlanabilir simge guvenli alani birbirinden farkli. Elle
 * kirpilan PNG'ler zamanla birbirinden kopuyor; burada hepsi tek dosyadan,
 * her calistirmada ayni sekilde cikiyor. Logo degisirse tek yapilacak sey
 * araclar/logo.png dosyasini degistirip bu betigi tekrar calistirmak.
 *
 * Tek istisna bildirim simgesi: Android onu siluet olarak kullaniyor, renk
 * bilgisini atip yalnizca saydamliga bakiyor. Kelime markasi o boyutta
 * okunmadigi icin o hala kodla cizilen sekiz koseli yildiz (rub'ul hizb).
 *
 * Disaridan kutuphane yok: PNG'yi elle okuyup elle yaziyoruz (Node'un kendi
 * zlib'i disinda bir sey kullanmiyor).
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const KAYNAK = path.join(__dirname, "logo.png");
const CIKTI_KLASOR = path.join(__dirname, "..", "assets");

/* Android'in uyarlanabilir simgesi disaridan kirpiliyor: 1024'luk on planin
 * yalnizca ortadaki %66'si her cihazda goruntuleniyor. Kelime markasi genis
 * oldugu icin bu sinir onemli — asarsa "L" ile "n" kesiliyor. */
const GUVENLI_ALAN = 0.66;

/* ---- PNG yazimi ---- */

const CRC_TABLOSU = (() => {
  const tablo = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tablo[i] = c;
  }
  return tablo;
})();

function crc32(veri) {
  let c = -1;
  for (let i = 0; i < veri.length; i++) c = CRC_TABLOSU[(c ^ veri[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function parca(tur, govde) {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(govde.length, 0);
  const etiketVeGovde = Buffer.concat([Buffer.from(tur, "ascii"), govde]);
  const kontrol = Buffer.alloc(4);
  kontrol.writeUInt32BE(crc32(etiketVeGovde), 0);
  return Buffer.concat([uzunluk, etiketVeGovde, kontrol]);
}

/* pikseller: RGBA, satir satir. */
function pngYaz(dosya, genislik, yukseklik, pikseller) {
  const satirlar = Buffer.alloc((genislik * 4 + 1) * yukseklik);
  for (let y = 0; y < yukseklik; y++) {
    const hedef = y * (genislik * 4 + 1);
    satirlar[hedef] = 0; /* filtre yok */
    pikseller.copy(satirlar, hedef + 1, y * genislik * 4, (y + 1) * genislik * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(genislik, 0);
  ihdr.writeUInt32BE(yukseklik, 4);
  ihdr[8] = 8; /* bit derinligi */
  ihdr[9] = 6; /* RGBA */

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    parca("IHDR", ihdr),
    parca("IDAT", zlib.deflateSync(satirlar, { level: 9 })),
    parca("IEND", Buffer.alloc(0))
  ]);

  fs.writeFileSync(dosya, png);
  return png.length;
}

function kaydet(dosya, gorsel) {
  const boy = pngYaz(
    path.join(CIKTI_KLASOR, dosya),
    gorsel.genislik,
    gorsel.yukseklik,
    gorsel.pikseller
  );
  const olcu = gorsel.genislik + "x" + gorsel.yukseklik;
  console.log("  " + dosya.padEnd(30) + olcu.padEnd(10) + Math.round(boy / 1024) + " KB");
}

/* ---- PNG okuma ---- */

/* Yalnizca 8 bitlik, taramasiz (interlace yok) RGB ve RGBA dosyalari okuyor —
 * logo.png bu bicimde. Baska bir bicim gelirse sessizce yanlis gorsel
 * uretmektense hata veriyor. */
function pngOku(dosya) {
  const veri = fs.readFileSync(dosya);
  let konum = 8;
  let ihdr = null;
  const idat = [];

  while (konum < veri.length) {
    const uzunluk = veri.readUInt32BE(konum);
    const tur = veri.toString("ascii", konum + 4, konum + 8);
    const govde = veri.slice(konum + 8, konum + 8 + uzunluk);
    if (tur === "IHDR") ihdr = govde;
    else if (tur === "IDAT") idat.push(govde);
    else if (tur === "IEND") break;
    konum += 12 + uzunluk;
  }

  const genislik = ihdr.readUInt32BE(0);
  const yukseklik = ihdr.readUInt32BE(4);
  const derinlik = ihdr[8];
  const renkTipi = ihdr[9];
  const tarama = ihdr[12];

  if (derinlik !== 8 || (renkTipi !== 2 && renkTipi !== 6) || tarama !== 0) {
    throw new Error(
      "logo.png beklenen bicimde degil (8 bit RGB/RGBA, taramasiz). Bulunan: " +
        "derinlik " + derinlik + ", renk tipi " + renkTipi + ", tarama " + tarama
    );
  }

  const kanal = renkTipi === 2 ? 3 : 4;
  const ham = zlib.inflateSync(Buffer.concat(idat));
  const satirBoyu = genislik * kanal;
  const pikseller = Buffer.alloc(genislik * yukseklik * 4);
  let onceki = Buffer.alloc(satirBoyu);

  for (let y = 0; y < yukseklik; y++) {
    const bas = y * (satirBoyu + 1);
    const filtre = ham[bas];
    const satir = Buffer.from(ham.slice(bas + 1, bas + 1 + satirBoyu));

    /* PNG satirlari bir onceki satira ve soldaki piksele gore farkla
     * saklaniyor; okurken bu farki geri ekliyoruz. */
    for (let i = 0; i < satirBoyu; i++) {
      const sol = i >= kanal ? satir[i - kanal] : 0;
      const ust = onceki[i];
      const capraz = i >= kanal ? onceki[i - kanal] : 0;
      let d = satir[i];
      if (filtre === 1) d += sol;
      else if (filtre === 2) d += ust;
      else if (filtre === 3) d += (sol + ust) >> 1;
      else if (filtre === 4) {
        const tahmin = sol + ust - capraz;
        const farkSol = Math.abs(tahmin - sol);
        const farkUst = Math.abs(tahmin - ust);
        const farkCapraz = Math.abs(tahmin - capraz);
        d += farkSol <= farkUst && farkSol <= farkCapraz ? sol : farkUst <= farkCapraz ? ust : capraz;
      }
      satir[i] = d & 0xff;
    }

    for (let x = 0; x < genislik; x++) {
      const hedef = (y * genislik + x) * 4;
      pikseller[hedef] = satir[x * kanal];
      pikseller[hedef + 1] = satir[x * kanal + 1];
      pikseller[hedef + 2] = satir[x * kanal + 2];
      pikseller[hedef + 3] = kanal === 4 ? satir[x * kanal + 3] : 255;
    }

    onceki = satir;
  }

  return { genislik, yukseklik, pikseller };
}

/* ---- Gorsel islemleri ---- */

function tuval(genislik, yukseklik, renk) {
  const pikseller = Buffer.alloc(genislik * yukseklik * 4);
  for (let i = 0; i < genislik * yukseklik; i++) {
    pikseller[i * 4] = renk[0];
    pikseller[i * 4 + 1] = renk[1];
    pikseller[i * 4 + 2] = renk[2];
    pikseller[i * 4 + 3] = 255;
  }
  return { genislik, yukseklik, pikseller };
}

function renkAl(gorsel, x, y) {
  const k = (y * gorsel.genislik + x) * 4;
  return [gorsel.pikseller[k], gorsel.pikseller[k + 1], gorsel.pikseller[k + 2]];
}

function kirp(gorsel, x0, y0, genislik, yukseklik) {
  const pikseller = Buffer.alloc(genislik * yukseklik * 4);
  for (let y = 0; y < yukseklik; y++) {
    const kaynakBas = ((y0 + y) * gorsel.genislik + x0) * 4;
    gorsel.pikseller.copy(pikseller, y * genislik * 4, kaynakBas, kaynakBas + genislik * 4);
  }
  return { genislik, yukseklik, pikseller };
}

/* Yariya indirme: 2x2 ortalamasi. Buyuk kucultmeleri once bununla yapip kalan
 * arayi ikili orneklemeyle kapatmak, dogrudan orneklemeye gore cok daha temiz
 * kenar veriyor — serif harflerin ince uclari kaybolmuyor. */
function yariya(gorsel) {
  const genislik = Math.floor(gorsel.genislik / 2);
  const yukseklik = Math.floor(gorsel.yukseklik / 2);
  const pikseller = Buffer.alloc(genislik * yukseklik * 4);
  for (let y = 0; y < yukseklik; y++) {
    for (let x = 0; x < genislik; x++) {
      for (let k = 0; k < 4; k++) {
        const a = gorsel.pikseller[(y * 2 * gorsel.genislik + x * 2) * 4 + k];
        const b = gorsel.pikseller[(y * 2 * gorsel.genislik + x * 2 + 1) * 4 + k];
        const c = gorsel.pikseller[((y * 2 + 1) * gorsel.genislik + x * 2) * 4 + k];
        const d = gorsel.pikseller[((y * 2 + 1) * gorsel.genislik + x * 2 + 1) * 4 + k];
        pikseller[(y * genislik + x) * 4 + k] = Math.round((a + b + c + d) / 4);
      }
    }
  }
  return { genislik, yukseklik, pikseller };
}

function olcekle(gorsel, hedefGenislik, hedefYukseklik) {
  let kaynak = gorsel;
  while (kaynak.genislik >= hedefGenislik * 2 && kaynak.yukseklik >= hedefYukseklik * 2) {
    kaynak = yariya(kaynak);
  }

  const pikseller = Buffer.alloc(hedefGenislik * hedefYukseklik * 4);
  const oranX = kaynak.genislik / hedefGenislik;
  const oranY = kaynak.yukseklik / hedefYukseklik;

  for (let y = 0; y < hedefYukseklik; y++) {
    const ky = Math.min(kaynak.yukseklik - 1, Math.max(0, (y + 0.5) * oranY - 0.5));
    const y0 = Math.floor(ky);
    const y1 = Math.min(kaynak.yukseklik - 1, y0 + 1);
    const ay = ky - y0;

    for (let x = 0; x < hedefGenislik; x++) {
      const kx = Math.min(kaynak.genislik - 1, Math.max(0, (x + 0.5) * oranX - 0.5));
      const x0 = Math.floor(kx);
      const x1 = Math.min(kaynak.genislik - 1, x0 + 1);
      const ax = kx - x0;

      for (let k = 0; k < 4; k++) {
        const ust =
          kaynak.pikseller[(y0 * kaynak.genislik + x0) * 4 + k] * (1 - ax) +
          kaynak.pikseller[(y0 * kaynak.genislik + x1) * 4 + k] * ax;
        const alt =
          kaynak.pikseller[(y1 * kaynak.genislik + x0) * 4 + k] * (1 - ax) +
          kaynak.pikseller[(y1 * kaynak.genislik + x1) * 4 + k] * ax;
        pikseller[(y * hedefGenislik + x) * 4 + k] = Math.round(ust * (1 - ay) + alt * ay);
      }
    }
  }

  return { genislik: hedefGenislik, yukseklik: hedefYukseklik, pikseller };
}

function yapistir(hedef, kaynak, x0, y0) {
  for (let y = 0; y < kaynak.yukseklik; y++) {
    const hy = y0 + y;
    if (hy < 0 || hy >= hedef.yukseklik) continue;
    for (let x = 0; x < kaynak.genislik; x++) {
      const hx = x0 + x;
      if (hx < 0 || hx >= hedef.genislik) continue;
      const k = (y * kaynak.genislik + x) * 4;
      const h = (hy * hedef.genislik + hx) * 4;
      const alfa = kaynak.pikseller[k + 3] / 255;
      for (let i = 0; i < 3; i++) {
        hedef.pikseller[h + i] = Math.round(
          hedef.pikseller[h + i] * (1 - alfa) + kaynak.pikseller[k + i] * alfa
        );
      }
      hedef.pikseller[h + 3] = 255;
    }
  }
}

/* Kelime markasini hedefin ortasina, genisligi verilen orana gelecek sekilde
 * yerlestirir. */
function ortala(hedef, marka, genislikOrani) {
  const genislik = Math.round(hedef.genislik * genislikOrani);
  const yukseklik = Math.round((genislik * marka.yukseklik) / marka.genislik);
  yapistir(
    hedef,
    olcekle(marka, genislik, yukseklik),
    Math.round((hedef.genislik - genislik) / 2),
    Math.round((hedef.yukseklik - yukseklik) / 2)
  );
}

/* ---- Kaynaktaki panelleri bulma ---- */

function beyazMi(gorsel, x, y) {
  const k = (y * gorsel.genislik + x) * 4;
  return gorsel.pikseller[k] > 246 && gorsel.pikseller[k + 1] > 246 && gorsel.pikseller[k + 2] > 246;
}

function panelleriBul(gorsel) {
  const orta = Math.floor(gorsel.yukseklik / 2);
  const bloklar = [];
  let bas = null;

  for (let x = 0; x < gorsel.genislik; x++) {
    const beyaz = beyazMi(gorsel, x, orta);
    if (!beyaz && bas === null) bas = x;
    if (beyaz && bas !== null) {
      if (x - bas > 50) bloklar.push([bas, x - 1]);
      bas = null;
    }
  }
  if (bas !== null && gorsel.genislik - bas > 50) bloklar.push([bas, gorsel.genislik - 1]);

  if (bloklar.length !== 2) {
    throw new Error(
      "logo.png icinde iki panel bulunamadi (bulunan: " + bloklar.length + "). " +
        "Kaynak gorsel, aralarinda beyaz bosluk olan iki panelden olusmali."
    );
  }

  const paneller = bloklar.map(function (blok) {
    const x0 = blok[0];
    const x1 = blok[1];
    const ortaX = Math.floor((x0 + x1) / 2);
    let y0 = null;
    let y1 = null;
    for (let y = 0; y < gorsel.yukseklik; y++) {
      if (!beyazMi(gorsel, ortaX, y)) {
        if (y0 === null) y0 = y;
        y1 = y;
      }
    }
    const zemin = renkAl(gorsel, ortaX, y0 + 40);
    return { x0, x1, y0, y1, zemin, parlaklik: (zemin[0] + zemin[1] + zemin[2]) / 3 };
  });

  paneller.sort((a, b) => a.parlaklik - b.parlaklik);
  return { lacivert: paneller[0], krem: paneller[1] };
}

/* Panelin icindeki yazinin sinirlari. Yuvarlatilmis koseler disarida kalsin
 * diye kenardan %8 iceriden taraniyor; kose yaricapi bundan kucuk. */
function icerikSiniri(gorsel, panel) {
  const genislik = panel.x1 - panel.x0 + 1;
  const yukseklik = panel.y1 - panel.y0 + 1;
  const kenar = Math.round(Math.min(genislik, yukseklik) * 0.08);

  let minx = Infinity;
  let maxx = -1;
  let miny = Infinity;
  let maxy = -1;

  for (let py = panel.y0 + kenar; py <= panel.y1 - kenar; py++) {
    for (let px = panel.x0 + kenar; px <= panel.x1 - kenar; px++) {
      const p = renkAl(gorsel, px, py);
      const fark =
        Math.abs(p[0] - panel.zemin[0]) +
        Math.abs(p[1] - panel.zemin[1]) +
        Math.abs(p[2] - panel.zemin[2]);
      if (fark > 90) {
        if (px < minx) minx = px;
        if (px > maxx) maxx = px;
        if (py < miny) miny = py;
        if (py > maxy) maxy = py;
      }
    }
  }

  return { x0: minx, y0: miny, genislik: maxx - minx + 1, yukseklik: maxy - miny + 1 };
}

/* ---- Bildirim simgesi (kodla ciziliyor) ---- */

/* Sekiz koseli yildizin merkeze uzakligi: bir karenin ve 45 derece
 * dondurulmus bir karenin birlesimi, yani ikisinin daha kucuk olani. */
function yildizUzakligi(x, y) {
  const kare = Math.max(Math.abs(x), Math.abs(y));
  const donuk = (Math.abs(x) + Math.abs(y)) / Math.SQRT2;
  return Math.min(kare, donuk);
}

function bildirimSimgesi(boyut, yaricap, kalinlik) {
  const orta = boyut / 2;
  const pikseller = Buffer.alloc(boyut * boyut * 4);

  const icinde = (px, py) => {
    const u = yildizUzakligi(px - orta, py - orta);
    if (u <= yaricap && u >= yaricap - kalinlik) return true;
    return u <= yaricap * 0.17;
  };

  for (let y = 0; y < boyut; y++) {
    for (let x = 0; x < boyut; x++) {
      /* Kenar yumusatma: her pikselde 3x3 ornekleme. Tek ornekle cizilen kenar
       * bu boyutta tirtikli goruluyor. */
      let sayac = 0;
      for (let ax = 0; ax < 3; ax++) {
        for (let ay = 0; ay < 3; ay++) {
          if (icinde(x + (ax + 0.5) / 3, y + (ay + 0.5) / 3)) sayac++;
        }
      }
      const hedef = (y * boyut + x) * 4;
      pikseller[hedef] = 255;
      pikseller[hedef + 1] = 255;
      pikseller[hedef + 2] = 255;
      pikseller[hedef + 3] = Math.round((sayac / 9) * 255);
    }
  }

  return { genislik: boyut, yukseklik: boyut, pikseller };
}

/* ---- Uretim ---- */

function onalti(renk) {
  return "#" + renk.map((k) => k.toString(16).padStart(2, "0")).join("");
}

function calis() {
  fs.mkdirSync(CIKTI_KLASOR, { recursive: true });

  const logo = pngOku(KAYNAK);
  const paneller = panelleriBul(logo);
  const lacivert = paneller.lacivert;
  const krem = paneller.krem;
  const markaLacivert = icerikSiniri(logo, lacivert);
  const markaKrem = icerikSiniri(logo, krem);

  console.log("kaynak: araclar/logo.png  " + logo.genislik + "x" + logo.yukseklik);
  console.log("  lacivert zemin " + onalti(lacivert.zemin) + "   krem zemin " + onalti(krem.zemin));
  console.log("gorseller uretiliyor:");

  /* Simge: lacivert panelin ortasindan kare kirpiliyor. Kirpma alani panelin
   * duz kenarlarinin icinde kaliyor, boylece yuvarlatilmis kose ve disindaki
   * beyaz zemin karenin icine girmiyor — kose yuvarlatmasini Play ve Android
   * zaten kendisi yapiyor. */
  const ic = 8;
  const kareBoyut = Math.min(
    lacivert.x1 - lacivert.x0 + 1 - ic * 2,
    lacivert.y1 - lacivert.y0 + 1 - ic * 2
  );
  const markaOrtasi = markaLacivert.y0 + markaLacivert.yukseklik / 2;
  const kareY = Math.round(
    Math.min(
      Math.max(markaOrtasi - kareBoyut / 2, lacivert.y0 + ic),
      lacivert.y1 - ic - kareBoyut + 1
    )
  );
  const kareX = Math.round((lacivert.x0 + lacivert.x1 + 1 - kareBoyut) / 2);
  const kareSimge = kirp(logo, kareX, kareY, kareBoyut, kareBoyut);

  kaydet("icon.png", olcekle(kareSimge, 1024, 1024));
  kaydet("magaza-simgesi-512.png", olcekle(kareSimge, 512, 512));

  /* Uyarlanabilir simgenin on plani: kelime markasi guvenli alanin icinde
   * kalacak kadar kucultuluyor, arkasi ayni lacivertle dolduruluyor. */
  const marka = kirp(
    logo,
    markaLacivert.x0,
    markaLacivert.y0,
    markaLacivert.genislik,
    markaLacivert.yukseklik
  );
  const uyarlanabilir = tuval(1024, 1024, lacivert.zemin);
  ortala(uyarlanabilir, marka, GUVENLI_ALAN);
  kaydet("adaptive-icon.png", uyarlanabilir);

  /* Acilis gorseli: app.json'daki acilis zemini ayni lacivert oldugu icin
   * kare, ekranda dikissiz duruyor. */
  const acilis = tuval(1024, 1024, lacivert.zemin);
  ortala(acilis, marka, 0.72);
  kaydet("splash-icon.png", acilis);

  kaydet("bildirim-ikonu.png", bildirimSimgesi(96, 34, 5));

  /* Play'in one cikan gorseli: krem panelin el yazisi markasi ve altindaki
   * "ruh haline gore dua" satiri. Play bu gorseli kenarlarindan kirpabildigi
   * icin yazi ortada ve genis bosluklu duruyor. */
  const oneCikan = tuval(1024, 500, krem.zemin);
  const kremMarka = kirp(logo, markaKrem.x0, markaKrem.y0, markaKrem.genislik, markaKrem.yukseklik);
  const ocYukseklik = 340;
  const ocGenislik = Math.round((ocYukseklik * kremMarka.genislik) / kremMarka.yukseklik);
  yapistir(
    oneCikan,
    olcekle(kremMarka, ocGenislik, ocYukseklik),
    Math.round((1024 - ocGenislik) / 2),
    Math.round((500 - ocYukseklik) / 2)
  );
  kaydet("one-cikan-gorsel-1024x500.png", oneCikan);

  console.log("");
  console.log(
    "app.json'daki acilis ve uyarlanabilir simge zemini " + onalti(lacivert.zemin) + " olmali."
  );
}

calis();
