/* AYET SECIMI — uygulamanin icerik omurgasi.
 *
 * Burada YALNIZCA referanslar (sure:ayet) ve o ayetin hangi hale dokundugu
 * yaziyor. Ayetin METNI burada yok, olmamali da: metin `ayet-cek.js` ile
 * dogrudan Kur'an kaynagindan cekiliyor. Boylece uygulamada tek bir kelime
 * bile elle/tahminle yazilmis kutsal metin bulunmuyor.
 *
 * Bir ayeti degistirmek istersen: sadece asagidaki referansi degistir, sonra
 *     node araclar/ayet-cek.js
 * calistir. src/veri/ayetler.json yeniden uretilir.
 *
 * Gruplar: ["94:5","94:6"] gibi bir dizi, ard arda okunmasi gereken ayetleri
 * tek kart olarak birlestirir.
 *
 * SECIM KURALI (bu listeyi genisletirken uy): ana konusu hukuk/savas/aile
 * hukmu olan ayetler, icinde ise gelen bir cumle uysa bile alinmiyor. Ornegin
 * 2:216'nin "hoslanmadiginiz sey hakkinizda hayirli olabilir" kismi kararsizlik
 * icin birebir, ama ayet "savas size farz kilindi" diye basliyor — kart olarak
 * gosterilince baglamindan kopuyor. Bu yuzden listede yok. Ayni sebeple 65:2
 * (bosanma), 2:222 (hayiz), 4:75 (savasa cagri) elendi.
 *
 * Dualarin hepsi Kur'an'in kendi dualari. Hadis kaynakli dua YOK: metnini ve
 * senedini bu dosyadan dogrulayamayacagim hicbir sey uygulamaya girmiyor.
 */

/* Ceviri secimi.
 *
 * "tr.yazir" (Elmalili Hamdi Yazir, vefat 1942) telif suresi Turkiye'de
 * dolmus olan meal; bu yuzden varsayilan o. "tr.diyanet" ve "tr.vakfi" daha
 * yaygin okunuyor ama TELIFLI — kullanmadan once yazili izin gerekir.
 * Degistirmek yeterli, gerisi otomatik.
 */
const CEVIRI = "tr.yazir";

const HALLER = [
  {
    id: "kaygi",
    ad: "Kaygılıyım",
    ozet: "İçim daralıyor, kötü bir şey olacak gibi",
    renk: "#5B7DB1",
    grup: "zor",
    ayetler: [["94:5", "94:6"], ["13:28"], ["65:3"], ["2:286"], ["9:51"]],
    dualar: [["20:25", "20:26"], ["3:173"], ["2:201"]],
    notlar: [
      "Kaygı geleceği çözmez, sadece bugünü tüketir. Şu an elinde olan tek şey bu nefes.",
      "Bu his bir bilgi değil, bir hava durumu. Geçtiğini daha önce de gördün.",
      "Yapabileceğin en küçük şeyi yap, gerisini bırak. Yükün tamamı senin değil."
    ]
  },
  {
    id: "uzuntu",
    ad: "Üzgünüm",
    ozet: "Ağırlık var, sebebi belli ya da değil",
    renk: "#6C7A99",
    grup: "zor",
    ayetler: [["9:40"], ["12:86"], ["93:3"], ["93:5"], ["3:139"], ["2:153"]],
    dualar: [["21:87"], ["3:8"], ["2:201"]],
    notlar: [
      "Üzülmek bir arıza değil. Kalbin çalışıyor demek.",
      "Kimseye açıklamak zorunda değilsin. Bir yere bırakman yeter.",
      "Bugün iyi hissetmek zorunda değilsin. Sadece bugünü geçir."
    ]
  },
  {
    id: "korku",
    ad: "Korkuyorum",
    ozet: "Bir şeyden ya da birinden çekiniyorum",
    renk: "#4E6E8E",
    grup: "zor",
    ayetler: [["3:175"], ["20:46"], ["41:30"], ["2:112"], ["9:51"]],
    dualar: [["20:45", "20:46"], ["23:97", "23:98"], ["3:173"]],
    notlar: [
      "Korkunun büyüklüğü tehlikenin büyüklüğü değildir.",
      "En kötü ihtimali yazıya dök. Çoğu zaman kafandakinden küçük çıkar.",
      "Korkuyorken de yürünür. Cesaret korkunun yokluğu değil."
    ]
  },
  {
    id: "ofke",
    ad: "Öfkeliyim",
    ozet: "Sinirliyim, içimde bir şey kabarıyor",
    renk: "#A5615A",
    grup: "zor",
    ayetler: [["3:134"], ["41:34"], ["42:43"], ["7:199"], ["25:63"]],
    dualar: [["7:200"], ["59:10"], ["23:97", "23:98"]],
    notlar: [
      "Öfkeliyken verilen kararların hemen hepsi geri alınıyor. Bunu da geri alacaksın.",
      "Şimdi konuşma. On dakika sonra da aynı şeyi düşünüyorsan konuş.",
      "Haklı olmak, hemen cevap vermeyi gerektirmiyor."
    ]
  },
  {
    id: "yalnizlik",
    ad: "Yalnızım",
    ozet: "Kimse yokmuş gibi hissediyorum",
    renk: "#6A6F8C",
    grup: "zor",
    ayetler: [["50:16"], ["2:186"], ["57:4"], ["9:40"], ["93:3"]],
    dualar: [["21:89"], ["25:74"], ["23:118"]],
    notlar: [
      "Yalnızlık bazen kalabalığın içinde en yüksek sesle konuşur.",
      "Bugün bir kişiye tek cümle yaz. Cevap gelmese bile sen kapıyı açmış olursun.",
      "Kimsenin görmediği yerde de görülüyorsun."
    ]
  },
  {
    id: "pismanlik",
    ad: "Pişmanım",
    ozet: "Yaptığım bir şey içimi kemiriyor",
    renk: "#7A6A8C",
    grup: "zor",
    ayetler: [["39:53"], ["20:82"], ["4:110"], ["66:8"], ["3:135"]],
    dualar: [["7:23"], ["28:16"], ["3:16"]],
    notlar: [
      "Pişmanlık, dönmek istediğini gösterir. Bu zaten yolun kendisi.",
      "Kendini cezalandırmak telafi değil. Telafi, düzeltebildiğin kısmı düzeltmek.",
      "Bir kere yeter. Aynı şeyi yüz kere hatırlamak tövbe değil, işkence."
    ]
  },
  {
    id: "sukur",
    ad: "Şükrediyorum",
    ozet: "İçim iyi, minnettarım",
    renk: "#5E8C6A",
    grup: "iyi",
    ayetler: [["14:7"], ["16:18"], ["2:152"], ["55:13"], ["93:11"]],
    dualar: [["27:19"], ["46:15"], ["2:201"]],
    notlar: [
      "Bugün iyi olan şeyi yaz. Kötü gün geldiğinde okuyacaksın.",
      "Minnet, dile getirilmezse unutulur. Bir kişiye teşekkür et.",
      "İyi anları da kaydet. Hafıza kötüyü kendiliğinden saklıyor zaten."
    ]
  },
  {
    id: "umutsuzluk",
    ad: "Umudum kalmadı",
    ozet: "Hiçbir şey düzelmeyecek gibi",
    renk: "#565E7A",
    grup: "zor",
    ayetler: [["39:53"], ["12:87"], ["94:5", "94:6"], ["65:3"], ["2:214"]],
    dualar: [["3:8"], ["21:87"], ["18:10"]],
    notlar: [
      "\"Hiç\" ve \"asla\" kelimeleri umutsuzluğun kendi sözlüğünden. Senin değil.",
      "Bugünü çözmek zorunda değilsin. Bugünü geçirmek yeter.",
      "Bu hâlde büyük karar verme. Karar, sen dinlendikten sonra."
    ]
  },
  {
    id: "hastalik",
    ad: "Hastayım",
    ozet: "Bedenim ağrıyor, yorgunum",
    renk: "#4F7C88",
    grup: "zor",
    ayetler: [["26:80"], ["17:82"], ["2:155", "2:156", "2:157"], ["10:57"]],
    dualar: [["21:83"], ["23:118"], ["2:286"]],
    notlar: [
      "Bugün hiçbir şey üretmemek de bir iş. İyileşmek çalışmaktır.",
      "İlacını al, doktorunu ara. Dua tedbiri kaldırmaz, tedbirin yanına gelir.",
      "Ağrı geçicidir, sen bugünkü hâlinden ibaret değilsin."
    ]
  },
  {
    id: "yas",
    ad: "Birini kaybettim",
    ozet: "Yas tutuyorum",
    renk: "#5A6472",
    grup: "zor",
    ayetler: [["2:155", "2:156", "2:157"], ["3:185"], ["21:35"], ["89:27", "89:28", "89:29", "89:30"]],
    dualar: [["2:156"], ["59:10"], ["14:41"]],
    notlar: [
      "Yasın takvimi yok. Kimse sana \"artık geçmeliydi\" diyemez.",
      "Anmak, tutmak değil. Onu anlatabildiğin kadar anlat.",
      "Bugün ağlamak istiyorsan ağla. Bunun için izin gerekmiyor."
    ]
  },
  {
    id: "bekleyis",
    ad: "Bekliyorum",
    ozet: "Sonucu bilmiyorum, sabrım tükeniyor",
    renk: "#7A7A8C",
    grup: "zor",
    ayetler: [["2:153"], ["39:10"], ["70:5"], ["30:60"], ["12:83"]],
    dualar: [["2:250"], ["7:126"], ["40:60"]],
    notlar: [
      "Beklemek boş zaman değil. Süre işliyor, sen de.",
      "Sonucu değiştirmeyecek düşünceyi bir kenara bırak.",
      "Kontrol edebildiğin şeyi bugün yap; gerisi zaten senin elinde değildi."
    ]
  },
  {
    id: "kararsizlik",
    ad: "Karar veremiyorum",
    ozet: "İki yol var, hangisi bilmiyorum",
    renk: "#6E7B8C",
    grup: "zor",
    ayetler: [["39:18"], ["3:159"], ["65:3"], ["42:10"]],
    dualar: [["18:10"], ["20:25", "20:26", "20:27", "20:28"], ["3:8"]],
    notlar: [
      "İki yol da yaşanabilir. Kötü olan, hiçbirine girmeden beklemek.",
      "Danış. Karar senin ama tek başına verilmesi şart değil.",
      "En iyi kararı değil, geri dönülebilir olanı seç."
    ]
  },
  {
    id: "sinav",
    ad: "Sınav / iş baskısı",
    ozet: "Üzerimde yük var, yetiştiremiyorum",
    renk: "#6B7C5B",
    grup: "zor",
    ayetler: [["94:5", "94:6"], ["2:286"], ["53:39"], ["18:23", "18:24"], ["3:139"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["20:114"], ["2:201"]],
    notlar: [
      "Tek bir maddeyi bitir. Liste kendi kendine kısalmaya öyle başlıyor.",
      "Hazırlanmak senin işin, sonuç değil. İkisini karıştırma.",
      "Uyu. Uykusuz kafayla çalışılan saatler sayılmıyor."
    ]
  },
  {
    id: "haksizlik",
    ad: "Haksızlığa uğradım",
    ozet: "Bana yapılanı hazmedemiyorum",
    renk: "#8C6B5B",
    grup: "zor",
    ayetler: [["42:41", "42:42"], ["14:42"], ["16:126", "16:127"], ["4:148"]],
    dualar: [["10:85", "10:86"], ["2:250"], ["40:44"]],
    notlar: [
      "Kaydını tut. Duygu unutur, yazı unutmaz.",
      "Hakkını aramak intikam değil. İkisini ayır.",
      "Sana yapılanın seni kendine benzetmesine izin verme."
    ]
  },
  {
    id: "rizik",
    ad: "Maddi sıkıntım var",
    ozet: "Borç, geçim, para derdi",
    renk: "#7C7250",
    grup: "zor",
    ayetler: [["65:3"], ["29:60"], ["11:6"], ["51:22"]],
    dualar: [["28:24"], ["2:201"], ["3:173"]],
    notlar: [
      "Rakamı yaz. Belirsiz borç, gerçek borçtan ağır geliyor.",
      "Bir kişiye söyle. Yalnız taşınan para derdi iki kat ediyor.",
      "Bugün küçük bir tedbir al; büyük çözüm bugünün işi değil."
    ]
  },
  {
    id: "huzur",
    ad: "Sakinleşmek istiyorum",
    ozet: "Durulmaya, susmaya ihtiyacım var",
    renk: "#5F8A8B",
    grup: "iyi",
    ayetler: [["13:28"], ["89:27", "89:28"], ["48:4"], ["6:82"], ["25:63"]],
    dualar: [["25:74"], ["3:8"], ["20:25", "20:26"]],
    notlar: [
      "Telefonu bırak. Beş dakika hiçbir şey yapma; bu da bir eylem.",
      "Sessizlik boşluk değil, yer açmak.",
      "Bugün için yeter. Yarını yarın düşün."
    ]
  },
  {
    id: "sevinc",
    ad: "Sevinçliyim",
    ozet: "İyi bir haber aldım, içim içime sığmıyor",
    renk: "#C9A961",
    grup: "iyi",
    ayetler: [["10:58"], ["27:40"], ["93:11"], ["2:152"]],
    dualar: [["27:19"], ["14:41"], ["2:201"]],
    notlar: [
      "Sevinci de paylaş. Yalnız yaşanan iyi haber yarısı kadar iyi geliyor.",
      "Bugünü yaz bir yere. Kötü bir gün geldiğinde bunu okuyacaksın.",
      "Sevindiğin şeyi kimin sayesinde yaşadığını düşün, bir kişiye teşekkür et."
    ]
  },
  {
    id: "yeni-baslangic",
    ad: "Yeni bir başlangıç",
    ozet: "Yeni iş, yeni ev, yeni bir yol",
    renk: "#7FA37A",
    grup: "iyi",
    ayetler: [["17:80"], ["65:3"], ["3:159"], ["53:39"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["18:10"], ["23:29"]],
    notlar: [
      "İlk gün herkes acemidir. Acemiliği saklamaya çalışma, sorarak öğren.",
      "Kendine süre tanı. Yeni bir şeye alışmak haftalar sürüyor, günler değil.",
      "Ne olacağını bilmiyor olman kötü gittiği anlamına gelmiyor."
    ]
  },
  {
    id: "sevdiklerim",
    ad: "Sevdiklerim için",
    ozet: "Ailem, dostum, sevdiğim biri için dua etmek istiyorum",
    renk: "#8C7BA5",
    grup: "iyi",
    ayetler: [["30:21"], ["46:15"], ["59:10"], ["2:186"]],
    dualar: [["17:24"], ["14:40", "14:41"], ["25:74"]],
    notlar: [
      "Dua ettiğin kişiye bunu söyle. Duyulduğunu bilmek de iyi geliyor.",
      "Anne baban hayattaysa bugün ara. Duanın yanına ses de gitsin.",
      "Uzaktan edilen dua da dua; ama bir mesaj atmak onun yerine geçmiyor."
    ]
  },
  {
    id: "yolculuk",
    ad: "Yolculuğa çıkıyorum",
    ozet: "Yola çıkıyorum ya da bir yere taşınıyorum",
    renk: "#6E8FA5",
    grup: "iyi",
    ayetler: [["17:80"], ["65:3"], ["2:186"], ["9:51"]],
    dualar: [["43:13", "43:14"], ["23:29"], ["11:41"]],
    notlar: [
      "Yola çıkmadan bir haber ver. Seni bekleyen birinin içi rahat etsin.",
      "Acele etme. Vaktinde varmak, erken varmaktan önemli.",
      "Gittiğin yer seni değiştirecek; buna açık git."
    ]
  },
  {
    id: "affetme",
    ad: "Affetmek istiyorum",
    ozet: "Küs olduğum biri var, barışmak istiyorum",
    renk: "#A58B6E",
    grup: "iyi",
    ayetler: [["42:40"], ["7:199"], ["3:134"], ["41:34"]],
    dualar: [["59:10"], ["7:23"], ["3:16"]],
    notlar: [
      "Affetmek, olanı onaylamak değil. Taşımayı bırakmak.",
      "İlk adımı atmak yenilmek değil. Çoğu küslük iki tarafın da beklemesinden uzuyor.",
      "Hazır değilsen zorlama. Affetmeye niyet etmek de bir başlangıç."
    ]
  },
  {
    id: "dilek",
    ad: "Bir dileğim var",
    ozet: "İstediğim bir şey var, dua etmek istiyorum",
    renk: "#B08D57",
    grup: "iyi",
    ayetler: [["40:60"], ["2:186"], ["7:55"], ["21:90"]],
    dualar: [["2:201"], ["3:8"], ["25:74"]],
    notlar: [
      "Ne istediğini net söyle — kendine bile. Belirsiz dilek, belirsiz kalıyor.",
      "Dua ettiğin şey için ayrıca bir adım at. İkisi birbirinin yerine geçmiyor.",
      "Olmazsa da bir cevaptır. Hemen anlaşılmayabilir."
    ]
  }
];

/* Ana ekranin ustunde duran ayet. Uygulamanin ne yaptigini tek ayette anlatan
 * yer: "Bana dua edin, size karsilik vereyim." */
const GIRIS_AYETI = "40:60";

module.exports = { CEVIRI, HALLER, GIRIS_AYETI };
