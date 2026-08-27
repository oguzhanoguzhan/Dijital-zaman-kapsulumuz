/**
 * ====================================================================
 * 🥠 SÜRPRİZ AŞK KURABİYESİ & 105+ ÇİFT GÖREVİ MOTORU (js/fortune-tasks.js)
 * ====================================================================
 */

const COUPLE_TASKS_POOL = [
    // 💖 1. Kategori: Romantik & Şefkat Dolu Jestler (1-25)
    {
        id: 1,
        category: "Romantik",
        icon: "heart",
        title: "Gözlerinin İçine Bakarak İltifat Et",
        description: "Bugün sevgilinin gözlerinin içine en az 1 dakika boyunca sessizce bak ve ardından onun hakkında en çok sevdiğin 3 şeyi söyle."
    },
    {
        id: 2,
        category: "Romantik",
        icon: "smile",
        title: "Sebepsizce 30 Saniye Sarıl",
        description: "Bugün hiçbir sebep yokken sevgiline sımsıkı sarıl ve en az 30 saniye boyunca hiç konuşmadan öylece kal."
    },
    {
        id: 3,
        category: "Romantik",
        icon: "coffee",
        title: "En Sevdiği İçeceği / Kahveyi Ismarla",
        description: "Bugün sevgiline en sevdiği kahveyi ya da tatlıyı sürpriz olarak al veya ellerinle hazırla."
    },
    {
        id: 4,
        category: "Romantik",
        icon: "music",
        title: "Özel Bir Şarkı Armağan Et",
        description: "Şu an aklına gelen ve sana onu hatırlatan özel bir şarkıyı hemen sevgiline gönder ve neden bu şarkıyı seçtiğini yaz."
    },
    {
        id: 5,
        category: "Romantik",
        icon: "sun",
        title: "Sabah / Akşam Sevgi Notu Gönder",
        description: "Günün herhangi bir saatinde ona 'İyi ki hayatımdasın' diyen içten ve uzun bir sevgi mesajı gönder."
    },
    {
        id: 6,
        category: "Romantik",
        icon: "sparkles",
        title: "El Ele Yürüyüş Yap",
        description: "Bugün birlikte en az 15 dakika boyunca el ele tutuşarak telefonlara hiç bakmadan sakin bir yürüyüş yapın."
    },
    {
        id: 7,
        category: "Romantik",
        icon: "moon",
        title: "Yıldızların veya Gece Işıklarının Altında Sohbet",
        description: "Bu gece pencere kenarında veya balkonda oturup sadece ikiniz geleceğe dair en büyük hayallerinizi konuşun."
    },
    {
        id: 8,
        category: "Romantik",
        icon: "gift",
        title: "Minik Bir Gizli Not Bırak",
        description: "Küçük bir kağıda tatlı bir not yaz ve onun cebine, çantasına veya masasına gizlice koy."
    },
    {
        id: 9,
        category: "Romantik",
        icon: "camera",
        title: "Günün En Tatlı Fotoğrafını Çek",
        description: "Bugün sevgilinin haberi yokken veya gülerken en doğal ve sevimli fotoğrafını çekip ona sakla."
    },
    {
        id: 10,
        category: "Romantik",
        icon: "heart",
        title: "28 Şubat Gününe Işınlan",
        description: "28 Şubat 2025 akşamı ilk sevgili olduğunuz o anı ve o gün hissettiğin o tatlı heyecanı ona tekrar anlat."
    },
    {
        id: 11,
        category: "Romantik",
        icon: "feather",
        title: "Saçlarını Okşa & Masaj Yap",
        description: "Sevgilinin yorgunluğunu almak için saçlarını okşa veya 5 dakika omuzlarına rahatlatıcı bir masaj yap."
    },
    {
        id: 12,
        category: "Romantik",
        icon: "music",
        title: "Yavaş Bir Dansa Davet Et",
        description: "Odanın ışıklarını loş yapın, arkada yavaş bir şarkı açın ve en az 3 dakika boyunca dans edin."
    },
    {
        id: 13,
        category: "Romantik",
        icon: "star",
        title: "Onda Hayran Olduğun Bir Özelliği Söyle",
        description: "Onun karakterinde veya kalbinde seni en çok etkileyen ve başkalarında olmayan bir özelliği ona itiraf et."
    },
    {
        id: 14,
        category: "Romantik",
        icon: "smile",
        title: "Onu Güldürecek Komik Bir Anı Hatırlat",
        description: "Birlikte kahkahalara boğulduğunuz en komik anıyı aç ve tekrar birlikte gülün."
    },
    {
        id: 15,
        category: "Romantik",
        icon: "heart",
        title: "Özel Bir Lakap Tak",
        description: "Bugün ona sadece ikinizin bileceği yepyeni ve çok tatlı bir sevgi sözcüğü veya lakap bul."
    },
    {
        id: 16,
        category: "Romantik",
        icon: "coffee",
        title: "Masasına Sıcak Bir İçecek Bırak",
        description: "O çalışırken veya dinlenirken sormadan yanına sıcacık bir çay/kahve ve minik bir çikolata bırak."
    },
    {
        id: 17,
        category: "Romantik",
        icon: "sparkles",
        title: "Sonsuz Teşekkür Görevi",
        description: "Hayatında olduğu ve sana kattığı tüm güzellikler için ona içten bir teşekkür konuşması yap."
    },
    {
        id: 18,
        category: "Romantik",
        icon: "camera",
        title: "Birlikte Yeni Bir Selfie Çekin",
        description: "Bugüne özel yepyeni bir çift selfiesi çekilin ve zaman kapsülüne eklemek üzere saklayın."
    },
    {
        id: 19,
        category: "Romantik",
        icon: "moon",
        title: "Uyurken Üstünü Ört / İyi Geceler Öpücüğü",
        description: "Bu gece uyumadan önce onu sevgiyle kucakla ve en tatlı rüyaları dile."
    },
    {
        id: 20,
        category: "Romantik",
        icon: "heart",
        title: "En Sevdiğin Fotoğrafımızı Gönder",
        description: "İkinizin galerisindeki yüzlerce fotoğraf arasından senin için en özel olan 1 tanesini seçip ona yolla."
    },

    // 😂 2. Kategori: Eğlenceli, Mizahi & Oyun Dolu Görevler (21-45)
    {
        id: 21,
        category: "Eğlence",
        icon: "laugh",
        title: "Gözü Kapalı Yiyecek Tahmini Oyunu",
        description: "Sevgilinin gözlerini kapat ve mutfaktan getirdiğin 3 farklı tadı (meyve, çikolata, peynir vb.) koklayarak veya tadarak bilmesini iste!"
    },
    {
        id: 22,
        category: "Eğlence",
        icon: "smile",
        title: "Gülmeme Meydan Okuması (3 Dakika)",
        description: "Birbirinizin yüzüne bakın ve en komik yüz ifadelerini yapın. İlk gülen kaybeder ve diğerine kahve yapar!"
    },
    {
        id: 23,
        category: "Eğlence",
        icon: "music",
        title: "Arabada / Odada Bağıra Bağıra Şarkı Söyleyin",
        description: "En sevdiğiniz hareketli şarkıyı son ses açın ve birlikte deliler gibi dans edip söyleyin."
    },
    {
        id: 24,
        category: "Eğlence",
        icon: "feather",
        title: "Mini Yastık Savaşı",
        description: "Aniden yastığı kap ve hafifçe meydan oku! 1 dakikalık tatlı bir yastık savaşı başlat."
    },
    {
        id: 25,
        category: "Eğlence",
        icon: "camera",
        title: "En Komik Yüz İfadesi Yarışması",
        description: "İkiniz de yapabileceğiniz en saçma ve komik yüz ifadesini yapıp fotoğrafını çekin."
    },
    {
        id: 26,
        category: "Eğlence",
        icon: "help-circle",
        title: "Birbirinizin Taklidini Yapın",
        description: "Sevgilinin en sık kullandığı bir mimiği veya cümleyi taklit et ve onun bunu tahmin etmesini sağla."
    },
    {
        id: 27,
        category: "Eğlence",
        icon: "film",
        title: "Mısır Patlatıp Film / Dizi Gecesi",
        description: "Bu akşam birlikte mısır patlatın ve battaniyenin altına girip ortak bir film veya dizi bölümü izleyin."
    },
    {
        id: 28,
        category: "Eğlence",
        icon: "zap",
        title: "Taş-Kağıt-Makas Turnuvası (5'te Biter)",
        description: "Hemen bir taş-kağıt-makas maçı yapın. Kaybeden kazananın istediği minik bir dileği yerine getirsin!"
    },
    {
        id: 29,
        category: "Eğlence",
        icon: "smile",
        title: "Komik Bir Çift TikTok / Reels Hareketi Dene",
        description: "Sosyal medyadaki o komik çift akımlarından birini sadece ikiniz gülmek için odada deneyin."
    },
    {
        id: 30,
        category: "Eğlence",
        icon: "music",
        title: "Sözsüz Şarkı Tahmin Oyunu",
        description: "Ağzınla bir şarkının melodisini mırıldan (şarkı sözü söylemeden), sevgilin hangi şarkı olduğunu 30 saniyede bulsun!"
    },
    {
        id: 31,
        category: "Eğlence",
        icon: "heart",
        title: "Birbirinizi Çizin (Ressam Modu)",
        description: "Bir kağıt ve kalem alın, 2 dakika içinde birbirinizin portresini çizin. Çizimler çok komik olacak!"
    },
    {
        id: 32,
        category: "Eğlence",
        icon: "sun",
        title: "Güne Dans Ederek Başlayın",
        description: "Müziği açın ve sabah enerjisiyle 1 dakika boyunca birlikte komik danslar yapın."
    },
    {
        id: 33,
        category: "Eğlence",
        icon: "gift",
        title: "10 TL / Mini Bütçeli Komik Hediye Al",
        description: "En yakın marketten ona çok komik veya nostaljik minik bir atıştırmalık sürprizi al."
    },
    {
        id: 34,
        category: "Eğlence",
        icon: "message-circle",
        title: "Sadece Emojilerle Konuşma Oyunu (1 Saat)",
        description: "Önümüzdeki 1 saat boyunca WhatsApp'tan sadece emojilerle anlaşmaya çalışın!"
    },
    {
        id: 35,
        category: "Eğlence",
        icon: "zap",
        title: "Parmak Güreşi Turnuvası",
        description: "Hemen baş parmaklarınızı kilitleyin ve 3 rauntluk efsanevi bir parmak güreşi yapın."
    },

    // ☕ 3. Kategori: Dışarıda & Kafe & Macera Görevleri (36-65)
    {
        id: 36,
        category: "Macera",
        icon: "map-pin",
        title: "Daha Önce Gitmediğiniz Bir Kafeye Gidin",
        description: "Şehrinizde daha önce hiç oturmadığınız yeni ve sevimli bir kahveci keşfedin."
    },
    {
        id: 37,
        category: "Macera",
        icon: "sun",
        title: "Gün Batımını Birlikte İzleyin",
        description: "Bugün güneş batarken gökyüzünün kızıla bürünüşünü el ele izleyin."
    },
    {
        id: 38,
        category: "Macera",
        icon: "shopping-bag",
        title: "Birlikte Market Turu Yapıp Abur Cubur Seçin",
        description: "Markete gidin ve birbirinizin çocukluğundaki favori abur cuburlarını sepete doldurun."
    },
    {
        id: 39,
        category: "Macera",
        icon: "car",
        title: "Rastgele Bir Yöne Doğru Sürün / Yürüyün",
        description: "Haritayı açmadan sadece içgüdülerinizle 15 dakika boyunca rastgele sokaklarda keşif yapın."
    },
    {
        id: 40,
        category: "Macera",
        icon: "camera",
        title: "Sokakta Romantik Bir Fotoğraf Çekin",
        description: "Güzel bir duvarın veya ağacın önünde durup birlikte harika bir kare yakalayın."
    },
    {
        id: 41,
        category: "Macera",
        icon: "coffee",
        title: "Sokak Kedilerini / Köpeklerini Besleyin",
        description: "Birlikte sokaktaki sevimli dostlarımıza mama veya süt verin ve onları sevin."
    },
    {
        id: 42,
        category: "Macera",
        icon: "map",
        title: "Gelecekteki Tatil Rotanızı Çizin",
        description: "Haritayı açın ve birlikte gitmek istediğiniz ilk 3 şehri veya ülkeyi belirleyin."
    },
    {
        id: 43,
        category: "Macera",
        icon: "book-open",
        title: "Bir Kitapçıya Girip Birbirinize Kitap Seçin",
        description: "Bir sahafta veya kitapçıda birbirinizin ruhuna hitap eden birer kitap inceleyin."
    },
    {
        id: 44,
        category: "Macera",
        icon: "heart",
        title: "Bankta Oturup İnsanları İzleyin & Hayal Kurun",
        description: "Parkta bir banka oturun ve sadece sessizliğin ve birbirinizin varlığının tadını çıkarın."
    },
    {
        id: 45,
        category: "Macera",
        icon: "sparkles",
        title: "Gecenin Bir Vakti Çorba / Tatlı Kaçamağı",
        description: "Gece saatlerinde dışarı çıkıp canınızın çektiği sıcak bir lezzeti tadın."
    },

    // 🍝 4. Kategori: Mutfak & Lezzet Sürprizleri (46-75)
    {
        id: 46,
        category: "Lezzet",
        icon: "utensils",
        title: "Birlikte Makarna / Pizza Pişirin",
        description: "Mutfakta iş bölümü yapın ve en lezzetli soslarla birlikte harika bir akşam yemeği hazırlayın."
    },
    {
        id: 47,
        category: "Lezzet",
        icon: "cake",
        title: "Tatlı / Kurabiye Yapma Macerası",
        description: "Birlikte fırını çalıştırın ve mis gibi kokan kurabiyeler veya çikolatalı bir sufle yapın."
    },
    {
        id: 48,
        category: "Lezzet",
        icon: "coffee",
        title: "Köpüklü Türk Kahvesi veya Latte Yap",
        description: "Bugün sevgiline bol köpüklü özel bir kahve pişir ve yanına lokum/çikolata koyarak servis et."
    },
    {
        id: 49,
        category: "Lezzet",
        icon: "heart",
        title: "Kalpli Meyve Tabağı Hazırla",
        description: "Meyveleri kalpli veya şık bir tabakta dilimleyip sevgiline sürpriz ikram et."
    },
    {
        id: 50,
        category: "Lezzet",
        icon: "sun",
        title: "Yatakta / Balkonda Pazar Kahvaltısı",
        description: "Birlikte peynirli omlet, sıcak ekmek ve taze çay eşliğinde krallara layık bir kahvaltı sofrası kurun."
    },
    {
        id: 51,
        category: "Lezzet",
        icon: "gift",
        title: "Ona En Sevdiği Yemeği Sürpriz Yap",
        description: "Onun 'olsa da yesek' dediği yemeği yap veya sipariş vererek gününü güzelleştir."
    },
    {
        id: 52,
        category: "Lezzet",
        icon: "smile",
        title: "Birlikte Çikolata Tadımı Yapın",
        description: "Farklı çikolataları deneyip hangisinin ikinizin ortak favorisi olduğunu seçin."
    },
    {
        id: 53,
        category: "Lezzet",
        icon: "coffee",
        title: "Gizli Bir Tarif Uydurun",
        description: "Mutfaktaki malzemelerle sadece ikinizin bildiği komik ve lezzetli bir içecek veya atıştırmalık karışımı yapın."
    },

    // 🌌 5. Kategori: Nostalji, Derin Sohbet & Gelecek (76-105)
    {
        id: 76,
        category: "Nostalji",
        icon: "heart",
        title: "İlk Tanıştığınız Günü Kelime Kelime Hatırlayın",
        description: "Birbirinize ilk gördüğünüz andaki kıyafetlerinizi, o günkü hava durumunu ve ilk hislerinizi anlatın."
    },
    {
        id: 77,
        category: "Derin Sohbet",
        icon: "sparkles",
        title: "5 Yıl Sonraki Evimizi Hayal Edin",
        description: "Gelecekte birlikte yaşayacağınız evin salonunu, balkonunu ve oradaki huzurlu bir sabahı anlatın."
    },
    {
        id: 78,
        category: "Derin Sohbet",
        icon: "moon",
        title: "Korkularını & Güvenini Paylaş",
        description: "Hayatta seni en çok endişelendiren bir şeyi sevgilinle paylaş ve onun desteğini hisset."
    },
    {
        id: 79,
        category: "Nostalji",
        icon: "music",
        title: "İlk Dans Ettiğiniz / Arabada Dinlediğiniz Şarkı",
        description: "İlk özel şarkınızı açın ve o günkü heyecanınızı konuşun."
    },
    {
        id: 80,
        category: "Derin Sohbet",
        icon: "star",
        title: "Birbirinize 3 Gizli Hayalinizi Söyleyin",
        description: "Daha önce birbirinize hiç bahsetmediğiniz veya az bildiğiniz 3 kişisel hayalinizi paylaşın."
    },
    {
        id: 81,
        category: "Nostalji",
        icon: "image",
        title: "Eski Fotoğraflara Bakıp Gülün",
        description: "Galerinizin en altlarına inip ilk aylardaki komik ve tatlı fotoğraflarınızı inceleyin."
    },
    {
        id: 82,
        category: "Derin Sohbet",
        icon: "heart",
        title: "'Seni Neden Seviyorum' Listesi (5 Madde)",
        description: "Kağıda veya mesaja sevgilini sevmenin en güzel 5 nedenini maddeler halinde yaz."
    },
    {
        id: 83,
        category: "Derin Sohbet",
        icon: "coffee",
        title: "Telefonları Kapatıp 30 Dakika Baş Başa Sohbet",
        description: "İkiniz de telefonları sessize alıp masanın üzerine bırakın ve 30 dakika sadece birbirinizi dinleyin."
    },
    {
        id: 84,
        category: "Nostalji",
        icon: "gift",
        title: "Birbirinize Aldığınız İlk Hediyeyi Hatırlayın",
        description: "İlk hediyeleştiğiniz günü ve o hediyenin kalbinizde bıraktığı tatlı hatırayı konuşun."
    },
    {
        id: 85,
        category: "Derin Sohbet",
        icon: "sparkles",
        title: "Hayatımız Bir Film Olsaydı Adı Ne Olurdu?",
        description: "İkinizin aşk hikayesi bir sinema filmi olsaydı filmin adı ve afişi nasıl olurdu?"
    },
    {
        id: 86,
        category: "Romantik",
        icon: "heart",
        title: "Ömrümün En Güzel Kararıydın Konuşması",
        description: "Ona hayatında verdiğin en doğru ve en mutlu kararın onunla olmak olduğunu hissettir."
    },
    {
        id: 87,
        category: "Romantik",
        icon: "sun",
        title: "Günün İlk Işıklarında / Uyanınca İlk Ona Yaz",
        description: "Gözlerini açtığında aklına gelen ilk kişinin o olduğunu belirten sıcacık bir mesaj gönder."
    },
    {
        id: 88,
        category: "Eğlence",
        icon: "smile",
        title: "Birlikte Bir Çizgi Film / Animasyon İzleyin",
        description: "Çocukluğunuza dönün ve birlikte neşeli bir animasyon filmi seçip izleyin."
    },
    {
        id: 89,
        category: "Macera",
        icon: "camera",
        title: "Günün Şükür Notunu Zaman Kapsülüne Ekle",
        description: "Bugün yaşadığınız tatlı bir anıyı hemen zaman kapsülünüze yeni bir hatıra olarak yazın."
    },
    {
        id: 90,
        category: "Romantik",
        icon: "feather",
        title: "Gözlerini Kapatıp Sadece Sesini Dinle",
        description: "Gözlerini kapat ve sevgilinin sana bir şeyler anlatmasını sadece onun ses tonuna odaklanarak dinle."
    },
    {
        id: 91,
        category: "Eğlence",
        icon: "laugh",
        title: "Komik Bir Şiir / Mani Yaz",
        description: "Sevgiline içinde ikinizin komik huylarının geçtiği 4 satırlık eğlenceli bir mani yaz."
    },
    {
        id: 92,
        category: "Lezzet",
        icon: "coffee",
        title: "Farklı Bir Kahve Çeşidi Deneyin",
        description: "Daha önce denemediğiniz aromalı veya farklı bir kahve hazırlayıp tadını değerlendirin."
    },
    {
        id: 93,
        category: "Derin Sohbet",
        icon: "moon",
        title: "Birbirinize En Çok Güvendiğiniz Anı Paylaşın",
        description: "Onun yanında kendini en huzurlu ve en güvende hissettiğin o özel anı dile getir."
    },
    {
        id: 94,
        category: "Macera",
        icon: "map-pin",
        title: "Birlikte Bisiklete Binin veya Sahilde Yürüyün",
        description: "Açık havada birlikte temiz havanın ve hareketin tadını çıkarın."
    },
    {
        id: 95,
        category: "Romantik",
        icon: "heart",
        title: "Ellerini Avuçlarının İçine Al ve Isıt",
        description: "Ellerini tut, avuçlarının arasına al ve ona kalbinin sıcaklığını hissettir."
    },
    {
        id: 96,
        category: "Eğlence",
        icon: "zap",
        title: "1 Dakikada Kim Daha Çok İltifat Edecek?",
        description: "Zamanlayıcıyı 1 dakikaya ayarlayın, durmaksızın birbirinize iltifatlar sıralayın!"
    },
    {
        id: 97,
        category: "Lezzet",
        icon: "cake",
        title: "Gecenin Bir Vakti Birlikte Dondurma Yiyin",
        description: "Mevsim ne olursa olsun birlikte en sevdiğiniz dondurmayı kaşıklayın."
    },
    {
        id: 98,
        category: "Derin Sohbet",
        icon: "sparkles",
        title: "Bizim Şarkılarımız Çalma Listesi Oluşturun",
        description: "Spotify veya YouTube'da sadece ikinizin anılarından oluşan 10 şarkılık ortak bir liste yapın."
    },
    {
        id: 99,
        category: "Romantik",
        icon: "gift",
        title: "Ona Küçük Bir Çiçek veya Yaprak Hediye Et",
        description: "Yolda yürürken gördüğün güzel bir çiçeği veya renkli bir sonbahar yaprağını ona armağan et."
    },
    {
        id: 100,
        category: "Romantik",
        icon: "heart",
        title: "100. Görev: Sonsuz Aşk Sözü",
        description: "Bu kurabiyeyi açtığın an sevgiline dön ve 'Seninle nice 100 güzel göreve ve nice ömür boyu mutluluklara' de!"
    },
    {
        id: 101,
        category: "Romantik",
        icon: "sparkles",
        title: "Ona En Çok Yakışan Rengi Söyle",
        description: "Bugün ona hangi renk giyindiğinde gözlerinin daha çok parladığını söyle."
    },
    {
        id: 102,
        category: "Eğlence",
        icon: "smile",
        title: "Komik Bir Çift Pozu Verip Çekin",
        description: "Ajan gibi veya süper kahraman gibi komik bir poz verip fotoğraf çekilin."
    },
    {
        id: 103,
        category: "Macera",
        icon: "map",
        title: "Birlikte Gökyüzünü İzleyip Bulutları Bir Şeye Benzetin",
        description: "Gökyüzüne bakın ve bulutların hangi hayvanlara veya şekillere benzediğini bulun."
    },
    {
        id: 104,
        category: "Lezzet",
        icon: "coffee",
        title: "Tatlı Bir Atıştırmalık Paylaşımı",
        description: "Son lokmayı birbirinize ikram etme nezaketi gösterin."
    },
    {
        id: 105,
        category: "Romantik",
        icon: "heart",
        title: "Kalbimin Tek Sahibisin İtirafı",
        description: "Günün sonunda sımsıkı sarılarak 'İyi ki benimlesin sevgilim' fısılda."
    }
];

class FortuneCookieManager {
    constructor() {
        this.tasksPool = COUPLE_TASKS_POOL;
        this.currentTask = null;
        this.isCookieOpen = false;
        this.activeProfileId = null;

        this.initDOM();
    }

    initDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Üst Banner Tıklama
        const bannerBtn = document.getElementById('fortune-banner-btn');
        if (bannerBtn) {
            bannerBtn.addEventListener('click', () => this.openFortuneModal());
        }

        // Kurabiye Kırma Tıklama
        const cookieGraphic = document.getElementById('fortune-cookie-graphic');
        if (cookieGraphic) {
            cookieGraphic.addEventListener('click', () => this.crackCookie());
        }

        // Görevi Tamamladım Butonu
        const completeBtn = document.getElementById('fortune-task-complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.completeTask());
        }
    }

    /* 📅 Profil Bazlı Haftalık 3 Gün Belirleme Algoritması */
    getWeeklySchedule(profileId, date = new Date()) {
        const year = date.getFullYear();
        // Yılın kaçıncı haftası
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

        // Profil bazlı tohum (Oğuzhan ve Gamze için farklı tohumlar)
        const seedStr = `${profileId}-${year}-W${weekNumber}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0;
        }

        // Haftanın 7 gününden (0: Pazar, 1: Pazartesi ... 6: Cumartesi) 3 tanesini seç
        const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Pazartesi'den başla
        const chosenDays = [];
        let seed = Math.abs(hash);

        while (chosenDays.length < 3) {
            const index = seed % daysOfWeek.length;
            const chosen = daysOfWeek[index];
            if (!chosenDays.includes(chosen)) {
                chosenDays.push(chosen);
            }
            seed = Math.floor(seed / 7) + 13;
        }

        return chosenDays;
    }

    /* 🥠 Bugün Bu Profil İçin Kurabiye Günü Mü? */
    isCookieDayToday(profileId) {
        if (!profileId) return false;
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0: Pazar, 1: Pazartesi ... 6: Cumartesi
        const scheduledDays = this.getWeeklySchedule(profileId, today);
        return scheduledDays.includes(dayOfWeek);
    }

    /* 📜 Bugünün Görevini Al */
    getTodaysTask(profileId) {
        if (!profileId) return null;
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const seedStr = `task-${profileId}-${dateKey}`;
        
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0;
        }

        const taskIndex = Math.abs(hash) % this.tasksPool.length;
        return this.tasksPool[taskIndex];
    }

    /* ⏳ Gece 23:59:59'a Kalan Süre */
    getTimeRemainingToday() {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const diffMs = endOfDay - now;

        if (diffMs <= 0) return { hours: 0, mins: 0, secs: 0, totalMs: 0 };

        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        return { hours, mins, secs, totalMs: diffMs };
    }

    /* 🏆 Tamamlanan Görev Sayısını Al */
    getCompletedCount(profileId) {
        try {
            const completed = JSON.parse(localStorage.getItem(`completed_tasks_${profileId}`) || '[]');
            return completed.length;
        } catch (e) {
            return 0;
        }
    }

    isTodayTaskCompleted(profileId, taskId) {
        try {
            const todayKey = new Date().toISOString().slice(0, 10);
            const completed = JSON.parse(localStorage.getItem(`completed_tasks_${profileId}`) || '[]');
            return completed.some(item => item.date === todayKey && item.taskId === taskId);
        } catch (e) {
            return false;
        }
    }

    /* 🔄 UI Durumunu Kontrol Et & Güncelle */
    updateFortuneUI(profile) {
        if (!profile) {
            document.getElementById('fortune-banner-container')?.classList.add('hidden');
            return;
        }

        this.activeProfileId = profile.id;
        const isCookieDay = this.isCookieDayToday(profile.id);
        const bannerContainer = document.getElementById('fortune-banner-container');
        const timerText = document.getElementById('fortune-banner-timer');

        if (isCookieDay) {
            this.currentTask = this.getTodaysTask(profile.id);
            const isCompleted = this.isTodayTaskCompleted(profile.id, this.currentTask.id);

            if (bannerContainer) bannerContainer.classList.remove('hidden');

            const updateTimer = () => {
                const { hours, mins, secs } = this.getTimeRemainingToday();
                if (timerText) {
                    if (isCompleted) {
                        timerText.innerHTML = `<span class="text-emerald-400 font-bold">✨ Bugünün Görevi Tamamlandı!</span>`;
                    } else {
                        timerText.innerHTML = `<span>Kalan Süre:</span> <span class="font-mono font-bold text-amber-300">${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</span>`;
                    }
                }
            };
            updateTimer();
            if (this.uiTimer) clearInterval(this.uiTimer);
            this.uiTimer = setInterval(updateTimer, 1000);

        } else {
            if (bannerContainer) bannerContainer.classList.add('hidden');
        }
    }

    /* 🥠 Kurabiye Modalını Aç */
    openFortuneModal() {
        if (!this.activeProfileId || !this.currentTask) return;

        const modal = document.getElementById('fortune-cookie-modal');
        const isCompleted = this.isTodayTaskCompleted(this.activeProfileId, this.currentTask.id);

        const uncrackedView = document.getElementById('fortune-uncracked-view');
        const crackedView = document.getElementById('fortune-cracked-view');
        const cookieGraphic = document.getElementById('fortune-cookie-graphic');

        if (isCompleted) {
            // Zaten kırılmış ve tamamlanmışsa doğrudan görevi göster
            if (uncrackedView) uncrackedView.classList.add('hidden');
            if (crackedView) crackedView.classList.remove('hidden');
            this.displayTaskDetails(true);
        } else {
            // Henüz kırılmamışsa
            if (uncrackedView) uncrackedView.classList.remove('hidden');
            if (crackedView) crackedView.classList.add('hidden');
            if (cookieGraphic) cookieGraphic.classList.remove('cookie-cracked');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (window.lucide) lucide.createIcons();
    }

    /* 💥 Kurabiyeyi Kır */
    crackCookie() {
        const cookieGraphic = document.getElementById('fortune-cookie-graphic');
        const uncrackedView = document.getElementById('fortune-uncracked-view');
        const crackedView = document.getElementById('fortune-cracked-view');

        if (cookieGraphic) {
            cookieGraphic.classList.add('cookie-cracked');
        }

        // Çıtırtı / Kilit Açma Sesi
        if (window.romanticAudio) {
            window.romanticAudio.playUnlockSound();
        }

        // Konfeti
        if (window.confetti) {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#f59e0b', '#ff758c', '#ff7eb3']
            });
        }

        setTimeout(() => {
            if (uncrackedView) uncrackedView.classList.add('hidden');
            if (crackedView) crackedView.classList.remove('hidden');
            this.displayTaskDetails(false);
            if (window.lucide) lucide.createIcons();
        }, 600);
    }

    /* 📜 Görev Detaylarını Göster */
    displayTaskDetails(isAlreadyCompleted = false) {
        if (!this.currentTask) return;

        document.getElementById('fortune-task-category').innerText = `Kategori: ${this.currentTask.category} ✨`;
        document.getElementById('fortune-task-title').innerText = this.currentTask.title;
        document.getElementById('fortune-task-desc').innerText = this.currentTask.description;

        const completeBtn = document.getElementById('fortune-task-complete-btn');
        const completedBadge = document.getElementById('fortune-completed-badge');

        if (isAlreadyCompleted) {
            if (completeBtn) completeBtn.classList.add('hidden');
            if (completedBadge) completedBadge.classList.remove('hidden');
        } else {
            if (completeBtn) completeBtn.classList.remove('hidden');
            if (completedBadge) completedBadge.classList.add('hidden');
        }

        // 24 saat canlı sayaç
        const timerEl = document.getElementById('fortune-modal-timer');
        const updateModalTimer = () => {
            const { hours, mins, secs } = this.getTimeRemainingToday();
            if (timerEl) {
                timerEl.innerText = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
            }
        };
        updateModalTimer();
        setInterval(updateModalTimer, 1000);
    }

    /* 🎉 Görevi Tamamla */
    completeTask() {
        if (!this.activeProfileId || !this.currentTask) return;

        const todayKey = new Date().toISOString().slice(0, 10);
        let completed = [];
        try {
            completed = JSON.parse(localStorage.getItem(`completed_tasks_${this.activeProfileId}`) || '[]');
        } catch (e) {
            completed = [];
        }

        if (!completed.some(item => item.date === todayKey && item.taskId === this.currentTask.id)) {
            completed.push({
                date: todayKey,
                taskId: this.currentTask.id,
                title: this.currentTask.title,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(`completed_tasks_${this.activeProfileId}`, JSON.stringify(completed));
        }

        // Kutlama
        if (window.confetti) {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#ff758c', '#ff7eb3', '#fbbf24', '#34d399', '#a855f7']
            });
        }

        document.getElementById('fortune-task-complete-btn')?.classList.add('hidden');
        document.getElementById('fortune-completed-badge')?.classList.remove('hidden');

        // UI'ı güncelle
        const profile = window.app?.currentProfile;
        if (profile) this.updateFortuneUI(profile);

        if (window.app?.showToast) {
            window.app.showToast("Tebrikler! Günün aşk görevini başarıyla tamamladın! 🏆💖");
        }
    }

    /* 🧪 Test / Manuel Kurabiye Açma */
    forceOpenCookie() {
        if (!this.activeProfileId) {
            this.activeProfileId = window.app?.currentProfile?.id || 'partner1';
        }
        this.currentTask = this.getTodaysTask(this.activeProfileId) || this.tasksPool[0];
        this.openFortuneModal();
    }
}

window.fortuneManager = new FortuneCookieManager();
