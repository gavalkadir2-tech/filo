import { useState } from 'react';
import { TabBar } from '../components/UI.jsx';
import GelirGider from './muhasebe/GelirGider.jsx';
import Faturalar from './muhasebe/Faturalar.jsx';
import KasaBanka from './muhasebe/KasaBanka.jsx';
import FinansalRaporlar from './muhasebe/FinansalRaporlar.jsx';

export default function Muhasebe() {
  const [tab, setTab] = useState('raporlar');

  const tabs = [
    ['raporlar', '📊 Finansal Raporlar'],
    ['gelirgider', '💰 Gelir/Gider'],
    ['fatura', '🧾 Faturalar'],
    ['kasa', '💳 Kasa & Banka'],
  ];

  return (
    <div>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'raporlar' && <FinansalRaporlar />}
      {tab === 'gelirgider' && <GelirGider />}
      {tab === 'fatura' && <Faturalar />}
      {tab === 'kasa' && <KasaBanka />}
    </div>
  );
}
