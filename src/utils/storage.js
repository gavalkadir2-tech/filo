// localStorage helpers
export const LS = {
  get: (k, fallback = []) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
  getObj: (k, fallback = {}) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
};

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
