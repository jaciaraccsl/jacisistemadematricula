# Como rodar o MVP — Sistema de Matrícula

## Ver funcionando agora (com dados de exemplo)

No terminal, dentro da pasta `mvp-matricula`:

```
npm run dev
```

Abra no navegador: **http://localhost:3000**

Você vai ver o **Corredor da Matrícula** — um quadro com as colunas
Cadastro → Financeiro → Secretaria → Pedagógico → Concluída, e as matrículas
de exemplo passeando por elas. No topo, a marca do cliente e os números.

> Está mostrando **dados fictícios**. Nenhum dado real de aluno aqui.

---

## O que já está pronto

- ✅ Estrutura do app (Next.js + Tailwind)
- ✅ Conexão com Supabase preparada (liga com um "cartãozinho" de config)
- ✅ Banco de dados desenhado: `supabase/migrations/0001_init.sql`
- ✅ Dados de teste fictícios: `supabase/migrations/0002_seed.sql`
- ✅ Tela do Corredor da Matrícula

---

## Próximos passos (quando quiser ligar o Supabase real)

1. Criar conta no Supabase e um **projeto para o primeiro cliente**.
2. No painel: **SQL Editor** → colar o conteúdo de `0001_init.sql` → Run.
   Depois o `0002_seed.sql` (dados fictícios) → Run.
3. Copiar `.env.local.example` para **`.env.local`** e preencher:
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     (ficam em Project Settings > API)
   - `NEXT_PUBLIC_CLIENTE_NOME` e `NEXT_PUBLIC_CLIENTE_COR`
4. Trocar a função `carregarMatriculas()` em `app/page.tsx` por uma consulta
   real ao Supabase. (Me chama que eu faço essa parte com você.)

---

## Estrutura das pastas

```
mvp-matricula/
├── app/page.tsx              → a tela do corredor
├── lib/
│   ├── config.ts             → marca do cliente (lê o cartãozinho)
│   ├── types.ts              → tipos + etapas do corredor
│   ├── seed.ts               → dados de exemplo (fictícios)
│   └── supabase/client.ts    → conexão com o banco
├── supabase/migrations/      → o banco de dados (SQL)
└── .env.local.example        → modelo do cartãozinho por cliente
```
