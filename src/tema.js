/* Renkler, olculer ve yazi tipleri. Uygulama gece de aciliyor — asil
 * kullanim vakti gece — o yuzden koyu tema varsayilan. Hâlim ekranindaki
 * dugme acik/koyu arasinda geciyor; secim yapilmadiysa telefonun kendi
 * ayarina uyulur.
 *
 * Yazi tipleri de burada, tek yerden yukleniyor: meal ve basliklar Lora
 * (serif, SIL OFL), Arapca Amiri Quran. Yuklenene kadar `yazi` alanlari
 * undefined doner ve metin sistem yazi tipiyle cizilir — uygulamayi bir
 * yukleme ekraninin arkasinda bekletmekten iyidir. */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform, useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { temaTercihiAl, temaTercihiYaz } from "./depo";

export const ARAPCA_AILE = "AmiriQuran";

const KOYU = {
  zemin: "#0B1119",
  yuzey: "#131B26",
  yuzeyIkincil: "#1A2431",
  cizgi: "#253142",
  yazi: "#ECEFF4",
  yaziSolgun: "#A3AFBF",
  /* Small labels sit on both zemin and yuzey; this keeps them at 4.5:1. */
  yaziSilik: "#7F8C9D",
  vurgu: "#D4B26A",
  vurguZemin: "#231E13",
  vurguCizgi: "#4A3E24",
  arapca: "#F3E6C8",
  logo: "#E4C177",
  tehlike: "#E58C80",
  /* Ust bolumun degrade renkleri. Iki temada da lacivert: uygulamanin
   * simgesi ve acilis ekrani bu renkte. */
  heroBas: "#0A2440",
  heroSon: "#15405F",
  heroYazi: "#F4EEDF",
  heroSolgun: "#B9C6D6",
  golge: "#000000",
  koyu: true
};

const ACIK = {
  zemin: "#F6F2EA",
  yuzey: "#FFFFFF",
  yuzeyIkincil: "#F1ECE2",
  cizgi: "#E5DDCF",
  yazi: "#18202A",
  yaziSolgun: "#56616E",
  /* Slightly deeper grey and gold than before: small labels on the cream
   * background were below 4:1. */
  yaziSilik: "#636C78",
  vurgu: "#86661F",
  vurguZemin: "#F6EEDB",
  vurguCizgi: "#E6D5AE",
  arapca: "#2A2212",
  logo: "#9A7B2E",
  tehlike: "#B23A2E",
  heroBas: "#0B2A4A",
  heroSon: "#1D5073",
  heroYazi: "#FBF6EA",
  heroSolgun: "#C8D3E0",
  golge: "#5A4A2A",
  koyu: false
};

/* Ust bolumdeki logo ve vurgular iki temada da lacivert zemin uzerinde
 * duruyor, o yuzden ikisinde de ayni parlak altin. */
export const HERO_ALTIN = "#E4C177";

export const OLCU = {
  bosluk: 16,
  yaricap: 18,
  yaricapKucuk: 12,
  /* Genis ekranda (web, tablet) icerik bu genisligi gecmiyor: satirlar
   * okunamayacak kadar uzamasin. */
  enGenis: 760,
  /* Android's minimum touch target. */
  dokunma: 48
};

/* Shared text roles so every screen titles and labels things the same way. */
export const YAZI = {
  ekranBaslik: { fontSize: 28, lineHeight: 36, fontWeight: "700" },
  etiket: { fontSize: 11.5, lineHeight: 16, letterSpacing: 1.4, fontWeight: "700" }
};

/* react-native-web reports `focused` for mouse clicks too, which left a
 * focus ring on whatever was last clicked. Track the last input modality
 * and only draw rings for keyboard focus (like CSS :focus-visible). On
 * native `focused` is never set, so this is always false there. */
let klavyeModu = false;
if (Platform.OS === "web" && typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab" || e.key.startsWith("Arrow")) klavyeModu = true;
  }, true);
  window.addEventListener("pointerdown", () => {
    klavyeModu = false;
  }, true);
}
export function odakGorunur(focused) {
  return Boolean(focused) && klavyeModu;
}

/* Blends a colour toward white. Hal colours are mid-tones; on the dark
 * background their icons need lifting to stay visible. */
export function acikla(hex, oran) {
  const h = hex.replace("#", "");
  const kanal = (i) => {
    const c = parseInt(h.slice(i, i + 2), 16);
    return Math.round(c + (255 - c) * oran);
  };
  return "rgb(" + kanal(0) + "," + kanal(2) + "," + kanal(4) + ")";
}

/* "#5B7DB1" + 0.16 -> "rgba(91,125,177,0.16)". Hal renklerini zemine
 * gore yumusatmak icin. */
export function saydam(hex, oran) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + oran + ")";
}

/* Kartlarin hafif golgesi. Android'de elevation, digerlerinde shadow. */
export function golge(renk, derinlik = 1) {
  if (Platform.OS === "android") return { elevation: derinlik * 2 };
  return {
    shadowColor: renk.golge,
    shadowOpacity: renk.koyu ? 0.35 : 0.07,
    shadowRadius: 12 * derinlik,
    shadowOffset: { width: 0, height: 4 * derinlik }
  };
}

const BOS_YAZI = {
  serif: undefined,
  serifKalin: undefined,
  serifItalik: undefined,
  arapca: undefined
};

/* Saglayici sarmalanmadan bir bilesen cizilirse uygulama patlamasin diye
 * baglama makul bir varsayilan konuyor. */
const TemaBaglam = createContext({
  renk: KOYU,
  koyuMu: true,
  tercih: "sistem",
  yazi: BOS_YAZI,
  tercihiDegistir: () => {}
});

export function TemaSaglayici({ children }) {
  const sistem = useColorScheme();
  /* "sistem" | "acik" | "koyu" */
  const [tercih, setTercih] = useState("sistem");

  const [yuklendi] = useFonts({
    Lora: require("@expo-google-fonts/lora/400Regular/Lora_400Regular.ttf"),
    LoraKalin: require("@expo-google-fonts/lora/600SemiBold/Lora_600SemiBold.ttf"),
    LoraItalik: require("@expo-google-fonts/lora/400Regular_Italic/Lora_400Regular_Italic.ttf"),
    [ARAPCA_AILE]: require("../assets/yazitipi/AmiriQuran-Regular.ttf")
  });

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

  const yazi = useMemo(
    () =>
      yuklendi
        ? {
            serif: "Lora",
            serifKalin: "LoraKalin",
            serifItalik: "LoraItalik",
            arapca: ARAPCA_AILE
          }
        : BOS_YAZI,
    [yuklendi]
  );

  const tercihiDegistir = async (yeni) => {
    setTercih(yeni);
    await temaTercihiYaz(yeni);
  };

  const deger = useMemo(
    () => ({ renk, koyuMu, tercih, yazi, tercihiDegistir }),
    [renk, koyuMu, tercih, yazi]
  );

  return <TemaBaglam.Provider value={deger}>{children}</TemaBaglam.Provider>;
}

export function useTema() {
  return useContext(TemaBaglam);
}
