import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL, today } from '../utils/formatters.js';
import { FG, Modal, StatCard } from '../components/UI.jsx';

export default function YakitYonetimi() {
  const araclar = LS.get('araclar');
  const [yakitlar, setYakitlar] = useState(LS.get('yakitlar'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const toplam = (+form.miktar || 0) * (+form.fiyat || 0);
    const n = form.id
      ? yakitlar.map(y => y.id === form.id ? { ...form, toplam } : y)
      : [...yakitlar, { ...form, id: uid(), toplam, tarih: form.tarih || today() }];
    LS.set('yakitlar', n); setYakitlar(n); setModal(false);
  };
  const del = (id) => { const n = yakitlar.filter(y => y.id !== id); LS.set('yakitlar', n); setYakitlar(n); };

  const buAyToplam = yakitlar.filter(y => y.tarih?.startsWith(today().slice(0, 7))).reduce((s, y) => s + (+y.toplam || 0), 0);
  const buAyLitre = yakitlar.filter(y => y.tarih?.startsWith(today().slice(0, 7))).reduce((s, y) => s + (+y.miktar || 0), 0);
  const ortFiyat = buAyLitre > 0 ? buAyToplam / buAyLitre : 0;

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.accent} value={fmtTL(buAyToplam)} label="Bu Ay Toplam Gider" />
        <StatCard color={C.blue} value={buAyLitre.toLocaleString('tr-TR') + ' Lt'} label="Bu Ay Toplam Litre" />
        <StatCard color={C.green} value={fmtTL(ortFiyat)} label="Ortalama Litre Fiyatı" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ tarih: today() }); setModal(true); }}>＋ İkmal Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Tarih</th><th style={S.th}>Miktar</th><th style={S.th}>Birim Fiyat</th><th style={S.th}>Toplam</th><th style={S.th}>Depo</th><th style={S.th}></th></tr></thead>
          <tbody>{[...yakitlar].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(y => {
            const a = araclar.find(x => x.id === y.aracId);
            return (
              <tr key={y.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{a?.ad || '—'}</strong></td>
                <td style={S.td}>{fmtDate(y.tarih)}</td>
                <td style={S.td}>{y.miktar} Lt</td>
                <td style={S.td}>{fmtTL(y.fiyat)}</td>
                <td style={S.td}><strong style={{ color: C.accent }}>{fmtTL(y.toplam)}</strong></td>
                <td style={S.td}>{y.depo}</td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button style={S.btnO} onClick={() => { setForm(y); setModal(true); }}>✏️</button>
                    <button style={S.btnR} onClick={() => del(y.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'İkmal Düzenle' : 'Yeni İkmal'} onClose={() => setModal(false)}>
          <FG label="Araç">
            <select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}>
              <option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}
            </select>
          </FG>
          <div style={S.g2}>
            <FG label="Tarih"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
            <FG label="Depo / Pompa"><input style={S.inp} value={form.depo || ''} onChange={e => setForm(f => ({ ...f, depo: e.target.value }))} /></FG>
          </div>
          <div style={S.g2}>
            <FG label="Miktar (Lt)"><input type="number" style={S.inp} value={form.miktar || ''} onChange={e => setForm(f => ({ ...f, miktar: +e.target.value }))} /></FG>
            <FG label="Litre Fiyatı (₺)"><input type="number" step="0.01" style={S.inp} value={form.fiyat || ''} onChange={e => setForm(f => ({ ...f, fiyat: +e.target.value }))} /></FG>
          </div>
          {form.miktar && form.fiyat && <div style={S.alert(C.green)}>Toplam: <strong>{fmtTL(form.miktar * form.fiyat)}</strong></div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
