/* Zemin desenleri: lacivert degrade ve uzerinde sekiz koseli yildiz
 * (iki ic ice kare) orgusu. Islam geometrik sanatinin en sade motifi;
 * resim dosyasi yerine kodla cizildigi icin her ekran boyunda keskin.
 *
 * Web'de SVG kimlikleri (id) sayfa genelinde tek olmali: iki desen ayni
 * "g" kimligini kullanirsa ikincisi birincinin rengini alir. O yuzden her
 * ornek kendi kimligini uretiyor. */
import React, { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Pattern,
  Polygon,
  Rect,
  Circle,
  Stop
} from "react-native-svg";

function kimlik(ham) {
  return "d" + ham.replace(/[^a-zA-Z0-9]/g, "");
}

/* Merkezi (m, m), yaricapi r olan sekiz koseli yildizin iki karesi. */
function yildizKareleri(m, r) {
  const k = r * Math.SQRT2;
  const duz = [
    [m - r, m - r],
    [m + r, m - r],
    [m + r, m + r],
    [m - r, m + r]
  ];
  const capraz = [
    [m, m - k],
    [m + k, m],
    [m, m + k],
    [m - k, m]
  ];
  const yaz = (l) => l.map((n) => n[0].toFixed(2) + "," + n[1].toFixed(2)).join(" ");
  return [yaz(duz), yaz(capraz)];
}

/* Yalnizca yildiz orgusu, saydam zemin. Istenen yerin arkasina konur. */
export function YildizOrgusu({ renk, opaklik = 0.12, aralik = 44, kalinlik = 1 }) {
  const id = kimlik(useId());
  const m = aralik / 2;
  const [a, b] = yildizKareleri(m, aralik * 0.2);
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={id} width={aralik} height={aralik} patternUnits="userSpaceOnUse">
          <Polygon points={a} fill="none" stroke={renk} strokeWidth={kalinlik} />
          <Polygon points={b} fill="none" stroke={renk} strokeWidth={kalinlik} />
          <Circle cx={0} cy={0} r={1.4} fill={renk} />
          <Circle cx={aralik} cy={0} r={1.4} fill={renk} />
          <Circle cx={0} cy={aralik} r={1.4} fill={renk} />
          <Circle cx={aralik} cy={aralik} r={1.4} fill={renk} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={"url(#" + id + ")"} opacity={opaklik} />
    </Svg>
  );
}

/* Iki renkli capraz degrade. */
export function Degrade({ bas, son, yon = "capraz", basOpak = 1, sonOpak = 1 }) {
  const id = kimlik(useId());
  const bitis = yon === "dikey" ? { x2: "0", y2: "1" } : { x2: "1", y2: "1" };
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" {...bitis}>
          <Stop offset="0" stopColor={bas} stopOpacity={basOpak} />
          <Stop offset="1" stopColor={son} stopOpacity={sonOpak} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={"url(#" + id + ")"} />
    </Svg>
  );
}

/* Tek bir buyuk yildiz: kartlarin kosesinde suslu bir isaret olarak. */
export function Yildiz({ boyut = 64, renk, opaklik = 1, kalinlik = 1.2 }) {
  const m = boyut / 2;
  const [a, b] = yildizKareleri(m, boyut * 0.3);
  return (
    <Svg width={boyut} height={boyut} pointerEvents="none">
      <Polygon points={a} fill="none" stroke={renk} strokeWidth={kalinlik} opacity={opaklik} />
      <Polygon points={b} fill="none" stroke={renk} strokeWidth={kalinlik} opacity={opaklik} />
      <Circle cx={m} cy={m} r={boyut * 0.06} fill={renk} opacity={opaklik} />
    </Svg>
  );
}

/* Iki ince cizgi arasinda kucuk bir yildiz: bolum ayiraci. */
export function Ayirac({ renk, genislik = 120 }) {
  return (
    <View style={stil.ayirac}>
      <View style={[stil.cizgi, { backgroundColor: renk, width: genislik / 2 - 14 }]} />
      <Yildiz boyut={16} renk={renk} kalinlik={1} />
      <View style={[stil.cizgi, { backgroundColor: renk, width: genislik / 2 - 14 }]} />
    </View>
  );
}

const stil = StyleSheet.create({
  ayirac: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  cizgi: { height: 1, opacity: 0.6, marginHorizontal: 6 }
});
