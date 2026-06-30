import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, fmtTL } from '../utils/formatters.js';
import { Badge, FG, Modal, ProgressBar } from '../components/UI.jsx';

export default function ProjeYonetimi() {
  const araclar = LS.get('araclar');
  const yakitlar = LS.get('yakitlar');
  const bakimlar = LS.get('bakimlar');
  const gelirGider = LS.get('gelirGider');
  const [projeler, setProjeler] = useState(LS.get('projeler'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    const n = form.id ? projeler.map(p => p.id === form.id ? form : p) : [...projeler, { ...form, id: uid(), durum: form.durum || 'aktif' }];
    LS.set('projeler', n); setProjeler(n); setModal(false);
  };
  const del = (id) => { const n = projeler.filter(p => p.id !== id); LS.set('projeler', n); setProjeler(n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ durum: 'aktif' }); setModal(true); }}>＋ Proje Ekle</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
        {projeler.map(p => {
          const prjAraclar = araclar.filter(a => a.projeId === p.id).map(a => a.id);
          const yk = yakitlar.filter(y => prjAraclar.includes(y.aracId)).reduce((s, y) => s + (+y.toplam || 0), 0);
          const bk = bakimlar.filter(b => prjAraclar.includes(b.aracId) && b.durum === 'tamamlandi').reduce((s, b) => s + (+b.maliyet || 0), 0);
          const gelir = gelirGider.filter(g => g.tur === 'gelir' && g.projeId === p.id).reduce((s, g) => s + (+g.tutar || 0), 0);
          const gider = gelirGider.filter(g => g.tur === 'gider' && g.projeId === p.id).reduce((s, g) => s + (+g.tutar || 0), 0) + yk + bk;
          const toplamGider = yk + bk;

          return (
            <div key={p.id} style={{ ...S.card, marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{p.ad}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{p.musteri}</div>
                </div>
                <Badge d={p.durum} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>📅 {fmtDate(p.baslangic)} → {fmtDate(p.bitis)}</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.muted }}>Bütçe Kullanımı</span>
                  <span style={{ color: C.text }}>{fmtTL(toplamGider)} / {fmtTL(p.butce)}</span>
                </div>
                <ProgressBar value={toplamGider} max={p.butce} />
              </div>
              {gelir > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: gelir - gider >= 0 ? C.green : C.red }}>
                  Net: {fmtTL(gelir - gider)}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <button style={S.btnO} onClick={() => { setForm(p); setModal(true); }}>✏️ Düzenle</button>
                <button style={S.btnR} onClick={() => del(p.id)}>🗑 Sil</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={form.id ? 'Proje Düzenle' : 'Yeni Proje'} onClose={() => setModal(false)}>
          <FG label="Proje Adı"><input style={S.inp} value={form.ad || ''} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></FG>
          <FG label="Müşteri"><input style={S.inp} value={form.musteri || ''} onChange={e => setForm(f => ({ ...f, musteri: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Başlangıç"><input type="date" style={S.inp} value={form.baslangic || ''} onChange={e => setForm(f => ({ ...f, baslangic: e.target.value }))} /></FG>
            <FG label="Bitiş"><input type="date" style={S.inp} value={form.bitis || ''} onChange={e => setForm(f => ({ ...f, bitis: e.target.value }))} /></FG>
          </div>
          <div style={S.g2}>
            <FG label="Bütçe (₺)"><input type="number" style={S.inp} value={form.butce || ''} onChange={e => setForm(f => ({ ...f, butce: +e.target.value }))} /></FG>
            <FG label="Durum">
              <select style={S.sel} value={form.durum || 'aktif'} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
                <option value="aktif">Aktif</option><option value="tamamlandi">Tamamlandı</option><option value="bekliyor">Bekliyor</option>
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
