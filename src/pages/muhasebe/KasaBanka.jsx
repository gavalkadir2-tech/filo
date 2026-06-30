import { useState } from 'react';
import { LS, uid } from '../../utils/storage.js';
import { C, S } from '../../styles.js';
import { fmtDate, fmtTL, today } from '../../utils/formatters.js';
import { FG, Modal, StatCard } from '../../components/UI.jsx';

export default function KasaBanka() {
  const [hesaplar, setHesaplar] = useState(LS.get('hesaplar'));
  const [hareketler, setHareketler] = useState(LS.get('kasaHareketleri'));
  const [modal, setModal] = useState(false);
  const [hesapModal, setHesapModal] = useState(false);
  const [form, setForm] = useState({});
  const [hForm, setHForm] = useState({});
  const [filtreHesap, setFiltreHesap] = useState('');

  const toplamBakiye = hesaplar.filter(h => h.tur === 'aktif').reduce((s, h) => s + (+h.bakiye || 0), 0);

  const saveHareket = () => {
    const tutar = +form.tutar || 0;
    const n = [...hareketler, { ...form, id: uid(), tarih: form.tarih || today(), belgeNo: `KH-${String(hareketler.length + 1).padStart(3, '0')}` }];
    LS.set('kasaHareketleri', n); setHareketler(n);

    const hn = hesaplar.map(h => h.id === form.hesapId ? { ...h, bakiye: h.bakiye + (form.tur === 'giris' ? tutar : -tutar) } : h);
    LS.set('hesaplar', hn); setHesaplar(hn);
    setModal(false);
  };

  const saveHesap = () => {
    const n = hForm.id ? hesaplar.map(h => h.id === hForm.id ? hForm : h) : [...hesaplar, { ...hForm, id: uid(), bakiye: +hForm.bakiye || 0, tur: hForm.tur || 'aktif', para: 'TRY' }];
    LS.set('hesaplar', n); setHesaplar(n); setHesapModal(false);
  };

  const filtreliHareketler = filtreHesap ? hareketler.filter(h => h.hesapId === +filtreHesap) : hareketler;

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.green} value={fmtTL(toplamBakiye)} label="Toplam Bakiye (Aktif Hesaplar)" />
        <StatCard color={C.blue} value={hesaplar.filter(h => h.tur === 'aktif').length} label="Kasa/Banka Hesabı" />
        <StatCard color={C.red} value={fmtTL(hesaplar.filter(h => h.tur === 'pasif').reduce((s, h) => s + h.bakiye, 0))} label="Toplam Borç" />
      </div>

      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={S.secTitle}>💳 Hesaplar</div>
          <button style={S.btn()} onClick={() => { setHForm({}); setHesapModal(true); }}>＋ Hesap Ekle</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {hesaplar.map(h => (
            <div key={h.id} style={{ background: '#0f1117', borderRadius: 8, padding: 14, border: `1px solid ${C.border}`, cursor: 'pointer' }} onClick={() => { setHForm(h); setHesapModal(true); }}>
              <div style={{ fontSize: 11, color: C.muted }}>{h.kod} · {h.tur === 'aktif' ? 'Varlık' : 'Borç'}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginTop: 2 }}>{h.ad}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: h.tur === 'aktif' ? C.green : C.red, marginTop: 8 }}>{fmtTL(h.bakiye)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={S.secTitle}>📋 Hesap Hareketleri</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select style={{ ...S.sel, width: 180 }} value={filtreHesap} onChange={e => setFiltreHesap(e.target.value)}>
              <option value="">Tüm Hesaplar</option>{hesaplar.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
            </select>
            <button style={S.btn(C.green)} onClick={() => { setForm({ tur: 'giris', tarih: today() }); setModal(true); }}>＋ Giriş</button>
            <button style={S.btn(C.red)} onClick={() => { setForm({ tur: 'cikis', tarih: today() }); setModal(true); }}>＋ Çıkış</button>
          </div>
        </div>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Belge No</th><th style={S.th}>Hesap</th><th style={S.th}>Tarih</th><th style={S.th}>Açıklama</th><th style={S.th}>Tutar</th></tr></thead>
          <tbody>{[...filtreliHareketler].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(h => {
            const hesap = hesaplar.find(x => x.id === h.hesapId);
            return (
              <tr key={h.id}>
                <td style={S.td}><code style={{ fontSize: 11, color: C.muted }}>{h.belgeNo}</code></td>
                <td style={S.td}>{hesap?.ad || '—'}</td>
                <td style={S.td}>{fmtDate(h.tarih)}</td>
                <td style={S.td}><span style={{ fontSize: 12 }}>{h.aciklama}</span></td>
                <td style={S.td}><strong style={{ color: h.tur === 'giris' ? C.green : C.red }}>{h.tur === 'giris' ? '+' : '−'}{fmtTL(h.tutar)}</strong></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title={form.tur === 'giris' ? 'Para Girişi' : 'Para Çıkışı'} onClose={() => setModal(false)}>
          <FG label="Hesap">
            <select style={S.sel} value={form.hesapId || ''} onChange={e => setForm(f => ({ ...f, hesapId: +e.target.value }))}>
              <option value="">— Seçiniz —</option>{hesaplar.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
            </select>
          </FG>
          <FG label="Açıklama"><input style={S.inp} value={form.aciklama || ''} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></FG>
          <div style={S.g2}>
            <FG label="Tutar (₺)"><input type="number" style={S.inp} value={form.tutar || ''} onChange={e => setForm(f => ({ ...f, tutar: +e.target.value }))} /></FG>
            <FG label="Tarih"><input type="date" style={S.inp} value={form.tarih || ''} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></FG>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setModal(false)}>İptal</button>
            <button style={S.btn(form.tur === 'giris' ? C.green : C.red)} onClick={saveHareket}>Kaydet</button>
          </div>
        </Modal>
      )}

      {hesapModal && (
        <Modal title={hForm.id ? 'Hesap Düzenle' : 'Yeni Hesap'} onClose={() => setHesapModal(false)} width={420}>
          <div style={S.g2}>
            <FG label="Hesap Kodu"><input style={S.inp} value={hForm.kod || ''} onChange={e => setHForm(f => ({ ...f, kod: e.target.value }))} placeholder="100" /></FG>
            <FG label="Tür">
              <select style={S.sel} value={hForm.tur || 'aktif'} onChange={e => setHForm(f => ({ ...f, tur: e.target.value }))}>
                <option value="aktif">Varlık (Kasa/Banka)</option><option value="pasif">Borç</option>
              </select>
            </FG>
          </div>
          <FG label="Hesap Adı"><input style={S.inp} value={hForm.ad || ''} onChange={e => setHForm(f => ({ ...f, ad: e.target.value }))} /></FG>
          <FG label="Bakiye (₺)"><input type="number" style={S.inp} value={hForm.bakiye ?? ''} onChange={e => setHForm(f => ({ ...f, bakiye: +e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={S.btnO} onClick={() => setHesapModal(false)}>İptal</button>
            <button style={S.btn()} onClick={saveHesap}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
