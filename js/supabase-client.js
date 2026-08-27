/**
 * ====================================================================
 * ☁️ SUPABASE GERÇEK ZAMANLI VERİTABANI İSTEMCİSİ (js/supabase-client.js)
 * ====================================================================
 */

class SupabaseService {
    constructor() {
        this.client = null;
        this.isOnline = false;
        this.subscription = null;

        this.init();
    }

    init() {
        const config = typeof coupleConfig !== 'undefined' ? coupleConfig.supabase : null;
        
        if (config && config.url && config.anonKey && config.url.trim() !== '' && config.anonKey.trim() !== '') {
            try {
                if (window.supabase) {
                    const cleanUrl = config.url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
                    this.client = window.supabase.createClient(cleanUrl, config.anonKey.trim());
                    this.isOnline = true;
                    console.log("☁️ Supabase bağlantısı başarıyla kuruldu:", cleanUrl);
                }
            } catch (e) {
                console.warn("Supabase başlatılamadı, LocalStorage kullanılacak:", e);
                this.isOnline = false;
            }
        } else {
            console.log("ℹ️ Supabase yapılandırılmamış. Uygulama LocalStorage (yerel mod) ile çalışıyor.");
            this.isOnline = false;
        }
    }

    isConfigured() {
        return this.isOnline && this.client !== null;
    }

    /* 📥 Kapsülleri Getir (Supabase veya LocalStorage) */
    async fetchCapsules() {
        if (this.isConfigured()) {
            try {
                const { data, error } = await this.client
                    .from('capsules')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    const demoIds = new Set(['capsule-1', 'capsule-2', 'capsule-3', 'capsule-4', 'capsule-5', 'capsule-6']);
                    
                    // Eski otomatik eklenmiş hazır demo kapsüller varsa veritabanından temizle
                    const legacyDemos = data.filter(item => demoIds.has(item.id));
                    if (legacyDemos.length > 0) {
                        for (const demo of legacyDemos) {
                            this.client.from('capsules').delete().eq('id', demo.id).catch(() => {});
                        }
                    }

                    const userCapsules = data.filter(item => !demoIds.has(item.id));
                    return userCapsules.map(item => ({
                        id: item.id,
                        title: item.title,
                        type: item.type,
                        category: item.category,
                        icon: item.icon,
                        coverImage: item.cover_image,
                        dateLabel: item.date_label,
                        summary: item.summary,
                        question: item.question,
                        answers: item.answers || [],
                        hint: item.hint,
                        targetDate: item.target_date,
                        content: item.content || {},
                        author: item.author || 'partner1',
                        authorName: item.author_name || 'Oğuzhan',
                        targetUser: item.target_user || 'both',
                        createdAt: item.created_at
                    }));
                } else {
                    return [];
                }
            } catch (e) {
                console.error("Supabase kapsül çekme hatası:", e);
            }
        }

        // Yerel Veri / LocalStorage Fallback
        const savedCustom = localStorage.getItem('custom_capsules');
        if (savedCustom !== null) {
            try {
                const parsed = JSON.parse(savedCustom);
                const demoIds = new Set(['capsule-1', 'capsule-2', 'capsule-3', 'capsule-4', 'capsule-5', 'capsule-6']);
                const cleaned = parsed.filter(c => !demoIds.has(c.id));
                if (cleaned.length !== parsed.length) {
                    localStorage.setItem('custom_capsules', JSON.stringify(cleaned));
                }
                return cleaned;
            } catch (e) {
                console.error("LocalStorage parse hatası:", e);
                return [];
            }
        }
        return [];
    }

    /* 💾 Kapsülü Kaydet / Güncelle */
    async saveCapsule(capsule) {
        if (this.isConfigured()) {
            try {
                const dbPayload = {
                    id: capsule.id,
                    title: capsule.title,
                    type: capsule.type,
                    category: capsule.category,
                    icon: capsule.icon || 'heart',
                    cover_image: capsule.coverImage,
                    date_label: capsule.dateLabel,
                    summary: capsule.summary,
                    question: capsule.question,
                    answers: capsule.answers || [],
                    hint: capsule.hint,
                    target_date: capsule.targetDate || null,
                    content: capsule.content || {},
                    author: capsule.author || 'partner1',
                    author_name: capsule.authorName || 'Oğuzhan',
                    target_user: capsule.targetUser || 'both',
                    updated_at: new Date().toISOString()
                };

                const { data, error } = await this.client
                    .from('capsules')
                    .upsert(dbPayload, { onConflict: 'id' });

                if (error) throw error;
                console.log("☁️ Kapsül Supabase'e kaydedildi:", capsule.id);
            } catch (e) {
                console.error("Supabase kayıt hatası:", e);
            }
        }

        // Yerel depolamaya da kaydet
        try {
            const savedCustom = localStorage.getItem('custom_capsules');
            let customCapsules = savedCustom ? JSON.parse(savedCustom) : [];
            const index = customCapsules.findIndex(c => c.id === capsule.id);
            if (index >= 0) {
                customCapsules[index] = capsule;
            } else {
                customCapsules.push(capsule);
            }
            localStorage.setItem('custom_capsules', JSON.stringify(customCapsules));
        } catch (e) {
            console.error("LocalStorage kayıt hatası:", e);
        }
    }

    /* 🗑️ Kapsülü Sil */
    async deleteCapsule(capsuleId) {
        if (this.isConfigured()) {
            try {
                const { error } = await this.client
                    .from('capsules')
                    .delete()
                    .eq('id', capsuleId);
                if (error) throw error;
                console.log("☁️ Kapsül Supabase'den silindi:", capsuleId);
            } catch (e) {
                console.error("Supabase silme hatası:", e);
            }
        }

        try {
            const savedCustom = localStorage.getItem('custom_capsules');
            if (savedCustom) {
                let customCapsules = JSON.parse(savedCustom);
                customCapsules = customCapsules.filter(c => c.id !== capsuleId);
                localStorage.setItem('custom_capsules', JSON.stringify(customCapsules));
            }
        } catch (e) {
            console.error("LocalStorage silme hatası:", e);
        }
    }

    /* ❤️ Beğeni Sayısı & Beğenenler Listesini Getir */
    async fetchReactions() {
        if (this.isConfigured()) {
            try {
                const { data, error } = await this.client
                    .from('capsule_reactions')
                    .select('*');

                if (!error && data) {
                    const reactionMap = {};
                    data.forEach(item => {
                        const likedBy = Array.isArray(item.liked_by) ? item.liked_by : [];
                        reactionMap[item.capsule_id] = {
                            count: typeof item.count === 'number' ? item.count : likedBy.length,
                            likedBy: likedBy
                        };
                    });
                    return reactionMap;
                }
            } catch (e) {
                console.error("Supabase beğeni çekme hatası:", e);
            }
        }

        const savedReactions = localStorage.getItem('capsule_reactions');
        if (savedReactions) {
            try {
                const parsed = JSON.parse(savedReactions);
                const normalized = {};
                Object.keys(parsed).forEach(k => {
                    if (typeof parsed[k] === 'number') {
                        normalized[k] = { count: parsed[k], likedBy: [] };
                    } else if (parsed[k] && typeof parsed[k] === 'object') {
                        normalized[k] = {
                            count: parsed[k].count || (parsed[k].likedBy?.length || 0),
                            likedBy: Array.isArray(parsed[k].likedBy) ? parsed[k].likedBy : []
                        };
                    }
                });
                return normalized;
            } catch (e) {}
        }
        return {};
    }

    /* 💖 Kalp At / Kalbi Geri Çek (1 Kez Tıklanabilir Toggle) */
    async toggleReaction(capsuleId, userProfile) {
        let currentReactions = await this.fetchReactions();
        let target = currentReactions[capsuleId];
        if (!target || typeof target !== 'object') {
            target = { count: 0, likedBy: [] };
        }

        let likedBy = Array.isArray(target.likedBy) ? [...target.likedBy] : [];
        
        let userId = userProfile ? userProfile.id : null;
        if (!userId) {
            let anonId = localStorage.getItem('device_client_id');
            if (!anonId) {
                anonId = 'client_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('device_client_id', anonId);
            }
            userId = anonId;
        }

        let isLiked = false;
        if (likedBy.includes(userId)) {
            // Zaten beğenilmiş -> Kalbi geri çek (-1)
            likedBy = likedBy.filter(id => id !== userId);
            isLiked = false;
        } else {
            // Beğenilmemiş -> Kalp bırak (+1)
            likedBy.push(userId);
            isLiked = true;
        }

        const newCount = likedBy.length;
        currentReactions[capsuleId] = {
            count: newCount,
            likedBy: likedBy
        };

        try {
            localStorage.setItem('capsule_reactions', JSON.stringify(currentReactions));
        } catch (e) {}

        if (this.isConfigured()) {
            try {
                await this.client
                    .from('capsule_reactions')
                    .upsert({
                        capsule_id: capsuleId,
                        count: newCount,
                        liked_by: likedBy,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'capsule_id' });
            } catch (e) {
                console.error("Supabase beğeni güncelleme hatası:", e);
            }
        }

        return { count: newCount, isLiked, likedBy };
    }

    /* ====================================================================
     * 🎯 ORTAK HAYAL LİSTESİ (BUCKET LIST) METOTLARI
     * ==================================================================== */

    /* 📥 Hayalleri Getir */
    async fetchBucketList() {
        if (this.isConfigured()) {
            try {
                const { data, error } = await this.client
                    .from('bucket_list')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    return data.map(item => ({
                        id: item.id,
                        title: item.title,
                        category: item.category || 'Genel',
                        note: item.note || '',
                        targetDate: item.target_date || '',
                        completed: Boolean(item.completed),
                        completedAt: item.completed_at || null,
                        completedBy: item.completed_by || null,
                        completedByName: item.completed_by_name || null,
                        photoUrl: item.photo_url || null,
                        author: item.author || 'partner1',
                        authorName: item.author_name || 'Oğuzhan',
                        createdAt: item.created_at
                    }));
                } else {
                    return [];
                }
            } catch (e) {
                console.error("Supabase hayal listesi çekme hatası:", e);
            }
        }

        // Yerel Hafıza (LocalStorage) Fallback
        const saved = localStorage.getItem('bucket_list_items');
        if (saved !== null) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("LocalStorage bucket_list parse hatası:", e);
                return [];
            }
        }
        return [];
    }

    /* 💾 Hayal Kaydet / Güncelle */
    async saveBucketItem(item) {
        if (this.isConfigured()) {
            try {
                const dbPayload = {
                    id: item.id,
                    title: item.title,
                    category: item.category || 'Genel',
                    note: item.note || '',
                    target_date: item.targetDate || null,
                    completed: Boolean(item.completed),
                    completed_at: item.completedAt || null,
                    completed_by: item.completedBy || null,
                    completed_by_name: item.completedByName || null,
                    photo_url: item.photoUrl || null,
                    author: item.author || 'partner1',
                    author_name: item.authorName || 'Oğuzhan',
                    updated_at: new Date().toISOString()
                };

                const { error } = await this.client
                    .from('bucket_list')
                    .upsert(dbPayload, { onConflict: 'id' });

                if (error) throw error;
                console.log("☁️ Hayal Supabase'e kaydedildi:", item.id);
            } catch (e) {
                console.error("Supabase hayal kayıt hatası:", e);
            }
        }

        // Yerel depolamaya da kaydet
        try {
            const saved = localStorage.getItem('bucket_list_items');
            let list = saved ? JSON.parse(saved) : [];
            const index = list.findIndex(d => d.id === item.id);
            if (index >= 0) {
                list[index] = item;
            } else {
                list.unshift(item);
            }
            localStorage.setItem('bucket_list_items', JSON.stringify(list));
        } catch (e) {
            console.error("LocalStorage hayal kayıt hatası:", e);
        }
    }

    /* 🗑️ Hayal Sil */
    async deleteBucketItem(itemId) {
        if (this.isConfigured()) {
            try {
                const { error } = await this.client
                    .from('bucket_list')
                    .delete()
                    .eq('id', itemId);
                if (error) throw error;
                console.log("☁️ Hayal Supabase'den silindi:", itemId);
            } catch (e) {
                console.error("Supabase hayal silme hatası:", e);
            }
        }

        try {
            const saved = localStorage.getItem('bucket_list_items');
            if (saved) {
                let list = JSON.parse(saved);
                list = list.filter(d => d.id !== itemId);
                localStorage.setItem('bucket_list_items', JSON.stringify(list));
            }
        } catch (e) {
            console.error("LocalStorage hayal silme hatası:", e);
        }
    }

    /* 🔄 Gerçek Zamanlı (Realtime) Değişiklikleri Dinle */
    subscribeToChanges(onCapsuleChange, onReactionChange, onBucketChange) {
        if (!this.isConfigured()) return;

        try {
            this.client
                .channel('public-capsules-channel')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'capsules' }, (payload) => {
                    console.log("⚡ Realtime Kapsül Güncellemesi:", payload);
                    if (onCapsuleChange) onCapsuleChange(payload);
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'capsule_reactions' }, (payload) => {
                    console.log("⚡ Realtime Beğeni Güncellemesi:", payload);
                    if (onReactionChange) onReactionChange(payload);
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'bucket_list' }, (payload) => {
                    console.log("⚡ Realtime Hayal Listesi Güncellemesi:", payload);
                    if (onBucketChange) onBucketChange(payload);
                })
                .subscribe((status) => {
                    console.log("📡 Realtime Abonelik Durumu:", status);
                });
        } catch (e) {
            console.error("Realtime abonelik hatası:", e);
        }
    }
}

window.supabaseService = new SupabaseService();
