// Utilitários visuais compartilhados

const AVATAR_CORES = ["#0d9488", "#0e7490", "#1e3a8a", "#0891b2", "#14b8a6", "#2563eb"];

export function corDoNome(nome: string) {
  const i = nome.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_CORES[i % AVATAR_CORES.length];
}

export function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

// cor com transparência a partir do hex
export function soft(hex: string, a = 0.15) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export function dataBR(iso: string) {
  if (!iso) return "";
  return iso.split("-").reverse().join("/");
}

// "6.000,00" -> 6000
export function parseMoney(s: string) {
  return parseFloat((s || "0").replace(/\./g, "").replace(",", ".")) || 0;
}

// 6000 -> "6.000,00"
export function fmtMoney(n: number) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
