import { LS } from './storage.js';

export function seed() {
  if (localStorage.getItem('fp_v4')) return;

  LS.set('araclar', [
    { id: 1, ad: 'Komatsu PC200', tip: 'Ekskavatör', plaka: '35 AK 001', yil: 2019, durum: 'aktif', saat: 4820, yakit: 'Dizel', sigorta: '2025-08-15', muayene: '2025-06-30', opId: 1, projeId: 1, alisFiyat: 850000, notlar: '' },
    { id: 2, ad: 'Caterpillar 950H', tip: 'Yükleyici', plaka: '35 AK 002', yil: 2020, durum: 'aktif', saat: 3100, yakit: 'Dizel', sigorta: '2025-12-01', muayene: '2026-01-10', opId: 2, projeId: 1, alisFiyat: 1200000, notlar: '' },
    { id: 3, ad: 'Volvo A40G', tip: 'Damperli Kamyon', plaka: '35 AK 003', yil: 2018, durum: 'bakimda', saat: 9200, yakit: 'Dizel', sigorta: '2025-07-20', muayene: '2025-05-15', opId: null, projeId: 2, alisFiyat: 2100000, notlar: 'Hidrolik revizyonda' },
    { id: 4, ad: 'JCB 3CX', tip: 'Kazıcı Yükleyici', plaka: '35 AK 004', yil: 2021, durum: 'aktif', saat: 1800, yakit: 'Dizel', sigorta: '2026-03-10', muayene: '2026-03-10', opId: 3, projeId: 2, alisFiyat: 680000, notlar: '' },
    { id: 5, ad: 'Liebherr LTM 1070', tip: 'Mobil Vinç', plaka: '35 AK 005', yil: 2017, durum: 'aktif', saat: 6540, yakit: 'Dizel', sigorta: '2026-02-15', muayene: '2025-11-20', opId: null, projeId: null, alisFiyat: 3500000, notlar: '' },
  ]);

  LS.set('operatorler', [
    { id: 1, ad: 'Mehmet Yıldız', tel: '0532 111 2233', ehliyet: 'B, F', belge: '2026-04-01', durum: 'aktif', maas: 28000 },
    { id: 2, ad: 'Ali Demir', tel: '0535 444 5566', ehliyet: 'B, F, G', belge: '2025-11-15', durum: 'aktif', maas: 32000 },
    { id: 3, ad: 'Hasan Çelik', tel: '0541 777 8899', ehliyet: 'B', belge: '2026-08-20', durum: 'aktif', maas: 25000 },
    { id: 4, ad: 'Kadir Arslan', tel: '0545 321 4567', ehliyet: 'B, F, G, H', belge: '2026-12-01', durum: 'aktif', maas: 35000 },
  ]);

  LS.set('bakimlar', [
    { id: 1, aracId: 1, tip: 'Yağ Değişimi', tarih: '2026-04-10', maliyet: 850, durum: 'tamamlandi', notlar: '15W-40', sonrakiSaat: 5000 },
    { id: 2, aracId: 2, tip: 'Filtre Değişimi', tarih: '2026-04-20', maliyet: 320, durum: 'tamamlandi', notlar: '', sonrakiSaat: 3500 },
    { id: 3, aracId: 3, tip: 'Hidrolik Bakım', tarih: '2026-05-15', maliyet: 2200, durum: 'bekliyor', notlar: 'Acil', sonrakiSaat: null },
    { id: 4, aracId: 1, tip: '250 Saat Bakımı', tarih: '2026-07-01', maliyet: 0, durum: 'planli', notlar: '', sonrakiSaat: 5250 },
    { id: 5, aracId: 4, tip: 'Periyodik Bakım', tarih: '2026-05-05', maliyet: 1100, durum: 'tamamlandi', notlar: '500 saat bakımı', sonrakiSaat: 2000 },
    { id: 6, aracId: 5, tip: 'Yıllık Muayene Bakımı', tarih: '2026-05-28', maliyet: 3500, durum: 'tamamlandi', notlar: 'Vinç sertifika yenileme', sonrakiSaat: null },
  ]);

  LS.set('yakitlar', [
    { id: 1, aracId: 1, tarih: '2026-05-01', miktar: 180, fiyat: 42.5, toplam: 7650, depo: 'Saha Deposu' },
    { id: 2, aracId: 2, tarih: '2026-05-03', miktar: 120, fiyat: 42.5, toplam: 5100, depo: 'Saha Deposu' },
    { id: 3, aracId: 4, tarih: '2026-05-05', miktar: 95, fiyat: 42.5, toplam: 4037, depo: 'Merkez Depo' },
    { id: 4, aracId: 1, tarih: '2026-05-18', miktar: 200, fiyat: 43.0, toplam: 8600, depo: 'Saha Deposu' },
    { id: 5, aracId: 2, tarih: '2026-06-02', miktar: 140, fiyat: 43.5, toplam: 6090, depo: 'Saha Deposu' },
    { id: 6, aracId: 5, tarih: '2026-06-05', miktar: 250, fiyat: 43.5, toplam: 10875, depo: 'Merkez Depo' },
    { id: 7, aracId: 1, tarih: '2026-06-15', miktar: 175, fiyat: 44.0, toplam: 7700, depo: 'Saha Deposu' },
    { id: 8, aracId: 3, tarih: '2026-06-18', miktar: 310, fiyat: 44.0, toplam: 13640, depo: 'Merkez Depo' },
  ]);

  LS.set('hasarlar', [
    { id: 1, aracId: 1, tarih: '2026-03-12', aciklama: 'Kepçe kolu çarpmadan hasar gördü', maliyet: 4500, tazminat: 3800, durum: 'kapandi', sigortaNo: 'POL-2024-001' },
    { id: 2, aracId: 3, tarih: '2026-05-02', aciklama: 'Sağ ön lastik patlaması, jant hasarı', maliyet: 1200, tazminat: 0, durum: 'acik', sigortaNo: 'POL-2024-003' },
  ]);

  LS.set('parcalar', [
    { id: 1, ad: 'Yağ Filtresi', kod: 'YF-001', miktar: 8, minMiktar: 3, birim: 'Adet', fiyat: 85, kategori: 'Filtre' },
    { id: 2, ad: 'Hava Filtresi', kod: 'HF-002', miktar: 4, minMiktar: 2, birim: 'Adet', fiyat: 120, kategori: 'Filtre' },
    { id: 3, ad: 'Hidrolik Yağ 68', kod: 'HY-068', miktar: 60, minMiktar: 20, birim: 'Litre', fiyat: 45, kategori: 'Yağ' },
    { id: 4, ad: 'V-Kayışı', kod: 'VK-010', miktar: 2, minMiktar: 4, birim: 'Adet', fiyat: 220, kategori: 'Aktarma' },
    { id: 5, ad: 'Motor Yağı 15W-40', kod: 'MY-154', miktar: 40, minMiktar: 20, birim: 'Litre', fiyat: 38, kategori: 'Yağ' },
    { id: 6, ad: 'Lastik 23.5-25', kod: 'LT-235', miktar: 2, minMiktar: 2, birim: 'Adet', fiyat: 4500, kategori: 'Lastik' },
  ]);

  LS.set('isemirleri', [
    { id: 1, aracId: 1, opId: 1, baslik: 'Günlük kontrol ve yağlama', aciklama: 'Tüm yağ seviyelerini kontrol et, gres yağlama yap', tarih: '2026-06-20', bitis: '2026-06-20', oncelik: 'normal', durum: 'tamamlandi' },
    { id: 2, aracId: 3, opId: null, baslik: 'Hidrolik sistem revizyonu', aciklama: 'Hidrolik pompa ve hortumlar kontrol edilecek', tarih: '2026-06-15', bitis: '2026-06-30', oncelik: 'kritik', durum: 'devamediyor' },
    { id: 3, aracId: 2, opId: 2, baslik: 'Lastik rotasyon', aciklama: '4 lastik rotasyon yapılacak', tarih: '2026-06-25', bitis: '2026-06-25', oncelik: 'dusuk', durum: 'acik' },
  ]);

  LS.set('projeler', [
    { id: 1, ad: 'Manisa Yol Projesi', musteri: 'Manisa Büyükşehir Bel.', baslangic: '2026-03-01', bitis: '2026-09-30', durum: 'aktif', butce: 2500000 },
    { id: 2, ad: 'Akhisar Sanayi Yapımı', musteri: 'Özel', baslangic: '2026-05-01', bitis: '2026-12-31', durum: 'aktif', butce: 1800000 },
    { id: 3, ad: 'İzmir Liman Genişletme', musteri: 'İzmir Büyükşehir Bel.', baslangic: '2025-10-01', bitis: '2026-04-30', durum: 'tamamlandi', butce: 950000 },
  ]);

  // ── Muhasebe seed ──────────────────────────────────────────────────────────
  LS.set('hesaplar', [
    { id: 1, kod: '100', ad: 'Kasa', tur: 'aktif', bakiye: 125000, para: 'TRY' },
    { id: 2, kod: '102', ad: 'Ziraat Bankası Vadesiz', tur: 'aktif', bakiye: 840000, para: 'TRY' },
    { id: 3, kod: '103', ad: 'İş Bankası Vadeli', tur: 'aktif', bakiye: 500000, para: 'TRY' },
    { id: 4, kod: '120', ad: 'Müşteri Alacakları', tur: 'aktif', bakiye: 380000, para: 'TRY' },
    { id: 5, kod: '320', ad: 'Satıcı Borçları', tur: 'pasif', bakiye: 95000, para: 'TRY' },
    { id: 6, kod: '360', ad: 'Ödenecek Vergiler', tur: 'pasif', bakiye: 42000, para: 'TRY' },
  ]);

  LS.set('gelirGider', [
    { id: 1, tur: 'gelir', kategori: 'Hizmet Bedeli', aciklama: 'Manisa Yol Projesi — Mayıs iş bedeli', tutar: 450000, kdv: 81000, tarih: '2026-05-31', hesapId: 2, projeId: 1, belgeNo: 'GEL-2026-051' },
    { id: 2, tur: 'gelir', kategori: 'Hizmet Bedeli', aciklama: 'Akhisar Sanayi — Mayıs iş bedeli', tutar: 280000, kdv: 50400, tarih: '2026-05-31', hesapId: 2, projeId: 2, belgeNo: 'GEL-2026-052' },
    { id: 3, tur: 'gider', kategori: 'Yakıt', aciklama: 'Mayıs yakıt alımı', tutar: 41440, kdv: 7459, tarih: '2026-05-31', hesapId: 1, projeId: null, belgeNo: 'GID-2026-051' },
    { id: 4, tur: 'gider', kategori: 'Personel', aciklama: 'Mayıs operatör maaşları', tutar: 120000, kdv: 0, tarih: '2026-05-31', hesapId: 2, projeId: null, belgeNo: 'GID-2026-052' },
    { id: 5, tur: 'gider', kategori: 'Bakım-Onarım', aciklama: 'Mayıs bakım giderleri', tutar: 4470, kdv: 804, tarih: '2026-05-31', hesapId: 1, projeId: null, belgeNo: 'GID-2026-053' },
    { id: 6, tur: 'gelir', kategori: 'Hizmet Bedeli', aciklama: 'Manisa Yol Projesi — Haziran iş bedeli', tutar: 520000, kdv: 93600, tarih: '2026-06-20', hesapId: 2, projeId: 1, belgeNo: 'GEL-2026-061' },
    { id: 7, tur: 'gider', kategori: 'Sigorta', aciklama: 'Yıllık filo sigortası', tutar: 85000, kdv: 0, tarih: '2026-06-01', hesapId: 2, projeId: null, belgeNo: 'GID-2026-061' },
    { id: 8, tur: 'gider', kategori: 'Kira', aciklama: 'Şantiye sahası kira bedeli', tutar: 25000, kdv: 4500, tarih: '2026-06-01', hesapId: 2, projeId: null, belgeNo: 'GID-2026-062' },
    { id: 9, tur: 'gider', kategori: 'Yakıt', aciklama: 'Haziran yakıt alımı', tutar: 46805, kdv: 8424, tarih: '2026-06-18', hesapId: 1, projeId: null, belgeNo: 'GID-2026-063' },
    { id: 10, tur: 'gelir', kategori: 'Kira Geliri', aciklama: 'JCB kiralama — Özel müşteri', tutar: 45000, kdv: 8100, tarih: '2026-06-10', hesapId: 1, projeId: null, belgeNo: 'GEL-2026-062' },
  ]);

  LS.set('faturalar', [
    { id: 1, tur: 'kesilen', no: 'F-2026-051', musteri: 'Manisa Büyükşehir Bel.', tarih: '2026-05-31', vadeTarih: '2026-06-30', tutar: 450000, kdv: 81000, toplam: 531000, durum: 'odendi', projeId: 1, aciklama: 'Mayıs ayı iş bedeli' },
    { id: 2, tur: 'kesilen', no: 'F-2026-052', musteri: 'Özel Müşteri A.Ş.', tarih: '2026-05-31', vadeTarih: '2026-06-15', tutar: 280000, kdv: 50400, toplam: 330400, durum: 'odendi', projeId: 2, aciklama: 'Akhisar iş bedeli' },
    { id: 3, tur: 'kesilen', no: 'F-2026-061', musteri: 'Manisa Büyükşehir Bel.', tarih: '2026-06-20', vadeTarih: '2026-07-20', tutar: 520000, kdv: 93600, toplam: 613600, durum: 'bekliyor', projeId: 1, aciklama: 'Haziran iş bedeli' },
    { id: 4, tur: 'alinan', no: 'AF-2026-051', musteri: 'Petrol Ofisi A.Ş.', tarih: '2026-05-31', vadeTarih: '2026-06-10', tutar: 41440, kdv: 7459, toplam: 48899, durum: 'odendi', projeId: null, aciklama: 'Mayıs yakıt' },
    { id: 5, tur: 'alinan', no: 'AF-2026-061', musteri: 'Makina Servisi Ltd.', tarih: '2026-06-15', vadeTarih: '2026-07-15', tutar: 2200, kdv: 396, toplam: 2596, durum: 'bekliyor', projeId: null, aciklama: 'Hidrolik bakım' },
  ]);

  LS.set('kasaHareketleri', [
    { id: 1, hesapId: 1, tur: 'giris', aciklama: 'Fatura tahsilatı F-2026-051', tutar: 531000, tarih: '2026-06-02', belgeNo: 'KH-001' },
    { id: 2, hesapId: 2, tur: 'giris', aciklama: 'Fatura tahsilatı F-2026-052', tutar: 330400, tarih: '2026-06-05', belgeNo: 'KH-002' },
    { id: 3, hesapId: 1, tur: 'cikis', aciklama: 'Yakıt ödemesi AF-2026-051', tutar: 48899, tarih: '2026-06-08', belgeNo: 'KH-003' },
    { id: 4, hesapId: 2, tur: 'cikis', aciklama: 'Personel maaşları Mayıs', tutar: 120000, tarih: '2026-06-10', belgeNo: 'KH-004' },
    { id: 5, hesapId: 2, tur: 'cikis', aciklama: 'Sigorta ödemesi', tutar: 85000, tarih: '2026-06-12', belgeNo: 'KH-005' },
  ]);

  // Akaryakıt
  LS.set('pompalar', [
    { id: 1, ad: 'Pompa-1 (Dizel)', aktif: true, toplamLt: 12450, bugunLt: 340 },
    { id: 2, ad: 'Pompa-2 (Dizel)', aktif: true, toplamLt: 8920, bugunLt: 180 },
  ]);
  LS.set('yakitLimitler', []);
  LS.set('otomatikIkmaller', [
    { id: 1, aracId: 1, tarih: '2026-06-29', miktar: 180, pompId: 1, kart: 'KRT-001', onaylı: true },
    { id: 2, aracId: 2, tarih: '2026-06-29', miktar: 120, pompId: 1, kart: 'KRT-002', onaylı: true },
  ]);

  // Saha
  LS.set('sahaCalisma', [
    { id: 1, aracId: 1, opId: 1, tarih: '2026-06-29', baslangic: '07:30', bitis: '17:30', saat: 10, onaylı: true, notlar: 'Normal çalışma' },
    { id: 2, aracId: 2, opId: 2, tarih: '2026-06-29', baslangic: '08:00', bitis: '16:00', saat: 8, onaylı: false, notlar: '' },
  ]);
  LS.set('sahaAriza', [
    { id: 1, aracId: 3, opId: null, tarih: '2026-06-28', aciklama: 'Hidrolik yağ sızıntısı tespit edildi', oncelik: 'kritik', durum: 'acik' },
  ]);

  // Bildirim tercihleri
  LS.set('bildirimTercih', [
    { id: 1, tur: 'bakim', kanal: 'email', aktif: true, onceGun: 7 },
    { id: 2, tur: 'belge', kanal: 'sms', aktif: true, onceGun: 30 },
    { id: 3, tur: 'stok', kanal: 'sistem', aktif: true, onceGun: 0 },
    { id: 4, tur: 'yakit', kanal: 'email', aktif: false, onceGun: 0 },
  ]);

  // Kullanıcılar
  LS.set('kullanicilar', [
    { id: 1, ad: 'Kadir Bey', email: 'kadir@firma.com', rol: 'admin', firma: 'FiloPro A.Ş.', aktif: true, son: '2026-06-29 09:15', twofa: true },
    { id: 2, ad: 'Muhasebe Hanım', email: 'muhasebe@firma.com', rol: 'muhasebe', firma: 'FiloPro A.Ş.', aktif: true, son: '2026-06-28 14:30', twofa: false },
    { id: 3, ad: 'Saha Şefi', email: 'sef@firma.com', rol: 'sef', firma: 'FiloPro A.Ş.', aktif: true, son: '2026-06-29 07:45', twofa: false },
    { id: 4, ad: 'Mehmet Op.', email: 'mehmet@firma.com', rol: 'operator', firma: 'FiloPro A.Ş.', aktif: true, son: '2026-06-29 08:00', twofa: false },
  ]);
  LS.set('islemLoglari', [
    { id: 1, kullanici: 'Kadir Bey', islem: 'Araç eklendi', detay: 'Liebherr LTM 1070 sisteme eklendi', tarih: '2026-06-25 09:10' },
    { id: 2, kullanici: 'Muhasebe Hanım', detay: 'Haziran gelir-gider raporu görüntülendi', islem: 'Rapor görüntülendi', tarih: '2026-06-28 14:32' },
    { id: 3, kullanici: 'Saha Şefi', islem: 'Bakım onaylandı', detay: 'JCB periyodik bakım tamamlandı', tarih: '2026-06-29 08:20' },
  ]);

  // ERP
  LS.set('erpBaglantilar', [
    { id: 1, sistem: 'Logo Tiger', aktif: false, son: null, url: '', apiKey: '' },
    { id: 2, sistem: 'Luca', aktif: false, son: null, url: '', apiKey: '' },
    { id: 3, sistem: 'Mikro', aktif: false, son: null, url: '', apiKey: '' },
    { id: 4, sistem: 'SAP', aktif: false, son: null, url: '', apiKey: '' },
  ]);
  LS.set('erpAktarimlar', []);

  localStorage.setItem('fp_v4', '1');
}
