/* Ana ekran: "Bugun nasilsin?" — yazma girisi, hal secimi, gunun ayeti ve
 * son yedi gun.
 *
 * Haller ikiye ayrilmis durumda. Hepsi tek listede oldugunda ekran bastan
 * asagi dert listesi gibi goruluyordu; uygulamayi ilk acan kisi icin bu
 * yanlis bir karsilama. Once "zorlaniyorum", sonra "iyi hissediyorum":
 * sikintidayken acan kisi arayacagi seyi ilk ekranda buluyor, iyi gunde acan
 * kisi de kendine yer buluyor. */
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const LOGO = require("../../assets/icon.png");

import { HALLER, gununAyeti, haliBul } from "../icerik";
import { bugununAnahtari } from "../depo";
import { OLCU, useTema } from "../tema";

function selamlama(saat) {
  if (saat < 5) return "Hayırlı geceler";
  if (saat < 11) return "Günaydın";
  if (saat < 18) return "İyi günler";
  return "İyi akşamlar";
}

function Hucre({ hal, onPress }) {
  const { renk } = useTema();
  return (
    <Pressable
      onPress={() => onPress(hal.id)}
      accessibilityRole="button"
      accessibilityLabel={hal.ad + ". " + hal.ozet}
      style={({ pressed }) => [
        stil.hucre,
        {
          backgroundColor: renk.yuzey,
          borderColor: pressed ? hal.renk : renk.cizgi,
          opacity: pressed ? 0.8 : 1
        }
      ]}
    >
      <View style={[stil.serit4, { backgroundColor: hal.renk }]} />
      <Text style={[stil.hucreAd, { color: renk.yazi }]}>{hal.ad}</Text>
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
        harf: ["P", "P", "S", "Ç", "P", "C", "C"][
          tarih.getDay() === 0 ? 6 : tarih.getDay() - 1
        ]
      });
    }
    return liste;
  }, [gunluk]);

  if (!Object.keys(gunluk).length) return null;

  return (
    <View style={stil.seritKutu}>
      <Text style={[stil.bolumBaslik, { color: renk.yaziSilik }]}>SON YEDİ GÜN</Text>
      <View style={stil.serit}>
        {gunler.map((gun) => {
          const hal = gun.halId ? haliBul(gun.halId) : null;
          return (
            <Pressable
              key={gun.anahtar}
              onPress={() => (hal ? onGunSec(hal.id) : null)}
              style={stil.seritGun}
            >
              <View
                style={[
                  stil.nokta,
                  {
                    backgroundColor: hal ? hal.renk : "transparent",
                    borderColor: hal ? hal.renk : renk.cizgi
                  }
                ]}
              />
              <Text style={[stil.seritHarf, { color: renk.yaziSilik }]}>{gun.harf}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Hal({ gunluk, onHalSec, onGununAyeti, onYaz }) {
  const { renk, koyuMu, tercihiDegistir } = useTema();
  const ayet = gununAyeti();
  const zor = HALLER.filter((h) => h.grup === "zor");
  const iyi = HALLER.filter((h) => h.grup === "iyi");

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      <View style={stil.ust}>
        <Image
          source={LOGO}
          style={[stil.logo, { borderColor: renk.cizgi }]}
          accessibilityLabel="Liman"
        />
        <Pressable
          onPress={() => tercihiDegistir(koyuMu ? "acik" : "koyu")}
          accessibilityRole="button"
          accessibilityLabel={koyuMu ? "Açık moda geç" : "Koyu moda geç"}
          style={({ pressed }) => [
            stil.temaDugme,
            {
              backgroundColor: renk.yuzey,
              borderColor: renk.cizgi,
              opacity: pressed ? 0.7 : 1
            }
          ]}
        >
          <Text style={[stil.temaIkon, { color: renk.vurgu }]}>
            {koyuMu ? "☀" : "☾"}
          </Text>
        </Pressable>
      </View>
      <Text style={[stil.selam, { color: renk.yaziSolgun }]}>
        {selamlama(new Date().getHours())}
      </Text>
      <Text style={[stil.baslik, { color: renk.yazi }]}>Bugün nasılsın?</Text>
      <View style={[stil.vurguCizgi, { backgroundColor: renk.vurgu }]} />

      <Pressable
        onPress={onYaz}
        style={({ pressed }) => [
          stil.yazGiris,
          {
            backgroundColor: renk.yuzey,
            borderColor: renk.vurgu,
            opacity: pressed ? 0.75 : 1
          }
        ]}
      >
        <Text style={[stil.yazBaslik, { color: renk.yazi }]}>
          Ne yaşadığını yaz
        </Text>
        <Text style={[stil.yazAlt, { color: renk.yaziSolgun }]}>
          Başından geçeni anlat, sana uyan ayeti ve duayı bulayım.
        </Text>
      </Pressable>

      <Pressable
        onPress={onGununAyeti}
        style={({ pressed }) => [
          stil.gunun,
          {
            backgroundColor: renk.vurguZemin,
            borderColor: renk.cizgi,
            opacity: pressed ? 0.7 : 1
          }
        ]}
      >
        <Text style={[stil.gununDekor, { color: renk.vurgu }]}>✦</Text>
        <View style={stil.gununUst}>
          <Text style={[stil.gununYildiz, { color: renk.vurgu }]}>✦</Text>
          <Text style={[stil.bolumBaslik, { color: renk.vurgu }]}>GÜNÜN AYETİ</Text>
        </View>
        <Text style={[stil.gununMeal, { color: renk.yazi }]} numberOfLines={4}>
          {ayet.meal}
        </Text>
        <Text style={[stil.gununKaynak, { color: renk.yaziSilik }]}>
          {ayet.sureAdi} {ayet.sure}:{ayet.ayet}
        </Text>
      </Pressable>

      <Text style={[stil.bolumBaslik, { color: renk.yaziSilik, marginBottom: 12 }]}>
        ZORLANIYORUM
      </Text>
      <View style={stil.izgara}>
        {zor.map((hal) => (
          <Hucre key={hal.id} hal={hal} onPress={onHalSec} />
        ))}
      </View>

      <Text
        style={[
          stil.bolumBaslik,
          { color: renk.yaziSilik, marginTop: 14, marginBottom: 12 }
        ]}
      >
        İYİ HİSSEDİYORUM
      </Text>
      <View style={stil.izgara}>
        {iyi.map((hal) => (
          <Hucre key={hal.id} hal={hal} onPress={onHalSec} />
        ))}
      </View>

      <SonYediGun gunluk={gunluk} onGunSec={onHalSec} />
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  ust: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 8
  },
  logo: { width: 104, height: 104, borderRadius: 24, borderWidth: 1 },
  temaDugme: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  temaIkon: { fontSize: 19 },
  selam: { fontSize: 14, marginTop: 12, textAlign: "center" },
  baslik: { fontSize: 28, fontWeight: "700", marginTop: 16 },
  vurguCizgi: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: OLCU.bosluk
  },
  yazGiris: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    marginBottom: 12
  },
  yazBaslik: { fontSize: 17, fontWeight: "700" },
  yazAlt: { fontSize: 13, lineHeight: 20, marginTop: 6 },
  gunun: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    marginBottom: OLCU.bosluk + 8,
    overflow: "hidden"
  },
  gununDekor: {
    position: "absolute",
    top: -18,
    right: -6,
    fontSize: 96,
    opacity: 0.08
  },
  gununUst: { flexDirection: "row", alignItems: "center" },
  gununYildiz: { fontSize: 11, marginRight: 6 },
  gununMeal: { fontSize: 15, lineHeight: 24, marginTop: 10 },
  gununKaynak: { fontSize: 12, marginTop: 10 },
  bolumBaslik: { fontSize: 11, letterSpacing: 1.6, fontWeight: "600" },
  izgara: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  hucre: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 14,
    marginBottom: 11,
    minHeight: 96,
    overflow: "hidden"
  },
  serit4: { width: 26, height: 3, borderRadius: 2, marginBottom: 10 },
  hucreAd: { fontSize: 15, fontWeight: "600" },
  hucreOzet: { fontSize: 12, lineHeight: 17, marginTop: 5 },
  seritKutu: { marginTop: 18 },
  serit: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  seritGun: { alignItems: "center", flex: 1 },
  nokta: { width: 20, height: 20, borderRadius: 10, borderWidth: 1 },
  seritHarf: { fontSize: 11, marginTop: 6 }
});
