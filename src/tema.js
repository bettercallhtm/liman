/* Renkler ve olculer. Uygulama gece de aciliyor — asil kullanim vakti gece —
 * o yuzden koyu tema varsayilan, acik tema telefon ayarindan geliyor. */
import { useColorScheme } from "react-native";

const KOYU = {
  zemin: "#0F141C",
  yuzey: "#161D28",
  yuzeyIkincil: "#1E2632",
  cizgi: "#2A3441",
  yazi: "#E8EDF4",
  yaziSolgun: "#94A3B4",
  yaziSilik: "#63707F",
  vurgu: "#C9A961",
  vurguZemin: "#2A2418",
  arapca: "#F1E7D0"
};

const ACIK = {
  zemin: "#F7F5F0",
  yuzey: "#FFFFFF",
  yuzeyIkincil: "#F0EDE6",
  cizgi: "#E2DDD2",
  yazi: "#1B2027",
  yaziSolgun: "#5C6773",
  yaziSilik: "#8C97A3",
  vurgu: "#9A7B2E",
  vurguZemin: "#F5EEDC",
  arapca: "#2B2415"
};

export const OLCU = {
  bosluk: 16,
  yaricap: 14,
  yaricapKucuk: 10
};

export function useTema() {
  const sema = useColorScheme();
  const renk = sema === "light" ? ACIK : KOYU;
  return { renk, koyuMu: sema !== "light" };
}
