/* Gunluk hatirlatici bildirimi.
 *
 * Bildirim yerelde kuruluyor: sunucu, push anahtari, cihaz kimligi yok.
 * Telefon kapaliyken bile Android'in kendi zamanlayicisi tetikliyor.
 *
 * Her cagri try/catch icinde. Bildirim modulu bulunmayan bir ortamda
 * (Expo Go'nun bazi surumleri, web) uygulama calismaya devam etmeli — en
 * fazla hatirlatici kurulamaz, ekranlar acilmamazlik etmez. */
import { Platform } from "react-native";

let Bildirim = null;
try {
  Bildirim = require("expo-notifications");
} catch (hata) {
  Bildirim = null;
}

const KANAL = "gunluk-hatirlatici";

/* Bildirim metinleri. Suclayan ya da korkutan bir dil yok: uygulamayi
 * acmadigi icin kotu hissettiren bildirim, bu uygulamanin isini bozar. */
const METINLER = [
  { baslik: "Bir dakikan var mı?", govde: "Bugün nasıl olduğunu seç, sana bir ayet gelsin." },
  { baslik: "Günün ayeti hazır", govde: "Kısa bir mola. Bir ayet, bir dua." },
  { baslik: "Nasılsın?", govde: "İyi de olsa kötü de olsa, buraya yazacak bir yer var." }
];

export function hazirMi() {
  return Bildirim !== null;
}

if (Bildirim) {
  Bildirim.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });
}

async function kanaliKur() {
  if (!Bildirim || Platform.OS !== "android") return;
  await Bildirim.setNotificationChannelAsync(KANAL, {
    name: "Günlük hatırlatıcı",
    importance: Bildirim.AndroidImportance.DEFAULT,
    sound: null,
    vibrationPattern: [0, 200],
    lightColor: "#C9A961"
  });
}

/* Izin ister. Kullanici reddederse false doner — cagiran taraf ayari geri
 * kapatir, sessizce "acik" gorunup calismayan bir dugme birakmaz. */
export async function izinIste() {
  if (!Bildirim) return false;
  try {
    const mevcut = await Bildirim.getPermissionsAsync();
    if (mevcut.granted) return true;
    if (!mevcut.canAskAgain) return false;
    const sonuc = await Bildirim.requestPermissionsAsync();
    return sonuc.granted === true;
  } catch (hata) {
    return false;
  }
}

export async function hatirlaticiyiKapat() {
  if (!Bildirim) return;
  try {
    await Bildirim.cancelAllScheduledNotificationsAsync();
  } catch (hata) {
    /* zaten kurulu degilse sorun yok */
  }
}

export async function hatirlaticiyiKur(saat, dakika) {
  if (!Bildirim) return false;
  try {
    await kanaliKur();
    await hatirlaticiyiKapat();
    const metin = METINLER[Math.floor(Math.random() * METINLER.length)];
    await Bildirim.scheduleNotificationAsync({
      content: {
        title: metin.baslik,
        body: metin.govde,
        sound: null
      },
      trigger: {
        type: Bildirim.SchedulableTriggerInputTypes.DAILY,
        hour: saat,
        minute: dakika,
        channelId: KANAL
      }
    });
    return true;
  } catch (hata) {
    return false;
  }
}
