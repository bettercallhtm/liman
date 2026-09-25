/* Uygulamadaki tek dugme bileseni. `tur` gorunumu belirliyor:
 * "dolu" birincil eylem, "cizgi" ikincil, "duz" ucuncul, "ikon" yalnizca
 * simgeli kare dugme (etiketi erisilebilirlik icin yine veriliyor). */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Ikon from "./Ikon";
import { OLCU, useTema } from "../tema";

export default function Dugme({
  metin,
  onPress,
  tur = "cizgi",
  genis = false,
  ikon,
  secili = false,
  pasif = false
}) {
  const { renk } = useTema();

  const dolu = tur === "dolu" || (tur === "ikon" && secili);
  const zemin = dolu
    ? renk.vurgu
    : tur === "duz"
      ? "transparent"
      : renk.yuzey;
  const yaziRengi = dolu ? (renk.koyu ? "#16110A" : "#FFFFFF") : renk.yazi;
  const kenar = dolu ? renk.vurgu : tur === "duz" ? "transparent" : renk.cizgi;

  if (tur === "ikon") {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={metin}
        style={({ pressed, hovered }) => [
          stil.ikonDugme,
          {
            backgroundColor: zemin,
            borderColor: kenar,
            opacity: pressed ? 0.65 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }]
          },
          hovered && !dolu ? { borderColor: renk.vurgu } : null
        ]}
      >
        <Ikon ad={ikon} boyut={21} renk={dolu ? yaziRengi : renk.yazi} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={pasif ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: pasif }}
      style={({ pressed, hovered }) => [
        stil.dugme,
        {
          backgroundColor: zemin,
          borderColor: kenar,
          opacity: pasif ? 0.5 : pressed ? 0.75 : 1,
          flex: genis ? 1 : undefined,
          transform: [{ scale: pressed && !pasif ? 0.98 : 1 }]
        },
        hovered && !pasif && !dolu && tur !== "duz" ? { borderColor: renk.vurgu } : null
      ]}
    >
      <View style={stil.icerik}>
        {ikon ? (
          <Ikon ad={ikon} boyut={18} renk={yaziRengi} style={stil.solIkon} />
        ) : null}
        <Text style={[stil.metin, { color: yaziRengi }]} numberOfLines={1}>
          {metin}
        </Text>
      </View>
    </Pressable>
  );
}

const stil = StyleSheet.create({
  dugme: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: OLCU.yaricapKucuk + 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50
  },
  icerik: { flexDirection: "row", alignItems: "center" },
  solIkon: { marginRight: 8 },
  metin: { fontSize: 15, fontWeight: "600", letterSpacing: 0.2 },
  ikonDugme: {
    /* 46: kart ekraninin alt cubugunda uc simge dugmesiyle birlikte
     * "Baska bir ayet" 360 dp genislikte tek satira sigsin diye. */
    width: 46,
    height: 50,
    borderRadius: OLCU.yaricapKucuk + 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
