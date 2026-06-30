import { useState } from 'react';
import { LS } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { TabBar } from '../components/UI.jsx';

export default function YapayZeka() {
  const araclar = LS.get('araclar'), bakimlar = LS.get('bakimlar'), yakitlar = LS.get('yakitlar');
  const [analiz, setAnaliz] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [tab, setTab] = useState('ariza');

  const yapayzeka = async (prompt) => {
    setYukleniyor(true); setAnaliz(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      const metin = data.content?.filter(c => c.type === 'text').map(c => c.text).join('') || 'Yanıt alınamadı.';
      setAnaliz(metin);
    } catch (e) {
      setAnaliz('⚠️ AI servisine bağlanılamadı. Bu özellik yalnızca Claude.ai Artifacts ortamında çalışır; bağımsız dağıtımda kendi API anahtarınızla bir backend proxy kurmanız gerekir.');
    }
    setYukleniyor(false);
  };

  const arizaTahmini = () => {
    const veri = araclar.map(a => {
      const aracBakim = bakimlar.filter(b => b.aracId === a.id);
      const aracYakit = yakitlar.filter(y => y.aracId === a.id);
      return { ad: a.ad, saat: a.saat, bakimSayisi: aracBakim.length, sonBakim: aracBakim.sort((x, y) => y.tarih?.localeCompare(x.tarih))[0]?.tarih || 'yok', topYakit: aracYakit.reduce((s, y) => s + y.miktar, 0) };
    });
    yapayzeka(`Sen bir iş makinesi filo yönetim AI asistanısın. Aşağıdaki filo verilerini analiz et ve Türkçe olarak: 1) Hangi araçların arıza riski taşıdığını, 2) Optimum bakım zamanlarını, 3) Yakıt anomalilerini belirt. Kısa ve net ol. Veri: ${JSON.stringify(veri)}`);
  };

  const maliyetProjektion = () => {
    const topYakit = yakitlar.reduce((s, y) => s + (+y.toplam || 0), 0);
    const topBakim = bakimlar.filter(b => b.durum === 'tamamlandi').reduce((s, b) => s + (+b.maliyet || 0), 0);
    yapayzeka(`Filo maliyet analisti olarak, aşağıdaki verilere dayanarak Türkçe maliyet projeksiyonu yap. Güncel toplam yakıt gideri: ${topYakit}₺, bakım gideri: ${topBakim}₺, araç sayısı: ${araclar.length}. Yıllık projeksiyon, tasarruf önerileri ve filo büyütme/küçültme tavsiyesi ver. Madde madde ve kısa ol.`);
  };

  const filoBuyutme = () => {
    yapayzeka(`İş makinesi filo danışmanı olarak, ${araclar.length} araçlık mevcut filoya bakarak Türkçe değerlendirme yap: Araç tipleri: ${araclar.map(a => a.tip).join(', ')}. Filo optimizasyonu, hangi tip araç eksik olabilir, hangileri yetersiz kullanılıyor olabilir. Kısa ve pratik öneriler ver.`);
  };

  return (
    <div>
      <div style={{ ...S.card, borderTop: `3px solid ${C.purple}`, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 32 }}>🤖</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Claude AI ile Filo Analizi</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Gerçek filo verilerinizi analiz eder, tahmin ve öneri üretir.</div>
          </div>
          <span style={{ ...S.badge(C.purple), marginLeft: 'auto' }}>İLERİ FAZ</span>
        </div>
      </div>

      <TabBar tabs={[['ariza', '🔮 Arıza Tahmini'], ['maliyet', '💹 Maliyet Proj.'], ['filo', '📊 Filo Analizi']]} active={tab} onChange={setTab} />

      {tab === 'ariza' && (
        <div style={S.card}>
          <div style={S.secTitle}>🔮 Arıza Öngörüsü & Bakım Zamanı</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Mevcut bakım geçmişi, çalışma saatleri ve yakıt tüketim verileri analiz edilir.</div>
          <button style={S.btn(C.purple)} onClick={arizaTahmini} disabled={yukleniyor}>{yukleniyor ? '⏳ Analiz yapılıyor...' : '🔮 Arıza Tahmini Yap'}</button>
          {analiz && <div style={{ marginTop: 16, background: '#0f1117', borderRadius: 10, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap', borderLeft: `3px solid ${C.purple}` }}>{analiz}</div>}
        </div>
      )}

      {tab === 'maliyet' && (
        <div style={S.card}>
          <div style={S.secTitle}>💹 Maliyet Projeksiyonu</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Geçmiş gider verileri üzerinden gelecek dönem maliyet projeksiyonu üretilir.</div>
          <button style={S.btn(C.purple)} onClick={maliyetProjektion} disabled={yukleniyor}>{yukleniyor ? '⏳ Hesaplanıyor...' : '💹 Projeksiyon Üret'}</button>
          {analiz && <div style={{ marginTop: 16, background: '#0f1117', borderRadius: 10, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap', borderLeft: `3px solid ${C.purple}` }}>{analiz}</div>}
        </div>
      )}

      {tab === 'filo' && (
        <div style={S.card}>
          <div style={S.secTitle}>📊 Filo Büyütme / Küçültme Analizi</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Mevcut filo kompozisyonu analiz edilerek optimizasyon önerileri sunulur.</div>
          <button style={S.btn(C.purple)} onClick={filoBuyutme} disabled={yukleniyor}>{yukleniyor ? '⏳ Analiz ediliyor...' : '📊 Filo Analizi Yap'}</button>
          {analiz && <div style={{ marginTop: 16, background: '#0f1117', borderRadius: 10, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap', borderLeft: `3px solid ${C.purple}` }}>{analiz}</div>}
        </div>
      )}

      <div style={{ ...S.card, marginTop: 16, background: `${C.purple}08`, borderColor: `${C.purple}33` }}>
        <div style={{ fontSize: 13, color: C.muted }}>
          <strong style={{ color: C.purple }}>ℹ️ Not</strong> — Bu modül Claude API'ye bağlanır. Bağımsız (self-hosted) dağıtımda CORS ve API anahtarı kısıtları nedeniyle çağrının bir backend proxy üzerinden yapılması gerekir.
        </div>
      </div>
    </div>
  );
}
