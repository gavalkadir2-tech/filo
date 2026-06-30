import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LS } from '../../utils/storage.js';
import { C, S } from '../../styles.js';
import { fmtTL, months, fmtMonth } from '../../utils/formatters.js';
import { StatCard } from '../../components/UI.jsx';

const PIE_COLORS = [C.accent, C.blue, C.green, C.purple, C.red, C.yellow, C.teal, C.pink, C.orange];

export default function FinansalRaporlar() {
  const gelirGider = LS.get('gelirGider');
  const projeler = LS.get('projeler');
  const faturalar = LS.get('faturalar');

  const aylikVeri = useMemo(() => {
    return months().map(m => {
      const gelir = gelirGider.filter(g => g.tur === 'gelir' && g.tarih?.startsWith(m)).reduce((s, g) => s + (+g.tutar || 0), 0);
      const gider = gelirGider.filter(g => g.tur === 'gider' && g.tarih?.startsWith(m)).reduce((s, g) => s + (+g.tutar || 0), 0);
      return { ay: fmtMonth(m).split(' ')[0], gelir, gider, net: gelir - gider };
    });
  }, [gelirGider]);

  const giderDagilimi = useMemo(() => {
    const map = {};
    gelirGider.filter(g => g.tur === 'gider').forEach(g => { map[g.kategori] = (map[g.kategori] || 0) + (+g.tutar || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [gelirGider]);

  const projeKarliligi = useMemo(() => {
    return projeler.map(p => {
      const gelir = gelirGider.filter(g => g.tur === 'gelir' && g.projeId === p.id).reduce((s, g) => s + (+g.tutar || 0), 0);
      const gider = gelirGider.filter(g => g.tur === 'gider' && g.projeId === p.id).reduce((s, g) => s + (+g.tutar || 0), 0);
      return { proje: p.ad.length > 14 ? p.ad.slice(0, 14) + '…' : p.ad, gelir, gider, kar: gelir - gider };
    }).filter(p => p.gelir > 0 || p.gider > 0);
  }, [gelirGider, projeler]);

  const toplamGelir = gelirGider.filter(g => g.tur === 'gelir').reduce((s, g) => s + (+g.tutar || 0), 0);
  const toplamGider = gelirGider.filter(g => g.tur === 'gider').reduce((s, g) => s + (+g.tutar || 0), 0);
  const tahsilEdilecek = faturalar.filter(f => f.tur === 'kesilen' && f.durum === 'bekliyor').reduce((s, f) => s + (+f.toplam || 0), 0);
  const odenecek = faturalar.filter(f => f.tur === 'alinan' && f.durum === 'bekliyor').reduce((s, f) => s + (+f.toplam || 0), 0);

  const tooltipStyle = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text };

  return (
    <div>
      <div style={S.g4}>
        <StatCard color={C.green} value={fmtTL(toplamGelir)} label="Toplam Gelir (Tüm Zamanlar)" />
        <StatCard color={C.red} value={fmtTL(toplamGider)} label="Toplam Gider (Tüm Zamanlar)" />
        <StatCard color={C.blue} value={fmtTL(tahsilEdilecek)} label="Tahsil Edilecek" />
        <StatCard color={C.purple} value={fmtTL(odenecek)} label="Ödenecek" />
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>📈 6 Aylık Gelir / Gider Trendi</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={aylikVeri}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="ay" tick={{ fill: C.muted, fontSize: 12 }} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => (v / 1000) + 'K'} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => fmtTL(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="gelir" name="Gelir" stroke={C.green} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="gider" name="Gider" stroke={C.red} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="net" name="Net" stroke={C.accent} strokeWidth={2} strokeDasharray="4 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={S.g2}>
        <div style={S.card}>
          <div style={S.secTitle}>🥧 Gider Kategorileri Dağılımı</div>
          {giderDagilimi.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Henüz gider kaydı yok.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={giderDagilimi} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`} labelLine={false} fontSize={11}>
                  {giderDagilimi.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={v => fmtTL(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={S.card}>
          <div style={S.secTitle}>🏗️ Proje Bazlı Kârlılık</div>
          {projeKarliligi.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Proje bazlı gelir/gider kaydı yok.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={projeKarliligi}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="proje" tick={{ fill: C.muted, fontSize: 10 }} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => (v / 1000) + 'K'} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => fmtTL(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="gelir" name="Gelir" fill={C.green} radius={[4, 4, 0, 0]} />
                <Bar dataKey="gider" name="Gider" fill={C.red} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>📑 Özet Kâr/Zarar Tablosu</div>
        <table style={S.tbl}>
          <tbody>
            <tr><td style={S.td}>Toplam Gelir</td><td style={{ ...S.td, textAlign: 'right' }}><strong style={{ color: C.green }}>{fmtTL(toplamGelir)}</strong></td></tr>
            <tr><td style={S.td}>Toplam Gider</td><td style={{ ...S.td, textAlign: 'right' }}><strong style={{ color: C.red }}>−{fmtTL(toplamGider)}</strong></td></tr>
            <tr><td style={{ ...S.td, borderTop: `2px solid ${C.border}`, fontWeight: 700, color: C.white }}>Net Kâr/Zarar</td><td style={{ ...S.td, borderTop: `2px solid ${C.border}`, textAlign: 'right' }}><strong style={{ color: toplamGelir - toplamGider >= 0 ? C.green : C.red, fontSize: 16 }}>{fmtTL(toplamGelir - toplamGider)}</strong></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
