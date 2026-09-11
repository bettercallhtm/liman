/* Ilk acilista gosterilen tek karsilama ekrani. Bir kere gorulur, sonra
 * bir daha cikmaz.
 *
 * Onceden uc ayri ekrandi ve her biri tek bir cumle icin butun ekrani
 * isgal ediyordu. Ucu de kisa oldugu icin tek ekranda topladik: ne yaptigi
 * ustte, yazinin telefondan cikmadigi ve ayetlerin kaynagi kisa iki not
 * olarak altta. Ayrinti zaten Ayarlar'da; burada amac ilk otuz saniyede
 * anlasilmak. */
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Dugme from "../parcalar/Dugme";
import { OLCU, useTema } from "../tema";

const NOKTALAR = [
  {
    baslik: "Yazdıkların telefonundan çıkmaz.",
    metin:
      "Yazdığın metin hiçbir sunucuya gönderilmez; hangi ayete denk düştüğü telefonunun içinde hesaplanır."
  },
  {
    baslik: "Ayetleri biz yazmadık.",
    metin:
      "Meal Elmalılı Hamdi Yazır'a ait; uygulamadaki bütün dualar Kur'an'ın kendi dualarıdır."
  }
];

export default function Karsilama({ onBitti, onHatirlaticiIste }) {
  const { renk } = useTema();

  return (
    <View style={[stil.kok, { backgroundColor: renk.zemin }]}>
      <ScrollView
        contentContainerStyle={stil.govde}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[stil.baslik, { color: renk.yazi }]}>
          Nasıl hissediyorsan,{"\n"}ona bir ayet.
        </Text>
        <Text style={[stil.metin, { color: renk.yaziSolgun }]}>
          Hâlini seç ya da başından geçeni kendi cümlelerinle yaz. Sana o hâle
          dokunan bir ayet ve Kur'an'ın kendi dualarından biri gelsin.
        </Text>

        {NOKTALAR.map((n) => (
          <View
            key={n.baslik}
            style={[
              stil.kutu,
              { backgroundColor: renk.yuzeyIkincil, borderLeftColor: renk.vurgu }
            ]}
          >
            <Text style={[stil.kutuBaslik, { color: renk.yazi }]}>
              {n.baslik}
            </Text>
            <Text style={[stil.kutuMetin, { color: renk.yaziSolgun }]}>
              {n.metin}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={stil.alt}>
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
  baslik: { fontSize: 30, fontWeight: "700", lineHeight: 40, marginBottom: 18 },
  metin: { fontSize: 17, lineHeight: 28, marginBottom: 8 },
  kutu: {
    borderLeftWidth: 3,
    borderRadius: OLCU.yaricapKucuk,
    padding: OLCU.bosluk,
    marginTop: 14
  },
  kutuBaslik: { fontSize: 15, fontWeight: "700", marginBottom: 5 },
  kutuMetin: { fontSize: 14, lineHeight: 21 },
  alt: { padding: OLCU.bosluk + 8, paddingBottom: 28 },
  satir: { flexDirection: "row" }
});
