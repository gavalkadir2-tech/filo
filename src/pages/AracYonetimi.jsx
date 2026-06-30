import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL } from '../utils/formatters.js';
import { Badge, FG, Modal } from '../components/UI.jsx';

export default function AracYonetimi() {
  const [araclar, setAraclar] = useState(LS.get('araclar'));
  const operatorler = LS.get('operatorler');
  const projeler = LS.get('projeler');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? araclar.map(a => a.id === form.id ? form : a) : [...araclar, { ...form, id: uid(), durum: form.durum || 'aktif' }];
    LS.set('araclar', n); setAraclar(n); setModal(false);
  };
  const del = (id) => { const n = araclar.filter(a => a.id !== id); LS.set('araclar', n); setAraclar(n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ durum: 'aktif' }); setModal(true); }}>＋ Araç Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Plaka</th><th style={S.th}>Tip</th><th style={S.th}>Yıl</th><th style={S.th}>Saat</th><th style={S.th}>Operatör</th><th style={S.th}>Proje</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
          <tbody>{araclar.map(a => {
            const op = operatorler.find(o => o.id === a.opId);
            const pr = projeler.find(p => p.id === a.projeId);
            return (
              <tr key={a.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{a.ad}</strong></td>
                <td style={S.td}><code style={{ color: C.accent, fontSize: 12 }}>{a.plaka}</code></td>
                <td style={S.td}>{a.tip}</td>
                <td style={S.td}>{a.yil}</td>
                <td style={S.td}>{a.saat?.toLocaleString('tr-TR')} sa</td>
                <td style={S.td}>{op?.ad || '—'}</td>
                <td style={S.td}>{pr?.ad || '—'}</td>
                <td style={S.td}><Badge d={a.durum} /></td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button style={S.btnO} onClick={() => { setForm(a); setModal(true); }}>✏️</button>
                    <button style={S.btnR} onClick={() => del(a.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Araç Düzenle' : 'Yeni Araç'} onClose={() => setModal(false)}>
          {[['ad', 'Araç Adı', 'text'], ['plaka', 'Plaka', 'text']].map(([k, l, t]) => (
            <FG key={k} label={l}><input type={t} style={S.inp} value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></FG>
          ))}
          <div style={S.g2}>
            <FG label="Tip"><input style={S.inp} value={form.tip || ''} onChange={e => setForm(f => ({ ...f, tip: e.target.value }))} placeholder="Ekskavatör, Yükleyici..." /></FG>
            <FG label="Yıl"><input type="number" style={S.inp} value={form.yil || ''} onChange={e => setForm(f => ({ ...f, yil: +e.target.value }))} /></FG>
          </div>
          <div style={S.g2}>
            <FG label="Çalışma Saati"><input type="number" style={S.inp} value={form.saat || ''} onChange={e => setForm(f => ({ ...f, saat: +e.target.value }))} /></FG>
            <FG label="Durum">
              <select style={S.sel} value={form.durum || 'aktif'} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
                <option value="aktif">Aktif</option><option value="bakimda">Bakımda</option><option value="hurda">Hurda</option>
              </select>
            </FG>
          </div>
          <div style={S.g2}>
            <FG label="Operatör">
              <select style={S.sel} value={form.opId || ''} onChange={e => setForm(f => ({ ...f, opId: +e.target.value || null }))}>
                <option value="">— Seçiniz —</option>{operatorler.map(o => <option key={o.id} value={o.id}>{o.ad}</option>)}
              </select>
            </FG>
            <FG label="Proje">
              <select style={S.sel} value={form.projeId || ''} onChange={e => setForm(f => ({ ...f, projeId: +e.target.value || null }))}>
                <option value="">— Seçiniz —</option>{projeler.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
              </select>
            </FG>
          </div>
          <div style={S.g2}>
            <FG label="Sigorta Bitiş"><input type="date" style={S.inp} value={form.sigorta || ''} onChange={e => setForm(f => ({ ...f, sigorta: e.target.value }))} /></FG>
            <FG label="Muayene Bitiş"><input type="date" style={S.inp} value={form.muayene || ''} onChange={e => setForm(f => ({ ...f, muayene: e.target.value }))} /></FG>
          </div>
          <FG label="Alış Fiyatı (₺)"><input type="number" style={S.inp} value={form.alisFiyat || ''} onChange={e => setForm(f => ({ ...f, alisFiyat: +e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
