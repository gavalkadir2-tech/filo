import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, today } from '../utils/formatters.js';
import { FG, Modal } from '../components/UI.jsx';

export default function IsEmirleri() {
  const araclar = LS.get('araclar');
  const operatorler = LS.get('operatorler');
  const [isler, setIsler] = useState(LS.get('isemirleri'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? isler.map(i => i.id === form.id ? form : i) : [...isler, { ...form, id: uid(), durum: form.durum || 'acik' }];
    LS.set('isemirleri', n); setIsler(n); setModal(false);
  };
  const move = (id, durum) => { const n = isler.map(i => i.id === id ? { ...i, durum } : i); LS.set('isemirleri', n); setIsler(n); };
  const del = (id) => { const n = isler.filter(i => i.id !== id); LS.set('isemirleri', n); setIsler(n); };

  const kolonlar = [
    ['acik', '🆕 Açık', C.muted],
    ['devamediyor', '🔄 Devam Ediyor', C.yellow],
    ['tamamlandi', '✅ Tamamlandı', C.green],
  ];

  const oncRenk = { kritik: C.red, normal: C.blue, dusuk: C.muted };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ tarih: today(), oncelik: 'normal' }); setModal(true); }}>＋ İş Emri Oluştur</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {kolonlar.map(([durum, label, renk]) => (
          <div key={durum}>
            <div style={{ ...S.secTitle, color: renk, marginBottom: 12 }}>{label} ({isler.filter(i => i.durum === durum).length})</div>
            {isler.filter(i => i.durum === durum).map(i => {
              const a = araclar.find(x => x.id === i.aracId);
              const op = operatorler.find(x => x.id === i.opId);
              return (
                <div key={i.id} style={{ ...S.card, marginBottom: 10, borderLeft: `3px solid ${oncRenk[i.oncelik]}`, cursor: 'pointer' }} onClick={() => { setForm(i); setModal(true); }}>
                  <div style={{ fontWeight: 700, color: C.white, fontSize: 13 }}>{i.baslik}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{a?.ad || '—'}{op ? ` · ${op.ad}` : ''}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>📅 {fmtDate(i.bitis)}</div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                    {durum !== 'acik' && <button style={S.btnO} onClick={() => move(i.id, 'acik')}>← </button>}
                    {durum !== 'devamediyor' && <button style={S.btnO} onClick={() => move(i.id, 'devamediyor')}>🔄</button>}
                    {durum !== 'tamamlandi' && <button style={S.btn(C.green)} onClick={() => move(i.id, 'tamamlandi')}>✓</button>}
                    <button style={S.btnR} onClick={() => del(i.id)}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={form.id ? 'İş Emri Düzenle' : 'Yeni İş Emri'} onClose={() => setModal(false)}>
          <FG label="Başlık"><input style={S.inp} value={form.baslik || ''} onChange={e => setForm(f => ({ ...f, baslik: e.target.value }))} /></FG>
          <FG label="Açıklama"><textarea style={S.ta} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Araç">
              <select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}>
                <option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}
              </select>
            </FG>
            <FG label="Operatör">
              <select style={S.sel} value={form.opId || ''} onChange={e => setForm(f => ({ ...f, opId: +e.target.value || null }))}>
                <option value="">— Seçiniz —</option>{operatorler.map(o => <option key={o.id} value={o.id}>{o.ad}</option>)}
              </select>
            </FG>
          </div>
          <div style={S.g2}>
            <FG label="Bitiş Tarihi"><input type="date" style={S.inp} value={form.bitis || ''} onChange={e => setForm(f => ({ ...f, bitis: e.target.value }))} /></FG>
            <FG label="Öncelik">
              <select style={S.sel} value={form.oncelik || 'normal'} onChange={e => setForm(f => ({ ...f, oncelik: e.target.value }))}>
                <option value="kritik">🔴 Kritik</option><option value="normal">🔵 Normal</option><option value="dusuk">⚪ Düşük</option>
              </select>
            </FG>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
