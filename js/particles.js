/**
 * ====================================================================
 * ✨ ROMANTİK KALP & PARILTILI PARÇACIK MOTORU (js/particles.js) ✨
 * ====================================================================
 */

class RomanticParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.burstParticles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.heartColors = ['#ff758c', '#ff7eb3', '#f43f5e', '#fda4af', '#f472b6', '#ffd166'];
        this.particleCount = Math.min(Math.floor(window.innerWidth / 24), 50);

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Normal yüzen parçacıkları oluştur
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }

        // Tıklama / Dokunma ile kalp patlaması ekle
        window.addEventListener('pointerdown', (e) => {
            // Buton veya input harici yerlere tıklandığında kalp patlat
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                this.spawnHeartBurst(e.clientX, e.clientY);
            }
        });

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    createParticle() {
        const isHeart = Math.random() > 0.5;
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: isHeart ? (Math.random() * 9 + 7) : (Math.random() * 3 + 1.5),
            speedX: (Math.random() - 0.5) * 0.45,
            speedY: -(Math.random() * 0.5 + 0.2), // Yukarı doğru süzülür
            opacity: Math.random() * 0.6 + 0.2,
            maxOpacity: Math.random() * 0.7 + 0.3,
            color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
            isHeart: isHeart,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    spawnHeartBurst(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 3.5 + 1.5;
            this.burstParticles.push({
                x: x,
                y: y,
                size: Math.random() * 10 + 8,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed - 1.5,
                gravity: 0.06,
                color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
                opacity: 1,
                decay: Math.random() * 0.02 + 0.015,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }

    drawHeart(x, y, size, color, opacity, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 8;

        const s = size / 16;
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-10 * s, -10 * s, -16 * s, 4 * s, 0, 14 * s);
        this.ctx.bezierCurveTo(16 * s, 4 * s, 10 * s, -10 * s, 0, 0);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawSparkle(x, y, size, color, opacity) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Arka plan yüzen parçacıkları güncelle ve çiz
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            // Yanıp sönme efekti
            const currentOpacity = (Math.sin(Date.now() * 0.002 + p.pulseOffset) * 0.5 + 0.5) * p.maxOpacity;

            // Ekrandan çıkarsa alttan yeniden doğsun
            if (p.y < -30) {
                p.y = this.height + 20;
                p.x = Math.random() * this.width;
            }
            if (p.x < -30) p.x = this.width + 20;
            if (p.x > this.width + 30) p.x = -20;

            if (p.isHeart) {
                this.drawHeart(p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
            } else {
                this.drawSparkle(p.x, p.y, p.size, p.color, currentOpacity);
            }
        }

        // 2. Tıklama ile oluşan kalp patlamalarını güncelle
        for (let i = this.burstParticles.length - 1; i >= 0; i--) {
            const bp = this.burstParticles[i];
            bp.x += bp.speedX;
            bp.y += bp.speedY;
            bp.speedY += bp.gravity;
            bp.opacity -= bp.decay;
            bp.rotation += bp.rotSpeed;

            if (bp.opacity <= 0) {
                this.burstParticles.splice(i, 1);
            } else {
                this.drawHeart(bp.x, bp.y, bp.size, bp.color, bp.opacity, bp.rotation);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.romanticParticles = new RomanticParticles('particles-canvas');
});
