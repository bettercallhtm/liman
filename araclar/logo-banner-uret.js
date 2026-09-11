/* YATAY LOGO — Halim ekranindaki kelime markasi.
 *
 *     node araclar/logo-banner-uret.js
 *
 * Uygulama simgesi (assets/icon.png) lacivert zeminli kare; "L" krem,
 * "iman" altin. Halim ekraninda hem acik hem koyu temada iyi durmasi icin
 * logonun arka plani olmamali ve butun harfler tek renk olmali.
 *
 * Bu betik simgeden yaziyi SAYDAM ZEMINLI bir maske olarak cikariyor:
 * her pikselin lacivert zeminden uzakligina gore saydamlik (alpha) veriliyor,
 * renk bilgisi atilip beyaza sabitleniyor. Uygulama bu maskeyi `tintColor`
 * ile tek renge (temanin altin vurgusu) boyuyor — boylece "L" de "iman" da
 * ayni renk oluyor, kenarlar temiz kaliyor ve zemin gorunmuyor. */
const Jimp = require("jimp-compact");
const path = require("path");

const KAYNAK = path.join(__dirname, "..", "assets", "icon.png");
const CIKTI = path.join(__dirname, "..", "assets", "logo-banner.png");

/* Yazinin dort bir yaninda esit saydam pay (kaynak pikselinde). */
const PAY = 24;
/* Alpha esikleri: bu uzakligin altindaki pikseller tamamen saydam,
 * ustundekiler tamamen opak; arasi yumusatilir. */
const ALT = 55;
const UST = 300;

(async () => {
  const img = await Jimp.read(KAYNAK);
  const W = img.bitmap.width;
  const H = img.bitmap.height;
  const bg = Jimp.intToRGBA(img.getPixelColor(4, 4));

  let minX = W, minY = H, maxX = 0, maxY = 0;
  const alpha = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = Jimp.intToRGBA(img.getPixelColor(x, y));
      const d =
        Math.abs(c.r - bg.r) + Math.abs(c.g - bg.g) + Math.abs(c.b - bg.b);
      let a = Math.round(((d - ALT) / (UST - ALT)) * 255);
      if (a < 0) a = 0;
      if (a > 255) a = 255;
      alpha[y * W + x] = a;
      if (a > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  /* Beyaz + hesaplanan alpha (tintColor rengi bastiracak). */
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      img.setPixelColor(
        Jimp.rgbaToInt(255, 255, 255, alpha[y * W + x]),
        x,
        y
      );
    }
  }

  const kirpX = Math.max(0, minX - PAY);
  const kirpY = Math.max(0, minY - PAY);
  const kirpGen = Math.min(W - kirpX, maxX - minX + PAY * 2);
  const kirpYuk = Math.min(H - kirpY, maxY - minY + PAY * 2);

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
