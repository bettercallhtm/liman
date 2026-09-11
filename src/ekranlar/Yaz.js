/* Yazma ekrani: kisi basindan geceni ya da hissettigini yaziyor, uygulama
 * ona uyan hali bulup ayet ve dua getiriyor.
 *
 * Metin telefondan cikmiyor ve saklanmiyor — cozumleme `coz.js` icinde,
 * cihazin kendisinde yapiliyor. Ekrandan cikinca yazi da gidiyor. Bu, ekranin
 * altinda kullaniciya da yaziyor: en ozel cumlelerini yazacagi bir kutuda
 * bunu bilmeye hakki var. */
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
import { metniCoz } from "../coz";
import { HALLER } from "../icerik";
import { OLCU, useTema } from "../tema";

const ORNEKLER = [
  "Annem hastanede, yarın ameliyat olacak. Çok korkuyorum.",
  "İşten çıkarıldım, kirayı nasıl ödeyeceğimi bilmiyorum.",
  "Uzun zamandır beklediğim haber geldi, çok sevinçliyim."
];

export default function Yaz({ onSonuc, onRisk, onHalSec }) {
  const { renk } = useTema();
  const [metin, setMetin] = useState("");
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
        <Text style={[stil.baslik, { color: renk.yazi }]}>Ne yaşadığını yaz</Text>
        <Text style={[stil.altBaslik, { color: renk.yaziSolgun }]}>
          Başından geçeni ya da içinden geçeni yaz. Sana ona uyan bir ayet ve
          Kur'an'dan bir dua bulayım.
        </Text>

        <TextInput
          value={metin}
          onChangeText={(t) => {
            setMetin(t);
            if (bulunamadi) setBulunamadi(false);
          }}
          multiline
          textAlignVertical="top"
          placeholder="Bugün ne oldu? Nasıl hissediyorsun? İstediğin kadar yaz."
          placeholderTextColor={renk.yaziSilik}
          style={[
            stil.kutu,
            { backgroundColor: renk.yuzey, borderColor: renk.cizgi, color: renk.yazi }
          ]}
        />

        <View style={[stil.dugmeSatiri, { marginTop: OLCU.bosluk }]}>
          <Dugme
            metin="Bana bir dua bul"
            onPress={yeterli ? coz : () => {}}
            tur={yeterli ? "dolu" : "cizgi"}
            genis
          />
        </View>

        {bulunamadi ? (
          <View
            style={[
              stil.uyari,
              { backgroundColor: renk.yuzeyIkincil, borderLeftColor: renk.vurgu }
            ]}
          >
            <Text style={[stil.uyariBaslik, { color: renk.yazi }]}>
              Yazdıklarından bir hâl çıkaramadım.
            </Text>
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
                  style={[stil.rozet, { borderColor: renk.cizgi, backgroundColor: renk.yuzey }]}
                >
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
              <Pressable key={ornek} onPress={() => setMetin(ornek)}>
                <Text style={[stil.ornek, { color: renk.yaziSolgun }]}>“{ornek}”</Text>
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
  baslik: { fontSize: 26, fontWeight: "700", marginTop: 8 },
  altBaslik: { fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: OLCU.bosluk },
  kutu: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap,
    padding: OLCU.bosluk,
    minHeight: 170,
    fontSize: 16,
    lineHeight: 24
  },
  dugmeSatiri: { flexDirection: "row" },
  uyari: {
    borderLeftWidth: 3,
    borderRadius: OLCU.yaricapKucuk,
    padding: OLCU.bosluk,
    marginTop: OLCU.bosluk + 4
  },
  uyariBaslik: { fontSize: 15, fontWeight: "600" },
  uyariMetin: { fontSize: 14, lineHeight: 21, marginTop: 6 },
  rozetler: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  rozet: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
    marginRight: 8,
    marginBottom: 8
  },
  rozetMetin: { fontSize: 13, fontWeight: "600" },
  ornekKutu: { marginTop: 26 },
  ornekBaslik: { fontSize: 11, letterSpacing: 1.6, fontWeight: "600", marginBottom: 10 },
  ornek: { fontSize: 14, lineHeight: 22, marginBottom: 10 }
});
