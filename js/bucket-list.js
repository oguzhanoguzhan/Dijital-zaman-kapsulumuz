/**
 * ====================================================================
 * 🎯 ORTAK HAYAL LİSTESİ (BUCKET LIST) MOTORU (js/bucket-list.js) 🎯
 * ====================================================================
 * Çiftin birlikte yapmak istediği hayalleri kaydedip gerçekleştirdikçe
 * tik atabildiği, anı fotoğrafı ekleyebildiği ve ilerleme durumunu
 * takip edebildiği interaktif modül.
 */

class BucketListManager {
    constructor() {
        this.items = [];
        this.activeFilter = 'all'; // 'all', 'pending', 'completed'
        this.searchQuery = '';
        this.editingItemId = null;
        this.celebratingItemId = null;

        // Fotoğraf Yükleme Geçici Durumları
        this.uploadedDreamPhoto = null;
        this.uploadedCelebratePhoto = null;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupPhotoUploaders();
        await this.loadData();
    }

    /* 📥 Verileri Supabase veya Yerelden Yükle */
    async loadData() {
        if (window.supabaseService) {
            this.items = await window.supabaseService.fetchBucketList();
        } else {
            const saved = localStorage.getItem('bucket_list_items');
            this.items = saved ? JSON.parse(saved) : [];
        }
        this.render();
    }

    /* 🎨 Arayüzü Render Et */
    render() {
        const gridEl = document.getElementById('bucket-list-grid');
        if (!gridEl) return;

        const total = this.items.length;
        const completedCount = this.items.filter(i => i.completed).length;
        const pendingCount = total - completedCount;
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        // 1. İlerleme & İstatistikleri Güncelle
        this.updateProgressUI(total, completedCount, pendingCount, percentage);

        // 2. Durum Filtreleme & Arama
        const filtered = this.items.filter(item => {
            if (this.activeFilter === 'pending' && item.completed) return false;
            if (this.activeFilter === 'completed' && !item.completed) return false;

            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                const matchTitle = (item.title || '').toLowerCase().includes(q);
                const matchNote = (item.note || '').toLowerCase().includes(q);
                const matchTarget = (item.targetDate || '').toLowerCase().includes(q);
                const matchAuthor = (item.authorName || '').toLowerCase().includes(q);
                return matchTitle || matchNote || matchTarget || matchAuthor;
            }

            return true;
        });

        // 3. Boş Durum (Empty State)
        if (filtered.length === 0) {
            const hasAny = this.items.length > 0;
            gridEl.innerHTML = `
                <div class="col-span-full py-14 text-center glass-card rounded-3xl p-8 border border-white/10">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 text-2xl border border-cyan-500/30">
                        ${hasAny ? '🔍' : '🎯'}
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2 font-romantic-serif">
                        ${hasAny ? 'Aradığın Hayal Bulunamadı' : 'Henüz Ortak Bir Hayal Eklenmedi'}
                    </h3>
                    <p class="text-gray-400 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                        ${hasAny 
                            ? 'Durum filtrelerini değiştirmeyi veya arama metnini temizlemeyi deneyebilirsiniz.' 
                            : 'Birlikte yapmak istediğiniz o güzel hayalleri buraya yazın, gerçekleştirdikçe tik atıp kutlayalım! 💖'}
                    </p>
                    ${!hasAny ? `
                        <button onclick="window.bucketListManager.openAddModal()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white text-sm font-medium shadow-lg shadow-cyan-500/25 transition-all">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>İlk Hayalimizi Ekle</span>
                        </button>
                    ` : ''}
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        // 4. Kartları Çiz
        gridEl.innerHTML = filtered.map(item => {
            const isCompleted = item.completed;
            const currentProfile = window.app?.currentProfile;
            const canManage = true; // Her iki taraf da düzenleyebilir / silebilir

            let completedDateFormatted = '';
            if (item.completedAt) {
                try {
                    const d = new Date(item.completedAt);
                    completedDateFormatted = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                } catch (e) {
                    completedDateFormatted = '';
                }
            }

            return `
                <div class="glass-card rounded-3xl p-5 sm:p-6 border transition-all duration-300 group relative flex flex-col justify-between ${isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/10 hover:border-cyan-500/30'}" id="dream-${item.id}">
                    <div>
                        <!-- Üst Durum Rozeti & Aksiyonlar -->
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <div class="flex items-center gap-1.5">
                                ${isCompleted ? `
                                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                        <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                        <span>Gerçekleşti 🎉</span>
                                    </span>
                                ` : (item.targetDate ? `
                                    <span class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                                        <i data-lucide="calendar" class="w-3 h-3 text-cyan-400"></i>
                                        <span>${item.targetDate}</span>
                                    </span>
                                ` : `
                                    <span class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                                        <span>🎯 Ortak Hayal</span>
                                    </span>
                                `)}
                            </div>

                            <div class="flex items-center gap-1">
                                <button onclick="window.bucketListManager.openEditModal('${item.id}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors" title="Hayali Düzenle">
                                    <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="window.bucketListManager.deleteItem('${item.id}')" class="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors" title="Hayali Sil">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Başlık & Tik Atma Butonu -->
                        <div class="flex items-start gap-3.5 mb-3">
                            <button 
                                onclick="window.bucketListManager.toggleComplete('${item.id}')" 
                                class="mt-0.5 shrink-0 w-7 h-7 rounded-xl border flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30' : 'border-white/20 bg-white/5 hover:border-cyan-400 hover:bg-cyan-500/10 text-transparent hover:text-cyan-400'}"
                                title="${isCompleted ? 'Geri al (tamamlanmadı yap)' : 'Gerçekleştirdik olarak işaretle! ✨'}"
                            >
                                <i data-lucide="check" class="w-4 h-4 stroke-[3] ${isCompleted ? 'text-white' : ''}"></i>
                            </button>

                            <div class="flex-1">
                                <h4 class="text-base sm:text-lg font-bold text-white leading-snug transition-all ${isCompleted ? 'line-through text-gray-400' : 'group-hover:text-cyan-300'}">
                                    ${item.title}
                                </h4>
                                ${item.note ? `
                                    <p class="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed italic ${isCompleted ? 'line-through text-gray-500' : ''}">
                                        "${item.note}"
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Alt Bölüm: Anı Fotoğrafı & Tamamlanma Bilgisi -->
                    <div class="pt-3 mt-3 border-t border-white/5 space-y-2.5">
                        ${item.photoUrl ? `
                            <div class="relative rounded-2xl overflow-hidden h-36 bg-black/40 border border-emerald-500/20 group/photo cursor-pointer" onclick="window.app?.openLightbox('${item.photoUrl}', '${item.title} - Gerçekleşen Hayalimiz ✨')">
                                <img src="${item.photoUrl}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105" loading="lazy" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                                    <span class="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                                        <i data-lucide="camera" class="w-3.5 h-3.5"></i> Anı Fotoğrafı (Büyütmek için tıkla)
                                    </span>
                                </div>
                            </div>
                        ` : ''}

                        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                            <span class="flex items-center gap-1">
                                <i data-lucide="user" class="w-3 h-3 text-cyan-400"></i> Ekleyen: ${item.authorName || 'Biz'}
                            </span>

                            ${isCompleted ? `
                                <div class="flex items-center gap-1.5">
                                    <span class="text-emerald-400 font-medium flex items-center gap-1">
                                        <i data-lucide="sparkles" class="w-3 h-3"></i> ${item.completedByName || 'Birlikte'}
                                    </span>
                                    ${completedDateFormatted ? `<span class="text-gray-500">(${completedDateFormatted})</span>` : ''}
                                    <button onclick="window.bucketListManager.openPhotoModal('${item.id}')" class="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 ml-1 transition-colors" title="${item.photoUrl ? 'Anı Fotoğrafını Değiştir' : 'Anı Fotoğrafı Ekle'}">
                                        <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                                    </button>
                                </div>
                            ` : `
                                <button onclick="window.bucketListManager.toggleComplete('${item.id}')" class="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1">
                                    <span>Tamamla</span> <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* 📊 İlerleme Çubuğu ve İstatistik Kartı */
    updateProgressUI(total, completed, pending, percentage) {
        const totalEl = document.getElementById('bucket-stat-total');
        const completedEl = document.getElementById('bucket-stat-completed');
        const pendingEl = document.getElementById('bucket-stat-pending');
        const percentEl = document.getElementById('bucket-stat-percent');
        const barEl = document.getElementById('bucket-progress-bar');
        const messageEl = document.getElementById('bucket-progress-message');
        const tabBadgeEl = document.getElementById('tab-bucket-badge');

        if (totalEl) totalEl.innerText = total;
        if (completedEl) completedEl.innerText = completed;
        if (pendingEl) pendingEl.innerText = pending;
        if (percentEl) percentEl.innerText = `%${percentage}`;
        if (barEl) barEl.style.width = `${percentage}%`;

        if (tabBadgeEl) {
            tabBadgeEl.innerText = total > 0 ? `${completed}/${total} ✨ %${percentage}` : '0 Hayal';
        }

        if (messageEl) {
            if (total === 0) {
                messageEl.innerText = "Birlikte gerçekleştirmek istediğiniz ilk hayali ekleyin ✨";
            } else if (percentage === 100) {
                messageEl.innerText = "🎉 İnanılmaz! Listedeki tüm hayallerinizi gerçeğe dönüştürdünüz! Sonsuz mutluluklar! 🏆💖";
            } else if (percentage >= 75) {
                messageEl.innerText = "🔥 Harika gidiyorsunuz! Hayallerinizin çoğunu gerçeğe dönüştürdünüz bile!";
            } else if (percentage >= 50) {
                messageEl.innerText = "✨ Yarıyı geçtiniz! Birlikte unutulmaz hatıralar biriktiriyorsunuz ❤️";
            } else if (percentage >= 25) {
                messageEl.innerText = "🌱 Güzel bir başlangıç! Adım adım tüm hayallerinize ulaşıyorsunuz 🚀";
            } else {
                messageEl.innerText = "💫 Yolculuk yeni başlıyor... Birlikte gerçekleştireceğimiz nice güzel günler var!";
            }
        }
    }

    /* 📸 Fotoğraf Yükleyici Dinleyicilerini Kur */
    setupPhotoUploaders() {
        // 1. Hayal Ekleme Modalı Fotoğraf Alanı
        const dreamDropZone = document.getElementById('dream-photo-drop-zone');
        const dreamFileInput = document.getElementById('dream-photo-file-input');
        const dreamRemoveBtn = document.getElementById('dream-photo-remove-btn');

        if (dreamDropZone && dreamFileInput) {
            dreamDropZone.addEventListener('click', (e) => {
                if (e.target.closest('#dream-photo-remove-btn')) return;
                dreamFileInput.click();
            });

            dreamFileInput.addEventListener('change', async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const compressed = await this.compressImage(file);
                    this.uploadedDreamPhoto = compressed;
                    this.updateDreamPhotoPreview(compressed);
                }
            });
        }

        if (dreamRemoveBtn) {
            dreamRemoveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.uploadedDreamPhoto = null;
                if (dreamFileInput) dreamFileInput.value = '';
                this.updateDreamPhotoPreview(null);
            });
        }

        // 2. Kutlama Modalı Fotoğraf Alanı
        const celebrateDropZone = document.getElementById('celebrate-photo-drop-zone');
        const celebrateFileInput = document.getElementById('celebrate-photo-file-input');
        const celebrateRemoveBtn = document.getElementById('celebrate-photo-remove-btn');

        if (celebrateDropZone && celebrateFileInput) {
            celebrateDropZone.addEventListener('click', (e) => {
                if (e.target.closest('#celebrate-photo-remove-btn')) return;
                celebrateFileInput.click();
            });

            celebrateFileInput.addEventListener('change', async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const compressed = await this.compressImage(file);
                    this.uploadedCelebratePhoto = compressed;
                    this.updateCelebratePhotoPreview(compressed);
                }
            });
        }

        if (celebrateRemoveBtn) {
            celebrateRemoveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.uploadedCelebratePhoto = null;
                if (celebrateFileInput) celebrateFileInput.value = '';
                this.updateCelebratePhotoPreview(null);
            });
        }
    }

    /* 🖼️ Hayal Modalı Fotoğraf Önizleme Güncelle */
    updateDreamPhotoPreview(dataUrl) {
        const emptyState = document.getElementById('dream-photo-empty-state');
        const previewWrapper = document.getElementById('dream-photo-preview-wrapper');
        const previewImg = document.getElementById('dream-photo-preview-img');

        if (dataUrl) {
            if (previewImg) previewImg.src = dataUrl;
            if (emptyState) emptyState.classList.add('hidden');
            if (previewWrapper) previewWrapper.classList.remove('hidden');
        } else {
            if (previewImg) previewImg.src = '';
            if (previewWrapper) previewWrapper.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
        }
        if (window.lucide) lucide.createIcons();
    }

    /* 🖼️ Kutlama Modalı Fotoğraf Önizleme Güncelle */
    updateCelebratePhotoPreview(dataUrl) {
        const emptyState = document.getElementById('celebrate-photo-empty-state');
        const previewWrapper = document.getElementById('celebrate-photo-preview-wrapper');
        const previewImg = document.getElementById('celebrate-photo-preview-img');

        if (dataUrl) {
            if (previewImg) previewImg.src = dataUrl;
            if (emptyState) emptyState.classList.add('hidden');
            if (previewWrapper) previewWrapper.classList.remove('hidden');
        } else {
            if (previewImg) previewImg.src = '';
            if (previewWrapper) previewWrapper.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
        }
        if (window.lucide) lucide.createIcons();
    }

    /* ⚡ Akıllı Fotoğraf Sıkıştırma (Max 1280px / %82 Kalite) */
    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxDimension = 1280;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxDimension) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        }
                    } else {
                        if (height > maxDimension) {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                    resolve(dataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /* ➕ Yeni Hayal Ekle Modalı Aç */
    openAddModal() {
        this.editingItemId = null;
        this.uploadedDreamPhoto = null;
        this.updateDreamPhotoPreview(null);

        const form = document.getElementById('add-dream-form');
        if (form) form.reset();

        const currentProfile = window.app?.currentProfile;
        const authorName = currentProfile ? `${currentProfile.name} (${currentProfile.roleTitle})` : 'Biz';

        const titleEl = document.getElementById('dream-modal-title');
        const authorEl = document.getElementById('dream-author-name');
        if (titleEl) titleEl.innerText = "Yeni Bir Ortak Hayal Ekle ✨";
        if (authorEl) authorEl.innerText = authorName;

        const modal = document.getElementById('add-dream-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => document.getElementById('dream-title-input')?.focus(), 150);
        }
    }

    /* ✏️ Hayal Düzenleme Modalı Aç */
    openEditModal(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        this.editingItemId = item.id;
        this.uploadedDreamPhoto = item.photoUrl || null;
        this.updateDreamPhotoPreview(this.uploadedDreamPhoto);

        const titleEl = document.getElementById('dream-modal-title');
        const titleInput = document.getElementById('dream-title-input');
        const targetInput = document.getElementById('dream-target-input');
        const noteInput = document.getElementById('dream-note-input');
        const authorEl = document.getElementById('dream-author-name');

        if (titleEl) titleEl.innerText = "Hayali Düzenle ✏️";
        if (titleInput) titleInput.value = item.title || '';
        if (targetInput) targetInput.value = item.targetDate || '';
        if (noteInput) noteInput.value = item.note || '';
        if (authorEl) authorEl.innerText = item.authorName || (window.app?.currentProfile?.name || 'Biz');

        const modal = document.getElementById('add-dream-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    /* 💾 Hayali Kaydet */
    async handleSaveDream() {
        const titleInput = document.getElementById('dream-title-input');
        const targetInput = document.getElementById('dream-target-input');
        const noteInput = document.getElementById('dream-note-input');

        const title = (titleInput?.value || '').trim();
        if (!title) {
            alert("Lütfen hayaliniz için bir başlık yazın sevgilim ❤️");
            return;
        }

        const targetDate = (targetInput?.value || '').trim();
        const note = (noteInput?.value || '').trim();
        const photoUrl = this.uploadedDreamPhoto || null;

        const currentProfile = window.app?.currentProfile;
        const authorId = currentProfile ? currentProfile.id : 'partner1';
        const authorName = currentProfile ? currentProfile.name : 'Oğuzhan';

        let itemData = null;

        if (this.editingItemId) {
            const existing = this.items.find(i => i.id === this.editingItemId);
            itemData = {
                ...existing,
                title,
                targetDate,
                note,
                photoUrl: photoUrl || (this.uploadedDreamPhoto === null ? null : existing?.photoUrl)
            };
        } else {
            itemData = {
                id: 'dream-' + Date.now(),
                title,
                targetDate,
                note,
                completed: false,
                completedAt: null,
                completedBy: null,
                completedByName: null,
                photoUrl: photoUrl || null,
                author: authorId,
                authorName: authorName,
                createdAt: new Date().toISOString()
            };
        }

        if (window.supabaseService) {
            await window.supabaseService.saveBucketItem(itemData);
        }

        // Yerel diziyi güncelle
        const existingIdx = this.items.findIndex(i => i.id === itemData.id);
        if (existingIdx >= 0) {
            this.items[existingIdx] = itemData;
        } else {
            this.items.unshift(itemData);
        }

        this.closeModal('add-dream-modal');
        this.render();
        window.app?.showToast(this.editingItemId ? "Hayal güncellendi! ✏️" : "Yeni ortak hayal listeye eklendi! 🎯💖");
    }

    /* ✔️ Tik At / Tamamlandı Olarak İşaretle */
    async toggleComplete(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        const currentProfile = window.app?.currentProfile;
        const willBeCompleted = !item.completed;

        if (willBeCompleted) {
            item.completed = true;
            item.completedAt = new Date().toISOString();
            item.completedBy = currentProfile ? currentProfile.id : 'partner1';
            item.completedByName = currentProfile ? currentProfile.name : 'Oğuzhan';

            // Kutlama Efektleri
            if (window.confetti) {
                confetti({
                    particleCount: 180,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#ff758c', '#ff7eb3', '#10b981', '#3b82f6', '#fbbf24', '#a855f7']
                });
            }
            if (window.romanticAudio) window.romanticAudio.playUnlockSound();

            // Kutlama Modalı Aç
            this.openCelebrateModal(item);
        } else {
            item.completed = false;
            item.completedAt = null;
            item.completedBy = null;
            item.completedByName = null;
            window.app?.showToast("Hayal bekleyenlere alındı.");
        }

        if (window.supabaseService) {
            await window.supabaseService.saveBucketItem(item);
        }

        this.render();
    }

    /* 🎉 Kutlama Modalı */
    openCelebrateModal(item) {
        this.celebratingItemId = item.id;
        this.uploadedCelebratePhoto = item.photoUrl || null;
        this.updateCelebratePhotoPreview(this.uploadedCelebratePhoto);

        const titleEl = document.getElementById('celebrate-dream-title');
        if (titleEl) titleEl.innerText = item.title;

        const modal = document.getElementById('celebrate-dream-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    /* 📸 Kutlama Modalından Anı Fotoğrafı Kaydet */
    async saveCelebrationPhoto() {
        if (!this.celebratingItemId) return;
        const item = this.items.find(i => i.id === this.celebratingItemId);
        if (!item) return;

        if (this.uploadedCelebratePhoto) {
            item.photoUrl = this.uploadedCelebratePhoto;
            if (window.supabaseService) {
                await window.supabaseService.saveBucketItem(item);
            }
        }

        this.closeModal('celebrate-dream-modal');
        this.render();
        window.app?.showToast("Tebrikler! Bir hayaliniz daha gerçek oldu! 🎉💖");
    }

    /* 📸 Kart Üzerinden Hızlı Fotoğraf Yükleyici Tetikle */
    triggerQuickPhotoUpload(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        const tempInput = document.createElement('input');
        tempInput.type = 'file';
        tempInput.accept = 'image/*';
        tempInput.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const compressed = await this.compressImage(file);
                item.photoUrl = compressed;
                if (window.supabaseService) {
                    await window.supabaseService.saveBucketItem(item);
                }
                this.render();
                window.app?.showToast("Anı fotoğrafı başarıyla yüklendi! 📸✨");
            }
        };
        tempInput.click();
    }

    /* 🗑️ Hayal Sil */
    async deleteItem(itemId) {
        if (!confirm("Bu hayali listeden silmek istediğinize emin misiniz?")) return;

        if (window.supabaseService) {
            await window.supabaseService.deleteBucketItem(itemId);
        }

        this.items = this.items.filter(i => i.id !== itemId);
        this.render();
        window.app?.showToast("Hayal listeden silindi.");
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    /* 🛠️ Olay Dinleyicileri */
    setupEventListeners() {
        // Yeni Hayal Ekle Butonu (Header & Sayfa İçi)
        document.getElementById('open-add-dream-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openAddModal();
        });
        document.getElementById('header-add-dream-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            // Eğer hayal sekmesinde değilse önce o sekmeye geç
            document.getElementById('tab-btn-bucket')?.click();
            this.openAddModal();
        });

        // Form Gönderimi
        document.getElementById('add-dream-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveDream();
        });

        // Kutlama Modal Butonları
        document.getElementById('save-celebrate-photo-btn')?.addEventListener('click', () => this.saveCelebrationPhoto());
        document.getElementById('skip-celebrate-photo-btn')?.addEventListener('click', () => {
            this.closeModal('celebrate-dream-modal');
            window.app?.showToast("Tebrikler! Bir hayaliniz daha gerçek oldu! 🎉💖");
        });

        // Sadece Durum Filtre Butonları (Tümü, Bekleyenler, Gerçekleşenler)
        document.querySelectorAll('[data-bucket-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-bucket-filter]').forEach(b => {
                    b.classList.remove('bg-rose-500', 'text-white');
                    b.classList.add('bg-white/5', 'text-gray-300');
                });

                const targetBtn = e.currentTarget;
                targetBtn.classList.remove('bg-white/5', 'text-gray-300');
                targetBtn.classList.add('bg-rose-500', 'text-white');

                this.activeFilter = targetBtn.getAttribute('data-bucket-filter');
                this.render();
            });
        });

        // Arama Girişi
        document.getElementById('search-bucket-input')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.render();
        });

        // Modal Kapatma Dinleyicileri
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetModal = btn.getAttribute('data-close-modal');
                this.closeModal(targetModal);
            });
        });

        // Sekme Değiştirici (Tabs: Anı Kapsülleri & Hayal Listesi)
        const tabCapsulesBtn = document.getElementById('tab-btn-capsules');
        const tabBucketBtn = document.getElementById('tab-btn-bucket');
        const capsulesSection = document.getElementById('capsules-section-wrapper');
        const bucketSection = document.getElementById('bucket-list-section');

        const switchTab = (tab) => {
            if (tab === 'bucket') {
                tabBucketBtn?.classList.remove('bg-white/5', 'text-gray-300');
                tabBucketBtn?.classList.add('bg-rose-500', 'text-white', 'shadow-lg', 'shadow-rose-500/25');
                
                tabCapsulesBtn?.classList.remove('bg-rose-500', 'text-white', 'shadow-lg', 'shadow-rose-500/25');
                tabCapsulesBtn?.classList.add('bg-white/5', 'text-gray-300');

                capsulesSection?.classList.add('hidden');
                bucketSection?.classList.remove('hidden');
                this.render();
            } else {
                tabCapsulesBtn?.classList.remove('bg-white/5', 'text-gray-300');
                tabCapsulesBtn?.classList.add('bg-rose-500', 'text-white', 'shadow-lg', 'shadow-rose-500/25');
                
                tabBucketBtn?.classList.remove('bg-rose-500', 'text-white', 'shadow-lg', 'shadow-rose-500/25');
                tabBucketBtn?.classList.add('bg-white/5', 'text-gray-300');

                bucketSection?.classList.add('hidden');
                capsulesSection?.classList.remove('hidden');
                if (window.app) window.app.renderCapsules();
            }
        };

        tabCapsulesBtn?.addEventListener('click', () => switchTab('capsules'));
        tabBucketBtn?.addEventListener('click', () => switchTab('bucket'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bucketListManager = new BucketListManager();
});
