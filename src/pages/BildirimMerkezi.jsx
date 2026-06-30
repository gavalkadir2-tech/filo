import { useState } from 'react';
import { LS } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { daysLeft, fmtDate, today } from '../utils/formatters.js';
import { StatCard, Toggle } from '../components/UI.jsx';

export default function BildirimMerkezi() {
  const araclar = LS.get('araclar'), bakimlar = LS.get('bakimlar'), operatorler = LS.get('operatorler'), parcalar = LS.get('parcalar');
  const [tercihler, setTercihler] = useState(LS.get('bildirimTercih'));
  const [tab, setTab] = useState('tum');

  const toggle = (id) => { const n = tercihler.map(t => t.id === id ? { ...t, aktif: !t.aktif } : t); LS.set('bildirimTercih', n); setTercihler(n); };

  const bildirimler = [];
  araclar.forEach(a => {
    const sg = daysLeft(a.sigorta), mu = daysLeft(a.muayene);
    if (sg <= 30) bildirimler.push({ id: `sg-${a.id}`, tur: 'belge', oncelik: sg <= 7 ? 'kritik' : 'uyari', baslik: 'Sigorta Süresi Doluyor', aciklama: `${a.ad} — ${sg} gün kaldı`, tarih: a.sigorta, kanal: 'email' });
    if (mu <= 30) bildirimler.push({ id: `mu-${a.id}`, tur: 'belge', oncelik: mu <= 7 ? 'kritik' : 'uyari', baslik: 'Muayene Süresi Doluyor', aciklama: `${a.ad} — ${mu} gün kaldı`, tarih: a.muayene, kanal: 'sms' });
  });
  bakimlar.filter(b => b.durum === 'bekliyor').forEach(b => {
    const a = araclar.find(x => x.id === b.aracId);
    bildirimler.push({ id: `bk-${b.id}`, tur: 'bakim', oncelik: 'uyari', baslik: 'Bekleyen Bakım', aciklama: `${a?.ad} — ${b.tip}`, tarih: b.tarih, kanal: 'email' });
  });
  operatorler.forEach(o => {
    if (daysLeft(o.belge) <= 60) bildirimler.push({ id: `op-${o.id}`, tur: 'belge', oncelik: 'bilgi', baslik: 'Operatör Belgesi Yaklaşıyor', aciklama: `${o.ad} — ${daysLeft(o.belge)} gün kaldı`, tarih: o.belge, kanal: 'sistem' });
  });
  parcalar.filter(p => p.miktar <= p.minMiktar).forEach(p => {
    bildirimler.push({ id: `pk-${p.id}`, tur: 'stok', oncelik: 'kritik', baslik: 'Kritik Stok', aciklama: `${p.ad} — ${p.miktar} ${p.birim} (min: ${p.minMiktar})`, tarih: today(), kanal: 'sistem' });
  });

  const filtreli = tab === 'tum' ? bildirimler : bildirimler.filter(b => b.tur === tab);
  const oncelikRenk = { kritik: C.red, uyari: C.yellow, bilgi: C.blue };
  const oncelikIcon = { kritik: '🔴', uyari: '🟡', bilgi: '🔵' };
  const turAdi = { bakim: 'Bakım', belge: 'Belge', stok: 'Stok' };
  const kanalIcon = { email: '📧', sms: '📱', sistem: '🔔' };

  return (
    <div>
      <div style={S.g4}>
        <StatCard color={C.red} value={bildirimler.filter(b => b.oncelik === 'kritik').length} label="Kritik" />
        <StatCard color={C.yellow} value={bildirimler.filter(b => b.oncelik === 'uyari').length} label="Uyarı" />
        <StatCard color={C.blue} value={bildirimler.filter(b => b.oncelik === 'bilgi').length} label="Bilgi" />
        <StatCard color={C.green} value={tercihler.filter(t => t.aktif).length} label="Aktif Kanal" />
      </div>

      <div style={S.g2}>
        <div style={{ ...S.card, flex: 2 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['tum', 'Tümü'], ['bakim', 'Bakım'], ['belge', 'Belge'], ['stok', 'Stok']].map(([k, l]) => (
              <button key={k} style={{ ...S.btn(tab === k ? C.accent : 'transparent'), border: `1px solid ${tab === k ? C.accent : C.border}`, color: tab === k ? '#000' : C.muted, fontSize: 12 }} onClick={() => setTab(k)}>{l} ({k === 'tum' ? bildirimler.length : bildirimler.filter(b => b.tur === k).length})</button>
            ))}
          </div>
          {filtreli.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Bu kategoride bildirim yok.</div> : filtreli.map(b => (
            <div key={b.id} style={{ ...S.alert(oncelikRenk[b.oncelik] || C.muted), marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{oncelikIcon[b.oncelik]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{b.baslik}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{b.aciklama}</div>
              </div>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{kanalIcon[b.kanal]} {fmtDate(b.tarih)}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.secTitle}>⚙️ Bildirim Tercihleri</div>
          {tercihler.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}22` }}>
              <div>
                <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{turAdi[t.tur]}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{kanalIcon[t.kanal]} {t.kanal.toUpperCase()}{t.onceGun > 0 ? ` · ${t.onceGun} gün önce` : ''}</div>
              </div>
              <Toggle value={t.aktif} onChange={() => toggle(t.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
