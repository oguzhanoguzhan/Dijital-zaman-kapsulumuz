/**
 * ====================================================================
 * 💖 DİJİTAL ZAMAN KAPSÜLÜ - İKİLİ PROFİL & ANA UYGULAMA (js/app.js) 💖
 * ====================================================================
 */

class TimeCapsuleApp {
    constructor() {
        this.config = typeof coupleConfig !== 'undefined' ? coupleConfig : {
            profiles: {
                partner1: { id: "partner1", name: "Oğuzhan", roleTitle: "Ben", avatar: "🕶️", pin: "1611" },
                partner2: { id: "partner2", name: "Gamze", roleTitle: "Sevgilim", avatar: "💖", pin: "0201" }
            },
            title: "İkimizin Zaman Kapsülü",
            relationshipStartDate: "2025-02-28T20:00:00"
        };

        this.capsules = [];
        this.unlockedIds = new Set();
        this.reactions = {};
        this.currentProfile = null; // Aktif giriş yapmış profil nesnesi
        this.selectedProfileForLogin = null;
        this.previewMode = false;
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.currentActiveCapsule = null;
        this.editingCapsuleId = null;
        if (window.imageUploader) window.imageUploader.clear();
        if (window.voiceRecorder) window.voiceRecorder.resetRecorderUI();

        this.init();
    }

    async init() {
        this.loadLocalAuth();
        this.setupCoupleInfo();
        this.startRelationshipTimer();
        await this.loadData();
        this.setupEventListeners();
        this.startTimeLockTickers();
        this.setupRealtimeSync();
        if (!this.currentProfile) this.openProfileModal();
    }

    /* 🔐 Profil Oturumunu Yükle */
    loadLocalAuth() {
        try {
            const savedProfileId = localStorage.getItem('active_profile_id');
            if (savedProfileId && this.config.profiles[savedProfileId]) {
                this.currentProfile = this.config.profiles[savedProfileId];
            }

            const savedUnlocked = localStorage.getItem('unlocked_capsules');
            if (savedUnlocked) {
                this.unlockedIds = new Set(JSON.parse(savedUnlocked));
            }
        } catch (e) {
            console.error("Auth yüklenirken hata:", e);
        }
        this.updateProfileUI();
        if (window.fortuneManager) window.fortuneManager.updateFortuneUI(this.currentProfile);
    }

    saveUnlockedState() {
        localStorage.setItem('unlocked_capsules', JSON.stringify(Array.from(this.unlockedIds)));
    }

    /* 📥 Verileri Supabase veya Yerelden Yükle */
    async loadData() {
        if (window.supabaseService) {
            this.capsules = await window.supabaseService.fetchCapsules();
            this.reactions = await window.supabaseService.fetchReactions();
        } else {
            this.capsules = [];
        }
        this.renderCapsules();
    }

    /* 🔄 Gerçek Zamanlı Senkronizasyon Dinleyicisi */
    setupRealtimeSync() {
        if (window.supabaseService && window.supabaseService.isConfigured()) {
            window.supabaseService.subscribeToChanges(
                async (payload) => {
                    // Yeni bir kapsül eklendiğinde veya güncellendiğinde
                    await this.loadData();
                    this.showToast("✨ Yeni bir anı / kapsül güncellendi!");
                },
                async (payload) => {
                    this.reactions = await window.supabaseService.fetchReactions();
                    this.renderCapsules();
                },
                async (payload) => {
                    if (window.bucketListManager) {
                        await window.bucketListManager.loadData();
                        this.showToast("🎯 Ortak hayal listesi güncellendi!");
                    }
                }
            );
            const syncBadge = document.getElementById('sync-status-badge');
            if (syncBadge) {
                syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> <span class="text-emerald-300">Supabase Canlı</span>`;
            }
        } else {
            const syncBadge = document.getElementById('sync-status-badge');
            if (syncBadge) {
                syncBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-400"></span> <span class="text-rose-300">Yerel Hafıza (Offline)</span>`;
            }
        }
    }

    /* 👫 Çift Bilgilerini & Başlığı Doldur */
    setupCoupleInfo() {
        const titleEl = document.getElementById('main-title');
        const subtitleEl = document.getElementById('main-subtitle');
        const p1 = this.config.profiles.partner1;
        const p2 = this.config.profiles.partner2;

        if (titleEl) titleEl.innerText = this.config.title || 'İkimizin Zaman Kapsülü';
        if (subtitleEl) subtitleEl.innerText = this.config.subtitle || 'En özel anlarımız...';
    }

    /* ⏳ Canlı Aşk / Birliktelik Sayacı */
    startRelationshipTimer() {
        const startDateStr = this.config.relationshipStartDate;
        if (!startDateStr) return;

        const startDate = new Date(startDateStr);

        const updateCounter = () => {
            const now = new Date();
            const diffMs = now - startDate;
            if (diffMs < 0) return;

            const totalSecs = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSecs / 86400);
            const hours = Math.floor((totalSecs % 86400) / 3600);
            const mins = Math.floor((totalSecs % 3600) / 60);
            const secs = totalSecs % 60;

            const daysEl = document.getElementById('love-days');
            const hoursEl = document.getElementById('love-hours');
            const minsEl = document.getElementById('love-mins');
            const secsEl = document.getElementById('love-secs');

            if (daysEl) daysEl.innerText = days;
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minsEl) minsEl.innerText = String(mins).padStart(2, '0');
            if (secsEl) secsEl.innerText = String(secs).padStart(2, '0');
        };

        updateCounter();
        setInterval(updateCounter, 1000);
    }

    /* 👤 Profil Durumunu ve UI'ı Güncelle */
    updateProfileUI() {
        const profileBtn = document.getElementById('active-profile-btn');
        const profileStatusText = document.getElementById('active-profile-name');
        const profileAvatar = document.getElementById('active-profile-avatar');

        if (this.currentProfile) {
            if (profileStatusText) profileStatusText.innerText = `${this.currentProfile.name} (${this.currentProfile.roleTitle})`;
            if (profileAvatar) profileAvatar.innerText = this.currentProfile.avatar;
            if (profileBtn) {
                profileBtn.className = "glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs sm:text-sm shadow-lg hover:border-rose-400 transition-all";
            }
        } else {
            if (profileStatusText) profileStatusText.innerText = "Giriş Yap / Profil Seç";
            if (profileAvatar) profileAvatar.innerText = "💖";
            if (profileBtn) {
                profileBtn.className = "glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 border border-white/10 text-gray-300 text-xs sm:text-sm shadow-lg hover:border-rose-400 transition-all";
            }
        }
    }

    /* 🔒 Kapsül Açılma İzin Kontrolü */
    isCapsuleUnlocked(capsule) {
        if (this.previewMode) return true;

        // 🌟 SÜRPRİZ İZİN MANTIĞI:
        // Eğer giriş yapan kullanıcı bu kapsülü bizzat kendisi hazırlamışsa, kendi sürprizini her zaman kilitsiz görebilir ve düzenleyebilir!
        if (this.currentProfile && capsule.author === this.currentProfile.id) {
            return true;
        }

        if (capsule.type === 'open') return true;

        if (capsule.type === 'question') {
            return this.unlockedIds.has(capsule.id);
        }

        if (capsule.type === 'time') {
            const targetDate = new Date(capsule.targetDate);
            return new Date() >= targetDate;
        }

        return false;
    }

    /* ⏱️ Zaman Kilitli Kapsüller İçin Canlı Geri Sayım */
    startTimeLockTickers() {
        setInterval(() => {
            this.capsules.forEach(capsule => {
                if (capsule.type === 'time') {
                    const timerEl = document.getElementById(`countdown-${capsule.id}`);
                    if (!timerEl) return;

                    const isAuthor = this.currentProfile && capsule.author === this.currentProfile.id;
                    const targetDate = new Date(capsule.targetDate);
                    const now = new Date();
                    const diffMs = targetDate - now;

                    if (diffMs <= 0 || this.previewMode || isAuthor) {
                        timerEl.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1 justify-center text-xs py-1">✨ Kilit Açık!</span>`;
                        const cardActionBtn = document.getElementById(`btn-open-${capsule.id}`);
                        if (cardActionBtn) {
                            cardActionBtn.className = 'w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25';
                            cardActionBtn.innerHTML = `<span>Kapsülü Aç</span> <i data-lucide="sparkles" class="w-4 h-4"></i>`;
                        }
                    } else {
                        const totalSecs = Math.floor(diffMs / 1000);
                        const days = Math.floor(totalSecs / 86400);
                        const hours = Math.floor((totalSecs % 86400) / 3600);
                        const mins = Math.floor((totalSecs % 3600) / 60);
                        const secs = totalSecs % 60;

                        timerEl.innerHTML = `
                            <div class="grid grid-cols-4 gap-1.5 text-center text-xs">
                                <div class="bg-black/40 rounded-lg p-1 border border-white/5"><span class="font-bold text-amber-300 block text-sm">${days}</span>Gün</div>
                                <div class="bg-black/40 rounded-lg p-1 border border-white/5"><span class="font-bold text-amber-300 block text-sm">${String(hours).padStart(2,'0')}</span>Sa</div>
                                <div class="bg-black/40 rounded-lg p-1 border border-white/5"><span class="font-bold text-amber-300 block text-sm">${String(mins).padStart(2,'0')}</span>Dk</div>
                                <div class="bg-black/40 rounded-lg p-1 border border-white/5"><span class="font-bold text-amber-300 block text-sm">${String(secs).padStart(2,'0')}</span>Sn</div>
                            </div>
                        `;
                    }
                }
            });
        }, 1000);
    }

        /* 🖼️ Kapsülleri Render Et */
    renderCapsules() {
        const gridEl = document.getElementById('capsules-grid');
        if (!gridEl) return;

        // 🔒 GİRİŞ YAPILMAMIŞSA HİÇBİR KAPSÜL GÖSTERİLMEZ
        if (!this.currentProfile) {
            gridEl.innerHTML = `
                <div class="col-span-full py-16 text-center glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-gradient-to-b from-rose-950/40 via-purple-950/30 to-black/40 shadow-2xl animate-fadeIn">
                    <div class="w-20 h-20 mx-auto mb-5 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shadow-lg shadow-rose-500/20 animate-pulse">
                        <i data-lucide="lock" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-2xl sm:text-3xl font-bold text-white mb-3 font-romantic-serif">
                        Bu Zaman Kapsülü Sadece Oğuzhan & Gamze'ye Özeldir 🔒
                    </h3>
                    <p class="text-gray-300 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                        Zaman kapsülündeki mektupları, anıları, fotoğrafları ve ses kayıtlarını görmek için lütfen profilini seçip giriş yap sevgilim.
                    </p>
                    <button onclick="window.app.openProfileModal()" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white text-base font-extrabold shadow-xl shadow-rose-500/30 transition-all hover:scale-105">
                        <i data-lucide="key" class="w-5 h-5"></i>
                        <span>Giriş Yap (Oğuzhan veya Gamze)</span>
                    </button>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        const filtered = this.capsules.filter(c => {
            const isUnlocked = this.isCapsuleUnlocked(c);
            
            if (this.activeFilter === 'open' && !isUnlocked) return false;
            if (this.activeFilter === 'locked' && isUnlocked) return false;
            if (this.activeFilter === 'question' && c.type !== 'question') return false;
            if (this.activeFilter === 'time' && c.type !== 'time') return false;

            // Yazara göre filtre
            if (this.activeFilter === 'my_capsules') {
                if (!this.currentProfile || c.author !== this.currentProfile.id) return false;
            }

            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                const matchTitle = (c.title || '').toLowerCase().includes(q);
                const matchSummary = (c.summary || '').toLowerCase().includes(q);
                const matchCategory = (c.category || '').toLowerCase().includes(q);
                const matchAuthor = (c.authorName || '').toLowerCase().includes(q);
                return matchTitle || matchSummary || matchCategory || matchAuthor;
            }
            return true;
        });

        if (filtered.length === 0) {
            const hasCapsules = this.capsules.length > 0;
            const emptyTitle = hasCapsules ? 'Aradığın Kapsül Bulunamadı' : 'Henüz Kapsül Eklenmedi';
            const emptyDesc = hasCapsules 
                ? 'Filtreleri değiştirmeyi veya arama terimini temizlemeyi deneyebilirsin sevgilim.' 
                : 'İlk anı veya sürpriz kapsülünü ekleyerek zaman sandığımızı doldurmaya başlayabilirsin sevgilim. 💖';

            gridEl.innerHTML = `
                <div class="col-span-full py-16 text-center glass-card rounded-3xl p-8 border border-white/10">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <i data-lucide="${hasCapsules ? 'search-x' : 'heart-handshake'}" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">${emptyTitle}</h3>
                    <p class="text-gray-400 text-sm max-w-md mx-auto mb-6">${emptyDesc}</p>
                    ${!hasCapsules ? `
                        <button onclick="window.app.openAddCapsuleModal()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-sm font-medium shadow-lg shadow-rose-500/25 transition-all">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>İlk Sürprizi Ekle</span>
                        </button>
                    ` : ''}
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        gridEl.innerHTML = filtered.map(capsule => {
            const isUnlocked = this.isCapsuleUnlocked(capsule);
            const isAuthor = this.currentProfile && capsule.author === this.currentProfile.id;
            
            // Beğeni & Kalp Durumu (1 Kez Tıklanabilir Toggle)
            const reactionData = this.reactions[capsule.id];
            const reactionCount = typeof reactionData === 'number' ? reactionData : (reactionData?.count || 0);
            const likedBy = Array.isArray(reactionData?.likedBy) ? reactionData.likedBy : [];
            const currentUserId = this.currentProfile ? this.currentProfile.id : (localStorage.getItem('device_client_id') || null);
            const isLikedByMe = Boolean(currentUserId && likedBy.includes(currentUserId));

            // Yazar Rozeti
            let authorBadgeHtml = '';
            if (capsule.targetUser === 'partner') {
                authorBadgeHtml = `
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1 shadow-sm">
                        <span>🎁</span> ${capsule.authorName || 'Biri'}'den Sana Sürpriz
                    </span>
                `;
            } else {
                authorBadgeHtml = `
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-sm">
                        <span>👫</span> İkimiz İçin Ortak
                    </span>
                `;
            }

            // Kilit Durum Rozeti
            let badgeHtml = '';
            let lockIconHtml = '';

            if (isAuthor && capsule.type !== 'open') {
                badgeHtml = `<span class="badge-open px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i data-lucide="sparkles" class="w-3 h-3"></i> Senin Sürprizin
                </span>`;
                lockIconHtml = `<div class="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center backdrop-blur-md border border-purple-500/30 shadow-lg">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                </div>`;
            } else if (isUnlocked) {
                badgeHtml = `<span class="badge-open px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i data-lucide="unlock" class="w-3 h-3"></i> Açık
                </span>`;
                lockIconHtml = `<div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center backdrop-blur-md border border-emerald-500/30 shadow-lg">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>`;
            } else if (capsule.type === 'question') {
                badgeHtml = `<span class="badge-question px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i data-lucide="help-circle" class="w-3 h-3"></i> Soru Kilitli
                </span>`;
                lockIconHtml = `<div class="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center backdrop-blur-md border border-rose-500/30 shadow-lg animate-pulse">
                    <i data-lucide="lock" class="w-4 h-4"></i>
                </div>`;
            } else if (capsule.type === 'time') {
                badgeHtml = `<span class="badge-time px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <i data-lucide="hourglass" class="w-3 h-3"></i> Zaman Kilitli
                </span>`;
                lockIconHtml = `<div class="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center backdrop-blur-md border border-amber-500/30 shadow-lg">
                    <i data-lucide="clock" class="w-4 h-4"></i>
                </div>`;
            }

            // Buton Tasarımı
            let actionBtnClass = "";
            let actionBtnText = "";

            if (isUnlocked) {
                actionBtnClass = "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white shadow-lg shadow-rose-500/25";
                actionBtnText = `<span>Kapsülü Aç</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
            } else if (capsule.type === 'question') {
                actionBtnClass = "bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg shadow-rose-900/30";
                actionBtnText = `<span>Kilidi Çöz</span> <i data-lucide="key" class="w-4 h-4"></i>`;
            } else {
                actionBtnClass = "bg-gradient-to-r from-amber-600/80 to-yellow-600/80 hover:from-amber-500 hover:to-yellow-500 text-white";
                actionBtnText = `<span>Geri Sayımı Gör</span> <i data-lucide="clock" class="w-4 h-4"></i>`;
            }

            // Düzenleme / Silme Butonları (Giriş yapılmışsa ve yetkili ise)
            const canManage = this.currentProfile && (isAuthor || this.currentProfile.id === 'partner1');

            return `
                <div class="glass-card rounded-3xl overflow-hidden flex flex-col group relative" id="card-${capsule.id}">
                    <!-- Üst Görsel / Kapak -->
                    <div class="relative h-52 overflow-hidden cursor-pointer" onclick="window.app.handleCapsuleClick('${capsule.id}')">
                        <img 
                            src="${capsule.coverImage || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'}" 
                            alt="${capsule.title}"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isUnlocked ? 'filter blur-[2px] brightness-75' : ''}"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#0f1224] via-[#0f1224]/40 to-transparent"></div>
                        
                        <!-- Üst Rozetler -->
                        <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            ${authorBadgeHtml}
                            <div class="flex items-center gap-1.5">
                                ${badgeHtml}
                                ${lockIconHtml}
                            </div>
                        </div>

                        <!-- Tarih & Ses Rozeti -->
                        <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-gray-300">
                            <div class="flex items-center gap-1.5">
                                <span class="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-medium flex items-center gap-1">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-rose-400"></i> ${capsule.dateLabel || 'Özel An'}
                                </span>
                                ${capsule.content?.audio ? `
                                    <span class="bg-rose-500/30 text-rose-200 backdrop-blur-md px-2 py-0.5 rounded-lg border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1">
                                        <i data-lucide="mic" class="w-3 h-3"></i> Sesli
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Kart İçeriği -->
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-start justify-between gap-2 mb-2">
                                <h3 class="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                                    ${capsule.title}
                                </h3>
                                ${canManage ? `
                                    <div class="flex items-center gap-1">
                                        <button onclick="window.app.openEditModal('${capsule.id}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition-colors" title="Kapsülü Düzenle">
                                            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                                        </button>
                                        <button onclick="window.app.deleteCapsule('${capsule.id}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors" title="Kapsülü Sil">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                            <p class="text-gray-300 text-sm line-clamp-2 leading-relaxed mb-4">
                                ${capsule.summary || 'Bu kapsülün içinde ikimize ait çok özel anılar var...'}
                            </p>
                        </div>

                        <!-- Zaman Kilitli ise Geri Sayım -->
                        ${capsule.type === 'time' && !isUnlocked ? `
                            <div class="mb-4 p-3 rounded-2xl bg-white/5 border border-amber-400/20" id="countdown-${capsule.id}">
                                <div class="text-center text-xs text-amber-300 animate-pulse">Sayaç Yükleniyor...</div>
                            </div>
                        ` : ''}

                        <!-- Alt Butonlar -->
                        <div class="pt-3 border-t border-white/5 flex items-center gap-2">
                            <button 
                                onclick="window.app.handleCapsuleClick('${capsule.id}')"
                                id="btn-open-${capsule.id}"
                                class="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${actionBtnClass}"
                            >
                                ${actionBtnText}
                            </button>

                            <!-- Kalp / Beğeni Butonu (1 Kez Tıklanabilir Toggle) -->
                            <button 
                                onclick="window.app.addHeartReaction('${capsule.id}', event)"
                                class="p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold ${isLikedByMe ? 'bg-rose-500/25 border-rose-500/60 text-rose-300 shadow-md shadow-rose-500/20 scale-105' : 'bg-white/5 hover:bg-rose-500/10 border-white/10 text-gray-300 hover:text-rose-300'}"
                                title="${isLikedByMe ? 'Kalbi geri çek (-1)' : 'Bu anıya kalp bırak (+1)'}"
                            >
                                <i data-lucide="heart" class="w-4 h-4 transition-transform ${isLikedByMe ? 'fill-rose-500 text-rose-500 scale-110' : (reactionCount > 0 ? 'text-rose-400' : 'text-gray-400')}"></i>
                                <span class="${isLikedByMe ? 'text-rose-300 font-bold' : ''}">${reactionCount}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* 🎯 Kapsüle Tıklama */
    handleCapsuleClick(capsuleId) {
        const capsule = this.capsules.find(c => c.id === capsuleId);
        if (!capsule) return;

        const isUnlocked = this.isCapsuleUnlocked(capsule);

        if (isUnlocked) {
            this.openContentModal(capsule);
        } else if (capsule.type === 'question') {
            this.openQuestionModal(capsule);
        } else if (capsule.type === 'time') {
            this.openTimeLockModal(capsule);
        }
    }

    /* ❓ Soru Kilit Modalı */
    openQuestionModal(capsule) {
        this.currentActiveCapsule = capsule;
        const modal = document.getElementById('question-modal');
        const questionText = document.getElementById('modal-question-text');
        const questionHint = document.getElementById('modal-question-hint');
        const hintContainer = document.getElementById('hint-container');
        const answerInput = document.getElementById('modal-answer-input');
        const errorText = document.getElementById('modal-answer-error');

        if (questionText) questionText.innerText = capsule.question || 'Bu kapsül ikimizin özel bir anısıyla kilitli!';
        if (questionHint) questionHint.innerText = capsule.hint || 'İpucu bulunmuyor ama kalbinin sesini dinle :)';
        if (hintContainer) hintContainer.classList.add('hidden');
        if (answerInput) {
            answerInput.value = '';
            answerInput.classList.remove('border-rose-500', 'animate-shake');
        }
        if (errorText) errorText.classList.add('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => answerInput?.focus(), 200);
    }

    submitAnswer() {
        if (!this.currentActiveCapsule) return;

        const capsule = this.currentActiveCapsule;
        const answerInput = document.getElementById('modal-answer-input');
        const errorText = document.getElementById('modal-answer-error');
        const modalContent = document.getElementById('question-modal-box');

        const rawAnswer = answerInput ? answerInput.value : '';
        const cleanAnswer = this.normalizeTurkish(rawAnswer);

        if (!cleanAnswer) {
            if (errorText) {
                errorText.innerText = 'Lütfen bir cevap yaz sevgilim ❤️';
                errorText.classList.remove('hidden');
            }
            return;
        }

        const acceptedAnswers = (capsule.answers || []).map(a => this.normalizeTurkish(a));
        const isCorrect = acceptedAnswers.some(ans => cleanAnswer === ans || (cleanAnswer.length >= 3 && ans.includes(cleanAnswer)));

        if (isCorrect) {
            this.unlockedIds.add(capsule.id);
            this.saveUnlockedState();

            if (window.romanticAudio) window.romanticAudio.playUnlockSound();
            if (window.confetti && coupleConfig.theme.showConfettiOnUnlock) this.triggerConfetti();

            modalContent.classList.add('animate-unlock-celebrate');

            setTimeout(() => {
                modalContent.classList.remove('animate-unlock-celebrate');
                this.closeModal('question-modal');
                this.renderCapsules();
                this.openContentModal(capsule);
            }, 700);
        } else {
            if (window.romanticAudio) window.romanticAudio.playErrorSound();
            if (errorText) {
                errorText.innerText = 'Bilemedin sevgilim, biraz daha düşün veya ipucuna bak! 🙈';
                errorText.classList.remove('hidden');
            }
            if (answerInput) {
                answerInput.classList.add('border-rose-500', 'animate-shake');
                setTimeout(() => answerInput.classList.remove('animate-shake'), 600);
            }
        }
    }

    normalizeTurkish(text) {
        if (!text) return '';
        return text
            .toString()
            .trim()
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '');
    }

    /* ⌛ Zaman Kilit Modalı */
    openTimeLockModal(capsule) {
        const modal = document.getElementById('timelock-modal');
        const titleEl = document.getElementById('timelock-title');
        const dateEl = document.getElementById('timelock-date');
        const targetDate = new Date(capsule.targetDate);

        if (titleEl) titleEl.innerText = capsule.title;
        if (dateEl) dateEl.innerText = targetDate.toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    /* 📖 Zengin Kapsül İçerik Modalı */
    openContentModal(capsule) {
        this.currentActiveCapsule = capsule;
        const modal = document.getElementById('content-modal');
        if (!modal) return;
        
        const titleEl = document.getElementById('modal-capsule-title');
        if (titleEl) titleEl.innerText = capsule.title || 'İkimizin Anısı';

        if (window.voiceRecorder) {
            window.voiceRecorder.setupModalVoicePlayer(capsule.content?.audio, capsule.authorName);
        }

        const dateEl = document.getElementById('modal-capsule-date');
        if (dateEl) {
            dateEl.innerHTML = `<i data-lucide="calendar" class="w-3.5 h-3.5 text-rose-400"></i> <span>${capsule.dateLabel || 'Özel Gün'}</span>`;
        }

        // Yazar etiketi
        const authorEl = document.getElementById('modal-capsule-author');
        if (authorEl) {
            authorEl.innerText = `Hazırlayan: ${capsule.authorName || 'Biri'}`;
        }

        const letterEl = document.getElementById('modal-capsule-letter');
        if (letterEl) {
            const letterContent = capsule.content?.letter || 'Bu mektubun içi sonsuz sevgiyle dolu...';
            letterEl.innerText = letterContent;
        }

        const galleryContainer = document.getElementById('modal-photo-gallery');
        let photos = capsule.content?.photos || [];

        // Eğer photos boş ama coverImage varsa onu göster
        if ((!photos || photos.length === 0) && capsule.coverImage) {
            photos = [capsule.coverImage];
        }

        if (galleryContainer) {
            if (photos && photos.length > 0) {
                galleryContainer.innerHTML = photos.map((p, idx) => {
                    const imgUrl = typeof p === 'string' ? p : (p.url || p);
                    const caption = typeof p === 'object' ? (p.caption || '') : '';
                    return `
                        <div class="rounded-2xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer" onclick="window.app.openLightbox('${imgUrl}', '${caption}')">
                            <div class="h-44 overflow-hidden relative">
                                <img src="${imgUrl}" alt="Fotoğraf ${idx + 1}" class="w-full h-full object-cover gallery-thumb" loading="lazy" />
                                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <i data-lucide="zoom-in" class="w-6 h-6"></i>
                                </div>
                            </div>
                            ${caption ? `<div class="p-2.5 text-xs text-gray-300 text-center font-romantic-serif italic">${caption}</div>` : ''}
                        </div>
                    `;
                }).join('');
                if (galleryContainer.parentElement) galleryContainer.parentElement.classList.remove('hidden');
            } else {
                if (galleryContainer.parentElement) galleryContainer.parentElement.classList.add('hidden');
            }
        }

        const songContainer = document.getElementById('modal-song-container');
        if (songContainer) {
            if (capsule.content?.song) {
                const songTitle = document.getElementById('modal-song-title');
                const songArtist = document.getElementById('modal-song-artist');
                if (songTitle) songTitle.innerText = capsule.content.song.title || 'Özel Melodi';
                if (songArtist) songArtist.innerText = capsule.content.song.artist || 'Bizim Şarkımız';
                songContainer.classList.remove('hidden');
            } else {
                songContainer.classList.add('hidden');
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        if (window.lucide) lucide.createIcons();
    }

    openLightbox(imageUrl, caption) {
        const lightbox = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const cap = document.getElementById('lightbox-caption');

        if (img) img.src = imageUrl;
        if (cap) cap.innerText = caption || '';

        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    }

    /* 💖 Kalp / Beğeni Bırak veya Geri Çek (1 Kez Tıklanabilir Toggle) */
    async addHeartReaction(capsuleId, event) {
        if (event) event.stopPropagation();

        let result = null;
        if (window.supabaseService) {
            result = await window.supabaseService.toggleReaction(capsuleId, this.currentProfile);
            this.reactions[capsuleId] = { count: result.count, likedBy: result.likedBy };
        } else {
            let target = this.reactions[capsuleId];
            if (!target || typeof target !== 'object') {
                target = { count: typeof target === 'number' ? target : 0, likedBy: [] };
            }
            let likedBy = Array.isArray(target.likedBy) ? [...target.likedBy] : [];
            let userId = this.currentProfile ? this.currentProfile.id : (localStorage.getItem('device_client_id') || 'guest');
            let isLiked = false;
            if (likedBy.includes(userId)) {
                likedBy = likedBy.filter(id => id !== userId);
                isLiked = false;
            } else {
                likedBy.push(userId);
                isLiked = true;
            }
            result = { count: likedBy.length, isLiked, likedBy };
            this.reactions[capsuleId] = { count: likedBy.length, likedBy };
            localStorage.setItem('capsule_reactions', JSON.stringify(this.reactions));
        }

        if (result.isLiked) {
            if (window.romanticParticles && event) {
                window.romanticParticles.spawnHeartBurst(event.clientX, event.clientY, 16);
            }
            if (window.romanticAudio) window.romanticAudio.playUnlockSound();
            this.showToast("Bu anıya kalp bıraktın! 💖");
        } else {
            this.showToast("Kalp geri çekildi.");
        }

        this.renderCapsules();
    }

    triggerConfetti() {
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 160,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff758c', '#ff7eb3', '#f43f5e', '#fbbf24', '#a855f7']
        });
    }

        closeModal(modalId) {
        if (modalId === 'profile-auth-modal' && !this.currentProfile) {
            // Giriş yapılmadan bu modal kapatılamaz!
            return;
        }

        if (modalId === 'content-modal' && window.voiceRecorder) {
            window.voiceRecorder.stopModalAudio();
        }
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 z-50 glass-panel px-5 py-3 rounded-2xl border border-rose-500/40 text-rose-200 text-sm shadow-2xl flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<span>💖</span> <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

        /* 👤 Profil Seçme / PIN Girişi */
    openProfileModal() {
        const modal = document.getElementById('profile-auth-modal');
        if (!modal) return;

        const p1 = this.config.profiles.partner1;
        const p2 = this.config.profiles.partner2;

        const p1El = document.getElementById('profile-name-1');
        const p2El = document.getElementById('profile-name-2');
        if (p1El) p1El.innerText = p1.name;
        if (p2El) p2El.innerText = p2.name;

        document.getElementById('pin-entry-container')?.classList.add('hidden');
        document.getElementById('profile-select-step')?.classList.remove('hidden');

        // Oturum durumuna göre butonları göster/gizle
        const closeBtn = document.getElementById('close-profile-modal-btn');
        const logoutBtn = document.getElementById('logout-profile-btn');

        if (this.currentProfile) {
            if (closeBtn) closeBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            if (closeBtn) closeBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    selectProfileForLogin(profileId) {
        this.selectedProfileForLogin = this.config.profiles[profileId];
        const step1 = document.getElementById('profile-select-step');
        const step2 = document.getElementById('pin-entry-container');
        const targetName = document.getElementById('pin-target-name');
        const pinInput = document.getElementById('profile-pin-input');
        const pinError = document.getElementById('pin-error-text');

        if (targetName) targetName.innerText = `${this.selectedProfileForLogin.name} (${this.selectedProfileForLogin.roleTitle})`;
        if (pinInput) {
            pinInput.value = '';
            pinInput.classList.remove('border-rose-500', 'animate-shake');
        }
        if (pinError) pinError.classList.add('hidden');

        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        setTimeout(() => pinInput?.focus(), 150);
    }

    verifyProfilePIN() {
        if (!this.selectedProfileForLogin) return;

        const pinInput = document.getElementById('profile-pin-input');
        const pinError = document.getElementById('pin-error-text');
        const enteredPin = (pinInput?.value || '').trim();

        if (enteredPin === this.selectedProfileForLogin.pin) {
            // Başarılı Giriş!
            this.currentProfile = this.selectedProfileForLogin;
            localStorage.setItem('active_profile_id', this.currentProfile.id);

            this.updateProfileUI();
            if (window.fortuneManager) window.fortuneManager.updateFortuneUI(this.currentProfile);
            this.closeModal('profile-auth-modal');
            this.renderCapsules();
            this.showToast(`Hoş geldin ${this.currentProfile.name}! 🕶️`);
        } else {
            if (pinError) {
                pinError.innerText = 'Hatalı PIN kodu! Lütfen tekrar dene sevgilim.';
                pinError.classList.remove('hidden');
            }
            if (pinInput) {
                pinInput.classList.add('border-rose-500', 'animate-shake');
                setTimeout(() => pinInput.classList.remove('animate-shake'), 600);
            }
        }
    }

    logoutProfile() {
        this.currentProfile = null;
        localStorage.removeItem('active_profile_id');
        this.updateProfileUI();
        if (window.fortuneManager) window.fortuneManager.updateFortuneUI(this.currentProfile);
        this.renderCapsules();
        this.showToast("Oturum kapatıldı.");
        this.openProfileModal();
    }

    /* ➕ Yeni Kapsül Ekleme veya Düzenleme */
    openAddCapsuleModal() {
        if (!this.currentProfile) {
            this.openProfileModal();
            this.showToast("Kapsül eklemek için lütfen önce profilini seç sevgilim! 💖");
            return;
        }

        this.editingCapsuleId = null;
        if (window.imageUploader) window.imageUploader.clear();
        if (window.voiceRecorder) window.voiceRecorder.resetRecorderUI();
        document.getElementById('add-modal-title').innerText = "Yeni Anı / Sürpriz Kapsülü";
        document.getElementById('add-memory-form').reset();
        
        // Yazar bilgisini ayarla
        if (window.voiceRecorder) window.voiceRecorder.setExistingAudio(null);
        document.getElementById('author-display-name').innerText = `${this.currentProfile.name} (${this.currentProfile.roleTitle})`;

        const modal = document.getElementById('add-memory-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        this.updateFormFieldsVisibility();
    }

        openEditModal(capsuleId) {
        const capsule = this.capsules.find(c => c.id === capsuleId);
        if (!capsule) return;

        this.editingCapsuleId = capsule.id;
        document.getElementById('add-modal-title').innerText = "Kapsülü Düzenle ✏️";

        document.getElementById('new-title').value = capsule.title || '';
        document.getElementById('new-type').value = capsule.type || 'open';
        document.getElementById('new-target-user').value = capsule.targetUser || 'both';
        document.getElementById('new-datelabel').value = capsule.dateLabel || '';
        document.getElementById('new-summary').value = capsule.summary || '';
        document.getElementById('new-letter').value = capsule.content?.letter || '';
        document.getElementById('new-question').value = capsule.question || '';
        document.getElementById('new-answers').value = (capsule.answers || []).join(', ');
        document.getElementById('new-hint').value = capsule.hint || '';

        if (capsule.targetDate) {
            const d = new Date(capsule.targetDate);
            document.getElementById('new-targetdate').value = d.toISOString().slice(0, 16);
        }

        // Fotoğrafları yükleyiciye yükle
        if (window.imageUploader) {
            const existingPhotos = capsule.content?.photos || (capsule.coverImage ? [capsule.coverImage] : []);
            window.imageUploader.setExistingPhotos(existingPhotos);
        }

        if (window.voiceRecorder) window.voiceRecorder.setExistingAudio(capsule.content?.audio);
        document.getElementById('author-display-name').innerText = capsule.authorName || (this.currentProfile?.name || 'Ben');

        const modal = document.getElementById('add-memory-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        this.updateFormFieldsVisibility();
    }

    updateFormFieldsVisibility() {
        const typeSelect = document.getElementById('new-type');
        const qFields = document.getElementById('form-question-fields');
        const tFields = document.getElementById('form-time-fields');
        if (qFields) qFields.classList.toggle('hidden', typeSelect.value !== 'question');
        if (tFields) tFields.classList.toggle('hidden', typeSelect.value !== 'time');
    }

    async handleSaveCapsule() {
        const title = document.getElementById('new-title')?.value.trim() || 'Yeni Anı';
        const type = document.getElementById('new-type')?.value || 'open';
        const targetUser = document.getElementById('new-target-user')?.value || 'both';
        const dateLabel = document.getElementById('new-datelabel')?.value.trim() || 'Özel Gün';
        const summary = document.getElementById('new-summary')?.value.trim() || 'İkimizin güzel bir anısı...';
        const letter = document.getElementById('new-letter')?.value || '';
        const question = document.getElementById('new-question')?.value || '';
        const answersRaw = document.getElementById('new-answers')?.value || '';
        const hint = document.getElementById('new-hint')?.value || '';
        const targetDate = document.getElementById('new-targetdate')?.value || null;

        const answers = answersRaw.split(',').map(s => s.trim()).filter(Boolean);

        // Yüklenen fotoğrafları al (Doğrudan Galeri / Dosya)
        const uploadedPhotos = window.imageUploader ? window.imageUploader.getPhotos() : [];
        const coverImage = (uploadedPhotos.length > 0 ? uploadedPhotos[0] : null) || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';

        const authorId = this.currentProfile ? this.currentProfile.id : 'partner1';
        const authorName = this.currentProfile ? this.currentProfile.name : 'Oğuzhan';

        const capsuleData = {
            id: this.editingCapsuleId || ('capsule-' + Date.now()),
            title,
            type,
            targetUser,
            category: 'Anı',
            dateLabel,
            coverImage,
            summary,
            question: type === 'question' ? question : undefined,
            answers: type === 'question' ? answers : undefined,
            hint: type === 'question' ? hint : undefined,
            targetDate: type === 'time' ? targetDate : undefined,
            author: authorId,
            authorName: authorName,
            content: {
                letter,
                photos: uploadedPhotos,
                audio: window.voiceRecorder?.recordedAudioBase64 || (this.editingCapsuleId ? this.capsules.find(c => c.id === this.editingCapsuleId)?.content?.audio : undefined)
            }
        };

        if (window.supabaseService) {
            await window.supabaseService.saveCapsule(capsuleData);
        }

        // Yerel diziyi güncelle
        const existingIdx = this.capsules.findIndex(c => c.id === capsuleData.id);
        if (existingIdx >= 0) {
            this.capsules[existingIdx] = capsuleData;
        } else {
            this.capsules.unshift(capsuleData);
        }

        this.closeModal('add-memory-modal');
        this.renderCapsules();
        this.showToast(this.editingCapsuleId ? "Kapsül başarıyla güncellendi! ✨" : "Yeni sürpriz kapsül sevgiyle kaydedildi! 💖");
    }

    async deleteCapsule(capsuleId) {
        if (!confirm("Bu anı kapsülünü silmek istediğinize emin misiniz?")) return;

        if (window.supabaseService) {
            await window.supabaseService.deleteCapsule(capsuleId);
        }

        this.capsules = this.capsules.filter(c => c.id !== capsuleId);
        this.renderCapsules();
        this.showToast("Kapsül silindi.");
    }

    /* 🛠️ Olay Dinleyicileri */
    setupEventListeners() {
        // Müzik Çalar
        const toggleMusicBtn = document.getElementById('toggle-music-btn');
        if (toggleMusicBtn) {
            toggleMusicBtn.addEventListener('click', () => {
                if (window.romanticAudio) window.romanticAudio.toggleMusic();
            });
        }

        // Profil Butonları
        const profileBtn = document.getElementById('active-profile-btn');
        if (profileBtn) profileBtn.addEventListener('click', () => this.openProfileModal());

        document.getElementById('select-p1-btn')?.addEventListener('click', () => this.selectProfileForLogin('partner1'));
        document.getElementById('select-p2-btn')?.addEventListener('click', () => this.selectProfileForLogin('partner2'));
        document.getElementById('verify-pin-btn')?.addEventListener('click', () => this.verifyProfilePIN());
        document.getElementById('logout-profile-btn')?.addEventListener('click', () => this.logoutProfile());
        document.getElementById('back-to-profiles-btn')?.addEventListener('click', () => {
            document.getElementById('pin-entry-container').classList.add('hidden');
            document.getElementById('profile-select-step').classList.remove('hidden');
        });

        const pinInput = document.getElementById('profile-pin-input');
        if (pinInput) {
            pinInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.verifyProfilePIN();
            });
        }

        // Kapsül Ekleme & Düzenleme
        document.getElementById('open-add-memory-btn')?.addEventListener('click', () => this.openAddCapsuleModal());
        document.getElementById('new-type')?.addEventListener('change', () => this.updateFormFieldsVisibility());

        document.getElementById('add-memory-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveCapsule();
        });

        // Soru Cevaplama
        document.getElementById('toggle-hint-btn')?.addEventListener('click', () => {
            document.getElementById('hint-container')?.classList.toggle('hidden');
        });
        document.getElementById('submit-answer-btn')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('modal-answer-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });

        // Filtreler
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-filter]').forEach(b => {
                    b.classList.remove('bg-rose-500', 'text-white');
                    b.classList.add('bg-white/5', 'text-gray-300');
                });

                const targetBtn = e.currentTarget;
                targetBtn.classList.remove('bg-white/5', 'text-gray-300');
                targetBtn.classList.add('bg-rose-500', 'text-white');

                this.activeFilter = targetBtn.getAttribute('data-filter');
                this.renderCapsules();
            });
        });

        // Arama
        document.getElementById('search-capsules-input')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderCapsules();
        });

        // Sabırsız Aşık Modu
        document.getElementById('preview-mode-toggle')?.addEventListener('click', () => {
            this.previewMode = !this.previewMode;
            const btn = document.getElementById('preview-mode-toggle');
            if (btn) {
                btn.innerHTML = this.previewMode 
                    ? `<i data-lucide="eye" class="w-4 h-4 text-emerald-400"></i> <span class="text-emerald-300">Önizleme Açık</span>`
                    : `<i data-lucide="eye-off" class="w-4 h-4 text-gray-400"></i> <span class="hidden sm:inline">Sabırsız Mod</span>`;
            }
            this.renderCapsules();
        });

        // Modal Kapatma
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetModal = btn.getAttribute('data-close-modal');
                this.closeModal(targetModal);
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                e.target.classList.add('hidden');
                e.target.classList.remove('flex');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TimeCapsuleApp();
});
