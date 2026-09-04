/* KELIME SOZLUGU — yazilan metni bir hale baglamak icin.
 *
 * Bu sozluk telefonda calisiyor. Kullanicinin yazdigi metin hicbir yere
 * gonderilmiyor, hicbir yere kaydedilmiyor. Insanlarin en ozel seylerini
 * yazdigi bir kutuda bunun boyle olmasi bu uygulamanin en onemli ozelligi —
 * bulut tarafinda bir "daha iyi eslestirme" fikri gelirse once bunu tartisin.
 *
 * BICIM: her madde ya duz bir kelime koku ya da "kok|agirlik".
 *
 * - Bosluk iceren madde ("olmek istiyorum") metnin icinde aynen aranir.
 * - Bosluksuz madde kelime BASI olarak aranir: "uzul" maddesi "uzuldum",
 *   "uzulüyorum", "uzulmus" hepsini yakalar. Turkce sondan eklemeli oldugu
 *   icin kok + onek aramasi burada govde analizinden cok daha ucuz ve yeterli.
 * - Agirlik yazilmazsa 1. Belirleyici kelimelere 3 verildi: "annem oldu cok
 *   uzgunum" cumlesinde hem yas hem uzuntu eslesiyor; yas kazanmali.
 *
 * Metin de sozluk de ayni sekilde sadelestiriliyor (kucuk harf, Turkce
 * harfler ASCII'ye): kullanicilarin cogu "uzgunum" diye yaziyor, "üzgünüm"
 * diye degil. Ikisi de tutmali.
 */

export const SOZLUK = {
  /* ---- zor haller ---- */

  kaygi: [
    "kaygi|3", "kaygilan|3", "endise|3", "anksiyete|3", "panik atak|3",
    "panik", "tedirgin", "gergin", "stres", "huzursuz", "vesvese", "kuruntu",
    "takinti", "icim daral|3", "icim sikis", "nefes alamiyorum|3",
    "kalbim carpiyor|3", "elim ayagim titri", "kotu bir sey olacak|3",
    "basima bir sey gelecek|3", "surekli dusunuyorum", "kafamda kuruyorum",
    "uyuyamiyorum"
  ],

  uzuntu: [
    "uzgun|3", "uzul|3", "uzuntu|3", "huzun|3", "keder|3", "mutsuz|3",
    "agliyorum|3", "aglad", "gozyasi", "moralim bozuk|3", "moralsiz",
    "bunal", "coktum", "cokkun", "kirgin", "icim buruk", "buruk",
    "canim sikkin", "berbat hissed", "kotu hissed", "ici bos", "bosluk",
    "aglamak istiyorum|3", "canim yaniyor|3", "kalbim kirildi|3"
  ],

  korku: [
    "korku|3", "korkuyorum|3", "korkt|3", "urk", "dehset", "fobi",
    "cekiniyorum", "gozum kesmiyor", "tehdit", "tehlike", "basima gelecek",
    "kabus", "karanlik"
  ],

  ofke: [
    "ofke|3", "ofkeli|3", "sinirli|3", "sinirlen|3", "kizgin|3", "kizd|3",
    "nefret|3", "kin|3", "delir", "cildir", "kudur", "tepem att",
    "bagird", "kufret", "hinc", "intikam", "cok sinir oldum|3",
    "kavga ettim|3", "tartist"
  ],

  yalnizlik: [
    "yalniz|3", "yanliz|3", "kimsesiz|3", "terk|3", "terkedil|3",
    "issiz", "sahipsiz", "kimse yok|3", "kimsem yok|3", "arkadasim yok|3",
    "dislan", "unutul", "gormezden gel", "kimse anlamiyor|3",
    "tek basima|3", "ayrildik"
  ],

  pismanlik: [
    "pisman|3", "keske|3", "gunah|3", "vicdan|3", "suclu hissed|3",
    "sucluluk|3", "utanc", "utaniyorum", "mahcup", "rezil", "tovbe|3",
    "yanlis yaptim|3", "hata yaptim|3", "kendimi affedemi|3", "bagislat"
  ],

  umutsuzluk: [
    "umutsuz|3", "umidim yok|3", "umudum kalmadi|3", "caresiz|3",
    "tukendim|3", "pes ettim|3", "bitti artik|3", "dayanamiyorum|3",
    "yoruldum artik|3", "anlamsiz", "duzelmeyecek|3", "hicbir sey degismiyor|3",
    "bosuna", "yorgunum", "cikis yok|3", "isik gorm"
  ],

  hastalik: [
    "hasta|3", "hastalik|3", "agriyor|3", "agri", "sanci", "ameliyat|3",
    "hastane|3", "doktor", "tedavi", "kemoterapi|3", "kanser|3", "tumor|3",
    "tahlil", "rapor cikti", "iyilesm", "halsiz", "atesim var", "ilac"
  ],

  yas: [
    "oldu|5", "olum|5", "vefat|5", "kaybettim|5", "cenaze|5", "mezar|5",
    "rahmetli|5", "merhum|5", "defnet|5", "taziye|5", "topraga verdik|5",
    "yas tut|5", "basimiz sagolsun|5", "kaybinin", "ardindan", "artik yok",
    "annemi kaybettim|5", "babami kaybettim|5", "kirkini|5", "mevlit|3"
  ],

  bekleyis: [
    "bekliyorum|3", "bekleyis|3", "sonuc bekli|3", "cevap bekli|3",
    "ne zaman olacak|3", "gecikti", "uzadi", "surunc", "sabrim tuken|3",
    "sabred", "hala belli degil|3", "belirsiz"
  ],

  kararsizlik: [
    "kararsiz|3", "karar veremi|3", "ikilem|3", "hangisini secece|3",
    "ne yapacagimi bilmiyorum|3", "emin degilim|3", "teredd", "istihare|3",
    "iki yol", "dogru mu yapiyorum|3"
  ],

  sinav: [
    "sinav|3", "imtihan|3", "yks|3", "kpss|3", "ales|3", "yds|3", "tyt|3",
    "ayt|3", "final|3", "vize|3", "tez|3", "odev", "ders calis|3",
    "universite", "okul", "mulakat|3", "is gorusmesi|3", "patron",
    "mesai", "teslim tarihi|3", "yetistiremiyorum|3", "is yogun",
    "yogunlugum", "isten", "kariyer", "sinavim var|3", "sinava girece|3"
  ],

  haksizlik: [
    "haksizlik|3", "haksiz|3", "adaletsiz|3", "zulum|3", "zulmet",
    "iftira|3", "dedikodu|3", "arkamdan konus|3", "kandir|3", "aldat|3",
    "dolandir|3", "hakkimi|3", "magdur|3", "kul hakki|3", "suclad",
    "yalan soyled", "hak etmedigim"
  ],

  rizik: [
    "borc|3", "para|3", "maas|3", "kira|3", "fatura|3", "gecim|3",
    "iflas|3", "issiz|3", "isten cikar|3", "isten atil|3", "maddi|3",
    "kredi|3", "taksit|3", "icra|3", "zam", "pahali", "yoksul",
    "param yok|3", "gecinemi|3", "ekonomik"
  ],

  /* ---- iyi haller ---- */

  sukur: [
    "sukur|3", "sukred|3", "minnet|3", "elhamdulillah|3", "hamd",
    "nimet|3", "musteşekkir", "tesekkur ederim", "iyi ki"
  ],

  sevinc: [
    "sevincli|3", "sevindim|3", "cok mutluyum|3", "mutluyum|3", "mujde|3",
    "kazandim|3", "basardim|3", "gectim|3", "kabul edildi|3",
    "ise girdim|3", "iyi haber|3", "harika", "muhtesem", "guzel haber|3",
    "sevindirici", "hamile|3", "dogdu|3"
  ],

  huzur: [
    "sakinles|3", "huzur|3", "dinlenmek|3", "kafami bosalt|3",
    "sessizlik|3", "nefes almak", "ferahla", "rahatla", "durulmak|3",
    "yavaslamak"
  ],

  "yeni-baslangic": [
    "yeni is|3", "yeni ev|3", "tasin|3", "basliyorum|3", "yeni baslangic|3",
    "ilk gun|3", "evlen|3", "nisan|3", "dugun|3", "mezun|3",
    "dukkan act|3", "isyeri act|3", "yeni bir sayfa|3", "yeni bir hayat|3"
  ],

  sevdiklerim: [
    "annem", "babam", "esim", "kocam", "karim", "cocugum",
    "kizim", "oglum", "kardesim", "ailem", "dostum", "arkadasim",
    "sevdigim", "nisanlim", "torunum",
    "icin dua|3", "onun icin dua|5", "onlar icin dua|5", "dua eder misin|3"
  ],

  yolculuk: [
    "yolculuk|3", "yola cik|3", "seyahat|3", "sefer|3", "ucak|3",
    "otobus|3", "tren|3", "gurbet|3", "umre|3", "hacca|3", "tatil",
    "tasiniyorum|3", "yurt disi|3"
  ],

  affetme: [
    "affetmek|3", "affed|3", "bagislamak|3", "barismak|3", "helalles|3",
    "kus|3", "dargin|3", "konusmuyoruz|3", "kirdim", "ozur dile|3",
    "arayi duzelt|3"
  ],

  dilek: [
    "dilegim|3", "dua etmek istiyorum|3", "nasip|3", "kismet|3",
    "hayirlisi|3", "olsun diye|3", "istiyorum ki", "kavusmak|3",
    "hayirli olsun"
  ]
};

/* KENDINE ZARAR ISARETLERI.
 *
 * Bunlar bir hale puan vermiyor; yakalandiginda uygulama once yardim
 * ekranini aciyor. Yanlis alarm vermek, kaciran bir sistemden iyidir —
 * bu yuzden liste genis tutuldu ve ekran suclayici degil.
 */
export const RISK = [
  "intihar",
  "olmek istiyorum",
  "olsem",
  "olseydim",
  "yasamak istemiyorum",
  "yasamak istemiyor",
  "kendimi oldur",
  "canima kiy",
  "kendime zarar",
  "bilegimi",
  "yok olmak istiyorum",
  "hayatima son",
  "artik yasamak",
  "uyanmak istemiyorum",
  "kimseye faydam yok",
  "olsem daha iyi",
  "bitirmek istiyorum her seyi",
  "dayanacak gucum kalmadi"
];
