/* Yazilan metinde kendine zarar verme isareti gectiginde acilan ekran.
 *
 * Bu ekran bir ayetten ONCE geliyor. Boyle bir cumle yazan birine ayet
 * gosterip gecmek, uygulamanin yapabilecegi en yanlis sey olurdu.
 *
 * Dil suclamiyor ve "sen simdi sunu yapmalisin" demiyor: iki telefon
 * numarasi, bir cumle, ve devam etme secenegi. Kullaniciyi burada kilitlemek
 * de dogru degil — kapatamadigi bir ekran birakmak yardim degil. */
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Dugme from "../parcalar/Dugme";
import { OLCU, useTema } from "../tema";

export default function Destek({ onDevam, onGeri }) {
  const { renk } = useTema();

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[stil.baslik, { color: renk.yazi }]}>Bir dakika dur.</Text>

      <Text style={[stil.paragraf, { color: renk.yazi }]}>
        Yazdıklarında kendine zarar vermekle ilgili bir şey gördüm. Yanılıyor
        olabilirim. Ama yanılmıyorsam, bunu bir uygulamayla baş başa geçirmeni
        istemem.
      </Text>

      <Text style={[stil.paragraf, { color: renk.yaziSolgun }]}>
        Şu an konuşabileceğin biri var. Aramak zayıflık değil, kimseye bir şey
        açıklamak zorunda da değilsin.
      </Text>

      <View style={[stil.kutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}>
        <Pressable
          onPress={() => Linking.openURL("tel:112")}
          style={[stil.hat, { borderBottomColor: renk.cizgi }]}
        >
          <Text style={[stil.hatNumara, { color: renk.vurgu }]}>112</Text>
          <Text style={[stil.hatAd, { color: renk.yazi }]}>Acil Çağrı Merkezi</Text>
          <Text style={[stil.hatAlt, { color: renk.yaziSilik }]}>
            Hayati tehlike varsa. 7/24, ücretsiz.
          </Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("tel:183")} style={stil.hat}>
          <Text style={[stil.hatNumara, { color: renk.vurgu }]}>183</Text>
          <Text style={[stil.hatAd, { color: renk.yazi }]}>Sosyal Destek Hattı</Text>
          <Text style={[stil.hatAlt, { color: renk.yaziSilik }]}>
            Konuşmak, danışmak, yönlendirilmek için. 7/24, ücretsiz.
          </Text>
        </Pressable>
      </View>

      <Text style={[stil.paragraf, { color: renk.yaziSolgun }]}>
        Yakınında güvendiğin biri varsa ona da haber ver. Bu geceyi yalnız
        geçirmek zorunda değilsin.
      </Text>

      <View style={stil.dugmeler}>
        <Dugme metin="Yine de bir ayet göster" onPress={onDevam} genis />
      </View>
      <View style={stil.dugmeler}>
        <Dugme metin="Geri dön" onPress={onGeri} tur="duz" genis />
      </View>
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  baslik: { fontSize: 26, fontWeight: "700", marginTop: 12, marginBottom: 16 },
  paragraf: { fontSize: 16, lineHeight: 26, marginBottom: 16 },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    marginBottom: 20,
    overflow: "hidden"
  },
  hat: { padding: OLCU.bosluk, borderBottomWidth: 1, borderBottomColor: "transparent" },
  hatNumara: { fontSize: 30, fontWeight: "700", letterSpacing: 1 },
  hatAd: { fontSize: 15, fontWeight: "600", marginTop: 4 },
  hatAlt: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  dugmeler: { flexDirection: "row", marginTop: 4, marginBottom: 8 }
});
