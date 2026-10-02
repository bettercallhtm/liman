/* Uygulamadaki tek dugme bileseni. `tur` gorunumu belirliyor:
 * "dolu" birincil eylem, "cizgi" ikincil, "duz" ucuncul, "ikon" yalnizca
 * simgeli kare dugme (etiketi erisilebilirlik icin yine veriliyor). */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Ikon from "./Ikon";
import { OLCU, useTema, odakGorunur } from "../tema";

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

  /* A disabled primary button drops its gold fill entirely instead of just
   * fading, so "not yet" reads by shape and fill, not only by opacity. */
  const dolu = (tur === "dolu" && !pasif) || (tur === "ikon" && secili);
  const zemin = dolu
    ? renk.vurgu
    : tur === "duz"
      ? "transparent"
      : pasif && tur === "dolu"
        ? renk.yuzeyIkincil
        : renk.yuzey;
  const yaziRengi = dolu
    ? renk.koyu
      ? "#16110A"
      : "#FFFFFF"
    : pasif
      ? renk.yaziSilik
      : renk.yazi;
  const kenar = dolu ? renk.vurgu : tur === "duz" ? "transparent" : renk.cizgi;
  /* Keyboard focus (web) gets a thicker ring; padding shrinks by the same
   * amount so the button doesn't jump. */
  const odakKenar = dolu ? renk.yazi : renk.vurgu;

  if (tur === "ikon") {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={metin}
        accessibilityState={{ selected: secili }}
        style={({ pressed, hovered, focused }) => [
          stil.ikonDugme,
          {
            backgroundColor: zemin,
            borderColor: odakGorunur(focused) ? odakKenar : hovered && !dolu ? renk.vurgu : kenar,
            borderWidth: odakGorunur(focused) ? 2 : 1,
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }]
          },
          genis ? { flex: 1, width: undefined } : null
        ]}
      >
        <Ikon ad={ikon} boyut={21} renk={dolu ? yaziRengi : renk.yazi} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={pasif ? undefined : onPress}
      disabled={pasif}
      accessibilityRole="button"
      accessibilityLabel={metin}
      accessibilityState={{ disabled: pasif }}
      style={({ pressed, hovered, focused }) => [
        stil.dugme,
        {
          backgroundColor: zemin,
          borderColor: odakGorunur(focused)
            ? odakKenar
            : hovered && !pasif && !dolu && tur !== "duz"
              ? renk.vurgu
              : kenar,
          borderWidth: odakGorunur(focused) ? 2 : 1,
          paddingHorizontal: odakGorunur(focused) ? 13 : 14,
          opacity: pressed && !pasif ? 0.8 : 1,
          flex: genis ? 1 : undefined,
          transform: [{ scale: pressed && !pasif ? 0.98 : 1 }]
        }
      ]}
    >
      <View style={stil.icerik}>
        {ikon ? (
          <Ikon ad={ikon} boyut={18} renk={yaziRengi} style={stil.solIkon} />
        ) : null}
        {/* Two lines rather than an ellipsis when the system font is large. */}
        <Text style={[stil.metin, { color: yaziRengi }]} numberOfLines={2}>
          {metin}
        </Text>
      </View>
    </Pressable>
  );
}

const stil = StyleSheet.create({
  dugme: {
    paddingVertical: 12,
    borderRadius: OLCU.yaricapKucuk + 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50
  },
  icerik: { flexDirection: "row", alignItems: "center", maxWidth: "100%" },
  solIkon: { marginRight: 8 },
  metin: { fontSize: 15, fontWeight: "600", letterSpacing: 0.2, textAlign: "center", flexShrink: 1 },
  ikonDugme: {
    /* 48 is Android's touch minimum. On narrow screens or with a large
     * system font the card's bottom bar moves these to a second row. */
    width: OLCU.dokunma,
    height: 50,
    borderRadius: OLCU.yaricapKucuk + 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
