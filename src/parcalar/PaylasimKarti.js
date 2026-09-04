/* Paylasilacak gorselin kendisi.
 *
 * Ekranda gorunmuyor: Kart ekraninin icinde, gorunur alanin disina konup
 * `react-native-view-shot` ile resme cevriliyor. Bu yuzden olculeri sabit —
 * 360x450 (4:5), Instagram ve WhatsApp durumunun kirpmadan aldigi oran.
 *
 * Metin uzunlugu cok degisiyor (bazi ayetler bir satir, bazilari on satir),
 * o yuzden punto uzunluga gore hesaplaniyor. Kirpmak yerine kucultmek daha
 * dogru: yarim birakilmis bir ayet paylasilmamali.
 *
 * Kaynak (sure, ayet, meal sahibi) gorselin uzerinde: alinti dolasima
 * girdiginde nereden geldigi kaybolmasin. */
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { grubuAl, grupBasligi, CEVIRI_ADI } from "../icerik";
import { useArapcaYaziTipi } from "../yazitipi";

export const GORSEL_EN = 360;
export const GORSEL_BOY = 450;

function puntoHesapla(uzunluk) {
  if (uzunluk < 90) return { punto: 22, satir: 34 };
  if (uzunluk < 160) return { punto: 19, satir: 29 };
  if (uzunluk < 260) return { punto: 16, satir: 25 };
  if (uzunluk < 400) return { punto: 14, satir: 21 };
  return { punto: 12, satir: 18 };
}

export default function PaylasimKarti({ grup, kartRef }) {
  const arapcaAile = useArapcaYaziTipi();
  const ayetler = grubuAl(grup);
  if (!ayetler.length) return null;

  const meal = ayetler.map((a) => a.meal).join(" ");
  const arapca = ayetler.map((a) => a.arapca).join(" ");
  const { punto, satir } = puntoHesapla(meal.length);
  /* Uzun mealde Arapca satiri yer kaplamasin diye kisaliyor; cok uzunsa hic
   * gosterilmiyor, cunku kesilmis Arapca metin gostermek dogru degil. */
  const arapcaGoster = meal.length < 260 && arapca.length < 220;

  return (
    <View ref={kartRef} collapsable={false} style={stil.kok}>
      <View style={stil.ustCizgi} />

      <View style={stil.orta}>
        {arapcaGoster ? (
          <Text
            style={[
              stil.arapca,
              arapcaAile ? { fontFamily: arapcaAile, fontSize: 20, lineHeight: 44 } : null
            ]}
          >
            {arapca}
          </Text>
        ) : null}

        <Text style={[stil.meal, { fontSize: punto, lineHeight: satir }]}>{meal}</Text>

        <Text style={stil.kaynak}>{grupBasligi(grup)}</Text>
      </View>

      <View style={stil.alt}>
        <Text style={stil.marka}>Liman</Text>
        <Text style={stil.meallik}>{CEVIRI_ADI} meali</Text>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  kok: {
    width: GORSEL_EN,
    height: GORSEL_BOY,
    backgroundColor: "#0F141C",
    padding: 30,
    justifyContent: "space-between"
  },
  ustCizgi: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C9A961"
  },
  orta: { flex: 1, justifyContent: "center" },
  arapca: {
    color: "#F1E7D0",
    fontSize: 18,
    lineHeight: 34,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 18
  },
  meal: { color: "#E8EDF4" },
  kaynak: { color: "#C9A961", fontSize: 12, marginTop: 16, letterSpacing: 0.4 },
  alt: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  marka: { color: "#E8EDF4", fontSize: 15, fontWeight: "700", letterSpacing: 0.6 },
  meallik: { color: "#63707F", fontSize: 10 }
});
