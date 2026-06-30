import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, today } from '../utils/formatters.js';
import { Badge, FG, Modal, StatCard, TabBar } from '../components/UI.jsx';

export default function MobilSaha() {
  const araclar = LS.get('araclar'), ops = LS.get('operatorler');
  const [tab, setTab] = useState('gunluk');
  const [calismalar, setCalismalar] = useState(LS.get('sahaCalisma'));
  const [arizalar, setArizalar] = useState(LS.get('sahaAriza'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const saveCalisma = () => {
    const saat = form.baslangic && form.bitis ? Math.max(0, (new Date(`2000-01-01T${form.bitis}`) - new Date(`2000-01-01T${form.baslangic}`)) / 3600000).toFixed(1) : 0;
    const n = [...calismalar, { ...form, id: uid(), tarih: today(), saat: +saat, onaylı: false }];
    LS.set('sahaCalisma', n); setCalismalar(n); setModal(false);
  };

  const saveAriza = () => {
    const n = [...arizalar, { ...form, id: uid(), tarih: today(), durum: 'acik' }];
    LS.set('sahaAriza', n); setArizalar(n); setModal(false);
  };

  const onayla = (id) => { const n = calismalar.map(x => x.id === id ? { ...x, onaylı: true } : x); LS.set('sahaCalisma', n); setCalismalar(n); };

  return (
    <div>
      <TabBar tabs={[['gunluk', '⏱ Çalışma Saati'], ['ariza', '🔴 Arıza Bil.'], ['qr', '📷 QR Tarama']]} active={tab} onChange={setTab} />

      {tab === 'gunluk' && (
        <div>
          <div style={S.g3}>
            <StatCard color={C.blue} value={calismalar.filter(c => c.tarih === today()).length} label="Bugün Kayıt" />
            <StatCard color={C.green} value={calismalar.filter(c => c.onaylı).length} label="Onaylanan" />
            <StatCard color={C.yellow} value={calismalar.filter(c => !c.onaylı).length} label="Bekleyen" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button style={S.btn()} onClick={() => { setForm({}); setModal('calisma'); }}>＋ Çalışma Saati Gir</button>
          </div>
          <div style={S.card}>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Operatör</th><th style={S.th}>Tarih</th><th style={S.th}>Saat</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
              <tbody>{[...calismalar].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(c => {
                const a = araclar.find(x => x.id === c.aracId), op = ops.find(x => x.id === c.opId);
                return (
                  <tr key={c.id}>
                    <td style={S.td}><strong style={{ color: C.white }}>{a?.ad || '—'}</strong></td>
                    <td style={S.td}>{op?.ad || '—'}</td>
                    <td style={S.td}>{fmtDate(c.tarih)}</td>
                    <td style={S.td}><strong style={{ color: C.accent }}>{c.saat} saat</strong></td>
                    <td style={S.td}><Badge d={c.onaylı ? 'tamamlandi' : 'bekliyor'} /></td>
                    <td style={S.td}>{!c.onaylı && <button style={S.btn(C.green)} onClick={() => onayla(c.id)}>✓</button>}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'ariza' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button style={S.btn(C.red)} onClick={() => { setForm({ oncelik: 'normal' }); setModal('ariza'); }}>🔴 Arıza Bildir</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
            {arizalar.map(ar => {
              const a = araclar.find(x => x.id === ar.aracId);
              const renk = ar.oncelik === 'kritik' ? C.red : ar.oncelik === 'normal' ? C.yellow : C.muted;
              return (
                <div key={ar.id} style={{ ...S.card, borderLeft: `4px solid ${renk}`, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: C.white }}>{a?.ad || '—'}</div>
                    <Badge d={ar.durum} />
                  </div>
                  <div style={{ fontSize: 13, color: C.text, marginTop: 8 }}>{ar.aciklama}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>📅 {fmtDate(ar.tarih)} · 🎯 {ar.oncelik}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'qr' && (
        <div style={S.card}>
          <div style={S.secTitle}>📷 QR ile Makine Tanıma</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Gerçek uygulamada kamera ile QR kod okutularak makine anında tanınır. Demo modunda araç seçimi ile simüle edilir.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
            {araclar.map(a => (
              <div key={a.id} style={{ ...S.card, marginBottom: 0, textAlign: 'center', cursor: 'pointer', border: `1px solid ${C.accent}44` }} onClick={() => alert(`QR: ${a.plaka} — ${a.ad}\nDurum: ${a.durum}\nSaat: ${a.saat}`)}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ color: C.white, fontWeight: 700 }}>{a.ad}</div>
                <code style={{ color: C.accent, fontSize: 12 }}>{a.plaka}</code>
                <div style={{ marginTop: 8 }}><Badge d={a.durum} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal === 'calisma' && (
        <Modal title="⏱ Çalışma Saati Girişi" onClose={() => setModal(false)}>
          <FG label="Araç"><select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}><option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}</select></FG>
          <FG label="Operatör"><select style={S.sel} value={form.opId || ''} onChange={e => setForm(f => ({ ...f, opId: +e.target.value || null }))}><option value="">— Seçiniz —</option>{ops.map(o => <option key={o.id} value={o.id}>{o.ad}</option>)}</select></FG>
          <div style={S.g2}>
            <FG label="Başlangıç"><input type="time" style={S.inp} value={form.baslangic || ''} onChange={e => setForm(f => ({ ...f, baslangic: e.target.value }))} /></FG>
            <FG label="Bitiş"><input type="time" style={S.inp} value={form.bitis || ''} onChange={e => setForm(f => ({ ...f, bitis: e.target.value }))} /></FG>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}><button style={S.btnO} onClick={() => setModal(false)}>İptal</button><button style={S.btn()} onClick={saveCalisma}>Kaydet</button></div>
        </Modal>
      )}

      {modal === 'ariza' && (
        <Modal title="🔴 Arıza Bildirimi" onClose={() => setModal(false)}>
          <FG label="Araç"><select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}><option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}</select></FG>
          <FG label="Açıklama"><textarea style={S.ta} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <FG label="Öncelik"><select style={S.sel} value={form.oncelik || 'normal'} onChange={e => setForm(f => ({ ...f, oncelik: e.target.value }))}><option value="kritik">🔴 Kritik</option><option value="normal">🟡 Normal</option><option value="dusuk">🟢 Düşük</option></select></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}><button style={S.btnO} onClick={() => setModal(false)}>İptal</button><button style={S.btn(C.red)} onClick={saveAriza}>Bildir</button></div>
        </Modal>
      )}
    </div>
  );
}
