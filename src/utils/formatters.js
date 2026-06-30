export const today = () => new Date().toISOString().slice(0, 10);

export const thisMonth = () => new Date().toISOString().slice(0, 7);

export const daysLeft = (d) =>
  d ? Math.ceil((new Date(d) - new Date()) / 86400000) : 9999;

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('tr-TR') : '—';

export const fmtMonth = (ym) => {
  if (!ym) return '—';
  const [y, m] = ym.split('-');
  return new Date(y, m - 1).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
};

export const fmtTL = (n) => (+n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ₺';

export const fmtTLFull = (n) => (+n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';

export const fmtNum = (n, suffix = '') => (+n || 0).toLocaleString('tr-TR') + (suffix ? ' ' + suffix : '');

export const pct = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0;

export const months = () => {
  const arr = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    arr.push(d.toISOString().slice(0, 7));
  }
  return arr;
};
