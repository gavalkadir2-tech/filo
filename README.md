# 🚜 FiloPro — İş Makinesi & Filo Yönetim Sistemi

Türkçe, tam özellikli iş makinesi filo yönetim uygulaması. React + Vite ile geliştirilmiş, localStorage tabanlı, sıfır backend bağımlılığı.

## ✨ Özellikler

### FAZ 1 — Temel Yönetim
- 📊 **Dashboard** — Anlık filo özeti, uyarılar, KPI'lar
- 🚜 **Araç Yönetimi** — CRUD, proje & operatör ataması
- 🔧 **Bakım Takibi** — Planlı/bekleyen/tamamlanan bakımlar
- ⛽ **Yakıt Yönetimi** — İkmal kayıtları, araç bazlı tüketim
- 👷 **Operatörler** — Ehliyet, belge takibi, araç ataması
- 📋 **Evrak Takibi** — Sigorta/muayene/belge süresi uyarıları

### FAZ 2 — Gelişmiş Operasyon
- 🛡️ **Hasar & Sigorta** — Hasar dosyaları, tazminat takibi
- 🏭 **Yedek Parça** — Stok yönetimi, kritik seviye uyarısı
- 📌 **İş Emirleri** — Kanban tarzı görev yönetimi
- 🏗️ **Proje & Maliyet** — Bütçe vs gerçekleşen, proje bazlı analiz

### FAZ 3 — Enterprise
- ⛽ **Akaryakıt İstasyonu** — Pompa entegrasyonu, kart sistemi, limitler
- 📱 **Mobil Saha** — Çalışma saati, arıza bildirimi, QR tarama
- 🔔 **Bildirim Merkezi** — Otomatik uyarılar, kanal tercihleri
- 🔐 **Kullanıcı & Yetki** — RBAC, 2FA, işlem logu
- 🏢 **ERP Entegrasyon** — Logo/Luca/Mikro/SAP bağlantısı
- 🤖 **Yapay Zeka** — Claude AI ile arıza tahmini, maliyet projeksiyonu

### FAZ 4 — Muhasebe & Finans
- 💰 **Gelir/Gider Defteri** — Çift taraflı kayıt, KDV takibi
- 🧾 **Fatura Yönetimi** — Kesilen & alınan faturalar
- 📈 **Finansal Raporlar** — Kar/zarar, nakit akışı, bilanço özeti
- 💳 **Kasa & Banka** — Hesap hareketleri, bakiye takibi
- 📊 **Analitik Dashboard** — Recharts ile görsel raporlar

## 🚀 Kurulum

```bash
git clone https://github.com/KULLANICI_ADI/filopro.git
cd filopro
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## 📦 Build

```bash
npm run build
# dist/ klasörü oluşur — GitHub Pages, Netlify, Vercel'e deploy edilebilir
```

## 🌐 GitHub Pages Deploy

```bash
# gh-pages paketi ile:
npm install -D gh-pages
# package.json'a ekleyin: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

## 🛠️ Teknoloji

| Araç | Versiyon | Kullanım |
|------|----------|----------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool |
| Recharts | 2.12 | Grafikler |
| Lucide React | 0.383 | İkonlar |
| localStorage | — | Veri saklama |

## 📁 Proje Yapısı

```
filopro/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Ana shell + routing
│   ├── styles.js             # Stil sabitleri
│   ├── utils/
│   │   ├── storage.js        # localStorage helpers
│   │   ├── formatters.js     # Para/tarih formatlama
│   │   └── seed.js           # Demo veri
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── StatCard.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   └── pages/
│       ├── Dashboard.jsx
│       ├── AracYonetimi.jsx
│       ├── Muhasebe/
│       │   ├── GelirGider.jsx
│       │   ├── Faturalar.jsx
│       │   ├── KasaBanka.jsx
│       │   └── FinansalRaporlar.jsx
│       └── ...
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 📝 Lisans

MIT © 2026 FiloPro
