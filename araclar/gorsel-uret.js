/* SIMGE VE ACILIS GORSELLERI — kodla uretiliyor.
 *
 *     node araclar/gorsel-uret.js
 *
 * Neden kodla: bir tasarim programindan cikan PNG'yi degistirmek icin o
 * programa geri donmek gerekiyor. Burada renk ya da olcu degistirmek tek
 * satir; gorseller de her seferinde ayni cikiyor.
 *
 * Cizilen sekil: sekiz koseli yildiz (rub'ul hizb) — bir karenin ve 45 derece
 * dondurulmus bir karenin birlesimi. Hem Islam geometrisinde tanidik bir
 * motif hem de pusula gulune benziyor; uygulamanin adiyla ortusuyor.
 *
 * Disaridan kutuphane yok: PNG'yi elle kuruyoruz (Node'un kendi zlib'i
 * disinda bir sey kullanmiyor).
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const CIKTI_KLASOR = path.join(__dirname, "..", "assets");

const ZEMIN = [0x0f, 0x14, 0x1c];
const ALTIN = [0xc9, 0xa9, 0x61];

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

/* ---- Sekil ---- */

/* Sekiz koseli yildizin merkeze uzakligi: kare ve dondurulmus karenin
 * birlesimi, yani ikisinin daha kucuk olani. */
function yildizUzakligi(x, y) {
  const kare = Math.max(Math.abs(x), Math.abs(y));
  const donuk = (Math.abs(x) + Math.abs(y)) / Math.SQRT2;
  return Math.min(kare, donuk);
}

/* Kenar yumusatma: her pikselde 3x3 ornekleme. Tek ornekle cizilen kenar
 * kucuk boyutlarda tirtikli goruluyor. */
function kapsama(x, y, test) {
  let sayac = 0;
  for (let ax = 0; ax < 3; ax++) {
    for (let ay = 0; ay < 3; ay++) {
      if (test(x + (ax + 0.5) / 3, y + (ay + 0.5) / 3)) sayac++;
    }
  }
  return sayac / 9;
}

/* Tek gorsel uretir.
 * zeminRenk null ise arka plan saydam kalir (uyarlanabilir simge ve acilis
 * gorseli boyle olmali; zemini isletim sistemi boyuyor). */
function gorselUret({ dosya, boyut, yaricap, kalinlik, zeminRenk, cizgiRenk, merkez = true }) {
  const orta = boyut / 2;
  const pikseller = Buffer.alloc(boyut * boyut * 4);

  const icinde = (px, py) => {
    const u = yildizUzakligi(px - orta, py - orta);
    if (u <= yaricap && u >= yaricap - kalinlik) return true;
    /* Ortadaki kucuk elmas: pusula ignesinin ucu. */
    if (merkez && u <= yaricap * 0.17) return true;
    return false;
  };

  for (let y = 0; y < boyut; y++) {
    for (let x = 0; x < boyut; x++) {
      const hedef = (y * boyut + x) * 4;
      const oran = kapsama(x, y, icinde);

      if (zeminRenk) {
        pikseller[hedef] = Math.round(zeminRenk[0] + (cizgiRenk[0] - zeminRenk[0]) * oran);
        pikseller[hedef + 1] = Math.round(zeminRenk[1] + (cizgiRenk[1] - zeminRenk[1]) * oran);
        pikseller[hedef + 2] = Math.round(zeminRenk[2] + (cizgiRenk[2] - zeminRenk[2]) * oran);
        pikseller[hedef + 3] = 255;
      } else {
        pikseller[hedef] = cizgiRenk[0];
        pikseller[hedef + 1] = cizgiRenk[1];
        pikseller[hedef + 2] = cizgiRenk[2];
        pikseller[hedef + 3] = Math.round(oran * 255);
      }
    }
  }

  const boy = pngYaz(path.join(CIKTI_KLASOR, dosya), boyut, boyut, pikseller);
  console.log("  " + dosya + "  " + boyut + "x" + boyut + "  " + Math.round(boy / 1024) + " KB");
}


/* Play Console'un istedigi 1024x500 one cikan gorsel (feature graphic).
 *
 * Uzerinde yazi yok: yazi cizebilmek icin bir yazi tipi motoru gerekiyor ve
 * bunun icin kutuphane eklemek bu betigin butun anlamini bozardi. Play yazisiz
 * gorseli kabul ediyor. Uygulama adini eklemek istersen bu PNG'yi herhangi bir
 * gorsel duzenleyicide acip yazabilirsin — sol taraf bilerek bos birakildi. */
function oneCikanGorsel() {
  const genislik = 1024;
  const yukseklik = 500;
  const pikseller = Buffer.alloc(genislik * yukseklik * 4);

  /* Buyuk yildiz sagda, kucuk yildizlar arka planda seyrek bir doku. */
  const buyukX = 780;
  const buyukY = 250;

  const icinde = (px, py) => {
    const buyuk = yildizUzakligi(px - buyukX, py - buyukY);
    if (buyuk <= 170 && buyuk >= 170 - 16) return true;
    if (buyuk <= 170 * 0.17) return true;
    return false;
  };

  const dokuda = (px, py) => {
    /* 128 piksellik izgaraya oturan kucuk yildiz konturlari. */
    const ax = ((px % 128) + 128) % 128 - 64;
    const ay = ((py % 128) + 128) % 128 - 64;
    const u = yildizUzakligi(ax, ay);
    return u <= 26 && u >= 23;
  };

  for (let y = 0; y < yukseklik; y++) {
    for (let x = 0; x < genislik; x++) {
      const hedef = (y * genislik + x) * 4;

      /* Soldan saga hafif koyulasan zemin. */
      const egim = x / genislik;
      const zemin = [
        Math.round(ZEMIN[0] + egim * 6),
        Math.round(ZEMIN[1] + egim * 8),
        Math.round(ZEMIN[2] + egim * 10)
      ];

      let r = zemin[0];
      let g = zemin[1];
      let b = zemin[2];

      const dokuOran = kapsama(x, y, dokuda) * 0.16;
      if (dokuOran > 0) {
        r = Math.round(r + (ALTIN[0] - r) * dokuOran);
        g = Math.round(g + (ALTIN[1] - g) * dokuOran);
        b = Math.round(b + (ALTIN[2] - b) * dokuOran);
      }

      const yildizOran = kapsama(x, y, icinde);
      if (yildizOran > 0) {
        r = Math.round(r + (ALTIN[0] - r) * yildizOran);
        g = Math.round(g + (ALTIN[1] - g) * yildizOran);
        b = Math.round(b + (ALTIN[2] - b) * yildizOran);
      }

      pikseller[hedef] = r;
      pikseller[hedef + 1] = g;
      pikseller[hedef + 2] = b;
      pikseller[hedef + 3] = 255;
    }
  }

  const boy = pngYaz(
    path.join(CIKTI_KLASOR, "one-cikan-gorsel-1024x500.png"),
    genislik,
    yukseklik,
    pikseller
  );
  console.log("  one-cikan-gorsel-1024x500.png  1024x500  " + Math.round(boy / 1024) + " KB");
}

function calis() {
  fs.mkdirSync(CIKTI_KLASOR, { recursive: true });
  console.log("gorseller uretiliyor:");

  /* Magaza ve uygulama simgesi: zemin dolu, kose yuvarlatmasini Play kendi
   * yapiyor. */
  gorselUret({
    dosya: "icon.png",
    boyut: 1024,
    yaricap: 330,
    kalinlik: 30,
    zeminRenk: ZEMIN,
    cizgiRenk: ALTIN
  });

  /* Uyarlanabilir simgenin on plani: Android simgenin dis %33'unu kirpabiliyor,
   * bu yuzden sekil daha kucuk. */
  gorselUret({
    dosya: "adaptive-icon.png",
    boyut: 1024,
    yaricap: 250,
    kalinlik: 26,
    zeminRenk: null,
    cizgiRenk: ALTIN
  });

  gorselUret({
    dosya: "splash-icon.png",
    boyut: 1024,
    yaricap: 300,
    kalinlik: 22,
    zeminRenk: null,
    cizgiRenk: ALTIN
  });

  /* Android bildirim simgesi: sistem bunu siluet olarak kullaniyor, renk
   * bilgisini atip yalnizca saydamliga bakiyor. Bu yuzden beyaz ciziliyor. */
  gorselUret({
    dosya: "bildirim-ikonu.png",
    boyut: 96,
    yaricap: 34,
    kalinlik: 5,
    zeminRenk: null,
    cizgiRenk: [255, 255, 255]
  });

  /* Play Console'un istedigi 512x512 magaza simgesi (ayri dosya olarak
   * yukleniyor, uygulamanin icine girmiyor). */
  gorselUret({
    dosya: "magaza-simgesi-512.png",
    boyut: 512,
    yaricap: 165,
    kalinlik: 15,
    zeminRenk: ZEMIN,
    cizgiRenk: ALTIN
  });

  oneCikanGorsel();
}

calis();
