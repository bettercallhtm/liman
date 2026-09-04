# Mağaza görselleri

Play Console'a yüklenecek ekran görüntüleri buraya. `assets/` altındakiler
uygulamanın kendi içine giren simgeler; burası yalnızca mağaza sayfası için.

## Ne gerekiyor

Play telefon için **en az 2, en fazla 8** ekran görüntüsü istiyor. Ölçü:
1080×1920 (dikey, 9:16). Uygulamayı gerçek telefonda ya da emülatörde açıp
şu beş kareyi çekin ve bu adlarla kaydedin:

| Dosya | Ekran | Ne görünsün |
|---|---|---|
| `01-ana-ekran.png` | Ana ekran | "Bugün nasılsın?" ve hâl ızgarası |
| `02-kart.png` | Bir kart | "Kaygılıyım" kartı — ayet, dua ve not birlikte |
| `03-yazma.png` | Yazma ekranı | İçine bir cümle yazılmış, gizlilik satırı görünür |
| `04-kayitlar.png` | Kayıtlar | Birkaç kart kaydedilmiş hâlde |
| `05-ayarlar.png` | Ayarlar | Hatırlatıcı ve kaynak bölümü |

Üçüncü kare önemli: uygulamanın "yazdıkların telefonundan çıkmaz" sözünü
mağaza sayfasında doğrudan gösteren tek kare o.

Ekran görüntüsünün üstüne açıklama yazısı eklemek şart değil; Play yazısız
kareleri de kabul ediyor.

## Öne çıkan görsel ve simge burada değil

Bu ikisi `assets/` altında ve `npm run gorselleri-uret` ile üretiliyor:

- `assets/one-cikan-gorsel-1024x500.png` — Play → Öne çıkan görsel
- `assets/magaza-simgesi-512.png` — Play → Uygulama simgesi

İkisi de `araclar/logo.png` dosyasından türetiliyor. Logo değişirse o dosyayı
değiştirip betiği tekrar çalıştırın; elle kırpmayın.
