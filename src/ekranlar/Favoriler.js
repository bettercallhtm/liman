/* Kaydedilen kartlar. Hepsi telefonda duruyor. */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Ikon from "../parcalar/Ikon";
import { Yildiz } from "../parcalar/Desen";
import { grubuAl, grupBasligi, haliBul } from "../icerik";
import { OLCU, golge, saydam, useTema } from "../tema";

export default function Favoriler({ favoriler, onAc, onSil }) {
  const { renk, yazi } = useTema();
  const baslikYazi = yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null;

  if (!favoriler.length) {
    return (
      <View style={[stil.bos, { backgroundColor: renk.zemin }]}>
        <View style={stil.bosSekil}>
          <Yildiz boyut={96} renk={renk.vurgu} opaklik={0.35} kalinlik={1.2} />
          <View style={stil.bosIkon}>
            <Ikon ad="bookmark-outline" boyut={28} renk={renk.vurgu} />
          </View>
        </View>
        <Text style={[stil.bosBaslik, { color: renk.yazi }, baslikYazi]}>Henüz kayıt yok</Text>
        <Text style={[stil.bosMetin, { color: renk.yaziSolgun }]}>
          Bir kartı beğendiğinde kaydet simgesine dokun; burada birikiyor.
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
      <Text style={[stil.baslik, { color: renk.yazi }, baslikYazi]}>Kayıtlarım</Text>
      <Text style={[stil.altBaslik, { color: renk.yaziSolgun }]}>
        {favoriler.length} kart
      </Text>

      {favoriler.map((kart, sira) => {
        const ayetler = grubuAl(kart.ayetGrup);
        const hal = haliBul(kart.halId);
        return (
          <Pressable
            key={kart.halId + "-" + sira}
            onPress={() => onAc(kart)}
            style={({ pressed, hovered }) => [
              stil.kutu,
              golge(renk, 0.5),
              {
                backgroundColor: renk.yuzey,
                borderColor: hovered ? saydam(kart.renk, 0.7) : renk.cizgi,
                opacity: pressed ? 0.8 : 1
              }
            ]}
          >
            <View style={[stil.serit, { backgroundColor: kart.renk }]} />
            <View style={stil.kutuUst}>
              <View style={[stil.halIkon, { backgroundColor: saydam(kart.renk, renk.koyu ? 0.22 : 0.14) }]}>
                <Ikon ad={hal && hal.ikon ? hal.ikon : "sparkles-outline"} boyut={15} renk={kart.renk} />
              </View>
              <Text style={[stil.halAdi, { color: renk.yaziSolgun }]}>{kart.halAdi}</Text>
            </View>
            <Text
              style={[stil.meal, { color: renk.yazi }, yazi.serif ? { fontFamily: yazi.serif } : null]}
              numberOfLines={3}
            >
              {ayetler.map((a) => a.meal).join(" ")}
            </Text>
            <View style={stil.kutuAlt}>
              <Text style={[stil.kaynak, { color: renk.vurgu }]}>{grupBasligi(kart.ayetGrup)}</Text>
              <Pressable
                onPress={() => onSil(kart)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Kaydı sil"
                style={({ pressed }) => [stil.sil, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Ikon ad="trash-outline" boyut={16} renk={renk.yaziSilik} />
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
  baslik: { fontSize: 28, fontWeight: "700", marginTop: 8 },
  altBaslik: { fontSize: 13, marginTop: 4, marginBottom: OLCU.bosluk + 4 },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    paddingLeft: OLCU.bosluk + 6,
    marginBottom: 12,
    overflow: "hidden"
  },
  serit: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  kutuUst: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  halIkon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
  halAdi: { fontSize: 12.5, fontWeight: "700" },
  meal: { fontSize: 16, lineHeight: 26 },
  kutuAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },
  kaynak: { fontSize: 12, fontWeight: "600" },
  sil: { padding: 4 },
  bos: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32
  },
  bosSekil: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18
  },
  bosIkon: { position: "absolute" },
  bosBaslik: { fontSize: 20, fontWeight: "700" },
  bosMetin: { fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 10, maxWidth: 300 }
});
