import { C, S } from '../styles.js';
import { fmtDate } from '../utils/formatters.js';

export function Badge({ d }) {
  const m = {
    aktif: [C.green, 'Aktif'], bakimda: [C.yellow, 'Bakımda'], hurda: [C.red, 'Hurda'],
    tamamlandi: [C.green, 'Tamamlandı'], bekliyor: [C.yellow, 'Bekliyor'], planli: [C.blue, 'Planlı'],
    acik: [C.red, 'Açık'], devamediyor: [C.yellow, 'Devam'], kapandi: [C.green, 'Kapandı'],
    kritik: [C.red, 'Kritik'], normal: [C.blue, 'Normal'], dusuk: [C.muted, 'Düşük'],
    pasif: [C.muted, 'Pasif'], odendi: [C.green, 'Ödendi'], iptal: [C.red, 'İptal'],
    gelir: [C.green, 'Gelir'], gider: [C.red, 'Gider'],
    kesilen: [C.blue, 'Kesilen'], alinan: [C.purple, 'Alınan'],
  };
  const [c, l] = m[d] || [C.muted, d];
  return <span style={S.badge(c)}>{l}</span>;
}

export function Warn({ msg, c = C.yellow }) {
  return <div style={S.alert(c)}>⚠️ {msg}</div>;
}

export function FG({ label, children }) {
  return <div style={S.fg}><label style={S.lbl}>{label}</label>{children}</div>;
}

export function StatCard({ color, value, label, sub }) {
  return (
    <div style={S.stat(color)}>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLbl}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function Modal({ onClose, title, children, width = 560 }) {
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.mbox, width }}>
        <div style={{ ...S.secTitle, fontSize: 16, marginBottom: 20 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

export function InfoBox({ color = C.blue, children }) {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}33`, borderRadius: 8, padding: '10px 14px', fontSize: 12, color, marginBottom: 14 }}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const c = pct > 85 ? C.red : pct > 60 ? C.yellow : (color || C.green);
  return (
    <div>
      <div style={{ background: '#0f1117', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, transition: 'width .3s' }} />
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4, textAlign: 'right' }}>%{pct}</div>
    </div>
  );
}

export function Toggle({ value, onChange }) {
  return (
    <div style={{ width: 36, height: 20, borderRadius: 10, background: value ? C.green : C.border, cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }} onClick={() => onChange(!value)}>
      <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: 7, background: C.white, top: 3, left: value ? 19 : 3, transition: 'left .2s' }} />
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: C.muted }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{text}</div>
    </div>
  );
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
      {tabs.map(([k, l]) => (
        <button key={k} style={{ ...S.btn(active === k ? C.accent : 'transparent'), border: `1px solid ${active === k ? C.accent : C.border}`, color: active === k ? '#000' : C.muted, fontSize: 12 }} onClick={() => onChange(k)}>{l}</button>
      ))}
    </div>
  );
}
