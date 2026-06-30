import { LS } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { daysLeft, fmtDate, fmtTL, today } from '../utils/formatters.js';
import { StatCard, Badge, Warn } from '../components/UI.jsx';

export default function Dashboard() {
  const araclar = LS.get('araclar');
  const bakimlar = LS.get('bakimlar');
  const yakitlar = LS.get('yakitlar');
  const operatorler = LS.get('operatorler');
  const gelirGider = LS.get('gelirGider');
  const isemirleri = LS.get('isemirleri');

  const aktifArac = araclar.filter(a => a.durum === 'aktif').length;
  const bakimdaArac = araclar.filter(a => a.durum === 'bakimda').length;
  const bekleyenBakim = bakimlar.filter(b => b.durum === 'bekliyor').length;
  const buAyYakit = yakitlar.filter(y => y.tarih?.startsWith(today().slice(0, 7))).reduce((s, y) => s + (+y.toplam || 0), 0);

  const buAyGelir = gelirGider.filter(g => g.tur === 'gelir' && g.tarih?.startsWith(today().slice(0, 7))).reduce((s, g) => s + (+g.tutar || 0), 0);
  const buAyGider = gelirGider.filter(g => g.tur === 'gider' && g.tarih?.startsWith(today().slice(0, 7))).reduce((s, g) => s + (+g.tutar || 0), 0);

  const uyarilar = [];
  araclar.forEach(a => {
    const sg = daysLeft(a.sigorta), mu = daysLeft(a.muayene);
    if (sg <= 30) uyarilar.push({ tip: 'Sigorta', arac: a.ad, gun: sg, c: sg <= 7 ? C.red : C.yellow });
    if (mu <= 30) uyarilar.push({ tip: 'Muayene', arac: a.ad, gun: mu, c: mu <= 7 ? C.red : C.yellow });
  });
  uyarilar.sort((a, b) => a.gun - b.gun);

  const acikIsler = isemirleri.filter(i => i.durum !== 'tamamlandi');

  return (
    <div>
      <div style={S.g4}>
        <StatCard color={C.green} value={aktifArac} label="Aktif Araç" sub={`${araclar.length} toplam`} />
        <StatCard color={C.yellow} value={bakimdaArac} label="Bakımda" sub={`${bekleyenBakim} bekleyen bakım`} />
        <StatCard color={C.accent} value={fmtTL(buAyYakit)} label="Bu Ay Yakıt Gideri" />
        <StatCard color={buAyGelir - buAyGider >= 0 ? C.green : C.red} value={fmtTL(buAyGelir - buAyGider)} label="Bu Ay Net Kar/Zarar" sub={`Gelir ${fmtTL(buAyGelir)} · Gider ${fmtTL(buAyGider)}`} />
      </div>

      <div style={S.g2}>
        <div style={S.card}>
          <div style={S.secTitle}>⚠️ Yaklaşan Belge Süreleri</div>
          {uyarilar.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13 }}>Yaklaşan belge süresi yok.</div>
          ) : uyarilar.slice(0, 6).map((u, i) => (
            <div key={i} style={S.alert(u.c)}>
              <strong>{u.tip}</strong>&nbsp;— {u.arac}: {u.gun <= 0 ? 'SÜRESİ DOLDU' : `${u.gun} gün kaldı`}
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.secTitle}>📌 Açık İş Emirleri</div>
          {acikIsler.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13 }}>Açık iş emri yok.</div>
          ) : acikIsler.slice(0, 6).map(i => {
            const a = araclar.find(x => x.id === i.aracId);
            return (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}22` }}>
                <div>
                  <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{i.baslik}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{a?.ad || '—'}</div>
                </div>
                <Badge d={i.durum} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>🚜 Araç Durum Özeti</div>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Araç</th><th style={S.th}>Tip</th><th style={S.th}>Operatör</th><th style={S.th}>Çalışma Saati</th><th style={S.th}>Durum</th></tr></thead>
          <tbody>
            {araclar.map(a => {
              const op = operatorler.find(o => o.id === a.opId);
              return (
                <tr key={a.id}>
                  <td style={S.td}><strong style={{ color: C.white }}>{a.ad}</strong></td>
                  <td style={S.td}>{a.tip}</td>
                  <td style={S.td}>{op?.ad || '—'}</td>
                  <td style={S.td}>{a.saat?.toLocaleString('tr-TR')} sa</td>
                  <td style={S.td}><Badge d={a.durum} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
