import { useState } from 'react';
import { LS, uid } from '../../utils/storage.js';
import { C, S } from '../../styles.js';
import { fmtDate, fmtTL, today, thisMonth, fmtMonth } from '../../utils/formatters.js';
import { Badge, FG, Modal, StatCard } from '../../components/UI.jsx';

const GELIR_KAT = ['Hizmet Bedeli', 'Kira Geliri', 'Satış Geliri', 'Diğer Gelir'];
const GIDER_KAT = ['Yakıt', 'Personel', 'Bakım-Onarım', 'Sigorta', 'Kira', 'Vergi/SGK', 'Ofis Gideri', 'Yedek Parça', 'Diğer Gider'];

export default function GelirGider() {
  const projeler = LS.get('projeler');
  const hesaplar = LS.get('hesaplar');
  const [kayitlar, setKayitlar] = useState(LS.get('gelirGider'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [ayFiltre, setAyFiltre] = useState(thisMonth());
  const [turFiltre, setTurFiltre] = useState('tum');

  const save = () => {
    const n = form.id ? kayitlar.map(k => k.id === form.id ? form : k) : [...kayitlar, { ...form, id: uid(), tarih: form.tarih || today(), belgeNo: form.belgeNo || `${form.tur === 'gelir' ? 'GEL' : 'GID'}-${uid().slice(0, 6)}` }];
    LS.set('gelirGider', n); setKayitlar(n); setModal(false);
  };
  const del = (id) => { const n = kayitlar.filter(k => k.id !== id); LS.set('gelirGider', n); setKayitlar(n); };

  const filtreli = kayitlar.filter(k => (ayFiltre === 'tum' || k.tarih?.startsWith(ayFiltre)) && (turFiltre === 'tum' || k.tur === turFiltre));
  const gelir = filtreli.filter(k => k.tur === 'gelir').reduce((s, k) => s + (+k.tutar || 0), 0);
  const gider = filtreli.filter(k => k.tur === 'gider').reduce((s, k) => s + (+k.tutar || 0), 0);
  const kdvAlinan = filtreli.filter(k => k.tur === 'gelir').reduce((s, k) => s + (+k.kdv || 0), 0);
  const kdvOdenen = filtreli.filter(k => k.tur === 'gider').reduce((s, k) => s + (+k.kdv || 0), 0);

  // Kategori bazlı gider dağılımı
  const giderKategori = {};
  filtreli.filter(k => k.tur === 'gider').forEach(k => { giderKategori[k.kategori] = (giderKategori[k.kategori] || 0) + (+k.tutar || 0); });

  return (
    <div>
      <div style={S.g4}>
        <StatCard color={C.green} value={fmtTL(gelir)} label="Toplam Gelir" />
        <StatCard color={C.red} value={fmtTL(gider)} label="Toplam Gider" />
        <StatCard color={gelir - gider >= 0 ? C.green : C.red} value={fmtTL(gelir - gider)} label="Net Kar/Zarar" />
        <StatCard color={C.purple} value={fmtTL(kdvAlinan - kdvOdenen)} label="Net KDV (Ödenecek)" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select style={{ ...S.sel, width: 180 }} value={ayFiltre} onChange={e => setAyFiltre(e.target.value)}>
          <option value="tum">Tüm Zamanlar</option>
          {[...new Set(kayitlar.map(k => k.tarih?.slice(0, 7)))].sort().reverse().map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}
        </select>
        <select style={{ ...S.sel, width: 140 }} value={turFiltre} onChange={e => setTurFiltre(e.target.value)}>
          <option value="tum">Tüm Kayıtlar</option><option value="gelir">Sadece Gelir</option><option value="gider">Sadece Gider</option>
        </select>
        <div style={{ flex: 1 }} />
        <button style={S.btn(C.green)} onClick={() => { setForm({ tur: 'gelir', tarih: today(), kategori: GELIR_KAT[0] }); setModal(true); }}>＋ Gelir Ekle</button>
        <button style={S.btn(C.red)} onClick={() => { setForm({ tur: 'gider', tarih: today(), kategori: GIDER_KAT[0] }); setModal(true); }}>＋ Gider Ekle</button>
      </div>

      {Object.keys(giderKategori).length > 0 && (
        <div style={S.card}>
          <div style={S.secTitle}>📊 Gider Dağılımı</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(giderKategori).sort((a, b) => b[1] - a[1]).map(([kat, tutar]) => (
              <div key={kat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 130, fontSize: 12, color: C.text }}>{kat}</div>
                <div style={{ flex: 1, background: '#0f1117', borderRadius: 4, height: 18, overflow: 'hidden' }}>
                  <div style={{ width: `${gider > 0 ? (tutar / gider) * 100 : 0}%`, height: '100%', background: C.red }} />
                </div>
                <div style={{ width: 100, fontSize: 12, color: C.muted, textAlign: 'right' }}>{fmtTL(tutar)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={S.card}>
        <div style={S.secTitle}>📒 Hareket Dökümü ({filtreli.length} kayıt)</div>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Belge No</th><th style={S.th}>Tarih</th><th style={S.th}>Tür</th><th style={S.th}>Kategori</th><th style={S.th}>Açıklama</th><th style={S.th}>Tutar</th><th style={S.th}>KDV</th><th style={S.th}></th></tr></thead>
          <tbody>{[...filtreli].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(k => (
            <tr key={k.id}>
              <td style={S.td}><code style={{ fontSize: 11, color: C.muted }}>{k.belgeNo}</code></td>
              <td style={S.td}>{fmtDate(k.tarih)}</td>
              <td style={S.td}><Badge d={k.tur} /></td>
              <td style={S.td}>{k.kategori}</td>
              <td style={S.td}><span style={{ fontSize: 12 }}>{k.aciklama}</span></td>
              <td style={S.td}><strong style={{ color: k.tur === 'gelir' ? C.green : C.red }}>{k.tur === 'gelir' ? '+' : '−'}{fmtTL(k.tutar)}</strong></td>
              <td style={S.td}><span style={{ fontSize: 12, color: C.muted }}>{fmtTL(k.kdv)}</span></td>
              <td style={S.td}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button style={S.btnO} onClick={() => { setForm(k); setModal(true); }}>✏️</button>
                  <button style={S.btnR} onClick={() => del(k.id)}>🗑</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Kayıt Düzenle' : (form.tur === 'gelir' ? 'Yeni Gelir' : 'Yeni Gider')} onClose={() => setModal(false)}>
          <div style={S.g2}>
            <FG label="Tür">
              <select style={S.sel} value={form.tur || 'gelir'} onChange={e => setForm(f => ({ ...f, tur: e.target.value, kategori: e.target.value === 'gelir' ? GELIR_KAT[0] : GIDER_KAT[0] }))}>
                <option value="gelir">Gelir</option><option value="gider">Gider</option>
              </select>
            </FG>
            <FG label="Kategori">
              <select style={S.sel} value={form.kategori || ''} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                {(form.tur === 'gider' ? GIDER_KAT : GELIR_KAT).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </FG>
          </div>
          <FG label="Açıklama"><input style={S.inp} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Tutar (₺, KDV hariç)"><input type="number" style={S.inp} value={form.tutar || ''} onChange={e => setForm(f => ({ ...f, tutar: +e.target.value }))} /></FG>
            <FG label="KDV (₺)"><input type="number" style={S.inp} value={form.kdv || ''} onChange={e => setForm(f => ({ ...f, kdv: +e.target.value }))} /></FG>
          </div>
          <div style={S.g2}>
            <FG label="Tarih"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
            <FG label="İlgili Proje (opsiyonel)">
              <select style={S.sel} value={form.projeId || ''} onChange={e => setForm(f => ({ ...f, projeId: +e.target.value || null }))}>
                <option value="">— Yok —</option>{projeler.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
              </select>
            </FG>
          </div>
          <FG label="Hesap">
            <select style={S.sel} value={form.hesapId || ''} onChange={e => setForm(f => ({ ...f, hesapId: +e.target.value }))}>
              <option value="">— Seçiniz —</option>{hesaplar.map(h => <option key={h.id} value={h.id}>{h.kod} — {h.ad}</option>)}
            </select>
          </FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn(form.tur === 'gider' ? C.red : C.green)} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
