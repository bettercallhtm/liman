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
    ikon: "pulse-outline",
    ayetler: [["94:5", "94:6"], ["13:28"], ["65:3"], ["2:286"], ["9:51"], ["3:160"], ["8:10"], ["33:3"], ["64:13"], ["12:64"], ["39:38"], ["57:22", "57:23"], ["6:17"], ["10:62"]],
    dualar: [["20:25", "20:26"], ["3:173"], ["2:201"], ["3:8"], ["21:87"], ["18:10"], ["9:129"], ["114:1", "114:2", "114:3", "114:4", "114:5", "114:6"], ["2:286"]],
    sozler: [
      "Allah'ım, içimdeki bu daralmayı sen biliyorsun. Göğsümü genişlet, korktuğum şeyle beni imtihan etme. Yarını taşıyacak gücü değil, bugünü geçirecek gücü ver bana.",
      "Rabbim, aklımdan geçen kötü ihtimalleri senin bilgine bırakıyorum. Elimde olanı yapmayı, olmayanı bırakmayı nasip et.",
      "Allah'ım, olmamış şeylerin yükünü bugünden taşıyorum. Kalbimi bugüne getir; yarını sana bırakıyorum."
    ],
    notlar: [
      "Kaygı geleceği çözmez, sadece bugünü tüketir. Şu an elinde olan tek şey bu nefes.",
      "Bu his bir bilgi değil, bir hava durumu. Geçtiğini daha önce de gördün.",
      "Yapabileceğin en küçük şeyi yap, gerisini bırak. Yükün tamamı senin değil.",
      "Kaygının söylediği şeylerin kaçı gerçekten oldu? Sayabilirsin, liste kısa çıkıyor.",
      "Bedenine bak: omuzların yukarıda, çenen kilitli. Önce onları indir.",
      "Bugün karar vermek zorunda olduğun şeyleri say. Çoğu bugünün işi değil."
    ]
  },
  {
    id: "uzuntu",
    ad: "Üzgünüm",
    ozet: "Ağırlık var, sebebi belli ya da değil",
    renk: "#6C7A99",
    grup: "zor",
    ikon: "rainy-outline",
    ayetler: [["9:40"], ["12:86"], ["93:3"], ["93:5"], ["3:139"], ["2:153"], ["15:97", "15:98"], ["28:7"], ["10:62"], ["35:34"], ["21:83", "21:84"], ["94:5", "94:6"], ["12:87"], ["13:28"], ["16:127"]],
    dualar: [["21:87"], ["3:8"], ["2:201"], ["23:118"], ["3:16"], ["12:86"], ["20:25", "20:26"], ["2:286"], ["9:129"]],
    sozler: [
      "Allah'ım, bu ağırlığı taşıyacak gücüm kalmadı. Kalbimi hafiflet, kimseye anlatamadığım bu hüznü sen benden al.",
      "Rabbim, üzüntümü senden başkasına anlatamıyorum; sen zaten biliyorsun. Bugünü geçirecek kadar sabır, yarına bakacak kadar umut ver.",
      "Rabbim, gözyaşımı görüyorsun. Bu hüznü bana bir yara değil, sana dönen bir yol eyle."
    ],
    notlar: [
      "Üzülmek bir arıza değil. Kalbin çalışıyor demek.",
      "Kimseye açıklamak zorunda değilsin. Bir yere bırakman yeter.",
      "Bugün iyi hissetmek zorunda değilsin. Sadece bugünü geçir.",
      "Bir şeyler başarmak zorunda değilsin. Yatakta geçen gün de gündür.",
      "Yediğine ve su içtiğine bak. Üzüntü ilk oradan besleniyor.",
      "Bunu bir kişiye anlat. Anlatınca küçülmüyor ama tek başına kalmıyorsun."
    ]
  },
  {
    id: "korku",
    ad: "Korkuyorum",
    ozet: "Bir şeyden ya da birinden çekiniyorum",
    renk: "#4E6E8E",
    grup: "zor",
    ikon: "shield-outline",
    ayetler: [["3:175"], ["20:46"], ["41:30"], ["2:112"], ["9:51"], ["33:39"], ["2:38"], ["46:13"], ["27:62"], ["6:17"], ["35:2"], ["28:31"], ["20:68"], ["16:99"], ["106:3", "106:4"]],
    dualar: [["20:45", "20:46"], ["23:97", "23:98"], ["3:173"], ["10:85", "10:86"], ["2:286"], ["28:21"], ["9:129"], ["113:1", "113:2", "113:3", "113:4", "113:5"], ["3:8"]],
    sozler: [
      "Allah'ım, korktuğum şeyin şerrinden sana sığınırım. Kalbime güven ver, korkumun her şeyi olduğundan büyük göstermesine izin verme.",
      "Rabbim, başıma geleceği yalnız sen bilirsin. Korkumu al, yerine sana güvenmeyi koy.",
      "Allah'ım, sen yanımdayken kimden korkayım? Adımımı sağlam, kalbimi emin kıl."
    ],
    notlar: [
      "Korkunun büyüklüğü tehlikenin büyüklüğü değildir.",
      "En kötü ihtimali yazıya dök. Çoğu zaman kafandakinden küçük çıkar.",
      "Korkuyorken de yürünür. Cesaret korkunun yokluğu değil.",
      "Korktuğun şey olursa ne yaparsın? O planı yapmak korkuyu yarıya indiriyor.",
      "Kaçındığın şey her gün biraz daha büyüyor. En küçük adımı bugün at.",
      "Gece korku büyür. Sabah aynı şeye baktığında boyu değişmiş olur."
    ]
  },
  {
    id: "ofke",
    ad: "Öfkeliyim",
    ozet: "Sinirliyim, içimde bir şey kabarıyor",
    renk: "#A5615A",
    grup: "zor",
    ikon: "flame-outline",
    ayetler: [["3:134"], ["41:34"], ["42:43"], ["7:199"], ["25:63"], ["42:37"], ["23:96"], ["28:54"], ["13:22"], ["41:35"], ["3:159"], ["7:201"], ["24:22"]],
    dualar: [["7:200"], ["59:10"], ["23:97", "23:98"], ["3:8"], ["3:147"], ["20:25", "20:26"], ["23:118"], ["2:201"]],
    sozler: [
      "Allah'ım, içimdeki bu öfkeyi dindir. Pişman olacağım bir söz söylemekten, geri alamayacağım bir şey yapmaktan beni koru.",
      "Rabbim, haklı olduğum yerde bile insafımı kaybettirme. Öfkemi sustur, aklımı konuştur.",
      "Allah'ım, öfkemi yutabilenlerden ve insanları affedebilenlerden eyle. Sözümü yumuşat, kalbimi serinlet."
    ],
    notlar: [
      "Öfkeliyken verilen kararların hemen hepsi geri alınıyor. Bunu da geri alacaksın.",
      "Şimdi konuşma. On dakika sonra da aynı şeyi düşünüyorsan konuş.",
      "Haklı olmak, hemen cevap vermeyi gerektirmiyor.",
      "Öfke haklılıktan gelir; ama haklı kalmak için öfkeyi taşımak gerekmiyor.",
      "Yaz, gönderme. Yarın oku; hâlâ göndermek istiyorsan gönder.",
      "Bedenin hazır: kalbin hızlı, ellerin sıkı. Yürü. Öfke otururken geçmiyor."
    ]
  },
  {
    id: "yalnizlik",
    ad: "Yalnızım",
    ozet: "Kimse yokmuş gibi hissediyorum",
    renk: "#6A6F8C",
    grup: "zor",
    ikon: "person-outline",
    ayetler: [["50:16"], ["2:186"], ["57:4"], ["9:40"], ["93:3"], ["58:7"], ["6:59"], ["93:6", "93:7", "93:8"], ["3:103"], ["39:36"], ["20:46"], ["2:152"], ["26:217", "26:218", "26:219"]],
    dualar: [["21:89"], ["25:74"], ["23:118"], ["21:87"], ["3:8"], ["26:83"], ["2:201"], ["9:129"]],
    sozler: [
      "Allah'ım, kimsenin olmadığı yerde sen varsın. İçimdeki bu boşluğu doldur, beni yalnızlığımla baş başa bırakma.",
      "Rabbim, bana hayırlı dostlar nasip et. Kimsenin görmediğini senin gördüğünü bilmenin huzurunu kalbime yerleştir.",
      "Rabbim, sen bana şah damarımdan yakınsın. Bu yakınlığı kalbimde hissettir, beni sevenleri de yoluma çıkar."
    ],
    notlar: [
      "Yalnızlık bazen kalabalığın içinde en yüksek sesle konuşur.",
      "Bugün bir kişiye tek cümle yaz. Cevap gelmese bile sen kapıyı açmış olursun.",
      "Kimsenin görmediği yerde de görülüyorsun.",
      "Yalnızlıkla tek başına olmak aynı şey değil. Hangisindesin?",
      "Kimse seni unuttuğu için değil, herkes kendi derdine gömüldüğü için aramıyor olabilir.",
      "Bir yere çık. Ekmek almaya bile. Dört duvar yalnızlığı büyütüyor."
    ]
  },
  {
    id: "pismanlik",
    ad: "Pişmanım",
    ozet: "Yaptığım bir şey içimi kemiriyor",
    renk: "#7A6A8C",
    grup: "kalp",
    ikon: "return-down-back-outline",
    ayetler: [["39:53"], ["20:82"], ["4:110"], ["66:8"], ["3:135"], ["25:70"], ["42:25"], ["9:104"], ["40:3"], ["2:160"], ["11:3"], ["11:114"], ["4:17"], ["6:54"]],
    dualar: [["7:23"], ["28:16"], ["3:16"], ["3:147"], ["23:118"], ["21:87"], ["3:193"], ["23:109"], ["2:286"]],
    sozler: [
      "Allah'ım, yaptığımdan pişmanım. Beni bağışla, aynı yere bir daha düşürme. Kırdığım kalpleri onarmayı bana nasip et.",
      "Rabbim, kendimi affedemiyorum. Sen bağışlayanların en hayırlısısın; beni bağışla, kendimle barışmayı da bana ver.",
      "Allah'ım, kapına utanarak geliyorum. Tövbemi kabul et, kalbimi temizle, bana yeni bir sayfa aç."
    ],
    notlar: [
      "Pişmanlık, dönmek istediğini gösterir. Bu zaten yolun kendisi.",
      "Kendini cezalandırmak telafi değil. Telafi, düzeltebildiğin kısmı düzeltmek.",
      "Bir kere yeter. Aynı şeyi yüz kere hatırlamak tövbe değil, işkence.",
      "Kime ne borçlu olduğunu yaz. Ödenebilir olanı öde, ödenemeyeni bırak.",
      "Cümleyi değiştir: “berbat biriyim” değil, “kötü bir şey yaptım”.",
      "Aynı hatayı bir daha yapmamak, yapılanı silmekten daha gerçek bir telafi."
    ]
  },
  {
    id: "sukur",
    ad: "Şükrediyorum",
    ozet: "İçim iyi, minnettarım",
    renk: "#5E8C6A",
    grup: "iyi",
    ikon: "sparkles-outline",
    ayetler: [["14:7"], ["16:18"], ["2:152"], ["55:13"], ["93:11"], ["31:12"], ["16:78"], ["2:172"], ["39:66"], ["17:70"], ["30:50"], ["16:53"], ["27:40"]],
    dualar: [["27:19"], ["46:15"], ["2:201"], ["14:40", "14:41"], ["17:24"], ["3:8"], ["1:2", "1:3", "1:4"], ["17:111"]],
    sozler: [
      "Allah'ım, bana verdiklerinin farkında olmayı nasip et. Şükrümü dilimde bırakma, davranışıma geçir.",
      "Rabbim, sayamadığım nimetlerin için hamdolsun. Elimdekinin kıymetini kaybetmeden bilmeyi öğret bana.",
      "Allah'ım, nimetlerini saymaya ömrüm yetmez. Hamdimi kabul et, şükrümü artır, beni nankörlerden eyleme."
    ],
    notlar: [
      "Bugün iyi olan şeyi yaz. Kötü gün geldiğinde okuyacaksın.",
      "Minnet, dile getirilmezse unutulur. Bir kişiye teşekkür et.",
      "İyi anları da kaydet. Hafıza kötüyü kendiliğinden saklıyor zaten.",
      "Üç şey say. Küçük olsun: sıcak su, bir mesaj, iyi bir uyku.",
      "Şükür, kötü bir şey olmaması demek değil. Olanın yanında iyiyi de görebilmek demek.",
      "Birine bir iyilik yap. Minnetin en kalıcı hâli aktarılanı."
    ]
  },
  {
    id: "umutsuzluk",
    ad: "Umudum kalmadı",
    ozet: "Hiçbir şey düzelmeyecek gibi",
    renk: "#565E7A",
    grup: "zor",
    ikon: "cloudy-night-outline",
    ayetler: [["39:53"], ["12:87"], ["94:5", "94:6"], ["65:3"], ["2:214"], ["15:56"], ["29:69"], ["93:4"], ["57:22", "57:23"], ["42:28"], ["3:139"], ["12:110"], ["93:3"], ["2:186"]],
    dualar: [["3:8"], ["21:87"], ["18:10"], ["12:86"], ["2:286"], ["9:129"], ["2:250"], ["20:25", "20:26"], ["23:118"]],
    sozler: [
      "Allah'ım, benim umudum tükendi ama senin rahmetin tükenmez. Kalbime bir aralık aç, bu karanlıktan çıkacak yolu göster.",
      "Rabbim, bugünü geçirecek gücü ver. Yarını düşünecek hâlim yok; sen benim yerime bak.",
      "Allah'ım, bütün kapılar kapandı sanıyorum; oysa senin kapın hiç kapanmadı. Beni rahmetinden ümit kesenlerden eyleme."
    ],
    notlar: [
      "\"Hiç\" ve \"asla\" kelimeleri umutsuzluğun kendi sözlüğünden. Senin değil.",
      "Bugünü çözmek zorunda değilsin. Bugünü geçirmek yeter.",
      "Bu hâlde büyük karar verme. Karar, sen dinlendikten sonra.",
      "Kaç gecedir düzgün uyumadın? Umutsuzluk çoğu zaman yorgunluğun sesiyle konuşuyor.",
      "Bu duyguya inanmak zorunda değilsin. Duygular bilgi değil.",
      "Bir kişiye “iyi değilim” yaz. Açıklama eklemene gerek yok."
    ]
  },
  {
    id: "hastalik",
    ad: "Hastayım",
    ozet: "Bedenim ağrıyor, yorgunum",
    renk: "#4F7C88",
    grup: "zor",
    ikon: "medkit-outline",
    ayetler: [["26:80"], ["17:82"], ["2:155", "2:156", "2:157"], ["10:57"], ["64:11"], ["3:139"], ["16:69"], ["6:17"], ["27:62"], ["94:5", "94:6"], ["2:286"], ["38:41", "38:42"]],
    dualar: [["21:83"], ["23:118"], ["2:286"], ["2:201"], ["21:87"], ["3:8"], ["9:129"], ["2:250"]],
    sozler: [
      "Allah'ım, şifa senden. Bedenime şifa, kalbime sabır ver. Bu ağrıyı hafiflet, geçmesini nasip et.",
      "Rabbim, hasta olmak beni yalnızlaştırmasın. İyileşmeyi, iyileşene kadar da dayanacak sabrı ver.",
      "Rabbim, bu hastalığı günahlarıma kefaret, sabrıma vesile kıl. Doktoruma isabet, ilacıma şifa ver."
    ],
    notlar: [
      "Bugün hiçbir şey üretmemek de bir iş. İyileşmek çalışmaktır.",
      "İlacını al, doktorunu ara. Dua tedbiri kaldırmaz, tedbirin yanına gelir.",
      "Ağrı geçicidir, sen bugünkü hâlinden ibaret değilsin.",
      "Bugünkü işin dinlenmek. Listenin geri kalanı bekleyebilir.",
      "Ağrını küçültme; doktora olduğu gibi anlat.",
      "Yanında biri varsa yardım iste. İstemek yük olmak değil."
    ]
  },
  {
    id: "yas",
    ad: "Birini kaybettim",
    ozet: "Yas tutuyorum",
    renk: "#5A6472",
    grup: "zor",
    ikon: "rose-outline",
    ayetler: [["2:155", "2:156", "2:157"], ["3:185"], ["21:35"], ["89:27", "89:28", "89:29", "89:30"], ["13:23", "13:24"], ["29:57"], ["39:42"], ["23:15", "23:16"], ["40:39"], ["3:145"], ["57:22", "57:23"], ["55:26", "55:27"]],
    dualar: [["2:156"], ["59:10"], ["14:41"], ["3:16"], ["23:118"], ["17:24"], ["2:250"], ["7:126"]],
    sozler: [
      "Allah'ım, kaybettiğimi sana emanet ediyorum. Onu bağışla, rahmetinle kuşat. Bana da onsuz yaşamayı öğret.",
      "Rabbim, bu acı çok büyük. Kalbimi teselli et; ardından onu hayırla anmayı nasip et.",
      "Allah'ım, ayrılık zor ama kavuşma senin vaadin. Onu rahmetinle karşıla, bizi de ona hayırla kavuştur."
    ],
    notlar: [
      "Yasın takvimi yok. Kimse sana \"artık geçmeliydi\" diyemez.",
      "Anmak, tutmak değil. Onu anlatabildiğin kadar anlat.",
      "Bugün ağlamak istiyorsan ağla. Bunun için izin gerekmiyor.",
      "İyi hissettiğin anlar için kendini suçlama. Gülmek unutmak değil.",
      "Onun sevdiği bir şeyi bugün yap: bir yemek, bir şarkı, bir yol.",
      "Yas dalga hâlinde gelir. Bu dalga geçecek, sonra bir tane daha gelecek. İkisi de normal."
    ]
  },
  {
    id: "bekleyis",
    ad: "Bekliyorum",
    ozet: "Sonucu bilmiyorum, sabrım tükeniyor",
    renk: "#7A7A8C",
    grup: "zor",
    ikon: "hourglass-outline",
    ayetler: [["2:153"], ["39:10"], ["70:5"], ["30:60"], ["12:83"], ["11:115"], ["52:48"], ["2:45"], ["103:1", "103:2", "103:3"], ["94:7", "94:8"], ["12:18"], ["65:3"], ["17:11"]],
    dualar: [["2:250"], ["7:126"], ["40:60"], ["21:87"], ["3:8"], ["2:201"], ["12:86"], ["9:129"]],
    sozler: [
      "Allah'ım, sonucu bilmiyorum ama senin bildiğine güveniyorum. Beklerken sabrımı, sonuç geldiğinde rızamı koru.",
      "Rabbim, bu bekleyişi hayırla bitir. Hakkımda hayırlıysa kolaylaştır, değilse gönlümü ondan al.",
      "Allah'ım, vaktini sen bilirsin. Bana acele ettirme; beklediğim ne ise hayırlı vaktinde, hayırlı şekilde gelsin."
    ],
    notlar: [
      "Beklemek boş zaman değil. Süre işliyor, sen de.",
      "Sonucu değiştirmeyecek düşünceyi bir kenara bırak.",
      "Kontrol edebildiğin şeyi bugün yap; gerisi zaten senin elinde değildi.",
      "Beklerken hayatını durdurma. Sonuç geldiğinde geride bıraktığın günleri geri alamazsın.",
      "Her saat kontrol etmek süreci hızlandırmıyor, sadece seni yoruyor.",
      "“Ne olursa ne yaparım” sorusunun cevabını yaz. Belirsizlik o zaman küçülüyor."
    ]
  },
  {
    id: "kararsizlik",
    ad: "Karar veremiyorum",
    ozet: "İki yol var, hangisi bilmiyorum",
    renk: "#6E7B8C",
    grup: "zor",
    ikon: "git-branch-outline",
    ayetler: [["39:18"], ["3:159"], ["65:3"], ["42:10"], ["2:269"], ["9:51"], ["42:38"], ["17:36"], ["39:9"], ["33:3"], ["28:68"], ["18:23", "18:24"]],
    dualar: [["18:10"], ["20:25", "20:26", "20:27", "20:28"], ["3:8"], ["1:6", "1:7"], ["2:201"], ["28:22"], ["17:80"], ["20:114"], ["9:129"]],
    sozler: [
      "Allah'ım, hangi yolun hayırlı olduğunu bilmiyorum. Kalbimi doğru olana meylettir, yanlış olandan uzaklaştır.",
      "Rabbim, karar vermek bana ağır geliyor. Doğruyu göster; gösterdiğinde arkasında durma gücünü de ver.",
      "Rabbim, seçtiğim yolu bereketli, bıraktığım yolu gönlümden uzak kıl. Kararımdan sonra pişmanlık verme."
    ],
    notlar: [
      "İki yol da yaşanabilir. Kötü olan, hiçbirine girmeden beklemek.",
      "Danış. Karar senin ama tek başına verilmesi şart değil.",
      "En iyi kararı değil, geri dönülebilir olanı seç.",
      "İki yolu da yaşamış birine sor. Kendi kafanda döndürmek yerine dışarıdan bak.",
      "Karar vermemek de bir karar; üstelik senin seçmediğin karar.",
      "Yazı tura at. Sonuç çıkınca içinden geçen ilk his, senin gerçek cevabın."
    ]
  },
  {
    id: "sinav",
    ad: "Sınav / iş baskısı",
    ozet: "Üzerimde yük var, yetiştiremiyorum",
    renk: "#6B7C5B",
    grup: "zor",
    ikon: "school-outline",
    ayetler: [["94:5", "94:6"], ["2:286"], ["53:39"], ["18:23", "18:24"], ["3:139"], ["92:5", "92:6", "92:7"], ["87:8"], ["9:105"], ["13:11"], ["2:45"], ["39:9"], ["96:1", "96:2", "96:3", "96:4", "96:5"], ["58:11"], ["29:69"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["20:114"], ["2:201"], ["3:147"], ["3:8"], ["17:80"], ["9:129"], ["18:10"]],
    sozler: [
      "Allah'ım, göğsümü genişlet, işimi kolaylaştır. Öğrendiklerimi ihtiyaç anında hatırlat, yorulduğumda beni ayakta tut.",
      "Rabbim, elimden geleni yapmayı nasip et; gerisini senden bekliyorum. Sonuç ne olursa hayırlısını ver.",
      "Allah'ım, zihnimi berrak, kalemimi doğru, kalbimi sakin kıl. Emeğimin karşılığını hayırlısıyla ver."
    ],
    notlar: [
      "Tek bir maddeyi bitir. Liste kendi kendine kısalmaya öyle başlıyor.",
      "Hazırlanmak senin işin, sonuç değil. İkisini karıştırma.",
      "Uyu. Uykusuz kafayla çalışılan saatler sayılmıyor.",
      "Yirmi beş dakika çalış, beş dakika dur. Kafan bütün günü değil, o yirmi beş dakikayı kaldırıyor.",
      "Herkesin senden ileride olduğunu sanıyorsun. Sen de birinin “ileride” sandığı kişisin.",
      "Bitmesi gerekenle bitmesini istediğini ayır. İkisi aynı liste değil."
    ]
  },
  {
    id: "haksizlik",
    ad: "Haksızlığa uğradım",
    ozet: "Bana yapılanı hazmedemiyorum",
    renk: "#8C6B5B",
    grup: "zor",
    ikon: "scale-outline",
    ayetler: [["42:41", "42:42"], ["14:42"], ["16:126", "16:127"], ["4:148"], ["22:60"], ["4:135"], ["5:8"], ["21:47"], ["4:40"], ["42:39"], ["26:227"], ["3:139"]],
    dualar: [["10:85", "10:86"], ["2:250"], ["40:44"], ["3:173"], ["23:118"], ["28:21"], ["7:47"], ["66:11"], ["21:112"]],
    sozler: [
      "Allah'ım, bana yapılanı sen biliyorsun. Hakkımı ver, ama beni de zalimleştirme.",
      "Rabbim, uğradığım haksızlık kalbimi karartmasın. Adaletini göster; o güne kadar sabrımı koru.",
      "Allah'ım, sen adaletin sahibisin. Hakkımı senden istiyorum; öfkemi hakka, kinimi sabra çevir."
    ],
    notlar: [
      "Kaydını tut. Duygu unutur, yazı unutmaz.",
      "Hakkını aramak intikam değil. İkisini ayır.",
      "Sana yapılanın seni kendine benzetmesine izin verme.",
      "Hakkını aramanın bir yolu varsa ilk adımı bugün at; yoksa taşımayı bırakmayı dene.",
      "Herkese anlatmak zorunda değilsin. Doğru bir kişiye anlatmak yeter.",
      "Onun yaptığının bedelini sen ödüyorsun: uykun kaçıyor, keyfin kaçıyor. Bunu fark et."
    ]
  },
  {
    id: "rizik",
    ad: "Maddi sıkıntım var",
    ozet: "Borç, geçim, para derdi",
    renk: "#7C7250",
    grup: "zor",
    ikon: "wallet-outline",
    ayetler: [["65:3"], ["29:60"], ["11:6"], ["51:22"], ["94:5", "94:6"], ["2:186"], ["17:30"], ["34:39"], ["30:37"], ["20:132"], ["3:27"], ["71:10", "71:11", "71:12"], ["15:21"], ["62:10"]],
    dualar: [["28:24"], ["2:201"], ["3:173"], ["5:114"], ["40:44"], ["3:26", "3:27"], ["9:129"], ["17:80"]],
    sozler: [
      "Allah'ım, sıkıntımı biliyorsun. Beni helâlinden rızıklandır, borcumu ödemeyi nasip et, kimseye muhtaç etme.",
      "Rabbim, darlığı genişliğe çevir. Elimdekiyle yetinmeyi, eline geçeni bereketli kılmayı ver.",
      "Rabbim, rızkı veren sensin. Beni kapı kapı dolaştırma; kolay, helal ve bereketli bir kapı aç."
    ],
    notlar: [
      "Rakamı yaz. Belirsiz borç, gerçek borçtan ağır geliyor.",
      "Bir kişiye söyle. Yalnız taşınan para derdi iki kat ediyor.",
      "Bugün küçük bir tedbir al; büyük çözüm bugünün işi değil.",
      "Bütün rakamları tek bir sayfaya yaz. Bilinmeyen borç, bilinenden ağır geliyor.",
      "Bugün bir gideri kesebilir ya da bir şey satabilirsin. Küçük ama senin elinde.",
      "Para sıkıntısı utanılacak bir şey değil. Utanç, konuşmayı engellediği için sıkıntıyı büyütüyor."
    ]
  },
  {
    id: "huzur",
    ad: "Sakinleşmek istiyorum",
    ozet: "Durulmaya, susmaya ihtiyacım var",
    renk: "#5F8A8B",
    grup: "iyi",
    ikon: "leaf-outline",
    ayetler: [["13:28"], ["89:27", "89:28"], ["48:4"], ["6:82"], ["25:63"], ["16:97"], ["20:130"], ["76:25", "76:26"], ["3:191"], ["39:23"], ["2:255"], ["59:22", "59:23", "59:24"]],
    dualar: [["25:74"], ["3:8"], ["20:25", "20:26"], ["23:118"], ["2:201"], ["9:129"], ["1:6", "1:7"], ["3:191"]],
    sozler: [
      "Allah'ım, kalbimi sakinleştir. Zihnimdeki gürültüyü dindir, bana kendimle baş başa kalabileceğim bir sükûnet ver.",
      "Rabbim, telaşımı al. Yavaşlamayı, durmayı ve durduğum yerde huzur bulmayı nasip et.",
      "Allah'ım, kalbimi seni anmakla doyur. Dünyanın gürültüsünde bana sessiz bir liman ol."
    ],
    notlar: [
      "Telefonu bırak. Beş dakika hiçbir şey yapma; bu da bir eylem.",
      "Sessizlik boşluk değil, yer açmak.",
      "Bugün için yeter. Yarını yarın düşün.",
      "Pencereyi aç. Hava en ucuz ilaç.",
      "Bir şey dinleme, bir şey okuma. Beş dakika sadece otur.",
      "Yapılacaklar listesini kapat. Yarın da orada duruyor olacak."
    ]
  },
  {
    id: "sevinc",
    ad: "Sevinçliyim",
    ozet: "İyi bir haber aldım, içim içime sığmıyor",
    renk: "#C9A961",
    grup: "iyi",
    ikon: "sunny-outline",
    ayetler: [["10:58"], ["27:40"], ["93:11"], ["2:152"], ["35:34"], ["14:7"], ["108:1"], ["55:60"], ["16:97"], ["3:174"], ["16:53"], ["57:23"]],
    dualar: [["27:19"], ["14:41"], ["2:201"], ["46:15"], ["25:74"], ["3:8"], ["1:2", "1:3", "1:4"], ["17:111"]],
    sozler: [
      "Allah'ım, bu sevinç senden. Şımartma, unutturma; elimden aldığın gün de isyan ettirme.",
      "Rabbim, bu haberi kalbime hayırlı kıl. Sevincimi paylaşacak insanlar ve sevindirecek fırsatlar nasip et.",
      "Rabbim, bu sevinci bana tattıran sensin. Onu kalıcı kıl, başkalarının sevincine de vesile eyle."
    ],
    notlar: [
      "Sevinci de paylaş. Yalnız yaşanan iyi haber yarısı kadar iyi geliyor.",
      "Bugünü yaz bir yere. Kötü bir gün geldiğinde bunu okuyacaksın.",
      "Sevindiğin şeyi kimin sayesinde yaşadığını düşün, bir kişiye teşekkür et.",
      "Sevincini küçültme. “Şükür ama...” diye başlayan cümleyi kurma.",
      "Bu anı bir yere not et: nerede, kimlerle, ne hissettin.",
      "Sevindiğin şeyi bir kişiye anlat. İki kişi olunca büyüyor."
    ]
  },
  {
    id: "yeni-baslangic",
    ad: "Yeni bir başlangıç",
    ozet: "Yeni iş, yeni ev, yeni bir yol",
    renk: "#7FA37A",
    grup: "iyi",
    ikon: "trail-sign-outline",
    ayetler: [["17:80"], ["65:3"], ["3:159"], ["53:39"], ["94:5", "94:6"], ["2:186"], ["2:148"], ["87:8"], ["29:69"], ["30:50"], ["6:125"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["18:10"], ["23:29"], ["2:201"], ["3:8"], ["28:24"], ["28:22"], ["9:129"]],
    sozler: [
      "Allah'ım, girdiğim bu yeni yolu hayırlı kıl. Beni doğrulukla sok, doğrulukla çıkar.",
      "Rabbim, yeni başlangıcımda kolaylık ver. İyi insanlar, sabır ve doğru kararlar nasip et.",
      "Allah'ım, bu kapıyı bana sen açtın. İçeride de beni yalnız bırakma, başladığımı hayırla tamamlat."
    ],
    notlar: [
      "İlk gün herkes acemidir. Acemiliği saklamaya çalışma, sorarak öğren.",
      "Kendine süre tanı. Yeni bir şeye alışmak haftalar sürüyor, günler değil.",
      "Ne olacağını bilmiyor olman kötü gittiği anlamına gelmiyor.",
      "İlk hafta yorucu geçecek. Bu, yanlış karar verdiğin anlamına gelmiyor.",
      "Eski yerinden getirdiğin bir alışkanlığı sürdür. Yeni yerde tanıdık bir şey iyi geliyor.",
      "Kimden yardım isteyeceğini şimdiden belirle. Yeni yerde bir tanıdık, bir haritadan değerli."
    ]
  },
  {
    id: "sevdiklerim",
    ad: "Sevdiklerim için",
    ozet: "Ailem, dostum, sevdiğim biri için dua etmek istiyorum",
    renk: "#8C7BA5",
    grup: "iyi",
    ikon: "heart-outline",
    ayetler: [["30:21"], ["46:15"], ["59:10"], ["2:186"], ["13:23", "13:24"], ["40:60"], ["17:23"], ["31:14"], ["25:54"], ["52:21"], ["40:8"], ["4:1"], ["8:63"], ["49:10"]],
    dualar: [["17:24"], ["14:40", "14:41"], ["25:74"], ["2:201"], ["23:118"], ["59:10"], ["46:15"], ["3:8"]],
    sozler: [
      "Allah'ım, sevdiklerimi koru. Onlara sağlık, huzur ve hayırlı bir ömür ver. Benim göremediğim yerde sen yanlarında ol.",
      "Rabbim, anne babama merhamet et. Onlara iyilik etmeyi nasip et, kalplerini kırmaktan beni koru.",
      "Allah'ım, sevdiklerimi dünyada ve ahirette mutlu et. Aramızdaki sevgiyi senin rızan için daim eyle."
    ],
    notlar: [
      "Dua ettiğin kişiye bunu söyle. Duyulduğunu bilmek de iyi geliyor.",
      "Anne baban hayattaysa bugün ara. Duanın yanına ses de gitsin.",
      "Uzaktan edilen dua da dua; ama bir mesaj atmak onun yerine geçmiyor.",
      "Dua ediyorsun; bir de sor. “Nasılsın” sorusu duanın yanına yakışıyor.",
      "Kimseyi kurtarmak zorunda değilsin. Yanında olmak da bir şey.",
      "Kendini de listeye ekle. Sevdiklerin arasında sen de varsın."
    ]
  },
  {
    id: "yolculuk",
    ad: "Yolculuğa çıkıyorum",
    ozet: "Yola çıkıyorum ya da bir yere taşınıyorum",
    renk: "#6E8FA5",
    grup: "iyi",
    ikon: "airplane-outline",
    ayetler: [["17:80"], ["65:3"], ["2:186"], ["9:51"], ["29:20"], ["67:15"], ["16:8"], ["36:41", "36:42"], ["71:19", "71:20"], ["27:62"], ["12:64"], ["17:66"]],
    dualar: [["43:13", "43:14"], ["23:29"], ["11:41"], ["2:201"], ["3:8"], ["17:80"], ["28:22"], ["9:129"]],
    sozler: [
      "Allah'ım, yolumu aç, yolculuğumu kolaylaştır. Gittiğim yerde hayır bulmayı, döndüğümde sevdiklerime kavuşmayı nasip et.",
      "Rabbim, bu yolculukta beni ve yanımdakileri koru. Vardığım yeri bereketli kıl.",
      "Rabbim, yolum uzun ya da kısa, seninle olsun. Beni ve sevdiklerimi sağ salim kavuştur."
    ],
    notlar: [
      "Yola çıkmadan bir haber ver. Seni bekleyen birinin içi rahat etsin.",
      "Acele etme. Vaktinde varmak, erken varmaktan önemli.",
      "Gittiğin yer seni değiştirecek; buna açık git.",
      "Belgeni, ilacını, şarjını kontrol et. Tedbir de duanın bir parçası.",
      "Yolda telefonu bırak. Manzaraya bakmak için gidiyorsun.",
      "Geç kalırsan kalırsın. Acele, yolun en pahalı seçeneği."
    ]
  },
  {
    id: "affetme",
    ad: "Affetmek istiyorum",
    ozet: "Küs olduğum biri var, barışmak istiyorum",
    renk: "#A58B6E",
    grup: "iyi",
    ikon: "hand-left-outline",
    ayetler: [["42:40"], ["7:199"], ["3:134"], ["41:34"], ["15:85"], ["42:43"], ["2:263"], ["4:149"], ["3:133"], ["42:37"], ["24:22"]],
    dualar: [["59:10"], ["7:23"], ["3:16"], ["3:147"], ["23:118"], ["2:286"], ["7:151"], ["20:25", "20:26"]],
    sozler: [
      "Allah'ım, kalbimdeki kırgınlığı al. Affetmeyi nasip et; affederken beni küçültme.",
      "Rabbim, aramı düzeltmeyi nasip et. Ben affedeyim ki sen de beni affet.",
      "Allah'ım, affetmek bana ağır geliyor. Senin beni affettiğin gibi affetmeyi, kalbimi hafifletmeyi öğret."
    ],
    notlar: [
      "Affetmek, olanı onaylamak değil. Taşımayı bırakmak.",
      "İlk adımı atmak yenilmek değil. Çoğu küslük iki tarafın da beklemesinden uzuyor.",
      "Hazır değilsen zorlama. Affetmeye niyet etmek de bir başlangıç.",
      "Affetmek karşı tarafa yapılan bir iyilik değil; sen taşımayı bırakıyorsun.",
      "Konuşmadan önce ne söyleyeceğini yaz. Kırgınken doğaçlama iyi gitmiyor.",
      "Karşı taraf hazır olmayabilir. Senin attığın adım yine de senin."
    ]
  },
  {
    id: "dilek",
    ad: "Bir dileğim var",
    ozet: "İstediğim bir şey var, dua etmek istiyorum",
    renk: "#B08D57",
    grup: "iyi",
    ikon: "star-outline",
    ayetler: [["40:60"], ["2:186"], ["7:55"], ["21:90"], ["42:19"], ["65:3"], ["27:62"], ["14:34"], ["11:90"], ["40:65"], ["94:7", "94:8"], ["21:88"], ["21:84"], ["3:37"]],
    dualar: [["2:201"], ["3:8"], ["25:74"], ["18:10"], ["21:87"], ["28:24"], ["17:80"], ["20:25", "20:26"], ["2:127"]],
    sozler: [
      "Allah'ım, istediğim şeyi biliyorsun. Hakkımda hayırlıysa nasip et; değilse gönlümü ondan al, yerine daha hayırlısını ver.",
      "Rabbim, duamı işit. Kabul etmeyeceksen beklemeyi ve razı olmayı öğret bana.",
      "Rabbim, dileğimi sana açtım. Olursa şükreden, olmazsa razı olan bir kalp ver."
    ],
    notlar: [
      "Ne istediğini net söyle — kendine bile. Belirsiz dilek, belirsiz kalıyor.",
      "Dua ettiğin şey için ayrıca bir adım at. İkisi birbirinin yerine geçmiyor.",
      "Olmazsa da bir cevaptır. Hemen anlaşılmayabilir.",
      "Dileğin olursa hayatın nasıl değişir? Yaz. Bazen istediğin şey aslında başka bir şeymiş.",
      "İstemek yetmiyor; kapıyı da çal. İkisi birlikte yürüyor.",
      "Olmazsa ne yaparsın, onu da düşün. Bu umutsuzluk değil, hazırlık."
    ]
  },
  {
    id: "iliski",
    ad: "İlişkim zorda",
    ozet: "Evliliğimde ya da ilişkimde sıkıntı var",
    renk: "#96707F",
    grup: "zor",
    ikon: "heart-half-outline",
    ayetler: [["4:35"], ["49:10"], ["30:21"], ["42:43"], ["4:128"], ["3:159"], ["49:11", "49:12"], ["4:114"], ["2:263"], ["42:37"], ["41:34"], ["17:53"], ["25:63"]],
    dualar: [["25:74"], ["59:10"], ["3:8"], ["2:201"], ["23:118"], ["20:25", "20:26", "20:27", "20:28"], ["9:129"]],
    sozler: [
      "Allah'ım, aramızı düzelt. Kalplerimizi birbirine ısındır, öfkeyle söylenen sözleri unuttur.",
      "Rabbim, bu bağı hayırlıysa sürdür; değilse ikimizi de fazla incitmeden ayır.",
      "Allah'ım, evimize huzur, sözümüze yumuşaklık, kalbimize merhamet ver. Birbirimizin kıymetini bilmeyi nasip et."
    ],
    notlar: [
      "Kazanmak istediğin tartışmayla, kalmak istediğin ilişki çoğu zaman aynı yerde durmuyor.",
      "Ne istediğini söylemeden karşı tarafın anlamasını beklemek, ikinizi de yoruyor.",
      "Aranızı düzeltmek için üçüncü bir kişi gerekiyorsa bu başarısızlık değil.",
      "Bugün konuşulacak hâlde değilsen erteleyebilirsin. Ertelemek, bırakmak değil.",
      "“Sen hep” ve “sen asla” ile başlayan cümleler tartışmayı büyütüyor. Onları kes.",
      "İyi giden bir şeyi de söyle. Yalnızca şikâyet duyan kimse yaklaşmıyor."
    ]
  },
  {
    id: "cocuk",
    ad: "Çocuk istiyorum",
    ozet: "Bekliyorum, olmuyor",
    renk: "#8FA58C",
    grup: "zor",
    ikon: "flower-outline",
    ayetler: [["14:39"], ["21:89", "21:90"], ["2:186"], ["40:60"], ["3:40"], ["19:4"], ["18:46"], ["19:5", "19:6"], ["11:73"], ["25:54"], ["19:7"], ["3:39"], ["51:28", "51:29", "51:30"]],
    dualar: [["3:38"], ["37:100"], ["25:74"], ["14:40"], ["46:15"], ["21:89"], ["3:8"], ["2:201"]],
    sozler: [
      "Allah'ım, bize hayırlı bir evlat nasip et. Bu bekleyişte kalbimizi kırma, birbirimize düşürme.",
      "Rabbim, duamızı işit. Bize evlat ver; vermeyeceksen bu bekleyişle yaşamayı öğret ve gönlümüzü ferah tut.",
      "Allah'ım, Zekeriyya'nın duasını işittin, bizi de işit. Vereceğin günü sabırla, vermediğin günü rızayla karşılayalım."
    ],
    notlar: [
      "Bu bekleyişi anlamayanlara açıklamak zorunda değilsin. \"Ne zaman?\" sorusuna cevap borcun yok.",
      "Eşinle bunu konuşun. Aynı acıyı ayrı ayrı taşımak ikinizi de yalnızlaştırıyor.",
      "Tıbbi tarafı da ihmal etme. Dua tedbiri kaldırmıyor, tedbirin yanına geliyor.",
      "Bugün sadece bugünü geçir. Takvim tutmak bazı günler yaraya tuz oluyor.",
      "Sosyal medyadan bir süre uzaklaş. Herkesin müjdesi aynı anda önüne geliyor.",
      "Bugün ikinize iyi gelen bir şey yapın. Bekleyiş hayatı durdurmasın."
    ]
  },
  {
    id: "guven",
    ad: "Güvenim sarsıldı",
    ozet: "Aldatıldım, yalan söylendi, arkamdan iş çevrildi",
    renk: "#7C6A6A",
    grup: "zor",
    ikon: "unlink-outline",
    ayetler: [["12:18"], ["8:62"], ["3:186"], ["4:148"], ["4:81"], ["39:36"], ["49:6"], ["4:58"], ["61:2", "61:3"], ["16:91"], ["33:70"], ["35:43"], ["8:30"], ["12:52"]],
    dualar: [["3:173"], ["2:250"], ["12:86"], ["10:85", "10:86"], ["40:44"], ["23:118"], ["59:10"], ["9:129"], ["3:8"]],
    sozler: [
      "Allah'ım, güvenim sarsıldı. Kalbimi onar; beni bir daha kimseye güvenemeyecek hâle getirme.",
      "Rabbim, bana yapılanın hesabını sana bırakıyorum. Kin taşımaktan koru, huzurumu geri ver.",
      "Allah'ım, kırılan güvenimi onar. İnsanları doğru tartmayı, kime güveneceğimi bilmeyi öğret."
    ],
    notlar: [
      "Aldatılmak senin eksikliğin değil. Yapan kişinin tercihiydi.",
      "Hemen karar verme. Güven sarsıldığında verilen kararların çoğu öfkenin kararı oluyor.",
      "Kime güvenebileceğini yeniden öğrenmen zaman alacak. Bu normal.",
      "Olanı bir yere yaz. Sonra tekrar tekrar kafanda çevirmene gerek kalmaz.",
      "Neyi kaybettiğini yaz: kişiyi mi, kurduğun hayali mi? İkisi ayrı yas.",
      "Bir daha kimseye güvenmemeye karar verme. O ceza sana kesiliyor."
    ]
  },
  {
    id: "nazar",
    ad: "Kıskanılmaktan çekiniyorum",
    ozet: "Nazar değmesinden, kem gözden endişeleniyorum",
    renk: "#6C8497",
    grup: "zor",
    ikon: "eye-outline",
    ayetler: [["113:1", "113:2", "113:3", "113:4", "113:5"], ["12:67"], ["9:51"], ["65:3"], ["2:255"], ["3:120"], ["10:107"], ["35:2"], ["41:36"], ["7:201"], ["12:64"], ["68:51"], ["4:54"]],
    dualar: [["114:1", "114:2", "114:3", "114:4", "114:5", "114:6"], ["23:97", "23:98"], ["3:173"], ["2:201"], ["3:8"], ["9:129"], ["7:200"], ["23:118"]],
    sozler: [
      "Allah'ım, hased edenin şerrinden sana sığınırım. Beni, ailemi ve bana verdiğin nimeti koru.",
      "Rabbim, elimdekinin kıymetini bilmeyi nasip et. Korkuyla değil, sana güvenerek yaşamayı ver.",
      "Allah'ım, beni ve sevdiklerimi her türlü kem gözden, kötü niyetten ve hasedin şerrinden koru."
    ],
    notlar: [
      "Sevindiğin her şeyi herkese anlatmak zorunda değilsin. Bu bir tedbir, korku değil.",
      "Kimin ne düşündüğünü kontrol edemezsin; neyi anlattığını edebilirsin.",
      "Başına gelen her aksiliğin arkasında birini aramak, seni asıl yoran şey olabilir.",
      "Kaygın gündelik hayatını kesiyorsa bu artık nazardan değil, kaygıdan konuşmak gerektiğini gösterir.",
      "Uykusuzluk, yorgunluk, stres — aksiliklerin çoğunun daha yakın bir açıklaması var.",
      "Kendini korumak için birilerini suçlamak zorunda değilsin."
    ]
  },
  {
    id: "ozlem",
    ad: "Özlüyorum",
    ozet: "Uzaktaki birini ya da memleketimi özledim",
    renk: "#7E88A5",
    grup: "zor",
    ikon: "home-outline",
    ayetler: [["12:84"], ["12:96"], ["28:13"], ["2:186"], ["12:83"], ["65:3"], ["12:93"], ["12:99"], ["28:10"], ["94:5", "94:6"], ["12:87"], ["28:7"]],
    dualar: [["12:86"], ["25:74"], ["2:201"], ["3:8"], ["21:87"], ["9:129"], ["23:118"]],
    sozler: [
      "Allah'ım, özlediğimi koru. Aramızdaki mesafeyi hayra çevir, kavuşmayı nasip et.",
      "Rabbim, bu özlem kalbimi yormasın. Görüşene kadar ikimize de sabır ve sağlık ver.",
      "Rabbim, özlediğimi sana emanet ettim. Hasretimi dua eyle, kavuşmayı yakın kıl."
    ],
    notlar: [
      "Özlemek, sevdiğinin devam ettiği anlamına geliyor. Kötü bir şey değil.",
      "Bugün ara. Kısa konuşma da konuşmadır.",
      "Uzaklık kalıcı değilse geri sayma; kalıcıysa da her gün aynı ağırlıkta olmayacak.",
      "Özlediğin şeyin bir parçasını buraya taşı: bir yemek, bir şarkı, bir alışkanlık.",
      "Bir mektup yaz, göndermesen de. Özlem yazıya dökülünce yer değiştiriyor.",
      "Görüşeceğiniz bir tarih koy. Belirsiz özlem daha ağır."
    ]
  },

  /* ---- 2026 Eylul genislemesi ---- */

  {
    id: "yorgunluk",
    ad: "Tükendim",
    ozet: "Çok yoruldum, gücüm kalmadı",
    renk: "#6F7E96",
    grup: "zor",
    ikon: "battery-dead-outline",
    ayetler: [["2:286"], ["94:5", "94:6"], ["94:7", "94:8"], ["20:2"], ["13:28"], ["3:139"], ["2:153"], ["35:34", "35:35"], ["39:10"], ["16:97"], ["29:69"], ["2:45"], ["65:3"]],
    dualar: [["2:286"], ["20:25", "20:26"], ["2:250"], ["21:83"], ["3:8"], ["21:87"], ["9:129"], ["23:118"]],
    sozler: [
      "Allah'ım, gücüm tükendi. Taşıyamadığımı senin önüne bırakıyorum; bana yeniden ayağa kalkacak kadar kuvvet ver.",
      "Rabbim, yorgunluğum yalnızca bedenimde değil. Kalbimi dinlendir, zihnimi sustur, bana nefes alacak bir aralık aç.",
      "Allah'ım, her şeye yetişmeye çalışırken kendimi unuttum. Bana durmayı, dinlenmeyi ve bunun için kendimi suçlamamayı öğret."
    ],
    notlar: [
      "Dinlenmek tembellik değil. Dinlenmeyen biri kimseye faydalı olamaz, kendine bile.",
      "Bugün yapman gerekenlerden birini sil. Dünya yerinde duracak.",
      "“Hayır” demek de bir cümle. Açıklamasız da olur.",
      "Bu hafta ne zaman gerçekten uyudun? Önce onu düzelt.",
      "Tükenmişlik bir karakter kusuru değil; uzun süre fazla taşımanın sonucu.",
      "Birinden yardım iste. Yükü bölmek, yükü bırakmaktan kolay."
    ]
  },
  {
    id: "uykusuzluk",
    ad: "Uyuyamıyorum",
    ozet: "Gece oldu, zihnim susmuyor",
    renk: "#4A5A88",
    grup: "zor",
    ikon: "moon-outline",
    ayetler: [["78:9"], ["25:47"], ["30:23"], ["2:255"], ["13:28"], ["39:42"], ["6:60"], ["3:190", "3:191"], ["17:79"], ["51:17", "51:18"], ["32:16"], ["25:64"]],
    dualar: [["114:1", "114:2", "114:3", "114:4", "114:5", "114:6"], ["113:1", "113:2", "113:3", "113:4", "113:5"], ["23:97", "23:98"], ["3:193"], ["2:286"], ["2:201"], ["3:8"], ["9:129"]],
    sozler: [
      "Allah'ım, gözlerim kapanmıyor ama sen uyumayansın. Beni sana bırakıyorum; zihnimi sustur, kalbime sükûnet ver.",
      "Rabbim, gündüzün yükünü geceye taşıdım. Onu senin katına bırakıp uyumayı nasip et.",
      "Allah'ım, bu uykusuz geceyi hayra çevir. Uyuyamıyorsam seni anayım, andıkça huzur bulayım."
    ],
    notlar: [
      "Ekranı kapat. Işık, beynine hâlâ gündüz olduğunu söylüyor.",
      "Aklındakileri bir kâğıda yaz. Yarın orada olacaklar; şimdi taşımana gerek yok.",
      "Yatakta yirmi dakikadır uyuyamıyorsan kalk, loş ışıkta sakin bir şey yap, sonra dön.",
      "Nefesini say: dört saniye al, yedi saniye tut, sekiz saniyede ver.",
      "Uyuyamamak bir felaket değil. Dinlenerek uzanmak da bedenine iyi geliyor.",
      "Yarın aynı saatte kalk. Uyku düzeni sabahtan kuruluyor."
    ]
  },
  {
    id: "degersizlik",
    ad: "Kendimi değersiz hissediyorum",
    ozet: "Yetersizim, kimseye bir faydam yok gibi",
    renk: "#7D6F9A",
    grup: "zor",
    ikon: "diamond-outline",
    ayetler: [["17:70"], ["95:4"], ["49:13"], ["2:30"], ["3:139"], ["93:3"], ["6:165"], ["31:20"], ["40:64"], ["15:29"], ["2:186"], ["64:3"], ["50:16"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["27:19"], ["3:8"], ["1:6", "1:7"], ["26:83", "26:84", "26:85"], ["28:24"], ["9:129"]],
    sozler: [
      "Allah'ım, beni sen yarattın ve boşuna yaratmadın. Kendime senin baktığın gibi bakmayı öğret.",
      "Rabbim, başkalarıyla kıyaslamaktan yoruldum. Bana verdiğini görmeyi, onunla bir iyilik yapmayı nasip et.",
      "Allah'ım, kusurlarımı biliyorsun, yine de bana kapını kapatmadın. Ben de kendime kapımı kapatmayayım."
    ],
    notlar: [
      "Değerin yaptıklarının toplamı değil. Başarısız bir gün seni daha az insan yapmaz.",
      "Kendine, en yakın arkadaşına konuşacağın gibi konuş.",
      "Bugün birine küçük bir iyilik yap. Faydalı olduğunu görmenin en kısa yolu bu.",
      "Sosyal medyada gördüğün şey başkalarının vitrini; sen kendi deponla kıyaslıyorsun.",
      "Seni sevenlerden birine “bende neyi seversin?” diye sor. Cevap seni şaşırtabilir.",
      "Bu his uzun süredir geçmiyorsa bir uzmanla konuşmak zayıflık değil, özen."
    ]
  },
  {
    id: "evlat",
    ad: "Çocuğum için endişeliyim",
    ozet: "Evladımın sağlığı, geleceği, gidişatı içimi yakıyor",
    renk: "#7C9A8C",
    grup: "zor",
    ikon: "people-outline",
    ayetler: [["12:64"], ["12:67"], ["12:18"], ["31:17"], ["20:132"], ["64:15"], ["52:21"], ["18:82"], ["28:7"], ["28:13"], ["65:3"], ["2:186"]],
    dualar: [["25:74"], ["14:40", "14:41"], ["2:128"], ["46:15"], ["14:35"], ["37:100"], ["3:8"], ["2:201"]],
    sozler: [
      "Allah'ım, evladımı sana emanet ediyorum. Benim göremediğim yerde sen onu koru, benim yetişemediğim yerde sen yetiş.",
      "Rabbim, çocuğumun kalbini hayra aç. Ona iyi arkadaşlar, doğru yollar ve sağlıklı bir ömür nasip et.",
      "Allah'ım, onu yetiştirirken bana sabır ve hikmet ver. Endişemi sevgime, sevgimi doğru sözlere çevir."
    ],
    notlar: [
      "Endişen sevginden geliyor; ama çocuğun endişeni değil sevgini hissetmeli.",
      "Bugün soru sormadan dinle. Anlatmak isteyene kapıyı açık tut.",
      "Her şeyi kontrol edemezsin. Yapabildiğin kadarını yap, gerisini emanet et.",
      "Bir uzmana danışmak, iyi bir anne babanın yapacağı şeydir.",
      "Onunla beraber sevdiği bir şeyi yap. Bağ, nasihatten önce gelir.",
      "Kendi yorgunluğunu da ciddiye al. Tükenmiş bir ebeveyn kimseyi taşıyamaz."
    ]
  },
  {
    id: "es",
    ad: "Hayırlı bir eş arıyorum",
    ozet: "Evlenmek, yuva kurmak istiyorum",
    renk: "#B07A8C",
    grup: "iyi",
    ikon: "ribbon-outline",
    ayetler: [["30:21"], ["4:1"], ["78:8"], ["51:49"], ["36:36"], ["2:186"], ["65:3"], ["24:26"], ["25:54"], ["16:72"]],
    dualar: [["25:74"], ["28:24"], ["2:201"], ["21:89"], ["3:8"], ["18:10"], ["20:25", "20:26"]],
    sozler: [
      "Allah'ım, bana dinimde ve dünyamda hayırlı bir eş nasip et. Birbirimize huzur olalım, yük değil.",
      "Rabbim, aceleyle yanlış kapıya gitmekten koru. Hakkımda hayırlı olanı kolaylaştır, olmayanı gönlümden al.",
      "Allah'ım, bu bekleyişte beni yalnız bırakma. Doğru kişi gelene kadar kendimi de o yuvaya hazırlamayı nasip et."
    ],
    notlar: [
      "Aradığın kişinin özelliklerini yaz; sonra kendine bak, sen de onlara sahip misin?",
      "Güvendiğin insanlara niyetini söyle. Hayırlı kapılar çoğu zaman tanıdıklardan açılıyor.",
      "Acele etme. Yanlış kişiyle geçen yıllar, beklemekten ağır.",
      "Karakter, ilk tanışmada değil zor bir günde görünür.",
      "Evlilik bir yalnızlık ilacı değil; yanına iyi bir hayat götürdüğün bir yol.",
      "Bekarken de hayat yaşanıyor. Bu dönemi ertelenmiş bir bekleme odası gibi görme."
    ]
  },
  {
    id: "bebek",
    ad: "Bebek bekliyoruz",
    ozet: "Anne ya da baba olacağım",
    renk: "#8FB09A",
    grup: "iyi",
    ikon: "happy-outline",
    ayetler: [["7:189"], ["31:14"], ["16:78"], ["23:12", "23:13", "23:14"], ["19:23", "19:24", "19:25", "19:26"], ["13:8"], ["3:6"], ["39:6"], ["76:2"], ["16:72"], ["46:15"]],
    dualar: [["3:35"], ["3:36"], ["3:38"], ["25:74"], ["14:40"], ["37:100"], ["2:128"], ["2:201"]],
    sozler: [
      "Allah'ım, bu emaneti sağlıkla kucağımıza ver. Doğumu kolaylaştır, anneyi ve bebeği koru.",
      "Rabbim, bu çocuğu salihlerden, bize göz aydınlığı olanlardan eyle. Onu iyi yetiştirmeyi bize nasip et.",
      "Allah'ım, korkularımı sen biliyorsun. Beni sakin, evimizi huzurlu, kalbimizi şükreden kıl."
    ],
    notlar: [
      "Kontrollerini aksatma; soru sormaktan çekinme.",
      "Uyu, dinlen, yardım kabul et. Şu an en önemli işin bu.",
      "Her şey hazır olmak zorunda değil. Bebekler eksik odalara da sevgiyle geliyor.",
      "Eşinle korkularınızı konuşun. İkinizin de aklından geçenler birbirine benziyor olabilir.",
      "Doğumdan sonraki haftalar için şimdiden bir yardım planı yap.",
      "Herkes tavsiye verecek. Dinle, teşekkür et, doktorunla karar ver."
    ]
  },
  {
    id: "basari",
    ad: "Başardım",
    ozet: "Emeğimin karşılığını aldım",
    renk: "#C2A052",
    grup: "iyi",
    ikon: "trophy-outline",
    ayetler: [["27:40"], ["14:7"], ["93:11"], ["16:53"], ["57:23"], ["31:18"], ["17:37"], ["110:1", "110:2", "110:3"], ["18:39"], ["39:49"], ["28:77"], ["53:39", "53:40"]],
    dualar: [["27:19"], ["46:15"], ["2:201"], ["17:80"], ["3:8"], ["1:2", "1:3", "1:4"], ["2:127"]],
    sozler: [
      "Allah'ım, bu başarı senin lütfun. Beni şımartma, emeği olanları unutturma.",
      "Rabbim, verdiğin bu imkânı hayırda kullanmayı nasip et. Başarımı başkalarına da faydaya çevir.",
      "Allah'ım, bu sevinci kalıcı kıl, kibirden koru. Bir sonraki adımda da beni yalnız bırakma."
    ],
    notlar: [
      "Yolda sana yardım edenlerin listesini yap ve en az birine teşekkür et.",
      "Kutla. Başarıyı hemen bir sonraki hedefin altına gömme.",
      "Bu başarıyı sağlayan alışkanlığı yaz. Onu korumak, sonucu korumaktan önemli.",
      "Henüz başaramamış birine elini uzat. Senin aldığın yardım da bir yerden gelmişti.",
      "Şükür, başarıyı küçültmek değil; kaynağını hatırlamak.",
      "Başarı da bir imtihan. Onunla ne yapacağın asıl sonucu belirliyor."
    ]
  },
  {
    id: "sabah",
    ad: "Güne başlıyorum",
    ozet: "Yeni güne bir ayetle başlamak istiyorum",
    renk: "#D09A5B",
    grup: "iyi",
    ikon: "partly-sunny-outline",
    ayetler: [["30:17", "30:18"], ["33:41", "33:42"], ["6:96"], ["20:130"], ["50:39"], ["17:78"], ["93:1", "93:2", "93:3"], ["81:18"], ["62:10"], ["67:15"], ["11:6"], ["2:152"]],
    dualar: [["17:80"], ["20:25", "20:26", "20:27", "20:28"], ["1:6", "1:7"], ["2:201"], ["3:26", "3:27"], ["23:29"], ["113:1", "113:2", "113:3", "113:4", "113:5"], ["3:8"]],
    sozler: [
      "Allah'ım, bu yeni günü bana hayırla aç. Dilimi doğru söze, elimi iyi işe, kalbimi sana yönelt.",
      "Rabbim, bugün karşılaşacağım her şeyde beni yalnız bırakma. Kolay olanı şükürle, zor olanı sabırla karşılamayı nasip et.",
      "Allah'ım, bugün birine iyilik etmeyi, kimsenin kalbini kırmamayı ve akşam sana yüzü ak dönmeyi nasip et."
    ],
    notlar: [
      "Telefona bakmadan önce beş dakika kendine ayır.",
      "Bugünün en önemli tek işini seç. Gerisi bonus.",
      "Güne bir bardak su ve bir iyi niyetle başla.",
      "Bugün teşekkür edeceğin bir kişi seç.",
      "Sabah düşüncesi günün tonunu belirliyor; ilk cümleni kendin seç.",
      "Akşam bu kartı tekrar aç. Sabah niyet ettiğinle günün nasıl geçtiğine bak."
    ]
  },

  /* ---- kalp: ic dunya ve ibadet ---- */

  {
    id: "iman",
    ad: "İmanım zayıfladı",
    ozet: "Şüphelerim var, kalbim eskisi gibi değil",
    renk: "#5C7FA0",
    grup: "kalp",
    ikon: "bulb-outline",
    ayetler: [["2:260"], ["3:190", "3:191"], ["41:53"], ["57:16"], ["13:28"], ["29:2", "29:3"], ["2:186"], ["8:2"], ["39:23"], ["6:125"], ["2:256"], ["49:7"], ["14:24", "14:25"]],
    dualar: [["3:8"], ["1:6", "1:7"], ["3:193"], ["3:53"], ["66:8"], ["20:114"], ["3:16"], ["2:285"]],
    sozler: [
      "Allah'ım, kalbim eskisi gibi değil. Onu bana yeniden sevdir; beni senden uzaklaştıran her şeyden uzaklaştır.",
      "Rabbim, soru sormaktan korkmuyorum; cevapsız kalmaktan korkuyorum. Beni hakikate ulaştır, kalbimi yatıştır.",
      "Allah'ım, bir zamanlar hissettiğim yakınlığı geri ver. Küçük bir adım atayım, sen bana yürüyerek gel."
    ],
    notlar: [
      "Şüphe, düşünen bir kalbin işi. Sormaktan korkma; ama cevabı doğru yerde ara.",
      "Güvendiğin, bilgili birine sorularını açıkça sor.",
      "İman bir his değil, bir yol. Hissetmediğin günlerde de yürünüyor.",
      "Bugün kısa bir sûreyi anlamını okuyarak oku. Tek ayet bile yeter.",
      "Dışarı çık, gökyüzüne bak. Kur'an da bizi defalarca oraya bakmaya çağırıyor.",
      "Kalbin kuruduğunu fark etmen, hâlâ canlı olduğunu gösteriyor."
    ]
  },
  {
    id: "ibadet",
    ad: "İbadetlerim aksıyor",
    ozet: "Namazım, zikrim eskisi gibi değil",
    renk: "#4F8A7E",
    grup: "kalp",
    ikon: "time-outline",
    ayetler: [["2:45"], ["20:14"], ["29:45"], ["2:153"], ["70:19", "70:20", "70:21", "70:22", "70:23"], ["23:1", "23:2"], ["2:238"], ["17:78"], ["19:59", "19:60"], ["2:152"], ["7:205"], ["57:16"], ["29:69"]],
    dualar: [["14:40", "14:41"], ["2:128"], ["1:6", "1:7"], ["3:8"], ["20:114"], ["27:19"], ["3:147"], ["23:118"]],
    sozler: [
      "Allah'ım, sana dönmek istiyorum ama ayaklarım ağır. Beni namazı kılanlardan eyle, huşuyu kalbime yerleştir.",
      "Rabbim, eksik kalan ibadetlerimi affet. Bugünden başlamayı ve sebat etmeyi nasip et.",
      "Allah'ım, ibadeti bana yük değil, dinlenme yeri kıl. Seninle buluşmayı özler hâle getir."
    ],
    notlar: [
      "Hepsini birden düzeltmeye çalışma. Bugün bir vakti vaktinde kıl.",
      "Aksattığın için kendini dışarıda sayma. Kapı her vakit yeniden açılıyor.",
      "Namazı bir alarma bağla; alışkanlık niyetten daha uzun dayanıyor.",
      "Okuduğunun anlamını öğren. Anlamını bildiğin söz daha kolay huşu getiriyor.",
      "Bir arkadaşınla beraber başlayın. Birbirinize hatırlatın.",
      "Kısa ama düzenli, uzun ama arada bir olandan daha değerli."
    ]
  },
  {
    id: "nefis",
    ad: "Nefsime yeniliyorum",
    ozet: "Bırakmak istediğim bir alışkanlık, bir günah var",
    renk: "#8A6F5C",
    grup: "kalp",
    ikon: "shield-half-outline",
    ayetler: [["12:53"], ["79:40", "79:41"], ["29:45"], ["4:28"], ["3:135"], ["39:53"], ["7:201"], ["11:114"], ["91:7", "91:8", "91:9", "91:10"], ["24:21"], ["29:69"], ["25:70"], ["2:268"]],
    dualar: [["12:33"], ["7:23"], ["3:147"], ["23:97", "23:98"], ["3:193"], ["66:8"], ["2:286"], ["3:8"]],
    sozler: [
      "Allah'ım, nefsime yeniliyorum ve bunu sen biliyorsun. Bana güç ver; tek başıma kalırsam düşerim.",
      "Rabbim, beni bu alışkanlıktan kurtar. Her düştüğümde yeniden kalkmayı ve sana dönmeyi nasip et.",
      "Allah'ım, gözümü, dilimi, elimi haramdan koru. Kalbimi sana ait olmayan şeylere bağlama."
    ],
    notlar: [
      "Tetikleyiciyi bul: hangi saat, hangi yer, hangi his? Çoğu düşüş aynı kapıdan geliyor.",
      "Yalnızken daha zor. Güvendiğin birine söyle, hesap sorabileceği biri olsun.",
      "Düştün diye bırakma. Tövbe bir kere değil, her seferinde.",
      "Kötü alışkanlığı sadece bırakma; yerine bir şey koy. Boşluk eskiyi geri çağırıyor.",
      "Sayaç tutma, suçluluk biriktirme. Bugünü temiz geçir, yeter.",
      "Bağımlılık seviyesindeyse profesyonel destek almak da bir mücadele biçimi."
    ]
  },
  {
    id: "kiskanclik",
    ad: "Kıskanıyorum",
    ozet: "Başkasına verilene gözüm takılıyor",
    renk: "#6F8F5E",
    grup: "kalp",
    ikon: "eye-off-outline",
    ayetler: [["4:32"], ["20:131"], ["15:88"], ["43:32"], ["57:23"], ["17:30"], ["28:79", "28:80"], ["59:9"], ["3:26"], ["57:20"], ["18:46"]],
    dualar: [["59:10"], ["3:8"], ["27:19"], ["2:201"], ["23:118"], ["3:147"], ["20:25", "20:26"]],
    sozler: [
      "Allah'ım, başkasına verdiğin nimete gözümü dikmekten koru. Bana verdiğini görmeyi ve ona razı olmayı nasip et.",
      "Rabbim, kalbimdeki bu kıskançlığı temizle. Kardeşimin sevincine sevinebilen bir kalp ver.",
      "Allah'ım, sen herkese hikmetinle veriyorsun. Kıyaslamayı bırakıp kendi yoluma bakmayı öğret."
    ],
    notlar: [
      "Kıskandığın kişi için içinden bir hayır dua et. Zor ama kalbi en hızlı temizleyen şey bu.",
      "Kıskançlık sana ne istediğini söylüyor. O isteği kendi yolunda nasıl kurabilirsin?",
      "Gördüğün şey onun bütün hayatı değil; bedelini görmüyorsun.",
      "Bugün kendi nimetlerinden üçünü yaz.",
      "Seni sürekli kıyaslamaya iten hesapları bir süre sessize al.",
      "Başkasının kazancı senin kaybın değil. Rızık bir yarış değil."
    ]
  },
  {
    id: "anlam",
    ad: "Anlam arıyorum",
    ozet: "Neden buradayım, ne için yaşıyorum?",
    renk: "#6A7FA8",
    grup: "kalp",
    ikon: "compass-outline",
    ayetler: [["51:56"], ["67:2"], ["23:115"], ["6:162", "6:163"], ["29:64"], ["57:20"], ["75:36"], ["2:156"], ["76:2", "76:3"], ["90:4"], ["84:6"], ["45:22"], ["2:30"]],
    dualar: [["1:6", "1:7"], ["3:191"], ["3:8"], ["20:114"], ["2:201"], ["26:83", "26:84", "26:85"], ["27:19"]],
    sozler: [
      "Allah'ım, beni boşuna yaratmadığını biliyorum. Neden burada olduğumu bana göster, gösterdiğinde yürümeyi nasip et.",
      "Rabbim, günlerim birbirine benziyor. Hayatıma bir yön, işlerime bir anlam ver.",
      "Allah'ım, dünyanın gürültüsünde seni kaybetmeyeyim. Her yaptığımı senin rızana bağla."
    ],
    notlar: [
      "Anlam bazen büyük bir cevapta değil, bugün yaptığın küçük bir iyilikte.",
      "Kimin hayatına dokunuyorsun? Listele. Sandığından uzun çıkacak.",
      "Bu soruyu sormak boşluk değil; derinleşmek isteyen bir kalbin işareti.",
      "Ölüm döşeğinde neyi yapmış olmak isterdin? Onu bugün küçük bir adımla başlat.",
      "Yalnız düşünme. Bu soruları sormuş insanların yazdıklarını oku.",
      "Bir süre üretmek yerine vermeyi dene: zaman, emek, dikkat."
    ]
  },
  {
    id: "tefekkur",
    ad: "Tefekkür etmek istiyorum",
    ozet: "Yaratılışa, göğe, hayata hayranlıkla bakıyorum",
    renk: "#4E8FA0",
    grup: "kalp",
    ikon: "planet-outline",
    ayetler: [["3:190", "3:191"], ["67:3", "67:4"], ["30:22"], ["21:30"], ["50:6", "50:7"], ["88:17", "88:18", "88:19", "88:20"], ["36:38", "36:39", "36:40"], ["24:35"], ["6:95", "6:96"], ["55:5", "55:6", "55:7"], ["41:53"], ["30:20"]],
    dualar: [["3:193"], ["20:114"], ["27:19"], ["1:2", "1:3", "1:4"], ["17:111"], ["2:201"], ["3:8"]],
    sozler: [
      "Allah'ım, yarattığın her şeyde senin izini görmeyi nasip et. Bakan değil, gören bir göz ver.",
      "Rabbim, gökyüzüne her bakışımda kalbim sana yönelsin. Hayranlığımı şükre çevir.",
      "Allah'ım, ilmimi artır. Bildiğim her yeni şey beni sana biraz daha yaklaştırsın."
    ],
    notlar: [
      "Bu akşam beş dakika gökyüzüne bak. Hiçbir şey düşünmeden, sadece bak.",
      "Bir yaprağı, bir karıncayı, bir bulutu yakından incele. Tefekkür dikkatle başlıyor.",
      "Doğada yürü, telefonu cebinde bırak.",
      "Okuduğun ayetin anlattığı şeyi bugün gözünle görmeye çalış.",
      "Bilim ve hayranlık birbirinin düşmanı değil; ne kadar çok bilirsen o kadar çok hayret edersin.",
      "Gördüğün bir güzelliği bir yere not et. Hafızan onu saklasın."
    ]
  }
];

/* Ana ekranin ustunde duran ayet. Uygulamanin ne yaptigini tek ayette anlatan
 * yer: "Bana dua edin, size karsilik vereyim." */
const GIRIS_AYETI = "40:60";

module.exports = { CEVIRI, HALLER, GIRIS_AYETI };
