import { createBrowserClient } from "@supabase/ssr";

// Cliente Supabase para o navegador. Lê o "cartãozinho" (variáveis de ambiente)
// daquele cliente. Se ainda não estiver configurado, retorna null e a tela
// usa os dados de exemplo.
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
