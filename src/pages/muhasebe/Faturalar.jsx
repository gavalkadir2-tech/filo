import { useState } from 'react';
import { LS, uid } from '../../utils/storage.js';
import { C, S } from '../../styles.js';
import { fmtDate, fmtTL, today, daysLeft } from '../../utils/formatters.js';
import { Badge, FG, Modal, StatCard, TabBar, Warn } from '../../components/UI.jsx';

export default function Faturalar() {
  const projeler = LS.get('projeler');
  const [faturalar, setFaturalar] = useState(LS.get('faturalar'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('kesilen');

  const save = () => {
    const toplam = (+form.tutar || 0) + (+form.kdv || 0);
    const n = form.id
      ? faturalar.map(f => f.id === form.id ? { ...form, toplam } : f)
      : [...faturalar, { ...form, id: uid(), toplam, no: form.no || `${form.tur === 'kesilen' ? 'F' : 'AF'}-${today().slice(0, 7)}-${String(faturalar.length + 1).padStart(3, '0')}`, durum: form.durum || 'bekliyor' }];
    LS.set('faturalar', n); setFaturalar(n); setModal(false);
  };
  const del = (id) => { const n = faturalar.filter(f => f.id !== id); LS.set('faturalar', n); setFaturalar(n); };
  const odendi = (id) => { const n = faturalar.map(f => f.id === id ? { ...f, durum: 'odendi' } : f); LS.set('faturalar', n); setFaturalar(n); };

  const filtreli = faturalar.filter(f => f.tur === tab);
  const bekleyenToplam = filtreli.filter(f => f.durum === 'bekliyor').reduce((s, f) => s + (+f.toplam || 0), 0);
  const odenenToplam = filtreli.filter(f => f.durum === 'odendi').reduce((s, f) => s + (+f.toplam || 0), 0);
  const vadesiYaklasan = filtreli.filter(f => f.durum === 'bekliyor' && daysLeft(f.vadeTarih) <= 7);

  return (
    <div>
      <TabBar tabs={[['kesilen', '📤 Kesilen Faturalar'], ['alinan', '📥 Alınan Faturalar']]} active={tab} onChange={setTab} />

      <div style={S.g3}>
        <StatCard color={C.yellow} value={fmtTL(bekleyenToplam)} label="Bekleyen Toplam" />
        <StatCard color={C.green} value={fmtTL(odenenToplam)} label="Ödenen/Tahsil Edilen" />
        <StatCard color={C.red} value={vadesiYaklasan.length} label="Vadesi Yaklaşan (≤7 gün)" />
      </div>

      {vadesiYaklasan.length > 0 && <Warn msg={`${vadesiYaklasan.length} fatura vade tarihine 7 günden az kaldı!`} c={C.red} />}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button style={S.btn()} onClick={() => { setForm({ tur: tab, tarih: today(), durum: 'bekliyor' }); setModal(true); }}>＋ Fatura Ekle</button>
      </div>

      <div style={S.card}>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>No</th><th style={S.th}>{tab === 'kesilen' ? 'Müşteri' : 'Tedarikçi'}</th><th style={S.th}>Tarih</th><th style={S.th}>Vade</th><th style={S.th}>Tutar</th><th style={S.th}>KDV</th><th style={S.th}>Toplam</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
          <tbody>{[...filtreli].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(f => {
            const vadeGun = daysLeft(f.vadeTarih);
            return (
              <tr key={f.id}>
                <td style={S.td}><code style={{ fontSize: 11, color: C.accent }}>{f.no}</code></td>
                <td style={S.td}><strong style={{ color: C.white }}>{f.musteri}</strong></td>
                <td style={S.td}>{fmtDate(f.tarih)}</td>
                <td style={S.td}>
                  <span style={{ color: f.durum === 'bekliyor' && vadeGun <= 7 ? C.red : C.text }}>{fmtDate(f.vadeTarih)}</span>
                </td>
                <td style={S.td}>{fmtTL(f.tutar)}</td>
                <td style={S.td}><span style={{ fontSize: 12, color: C.muted }}>{fmtTL(f.kdv)}</span></td>
                <td style={S.td}><strong style={{ color: C.accent }}>{fmtTL(f.toplam)}</strong></td>
                <td style={S.td}><Badge d={f.durum} /></td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {f.durum !== 'odendi' && <button style={S.btn(C.green)} onClick={() => odendi(f.id)}>✓</button>}
                    <button style={S.btnO} onClick={() => { setForm(f); setModal(true); }}>✏️</button>
                    <button style={S.btnR} onClick={() => del(f.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.id ? 'Fatura Düzenle' : 'Yeni Fatura'} onClose={() => setModal(false)}>
          <FG label="Tür">
            <select style={S.sel} value={form.tur || 'kesilen'} onChange={e => setForm(f => ({ ...f, tur: e.target.value }))}>
              <option value="kesilen">Kesilen (Satış)</option><option value="alinan">Alınan (Alış)</option>
            </select>
          </FG>
          <FG label={form.tur === 'kesilen' ? 'Müşteri' : 'Tedarikçi'}><input style={S.inp} value={form.musteri || ''} onChange={e => setForm(f => ({ ...f, musteri: e.target.value }))} /></FG>
          <FG label="Açıklama"><input style={S.inp} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Fatura Tarihi"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
            <FG label="Vade Tarihi"><input type="date" style={S.inp} value={form.vadeTarih || ''} onChange={e => setForm(f => ({ ...f, vadeTarih: e.target.value }))} /></FG>
          </div>
          <div style={S.g2}>
            <FG label="Tutar (₺, KDV hariç)"><input type="number" style={S.inp} value={form.tutar || ''} onChange={e => setForm(f => ({ ...f, tutar: +e.target.value }))} /></FG>
            <FG label="KDV (₺)"><input type="number" style={S.inp} value={form.kdv || ''} onChange={e => setForm(f => ({ ...f, kdv: +e.target.value }))} /></FG>
          </div>
          {form.tutar !== undefined && <div style={S.alert(C.accent)}>Toplam: <strong>{fmtTL((+form.tutar || 0) + (+form.kdv || 0))}</strong></div>}
          <FG label="İlgili Proje">
            <select style={S.sel} value={form.projeId || ''} onChange={e => setForm(f => ({ ...f, projeId: +e.target.value || null }))}>
              <option value="">— Yok —</option>{projeler.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
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
