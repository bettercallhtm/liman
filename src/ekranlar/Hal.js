/* Ana ekran: "Bugun nasilsin?" — yazma girisi, gunun ayeti, hal secimi ve
 * son yedi gun.
 *
 * Haller uc gruba ayrilmis durumda ve bir anda yalnizca biri gorunuyor.
 * Hepsi tek listede oldugunda ekran bastan asagi dert listesi gibi
 * goruluyordu; kirk hale cikinca da bitmeyen bir kaydirmaya donustu. Once
 * "zorlaniyorum" acik geliyor: sikintidayken acan kisi arayacagi seyi ilk
 * ekranda buluyor, iyi gunde acan kisi bir dokunusla kendi grubuna geciyor. */
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import Ikon from "../parcalar/Ikon";
import { Degrade, Yildiz, YildizOrgusu } from "../parcalar/Desen";
import { HALLER, grubuAl, grupBasligi, gununAyeti, haliBul } from "../icerik";
import { bugununAnahtari } from "../depo";
import { HERO_ALTIN, OLCU, golge, saydam, useTema } from "../tema";

/* Yatay logo (kelime markasi). Kare simgeden yazi bandi kirpildi:
 * araclar/logo-banner-uret.js. Saydam maske; rengi tintColor veriyor. */
const LOGO = require("../../assets/logo-banner.png");
const LOGO_ORAN = 1.698;

const GRUPLAR = [
  {
    id: "zor",
    ad: "Zorlanıyorum",
    ikon: "cloudy-outline",
    alt: "Ağır gelen bir şey varsa buradan başla."
  },
  {
    id: "iyi",
    ad: "İyiyim",
    ikon: "sunny-outline",
    alt: "Sevincini, şükrünü, dileğini bir ayetle karşıla."
  },
  {
    id: "kalp",
    ad: "Kalbim",
    ikon: "heart-outline",
    alt: "İmanın, ibadetin, nefsinle mücadelen için."
  }
];

const GUN_KISA = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

function selamlama(saat) {
  if (saat < 5) return "Hayırlı geceler";
  if (saat < 11) return "Hayırlı sabahlar";
  if (saat < 18) return "İyi günler";
  return "Hayırlı akşamlar";
}

/* "24 Eylül Perşembe" ve "13 Rebiülahir 1448". Hicri takvim her
 * ortamda yok (Android'in JS motoru takvim secenegini tanimayabiliyor);
 * alinamazsa yalnizca miladi tarih gosteriliyor. */
function tarihler(simdi = new Date()) {
  let miladi = "";
  let hicri = "";
  try {
    miladi = new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(simdi);
  } catch (hata) {
    miladi = "";
  }
  try {
    const metin = new Intl.DateTimeFormat("tr-TR-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(simdi);
    /* Takvim desteklenmiyorsa ICU sessizce miladi doner; yil 14xx degilse
     * gosterme. */
    if (/14\d\d/.test(metin)) hicri = metin.replace(/^Hicri\s*/i, "").replace(/\s*AH$/, "");
  } catch (hata) {
    hicri = "";
  }
  return { miladi, hicri };
}

function Hucre({ hal, genislik, onPress }) {
  const { renk } = useTema();
  return (
    <Pressable
      onPress={() => onPress(hal.id)}
      accessibilityRole="button"
      accessibilityLabel={hal.ad + ". " + hal.ozet}
      style={({ pressed, hovered }) => [
        stil.hucre,
        golge(renk, 0.5),
        {
          width: genislik,
          backgroundColor: renk.yuzey,
          borderColor: pressed || hovered ? saydam(hal.renk, 0.7) : renk.cizgi,
          transform: [{ scale: pressed ? 0.97 : 1 }]
        }
      ]}
    >
      <View style={[stil.hucreIkon, { backgroundColor: saydam(hal.renk, renk.koyu ? 0.22 : 0.14) }]}>
        <Ikon ad={hal.ikon || "ellipse-outline"} boyut={20} renk={hal.renk} />
      </View>
      <Text style={[stil.hucreAd, { color: renk.yazi }]} numberOfLines={2}>
        {hal.ad}
      </Text>
      <Text style={[stil.hucreOzet, { color: renk.yaziSilik }]} numberOfLines={2}>
        {hal.ozet}
      </Text>
    </Pressable>
  );
}

/* Son yedi gunun serit gosterimi. Hangi gun hangi hal secildiyse o halin
 * rengiyle bir nokta; secilmeyen gunler bos. Sayi, yorum, "seri" yok —
 * kullaniciyi her gun acmaya zorlayan bir sey kurmak istemiyoruz. */
function SonYediGun({ gunluk, onGunSec }) {
  const { renk } = useTema();
  const gunler = useMemo(() => {
    const liste = [];
    for (let i = 6; i >= 0; i--) {
      const tarih = new Date();
      tarih.setDate(tarih.getDate() - i);
      const anahtar = bugununAnahtari(tarih);
      liste.push({
        anahtar,
        halId: gunluk[anahtar],
        harf: GUN_KISA[tarih.getDay()],
        bugun: i === 0
      });
    }
    return liste;
  }, [gunluk]);

  if (!Object.keys(gunluk).length) return null;

  return (
    <View style={[stil.seritKutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}>
      <Text style={[stil.bolumBaslik, { color: renk.yaziSilik }]}>SON YEDİ GÜN</Text>
      <View style={stil.serit}>
        {gunler.map((gun) => {
          const hal = gun.halId ? haliBul(gun.halId) : null;
          return (
            <Pressable
              key={gun.anahtar}
              onPress={() => (hal ? onGunSec(hal.id) : null)}
              accessibilityLabel={hal ? hal.ad : "Kayıt yok"}
              style={stil.seritGun}
            >
              <View
                style={[
                  stil.nokta,
                  {
                    backgroundColor: hal ? saydam(hal.renk, 0.22) : "transparent",
                    borderColor: hal ? hal.renk : renk.cizgi
                  }
                ]}
              >
                {hal ? <Ikon ad={hal.ikon || "ellipse"} boyut={14} renk={hal.renk} /> : null}
              </View>
              <Text
                style={[
                  stil.seritHarf,
                  { color: gun.bugun ? renk.vurgu : renk.yaziSilik },
                  gun.bugun ? { fontWeight: "700" } : null
                ]}
              >
                {gun.harf}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Hal({ gunluk, onHalSec, onGununAyeti, onYaz }) {
  const { renk, koyuMu, yazi, tercihiDegistir } = useTema();
  const { width } = useWindowDimensions();
  const [grup, setGrup] = useState("zor");

  const gununGrup = gununAyeti();
  const gununMeal = grubuAl(gununGrup).map((a) => a.meal).join(" ");
  const { miladi, hicri } = useMemo(() => tarihler(), []);

  /* Icerik genisligi App'teki sinirla ayni: genis ekranda 760'i gecmiyor. */
  const icerikGen = Math.min(width, OLCU.enGenis);
  const sutun = icerikGen >= 600 ? 3 : 2;
  const darEkran = icerikGen < 400;
  const aralik = 12;
  const hucreGen = Math.floor(
    (icerikGen - OLCU.bosluk * 2 - aralik * (sutun - 1)) / sutun
  );
  const logoGen = Math.min(icerikGen - 96, 300);

  const seciliGrup = GRUPLAR.find((g) => g.id === grup);
  const haller = HALLER.filter((h) => h.grup === grup);

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      {/* ---- ust bolum ---- */}
      <View style={[stil.hero, golge(renk, 1.2)]}>
        <Degrade bas={renk.heroBas} son={renk.heroSon} />
        <YildizOrgusu renk={HERO_ALTIN} opaklik={0.09} aralik={46} />

        <View style={stil.heroUst}>
          <View style={{ flex: 1 }}>
            {miladi ? (
              <Text style={[stil.tarih, { color: renk.heroYazi }]}>{miladi}</Text>
            ) : null}
            {hicri ? (
              <Text style={[stil.hicri, { color: renk.heroSolgun }]}>{hicri}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => tercihiDegistir(koyuMu ? "acik" : "koyu")}
            accessibilityRole="button"
            accessibilityLabel={koyuMu ? "Açık moda geç" : "Koyu moda geç"}
            hitSlop={8}
            style={({ pressed }) => [stil.temaDugme, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ikon ad={koyuMu ? "sunny-outline" : "moon-outline"} boyut={19} renk={HERO_ALTIN} />
          </Pressable>
        </View>

        <Image
          source={LOGO}
          style={{
            width: logoGen,
            height: Math.round(logoGen / LOGO_ORAN),
            tintColor: HERO_ALTIN,
            alignSelf: "center",
            marginTop: 2
          }}
          resizeMode="contain"
          accessibilityLabel="Liman"
        />

        <Text style={[stil.selam, { color: renk.heroSolgun }]}>
          {selamlama(new Date().getHours())}
        </Text>
        <Text
          style={[
            stil.baslik,
            { color: renk.heroYazi },
            yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
          ]}
        >
          Bugün nasılsın?
        </Text>

        <Pressable
          onPress={onYaz}
          accessibilityRole="button"
          accessibilityLabel="Ne yaşadığını yaz"
          style={({ pressed, hovered }) => [
            stil.yazGiris,
            {
              backgroundColor: hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.09)",
              borderColor: "rgba(228,193,119,0.45)",
              opacity: pressed ? 0.8 : 1
            }
          ]}
        >
          <View style={stil.yazIkon}>
            <Ikon ad="create-outline" boyut={20} renk="#16110A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[stil.yazBaslik, { color: renk.heroYazi }]}>Ne yaşadığını yaz</Text>
            <Text style={[stil.yazAlt, { color: renk.heroSolgun }]} numberOfLines={2}>
              Başından geçeni anlat, sana uyan ayeti ve duayı bulayım.
            </Text>
          </View>
          <Ikon ad="chevron-forward" boyut={18} renk={renk.heroSolgun} />
        </Pressable>
      </View>

      {/* ---- gunun ayeti ---- */}
      <Pressable
        onPress={onGununAyeti}
        accessibilityRole="button"
        accessibilityLabel="Günün ayetini aç"
        style={({ pressed, hovered }) => [
          stil.gunun,
          golge(renk, 0.6),
          {
            backgroundColor: renk.vurguZemin,
            borderColor: hovered ? renk.vurgu : renk.vurguCizgi,
            opacity: pressed ? 0.85 : 1
          }
        ]}
      >
        <View style={stil.gununDekor}>
          <Yildiz boyut={120} renk={renk.vurgu} opaklik={0.14} kalinlik={1.4} />
        </View>
        <View style={stil.gununUst}>
          <Ikon ad="sparkles" boyut={13} renk={renk.vurgu} />
          <Text style={[stil.bolumBaslik, { color: renk.vurgu, marginLeft: 6 }]}>
            GÜNÜN AYETİ
          </Text>
        </View>
        <Text
          style={[
            stil.gununMeal,
            { color: renk.yazi },
            yazi.serif ? { fontFamily: yazi.serif } : null
          ]}
          numberOfLines={5}
        >
          {gununMeal}
        </Text>
        <View style={stil.gununAlt}>
          <View style={[stil.kaynakHap, { borderColor: renk.vurguCizgi }]}>
            <Text style={[stil.kaynakHapMetin, { color: renk.vurgu }]}>
              {grupBasligi(gununGrup)}
            </Text>
          </View>
          <View style={stil.oku}>
            <Text style={[stil.okuMetin, { color: renk.yaziSolgun }]}>Oku</Text>
            <Ikon ad="arrow-forward" boyut={14} renk={renk.yaziSolgun} />
          </View>
        </View>
      </Pressable>

      {/* ---- hal gruplari ---- */}
      <Text
        style={[
          stil.bolumBuyuk,
          { color: renk.yazi },
          yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
        ]}
      >
        Hâlini seç
      </Text>

      <View style={[stil.sekmeKutu, { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }]}>
        {GRUPLAR.map((g) => {
          const secili = g.id === grup;
          return (
            <Pressable
              key={g.id}
              onPress={() => setGrup(g.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: secili }}
              style={[
                stil.sekme,
                secili ? [{ backgroundColor: renk.yuzey }, golge(renk, 0.4)] : null
              ]}
            >
              {/* Dar telefonda (360 dp) simgeyle birlikte "Zorlanıyorum"
                  sigmiyor ve kirpiliyordu; orada yalnizca yazi kaliyor. */}
              {darEkran ? null : (
                <Ikon ad={g.ikon} boyut={15} renk={secili ? renk.vurgu : renk.yaziSilik} />
              )}
              <Text
                style={[
                  stil.sekmeMetin,
                  { color: secili ? renk.yazi : renk.yaziSilik },
                  darEkran ? { marginLeft: 0, fontSize: 13 } : null
                ]}
                numberOfLines={1}
              >
                {g.ad}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[stil.grupAlt, { color: renk.yaziSolgun }]}>{seciliGrup.alt}</Text>

      <View style={[stil.izgara, { gap: aralik }]}>
        {haller.map((hal) => (
          <Hucre key={hal.id} hal={hal} genislik={hucreGen} onPress={onHalSec} />
        ))}
      </View>

      <SonYediGun gunluk={gunluk} onGunSec={onHalSec} />
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 48 },

  hero: {
    borderRadius: 26,
    overflow: "hidden",
    padding: 20,
    paddingBottom: 20,
    marginBottom: OLCU.bosluk
  },
  heroUst: { flexDirection: "row", alignItems: "flex-start" },
  tarih: { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  hicri: { fontSize: 12, marginTop: 2, letterSpacing: 0.3 },
  temaDugme: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(228,193,119,0.35)"
  },
  selam: { fontSize: 15, marginTop: 8, textAlign: "center", letterSpacing: 0.4 },
  baslik: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 40
  },
  yazGiris: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 14,
    marginTop: 18
  },
  yazIkon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: HERO_ALTIN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  yazBaslik: { fontSize: 16, fontWeight: "700" },
  yazAlt: { fontSize: 13, lineHeight: 19, marginTop: 2 },

  gunun: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap + 4,
    padding: 20,
    marginBottom: 28,
    overflow: "hidden"
  },
  gununDekor: { position: "absolute", top: -30, right: -30 },
  gununUst: { flexDirection: "row", alignItems: "center" },
  gununMeal: { fontSize: 17, lineHeight: 28, marginTop: 12 },
  gununAlt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14
  },
  kaynakHap: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  kaynakHapMetin: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  oku: { flexDirection: "row", alignItems: "center" },
  okuMetin: { fontSize: 13, fontWeight: "600", marginRight: 4 },

  bolumBuyuk: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  bolumBaslik: { fontSize: 11, letterSpacing: 1.6, fontWeight: "700" },
  sekmeKutu: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4
  },
  sekme: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 42
  },
  sekmeMetin: { fontSize: 13.5, fontWeight: "700", marginLeft: 6 },
  grupAlt: { fontSize: 13, lineHeight: 19, marginTop: 10, marginBottom: 14 },

  izgara: { flexDirection: "row", flexWrap: "wrap" },
  hucre: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 14,
    minHeight: 128
  },
  hucreIkon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  hucreAd: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  hucreOzet: { fontSize: 12, lineHeight: 17, marginTop: 4 },

  seritKutu: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 16
  },
  serit: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  seritGun: { alignItems: "center", flex: 1 },
  nokta: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  seritHarf: { fontSize: 11, marginTop: 6 }
});
