/* Sonuc ekrani: secilen hale gelen ayet, Kur'an'dan bir dua ve uygulamanin
 * kendi notu.
 *
 * Notun kutusu bilerek ayrik duruyor ve altinda "ayet ya da hadis degildir"
 * yaziyor. Uygulamanin yazdigi bir cumlenin kutsal metinle ayni gorunmesi
 * kabul edilebilir bir sey degil; bu ayrim tasarimin sus kismi degil, sarti.
 *
 * Kart yazi ekranindan geldiyse `kaynak` dolu gelir: hangi kelimelerin bu
 * hale isaret ettigi ve varsa yakin diger haller gosterilir. Eslestirme
 * kelimeye bakan basit bir yontem; nasil karar verdigini saklamak yerine
 * gostermek, yanildiginda kullanicinin duzeltebilmesini sagliyor. */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import AyetBloku from "../parcalar/AyetBloku";
import Dugme from "../parcalar/Dugme";
import { CEVIRI_ADI } from "../icerik";
import { OLCU, useTema } from "../tema";

function Kaynak({ kaynak, onHalSec }) {
  const { renk } = useTema();
  if (!kaynak) return null;

  const kelimeler = (kaynak.eslesenler || []).slice(0, 4);

  return (
    <View style={[stil.kaynak, { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }]}>
      <Text style={[stil.kaynakBaslik, { color: renk.yaziSilik }]}>
        YAZDIKLARINDAN
      </Text>
      {kelimeler.length ? (
        <Text style={[stil.kaynakMetin, { color: renk.yaziSolgun }]}>
          Bu hâle işaret eden kelimeler: {kelimeler.map((k) => "“" + k + "”").join(", ")}
        </Text>
      ) : null}

      {kaynak.digerler && kaynak.digerler.length ? (
        <>
          <Text style={[stil.kaynakMetin, { color: renk.yaziSolgun, marginTop: 10 }]}>
            Yanıldıysam buradan değiştir:
          </Text>
          <View style={stil.rozetler}>
            {kaynak.digerler.map((hal) => (
              <Pressable
                key={hal.id}
                onPress={() => onHalSec(hal.id)}
                style={[stil.rozet, { borderColor: renk.cizgi, backgroundColor: renk.yuzey }]}
              >
                <Text style={[stil.rozetMetin, { color: renk.yazi }]}>{hal.ad}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

export default function Kart({
  kart,
  ayarlar,
  kaynak,
  favoriMi,
  onFavori,
  onYenile,
  onPaylas,
  onHalSec,
  onGeri
}) {
  const { renk } = useTema();
  if (!kart) return null;

  return (
    <View style={{ flex: 1, backgroundColor: renk.zemin }}>
      <ScrollView
        contentContainerStyle={stil.govde}
        showsVerticalScrollIndicator={false}
      >
        <View style={stil.ust}>
          <View style={[stil.serit4, { backgroundColor: kart.renk }]} />
          <Text style={[stil.halAdi, { color: renk.yaziSolgun }]}>{kart.halAdi}</Text>
        </View>

        <Kaynak kaynak={kaynak} onHalSec={onHalSec} />

        <AyetBloku
          grup={kart.ayetGrup}
          etiket="AYET"
          arapcaGoster={ayarlar.arapcaGoster}
          okunusGoster={ayarlar.okunusGoster}
        />
        <AyetBloku
          grup={kart.duaGrup}
          etiket="KUR'AN'DAN BİR DUA"
          arapcaGoster={ayarlar.arapcaGoster}
          okunusGoster={ayarlar.okunusGoster}
        />

        <View
          style={[
            stil.not,
            { backgroundColor: renk.yuzeyIkincil, borderLeftColor: kart.renk }
          ]}
        >
          <Text style={[stil.notBaslik, { color: renk.yaziSilik }]}>
            KENDİNE HATIRLAT
          </Text>
          <Text style={[stil.notMetin, { color: renk.yazi }]}>{kart.not}</Text>
          <Text style={[stil.notUyari, { color: renk.yaziSilik }]}>
            Bu cümle uygulamanın kendi notudur; ayet ya da hadis değildir.
          </Text>
        </View>

        <Text style={[stil.meal, { color: renk.yaziSilik }]}>
          Meal: {CEVIRI_ADI}
        </Text>
      </ScrollView>

      <View style={[stil.altBar, { backgroundColor: renk.zemin, borderTopColor: renk.cizgi }]}>
        <View style={stil.satir}>
          <Dugme metin="Başka bir ayet" onPress={onYenile} genis />
          <View style={{ width: 10 }} />
          <Dugme
            metin={favoriMi ? "Kaydedildi" : "Kaydet"}
            onPress={onFavori}
            tur={favoriMi ? "dolu" : "cizgi"}
            genis
          />
        </View>
        <View style={[stil.satir, { marginTop: 10 }]}>
          <Dugme metin="Paylaş" onPress={onPaylas} tur="duz" genis />
          <View style={{ width: 10 }} />
          <Dugme metin="Geri" onPress={onGeri} tur="duz" genis />
        </View>
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 24 },
  ust: { marginBottom: OLCU.bosluk, marginTop: 4 },
  serit4: { width: 30, height: 3, borderRadius: 2, marginBottom: 8 },
  halAdi: { fontSize: 14, fontWeight: "600" },
  kaynak: {
    borderWidth: 1,
    borderRadius: OLCU.yaricapKucuk,
    padding: 14,
    marginBottom: OLCU.bosluk
  },
  kaynakBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "600",
    marginBottom: 8
  },
  kaynakMetin: { fontSize: 13, lineHeight: 20 },
  rozetler: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  rozet: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  rozetMetin: { fontSize: 12, fontWeight: "600" },
  not: {
    borderLeftWidth: 3,
    borderRadius: OLCU.yaricapKucuk,
    padding: OLCU.bosluk
  },
  notBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "600",
    marginBottom: 8
  },
  notMetin: { fontSize: 15, lineHeight: 24 },
  notUyari: { fontSize: 11, lineHeight: 16, marginTop: 10 },
  meal: { fontSize: 12, marginTop: 16, textAlign: "center" },
  altBar: { padding: OLCU.bosluk, paddingTop: 12, borderTopWidth: 1 },
  satir: { flexDirection: "row" }
});
