import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtTL } from '../utils/formatters.js';
import { FG, Modal, StatCard, Warn } from '../components/UI.jsx';

export default function YedekParca() {
  const [parcalar, setParcalar] = useState(LS.get('parcalar'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? parcalar.map(p => p.id === form.id ? form : p) : [...parcalar, { ...form, id: uid() }];
    LS.set('parcalar', n); setParcalar(n); setModal(false);
  };
  const del = (id) => { const n = parcalar.filter(p => p.id !== id); LS.set('parcalar', n); setParcalar(n); };
  const stokGuncelle = (id, delta) => {
    const n = parcalar.map(p => p.id === id ? { ...p, miktar: Math.max(0, p.miktar + delta) } : p);
    LS.set('parcalar', n); setParcalar(n);
  };

  const kritikler = parcalar.filter(p => p.miktar <= p.minMiktar);
  const toplamDeger = parcalar.reduce((s, p) => s + p.miktar * p.fiyat, 0);

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.red} value={kritikler.length} label="Kritik Stok" />
        <StatCard color={C.blue} value={parcalar.length} label="Toplam Kalem" />
        <StatCard color={C.accent} value={fmtTL(toplamDeger)} label="Stok Değeri" />
      </div>

      {kritikler.length > 0 && <Warn msg={`${kritikler.length} kalem kritik stok seviyesinde: ${kritikler.map(k => k.ad).join(', ')}`} c={C.red} />}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({}); setModal(true); }}>＋ Parça Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Parça</th><th style={S.th}>Kod</th><th style={S.th}>Kategori</th><th style={S.th}>Stok</th><th style={S.th}>Min</th><th style={S.th}>Birim Fiyat</th><th style={S.th}></th></tr></thead>
          <tbody>{parcalar.map(p => (
            <tr key={p.id}>
              <td style={S.td}><strong style={{ color: C.white }}>{p.ad}</strong></td>
              <td style={S.td}><code style={{ fontSize: 11, color: C.muted }}>{p.kod}</code></td>
              <td style={S.td}>{p.kategori}</td>
              <td style={S.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button style={S.btnO} onClick={() => stokGuncelle(p.id, -1)}>−</button>
                  <span style={{ color: p.miktar <= p.minMiktar ? C.red : C.text, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{p.miktar}</span>
                  <button style={S.btnO} onClick={() => stokGuncelle(p.id, 1)}>＋</button>
                  <span style={{ fontSize: 11, color: C.muted }}>{p.birim}</span>
                </div>
              </td>
              <td style={S.td}>{p.minMiktar}</td>
              <td style={S.td}>{fmtTL(p.fiyat)}</td>
              <td style={S.td}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button style={S.btnO} onClick={() => { setForm(p); setModal(true); }}>✏️</button>
                  <button style={S.btnR} onClick={() => del(p.id)}>🗑</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Parça Düzenle' : 'Yeni Parça'} onClose={() => setModal(false)}>
          <div style={S.g2}>
            <FG label="Parça Adı"><input style={S.inp} value={form.ad || ''} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></FG>
            <FG label="Kod"><input style={S.inp} value={form.kod || ''} onChange={e => setForm(f => ({ ...f, kod: e.target.value }))} /></FG>
          </div>
          <FG label="Kategori"><input style={S.inp} value={form.kategori || ''} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} /></FG>
          <div style={S.g3}>
            <FG label="Miktar"><input type="number" style={S.inp} value={form.miktar ?? ''} onChange={e => setForm(f => ({ ...f, miktar: +e.target.value }))} /></FG>
            <FG label="Min. Miktar"><input type="number" style={S.inp} value={form.minMiktar ?? ''} onChange={e => setForm(f => ({ ...f, minMiktar: +e.target.value }))} /></FG>
            <FG label="Birim"><input style={S.inp} value={form.birim || ''} onChange={e => setForm(f => ({ ...f, birim: e.target.value }))} placeholder="Adet, Litre..." /></FG>
          </div>
          <FG label="Birim Fiyat (₺)"><input type="number" style={S.inp} value={form.fiyat ?? ''} onChange={e => setForm(f => ({ ...f, fiyat: +e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn()} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
