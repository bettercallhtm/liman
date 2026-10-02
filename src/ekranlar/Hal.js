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
import { HERO_ALTIN, OLCU, YAZI, acikla, golge, saydam, useTema, odakGorunur } from "../tema";

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

/* Rough widths (dp at font scale 1) a group tab needs so "Zorlanıyorum"
 * fits on one line, with and without its icon. Below the second one the
 * tabs stack vertically instead of shrinking or clipping the label. */
const SEKME_IKONLU = 124;
const SEKME_YALIN = 104;
/* A two-column hal cell narrower than this (scaled by the font scale)
 * starts breaking words; the grid falls back to one column. */
const HUCRE_EN_DAR = 140;

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

/* Hal colours are mid-tones picked for the light theme; on the dark
 * background the icon is lifted toward white so it doesn't sink. */
function ikonRengi(renk, halRengi) {
  return renk.koyu ? acikla(halRengi, 0.35) : halRengi;
}

function Hucre({ hal, genislik, yatay, onPress }) {
  const { renk } = useTema();
  return (
    <Pressable
      onPress={() => onPress(hal.id)}
      accessibilityRole="button"
      accessibilityLabel={hal.ad + ". " + hal.ozet}
      style={({ pressed, hovered, focused }) => [
        stil.hucre,
        yatay ? stil.hucreYatay : null,
        golge(renk, 0.4),
        {
          width: genislik,
          backgroundColor: renk.yuzey,
          borderColor: odakGorunur(focused)
            ? renk.vurgu
            : pressed || hovered
              ? saydam(hal.renk, 0.7)
              : renk.cizgi,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
    >
      <View
        style={[
          stil.hucreIkon,
          yatay ? stil.hucreIkonYatay : null,
          { backgroundColor: saydam(hal.renk, renk.koyu ? 0.24 : 0.13) }
        ]}
      >
        <Ikon ad={hal.ikon || "ellipse-outline"} boyut={19} renk={ikonRengi(renk, hal.renk)} />
      </View>
      <View style={yatay ? { flex: 1 } : null}>
        <Text style={[stil.hucreAd, { color: renk.yazi }]}>{hal.ad}</Text>
        <Text style={[stil.hucreOzet, { color: renk.yaziSolgun }]}>{hal.ozet}</Text>
      </View>
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
    <View style={[stil.seritKutu, { borderTopColor: renk.cizgi }]}>
      <Text style={[YAZI.etiket, { color: renk.yaziSilik }]}>SON YEDİ GÜN</Text>
      <View style={stil.serit}>
        {gunler.map((gun) => {
          const hal = gun.halId ? haliBul(gun.halId) : null;
          return (
            <Pressable
              key={gun.anahtar}
              onPress={() => (hal ? onGunSec(hal.id) : null)}
              disabled={!hal}
              accessibilityRole={hal ? "button" : undefined}
              accessibilityLabel={hal ? hal.ad : "Kayıt yok"}
              style={stil.seritGun}
            >
              <View
                style={[
                  stil.nokta,
                  {
                    backgroundColor: hal ? saydam(hal.renk, renk.koyu ? 0.24 : 0.16) : "transparent",
                    borderColor: hal ? saydam(hal.renk, 0.8) : saydam(renk.yaziSilik, 0.55),
                    borderStyle: hal ? "solid" : "dashed"
                  }
                ]}
              >
                {hal ? (
                  <Ikon ad={hal.ikon || "ellipse"} boyut={15} renk={ikonRengi(renk, hal.renk)} />
                ) : null}
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
              {/* Today is marked by weight and this dot, not by colour alone. */}
              <View
                style={[
                  stil.bugunIsaret,
                  { backgroundColor: gun.bugun ? renk.vurgu : "transparent" }
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Hal({ gunluk, onHalSec, onGununAyeti, onYaz }) {
  const { renk, koyuMu, yazi, tercihiDegistir } = useTema();
  const { width, fontScale } = useWindowDimensions();
  const [grup, setGrup] = useState("zor");

  const gununGrup = gununAyeti();
  const gununMeal = grubuAl(gununGrup).map((a) => a.meal).join(" ");
  const { miladi, hicri } = useMemo(() => tarihler(), []);

  /* Icerik genisligi App'teki sinirla ayni: genis ekranda 760'i gecmiyor. */
  const icerikGen = Math.min(width, OLCU.enGenis);
  const olcek = Math.max(1, fontScale || 1);
  const aralik = 12;
  const kullanilir = icerikGen - OLCU.bosluk * 2;

  let sutun = icerikGen >= 600 ? 3 : 2;
  let hucreGen = Math.floor((kullanilir - aralik * (sutun - 1)) / sutun);
  if (sutun === 2 && hucreGen < HUCRE_EN_DAR * olcek) {
    sutun = 1;
    hucreGen = kullanilir;
  }

  /* Group tabs: icon + label, label only, or stacked rows. */
  const sekmeGen = (kullanilir - 10) / 3;
  const sekmeDuzen =
    sekmeGen >= SEKME_IKONLU * olcek ? "ikonlu" : sekmeGen >= SEKME_YALIN * olcek ? "yalin" : "dikey";

  /* The logo used to take ~45% of a 360 dp screen and pushed the hal
   * choice below the fold; it stays the brand mark, just smaller. */
  const logoGen = Math.round(Math.min(icerikGen * 0.42, 180));

  const seciliGrup = GRUPLAR.find((g) => g.id === grup);
  const haller = HALLER.filter((h) => h.grup === grup);
  const tarihSatiri = [miladi, hicri].filter(Boolean).join(" · ");

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      {/* ---- ust bolum ---- */}
      <View style={[stil.hero, golge(renk, 1)]}>
        <Degrade bas={renk.heroBas} son={renk.heroSon} />
        <YildizOrgusu renk={HERO_ALTIN} opaklik={0.06} aralik={46} />

        <View style={stil.heroUst}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[stil.selam, { color: renk.heroYazi }]}>
              {selamlama(new Date().getHours())}
            </Text>
            {tarihSatiri ? (
              <Text style={[stil.tarih, { color: renk.heroSolgun }]}>{tarihSatiri}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => tercihiDegistir(koyuMu ? "acik" : "koyu")}
            accessibilityRole="button"
            accessibilityLabel={koyuMu ? "Açık moda geç" : "Koyu moda geç"}
            style={({ pressed, focused }) => [
              stil.temaDugme,
              {
                opacity: pressed ? 0.7 : 1,
                borderColor: odakGorunur(focused) ? HERO_ALTIN : "rgba(228,193,119,0.35)"
              }
            ]}
          >
            <Ikon ad={koyuMu ? "sunny-outline" : "moon-outline"} boyut={20} renk={HERO_ALTIN} />
          </Pressable>
        </View>

        {/* Logo sits in its own row under the date/theme row, so the theme
            button never shifts it off the true horizontal centre. */}
        <Image
          source={LOGO}
          style={{
            width: logoGen,
            height: Math.round(logoGen / LOGO_ORAN),
            tintColor: HERO_ALTIN,
            alignSelf: "center",
            marginTop: 6
          }}
          resizeMode="contain"
          accessibilityLabel="Liman"
        />

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
          style={({ pressed, hovered, focused }) => [
            stil.yazGiris,
            {
              backgroundColor: hovered || pressed ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.09)",
              borderColor: odakGorunur(focused) ? HERO_ALTIN : "rgba(228,193,119,0.45)",
              borderWidth: odakGorunur(focused) ? 2 : 1
            }
          ]}
        >
          <View style={stil.yazIkon}>
            <Ikon ad="create-outline" boyut={20} renk="#16110A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[stil.yazBaslik, { color: renk.heroYazi }]}>Ne yaşadığını yaz</Text>
            <Text style={[stil.yazAlt, { color: renk.heroSolgun }]}>
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
        style={({ pressed, hovered, focused }) => [
          stil.gunun,
          {
            backgroundColor: renk.vurguZemin,
            borderColor: hovered || odakGorunur(focused) ? renk.vurgu : renk.vurguCizgi,
            opacity: pressed ? 0.85 : 1
          }
        ]}
      >
        <View style={stil.gununDekor}>
          <Yildiz boyut={96} renk={renk.vurgu} opaklik={0.1} kalinlik={1.2} />
        </View>
        <View style={stil.gununUst}>
          <Ikon ad="sparkles" boyut={13} renk={renk.vurgu} />
          <Text style={[YAZI.etiket, { color: renk.vurgu, marginLeft: 6 }]}>GÜNÜN AYETİ</Text>
        </View>
        {/* A preview; the full text opens on tap. */}
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
            <Text style={[stil.okuMetin, { color: renk.yazi }]}>Oku</Text>
            <Ikon ad="arrow-forward" boyut={15} renk={renk.vurgu} />
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

      <View
        accessibilityRole="tablist"
        style={[
          stil.sekmeKutu,
          sekmeDuzen === "dikey" ? stil.sekmeKutuDikey : null,
          { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }
        ]}
      >
        {GRUPLAR.map((g) => {
          const secili = g.id === grup;
          return (
            <Pressable
              key={g.id}
              onPress={() => setGrup(g.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: secili }}
              style={({ focused }) => [
                stil.sekme,
                sekmeDuzen === "dikey" ? stil.sekmeDikey : null,
                {
                  borderColor: secili ? renk.vurguCizgi : odakGorunur(focused) ? renk.vurgu : "transparent"
                },
                secili ? [{ backgroundColor: renk.yuzey }, golge(renk, 0.3)] : null
              ]}
            >
              {sekmeDuzen === "yalin" ? null : (
                <Ikon ad={g.ikon} boyut={16} renk={secili ? renk.vurgu : renk.yaziSilik} />
              )}
              <Text
                style={[
                  stil.sekmeMetin,
                  {
                    color: secili ? renk.yazi : renk.yaziSolgun,
                    fontWeight: secili ? "700" : "600",
                    marginLeft: sekmeDuzen === "yalin" ? 0 : sekmeDuzen === "dikey" ? 10 : 6
                  }
                ]}
                numberOfLines={sekmeDuzen === "dikey" ? undefined : 1}
              >
                {g.ad}
              </Text>
              {sekmeDuzen === "dikey" && secili ? (
                <Ikon ad="checkmark" boyut={18} renk={renk.vurgu} style={{ marginLeft: "auto" }} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <Text style={[stil.grupAlt, { color: renk.yaziSolgun }]}>{seciliGrup.alt}</Text>

      <View style={[stil.izgara, { gap: aralik }]}>
        {haller.map((hal) => (
          <Hucre
            key={hal.id}
            hal={hal}
            genislik={hucreGen}
            yatay={sutun === 1}
            onPress={onHalSec}
          />
        ))}
      </View>

      <SonYediGun gunluk={gunluk} onGunSec={onHalSec} />
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },

  hero: {
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: OLCU.bosluk
  },
  heroUst: { flexDirection: "row", alignItems: "center" },
  selam: { fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },
  tarih: { fontSize: 12.5, lineHeight: 18, marginTop: 2, letterSpacing: 0.2 },
  temaDugme: {
    width: OLCU.dokunma,
    height: OLCU.dokunma,
    borderRadius: OLCU.dokunma / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1
  },
  baslik: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 34
  },
  yazGiris: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: OLCU.yaricap,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 14,
    minHeight: 64
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
    borderRadius: OLCU.yaricap + 2,
    padding: 18,
    marginBottom: 28,
    overflow: "hidden"
  },
  gununDekor: { position: "absolute", top: -26, right: -26 },
  gununUst: { flexDirection: "row", alignItems: "center" },
  gununMeal: { fontSize: 17, lineHeight: 28, marginTop: 10 },
  gununAlt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 14
  },
  kaynakHap: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8
  },
  kaynakHapMetin: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  oku: { flexDirection: "row", alignItems: "center", minHeight: 32 },
  okuMetin: { fontSize: 14, fontWeight: "700", marginRight: 4 },

  bolumBuyuk: { fontSize: 22, lineHeight: 30, fontWeight: "700", marginBottom: 12 },
  sekmeKutu: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4
  },
  sekmeKutuDikey: { flexDirection: "column" },
  sekme: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: OLCU.dokunma
  },
  sekmeDikey: { flex: 0, justifyContent: "flex-start", paddingHorizontal: 12 },
  sekmeMetin: { fontSize: 14 },
  grupAlt: { fontSize: 13.5, lineHeight: 20, marginTop: 10, marginBottom: 14 },

  izgara: { flexDirection: "row", flexWrap: "wrap" },
  hucre: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 14,
    minHeight: 120
  },
  hucreYatay: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72
  },
  hucreIkon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  hucreIkonYatay: { marginBottom: 0, marginRight: 12 },
  hucreAd: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  hucreOzet: { fontSize: 12.5, lineHeight: 18, marginTop: 3 },

  seritKutu: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: 1
  },
  serit: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  seritGun: { alignItems: "center", flex: 1, minHeight: OLCU.dokunma },
  nokta: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  seritHarf: { fontSize: 12, marginTop: 6 },
  bugunIsaret: { width: 4, height: 4, borderRadius: 2, marginTop: 3 }
});
