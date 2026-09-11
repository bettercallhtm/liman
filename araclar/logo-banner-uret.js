/* YATAY LOGO — Halim ekranindaki kelime markasi banner'i.
 *
 *     node araclar/logo-banner-uret.js
 *
 * Uygulama simgesi (assets/icon.png) kare; ortasindaki "Liman" kelime
 * markasinin etrafinda genis lacivert bosluk var. Halim ekraninda yatay,
 * genis bir logo daha iyi oturuyor. Bu betik kare simgeden yazi bandini
 * kirpip assets/logo-banner.png olarak yaziyor.
 *
 * Yazinin sinirlari lacivert olmayan (krem/altin) piksellerden bulunuyor,
 * etrafina nefes payi birakiliyor. Logo degisirse icon.png'yi guncelleyip
 * bu betigi tekrar calistirmak yeterli. */
const Jimp = require("jimp-compact");
const path = require("path");

const KAYNAK = path.join(__dirname, "..", "assets", "icon.png");
const CIKTI = path.join(__dirname, "..", "assets", "logo-banner.png");

/* Yatay/dikey nefes payi (kaynak pikselinde). */
const PAY_X = 40;
const HEDEF_ORAN = 1.7; // uzun kenar yatay

(async () => {
  const img = await Jimp.read(KAYNAK);
  const W = img.bitmap.width;
  const H = img.bitmap.height;
  const bg = Jimp.intToRGBA(img.getPixelColor(4, 4));

  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = Jimp.intToRGBA(img.getPixelColor(x, y));
      const d =
        Math.abs(c.r - bg.r) + Math.abs(c.g - bg.g) + Math.abs(c.b - bg.b);
      if (d > 90) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const yaziGen = maxX - minX;
  const merkezY = (minY + maxY) / 2;

  let kirpX = Math.max(0, minX - PAY_X);
  let kirpGen = Math.min(W - kirpX, yaziGen + PAY_X * 2);
  let kirpYuk = Math.round(kirpGen / HEDEF_ORAN);
  let kirpY = Math.round(merkezY - kirpYuk / 2);
  if (kirpY < 0) kirpY = 0;
  if (kirpY + kirpYuk > H) kirpY = H - kirpYuk;

  img.crop(kirpX, kirpY, kirpGen, kirpYuk);
  await img.writeAsync(CIKTI);
  console.log(
    "Yazildi:",
    CIKTI,
    img.bitmap.width + "x" + img.bitmap.height,
    "oran",
    (img.bitmap.width / img.bitmap.height).toFixed(3)
  );
})();
