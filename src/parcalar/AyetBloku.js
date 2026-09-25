/* Bir ayet grubunu gosterir.
 *
 * Sira MEAL, sonra Arapca, sonra okunus. Once Arapca konuldugunda uc ayetlik
 * gruplarda meal ekranin cok asagisina kaciyordu; kaygili bir anda uygulamayi
 * acan biri once anladigi dili gormeli. Arapca metin kaldirilmadi, ikinci
 * siraya alindi — Ayarlar'dan tamamen kapatilabiliyor.
 *
 * `tur` "ayet" ya da "dua": ikisi de Kur'an metni, ama dua blogu altin
 * zeminle ayriliyor ki kart bakinca "bu okunacak dua" diye anlasilsin.
 *
 * Arapca metin sagdan sola yaziliyor; `writingDirection` olmadan Android'de
 * noktalama isaretleri satirin yanlis ucuna kaciyor. Ayetlerin arasina
 * ayet sonu isareti (۝ + numara) konuyor: mushaftaki gibi, nerede bir
 * ayetin bitip digerinin basladigi gorunsun. Bu bir sayi isareti; metnin
 * kendisine dokunulmuyor. */
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Ikon from "./Ikon";
import { grubuAl, grupBasligi } from "../icerik";
import { OLCU, golge, useTema } from "../tema";
import { arapcaRakam } from "../yazitipi";

export default function AyetBloku({
  grup,
  etiket,
  tur = "ayet",
  arapcaGoster = true,
  okunusGoster = true
}) {
  const { renk, yazi } = useTema();
  const ayetler = grubuAl(grup);
  if (!ayetler.length) return null;

  const dua = tur === "dua";
  const arapca = ayetler.map((a) => a.arapca + " ۝" + arapcaRakam(a.ayet)).join(" ");

  return (
    <View
      style={[
        stil.kutu,
        golge(renk, 0.6),
        {
          backgroundColor: dua ? renk.vurguZemin : renk.yuzey,
          borderColor: dua ? renk.vurguCizgi : renk.cizgi
        }
      ]}
    >
      <View style={stil.ust}>
        <View style={stil.etiketSatir}>
          <Ikon
            ad={dua ? "hand-left-outline" : "book-outline"}
            boyut={14}
            renk={renk.vurgu}
          />
          {etiket ? (
            <Text style={[stil.etiket, { color: renk.vurgu }]}>{etiket}</Text>
          ) : null}
        </View>
        <View style={[stil.kaynakHap, { borderColor: dua ? renk.vurguCizgi : renk.cizgi }]}>
          <Text style={[stil.kaynakMetin, { color: renk.yaziSolgun }]}>
            {grupBasligi(grup)}
          </Text>
        </View>
      </View>

      <Text
        style={[
          stil.meal,
          { color: renk.yazi },
          yazi.serif ? { fontFamily: yazi.serif } : null
        ]}
      >
        {ayetler.map((a) => a.meal).join(" ")}
      </Text>

      {arapcaGoster ? (
        <View
          style={[
            stil.arapcaKutu,
            {
              backgroundColor: dua ? "rgba(0,0,0,0.04)" : renk.yuzeyIkincil,
              borderColor: dua ? renk.vurguCizgi : renk.cizgi
            }
          ]}
        >
          <Text
            style={[
              stil.arapca,
              { color: renk.arapca },
              /* Amiri Quran'in harfleri sistem yazi tipinden daha kucuk
               * oturuyor; yuklenince punto ve satir araligi da buyuyor. */
              yazi.arapca ? [stil.arapcaAmiri, { fontFamily: yazi.arapca }] : null
            ]}
          >
            {arapca}
          </Text>
        </View>
      ) : null}

      {okunusGoster && ayetler.some((a) => a.okunus) ? (
        <Text
          style={[
            stil.okunus,
            { color: renk.yaziSolgun },
            yazi.serifItalik ? { fontFamily: yazi.serifItalik, fontStyle: "normal" } : null
          ]}
        >
          {ayetler.map((a) => a.okunus).join(" ")}
        </Text>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap + 2,
    padding: OLCU.bosluk + 4,
    marginBottom: OLCU.bosluk
  },
  ust: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  etiketSatir: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  etiket: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    marginLeft: 6
  },
  kaynakHap: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginLeft: 8
  },
  kaynakMetin: { fontSize: 11.5, fontWeight: "600", letterSpacing: 0.2 },
  meal: {
    fontSize: 18.5,
    lineHeight: 31
  },
  arapcaKutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricapKucuk,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 18
  },
  arapca: {
    fontSize: 22,
    lineHeight: 44,
    textAlign: "right",
    writingDirection: "rtl"
  },
  arapcaAmiri: {
    fontSize: 27,
    lineHeight: 60
  },
  okunus: {
    fontSize: 13.5,
    lineHeight: 22,
    fontStyle: "italic",
    marginTop: 14
  }
});
