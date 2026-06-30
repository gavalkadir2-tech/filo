import { LS } from '../utils/storage.js';
import { C, S } from '../styles.js';
import { daysLeft, fmtDate } from '../utils/formatters.js';
import { Warn } from '../components/UI.jsx';

export default function EvrakTakibi() {
  const araclar = LS.get('araclar');
  const operatorler = LS.get('operatorler');

  const evraklar = [];
  araclar.forEach(a => {
    evraklar.push({ varlik: a.ad, tip: 'Sigorta', tarih: a.sigorta, gun: daysLeft(a.sigorta) });
    evraklar.push({ varlik: a.ad, tip: 'Muayene', tarih: a.muayene, gun: daysLeft(a.muayene) });
  });
  operatorler.forEach(o => {
    evraklar.push({ varlik: o.ad, tip: 'Operatör Belgesi', tarih: o.belge, gun: daysLeft(o.belge) });
  });
  evraklar.sort((a, b) => a.gun - b.gun);

  const kritikler = evraklar.filter(e => e.gun <= 7);
  const yaklasanlar = evraklar.filter(e => e.gun > 7 && e.gun <= 30);

  return (
    <div>
      {kritikler.length > 0 && <Warn msg={`${kritikler.length} belge 7 gün içinde sona eriyor veya süresi doldu!`} c={C.red} />}
      {yaklasanlar.length > 0 && <Warn msg={`${yaklasanlar.length} belge 30 gün içinde sona eriyor.`} c={C.yellow} />}

      <div style={S.card}>
        <div style={S.secTitle}>📋 Tüm Belgeler</div>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Varlık</th><th style={S.th}>Belge Tipi</th><th style={S.th}>Bitiş Tarihi</th><th style={S.th}>Kalan Gün</th></tr></thead>
          <tbody>{evraklar.map((e, i) => (
            <tr key={i}>
              <td style={S.td}><strong style={{ color: C.white }}>{e.varlik}</strong></td>
              <td style={S.td}>{e.tip}</td>
              <td style={S.td}>{fmtDate(e.tarih)}</td>
              <td style={S.td}>
                <span style={{ color: e.gun <= 7 ? C.red : e.gun <= 30 ? C.yellow : C.green, fontWeight: 600 }}>
                  {e.gun <= 0 ? 'SÜRESİ DOLDU' : `${e.gun} gün`}
                </span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
