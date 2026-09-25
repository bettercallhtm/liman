# Liman

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

## İnternet izni

Uygulama internete hiç bağlanmıyor, ama bu tek başına izin istemediği
anlamına gelmiyordu: Expo'nun Android şablonu ve kütüphaneler manifeste
varsayılan olarak `INTERNET`, depolama (`READ`/`WRITE_EXTERNAL_STORAGE`) ve
"diğer uygulamaların üzerinde göster" (`SYSTEM_ALERT_WINDOW`) izinlerini
ekliyor. `app.json` içindeki `"permissions": []` bunları **kaldırmıyor**,
yalnızca yeni izin eklemiyor. 1.0.0 (versionCode 3) bu izinlerle derlendi;
mağaza metni ve gizlilik politikası "internet izni istemez" derken yanlıştı.

1.1.1'den beri bu dört izin `android.blockedPermissions` ile manifestten
siliniyor. Kontrol etmek için:

```bash
npx expo config --type introspect
```

çıktısında bu izinlerin yanında `"tools:node": "remove"` görünmeli.

**Geliştirme derlemesi (development client) yapacaksan** `INTERNET`'i
listeden geçici olarak çıkar: dev client JS paketini Metro'dan ağ üzerinden
çekiyor, izin yoksa açılmıyor. Expo Go ve `npm run web` bundan etkilenmiyor.

## Cihazda test edilmesi gerekenler

Ekranların çoğu `npm run web` ile doğrulanabiliyor ama **üç yol tarayıcıda
denenemiyor ve gerçek telefonda denenmeden bitmiş sayılmaz:**

- **İnternet izni olmadan açılış** (1.1.1'den beri). Uygulama açılıyor,
  yazı tipleri ve simgeler geliyor, kart açılıyor mu — hepsi pakete gömülü
  olduğu için gelmeli, ama ilk kez izinsiz derlenen sürüm bu.

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
  tema.js         renkler, ölçüler, yazı tiplerinin (Lora + Amiri Quran) yüklenmesi
  yazitipi.js     Arapça yazı tipi notları, ayet sonu rakamları
  ekranlar/       Karsilama, Hal, Yaz, Kart, Destek, Favoriler, Ayarlar
  parcalar/       AyetBloku, Dugme, Ikon, Desen, PaylasimKarti
    Desen.js      lacivert degrade + sekiz köşeli yıldız örgüsü (SVG)
    Ikon.js       bütün simgeler Ionicons'tan, tek kapıdan
public/index.html web sayfasının şablonu (dil, açıklama, tema rengi)
  veri/sozluk.js    hâl başına kelime kökleri + risk listesi (elle yazılır)
  veri/icerik.json  ÜRETİLEN DOSYA — elle düzenleme
```

## İçerik ölçüleri

41 hâl · 490 ayet · 405 ayet/dua grubu · 123 “kendi sözlerinle” duası ·
246 not.

Hâller üç grupta: **zor** (22), **iyi** (12) ve **kalp** (7 — iman, ibadet,
nefis, kıskançlık, anlam, tefekkür, pişmanlık). Ana ekranda bir anda tek grup
görünüyor.

Her hâlde en az 10 ayet grubu, 7 dua, 3 “kendi sözlerinle” ve 6 not var.
Eylül 2026 genişlemesinde eklenen her ayetin meali tek tek okunup hâline
uyduğu kontrol edildi; uymayanlar (ör. mealine şerh eklenmiş 12:101, çok
uzun 10:22 ve 22:5) listeye alınmadı.

İlk sürümdeki ölçü en az 5 ayet grubu, 3 dua ve 6 nottu. Bunlar keyfi sayılar değil:
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

### EAS projesi

**Kuruldu** (4 Eylül 2026): proje `@getdebi/liman`,
https://expo.dev/accounts/getdebi/projects/liman. `eas init`, `app.json`
içine `owner` ve `extra.eas.projectId` alanlarını kendisi yazdı; ikisine de
elle dokunmayın.

Proje **kişisel `getdebi` hesabında**, Debi'nin bulunduğu `getdebi-app`
kuruluşunda değil. Aynı Expo girişinin altında iki ayrı hesap var; Liman'ın
Debi ile bir ilgisi yok, o yüzden ayrı duruyor.

```bash
eas build -p android --profile production   # .aab üretir
```

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

https://github.com/bettercallhtm/liman (public)

Gizlilik politikası GitHub Pages ile yayında:
https://bettercallhtm.github.io/liman/gizlilik.html
