/* Bir ayet grubunu gosterir.
 *
 * Sira MEAL, sonra Arapca, sonra okunus. Once Arapca konuldugunda uc ayetlik
 * gruplarda meal ekranin cok asagisina kaciyordu; kaygili bir anda uygulamayi
 * acan biri once anladigi dili gormeli. Arapca metin kaldirilmadi, ikinci
 * siraya alindi — Ayarlar'dan tamamen kapatilabiliyor.
 *
 * Arapca metin sagdan sola yaziliyor; `writingDirection` olmadan Android'de
 * noktalama isaretleri satirin yanlis ucuna kaciyor. */
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { grubuAl, grupBasligi } from "../icerik";
import { OLCU, useTema } from "../tema";
import { useArapcaYaziTipi } from "../yazitipi";

export default function AyetBloku({
  grup,
  etiket,
  arapcaGoster = true,
  okunusGoster = true
}) {
  const { renk } = useTema();
  const arapcaAile = useArapcaYaziTipi();
  const ayetler = grubuAl(grup);
  if (!ayetler.length) return null;

  return (
    <View style={[stil.kutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}>
      {etiket ? (
        <Text style={[stil.etiket, { color: renk.vurgu }]}>{etiket}</Text>
      ) : null}

      <Text style={[stil.meal, { color: renk.yazi }]}>
        {ayetler.map((a) => a.meal).join(" ")}
      </Text>

      <Text style={[stil.kaynak, { color: renk.yaziSilik }]}>{grupBasligi(grup)}</Text>

      {arapcaGoster || okunusGoster ? (
        <View style={[stil.ayirac, { borderTopColor: renk.cizgi }]} />
      ) : null}

      {arapcaGoster ? (
        <Text
          style={[
            stil.arapca,
            { color: renk.arapca },
            /* Amiri Quran'in harfleri sistem yazi tipinden daha kucuk
             * oturuyor; yuklenince punto ve satir araligi da buyuyor. */
            arapcaAile ? stil.arapcaAmiri : null,
            arapcaAile ? { fontFamily: arapcaAile } : null
          ]}
        >
          {ayetler.map((a) => a.arapca).join(" ")}
        </Text>
      ) : null}

      {okunusGoster && ayetler.some((a) => a.okunus) ? (
        <Text style={[stil.okunus, { color: renk.yaziSolgun }]}>
          {ayetler.map((a) => a.okunus).join(" ")}
        </Text>
      ) : null}
    </View>
  );
}

const stil = StyleSheet.create({
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk + 2,
    marginBottom: OLCU.bosluk
  },
  etiket: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
    fontWeight: "600"
  },
  meal: {
    fontSize: 17,
    lineHeight: 28
  },
  kaynak: {
    fontSize: 12,
    marginTop: 12
  },
  ayirac: {
    borderTopWidth: 1,
    marginTop: OLCU.bosluk,
    marginBottom: OLCU.bosluk - 2
  },
  arapca: {
    fontSize: 22,
    lineHeight: 44,
    textAlign: "right",
    writingDirection: "rtl"
  },
  arapcaAmiri: {
    fontSize: 26,
    lineHeight: 58
  },
  okunus: {
    fontSize: 13,
    lineHeight: 21,
    fontStyle: "italic",
    marginTop: 12
  }
});
