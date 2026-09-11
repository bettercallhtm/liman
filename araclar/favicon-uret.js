/* FAVICON — tarayici sekmesi simgesi.
 *
 *     node araclar/favicon-uret.js
 *
 * Uygulama simgesi (assets/icon.png) tam kelime markasidir; 16-32 pikselde
 * "Liman" yazisi okunmaz. Sekme icin ayri, sade bir monogram gerekiyor:
 * lacivert kare uzerinde krem serif "L" ve logodaki altin yildiz.
 *
 * Disaridan kutuphane yok — gorsel elle piksel piksel ciziliyor, PNG Node'un
 * kendi zlib'iyle yaziliyor (gorsel-uret.js ile ayni yaklasim). Kenarlar
 * 3x3 ust ornekleme ile yumusatiliyor. */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const BOYUT = 512;
const CIKTI = path.join(__dirname, "..", "assets", "favicon.png");

/* Renkler — logoyla ayni aile. */
const LACIVERT = [11, 44, 77];
const KREM = [244, 236, 216];
const ALTIN = [230, 169, 43];

/* ---- Sekiller ---- */

/* Kose yuvarlatilmis kare (SDF). */
function kareIcinde(px, py) {
  const yariR = 104;
  const yari = BOYUT / 2;
  const qx = Math.abs(px - yari) - (yari - yariR);
  const qy = Math.abs(py - yari) - (yari - yariR);
  const dx = Math.max(qx, 0);
  const dy = Math.max(qy, 0);
  const d = Math.sqrt(dx * dx + dy * dy) + Math.min(Math.max(qx, qy), 0) - yariR;
  return d <= 0;
}

/* "L" — govde, ust serif, ayak ve ayagin sag ucundaki kucuk serif. */
const DIKDORTGENLER = [
  [198, 140, 254, 372], // dikey govde
  [180, 140, 272, 160], // ust serif (govdenin tepesi)
  [198, 316, 352, 372], // ayak
  [334, 296, 352, 316] // ayak ucu serifi
];
function lIcinde(px, py) {
  for (const [x0, y0, x1, y1] of DIKDORTGENLER) {
    if (px >= x0 && px <= x1 && py >= y0 && py <= y1) return true;
  }
  return false;
}

/* Dort kollu yildiz (logodaki i uzerindeki isaret). */
const YILDIZ_MERKEZ = [356, 150];
const YILDIZ = (() => {
  const R = 58;
  const r = 17;
  const i = r * 0.7071;
  const [cx, cy] = YILDIZ_MERKEZ;
  return [
    [cx, cy - R],
    [cx + i, cy - i],
    [cx + R, cy],
    [cx + i, cy + i],
    [cx, cy + R],
    [cx - i, cy + i],
    [cx - R, cy],
    [cx - i, cy - i]
  ];
})();
function yildizIcinde(px, py) {
  let icinde = false;
  for (let i = 0, j = YILDIZ.length - 1; i < YILDIZ.length; j = i++) {
    const [xi, yi] = YILDIZ[i];
    const [xj, yj] = YILDIZ[j];
    const kesisir =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (kesisir) icinde = !icinde;
  }
  return icinde;
}

/* Bir alt-noktanin rengi: once yildiz, sonra L, sonra zemin, sonra saydam. */
function nokta(px, py) {
  if (kareIcinde(px, py)) {
    if (yildizIcinde(px, py)) return [ALTIN[0], ALTIN[1], ALTIN[2], 255];
    if (lIcinde(px, py)) return [KREM[0], KREM[1], KREM[2], 255];
    return [LACIVERT[0], LACIVERT[1], LACIVERT[2], 255];
  }
  return [0, 0, 0, 0];
}

/* ---- Piksel tamponu (3x3 ust ornekleme) ---- */

const veri = Buffer.alloc(BOYUT * BOYUT * 4);
const ALT = 3;
for (let y = 0; y < BOYUT; y++) {
  for (let x = 0; x < BOYUT; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < ALT; sy++) {
      for (let sx = 0; sx < ALT; sx++) {
        const px = x + (sx + 0.5) / ALT;
        const py = y + (sy + 0.5) / ALT;
        const [nr, ng, nb, na] = nokta(px, py);
        const k = na / 255;
        r += nr * k;
        g += ng * k;
        b += nb * k;
        a += na;
      }
    }
    const n = ALT * ALT;
    const alfa = a / n;
    const i = (y * BOYUT + x) * 4;
    /* Premultiply cozulmus ortalama: renk katsayisini alfaya bol. */
    const kat = alfa > 0 ? n / (a / 255) : 0;
    veri[i] = Math.round((r / n) * kat) || 0;
    veri[i + 1] = Math.round((g / n) * kat) || 0;
    veri[i + 2] = Math.round((b / n) * kat) || 0;
    veri[i + 3] = Math.round(alfa);
  }
}

/* ---- PNG yazimi ---- */

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function parca(tip, govde) {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(govde.length, 0);
  const tipBuf = Buffer.from(tip, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([tipBuf, govde])), 0);
  return Buffer.concat([uzunluk, tipBuf, govde, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(BOYUT, 0);
ihdr.writeUInt32BE(BOYUT, 4);
ihdr[8] = 8; // bit derinligi
ihdr[9] = 6; // RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

/* Her satirin basina filtre baytini (0) koy. */
const ham = Buffer.alloc(BOYUT * (BOYUT * 4 + 1));
for (let y = 0; y < BOYUT; y++) {
  ham[y * (BOYUT * 4 + 1)] = 0;
  veri.copy(ham, y * (BOYUT * 4 + 1) + 1, y * BOYUT * 4, (y + 1) * BOYUT * 4);
}
const idat = zlib.deflateSync(ham, { level: 9 });

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  parca("IHDR", ihdr),
  parca("IDAT", idat),
  parca("IEND", Buffer.alloc(0))
]);

fs.writeFileSync(CIKTI, png);
console.log("Yazildi:", CIKTI, "(" + png.length + " bayt)");
