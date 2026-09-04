/* Ilk acilista gosterilen uc ekran. Bir kere gorulur, sonra bir daha cikmaz.
 *
 * Uc sey soyluyor ve ucu de bilerek secildi:
 *   1. Ne yaptigi — insanin ilk otuz saniyede anlamasi gereken tek sey.
 *   2. Yazdiginin telefondan cikmadigi — uygulamanin en ayirt edici sozu.
 *      Insanin en ozel cumlesini yazacagi bir kutuyu, bunu bilmeden acmasi
 *      dogru degil.
 *   3. Ayetleri uygulamanin yazmadigi — ve fetva/tedavi olmadigi.
 *
 * Bir "atla" dugmesi yok; uc ekran da kisa ve hepsi bir kez okunmali. Ama
 * kimse zorla bildirim acmiyor: son ekranda hatirlatici teklifi var, "simdilik
 * gec" ayni buyuklukte duruyor. */
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Dugme from "../parcalar/Dugme";
import { OLCU, useTema } from "../tema";

const EKRANLAR = [
  {
    baslik: "Nasıl hissediyorsan,\nona bir ayet.",
    govde:
      "Hâlini seç ya da başından geçeni kendi cümlelerinle yaz. Sana o hâle dokunan bir ayet ve Kur'an'ın kendi dualarından biri gelsin.",
    alt: null
  },
  {
    baslik: "Yazdıkların\ntelefonundan çıkmaz.",
    govde:
      "Yazdığın metin hiçbir sunucuya gönderilmiyor, kaydedilmiyor da — ekrandan çıkınca siliniyor. Hangi ayete denk düştüğü telefonunun içinde hesaplanıyor.",
    alt:
      "İnşirah hesap açtırmaz, internete bağlanmaz, hiçbir veri toplamaz. Kaydettiklerin yalnızca bu telefonda durur."
  },
  {
    baslik: "Ayetleri\nbiz yazmadık.",
    govde:
      "Uygulamadaki hiçbir ayet ya da dua metni burada üretilmedi; hepsi kaynağından olduğu gibi alındı. Meal Elmalılı Hamdi Yazır'a ait ve uygulamadaki bütün dualar Kur'an'ın kendi duaları.",
    alt:
      "İnşirah dinî danışmanlık ya da fetva vermez; tıbbi veya psikolojik tedavinin yerine de geçmez."
  }
];

export default function Karsilama({ onBitti, onHatirlaticiIste }) {
  const { renk } = useTema();
  const [sira, setSira] = useState(0);
  const ekran = EKRANLAR[sira];
  const sonMu = sira === EKRANLAR.length - 1;

  return (
    <View style={[stil.kok, { backgroundColor: renk.zemin }]}>
      <ScrollView
        contentContainerStyle={stil.govde}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[stil.baslik, { color: renk.yazi }]}>{ekran.baslik}</Text>
        <Text style={[stil.metin, { color: renk.yaziSolgun }]}>{ekran.govde}</Text>
        {ekran.alt ? (
          <View
            style={[
              stil.altKutu,
              { backgroundColor: renk.yuzeyIkincil, borderLeftColor: renk.vurgu }
            ]}
          >
            <Text style={[stil.altMetin, { color: renk.yaziSolgun }]}>{ekran.alt}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={stil.alt}>
        <View style={stil.noktalar}>
          {EKRANLAR.map((_, i) => (
            <View
              key={i}
              style={[
                stil.nokta,
                {
                  backgroundColor: i === sira ? renk.vurgu : "transparent",
                  borderColor: i === sira ? renk.vurgu : renk.cizgi
                }
              ]}
            />
          ))}
        </View>

        {sonMu ? (
          <>
            <View style={stil.satir}>
              <Dugme metin="Başla" tur="dolu" onPress={onBitti} genis />
            </View>
            <View style={[stil.satir, { marginTop: 10 }]}>
              <Dugme
                metin="Günlük hatırlatıcıyı aç"
                tur="cizgi"
                onPress={onHatirlaticiIste}
                genis
              />
            </View>
          </>
        ) : (
          <View style={stil.satir}>
            <Dugme metin="Devam" tur="dolu" onPress={() => setSira(sira + 1)} genis />
          </View>
        )}
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  kok: { flex: 1 },
  govde: {
    flexGrow: 1,
    justifyContent: "center",
    padding: OLCU.bosluk + 8,
    paddingTop: 60
  },
  baslik: { fontSize: 30, fontWeight: "700", lineHeight: 40, marginBottom: 20 },
  metin: { fontSize: 17, lineHeight: 28 },
  altKutu: {
    borderLeftWidth: 3,
    borderRadius: OLCU.yaricapKucuk,
    padding: OLCU.bosluk,
    marginTop: 22
  },
  altMetin: { fontSize: 14, lineHeight: 22 },
  alt: { padding: OLCU.bosluk + 8, paddingBottom: 28 },
  noktalar: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  nokta: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: 4
  },
  satir: { flexDirection: "row" }
});
