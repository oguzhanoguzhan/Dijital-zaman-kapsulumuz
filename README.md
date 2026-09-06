# 💖 Dijital Zaman Kapsülü (Digital Time Capsule) - Çift Platformu

Sevgiliniz ve sizin için özel olarak tasarlanmış, **ikili profil (Two-User Profile Mode)** ve **Supabase Gerçek Zamanlı (Realtime)** bulut senkronizasyonuna sahip romantik dijital zaman sandığı.

---

## 🌟 Öne Çıkan Yeni Özellikler

1. **👫 İkili Profil & PIN Girişi**:
   - Sağ üstteki **"Profil Seç"** alanından `[Partner 1 / Sen]` veya `[Partner 2 / Sevgilin]` profili seçilir.
   - Her profil kendi belirlediği 4 haneli PIN kodu ile giriş yapar (Varsayılan: Partner 1: `1234`, Partner 2: `5678` - `js/config.js` dosyasından değiştirilebilir).

2. **🎁 İki Taraflı Sürpriz Kapsül İzinleri**:
   - Kapsül eklerken hedef kitle seçilebilir:
     - `👫 İkimiz İçin Ortak`: İkinizin de açıkça görebildiği ortak hatıra.
     - `🎁 Sevgilime Özel Sürpriz`: Kapsülü hazırlayan kişi içeriği istediği an görebilir ve düzenleyebilirken, hedef sevgili ancak kilit sorusunu bilerek veya geri sayım tarihini bekleyerek açabilir!

3. **🎯 Ortak Hayal Listesi (Bucket List)**:
   - Birlikte gerçekleştirmek istediğiniz hayalleri (Seyahat, Romantik Randevu, Macera, Ev & Gelecek vb.) ekleyin.
   - Gerçekleştirdikçe interaktif tik atın; konfeti patlaması, başarı sesi ve kutlama modalı açılsın.
   - Gerçekleşen hayallere anı fotoğrafı ekleyerek hatıranızı ölümsüzleştirin!
   - Canlı tamamlanma yüzdesi çubuğu ve istatistik takibi.

4. **☁️ Supabase Gerçek Zamanlı (Realtime) Senkronizasyon**:
   - Telefon ve bilgisayarlar arasında anlık veri senkronizasyonu.
   - Biriniz yeni bir anı eklediğinde, hayali tamamladığında veya kalp bıraktığında diğerinizin ekranında otomatik olarak belirir!
   - (Supabase kurulmadığında uygulama otomatik olarak `LocalStorage` üzerinden kesintisiz çalışır).

---

## ⚡ 2 Dakikada Ücretsiz Supabase Kurulumu

Tüm cihazlarınızın gerçek zamanlı konuşması için Supabase kurulumu tamamen ücretsizdir:

1. [supabase.com](https://supabase.com) adresine gidip ücretsiz bir hesap oluşturun ve **"New Project"** diyerek yeni bir proje açın.
2. Sol menüden **"SQL Editor"** sekmesine tıklayın.
3. Projedeki **`schema.sql`** dosyasının içeriğini kopyalayıp SQL Editor'e yapıştırın ve **"Run"** butonuna basın.
4. Sol alttaki **Project Settings -> API** bölümünden:
   - **Project URL**
   - **Project API Keys -> `anon` / `public`** anahtarını kopyalayın.
5. `js/config.js` dosyasını açıp şu alanlara yapıştırın:

```javascript
supabase: {
    url: "https://your-project-id.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

Tebrikler! Artık tüm cihazlarınızdan birbirinize gerçek zamanlı sürpriz kapsüller bırakabilirsiniz. 🎉

---

## ⚙️ İsimleri ve PIN Kodlarını Değiştirme (`js/config.js`)

```javascript
profiles: {
    partner1: {
        id: "partner1",
        name: "Oğuzhan",
        roleTitle: "Ben",
        avatar: "🕶️",
        pin: "1611" // Oğuzhan'ın PIN kodu
    },
    partner2: {
        id: "partner2",
        name: "Gamze",
        roleTitle: "Sevgilim",
        avatar: "💖",
        pin: "0201" // Gamze'nin PIN kodu
    }
},
relationshipStartDate: "2025-02-28T20:00:00" // 28 Şubat 2025 Akşamı Canlı Aşk Sayacı
```

---

## 🚀 Çalıştırma

Klasördeki **`index.html`** dosyasına çift tıklayarak tarayıcınızda anında açabilirsiniz!
