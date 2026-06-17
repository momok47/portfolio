// ========================================
// ハンバーガーメニューの機能
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        // ハンバーガーメニューのクリックイベント
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // アニメーション効果
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // メニュー内のリンクをクリックしたらメニューを閉じる
        const menuLinks = document.querySelectorAll('.nav-links a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });

        // メニュー外をクリックしたら閉じる
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            }
        });
    }

    // ========================================
    // スクロール時のナビゲーション効果
    // ========================================
    const nav = document.querySelector('.fixed-nav');
    if (nav) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.style.boxShadow = '0 5px 25px rgba(77, 59, 50, 0.2)';
            } else {
                nav.style.boxShadow = '0 2px 20px rgba(77, 59, 50, 0.15)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // ========================================
    // スムーズなページ内スクロール
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // フェードインアニメーション
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 要素を監視（トップページは専用のreveal演出に任せる）
    if (!document.body.classList.contains('home-page')) {
        const animateElements = document.querySelectorAll('.interest-card, .timeline-item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // ========================================
    // ✨ トップページ専用：可愛い動きの演出
    // ========================================
    if (document.body.classList.contains('home-page')) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // --- スクロールで順番にふわっと出現 ---
        const revealEls = document.querySelectorAll('.home-page .reveal');
        if (prefersReduced) {
            revealEls.forEach(el => el.classList.add('is-visible'));
        } else {
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        // 同じグループ内で少しずつ遅らせて、こなれた印象に
                        const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
                        const idx = Math.max(0, siblings.indexOf(el));
                        el.style.transitionDelay = (idx * 0.12) + 's';
                        el.classList.add('is-visible');
                        obs.unobserve(el);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(el => revealObserver.observe(el));
        }

        // --- 浮遊するハート・キラキラを生成 ---
        if (!prefersReduced) {
            const layer = document.querySelector('.deco-layer');
            if (layer) {
                const motifs = ['💕', '💗', '🤍', '✨', '⭐️', '🩷'];
                const sparkles = ['✨', '⭐️'];
                const COUNT = 16;

                for (let i = 0; i < COUNT; i++) {
                    const span = document.createElement('span');
                    const motif = motifs[Math.floor(Math.random() * motifs.length)];
                    span.textContent = motif;
                    span.className = 'deco' + (sparkles.includes(motif) ? ' sparkle' : '');

                    const size = 0.8 + Math.random() * 1.4;        // rem
                    const duration = 14 + Math.random() * 12;       // s
                    const delay = -Math.random() * duration;        // 最初から散らばらせる
                    const drift = (Math.random() * 8 - 4).toFixed(1); // 横揺れ vw
                    const opacity = (0.35 + Math.random() * 0.4).toFixed(2);

                    span.style.left = (Math.random() * 100).toFixed(1) + 'vw';
                    span.style.fontSize = size.toFixed(2) + 'rem';
                    span.style.animationDuration = duration.toFixed(1) + 's';
                    span.style.animationDelay = delay.toFixed(1) + 's';
                    span.style.setProperty('--deco-drift', drift + 'vw');
                    span.style.setProperty('--deco-opacity', opacity);

                    layer.appendChild(span);
                }
            }

            // --- ヒーロー画像にやさしい視差（マウス追従） ---
            const heroImg = document.querySelector('.home-page .hero-image');
            if (heroImg && window.matchMedia('(pointer: fine)').matches) {
                const hero = document.querySelector('.home-page .hero-section');
                hero.addEventListener('mousemove', (e) => {
                    const r = hero.getBoundingClientRect();
                    const dx = ((e.clientX - r.left) / r.width - 0.5) * 10;
                    const dy = ((e.clientY - r.top) / r.height - 0.5) * 10;
                    heroImg.style.transform = `translate(${dx}px, ${dy}px)`;
                });
                hero.addEventListener('mouseleave', () => {
                    heroImg.style.transform = '';
                });
            }
        }
    }
});
