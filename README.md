# İnşirah

Yaşadığını yaz ya da hâlini seç; sana uyan ayeti ve Kur'an'dan bir duayı
getirsin. Android/iOS, Expo (React Native). Tamamen çevrimdışı: sunucu yok,
hesap yok, internet izni yok.

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

## Yazılan metin neden buluta gitmiyor

Uygulamanın ikinci girişi bir metin kutusu: kişi başından geçeni yazıyor,
uygulama ona uyan hâli buluyor. Bunu bir dil modeline bağlamak daha iyi
eşleştirirdi — ama insanların en özel cümlelerini başka bir yere göndermek
gerekirdi. Bu uygulamada bu bir özellik değil, kırmızı çizgi: **yazılan metin
telefondan çıkmıyor, kaydedilmiyor da.**

Onun yerine `src/veri/sozluk.js` içinde hâl başına kelime kökleri var,
`src/coz.js` metni sadeleştirip (Türkçe harfler ASCII'ye — çoğu kişi
"uzgunum" diye yazıyor) kök eşleşmelerini puanlıyor. Kaba bir yöntem, ama
doğru yerde kaba: eşleşme bulamayınca uydurmuyor, "çıkaramadım, sen seç"
diyor. Kart da hangi kelimelerin o hâle işaret ettiğini gösteriyor, yanlış
bulduğunda kullanıcı düzeltebiliyor.

Ağırlıklar önemli: "annem vefat etti çok üzgünüm" cümlesinde hem yas hem
üzüntü eşleşiyor, ölüm kelimeleri 5 puan aldığı için yas kazanıyor. Sözlüğü
genişletirken `node` ile birkaç gerçek cümle deneyip sıralamaya bak.

### Kendine zarar işaretleri

`sozluk.js` içindeki `RISK` listesi yakalandığında uygulama ayet yerine
önce `src/ekranlar/Destek.js` ekranını açıyor: 112 ve 183, suçlamayan bir
metin, ve isterse devam etme seçeneği. Bu listeyi daraltma — yanlış alarm
vermek, kaçıran bir sistemden iyidir.

## Cihazda test edilmesi gerekenler

Ekranların çoğu `npm run web` ile doğrulanabiliyor ama **iki yol tarayıcıda
çalışmıyor ve gerçek telefonda denenmeden bitmiş sayılmaz:**

- **Görsel paylaşma** (`react-native-view-shot` + `expo-sharing`). Web'de
  `captureRef` yok, o yüzden `Kart.js` metin paylaşımına düşüyor. Telefonda
  "Paylaş" düğmesinin gerçekten 1080×1350 bir PNG üretip paylaşım ekranını
  açtığını gör.
- **Günlük hatırlatıcı** (`expo-notifications`). Bildirimin seçilen saatte
  geldiğini ancak cihazda görebilirsin.

## Klasörler

```
assets/yazitipi/  Amiri Quran (SIL OFL 1.1) — OFL.txt yanında durmalı
araclar/          derleme öncesi çalışan betikler (uygulamaya girmez)
  secim.js        hangi ayet hangi hâle — içeriğin omurgası
  ayet-cek.js     metinleri kaynaktan çeker, icerik.json üretir
  gorsel-uret.js  simge ve açılış görsellerini kodla üretir
  sure-adlari.js  114 sûrenin Türkçe adı
src/
  icerik.js       kart üretimi, günün ayeti, paylaşım metni
  coz.js          yazılan metni hâle bağlar (cihazda, çevrimdışı)
  depo.js         telefonda saklanan her şey (favoriler, günlük, ayarlar)
  hatirlatici.js  günlük bildirim
  tema.js         renkler
  yazitipi.js     Arapça yazı tipi (Amiri Quran) yükleyici
  ekranlar/       Karsilama, Hal, Yaz, Kart, Destek, Favoriler, Ayarlar
  parcalar/       AyetBloku, Dugme, PaylasimKarti
  veri/sozluk.js    hâl başına kelime kökleri + risk listesi (elle yazılır)
  veri/icerik.json  ÜRETİLEN DOSYA — elle düzenleme
```

## İçerik ölçüleri

27 hâl · 156 ayet · 152 ayet grubu · 162 not · 456 kart bileşimi.

Her hâlde en az 5 ayet grubu, 3 dua ve 6 not var. Bunlar keyfi sayılar değil:
"Başka bir ayet"e arka arkaya basan biri başa dönmeden en az beş kart
görmeli, yoksa uygulama sığ hissettiriyor. Ayet/dua/not sayıları da bilerek
aynı değil — 5, 3 ve 6 birlikte döndüğünde aynı üçlü çok daha geç tekrarlıyor.

Bir hâle ayet eklerken bu ölçüyü koru.

## Komutlar

```bash
npm install
npm start                 # Expo Go ile telefonda
npm run web               # ekranları bilgisayarda görmek için
npm run ayetleri-cek      # icerik.json'u yeniden üret
npm run gorselleri-uret   # simgeleri yeniden üret
npm run coz-dene          # sözlük testleri (yazma özelliği)
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

- **Yapay zekâ ile dua üretme.** Model ne ayet ne dua metni üretiyor.
  Uydurma ya da yanlış aktarılmış bir ayet bu uygulamayı bitirir.
- **Yazılan metni sunucuya gönderme.** Bkz. yukarısı. Bu, uygulamanın
  vaadinin bir parçası; "daha iyi eşleştirme" gerekçesiyle bile bozulmaz.
- **Hesap, bulut, senkronizasyon.** Kayıtlar telefonda. Sunucu yok demek,
  sızdıracak veri yok demek.
- **Namaz vakti, kıble, Kur'an okuma.** Bunları yapan çok iyi uygulamalar
  var. Bu uygulama tek bir şey yapıyor.
- **Seri/streak sayacı.** Kaygılı olduğu için açılan bir uygulamanın
  kullanıcıyı "serini kaybettin" diye suçlaması olacak şey değil.

## Depo

https://github.com/bettercallhtm/insirah (public)

Gizlilik politikası GitHub Pages ile yayında:
https://bettercallhtm.github.io/insirah/gizlilik.html
