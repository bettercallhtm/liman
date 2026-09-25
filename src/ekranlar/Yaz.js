/* Yazma ekrani: kisi basindan geceni ya da hissettigini yaziyor, uygulama
 * ona uyan hali bulup ayet ve dua getiriyor.
 *
 * Metin telefondan cikmiyor ve saklanmiyor — cozumleme `coz.js` icinde,
 * cihazin kendisinde yapiliyor. Ekrandan cikinca yazi da gidiyor. Bunun
 * aciklamasi Ayarlar'da; burada tekrar edilmiyor. */
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import Dugme from "../parcalar/Dugme";
import Ikon from "../parcalar/Ikon";
import { metniCoz } from "../coz";
import { HALLER } from "../icerik";
import { OLCU, golge, saydam, useTema } from "../tema";

const ORNEKLER = [
  "Annem hastanede, yarın ameliyat olacak. Çok korkuyorum.",
  "İşten çıkarıldım, kirayı nasıl ödeyeceğimi bilmiyorum.",
  "Gece oldu, hâlâ uyuyamıyorum, aklım durmuyor.",
  "Uzun zamandır beklediğim haber geldi, çok sevinçliyim."
];

export default function Yaz({ onSonuc, onRisk, onHalSec }) {
  const { renk, yazi } = useTema();
  const [metin, setMetin] = useState("");
  const [odak, setOdak] = useState(false);
  const [bulunamadi, setBulunamadi] = useState(false);

  const yeterli = metin.trim().length >= 3;

  function coz() {
    const sonuc = metniCoz(metin);
    if (sonuc.risk) {
      onRisk(sonuc);
      return;
    }
    if (sonuc.durum !== "bulundu") {
      setBulunamadi(true);
      return;
    }
    setBulunamadi(false);
    onSonuc(sonuc);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: renk.zemin }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={stil.govde}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[stil.rozetUst, { backgroundColor: renk.vurguZemin, borderColor: renk.vurguCizgi }]}>
          <Ikon ad="create-outline" boyut={14} renk={renk.vurgu} />
          <Text style={[stil.rozetUstMetin, { color: renk.vurgu }]}>İÇİNİ DÖK</Text>
        </View>
        <Text
          style={[
            stil.baslik,
            { color: renk.yazi },
            yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
          ]}
        >
          Ne yaşadığını yaz
        </Text>
        <Text style={[stil.altBaslik, { color: renk.yaziSolgun }]}>
          Başından geçeni ya da içinden geçeni yaz. Sana ona uyan bir ayet ve
          Kur'an'dan bir dua bulayım.
        </Text>

        <View
          style={[
            stil.kutuCerceve,
            golge(renk, 0.6),
            {
              backgroundColor: renk.yuzey,
              borderColor: odak ? renk.vurgu : renk.cizgi
            }
          ]}
        >
          <TextInput
            value={metin}
            onChangeText={(t) => {
              setMetin(t);
              if (bulunamadi) setBulunamadi(false);
            }}
            onFocus={() => setOdak(true)}
            onBlur={() => setOdak(false)}
            multiline
            textAlignVertical="top"
            placeholder="Bugün ne oldu? Nasıl hissediyorsun? İstediğin kadar yaz."
            placeholderTextColor={renk.yaziSilik}
            style={[
              stil.kutu,
              { color: renk.yazi },
              yazi.serif ? { fontFamily: yazi.serif } : null,
              Platform.OS === "web" ? { outlineStyle: "none" } : null
            ]}
          />
          <View style={[stil.kutuAlt, { borderTopColor: renk.cizgi }]}>
            <Text style={[stil.sayac, { color: renk.yaziSilik }]}>
              {metin.trim().length ? metin.trim().length + " karakter" : " "}
            </Text>
            {metin.length ? (
              <Pressable onPress={() => setMetin("")} hitSlop={8}>
                <Text style={[stil.temizle, { color: renk.yaziSilik }]}>Temizle</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={[stil.dugmeSatiri, { marginTop: OLCU.bosluk }]}>
          <Dugme
            metin="Bana bir ayet ve dua bul"
            ikon="search"
            onPress={coz}
            tur="dolu"
            pasif={!yeterli}
            genis
          />
        </View>

        {bulunamadi ? (
          <View
            style={[
              stil.uyari,
              { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }
            ]}
          >
            <View style={stil.uyariUst}>
              <Ikon ad="help-circle-outline" boyut={18} renk={renk.vurgu} />
              <Text style={[stil.uyariBaslik, { color: renk.yazi }]}>
                Yazdıklarından bir hâl çıkaramadım.
              </Text>
            </View>
            <Text style={[stil.uyariMetin, { color: renk.yaziSolgun }]}>
              Bu uygulama kelimelere bakıyor, cümleyi senin gibi anlamıyor.
              Başka türlü yazmayı deneyebilirsin ya da aşağıdan kendin
              seçebilirsin.
            </Text>
            <View style={stil.rozetler}>
              {HALLER.map((hal) => (
                <Pressable
                  key={hal.id}
                  onPress={() => onHalSec(hal.id)}
                  style={({ pressed }) => [
                    stil.rozet,
                    {
                      borderColor: renk.cizgi,
                      backgroundColor: renk.yuzey,
                      opacity: pressed ? 0.7 : 1
                    }
                  ]}
                >
                  <Ikon ad={hal.ikon} boyut={13} renk={hal.renk} style={{ marginRight: 5 }} />
                  <Text style={[stil.rozetMetin, { color: renk.yazi }]}>{hal.ad}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={stil.ornekKutu}>
            <Text style={[stil.ornekBaslik, { color: renk.yaziSilik }]}>
              ÖRNEK OLARAK
            </Text>
            {ORNEKLER.map((ornek) => (
              <Pressable
                key={ornek}
                onPress={() => setMetin(ornek)}
                style={({ pressed, hovered }) => [
                  stil.ornek,
                  {
                    backgroundColor: hovered ? renk.yuzey : saydam(renk.koyu ? "#FFFFFF" : "#000000", 0.025),
                    borderColor: renk.cizgi,
                    opacity: pressed ? 0.7 : 1
                  }
                ]}
              >
                <Ikon ad="chatbubble-outline" boyut={15} renk={renk.vurgu} style={{ marginTop: 3 }} />
                <Text
                  style={[
                    stil.ornekMetin,
                    { color: renk.yaziSolgun },
                    yazi.serifItalik ? { fontFamily: yazi.serifItalik } : { fontStyle: "italic" }
                  ]}
                >
                  {ornek}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  rozetUst: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 11,
    marginTop: 8
  },
  rozetUstMetin: { fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginLeft: 6 },
  baslik: { fontSize: 28, fontWeight: "700", marginTop: 14, lineHeight: 36 },
  altBaslik: { fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 20 },
  kutuCerceve: {
    borderWidth: 1.5,
    borderRadius: OLCU.yaricap,
    overflow: "hidden"
  },
  kutu: {
    padding: OLCU.bosluk,
    minHeight: 190,
    fontSize: 17,
    lineHeight: 27
  },
  kutuAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: OLCU.bosluk,
    paddingVertical: 10
  },
  sayac: { fontSize: 12 },
  temizle: { fontSize: 12.5, fontWeight: "600" },
  dugmeSatiri: { flexDirection: "row" },
  uyari: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    marginTop: OLCU.bosluk + 4
  },
  uyariUst: { flexDirection: "row", alignItems: "center" },
  uyariBaslik: { fontSize: 15, fontWeight: "700", marginLeft: 8, flexShrink: 1 },
  uyariMetin: { fontSize: 14, lineHeight: 21, marginTop: 8 },
  rozetler: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  rozet: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  rozetMetin: { fontSize: 13, fontWeight: "600" },
  ornekKutu: { marginTop: 28 },
  ornekBaslik: { fontSize: 11, letterSpacing: 1.6, fontWeight: "700", marginBottom: 12 },
  ornek: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: OLCU.yaricapKucuk,
    padding: 14,
    marginBottom: 10
  },
  ornekMetin: { flex: 1, fontSize: 14.5, lineHeight: 22, marginLeft: 10 }
});
