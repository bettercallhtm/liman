# Dua Pusulası

Ruh hâline göre ayet ve dua gösteren Android/iOS uygulaması. Expo (React
Native). Tamamen çevrimdışı: sunucu yok, hesap yok, internet izni yok.

## En önemli kural

**Kutsal metin bu depoda elle yazılmaz.**

`araclar/secim.js` yalnızca *hangi* ayetin hangi hâle denk geldiğini söyler
(sûre:âyet referansı). Ayetin Arapçası, okunuşu ve meali `araclar/ayet-cek.js`
ile doğrudan kaynağından çekilip `src/veri/icerik.json` dosyasına yazılır.

Bir ayet eklemek ya da değiştirmek istersen:

```bash
node araclar/ayet-cek.js
```

Referansı `secim.js` içinde değiştir, bu komutu çalıştır, bitti. Metni elle
düzenleme; yanlış hatırlanmış tek kelime bu uygulamanın en ciddi hatası olur.
Betik referansın tuttuğunu ayrıca doğruluyor: istenen sûre:âyet ile gelen
sûre:âyet aynı değilse hata verip duruyor.

### Ayet seçim kuralı

Ana konusu hukuk, savaş ya da aile hükmü olan âyetler, içinde geçen bir cümle
o hâle birebir uysa bile listeye alınmıyor. Kart olarak gösterilince
bağlamından kopuyorlar. Bu yüzden elenmiş olanlar: 2:216 (savaş girişi),
65:2 (boşanma), 2:222 (hayız), 4:75 (savaşa çağrı), 65:7 (nafaka).

Uygulamadaki **bütün dualar Kur'an'ın kendi dualarıdır.** Hadis kaynaklı dua
yok: metnini ve senedini bu depodan doğrulayamayacağımız hiçbir şey
uygulamaya girmiyor.

### Meal telifi

Varsayılan meal **Elmalılı Hamdi Yazır** (vefat 1942) — Türkiye'de telif
süresi dolmuş olan meal. Diyanet İşleri ve Diyanet Vakfı mealleri daha yaygın
okunuyor ama **telifli**; kullanmak için yazılı izin gerekir. Değiştirmek
istersen `secim.js` içindeki `CEVIRI` sabiti yeterli, gerisi otomatik.

Metinlerin derleme kaynağı alquran.cloud (Tanzil.net derlemesi). Tanzil'in
kendi kullanım şartları var; ücretli bir sürüm ya da reklam düşünüyorsan önce
o şartları oku.

## Klasörler

```
araclar/          derleme öncesi çalışan betikler (uygulamaya girmez)
  secim.js        hangi ayet hangi hâle — içeriğin omurgası
  ayet-cek.js     metinleri kaynaktan çeker, icerik.json üretir
  gorsel-uret.js  simge ve açılış görsellerini kodla üretir
  sure-adlari.js  114 sûrenin Türkçe adı
src/
  icerik.js       kart üretimi, günün ayeti, paylaşım metni
  depo.js         telefonda saklanan her şey (favoriler, günlük, ayarlar)
  hatirlatici.js  günlük bildirim
  tema.js         renkler
  ekranlar/       Hal, Kart, Favoriler, Ayarlar
  parcalar/       AyetBloku, Dugme
  veri/icerik.json  ÜRETİLEN DOSYA — elle düzenleme
```

## Komutlar

```bash
npm install
npm start                 # Expo Go ile telefonda
npm run web               # ekranları bilgisayarda görmek için
npm run ayetleri-cek      # icerik.json'u yeniden üret
npm run gorselleri-uret   # simgeleri yeniden üret
npm run derleme-kontrol   # Android paketi derleniyor mu
```

Bildirimler Expo Go'da çalışmayabilir; gerçek davranış için EAS ile derlenmiş
sürüm gerekiyor. `hatirlatici.js` bu durumu yakalıyor — bildirim kurulamazsa
Ayarlar'daki anahtar kendiliğinden kapalı kalıyor, uygulama çökmüyor.

## Yayın

Play Console'a girecek bütün metinler ve formlar `MAGAZA.md` içinde.
Gizlilik politikası sayfası `gizlilik.html` — Play zorunlu tutuyor, bir yerde
yayında olması gerekiyor.

## Bilinçli olarak yapılmayanlar

- **Yapay zekâ ile dua üretme.** Uygulamanın ismi bunu çağrıştırsa da model
  ne ayet ne dua metni üretiyor. Uydurma ya da yanlış aktarılmış bir ayet bu
  uygulamayı bitirir.
- **Hesap, bulut, senkronizasyon.** Kayıtlar telefonda. Sunucu yok demek,
  sızdıracak veri yok demek.
- **Namaz vakti, kıble, Kur'an okuma.** Bunları yapan çok iyi uygulamalar
  var. Bu uygulama tek bir şey yapıyor.
- **Seri/streak sayacı.** Kaygılı olduğu için açılan bir uygulamanın
  kullanıcıyı "serini kaybettin" diye suçlaması olacak şey değil.

## Depo

https://github.com/bettercallhtm/dua-pusulasi (public)

Gizlilik politikası GitHub Pages ile yayında:
https://bettercallhtm.github.io/dua-pusulasi/gizlilik.html
