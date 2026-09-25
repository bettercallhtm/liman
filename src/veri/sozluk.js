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
    "icim gitti|3", "kotu seyler geliyor aklima|3",
    "kotuye gidiyor|3", "basedemiyorum|3"
  ],

  uzuntu: [
    "uzgun|3", "uzul|3", "uzuntu|3", "huzun|3", "keder|3", "mutsuz|3",
    "agliyorum|3", "aglad", "gozyasi", "moralim bozuk|3", "moralsiz",
    "bunal", "coktum", "cokkun", "kirgin", "icim buruk", "buruk",
    "canim sikkin", "berbat hissed", "kotu hissed", "ici bos", "bosluk",
    "aglamak istiyorum|3", "canim yaniyor|3", "kalbim kirildi|3",
    "icim kan agliyor|3", "hicbir seyden zevk alm|3", "keyfim yok|3"
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
    "pes ettim|3", "bitti artik|3", "dayanamiyorum|3",
    "yoruldum artik|3", "anlamsiz", "duzelmeyecek|3", "hicbir sey degismiyor|3",
    "bosuna", "cikis yok|3", "isik gorm"
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
    "kredi|3", "taksit|3", "icra|3", "zam geld", "zamlar", "zam yap", "pahali", "yoksul",
    "param yok|3", "gecinemi|3", "ekonomik", "harclik|3", "burs|3",
    "ay sonunu getiremi|5", "senet|3", "haciz|5"
  ],

  /* ---- iyi haller ---- */

  sukur: [
    "sukur|3", "sukred|3", "minnet|3", "elhamdulillah|3", "hamd",
    "nimet|3", "musteşekkir", "tesekkur ederim", "iyi ki"
  ],

  sevinc: [
    "sevincli|3", "sevindim|3", "cok mutluyum|3", "mutluyum|3", "mujde|3",
    "kazandim|3", "gectim|3", "kabul edildi|3",
    "ise girdim|3", "iyi haber|3", "harika", "muhtesem", "guzel haber|3",
    "sevindirici", "dogdu|3", "kabul aldim|5",
    "terfi|5", "atandim|5", "kazandi|3"
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
  ],

  iliski: [
    "esimle|3", "kocamla|3", "karimla|3", "sevgilimle|3", "iliskimiz|3",
    "iliskim|3", "evliligim|3", "bosan|5", "gecinemiyoruz|5",
    "anlasamiyoruz|5", "surekli tartisiyoruz|5", "kavga ediyoruz|3",
    "beni anlamiyor|3", "ayri yasiyoruz|5", "eve gelmiyor|3", "sogudum|3"
  ],

  cocuk: [
    "cocuk istiyorum|5", "cocugumuz olmuyor|5", "cocugum olmuyor|5",
    "hamile kalamiyorum|5", "tup bebek|5", "kisirlik|5", "bebek istiyorum|5",
    "anne olmak istiyorum|5", "baba olmak istiyorum|5", "dusuk yaptim|5",
    "cocugumuz yok|5", "asilama|3", "evlat isti|5", "nesil|3"
  ],

  guven: [
    "aldatildim|5", "aldatti|5", "beni kandirdi|5", "yalan soyledi|5",
    "ihanet|5", "kandirildim|5", "guvenim sarsildi|5", "guvenmiyorum|3",
    "arkamdan is cevir|5", "sozunu tutmadi|3", "hayal kirikligi|3",
    "sirrimi soyledi|3"
  ],

  nazar: [
    "nazar|5", "kem goz|5", "goz degdi|5", "kiskaniyorlar|5",
    "kiskanildim|5", "hased|5", "kiskanclik|3", "kotu bakis|3",
    "cok kiskanan|3", "gozleri uzerimde|3"
  ],

  ozlem: [
    "ozledim|5", "ozluyorum|5", "ozlem|5", "hasret|5", "sila|5",
    "gurbet|3", "uzakta|3", "goremiyorum|3", "memleket|3",
    "yillardir gormedim|5", "sesini duymak|3"
  ],

  /* ---- 2026 Eylul genislemesi ---- */

  yorgunluk: [
    "tukendim|5", "tukenmis|5", "tukeniyorum|5", "yorgunum|3", "cok yoruldum|5",
    "bitkin|5", "takatim|5", "gucum kalmadi|5", "enerjim yok|5", "burnout|5",
    "hicbir seye yetisemiyorum|3", "dinlenemiyorum|3", "yoruluyorum|3"
  ],

  uykusuzluk: [
    "uyuyami|5", "uyuyamad|5", "uykum kacti|5", "uykusuz|5", "gozume uyku|5",
    "uyanip duruyorum|5", "sabaha kadar|3", "gece yarisi|3", "uyku|3",
    "gece uyan|3", "insomnia|5", "yatakta donup|5"
  ],

  degersizlik: [
    "degersiz|5", "yetersiz|5", "ise yaramaz|5", "beceriksiz|3",
    "kendimi begenmiyorum|5", "kendimden nefret|5", "herkes benden iyi|5",
    "basarisiz|3", "ezik|3", "ozguven|5", "kiyasliyorum|3",
    "kendimi kucuk|5", "hicbir seyi beceremiyorum|5", "aptal gibi|3",
    "yuk oluyorum|3"
  ],

  evlat: [
    "cocugum icin endise|5", "cocugumdan endise|5", "cocugum icin kork|5",
    "evladim|3", "evladimin|5", "ergen|3", "soz dinlemiyor|5",
    "cocugumun gelecegi|5", "cocuk yetistir|3", "annelik|3", "babalik|3",
    "cocuklarim|3", "cocugumu kaybetmekten|5", "kotu arkadas|3",
    "okulda sorun|3"
  ],

  es: [
    "evlenmek istiyorum|5", "es ariyorum|5", "esimi ariyorum|5",
    "hayirli bir es|5", "hayirli bir kismet|5", "kismetim acil|5",
    "evlenemiyorum|5", "bekar|3", "yuva kurmak|5", "gorucu|5", "evlilik|3",
    "istemeye gel|3", "evde kal|3", "hayat arkadasi|5"
  ],

  bebek: [
    "hamileyim|5", "hamile|3", "bebek bekliyor|5", "bebegimiz olacak|5",
    "bebegim olacak|5", "anne olacagim|5", "baba olacagim|5",
    "dogum yapacagim|5", "dogum|3", "gebelik|5", "karnimdaki|5", "lohusa|3"
  ],

  basari: [
    "basardim|5", "basari|3", "hedefime ulastim|5", "derece yaptim|5",
    "birinci oldum|5", "odul aldim|5", "emeklerimin karsilig|5",
    "emegimin karsilig|5", "projemi bitirdim|3", "hak ettim|3",
    "sampiyon|5", "rekor|3"
  ],

  sabah: [
    "gunaydin|3", "sabah|3", "gune basl|5", "yeni gun|3", "uyandim|3",
    "guzel bir gun|3", "bugune basl|5"
  ],

  iman: [
    "imanim|5", "iman|3", "suphe|5", "allah var mi|5", "inancim|5",
    "inanc|3", "dinden uzak|5", "kalbim kaskati|5", "kalbim kurudu|5",
    "manevi|3", "maneviyat|3", "sorguluyorum|3", "ateist|3", "deist|3",
    "allahtan uzak|5", "allah beni duymuyor|5"
  ],

  ibadet: [
    "namaz|5", "ibadet|5", "kilamiyorum|3", "oruc|3", "zikir|3",
    "kuran okumuyorum|5", "kuran okuyamiyorum|5", "camiye|3", "secde|3",
    "tesbih|3", "ihmal|3", "kaza namaz|5", "husu|3"
  ],

  nefis: [
    "nefsim|5", "nefis|5", "haram|5", "bagimli|5", "birakamiyorum|5",
    "sigara|5", "alkol|5", "icki|3", "kumar|5", "porno|5", "mustehcen|5",
    "harama bak|5", "kotu aliskanlik|5", "aliskanlik|3", "kendime hakim|5",
    "tekrar dustum|5", "yine yaptim|5", "sehvet|5", "bahis|5", "irade|3"
  ],

  kiskanclik: [
    "kiskaniyorum|5", "kiskandim|5", "kiskancligim|5", "gipta|5",
    "haset ediyorum|7", "hased ediyorum|7", "imreniyorum|5",
    "onun gibi olmak|3", "gozum kaldi|3", "benim de olsun|3",
    "herkesin var|3"
  ],

  anlam: [
    "hayatin anlami|5", "hayatimin anlami|5", "neden yasiyorum|5",
    "ne icin yasiyorum|5", "neden buradayim|5", "amacsiz|5", "amacim|3",
    "varolus|5", "her sey anlamsiz|5", "bir amacim yok|5", "yon bulamiyorum|3"
  ],

  tefekkur: [
    "tefekkur|5", "yaratilis|5", "evren|5", "kainat|5", "yildiz|3",
    "gokyuzu|3", "doga|3", "manzara|3", "hayran|3", "ne guzel yaratmis|5",
    "gun batimi|3"
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
