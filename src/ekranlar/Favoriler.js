/* Kaydedilen kartlar. Hepsi telefonda duruyor. */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { grubuAl, grupBasligi } from "../icerik";
import { OLCU, useTema } from "../tema";

export default function Favoriler({ favoriler, onAc, onSil }) {
  const { renk } = useTema();

  if (!favoriler.length) {
    return (
      <View style={[stil.bos, { backgroundColor: renk.zemin }]}>
        <Text style={[stil.bosBaslik, { color: renk.yazi }]}>Henüz kayıt yok</Text>
        <Text style={[stil.bosMetin, { color: renk.yaziSolgun }]}>
          Bir kartı beğendiğinde "Kaydet" dersen burada birikiyor.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[stil.baslik, { color: renk.yazi }]}>Kayıtlarım</Text>
      <Text style={[stil.altBaslik, { color: renk.yaziSolgun }]}>
        {favoriler.length} kart
      </Text>

      {favoriler.map((kart, sira) => {
        const ayetler = grubuAl(kart.ayetGrup);
        return (
          <Pressable
            key={kart.halId + "-" + sira}
            onPress={() => onAc(kart)}
            style={({ pressed }) => [
              stil.kutu,
              {
                backgroundColor: renk.yuzey,
                borderColor: renk.cizgi,
                opacity: pressed ? 0.75 : 1
              }
            ]}
          >
            <View style={stil.kutuUst}>
              <View style={[stil.serit4, { backgroundColor: kart.renk }]} />
              <Text style={[stil.halAdi, { color: renk.yaziSilik }]}>{kart.halAdi}</Text>
            </View>
            <Text style={[stil.meal, { color: renk.yazi }]} numberOfLines={3}>
              {ayetler.map((a) => a.meal).join(" ")}
            </Text>
            <View style={stil.kutuAlt}>
              <Text style={[stil.kaynak, { color: renk.yaziSilik }]}>
                {grupBasligi(kart.ayetGrup)}
              </Text>
              <Pressable onPress={() => onSil(kart)} hitSlop={12}>
                <Text style={[stil.sil, { color: renk.yaziSilik }]}>Sil</Text>
              </Pressable>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  baslik: { fontSize: 26, fontWeight: "700", marginTop: 8 },
  altBaslik: { fontSize: 13, marginTop: 4, marginBottom: OLCU.bosluk + 4 },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    marginBottom: 12
  },
  kutuUst: { marginBottom: 10 },
  serit4: { width: 26, height: 3, borderRadius: 2, marginBottom: 8 },
  halAdi: { fontSize: 12, fontWeight: "600" },
  meal: { fontSize: 15, lineHeight: 24 },
  kutuAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },
  kaynak: { fontSize: 12 },
  sil: { fontSize: 13, fontWeight: "600" },
  bos: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32
  },
  bosBaslik: { fontSize: 18, fontWeight: "600" },
  bosMetin: { fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 10 }
});
