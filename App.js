/* Dua Pusulasi — giris.
 *
 * Gezinme icin kutuphane yok: dort ekran ve bir "hangisi acik" degiskeni.
 * react-navigation eklemek bu kadar ekran icin paketi buyutmekten baska bir
 * ise yaramiyordu. Kart ekrani sekmelerin ustune aciliyor, geri tusu onu
 * kapatiyor. */
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Platform,
  Pressable,
  SafeAreaView,
  Share,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Ayarlar from "./src/ekranlar/Ayarlar";
import Favoriler from "./src/ekranlar/Favoriler";
import Hal from "./src/ekranlar/Hal";
import Kart from "./src/ekranlar/Kart";
import { gununKarti, kartUret, paylasimMetni } from "./src/icerik";
import {
  ayarlariAl,
  ayarlariYaz,
  favoriCikar,
  favoriEkle,
  favoriKimlik,
  favorileriAl,
  gunlugeYaz,
  gunluguAl,
  sonGosterileniYaz,
  sonGosterilenleriAl,
  VARSAYILAN_AYARLAR
} from "./src/depo";
import { hatirlaticiyiKapat, hatirlaticiyiKur, hazirMi, izinIste } from "./src/hatirlatici";
import { OLCU, useTema } from "./src/tema";

const SEKMELER = [
  { id: "hal", ad: "Hâlim" },
  { id: "favoriler", ad: "Kayıtlar" },
  { id: "ayarlar", ad: "Ayarlar" }
];

export default function App() {
  const { renk, koyuMu } = useTema();

  const [sekme, setSekme] = useState("hal");
  const [kart, setKart] = useState(null);
  const [favoriler, setFavoriler] = useState([]);
  const [gunluk, setGunluk] = useState({});
  const [ayarlar, setAyarlar] = useState(VARSAYILAN_AYARLAR);
  const [sonGosterilen, setSonGosterilen] = useState({});

  useEffect(() => {
    let iptal = false;
    (async () => {
      const [f, g, a, s] = await Promise.all([
        favorileriAl(),
        gunluguAl(),
        ayarlariAl(),
        sonGosterilenleriAl()
      ]);
      if (iptal) return;
      setFavoriler(f);
      setGunluk(g);
      setAyarlar(a);
      setSonGosterilen(s);
    })();
    return () => {
      iptal = true;
    };
  }, []);

  /* Android'de donanim geri tusu: kart aciksa once onu kapat. */
  useEffect(() => {
    if (Platform.OS !== "android") return undefined;
    const abone = BackHandler.addEventListener("hardwareBackPress", () => {
      if (kart) {
        setKart(null);
        return true;
      }
      if (sekme !== "hal") {
        setSekme("hal");
        return true;
      }
      return false;
    });
    return () => abone.remove();
  }, [kart, sekme]);

  const halSec = useCallback(
    async (halId) => {
      const yeni = kartUret(halId, sonGosterilen);
      if (!yeni) return;
      setKart(yeni);
      const guncel = { ...sonGosterilen, [halId]: { ayetIndis: yeni.ayetIndis, duaIndis: yeni.duaIndis } };
      setSonGosterilen(guncel);
      await sonGosterileniYaz(halId, yeni.ayetIndis, yeni.duaIndis);
      setGunluk(await gunlugeYaz(halId));
    },
    [sonGosterilen]
  );

  const yenile = useCallback(() => {
    if (!kart || kart.halId === "gunun") return;
    halSec(kart.halId);
  }, [kart, halSec]);

  const favoriMi = kart
    ? favoriler.some((k) => favoriKimlik(k) === favoriKimlik(kart))
    : false;

  const favoriDegistir = useCallback(async () => {
    if (!kart) return;
    setFavoriler(favoriMi ? await favoriCikar(kart) : await favoriEkle(kart));
  }, [kart, favoriMi]);

  const paylas = useCallback(async () => {
    if (!kart) return;
    try {
      await Share.share({ message: paylasimMetni(kart) });
    } catch (hata) {
      /* Kullanici paylasim ekranini kapattiysa yapacak bir sey yok. */
    }
  }, [kart]);

  /* Ayar degisiklikleri tek kapidan geciyor: hatirlatici acilip kapanmasi da,
   * kayitlarin silinmesi de burada. */
  const ayarDegis = useCallback(
    async (yeni) => {
      if (yeni.__hepsiniSil) {
        await AsyncStorage.multiRemove([
          "dp.favoriler",
          "dp.gunluk",
          "dp.sonGosterilen"
        ]);
        setFavoriler([]);
        setGunluk({});
        setSonGosterilen({});
        setKart(null);
        return;
      }

      let sonuc = yeni;
      if (yeni.hatirlaticiAcik) {
        const izin = await izinIste();
        if (!izin) {
          sonuc = { ...yeni, hatirlaticiAcik: false };
        } else {
          const kuruldu = await hatirlaticiyiKur(
            yeni.hatirlaticiSaat,
            yeni.hatirlaticiDakika
          );
          if (!kuruldu) sonuc = { ...yeni, hatirlaticiAcik: false };
        }
      } else {
        await hatirlaticiyiKapat();
      }

      setAyarlar(sonuc);
      await ayarlariYaz(sonuc);
    },
    []
  );

  let govde;
  if (kart) {
    govde = (
      <Kart
        kart={kart}
        ayarlar={ayarlar}
        favoriMi={favoriMi}
        onFavori={favoriDegistir}
        onYenile={yenile}
        onPaylas={paylas}
        onGeri={() => setKart(null)}
      />
    );
  } else if (sekme === "favoriler") {
    govde = (
      <Favoriler
        favoriler={favoriler}
        onAc={(k) => setKart(k)}
        onSil={async (k) => setFavoriler(await favoriCikar(k))}
      />
    );
  } else if (sekme === "ayarlar") {
    govde = (
      <Ayarlar ayarlar={ayarlar} onAyarDegis={ayarDegis} bildirimVarMi={hazirMi()} />
    );
  } else {
    govde = (
      <Hal
        gunluk={gunluk}
        onHalSec={halSec}
        onGununAyeti={() => setKart(gununKarti())}
      />
    );
  }

  return (
    <SafeAreaView style={[stil.kok, { backgroundColor: renk.zemin }]}>
      <StatusBar style={koyuMu ? "light" : "dark"} />
      <View style={stil.icerik}>{govde}</View>

      {kart ? null : (
        <View
          style={[
            stil.sekmeler,
            { backgroundColor: renk.zemin, borderTopColor: renk.cizgi }
          ]}
        >
          {SEKMELER.map((s) => {
            const secili = sekme === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSekme(s.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: secili }}
                style={stil.sekme}
              >
                <Text
                  style={[
                    stil.sekmeMetin,
                    { color: secili ? renk.vurgu : renk.yaziSilik }
                  ]}
                >
                  {s.ad}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const stil = StyleSheet.create({
  kok: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0
  },
  icerik: { flex: 1 },
  sekmeler: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 4 : 10
  },
  sekme: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 44
  },
  sekmeMetin: { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 }
});
