import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { daysLeft, fmtDate, fmtTL } from '../utils/formatters.js';
import { Badge, FG, Modal } from '../components/UI.jsx';

export default function OperatorYonetimi() {
  const araclar = LS.get('araclar');
  const [operatorler, setOperatorler] = useState(LS.get('operatorler'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? operatorler.map(o => o.id === form.id ? form : o) : [...operatorler, { ...form, id: uid(), durum: 'aktif' }];
    LS.set('operatorler', n); setOperatorler(n); setModal(false);
  };
  const del = (id) => { const n = operatorler.filter(o => o.id !== id); LS.set('operatorler', n); setOperatorler(n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({}); setModal(true); }}>＋ Operatör Ekle</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {operatorler.map(o => {
          const araclarim = araclar.filter(a => a.opId === o.id);
          const belgeGun = daysLeft(o.belge);
          return (
            <div key={o.id} style={{ ...S.card, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{o.ad}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{o.tel}</div>
                </div>
                <Badge d={o.durum} />
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: C.text }}>
                <div>🪪 Ehliyet: {o.ehliyet}</div>
                <div style={{ marginTop: 4, color: belgeGun <= 30 ? C.red : C.text }}>
                  📄 Belge: {fmtDate(o.belge)} {belgeGun <= 30 && `(${belgeGun} gün)`}
                </div>
                <div style={{ marginTop: 4 }}>💰 Maaş: {fmtTL(o.maas)}</div>
                <div style={{ marginTop: 4 }}>🚜 Araçlar: {araclarim.length ? araclarim.map(a => a.ad).join(', ') : '—'}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <button style={S.btnO} onClick={() => { setForm(o); setModal(true); }}>✏️ Düzenle</button>
                <button style={S.btnR} onClick={() => del(o.id)}>🗑 Sil</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={form.id ? 'Operatör Düzenle' : 'Yeni Operatör'} onClose={() => setModal(false)}>
          {[['ad', 'Ad Soyad', 'text'], ['tel', 'Telefon', 'text'], ['ehliyet', 'Ehliyet Sınıfları', 'text']].map(([k, l, t]) => (
            <FG key={k} label={l}><input type={t} style={S.inp} value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></FG>
          ))}
          <div style={S.g2}>
            <FG label="Belge Bitiş Tarihi"><input type="date" style={S.inp} value={form.belge || ''} onChange={e => setForm(f => ({ ...f, belge: e.target.value }))} /></FG>
            <FG label="Maaş (₺)"><input type="number" style={S.inp} value={form.maas || ''} onChange={e => setForm(f => ({ ...f, maas: +e.target.value }))} /></FG>
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
