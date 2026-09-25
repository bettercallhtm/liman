/* Ayarlar: gunluk hatirlatici, kaynak bilgisi, gizlilik ve sinirlar. */
import React from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";

import Ikon from "../parcalar/Ikon";
import { CEVIRI_ADI, KAYNAK_ADI } from "../icerik";
import { OLCU, useTema } from "../tema";
/* Surum numarasi tek yerden, app.json icinden: elle yazilan kopya bir
 * surumde guncellenmeyi unutuyordu. */
import { expo as UYGULAMA } from "../../app.json";

const SAATLER = [7, 9, 12, 15, 18, 21, 23];

function Bolum({ baslik, ikon, children }) {
  const { renk } = useTema();
  return (
    <View style={stil.bolum}>
      <View style={stil.bolumUst}>
        {ikon ? <Ikon ad={ikon} boyut={14} renk={renk.vurgu} /> : null}
        <Text style={[stil.bolumBaslik, { color: renk.yaziSilik }]}>{baslik}</Text>
      </View>
      <View
        style={[stil.kutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]}
      >
        {children}
      </View>
    </View>
  );
}

/* Basligi, aciklamasi ve anahtari olan satir. Uc yerde ayni sekilde
 * kullaniliyor. */
function AnahtarSatir({ baslik, alt, deger, onDegis, kapali = false }) {
  const { renk } = useTema();
  return (
    <View style={stil.satir}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[stil.satirBaslik, { color: renk.yazi }]}>{baslik}</Text>
        <Text style={[stil.satirAlt, { color: renk.yaziSolgun }]}>{alt}</Text>
      </View>
      <Switch
        value={deger}
        disabled={kapali}
        onValueChange={onDegis}
        trackColor={{ true: renk.vurgu, false: renk.cizgi }}
        thumbColor={renk.yuzeyIkincil}
      />
    </View>
  );
}

export default function Ayarlar({ ayarlar, onAyarDegis, bildirimVarMi }) {
  const { renk, yazi } = useTema();

  function saatiDegistir(saat) {
    onAyarDegis({ ...ayarlar, hatirlaticiSaat: saat, hatirlaticiDakika: 0 });
  }

  return (
    <ScrollView
      style={{ backgroundColor: renk.zemin }}
      contentContainerStyle={stil.govde}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          stil.baslik,
          { color: renk.yazi },
          yazi.serifKalin ? { fontFamily: yazi.serifKalin, fontWeight: "normal" } : null
        ]}
      >
        Ayarlar
      </Text>

      <Bolum baslik="GÜNLÜK HATIRLATICI" ikon="notifications-outline">
        <AnahtarSatir
          baslik="Her gün hatırlat"
          alt={
            bildirimVarMi
              ? "Seçtiğin saatte tek bir bildirim gelir."
              : "Bu sürümde bildirim kurulamıyor."
          }
          deger={ayarlar.hatirlaticiAcik}
          kapali={!bildirimVarMi}
          onDegis={(deger) => onAyarDegis({ ...ayarlar, hatirlaticiAcik: deger })}
        />

        {ayarlar.hatirlaticiAcik ? (
          <View style={[stil.saatSerit, { borderTopColor: renk.cizgi }]}>
            {SAATLER.map((saat) => {
              const secili = ayarlar.hatirlaticiSaat === saat;
              return (
                <Pressable
                  key={saat}
                  onPress={() => saatiDegistir(saat)}
                  style={[
                    stil.saat,
                    {
                      backgroundColor: secili ? renk.vurgu : renk.yuzeyIkincil,
                      borderColor: secili ? renk.vurgu : renk.cizgi
                    }
                  ]}
                >
                  <Text
                    style={[
                      stil.saatMetin,
                      { color: secili ? "#14100A" : renk.yaziSolgun }
                    ]}
                  >
                    {String(saat).padStart(2, "0")}:00
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </Bolum>

      <Bolum baslik="OKUMA" ikon="book-outline">
        <AnahtarSatir
          baslik="Arapça metni göster"
          alt="Kapatırsan kartlarda yalnızca meal kalır."
          deger={ayarlar.arapcaGoster}
          onDegis={(deger) => onAyarDegis({ ...ayarlar, arapcaGoster: deger })}
        />
        <View style={[stil.ayirac, { borderTopColor: renk.cizgi }]} />
        <AnahtarSatir
          baslik="Okunuşu göster"
          alt="Arapça metnin Latin harfleriyle yazılışı."
          deger={ayarlar.okunusGoster}
          onDegis={(deger) => onAyarDegis({ ...ayarlar, okunusGoster: deger })}
        />
      </Bolum>

      <Bolum baslik="METİNLER NEREDEN GELİYOR" ikon="library-outline">
        <Text style={[stil.paragraf, { color: renk.yazi }]}>
          Arapça metin Kur'an-ı Kerim'in Osmanî hattıyla yazılmış hâlidir.
          Türkçe meal {CEVIRI_ADI}'a aittir. Okunuşlar Muhammet Abay
          çeviriyazısıdır. Derleme kaynağı: {KAYNAK_ADI}.
        </Text>
        <Text style={[stil.paragraf, { color: renk.yaziSolgun, marginTop: 10 }]}>
          Uygulamadaki hiçbir ayet ya da dua metni bu uygulama tarafından
          yazılmadı; hepsi kaynağından olduğu gibi alındı. Uygulamadaki dualar
          Kur'an'ın kendi dualarıdır.
        </Text>
        <Text style={[stil.paragraf, { color: renk.yaziSilik, marginTop: 10 }]}>
          Yazı tipleri: Amiri Quran (Amiri Quran Project Authors) ve Lora
          (Cyreal), SIL Open Font License 1.1. Simgeler: Ionicons (MIT).
        </Text>
      </Bolum>

      <Bolum baslik="ÖNEMLİ BİR NOT" ikon="information-circle-outline">
        <Text style={[stil.paragraf, { color: renk.yazi }]}>
          Bu uygulama dinî danışmanlık ya da fetva vermez. Ayet seçimleri
          kişisel bir derlemedir; bir ayetin bağlamını ve tefsirini öğrenmek
          için güvenilir bir kaynağa ya da bir din görevlisine başvurun.
        </Text>
        <Text style={[stil.paragraf, { color: renk.yazi, marginTop: 10 }]}>
          Bu uygulama tıbbi ya da psikolojik tedavi değildir, tedavinin yerine
          de geçmez.
        </Text>
      </Bolum>

      <Bolum baslik="ZOR BİR ANDAYSAN" ikon="call-outline">
        <Text style={[stil.paragraf, { color: renk.yazi }]}>
          Kendine zarar vermeyi düşünüyorsan lütfen bir uygulamayla baş başa
          kalma. Acil durumda 112'yi ara. Sosyal destek için 183 Sosyal Destek
          Hattı 7/24 açık ve ücretsiz.
        </Text>
        <View style={stil.satirDugmeler}>
          <Pressable
            onPress={() => Linking.openURL("tel:112")}
            style={[stil.acilDugme, { borderColor: renk.cizgi }]}
          >
            <Text style={[stil.acilMetin, { color: renk.yazi }]}>112'yi ara</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL("tel:183")}
            style={[stil.acilDugme, { borderColor: renk.cizgi }]}
          >
            <Text style={[stil.acilMetin, { color: renk.yazi }]}>183'ü ara</Text>
          </Pressable>
        </View>
      </Bolum>

      <Bolum baslik="GİZLİLİK" ikon="lock-closed-outline">
        <Text style={[stil.paragraf, { color: renk.yazi }]}>
          Uygulama hesap açtırmaz, internete bağlanmaz ve hiçbir veri
          toplamaz. Kaydettiğin kartlar ve hangi gün hangi hâli seçtiğin
          yalnızca bu telefonda durur. Uygulamayı silersen hepsi silinir.
        </Text>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Kayıtları sil",
              "Kaydettiğin kartlar ve günlük kaydı silinecek. Bu işlem geri alınamaz.",
              [
                { text: "Vazgeç", style: "cancel" },
                {
                  text: "Sil",
                  style: "destructive",
                  onPress: () => onAyarDegis({ ...ayarlar, __hepsiniSil: true })
                }
              ]
            )
          }
          style={[stil.acilDugme, { borderColor: renk.cizgi, marginTop: 14 }]}
        >
          <Text style={[stil.acilMetin, { color: renk.yazi }]}>
            Kayıtlarımı sil
          </Text>
        </Pressable>
      </Bolum>

      <Text style={[stil.dipnot, { color: renk.yaziSilik }]}>
        Liman · Sürüm {UYGULAMA.version}
      </Text>
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  baslik: { fontSize: 28, fontWeight: "700", marginTop: 8, marginBottom: 20 },
  bolum: { marginBottom: 22 },
  bolumUst: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  bolumBaslik: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    marginLeft: 6
  },
  kutu: { borderWidth: 1, borderRadius: OLCU.yaricap, padding: OLCU.bosluk },
  satir: { flexDirection: "row", alignItems: "center" },
  satirBaslik: { fontSize: 15, fontWeight: "600" },
  satirAlt: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  saatSerit: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14
  },
  saat: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  saatMetin: { fontSize: 13, fontWeight: "600" },
  ayirac: { borderTopWidth: 1, marginVertical: 14 },
  paragraf: { fontSize: 14, lineHeight: 22 },
  satirDugmeler: { flexDirection: "row", marginTop: 14 },
  acilDugme: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10
  },
  acilMetin: { fontSize: 14, fontWeight: "600" },
  dipnot: { fontSize: 12, textAlign: "center", marginTop: 8 }
});
