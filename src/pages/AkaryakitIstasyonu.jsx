import { useState } from 'react';
import { LS, uid } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { fmtDate, today } from '../utils/formatters.js';
import { Badge, FG, Modal, StatCard, Warn } from '../components/UI.jsx';

export default function AkaryakitIstasyonu() {
  const araclar = LS.get('araclar');
  const [pompalar] = useState(LS.get('pompalar').length ? LS.get('pompalar') : [
    { id: 1, ad: 'Pompa-1 (Dizel)', aktif: true, toplamLt: 12450, bugunLt: 340 },
    { id: 2, ad: 'Pompa-2 (Dizel)', aktif: true, toplamLt: 8920, bugunLt: 180 },
  ]);
  const [limitler, setLimitler] = useState(LS.get('yakitLimitler'));
  const [ikmaller, setIkmaller] = useState(LS.get('otomatikIkmaller'));
  const [modal, setModal] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const [form, setForm] = useState({});
  const [lForm, setLForm] = useState({});

  const saveLimit = () => {
    const n = limitler.some(l => l.aracId === lForm.aracId)
      ? limitler.map(l => l.aracId === lForm.aracId ? lForm : l)
      : [...limitler, { ...lForm, id: uid() }];
    LS.set('yakitLimitler', n); setLimitler(n); setLimitModal(false);
  };

  const kaydet = () => {
    const n = [...ikmaller, { ...form, id: uid(), tarih: today(), onaylı: true }];
    LS.set('otomatikIkmaller', n); setIkmaller(n);
    const yakitlar = LS.get('yakitlar');
    LS.set('yakitlar', [...yakitlar, { id: uid(), aracId: +form.aracId, tarih: today(), miktar: +form.miktar, fiyat: 44, toplam: +form.miktar * 44, depo: form.kart || 'Pompa' }]);
    setModal(false);
  };

  const onayla = (id) => { const n = ikmaller.map(x => x.id === id ? { ...x, onaylı: true } : x); LS.set('otomatikIkmaller', n); setIkmaller(n); };
  const iptal = (id) => { const n = ikmaller.filter(x => x.id !== id); LS.set('otomatikIkmaller', n); setIkmaller(n); };

  const yetkisizler = ikmaller.filter(i => {
    const limit = limitler.find(l => l.aracId === i.aracId);
    if (!limit) return false;
    const gunluk = ikmaller.filter(x => x.aracId === i.aracId && x.tarih === today()).reduce((s, x) => s + (+x.miktar || 0), 0);
    return gunluk > limit.gunluk;
  });

  return (
    <div>
      <div style={S.g3}>
        <StatCard color={C.green} value={pompalar.length} label="Aktif Pompa" />
        <StatCard color={C.accent} value={pompalar.reduce((s, p) => s + p.bugunLt, 0) + ' Lt'} label="Bugün İkmal" />
        <StatCard color={C.red} value={yetkisizler.length} label="Limit Aşımı" />
      </div>

      {yetkisizler.length > 0 && <Warn msg={`${yetkisizler.length} adet yetkisiz/limit aşan ikmal tespit edildi!`} c={C.red} />}

      <div style={S.g2}>
        <div style={S.card}>
          <div style={S.secTitle}>⛽ Pompa Durumu</div>
          {pompalar.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ color: C.white, fontWeight: 600 }}>{p.ad}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Toplam: {p.toplamLt.toLocaleString('tr-TR')} Lt</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: C.accent, fontWeight: 700 }}>{p.bugunLt} Lt</div>
                <div style={{ fontSize: 11, color: C.muted }}>bugün</div>
              </div>
              <Badge d={p.aktif ? 'aktif' : 'pasif'} />
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.secTitle}>🎯 Araç Limitleri</div>
            <button style={S.btn()} onClick={() => { setLForm({}); setLimitModal(true); }}>＋ Limit Ekle</button>
          </div>
          {araclar.map(a => {
            const lim = limitler.find(l => l.aracId === a.id);
            const bugunIkmal = ikmaller.filter(x => x.aracId === a.id && x.tarih === today()).reduce((s, x) => s + (+x.miktar || 0), 0);
            return (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}22` }}>
                <div style={{ fontSize: 13, color: C.text }}>{a.ad}</div>
                <div style={{ fontSize: 12 }}>
                  {lim ? <span style={{ color: bugunIkmal > lim.gunluk ? C.red : C.green }}>{bugunIkmal}/{lim.gunluk} Lt{bugunIkmal > lim.gunluk && ' ⚠️'}</span> : <span style={{ color: C.muted }}>Limit yok</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={S.secTitle}>🔄 Otomatik İkmal Kayıtları</div>
          <button style={S.btn()} onClick={() => { setForm({}); setModal(true); }}>＋ Manuel Kayıt</button>
        </div>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Tarih</th><th style={S.th}>Kart No</th><th style={S.th}>Litre</th><th style={S.th}>Durum</th><th style={S.th}></th></tr></thead>
          <tbody>{[...ikmaller].sort((a, b) => b.tarih?.localeCompare(a.tarih)).map(i => {
            const a = araclar.find(x => x.id === i.aracId);
            const limit = limitler.find(l => l.aracId === i.aracId);
            const yetkisiz = limit && i.miktar > limit.gunluk;
            return (
              <tr key={i.id}>
                <td style={S.td}><strong style={{ color: C.white }}>{a?.ad || '—'}</strong></td>
                <td style={S.td}>{fmtDate(i.tarih)}</td>
                <td style={S.td}><code style={{ color: C.accent, fontSize: 11 }}>{i.kart || '—'}</code></td>
                <td style={S.td}>{i.miktar} Lt {yetkisiz && <span style={{ color: C.red }}>⚠️ LIMIT</span>}</td>
                <td style={S.td}><Badge d={i.onaylı ? 'tamamlandi' : 'bekliyor'} /></td>
                <td style={S.td}>{!i.onaylı && <div style={{ display: 'flex', gap: 4 }}><button style={S.btn(C.green)} onClick={() => onayla(i.id)}>✓</button><button style={S.btnR} onClick={() => iptal(i.id)}>✕</button></div>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Manuel İkmal Kaydı" onClose={() => setModal(false)}>
          <FG label="Araç"><select style={S.sel} value={form.aracId || ''} onChange={e => setForm(f => ({ ...f, aracId: +e.target.value }))}><option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}</select></FG>
          <FG label="Kart No"><input style={S.inp} value={form.kart || ''} onChange={e => setForm(f => ({ ...f, kart: e.target.value }))} /></FG>
          <FG label="Miktar (Lt)"><input type="number" style={S.inp} value={form.miktar || ''} onChange={e => setForm(f => ({ ...f, miktar: +e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}><button style={S.btnO} onClick={() => setModal(false)}>İptal</button><button style={S.btn()} onClick={kaydet}>Kaydet</button></div>
        </Modal>
      )}

      {limitModal && (
        <Modal title="Limit Belirle" onClose={() => setLimitModal(false)} width={400}>
          <FG label="Araç"><select style={S.sel} value={lForm.aracId || ''} onChange={e => setLForm(f => ({ ...f, aracId: +e.target.value }))}><option value="">— Seçiniz —</option>{araclar.map(a => <option key={a.id} value={a.id}>{a.ad}</option>)}</select></FG>
          <FG label="Günlük Limit (Lt)"><input type="number" style={S.inp} value={lForm.gunluk || ''} onChange={e => setLForm(f => ({ ...f, gunluk: +e.target.value }))} /></FG>
          <FG label="Aylık Limit (Lt)"><input type="number" style={S.inp} value={lForm.aylik || ''} onChange={e => setLForm(f => ({ ...f, aylik: +e.target.value }))} /></FG>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}><button style={S.btnO} onClick={() => setLimitModal(false)}>İptal</button><button style={S.btn()} onClick={saveLimit}>Kaydet</button></div>
        </Modal>
      )}
    </div>
  );
}
