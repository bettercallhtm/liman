/* Ilk acilista gosterilen tek karsilama ekrani. Bir kere gorulur, sonra
 * bir daha cikmaz.
 *
 * Onceden uc ayri ekrandi ve her biri tek bir cumle icin butun ekrani
 * isgal ediyordu. Ucu de kisa oldugu icin tek ekranda topladik: ne yaptigi
 * ustte, yazinin telefondan cikmadigi ve ayetlerin kaynagi kisa iki not
 * olarak altta. Ayrinti zaten Ayarlar'da; burada amac ilk otuz saniyede
 * anlasilmak. */
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import Dugme from "../parcalar/Dugme";
import Ikon from "../parcalar/Ikon";
import { Degrade, YildizOrgusu } from "../parcalar/Desen";
import { HERO_ALTIN, OLCU, useTema } from "../tema";

const LOGO = require("../../assets/logo-banner.png");

const NOKTALAR = [
  {
    ikon: "lock-closed-outline",
    baslik: "Yazdıkların telefonundan çıkmaz.",
    metin:
      "Yazdığın metin hiçbir sunucuya gönderilmez; hangi ayete denk düştüğü telefonunun içinde hesaplanır."
  },
  {
    ikon: "book-outline",
    baslik: "Ayetleri biz yazmadık.",
    metin:
      "Meal Elmalılı Hamdi Yazır'a ait; uygulamadaki bütün dualar Kur'an'ın kendi dualarıdır."
  }
];

export default function Karsilama({ onBitti, onHatirlaticiIste }) {
  const { renk, yazi } = useTema();

  return (
    <View style={[stil.kok, { backgroundColor: renk.zemin }]}>
      <ScrollView contentContainerStyle={stil.govde} showsVerticalScrollIndicator={false}>
        <View style={stil.hero}>
          <Degrade bas={renk.heroBas} son={renk.heroSon} />
          <YildizOrgusu renk={HERO_ALTIN} opaklik={0.06} aralik={46} />
          <Image
            source={LOGO}
            style={[stil.logo, { tintColor: HERO_ALTIN }]}
            resizeMode="contain"
            accessibilityLabel="Liman"
          />
          <Text
            style={[
              stil.baslik,
              { color: renk.heroYazi },
              yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
            ]}
          >
            Nasıl hissediyorsan,{"\n"}ona bir ayet.
          </Text>
        </View>

        <Text style={[stil.metin, { color: renk.yaziSolgun }]}>
          Hâlini seç ya da başından geçeni kendi cümlelerinle yaz. Sana o hâle
          dokunan bir ayet ve Kur'an'ın kendi dualarından biri gelsin.
        </Text>

        {/* Both notes in one card, split by a rule, rather than two boxes. */}
        <View style={[stil.kutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}>
          {NOKTALAR.map((n, sira) => (
            <View
              key={n.baslik}
              style={[
                stil.nokta,
                sira > 0 ? [stil.noktaAyrik, { borderTopColor: renk.cizgi }] : null
              ]}
            >
              <View style={[stil.kutuIkon, { backgroundColor: renk.vurguZemin }]}>
                <Ikon ad={n.ikon} boyut={18} renk={renk.vurgu} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[stil.kutuBaslik, { color: renk.yazi }]}>{n.baslik}</Text>
                <Text style={[stil.kutuMetin, { color: renk.yaziSolgun }]}>{n.metin}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={stil.alt}>
        <View style={stil.satir}>
          <Dugme metin="Başla" tur="dolu" ikon="arrow-forward" onPress={onBitti} genis />
        </View>
        <View style={[stil.satir, { marginTop: 10 }]}>
          <Dugme
            metin="Günlük hatırlatıcıyı aç"
            tur="cizgi"
            ikon="notifications-outline"
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
    padding: OLCU.bosluk + 4,
    paddingTop: 20
  },
  hero: {
    borderRadius: 26,
    overflow: "hidden",
    paddingVertical: 20,
    paddingHorizontal: 22,
    alignItems: "center",
    marginBottom: 20
  },
  /* 180 / 1.698 keeps the banner's own proportions. */
  logo: { width: 180, height: 106 },
  baslik: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 35,
    textAlign: "center",
    marginTop: 10
  },
  metin: { fontSize: 16, lineHeight: 25, marginBottom: 14, textAlign: "center" },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    paddingHorizontal: OLCU.bosluk
  },
  nokta: { flexDirection: "row", paddingVertical: 14 },
  noktaAyrik: { borderTopWidth: 1 },
  kutuIkon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  kutuBaslik: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  kutuMetin: { fontSize: 14, lineHeight: 21 },
  alt: { paddingHorizontal: OLCU.bosluk + 4, paddingTop: 12, paddingBottom: 20 },
  satir: { flexDirection: "row" }
});
