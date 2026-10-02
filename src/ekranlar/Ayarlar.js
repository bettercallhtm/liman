/* Ayarlar: gunluk hatirlatici, kaynak bilgisi, gizlilik ve sinirlar. */
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import Ikon from "../parcalar/Ikon";
import { CEVIRI_ADI, KAYNAK_ADI } from "../icerik";
import { OLCU, YAZI, useTema, odakGorunur } from "../tema";
/* Surum numarasi tek yerden, app.json icinden: elle yazilan kopya bir
 * surumde guncellenmeyi unutuyordu. */
import { expo as UYGULAMA } from "../../app.json";

const SAATLER = [7, 9, 12, 15, 18, 21, 23];

/* Controls (switches, hours, call buttons) sit in a card; plain reading
 * text (`duz`) sits straight on the background under its label, so the
 * screen isn't a stack of identical boxes. */
function Bolum({ baslik, ikon, duz = false, children }) {
  const { renk } = useTema();
  return (
    <View style={stil.bolum}>
      <View style={stil.bolumUst}>
        {ikon ? <Ikon ad={ikon} boyut={14} renk={renk.vurgu} /> : null}
        <Text style={[YAZI.etiket, stil.bolumBaslik, { color: renk.yaziSilik }]}>{baslik}</Text>
      </View>
      <View
        style={
          duz
            ? stil.duz
            : [stil.kutu, { backgroundColor: renk.yuzey, borderColor: renk.cizgi }]
        }
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
        accessibilityLabel={baslik}
        trackColor={{ true: renk.vurgu, false: renk.cizgi }}
        thumbColor={renk.yuzeyIkincil}
        /* Web'de acik anahtarin topu varsayilan olarak yesil-mavi cikiyor;
         * bu ozellik yalnizca react-native-web'de var. */
        {...(Platform.OS === "web" ? { activeThumbColor: "#FFFFFF" } : null)}
      />
    </View>
  );
}

/* Outlined action with an icon. `tehlike` paints it in the warning colour
 * for actions that can't be undone. */
function Eylem({ metin, ikon, onPress, tehlike = false, genis = false }) {
  const { renk } = useTema();
  const renkler = tehlike ? renk.tehlike : renk.yazi;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={metin}
      style={({ pressed, hovered, focused }) => [
        stil.eylem,
        genis ? { flex: 1 } : { alignSelf: "stretch" },
        {
          borderColor: odakGorunur(focused)
            ? renk.vurgu
            : tehlike
              ? renk.tehlike
              : hovered
                ? renk.vurgu
                : renk.cizgi,
          borderWidth: odakGorunur(focused) ? 2 : 1,
          backgroundColor: hovered ? renk.yuzeyIkincil : "transparent",
          opacity: pressed ? 0.7 : 1
        }
      ]}
    >
      <Ikon ad={ikon} boyut={17} renk={tehlike ? renk.tehlike : renk.vurgu} />
      <Text style={[stil.eylemMetin, { color: renkler }]}>{metin}</Text>
    </Pressable>
  );
}

export default function Ayarlar({ ayarlar, onAyarDegis, bildirimVarMi }) {
  const { renk, yazi } = useTema();
  const { width, fontScale } = useWindowDimensions();
  /* The two call buttons share a row only while "112'yi ara" fits on one
   * line; with a large system font they stack instead of wrapping. */
  const aramaYeri = (Math.min(width, OLCU.enGenis) - OLCU.bosluk * 4 - 10) / 2;
  const aramaYanYana = aramaYeri >= 80 * Math.max(1, fontScale || 1) + 60;

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
              const etiket = String(saat).padStart(2, "0") + ":00";
              return (
                <Pressable
                  key={saat}
                  onPress={() => saatiDegistir(saat)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: secili }}
                  accessibilityLabel={etiket}
                  style={({ focused }) => [
                    stil.saat,
                    {
                      backgroundColor: secili ? renk.vurgu : renk.yuzeyIkincil,
                      borderColor: odakGorunur(focused) ? renk.yazi : secili ? renk.vurgu : renk.cizgi,
                      borderWidth: odakGorunur(focused) ? 2 : 1
                    }
                  ]}
                >
                  <Text
                    style={[
                      stil.saatMetin,
                      {
                        color: secili ? (renk.koyu ? "#14100A" : "#FFFFFF") : renk.yaziSolgun,
                        fontWeight: secili ? "700" : "600"
                      }
                    ]}
                  >
                    {etiket}
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

      <Bolum baslik="METİNLER NEREDEN GELİYOR" ikon="library-outline" duz>
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
        <Text style={[stil.kucuk, { color: renk.yaziSilik, marginTop: 10 }]}>
          Yazı tipleri: Amiri Quran (Amiri Quran Project Authors) ve Lora
          (Cyreal), SIL Open Font License 1.1. Simgeler: Ionicons (MIT).
        </Text>
      </Bolum>

      <Bolum baslik="ÖNEMLİ BİR NOT" ikon="information-circle-outline" duz>
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
        <View style={[stil.satirDugmeler, aramaYanYana ? null : { flexDirection: "column" }]}>
          <Eylem metin="112'yi ara" ikon="call-outline" onPress={() => Linking.openURL("tel:112")} genis={aramaYanYana} />
          <View style={aramaYanYana ? { width: 10 } : { height: 10 }} />
          <Eylem metin="183'ü ara" ikon="call-outline" onPress={() => Linking.openURL("tel:183")} genis={aramaYanYana} />
        </View>
      </Bolum>

      <Bolum baslik="GİZLİLİK" ikon="lock-closed-outline" duz>
        <Text style={[stil.paragraf, { color: renk.yazi }]}>
          Uygulama hesap açtırmaz, internete bağlanmaz ve hiçbir veri
          toplamaz. Kaydettiğin kartlar ve hangi gün hangi hâli seçtiğin
          yalnızca bu telefonda durur. Uygulamayı silersen hepsi silinir.
        </Text>
        {/* The only destructive action in the app: separated by a rule and
            drawn in the warning colour with a trash icon. */}
        <View style={[stil.silAlan, { borderTopColor: renk.cizgi }]}>
          <Eylem
            metin="Kayıtlarımı sil"
            ikon="trash-outline"
            tehlike
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
          />
        </View>
      </Bolum>

      <Text style={[stil.dipnot, { color: renk.yaziSilik }]}>
        Liman · Sürüm {UYGULAMA.version}
      </Text>
    </ScrollView>
  );
}

const stil = StyleSheet.create({
  govde: { padding: OLCU.bosluk, paddingBottom: 40 },
  baslik: { ...YAZI.ekranBaslik, marginTop: 8, marginBottom: 20 },
  bolum: { marginBottom: 26 },
  bolumUst: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  bolumBaslik: { marginLeft: 6 },
  kutu: { borderWidth: 1, borderRadius: OLCU.yaricap, padding: OLCU.bosluk },
  duz: { paddingHorizontal: 2 },
  satir: { flexDirection: "row", alignItems: "center", minHeight: OLCU.dokunma },
  satirBaslik: { fontSize: 15.5, fontWeight: "600" },
  satirAlt: { fontSize: 13.5, lineHeight: 19, marginTop: 3 },
  saatSerit: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14
  },
  saat: {
    minWidth: 64,
    minHeight: OLCU.dokunma,
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8
  },
  saatMetin: { fontSize: 14 },
  ayirac: { borderTopWidth: 1, marginVertical: 12 },
  paragraf: { fontSize: 14.5, lineHeight: 23 },
  kucuk: { fontSize: 13, lineHeight: 20 },
  satirDugmeler: { flexDirection: "row", marginTop: 14 },
  eylem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    minHeight: OLCU.dokunma,
    paddingHorizontal: 16
  },
  eylemMetin: { fontSize: 14.5, fontWeight: "600", marginLeft: 8 },
  silAlan: { borderTopWidth: 1, marginTop: 16, paddingTop: 16 },
  dipnot: { fontSize: 12.5, textAlign: "center", marginTop: 4 }
});
