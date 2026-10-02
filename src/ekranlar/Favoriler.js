/* Kaydedilen kartlar. Hepsi telefonda duruyor. */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Ikon from "../parcalar/Ikon";
import { Yildiz } from "../parcalar/Desen";
import { grubuAl, grupBasligi, haliBul } from "../icerik";
import { OLCU, YAZI, acikla, golge, saydam, useTema, odakGorunur } from "../tema";

export default function Favoriler({ favoriler, onAc, onSil }) {
  const { renk, yazi } = useTema();
  const baslikYazi = yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null;

  /* Empty and filled states share the same title so switching between
   * them doesn't feel like landing on a different screen. */
  const baslik = (
    <Text style={[stil.baslik, { color: renk.yazi }, baslikYazi]}>Kayıtlarım</Text>
  );

  if (!favoriler.length) {
    return (
      <View style={[stil.bosKok, { backgroundColor: renk.zemin }]}>
        {baslik}
        <View style={stil.bos}>
          <View style={stil.bosSekil}>
            <Yildiz boyut={96} renk={renk.vurgu} opaklik={0.3} kalinlik={1.2} />
            <View style={stil.bosIkon}>
              <Ikon ad="bookmark-outline" boyut={28} renk={renk.vurgu} />
            </View>
          </View>
          <Text style={[stil.bosBaslik, { color: renk.yazi }, baslikYazi]}>Henüz kayıt yok</Text>
          <Text style={[stil.bosMetin, { color: renk.yaziSolgun }]}>
            Bir kartı beğendiğinde kaydet simgesine dokun; burada birikiyor.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      {baslik}
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
            accessibilityRole="button"
            accessibilityLabel={kart.halAdi + ". " + grupBasligi(kart.ayetGrup)}
            style={({ pressed, hovered, focused }) => [
              stil.kutu,
              golge(renk, 0.4),
              {
                backgroundColor: renk.yuzey,
                borderColor: odakGorunur(focused)
                  ? renk.vurgu
                  : hovered
                    ? saydam(kart.renk, 0.7)
                    : renk.cizgi,
                opacity: pressed ? 0.85 : 1
              }
            ]}
          >
            <View style={stil.kutuUst}>
              <View style={[stil.halIkon, { backgroundColor: saydam(kart.renk, renk.koyu ? 0.24 : 0.13) }]}>
                <Ikon
                  ad={hal && hal.ikon ? hal.ikon : "sparkles-outline"}
                  boyut={15}
                  renk={renk.koyu ? acikla(kart.renk, 0.35) : kart.renk}
                />
              </View>
              <Text style={[stil.halAdi, { color: renk.yaziSolgun }]}>{kart.halAdi}</Text>
            </View>
            {/* A preview; the card opens in full on tap. */}
            <Text
              style={[stil.meal, { color: renk.yazi }, yazi.serif ? { fontFamily: yazi.serif } : null]}
              numberOfLines={3}
            >
              {ayetler.map((a) => a.meal).join(" ")}
            </Text>
            <View style={[stil.kutuAlt, { borderTopColor: renk.cizgi }]}>
              <Text style={[stil.kaynak, { color: renk.vurgu }]}>{grupBasligi(kart.ayetGrup)}</Text>
              <Pressable
                onPress={() => onSil(kart)}
                accessibilityRole="button"
                accessibilityLabel="Kaydı sil"
                style={({ pressed, hovered, focused }) => [
                  stil.sil,
                  {
                    backgroundColor: hovered || odakGorunur(focused) ? renk.yuzeyIkincil : "transparent",
                    borderColor: odakGorunur(focused) ? renk.vurgu : "transparent",
                    opacity: pressed ? 0.6 : 1
                  }
                ]}
              >
                <Ikon ad="trash-outline" boyut={18} renk={renk.yaziSolgun} />
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
  baslik: { ...YAZI.ekranBaslik, marginTop: 8 },
  altBaslik: { fontSize: 13.5, marginTop: 2, marginBottom: OLCU.bosluk + 4 },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    paddingTop: OLCU.bosluk,
    paddingHorizontal: OLCU.bosluk,
    marginBottom: 12
  },
  kutuUst: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  halIkon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
  halAdi: { fontSize: 13, fontWeight: "700", flexShrink: 1 },
  meal: { fontSize: 16, lineHeight: 26 },
  kutuAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: 12,
    paddingVertical: 2
  },
  kaynak: { fontSize: 12.5, fontWeight: "600", flexShrink: 1 },
  sil: {
    width: OLCU.dokunma,
    height: OLCU.dokunma,
    marginRight: -12,
    borderRadius: OLCU.dokunma / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bosKok: { flex: 1, padding: OLCU.bosluk },
  bos: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 48
  },
  bosSekil: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18
  },
  bosIkon: { position: "absolute" },
  bosBaslik: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
  bosMetin: { fontSize: 14.5, lineHeight: 22, textAlign: "center", marginTop: 8, maxWidth: 300 }
});
