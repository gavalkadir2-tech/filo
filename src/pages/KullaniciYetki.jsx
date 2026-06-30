import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { FG, Modal, StatCard, TabBar, Toggle } from '../components/UI.jsx';

const YETKI = {
  admin: { renk: C.red, label: 'Admin', aciklama: 'Tüm modüllere erişim, kullanıcı yönetimi', moduller: ['Dashboard', 'Araç', 'Bakım', 'Yakıt', 'Operatör', 'Evrak', 'Hasar', 'Parça', 'İş Emri', 'Proje', 'Muhasebe', 'Akaryakıt', 'Saha', 'Bildirim', 'Kullanıcı', 'ERP', 'Yapay Zeka'] },
  muhasebe: { renk: C.purple, label: 'Muhasebe', aciklama: 'Gelir-gider, fatura, kasa-banka, raporlar', moduller: ['Dashboard', 'Muhasebe', 'Yakıt', 'Bakım', 'Proje', 'ERP'] },
  sef: { renk: C.blue, label: 'Şef', aciklama: 'Araç, bakım, iş emirleri', moduller: ['Dashboard', 'Araç', 'Bakım', 'Yakıt', 'İş Emri', 'Saha', 'Parça'] },
  operator: { renk: C.green, label: 'Operatör', aciklama: 'Sadece saha girişleri', moduller: ['Dashboard (Özet)', 'Saha', 'Akaryakıt (Okuma)'] },
};

export default function KullaniciYetki() {
  const [kullanicilar, setKullanicilar] = useState(LS.get('kullanicilar'));
  const [loglar] = useState(LS.get('islemLoglari'));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('kullanicilar');

  const save = () => { const n = form.id ? kullanicilar.map(x => x.id === form.id ? form : x) : [...kullanicilar, { ...form, id: uid(), aktif: true, son: '—' }]; LS.set('kullanicilar', n); setKullanicilar(n); setModal(false); };
  const toggleUser = (id) => { const n = kullanicilar.map(x => x.id === id ? { ...x, aktif: !x.aktif } : x); LS.set('kullanicilar', n); setKullanicilar(n); };

  return (
    <div>
      <div style={S.g4}>
        {Object.entries(YETKI).map(([rol, yr]) => (
          <StatCard key={rol} color={yr.renk} value={kullanicilar.filter(k => k.rol === rol && k.aktif).length} label={yr.label} />
        ))}
      </div>

      <TabBar tabs={[['kullanicilar', '👥 Kullanıcılar'], ['roller', '🔐 Rol Yetkileri'], ['log', '📜 İşlem Logu']]} active={tab} onChange={setTab} />

      {tab === 'kullanicilar' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button style={S.btn()} onClick={() => { setForm({ rol: 'operator', firma: 'FiloPro A.Ş.' }); setModal(true); }}>＋ Kullanıcı Ekle</button>
          </div>
          <div style={S.card}>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Ad</th><th style={S.th}>E-posta</th><th style={S.th}>Rol</th><th style={S.th}>2FA</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
              <tbody>{kullanicilar.map(k => {
                const yr = YETKI[k.rol];
                return (
                  <tr key={k.id}>
                    <td style={S.td}><strong style={{ color: C.white }}>{k.ad}</strong></td>
                    <td style={S.td}><span style={{ color: C.muted, fontSize: 12 }}>{k.email}</span></td>
                    <td style={S.td}><span style={S.badge(yr.renk)}>{yr.label}</span></td>
                    <td style={S.td}><span style={{ color: k.twofa ? C.green : C.muted }}>{k.twofa ? '✓ Aktif' : '—'}</span></td>
                    <td style={S.td}><span style={S.badge(k.aktif ? C.green : C.muted)}>{k.aktif ? 'Aktif' : 'Pasif'}</span></td>
                    <td style={S.td}><div style={{ display: 'flex', gap: 5 }}><button style={S.btnO} onClick={() => { setForm(k); setModal(true); }}>✏️</button><button style={S.btnO} onClick={() => toggleUser(k.id)}>{k.aktif ? '🔒' : '🔓'}</button></div></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'roller' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {Object.entries(YETKI).map(([rol, yr]) => (
            <div key={rol} style={{ ...S.card, borderTop: `3px solid ${yr.renk}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>{yr.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{yr.aciklama}</div>
              {yr.moduller.map(m => <div key={m} style={{ fontSize: 12, color: C.text, padding: '3px 0', borderBottom: `1px solid ${C.border}22` }}>✓ {m}</div>)}
            </div>
          ))}
        </div>
      )}

      {tab === 'log' && (
        <div style={S.card}>
          <table style={S.tbl}>
            <thead><tr><th style={S.th}>Kullanıcı</th><th style={S.th}>İşlem</th><th style={S.th}>Detay</th><th style={S.th}>Tarih</th></tr></thead>
            <tbody>{loglar.map(l => (
              <tr key={l.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{l.kullanici}</strong></td>
                <td style={S.td}><span style={S.badge(C.blue)}>{l.islem}</span></td>
                <td style={S.td}><span style={{ fontSize: 12, color: C.muted }}>{l.detay}</span></td>
                <td style={S.td}><span style={{ fontSize: 12, color: C.muted }}>{l.tarih}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={form.id ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'} onClose={() => setModal(false)}>
          <FG label="Ad Soyad"><input style={S.inp} value={form.ad || ''} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></FG>
          <FG label="E-posta"><input type="email" style={S.inp} value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></FG>
          <FG label="Rol">
            <select style={S.sel} value={form.rol || 'operator'} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
              <option value="admin">Admin</option><option value="muhasebe">Muhasebe</option><option value="sef">Şef</option><option value="operator">Operatör</option>
            </select>
          </FG>
          <div style={S.fg}>
            <label style={S.lbl}>İki Faktörlü Giriş (2FA)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle value={!!form.twofa} onChange={v => setForm(f => ({ ...f, twofa: v }))} />
              <span style={{ fontSize: 12, color: C.muted }}>{form.twofa ? 'Aktif' : 'Pasif'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}><button style={S.btnO} onClick={() => setModal(false)}>İptal</button><button style={S.btn()} onClick={save}>Kaydet</button></div>
        </Modal>
      )}
    </div>
  );
}
