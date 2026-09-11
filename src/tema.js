/* Renkler ve olculer. Uygulama gece de aciliyor — asil kullanim vakti gece —
 * o yuzden koyu tema varsayilan. Kullanici Ayarlar'dan Sistem / Acik / Koyu
 * secebiliyor; secim yapilmadiysa telefonun kendi ayarina uyulur. */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { temaTercihiAl, temaTercihiYaz } from "./depo";

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
  arapca: "#F1E7D0",
  logo: "#E4C177"
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
  arapca: "#2B2415",
  logo: "#9A7B2E"
};

export const OLCU = {
  bosluk: 16,
  yaricap: 14,
  yaricapKucuk: 10
};

/* Saglayici sarmalanmadan bir bilesen cizilirse uygulama patlamasin diye
 * baglama makul bir varsayilan konuyor. */
const TemaBaglam = createContext({
  renk: KOYU,
  koyuMu: true,
  tercih: "sistem",
  tercihiDegistir: () => {}
});

export function TemaSaglayici({ children }) {
  const sistem = useColorScheme();
  /* "sistem" | "acik" | "koyu" */
  const [tercih, setTercih] = useState("sistem");

  useEffect(() => {
    let iptal = false;
    (async () => {
      const t = await temaTercihiAl();
      if (!iptal) setTercih(t);
    })();
    return () => {
      iptal = true;
    };
  }, []);

  const koyuMu =
    tercih === "koyu" ? true : tercih === "acik" ? false : sistem !== "light";
  const renk = koyuMu ? KOYU : ACIK;

  const tercihiDegistir = async (yeni) => {
    setTercih(yeni);
    await temaTercihiYaz(yeni);
  };

  const deger = useMemo(
    () => ({ renk, koyuMu, tercih, tercihiDegistir }),
    [renk, koyuMu, tercih]
  );

  return <TemaBaglam.Provider value={deger}>{children}</TemaBaglam.Provider>;
}

export function useTema() {
  return useContext(TemaBaglam);
}
