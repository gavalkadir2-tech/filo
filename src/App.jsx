import { useState, useEffect } from 'react';
import { C, S } from './styles.js';
import { seed } from './utils/seed.js';

import Dashboard from './pages/Dashboard.jsx';
import AracYonetimi from './pages/AracYonetimi.jsx';
import BakimTakibi from './pages/BakimTakibi.jsx';
import YakitYonetimi from './pages/YakitYonetimi.jsx';
import OperatorYonetimi from './pages/OperatorYonetimi.jsx';
import EvrakTakibi from './pages/EvrakTakibi.jsx';
import HasarTakibi from './pages/HasarTakibi.jsx';
import YedekParca from './pages/YedekParca.jsx';
import IsEmirleri from './pages/IsEmirleri.jsx';
import ProjeYonetimi from './pages/ProjeYonetimi.jsx';
import Muhasebe from './pages/Muhasebe.jsx';
import AkaryakitIstasyonu from './pages/AkaryakitIstasyonu.jsx';
import MobilSaha from './pages/MobilSaha.jsx';
import BildirimMerkezi from './pages/BildirimMerkezi.jsx';
import KullaniciYetki from './pages/KullaniciYetki.jsx';
import ErpEntegrasyon from './pages/ErpEntegrasyon.jsx';
import YapayZeka from './pages/YapayZeka.jsx';

const PAGES = [
  { group: 'FAZ 1 — CORE', items: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', comp: Dashboard },
    { id: 'arac', label: 'Araç Yönetimi', icon: '🚜', comp: AracYonetimi },
    { id: 'bakim', label: 'Bakım Takibi', icon: '🔧', comp: BakimTakibi },
    { id: 'yakit', label: 'Yakıt Yönetimi', icon: '⛽', comp: YakitYonetimi },
    { id: 'operator', label: 'Operatörler', icon: '👷', comp: OperatorYonetimi },
    { id: 'evrak', label: 'Evrak Takibi', icon: '📋', comp: EvrakTakibi },
  ]},
  { group: 'FAZ 2 — GELİŞMİŞ', items: [
    { id: 'hasar', label: 'Hasar & Sigorta', icon: '🛡️', comp: HasarTakibi },
    { id: 'parca', label: 'Yedek Parça', icon: '🏭', comp: YedekParca },
    { id: 'isemri', label: 'İş Emirleri', icon: '📌', comp: IsEmirleri },
    { id: 'proje', label: 'Proje & Maliyet', icon: '🏗️', comp: ProjeYonetimi },
  ]},
  { group: 'FAZ 3 — ENTERPRISE', items: [
    { id: 'akaryakit', label: 'Akaryakıt İstasyonu', icon: '⛽🏭', comp: AkaryakitIstasyonu },
    { id: 'saha', label: 'Mobil Saha', icon: '📱', comp: MobilSaha },
    { id: 'bildirim', label: 'Bildirim Merkezi', icon: '🔔', comp: BildirimMerkezi },
    { id: 'yetki', label: 'Kullanıcı & Yetki', icon: '🔐', comp: KullaniciYetki },
    { id: 'erp', label: 'ERP Entegrasyon', icon: '🏢', comp: ErpEntegrasyon },
    { id: 'ai', label: 'Yapay Zeka', icon: '🤖', comp: YapayZeka },
  ]},
  { group: 'FAZ 4 — MUHASEBE', items: [
    { id: 'muhasebe', label: 'Muhasebe & Finans', icon: '💰', comp: Muhasebe },
  ]},
];

const ALL_PAGES = PAGES.flatMap(g => g.items);

export default function App() {
  useEffect(() => { seed(); }, []);

  const [active, setActive] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ALL_PAGES.some(p => p.id === hash) ? hash : 'dashboard';
  });

  useEffect(() => {
    window.location.hash = active;
  }, [active]);

  const current = ALL_PAGES.find(p => p.id === active) || ALL_PAGES[0];
  const CurrentComp = current.comp;

  return (
    <div style={S.app}>
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>🚜 FiloPro</div>
          <div style={S.logoSub}>İş Makinesi Yönetim Sistemi</div>
        </div>
        <nav style={{ flex: 1, paddingBottom: 16 }}>
          {PAGES.map(group => (
            <div key={group.group}>
              <div style={S.navGroup}>{group.group}</div>
              {group.items.map(item => (
                <div key={item.id} style={S.navItem(active === item.id)} onClick={() => setActive(item.id)}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.muted, flexShrink: 0 }}>
          Faz 1 + 2 + 3 + 4 — v4.0.0
        </div>
      </aside>

      <main style={S.main}>
        <header style={S.header}>
          <div style={S.headerTitle}>{current.icon} {current.label}</div>
        </header>
        <div style={S.content}>
          <CurrentComp />
        </div>
      </main>
    </div>
  );
}
