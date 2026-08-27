/**
 * ====================================================================
 * 💖 DİJİTAL ZAMAN KAPSÜLÜ - ÇİFT & SUPABASE YAPILANDIRMASI 💖
 * ====================================================================
 */

const coupleConfig = {
    // 👫 1. Çift Profil Bilgileri & Özel PIN Kodları
    profiles: {
        partner1: {
            id: "partner1",
            name: "Oğuzhan",
            roleTitle: "Ben",
            avatar: "🕶️",
            pin: "1611" // Oğuzhan'ın 4 haneli giriş PIN'i
        },
        partner2: {
            id: "partner2",
            name: "Gamze",
            roleTitle: "Sevgilim",
            avatar: "💖",
            pin: "0201" // Gamze'nin 4 haneli giriş PIN'i
        }
    },

    // 🏷️ Başlık & Canlı Aşk Sayacı Başlangıç Tarihi
    title: "İkimizin Zaman Kapsülü",
    subtitle: "Zaman akıp gitse de kalbimizdeki en özel anlar burada sonsuza dek saklı...",
    relationshipStartDate: "2025-02-28T20:00:00", // 28 Şubat 2025 Akşamı

    // ☁️ 2. Supabase Bulut Veritabanı Ayarları
    supabase: {
        url: "https://yjuctvllmosuimikfodn.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdWN0dmxsbW9zdWltaWtmb2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjQ1NzUsImV4cCI6MjEwMzQwMDU3NX0.QJeEgc2oWNJpigumJI5mHBjOzvfJEH7xgV6LVMs4a9I"
    },

    // 🎵 Arka Plan Müziği (Boş bırakılırsa dahili romantik lo-fi piyano sentezleyici çalar)
    customMusicUrl: "",
    musicTitle: "Melodi: Sonsuz Hatıralar & Aşk",

    // 🎨 Tema Tercihleri
    theme: {
        showConfettiOnUnlock: true,
        enableSoundEffects: true
    }
};
