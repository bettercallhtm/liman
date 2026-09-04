/* Ana ekran: "Bugun nasilsin?" — hal secimi, gunun ayeti ve son yedi gun. */
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { HALLER, gununAyeti, haliBul } from "../icerik";
import { bugununAnahtari } from "../depo";
import { OLCU, useTema } from "../tema";

function selamlama(saat) {
  if (saat < 5) return "Hayırlı geceler";
  if (saat < 11) return "Günaydın";
  if (saat < 18) return "İyi günler";
  return "İyi akşamlar";
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
      const halId = gunluk[anahtar];
      liste.push({
        anahtar,
        halId,
        harf: ["P", "P", "S", "Ç", "P", "C", "C"][tarih.getDay() === 0 ? 6 : tarih.getDay() - 1]
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

export default function Hal({ gunluk, onHalSec, onGununAyeti }) {
  const { renk } = useTema();
  const ayet = gununAyeti();
  const saat = new Date().getHours();

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[stil.selam, { color: renk.yaziSolgun }]}>{selamlama(saat)}</Text>
      <Text style={[stil.baslik, { color: renk.yazi }]}>Bugün nasılsın?</Text>
      <Text style={[stil.altBaslik, { color: renk.yaziSolgun }]}>
        Hâlini seç; sana o hâle dokunan bir ayet ve Kur'an'dan bir dua gelsin.
      </Text>

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
        <Text style={[stil.bolumBaslik, { color: renk.vurgu }]}>GÜNÜN AYETİ</Text>
        <Text style={[stil.gununMeal, { color: renk.yazi }]} numberOfLines={4}>
          {ayet.meal}
        </Text>
        <Text style={[stil.gununKaynak, { color: renk.yaziSilik }]}>
          {ayet.sureAdi} {ayet.sure}:{ayet.ayet}
        </Text>
      </Pressable>

      <View style={stil.izgara}>
        {HALLER.map((hal) => (
          <Pressable
            key={hal.id}
            onPress={() => onHalSec(hal.id)}
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
        ))}
      </View>

      <SonYediGun gunluk={gunluk} onGunSec={onHalSec} />
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: {
    padding: OLCU.bosluk,
    paddingBottom: 40
  },
  selam: {
    fontSize: 14,
    marginTop: 8
  },
  baslik: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4
  },
  altBaslik: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: OLCU.bosluk + 4
  },
  gunun: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    marginBottom: OLCU.bosluk + 8
  },
  gununMeal: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10
  },
  gununKaynak: {
    fontSize: 12,
    marginTop: 10
  },
  bolumBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "600"
  },
  izgara: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  hucre: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: 14,
    marginBottom: 11,
    minHeight: 96,
    overflow: "hidden"
  },
  serit4: {
    width: 26,
    height: 3,
    borderRadius: 2,
    marginBottom: 10
  },
  hucreAd: {
    fontSize: 15,
    fontWeight: "600"
  },
  hucreOzet: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  },
  seritKutu: {
    marginTop: 18
  },
  serit: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },
  seritGun: {
    alignItems: "center",
    flex: 1
  },
  nokta: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1
  },
  seritHarf: {
    fontSize: 11,
    marginTop: 6
  }
});
