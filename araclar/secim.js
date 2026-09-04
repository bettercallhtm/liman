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
    ayetler: [["94:5", "94:6"], ["13:28"], ["65:3"], ["2:286"], ["9:51"], ["3:160"], ["8:10"], ["33:3"], ["64:13"], ["12:64"], ["39:38"]],
    dualar: [["20:25", "20:26"], ["3:173"], ["2:201"]],
    sozler: [
      "Allah'ım, içimdeki bu daralmayı sen biliyorsun. Göğsümü genişlet, korktuğum şeyle beni imtihan etme. Yarını taşıyacak gücü değil, bugünü geçirecek gücü ver bana.",
      "Rabbim, aklımdan geçen kötü ihtimalleri senin bilgine bırakıyorum. Elimde olanı yapmayı, olmayanı bırakmayı nasip et."
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
    ayetler: [["9:40"], ["12:86"], ["93:3"], ["93:5"], ["3:139"], ["2:153"], ["15:97", "15:98"], ["28:7"], ["10:62"], ["35:34"], ["21:83", "21:84"]],
    dualar: [["21:87"], ["3:8"], ["2:201"]],
    sozler: [
      "Allah'ım, bu ağırlığı taşıyacak gücüm kalmadı. Kalbimi hafiflet, kimseye anlatamadığım bu hüznü sen benden al.",
      "Rabbim, üzüntümü senden başkasına anlatamıyorum; sen zaten biliyorsun. Bugünü geçirecek kadar sabır, yarına bakacak kadar umut ver."
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
    ayetler: [["3:175"], ["20:46"], ["41:30"], ["2:112"], ["9:51"], ["33:39"], ["2:38"], ["46:13"], ["27:62"], ["6:17"], ["35:2"]],
    dualar: [["20:45", "20:46"], ["23:97", "23:98"], ["3:173"]],
    sozler: [
      "Allah'ım, korktuğum şeyin şerrinden sana sığınırım. Kalbime güven ver, korkumun her şeyi olduğundan büyük göstermesine izin verme.",
      "Rabbim, başıma geleceği yalnız sen bilirsin. Korkumu al, yerine sana güvenmeyi koy."
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
    ayetler: [["3:134"], ["41:34"], ["42:43"], ["7:199"], ["25:63"], ["42:37"], ["23:96"], ["28:54"], ["13:22"], ["41:35"]],
    dualar: [["7:200"], ["59:10"], ["23:97", "23:98"]],
    sozler: [
      "Allah'ım, içimdeki bu öfkeyi dindir. Pişman olacağım bir söz söylemekten, geri alamayacağım bir şey yapmaktan beni koru.",
      "Rabbim, haklı olduğum yerde bile insafımı kaybettirme. Öfkemi sustur, aklımı konuştur."
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
    ayetler: [["50:16"], ["2:186"], ["57:4"], ["9:40"], ["93:3"], ["58:7"], ["6:59"], ["93:6", "93:7", "93:8"], ["3:103"], ["39:36"]],
    dualar: [["21:89"], ["25:74"], ["23:118"]],
    sozler: [
      "Allah'ım, kimsenin olmadığı yerde sen varsın. İçimdeki bu boşluğu doldur, beni yalnızlığımla baş başa bırakma.",
      "Rabbim, bana hayırlı dostlar nasip et. Kimsenin görmediğini senin gördüğünü bilmenin huzurunu kalbime yerleştir."
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
    grup: "zor",
    ayetler: [["39:53"], ["20:82"], ["4:110"], ["66:8"], ["3:135"], ["25:70"], ["42:25"], ["9:104"], ["40:3"], ["2:160"], ["11:3"]],
    dualar: [["7:23"], ["28:16"], ["3:16"]],
    sozler: [
      "Allah'ım, yaptığımdan pişmanım. Beni bağışla, aynı yere bir daha düşürme. Kırdığım kalpleri onarmayı bana nasip et.",
      "Rabbim, kendimi affedemiyorum. Sen bağışlayanların en hayırlısısın; beni bağışla, kendimle barışmayı da bana ver."
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
    ayetler: [["14:7"], ["16:18"], ["2:152"], ["55:13"], ["93:11"], ["31:12"], ["16:78"], ["2:172"], ["39:66"], ["17:70"], ["30:50"]],
    dualar: [["27:19"], ["46:15"], ["2:201"]],
    sozler: [
      "Allah'ım, bana verdiklerinin farkında olmayı nasip et. Şükrümü dilimde bırakma, davranışıma geçir.",
      "Rabbim, sayamadığım nimetlerin için hamdolsun. Elimdekinin kıymetini kaybetmeden bilmeyi öğret bana."
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
    ayetler: [["39:53"], ["12:87"], ["94:5", "94:6"], ["65:3"], ["2:214"], ["15:56"], ["29:69"], ["93:4"], ["57:22", "57:23"], ["42:28"]],
    dualar: [["3:8"], ["21:87"], ["18:10"]],
    sozler: [
      "Allah'ım, benim umudum tükendi ama senin rahmetin tükenmez. Kalbime bir aralık aç, bu karanlıktan çıkacak yolu göster.",
      "Rabbim, bugünü geçirecek gücü ver. Yarını düşünecek hâlim yok; sen benim yerime bak."
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
    ayetler: [["26:80"], ["17:82"], ["2:155", "2:156", "2:157"], ["10:57"], ["64:11"], ["3:139"], ["16:69"], ["6:17"], ["27:62"], ["94:5", "94:6"]],
    dualar: [["21:83"], ["23:118"], ["2:286"]],
    sozler: [
      "Allah'ım, şifa senden. Bedenime şifa, kalbime sabır ver. Bu ağrıyı hafiflet, geçmesini nasip et.",
      "Rabbim, hasta olmak beni yalnızlaştırmasın. İyileşmeyi, iyileşene kadar da dayanacak sabrı ver."
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
    ayetler: [["2:155", "2:156", "2:157"], ["3:185"], ["21:35"], ["89:27", "89:28", "89:29", "89:30"], ["13:23", "13:24"], ["29:57"], ["39:42"], ["23:15", "23:16"], ["40:39"], ["3:145"]],
    dualar: [["2:156"], ["59:10"], ["14:41"]],
    sozler: [
      "Allah'ım, kaybettiğimi sana emanet ediyorum. Onu bağışla, rahmetinle kuşat. Bana da onsuz yaşamayı öğret.",
      "Rabbim, bu acı çok büyük. Kalbimi teselli et; ardından onu hayırla anmayı nasip et."
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
    ayetler: [["2:153"], ["39:10"], ["70:5"], ["30:60"], ["12:83"], ["11:115"], ["52:48"], ["2:45"], ["103:1", "103:2", "103:3"], ["94:7", "94:8"]],
    dualar: [["2:250"], ["7:126"], ["40:60"]],
    sozler: [
      "Allah'ım, sonucu bilmiyorum ama senin bildiğine güveniyorum. Beklerken sabrımı, sonuç geldiğinde rızamı koru.",
      "Rabbim, bu bekleyişi hayırla bitir. Hakkımda hayırlıysa kolaylaştır, değilse gönlümü ondan al."
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
    ayetler: [["39:18"], ["3:159"], ["65:3"], ["42:10"], ["2:269"], ["9:51"], ["42:38"], ["17:36"], ["39:9"], ["33:3"]],
    dualar: [["18:10"], ["20:25", "20:26", "20:27", "20:28"], ["3:8"]],
    sozler: [
      "Allah'ım, hangi yolun hayırlı olduğunu bilmiyorum. Kalbimi doğru olana meylettir, yanlış olandan uzaklaştır.",
      "Rabbim, karar vermek bana ağır geliyor. Doğruyu göster; gösterdiğinde arkasında durma gücünü de ver."
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
    ayetler: [["94:5", "94:6"], ["2:286"], ["53:39"], ["18:23", "18:24"], ["3:139"], ["92:5", "92:6", "92:7"], ["87:8"], ["9:105"], ["13:11"], ["2:45"], ["39:9"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["20:114"], ["2:201"]],
    sozler: [
      "Allah'ım, göğsümü genişlet, işimi kolaylaştır. Öğrendiklerimi ihtiyaç anında hatırlat, yorulduğumda beni ayakta tut.",
      "Rabbim, elimden geleni yapmayı nasip et; gerisini senden bekliyorum. Sonuç ne olursa hayırlısını ver."
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
    ayetler: [["42:41", "42:42"], ["14:42"], ["16:126", "16:127"], ["4:148"], ["22:60"], ["4:135"], ["5:8"], ["21:47"], ["4:40"], ["42:39"]],
    dualar: [["10:85", "10:86"], ["2:250"], ["40:44"]],
    sozler: [
      "Allah'ım, bana yapılanı sen biliyorsun. Hakkımı ver, ama beni de zalimleştirme.",
      "Rabbim, uğradığım haksızlık kalbimi karartmasın. Adaletini göster; o güne kadar sabrımı koru."
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
    ayetler: [["65:3"], ["29:60"], ["11:6"], ["51:22"], ["94:5", "94:6"], ["2:186"], ["17:30"], ["34:39"], ["30:37"], ["20:132"], ["3:27"]],
    dualar: [["28:24"], ["2:201"], ["3:173"]],
    sozler: [
      "Allah'ım, sıkıntımı biliyorsun. Beni helâlinden rızıklandır, borcumu ödemeyi nasip et, kimseye muhtaç etme.",
      "Rabbim, darlığı genişliğe çevir. Elimdekiyle yetinmeyi, eline geçeni bereketli kılmayı ver."
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
    ayetler: [["13:28"], ["89:27", "89:28"], ["48:4"], ["6:82"], ["25:63"], ["16:97"], ["20:130"], ["76:25", "76:26"], ["3:191"], ["39:23"]],
    dualar: [["25:74"], ["3:8"], ["20:25", "20:26"]],
    sozler: [
      "Allah'ım, kalbimi sakinleştir. Zihnimdeki gürültüyü dindir, bana kendimle baş başa kalabileceğim bir sükûnet ver.",
      "Rabbim, telaşımı al. Yavaşlamayı, durmayı ve durduğum yerde huzur bulmayı nasip et."
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
    ayetler: [["10:58"], ["27:40"], ["93:11"], ["2:152"], ["35:34"], ["14:7"], ["108:1"], ["55:60"], ["16:97"], ["3:174"]],
    dualar: [["27:19"], ["14:41"], ["2:201"]],
    sozler: [
      "Allah'ım, bu sevinç senden. Şımartma, unutturma; elimden aldığın gün de isyan ettirme.",
      "Rabbim, bu haberi kalbime hayırlı kıl. Sevincimi paylaşacak insanlar ve sevindirecek fırsatlar nasip et."
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
    ayetler: [["17:80"], ["65:3"], ["3:159"], ["53:39"], ["94:5", "94:6"], ["2:186"], ["2:148"], ["87:8"], ["29:69"], ["30:50"], ["6:125"]],
    dualar: [["20:25", "20:26", "20:27", "20:28"], ["18:10"], ["23:29"]],
    sozler: [
      "Allah'ım, girdiğim bu yeni yolu hayırlı kıl. Beni doğrulukla sok, doğrulukla çıkar.",
      "Rabbim, yeni başlangıcımda kolaylık ver. İyi insanlar, sabır ve doğru kararlar nasip et."
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
    ayetler: [["30:21"], ["46:15"], ["59:10"], ["2:186"], ["13:23", "13:24"], ["40:60"], ["17:23"], ["31:14"], ["25:54"], ["52:21"], ["40:8"]],
    dualar: [["17:24"], ["14:40", "14:41"], ["25:74"]],
    sozler: [
      "Allah'ım, sevdiklerimi koru. Onlara sağlık, huzur ve hayırlı bir ömür ver. Benim göremediğim yerde sen yanlarında ol.",
      "Rabbim, anne babama merhamet et. Onlara iyilik etmeyi nasip et, kalplerini kırmaktan beni koru."
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
    ayetler: [["17:80"], ["65:3"], ["2:186"], ["9:51"], ["29:20"], ["67:15"], ["16:8"], ["36:41", "36:42"], ["71:19", "71:20"], ["27:62"], ["12:64"]],
    dualar: [["43:13", "43:14"], ["23:29"], ["11:41"]],
    sozler: [
      "Allah'ım, yolumu aç, yolculuğumu kolaylaştır. Gittiğim yerde hayır bulmayı, döndüğümde sevdiklerime kavuşmayı nasip et.",
      "Rabbim, bu yolculukta beni ve yanımdakileri koru. Vardığım yeri bereketli kıl."
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
    ayetler: [["42:40"], ["7:199"], ["3:134"], ["41:34"], ["15:85"], ["42:43"], ["2:263"], ["4:149"], ["3:133"], ["42:37"]],
    dualar: [["59:10"], ["7:23"], ["3:16"]],
    sozler: [
      "Allah'ım, kalbimdeki kırgınlığı al. Affetmeyi nasip et; affederken beni küçültme.",
      "Rabbim, aramı düzeltmeyi nasip et. Ben affedeyim ki sen de beni affet."
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
    ayetler: [["40:60"], ["2:186"], ["7:55"], ["21:90"], ["42:19"], ["65:3"], ["27:62"], ["14:34"], ["11:90"], ["40:65"], ["94:7", "94:8"]],
    dualar: [["2:201"], ["3:8"], ["25:74"]],
    sozler: [
      "Allah'ım, istediğim şeyi biliyorsun. Hakkımda hayırlıysa nasip et; değilse gönlümü ondan al, yerine daha hayırlısını ver.",
      "Rabbim, duamı işit. Kabul etmeyeceksen beklemeyi ve razı olmayı öğret bana."
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
    ayetler: [["4:35"], ["49:10"], ["30:21"], ["42:43"], ["4:128"], ["3:159"], ["49:11", "49:12"], ["4:114"], ["2:263"], ["42:37"]],
    dualar: [["25:74"], ["59:10"], ["3:8"]],
    sozler: [
      "Allah'ım, aramızı düzelt. Kalplerimizi birbirine ısındır, öfkeyle söylenen sözleri unuttur.",
      "Rabbim, bu bağı hayırlıysa sürdür; değilse ikimizi de fazla incitmeden ayır."
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
    ayetler: [["14:39"], ["21:89", "21:90"], ["2:186"], ["40:60"], ["3:40"], ["19:4"], ["18:46"], ["19:5", "19:6"], ["11:73"], ["25:54"]],
    dualar: [["3:38"], ["37:100"], ["25:74"]],
    sozler: [
      "Allah'ım, bize hayırlı bir evlat nasip et. Bu bekleyişte kalbimizi kırma, birbirimize düşürme.",
      "Rabbim, duamızı işit. Bize evlat ver; vermeyeceksen bu bekleyişle yaşamayı öğret ve gönlümüzü ferah tut."
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
    ayetler: [["12:18"], ["8:62"], ["3:186"], ["4:148"], ["4:81"], ["39:36"], ["49:6"], ["4:58"], ["61:2", "61:3"], ["16:91"], ["33:70"]],
    dualar: [["3:173"], ["2:250"], ["12:86"]],
    sozler: [
      "Allah'ım, güvenim sarsıldı. Kalbimi onar; beni bir daha kimseye güvenemeyecek hâle getirme.",
      "Rabbim, bana yapılanın hesabını sana bırakıyorum. Kin taşımaktan koru, huzurumu geri ver."
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
    ayetler: [["113:1", "113:2", "113:3", "113:4", "113:5"], ["12:67"], ["9:51"], ["65:3"], ["2:255"], ["3:120"], ["10:107"], ["35:2"], ["41:36"], ["7:201"], ["12:64"]],
    dualar: [["114:1", "114:2", "114:3", "114:4", "114:5", "114:6"], ["23:97", "23:98"], ["3:173"]],
    sozler: [
      "Allah'ım, hased edenin şerrinden sana sığınırım. Beni, ailemi ve bana verdiğin nimeti koru.",
      "Rabbim, elimdekinin kıymetini bilmeyi nasip et. Korkuyla değil, sana güvenerek yaşamayı ver."
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
    ayetler: [["12:84"], ["12:96"], ["28:13"], ["2:186"], ["12:83"], ["65:3"], ["12:93"], ["12:99"], ["28:10"], ["94:5", "94:6"], ["12:87"]],
    dualar: [["12:86"], ["25:74"], ["2:201"]],
    sozler: [
      "Allah'ım, özlediğimi koru. Aramızdaki mesafeyi hayra çevir, kavuşmayı nasip et.",
      "Rabbim, bu özlem kalbimi yormasın. Görüşene kadar ikimize de sabır ve sağlık ver."
    ],
    notlar: [
      "Özlemek, sevdiğinin devam ettiği anlamına geliyor. Kötü bir şey değil.",
      "Bugün ara. Kısa konuşma da konuşmadır.",
      "Uzaklık kalıcı değilse geri sayma; kalıcıysa da her gün aynı ağırlıkta olmayacak.",
      "Özlediğin şeyin bir parçasını buraya taşı: bir yemek, bir şarkı, bir alışkanlık.",
      "Bir mektup yaz, göndermesen de. Özlem yazıya dökülünce yer değiştiriyor.",
      "Görüşeceğiniz bir tarih koy. Belirsiz özlem daha ağır."
    ]
  }
];

/* Ana ekranin ustunde duran ayet. Uygulamanin ne yaptigini tek ayette anlatan
 * yer: "Bana dua edin, size karsilik vereyim." */
const GIRIS_AYETI = "40:60";

module.exports = { CEVIRI, HALLER, GIRIS_AYETI };
