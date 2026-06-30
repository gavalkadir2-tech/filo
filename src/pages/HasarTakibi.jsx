import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL, today } from '../utils/formatters.js';
import { Badge, FG, Modal, StatCard } from '../components/UI.jsx';

export default function HasarTakibi() {
  const araclar = LS.get('araclar');
  const [hasarlar, setHasarlar] = useState(LS.get('hasarlar'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? hasarlar.map(h => h.id === form.id ? form : h) : [...hasarlar, { ...form, id: uid(), durum: form.durum || 'acik' }];
    LS.set('hasarlar', n); setHasarlar(n); setModal(false);
  };
  const del = (id) => { const n = hasarlar.filter(h => h.id !== id); LS.set('hasarlar', n); setHasarlar(n); };

  const acikMaliyet = hasarlar.filter(h => h.durum === 'acik').reduce((s, h) => s + (+h.maliyet || 0), 0);
  const topTazminat = hasarlar.reduce((s, h) => s + (+h.tazminat || 0), 0);

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.red} value={hasarlar.filter(h => h.durum === 'acik').length} label="Açık Dosya" />
        <StatCard color={C.accent} value={fmtTL(acikMaliyet)} label="Açık Dosya Maliyeti" />
        <StatCard color={C.green} value={fmtTL(topTazminat)} label="Tahsil Edilen Tazminat" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ tarih: today(), durum: 'acik' }); setModal(true); }}>＋ Hasar Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Tarih</th><th style={S.th}>Açıklama</th><th style={S.th}>Maliyet</th><th style={S.th}>Tazminat</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
          <tbody>{[...hasarlar].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(h => {
            const a = araclar.find(x => x.id === h.aracId);
            return (
              <tr key={h.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{a?.ad || '—'}</strong></td>
                <td style={S.td}>{fmtDate(h.tarih)}</td>
                <td style={S.td}><span style={{ fontSize: 12 }}>{h.aciklama}</span></td>
                <td style={S.td}>{fmtTL(h.maliyet)}</td>
                <td style={S.td}><span style={{ color: C.green }}>{fmtTL(h.tazminat)}</span></td>
                <td style={S.td}><Badge d={h.durum} /></td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button style={S.btnO} onClick={() => { setForm(h); setModal(true); }}>✏️</button>
                    <button style={S.btnR} onClick={() => del(h.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Hasar Düzenle' : 'Yeni Hasar'} onClose={() => setModal(false)}>
          <FG label="Araç">
            <select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}>
              <option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}
            </select>
          </FG>
          <div style={S.g2}>
            <FG label="Tarih"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
            <FG label="Sigorta Poliçe No"><input style={S.inp} value={form.sigortaNo || ''} onChange={e => setForm(f => ({ ...f, sigortaNo: e.target.value }))} /></FG>
          </div>
          <FG label="Açıklama"><textarea style={S.ta} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Maliyet (₺)"><input type="number" style={S.inp} value={form.maliyet || ''} onChange={e => setForm(f => ({ ...f, maliyet: +e.target.value }))} /></FG>
            <FG label="Tazminat (₺)"><input type="number" style={S.inp} value={form.tazminat || ''} onChange={e => setForm(f => ({ ...f, tazminat: +e.target.value }))} /></FG>
          </div>
          <FG label="Durum">
            <select style={S.sel} value={form.durum || 'acik'} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
              <option value="acik">Açık</option><option value="devamediyor">Devam Ediyor</option><option value="kapandi">Kapandı</option>
            </select>
          </FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
