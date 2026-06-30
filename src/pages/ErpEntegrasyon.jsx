import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL, today } from '../utils/formatters.js';
import { Badge, FG, InfoBox, Modal, TabBar } from '../components/UI.jsx';

export default function ErpEntegrasyon() {
  const araclar = LS.get('araclar'), bakimlar = LS.get('bakimlar'), yakitlar = LS.get('yakitlar'), projeler = LS.get('projeler');
  const [baglantilar, setBaglantilar] = useState(LS.get('erpBaglantilar'));
  const [aktarimlar, setAktarimlar] = useState(LS.get('erpAktarimlar'));
  const [modal, setModal] = useState(false);
  const [secilen, setSecilen] = useState(null);
  const [tab, setTab] = useState('genel');

  const baglan = () => { const n = baglantilar.map(b => b.id === secilen.id ? { ...secilen, aktif: true, son: today() } : b); LS.set('erpBaglantilar', n); setBaglantilar(n); setModal(false); };

  const aktar = (tip, tutar) => {
    const aktif = baglantilar.find(b => b.aktif);
    if (!aktif) { alert('Önce bir ERP sistemi bağlayın!'); return; }
    const n = [...aktarimlar, { id: uid(), tip, tutar, tarih: today(), hedef: aktif.sistem, durum: 'aktarildi' }];
    LS.set('erpAktarimlar', n); setAktarimlar(n);
  };

  const topYakit = yakitlar.reduce((s, y) => s + (+y.toplam || 0), 0);
  const topBakim = bakimlar.filter(b => b.durum === 'tamamlandi').reduce((s, b) => s + (+b.maliyet || 0), 0);
  const topAmortisman = araclar.reduce((s, a) => { const yas = new Date().getFullYear() - (a.yil || 2020); return s + Math.max(0, ((a.alisFiyat || 500000) - yas * 60000)); }, 0);

  return (
    <div>
      <TabBar tabs={[['genel', '🔗 Bağlantılar'], ['aktarim', '📤 Aktarım'], ['amortisman', '📉 Amortisman'], ['maliyet', '🏗️ Maliyet Merkezi']]} active={tab} onChange={setTab} />

      {tab === 'genel' && (
        <div style={S.g2}>
          {baglantilar.map(b => (
            <div key={b.id} style={{ ...S.card, borderTop: `3px solid ${b.aktif ? C.green : C.border}`, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{b.sistem}</div>
                <Badge d={b.aktif ? 'aktif' : 'pasif'} />
              </div>
              {b.aktif && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Son sync: {fmtDate(b.son)}</div>}
              <div style={{ marginTop: 12 }}>
                <button style={S.btn(b.aktif ? C.muted : C.accent)} onClick={() => { setSecilen({ ...b }); setModal(true); }}>{b.aktif ? '⚙️ Ayarlar' : '🔗 Bağlan'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'aktarim' && (
        <div>
          <div style={S.g3}>
            <div style={S.stat(C.accent)}><div style={S.statVal}>{fmtTL(topYakit)}</div><div style={S.statLbl}>Yakıt Gideri</div></div>
            <div style={S.stat(C.blue)}><div style={S.statVal}>{fmtTL(topBakim)}</div><div style={S.statLbl}>Bakım Gideri</div></div>
            <div style={S.stat(C.purple)}><div style={S.statVal}>{fmtTL(topYakit + topBakim)}</div><div style={S.statLbl}>Toplam Gider</div></div>
          </div>
          <div style={S.card}>
            <div style={S.secTitle}>📤 Muhasebe Aktarımı</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <button style={S.btn(C.accent)} onClick={() => aktar('Yakıt Gideri', topYakit)}>⛽ Yakıt Aktar ({fmtTL(topYakit)})</button>
              <button style={S.btn(C.blue)} onClick={() => aktar('Bakım Gideri', topBakim)}>🔧 Bakım Aktar ({fmtTL(topBakim)})</button>
            </div>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Tip</th><th style={S.th}>Tutar</th><th style={S.th}>Tarih</th><th style={S.th}>Hedef</th><th style={S.th}>Durum</th></tr></thead>
              <tbody>{aktarimlar.map(a => (
                <tr key={a.id}><td style={S.td}>{a.tip}</td><td style={S.td}><strong style={{ color: C.accent }}>{fmtTL(a.tutar)}</strong></td><td style={S.td}>{fmtDate(a.tarih)}</td><td style={S.td}>{a.hedef}</td><td style={S.td}><Badge d="tamamlandi" /></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'amortisman' && (
        <div style={S.card}>
          <table style={S.tbl}>
            <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Yıl</th><th style={S.th}>Yaş</th><th style={S.th}>Tahmini Değer</th></tr></thead>
            <tbody>{araclar.map(a => {
              const yas = new Date().getFullYear() - (a.yil || 2020);
              const deger = Math.max(0, (a.alisFiyat || 500000) - yas * 60000);
              return (<tr key={a.id}><td style={S.td}><strong style={{ color: C.white }}>{a.ad}</strong></td><td style={S.td}>{a.yil}</td><td style={S.td}>{yas} yıl</td><td style={S.td}><span style={{ color: C.accent }}>{fmtTL(deger)}</span></td></tr>);
            })}</tbody>
          </table>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
            <strong style={{ color: C.white }}>Toplam Filo Değeri</strong><strong style={{ color: C.accent }}>{fmtTL(topAmortisman)}</strong>
          </div>
        </div>
      )}

      {tab === 'maliyet' && (
        <div style={S.card}>
          <table style={S.tbl}>
            <thead><tr><th style={S.th}>Proje</th><th style={S.th}>Bütçe</th><th style={S.th}>Toplam Gider</th><th style={S.th}>Kullanım %</th></tr></thead>
            <tbody>{projeler.map(p => {
              const prjAraclar = araclar.filter(a => a.projeId === p.id).map(a => a.id);
              const yk = yakitlar.filter(y => prjAraclar.includes(y.aracId)).reduce((s, y) => s + (+y.toplam || 0), 0);
              const bk = bakimlar.filter(b => prjAraclar.includes(b.aracId) && b.durum === 'tamamlandi').reduce((s, b) => s + (+b.maliyet || 0), 0);
              const top = yk + bk;
              const oran = p.butce > 0 ? Math.min(100, Math.round((top / p.butce) * 100)) : 0;
              return (<tr key={p.id}><td style={S.td}><strong style={{ color: C.white }}>{p.ad}</strong></td><td style={S.td}>{fmtTL(+p.butce)}</td><td style={S.td}><strong style={{ color: C.accent }}>{fmtTL(top)}</strong></td><td style={S.td}><span style={{ color: oran > 85 ? C.red : oran > 60 ? C.yellow : C.green, fontWeight: 700 }}>%{oran}</span></td></tr>);
            })}</tbody>
          </table>
        </div>
      )}

      {modal && secilen && (
        <Modal title={`🔗 ${secilen.sistem} Bağlantısı`} onClose={() => setModal(false)}>
          <FG label="API Endpoint URL"><input style={S.inp} value={secilen.url || ''} onChange={e => setSecilen(s => ({ ...s, url: e.target.value }))} placeholder="https://api.logo.com/v1" /></FG>
          <FG label="API Anahtarı"><input style={S.inp} value={secilen.apiKey || ''} onChange={e => setSecilen(s => ({ ...s, apiKey: e.target.value }))} placeholder="••••••••••••••••" /></FG>
          <InfoBox color={C.blue}>ℹ️ Demo modda bağlantı simüle edilir. Gerçek entegrasyonda {secilen.sistem} API dokümantasyonuna göre ayarlanır.</InfoBox>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button style={S.btnO} onClick={() => setModal(false)}>İptal</button><button style={S.btn()} onClick={baglan}>Bağlan</button></div>
        </Modal>
      )}
    </div>
  );
}
