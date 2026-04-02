# 📊 Anket & Veri Toplama Platformu

Modern, interaktif ve ölçeklenebilir bir anket ve veri toplama platformu. Next.js ile geliştirilmiş, Docker ile konteynerleştirilmiş, CI/CD pipeline ile otomatize edilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Özellikler

### 🎨 Arayüz & Tema
- Koyu/Açık tema (localStorage + OS uyumlu)
- Skeleton loader animasyonları
- Glassmorphism tasarım dili

### 📝 Anket Motoru
- Metin ve resimli anketler
- Animasyonlu progress bar sonuçlar
- Geri sayımlı (countdown) süreli anketler
- Kullanıcı üretimi anket oluşturma

### 🏆 Oyunlaştırma
- Puan sistemi (oy ver +10, anket oluştur +25)
- 7 farklı rozet ve konfetili bildirim
- Kullanıcı istatistikleri paneli

### 💬 Sosyal Etkileşim
- Yorum ve tartışma modülü (nested reply)
- Sosyal paylaşım (X, WhatsApp)
- Open Graph meta etiketleri

### 📋 Veri Toplama
- Lead generation formu (e-posta regex + telefon maskeleme)
- Toast bildirim sistemi
- CSV dışa aktarma

### 🤖 Yapay Zeka
- AI anket asistanı (konu bazlı öneri)
- Sentiment (duygu) analizi

### 🔐 Yetkilendirme
- Kullanıcı kayıt/giriş (şifre hashleme)
- İzole admin giriş portalı (`/panel-access`)
- JWT-like token yönetimi
- Protected routes (admin guard)

### 🛠️ Admin Paneli
- Anket, lead, yorum yönetimi
- İçerik moderasyonu (flag/sil)
- CSV/Excel dışa aktarma

## 🚀 Hızlı Başlangıç

### Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda aç: [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# .env dosyası oluştur
cp .env.example .env

# Konteyner başlat
docker-compose up -d --build
```

## 🔑 Varsayılan Admin Bilgileri

```
E-posta: admin@anket.com
Şifre:   Admin123!
Giriş:   /panel-access
```

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── page.js              # Ana sayfa
│   ├── login/               # Kullanıcı girişi
│   ├── register/            # Kullanıcı kaydı
│   ├── panel-access/        # Admin girişi
│   ├── admin/               # Admin paneli
│   ├── layout.js            # Root layout
│   └── globals.css          # Design system
├── components/              # UI bileşenleri
│   ├── SurveyCard.js
│   ├── ImageSurveyCard.js
│   ├── AIAssistant.js
│   ├── SentimentAnalysis.js
│   ├── CommentSection.js
│   └── ...
└── context/                 # Global state
    ├── AuthProvider.js
    ├── ThemeProvider.js
    ├── GamificationProvider.js
    └── ToastProvider.js
```

## 🐳 DevOps

- **Dockerfile**: Multi-stage build (deps → build → runner)
- **docker-compose.yml**: App + PostgreSQL
- **CI/CD**: GitHub Actions (Lint → Build → Docker → Deploy)

## 📄 Lisans

MIT
