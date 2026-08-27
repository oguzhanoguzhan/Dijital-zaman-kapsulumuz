/**
 * ====================================================================
 * 📸 AKILLI FOTOĞRAF YÜKLEYİCİ & SIKIŞTIRICI (js/image-uploader.js)
 * ====================================================================
 */

class ImageUploaderManager {
    constructor() {
        this.selectedPhotos = [];
        this.maxDimension = 1280;
        this.quality = 0.82;

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
        const fileInput = document.getElementById('form-photo-file-input');
        const triggerBtn = document.getElementById('trigger-photo-upload-btn');
        const dropZone = document.getElementById('photo-drop-zone');

        if (triggerBtn && fileInput) {
            triggerBtn.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelection(e.target.files));
        }

        if (dropZone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.classList.add('border-rose-500', 'bg-rose-500/10');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.classList.remove('border-rose-500', 'bg-rose-500/10');
                });
            });

            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                this.handleFileSelection(files);
            });
        }
    }

    async handleFileSelection(files) {
        if (!files || files.length === 0) return;

        const loadingIndicator = document.getElementById('photo-upload-loading');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            try {
                const compressedBase64 = await this.compressImage(file);
                this.selectedPhotos.push(compressedBase64);
            } catch (err) {
                console.error("Fotoğraf sıkıştırma hatası:", err);
            }
        }

        if (loadingIndicator) loadingIndicator.classList.add('hidden');
        this.renderThumbnails();

        // Dosya inputunu sıfırla ki aynı dosya tekrar seçilebilsin
        const fileInput = document.getElementById('form-photo-file-input');
        if (fileInput) fileInput.value = '';
    }

    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > this.maxDimension) {
                            height = Math.round((height * this.maxDimension) / width);
                            width = this.maxDimension;
                        }
                    } else {
                        if (height > this.maxDimension) {
                            width = Math.round((width * this.maxDimension) / height);
                            height = this.maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', this.quality);
                    resolve(dataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    renderThumbnails() {
        const container = document.getElementById('photo-thumbnails-container');
        if (!container) return;

        if (this.selectedPhotos.length === 0) {
            container.innerHTML = '';
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = this.selectedPhotos.map((photo, index) => `
            <div class="relative w-20 h-20 rounded-xl overflow-hidden group border border-white/20 shadow-md">
                <img src="${photo}" alt="Önizleme ${index + 1}" class="w-full h-full object-cover">
                <button 
                    type="button" 
                    onclick="window.imageUploader?.removePhoto(${index})" 
                    class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow"
                    title="Fotoğrafı Sil"
                >
                    ✕
                </button>
                <div class="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-gray-300 py-0.5">
                    ${index === 0 ? 'Kapak' : `#${index + 1}`}
                </div>
            </div>
        `).join('');
    }

    removePhoto(index) {
        this.selectedPhotos.splice(index, 1);
        this.renderThumbnails();
    }

    getPhotos() {
        return this.selectedPhotos;
    }

    getCoverPhoto() {
        return this.selectedPhotos.length > 0 ? this.selectedPhotos[0] : null;
    }

    setExistingPhotos(photos) {
        if (Array.isArray(photos)) {
            this.selectedPhotos = [...photos];
        } else if (typeof photos === 'string' && photos.trim() !== '') {
            this.selectedPhotos = [photos];
        } else {
            this.selectedPhotos = [];
        }
        this.renderThumbnails();
    }

    clear() {
        this.selectedPhotos = [];
        this.renderThumbnails();
    }
}

window.imageUploader = new ImageUploaderManager();
