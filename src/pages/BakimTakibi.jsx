import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL, today } from '../utils/formatters.js';
import { Badge, FG, Modal, StatCard } from '../components/UI.jsx';

export default function BakimTakibi() {
  const araclar = LS.get('araclar');
  const [bakimlar, setBakimlar] = useState(LS.get('bakimlar'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? bakimlar.map(b => b.id === form.id ? form : b) : [...bakimlar, { ...form, id: uid(), durum: form.durum || 'planli' }];
    LS.set('bakimlar', n); setBakimlar(n); setModal(false);
  };
  const tamamla = (id) => { const n = bakimlar.map(b => b.id === id ? { ...b, durum: 'tamamlandi' } : b); LS.set('bakimlar', n); setBakimlar(n); };
  const del = (id) => { const n = bakimlar.filter(b => b.id !== id); LS.set('bakimlar', n); setBakimlar(n); };

  const bekleyen = bakimlar.filter(b => b.durum === 'bekliyor').length;
  const planli = bakimlar.filter(b => b.durum === 'planli').length;
  const tamamlananMaliyet = bakimlar.filter(b => b.durum === 'tamamlandi').reduce((s, b) => s + (+b.maliyet || 0), 0);

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.red} value={bekleyen} label="Bekleyen Bakım" />
        <StatCard color={C.blue} value={planli} label="Planlı Bakım" />
        <StatCard color={C.accent} value={fmtTL(tamamlananMaliyet)} label="Toplam Bakım Gideri" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ tarih: today(), durum: 'planli' }); setModal(true); }}>＋ Bakım Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Bakım Tipi</th><th style={S.th}>Tarih</th><th style={S.th}>Maliyet</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
          <tbody>{[...bakimlar].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(b => {
            const a = araclar.find(x => x.id === b.aracId);
            return (
              <tr key={b.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{a?.ad || '—'}</strong></td>
                <td style={S.td}>{b.tip}</td>
                <td style={S.td}>{fmtDate(b.tarih)}</td>
                <td style={S.td}>{fmtTL(b.maliyet)}</td>
                <td style={S.td}><Badge d={b.durum} /></td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {b.durum !== 'tamamlandi' && <button style={S.btn(C.green)} onClick={() => tamamla(b.id)}>✓</button>}
                    <button style={S.btnO} onClick={() => { setForm(b); setModal(true); }}>✏️</button>
                    <button style={S.btnR} onClick={() => del(b.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Bakım Düzenle' : 'Yeni Bakım'} onClose={() => setModal(false)}>
          <FG label="Araç">
            <select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}>
              <option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}
            </select>
          </FG>
          <FG label="Bakım Tipi"><input style={S.inp} value={form.tip || ''} onChange={e => setForm(f => ({ ...f, tip: e.target.value }))} placeholder="Yağ değişimi, filtre..." /></FG>
          <div style={S.g2}>
            <FG label="Tarih"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
            <FG label="Maliyet (₺)"><input type="number" style={S.inp} value={form.maliyet || ''} onChange={e => setForm(f => ({ ...f, maliyet: +e.target.value }))} /></FG>
          </div>
          <FG label="Durum">
            <select style={S.sel} value={form.durum || 'planli'} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
              <option value="planli">Planlı</option><option value="bekliyor">Bekliyor</option><option value="tamamlandi">Tamamlandı</option>
            </select>
          </FG>
          <FG label="Notlar"><textarea style={S.ta} value={form.notlar || ''} onChange={e => setForm(f => ({ ...f, notlar: e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
