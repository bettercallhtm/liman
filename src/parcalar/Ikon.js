/* Uygulamadaki butun simgeler Ionicons'tan (MIT). Tek yerden geciyor ki
 * baska bir simge setine gecmek gerekirse tek dosya degissin. */
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Ikon({ ad, boyut = 20, renk, style }) {
  return <Ionicons name={ad} size={boyut} color={renk} style={style} />;
}
