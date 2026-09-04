/* Uygulamadaki tek dugme bileseni. `tur` gorunumu belirliyor:
 * "dolu" birincil eylem, "cizgi" ikincil, "duz" ucuncul. */
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { OLCU, useTema } from "../tema";

export default function Dugme({ metin, onPress, tur = "cizgi", genis = false }) {
  const { renk } = useTema();

  const zemin =
    tur === "dolu" ? renk.vurgu : tur === "duz" ? "transparent" : renk.yuzey;
  const yaziRengi = tur === "dolu" ? "#14100A" : renk.yazi;
  const kenar = tur === "duz" ? "transparent" : renk.cizgi;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        stil.dugme,
        {
          backgroundColor: zemin,
          borderColor: kenar,
          opacity: pressed ? 0.65 : 1,
          flex: genis ? 1 : undefined
        }
      ]}
    >
      <Text style={[stil.metin, { color: yaziRengi }]}>{metin}</Text>
    </Pressable>
  );
}

const stil = StyleSheet.create({
  dugme: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: OLCU.yaricapKucuk,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48
  },
  metin: {
    fontSize: 15,
    fontWeight: "600"
  }
});
