/* Sonuc ekrani. Dort blok, dordu de ayri etiketli:
 *
 *   AYET                  Kur'an metni, kaynagiyla
 *   KUR'AN'DAN BIR DUA    yine Kur'an metni, kaynagiyla
 *   KENDI SOZLERINLE      o duruma yazilmis Turkce dua — uygulamanin sozu
 *   NE YAPABILIRSIN       uc somut adim — yine uygulamanin sozu
 *
 * Etiketler bu ayrimi tasiyor: hangisinin kutsal metin, hangisinin
 * uygulamanin kendi cumlesi oldugu bakinca anlasilmali. Alt iki blogun
 * basligini degistirirken bunu koru — "Kendi sozlerinle" ve "Ne yapabilirsin"
 * kimseye ayet ya da hadis diye gorunmuyor, tam da bu yuzden secildiler.
 *
 * Kart yazi ekranindan geldiyse `kaynak` dolu gelir: hangi kelimelerin bu
 * hale isaret ettigi ve varsa yakin diger haller gosterilir. Eslestirme
 * kelimeye bakan basit bir yontem; nasil karar verdigini saklamak yerine
 * gostermek, yanildiginda kullanicinin duzeltebilmesini sagliyor. */
import React, { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

import AyetBloku from "../parcalar/AyetBloku";
import Dugme from "../parcalar/Dugme";
import Ikon from "../parcalar/Ikon";
import PaylasimKarti from "../parcalar/PaylasimKarti";
import { Degrade, YildizOrgusu } from "../parcalar/Desen";
import { CEVIRI_ADI, haliBul, paylasimMetni } from "../icerik";
import { OLCU, golge, saydam, useTema } from "../tema";

function Kaynak({ kaynak, onHalSec }) {
  const { renk } = useTema();
  if (!kaynak) return null;

  const kelimeler = (kaynak.eslesenler || []).slice(0, 4);

  return (
    <View style={[stil.kaynak, { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }]}>
      <View style={stil.kaynakUst}>
        <Ikon ad="create-outline" boyut={13} renk={renk.yaziSilik} />
        <Text style={[stil.kaynakBaslik, { color: renk.yaziSilik }]}>YAZDIKLARINDAN</Text>
      </View>
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
            {kaynak.digerler.map((hal) => {
              const tam = haliBul(hal.id);
              return (
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
                  {tam && tam.ikon ? (
                    <Ikon ad={tam.ikon} boyut={13} renk={tam.renk} style={{ marginRight: 5 }} />
                  ) : null}
                  <Text style={[stil.rozetMetin, { color: renk.yazi }]}>{hal.ad}</Text>
                </Pressable>
              );
            })}
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
  const { renk, yazi } = useTema();
  const gorselRef = useRef(null);
  const kaydirma = useRef(null);
  const [kopyalandi, setKopyalandi] = useState(false);

  if (!kart) return null;

  /* Eski kayitlarda tek bir "not" vardi; yeni yapida uc oneri ve bir de
   * "kendi sozlerinle" duasi var. Kaydedilmis eski kartlar acilmaya devam
   * etsin diye ikisi de esnek okunuyor. */
  const oneriler = kart.oneriler || (kart.not ? [kart.not] : []);
  const soz = kart.soz || null;
  const hal = haliBul(kart.halId);
  const ikon = hal && hal.ikon ? hal.ikon : "sparkles-outline";
  const gunun = kart.halId === "gunun";

  /* Gorsel paylasimi yalnizca cihazda calisiyor. Web'de ve resme cevirme
   * tutmazsa metin paylasimina dusuyor: sessizce hicbir sey yapmaktansa daha
   * az iyi olani yapmak dogru. */
  async function paylas() {
    if (Platform.OS !== "web") {
      try {
        const adres = await captureRef(gorselRef, {
          format: "png",
          quality: 1,
          width: 1080,
          height: 1350
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(adres, {
            mimeType: "image/png",
            dialogTitle: "Ayeti paylaş"
          });
          return;
        }
      } catch (hata) {
        /* Asagida metin paylasimina dusuyor. */
      }
    }
    onPaylas();
  }

  async function kopyala() {
    try {
      await Clipboard.setStringAsync(paylasimMetni(kart));
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch (hata) {
      /* Pano kapaliysa yapacak bir sey yok. */
    }
  }

  function yenile() {
    onYenile();
    if (kaydirma.current) kaydirma.current.scrollTo({ y: 0, animated: true });
  }

  return (
    <View style={{ flex: 1, backgroundColor: renk.zemin }}>
      {/* Paylasilacak gorsel ekranin disinda duruyor; yalnizca resme
          cevrilmek icin var. */}
      <View style={stil.gizli} pointerEvents="none">
        <PaylasimKarti grup={kart.ayetGrup} kartRef={gorselRef} />
      </View>

      <ScrollView
        ref={kaydirma}
        contentContainerStyle={stil.govde}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- baslik ---- */}
        <View style={stil.basUst}>
          <Degrade
            bas={kart.renk}
            son={renk.zemin}
            yon="dikey"
            basOpak={renk.koyu ? 0.32 : 0.22}
            sonOpak={0}
          />
          <YildizOrgusu renk={kart.renk} opaklik={renk.koyu ? 0.16 : 0.12} aralik={40} />

          <Pressable
            onPress={onGeri}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Geri"
            style={({ pressed }) => [
              stil.geri,
              { backgroundColor: renk.yuzey, borderColor: renk.cizgi, opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ikon ad="chevron-back" boyut={20} renk={renk.yazi} />
          </Pressable>

          <View style={stil.halSatir}>
            <View style={[stil.halIkon, { backgroundColor: saydam(kart.renk, 0.25), borderColor: saydam(kart.renk, 0.5) }]}>
              <Ikon ad={ikon} boyut={24} renk={renk.koyu ? "#FFFFFF" : kart.renk} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[stil.ustEtiket, { color: renk.yaziSolgun }]}>
                {gunun ? "BUGÜN İÇİN" : "HÂLİN"}
              </Text>
              <Text
                style={[
                  stil.halAdi,
                  { color: renk.yazi },
                  yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
                ]}
              >
                {kart.halAdi}
              </Text>
            </View>
          </View>
        </View>

        <View style={stil.icerik}>
          <Kaynak kaynak={kaynak} onHalSec={onHalSec} />

          <AyetBloku
            grup={kart.ayetGrup}
            etiket="AYET"
            arapcaGoster={ayarlar.arapcaGoster}
            okunusGoster={ayarlar.okunusGoster}
          />
          <AyetBloku
            grup={kart.duaGrup}
            etiket={gunun ? "BİR AYET DAHA" : "KUR'AN'DAN BİR DUA"}
            tur={gunun ? "ayet" : "dua"}
            arapcaGoster={ayarlar.arapcaGoster}
            okunusGoster={ayarlar.okunusGoster}
          />

          {soz ? (
            <View style={[stil.soz, golge(renk, 0.5), { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}>
              <Text
                style={[
                  stil.tirnak,
                  { color: saydam(kart.renk, 0.35) },
                  yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
                ]}
              >
                “
              </Text>
              <View style={stil.sozUst}>
                <Ikon ad="chatbubble-ellipses-outline" boyut={14} renk={renk.vurgu} />
                <Text style={[stil.sozBaslik, { color: renk.vurgu }]}>KENDİ SÖZLERİNLE</Text>
              </View>
              <Text
                style={[
                  stil.sozMetin,
                  { color: renk.yazi },
                  yazi.serifItalik ? { fontFamily: yazi.serifItalik, fontStyle: "normal" } : null
                ]}
              >
                {soz}
              </Text>
            </View>
          ) : null}

          {oneriler.length ? (
            <View style={[stil.oneri, { backgroundColor: renk.yuzeyIkincil, borderColor: renk.cizgi }]}>
              <View style={stil.sozUst}>
                <Ikon ad="footsteps-outline" boyut={14} renk={renk.yaziSilik} />
                <Text style={[stil.oneriBaslik, { color: renk.yaziSilik }]}>NE YAPABİLİRSİN</Text>
              </View>
              {oneriler.map((madde, sira) => (
                <View key={sira} style={stil.madde}>
                  <View style={[stil.sayi, { backgroundColor: saydam(kart.renk, 0.2) }]}>
                    <Text style={[stil.sayiMetin, { color: renk.koyu ? renk.yazi : kart.renk }]}>
                      {sira + 1}
                    </Text>
                  </View>
                  <Text style={[stil.maddeMetin, { color: renk.yazi }]}>{madde}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <Text style={[stil.meal, { color: renk.yaziSilik }]}>Meal: {CEVIRI_ADI}</Text>
        </View>
      </ScrollView>

      <View style={[stil.altBar, { backgroundColor: renk.zemin, borderTopColor: renk.cizgi }]}>
        {gunun ? (
          <Dugme metin="Hâlimi seç" onPress={onGeri} tur="cizgi" ikon="apps-outline" genis />
        ) : (
          <Dugme metin="Başka bir ayet" onPress={yenile} tur="dolu" ikon="refresh" genis />
        )}
        <View style={{ width: 10 }} />
        <Dugme
          tur="ikon"
          metin={favoriMi ? "Kayıtlardan çıkar" : "Kaydet"}
          ikon={favoriMi ? "bookmark" : "bookmark-outline"}
          secili={favoriMi}
          onPress={onFavori}
        />
        <View style={{ width: 8 }} />
        <Dugme tur="ikon" metin="Paylaş" ikon="share-social-outline" onPress={paylas} />
        <View style={{ width: 8 }} />
        <Dugme
          tur="ikon"
          metin={kopyalandi ? "Kopyalandı" : "Kopyala"}
          ikon={kopyalandi ? "checkmark" : "copy-outline"}
          onPress={kopyala}
        />
      </View>
    </View>
  );
}

const stil = StyleSheet.create({
  govde: { paddingBottom: 28 },
  gizli: { position: "absolute", top: -10000, left: 0 },

  basUst: {
    paddingHorizontal: OLCU.bosluk,
    paddingTop: OLCU.bosluk,
    paddingBottom: 26,
    overflow: "hidden"
  },
  geri: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18
  },
  halSatir: { flexDirection: "row", alignItems: "center" },
  halIkon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14
  },
  ustEtiket: { fontSize: 11, letterSpacing: 1.6, fontWeight: "700" },
  halAdi: { fontSize: 26, fontWeight: "700", marginTop: 2, lineHeight: 34 },

  icerik: { paddingHorizontal: OLCU.bosluk },

  kaynak: {
    borderWidth: 1,
    borderRadius: OLCU.yaricapKucuk,
    padding: 14,
    marginBottom: OLCU.bosluk
  },
  kaynakUst: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  kaynakBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    marginLeft: 6
  },
  kaynakMetin: { fontSize: 13, lineHeight: 20 },
  rozetler: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
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
  rozetMetin: { fontSize: 12.5, fontWeight: "600" },

  soz: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap + 2,
    padding: OLCU.bosluk + 4,
    marginBottom: OLCU.bosluk,
    overflow: "hidden"
  },
  tirnak: {
    position: "absolute",
    right: 16,
    top: -8,
    fontSize: 110,
    lineHeight: 130,
    fontWeight: "700"
  },
  sozUst: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sozBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    marginLeft: 6
  },
  sozMetin: { fontSize: 17, lineHeight: 29 },

  oneri: {
    borderWidth: 1,
    borderRadius: OLCU.yaricap + 2,
    padding: OLCU.bosluk + 4
  },
  oneriBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    marginLeft: 6
  },
  madde: { flexDirection: "row", marginTop: 4, marginBottom: 10 },
  sayi: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1
  },
  sayiMetin: { fontSize: 12, fontWeight: "700" },
  maddeMetin: { flex: 1, fontSize: 15, lineHeight: 24 },

  meal: { fontSize: 12, marginTop: 18, textAlign: "center" },
  altBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: OLCU.bosluk,
    paddingTop: 12,
    borderTopWidth: 1
  }
});
