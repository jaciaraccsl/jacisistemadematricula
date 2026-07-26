# 🎓 Sistema de Matrículas

Sistema de gestão de matrículas para instituições de ensino (faculdades, cursos livres, escolas técnicas). Acompanha a jornada da matrícula do **cadastro** até a **liberação do aluno**, passando por Financeiro, Secretaria e Pedagógico — acabando com planilhas, arquivos soltos no WhatsApp e retrabalho entre setores.

> ⚠️ **Versão demo** — roda com **dados fictícios** (nenhum dado real de aluno). Ao atualizar a página, os dados voltam ao padrão. A persistência real entra com o Supabase (ver Roadmap).

---

## ✨ Funcionalidades

### Dashboard
- **6 KPIs**: total de matrículas, em andamento, concluídas, taxa de conclusão, valor de matrículas (R$) e mensalidades (R$)
- **Funil de matrículas** com conversão entre etapas e comparativo vs. mês anterior
- **Gráfico de área** (matrículas no mês vs. anterior) com hover interativo e projeção
- **Ranking de vendedores**, **origem dos leads**, **cursos mais vendidos**, **ocupação de turmas**
- **Filtro de período** (intervalo de datas)
- **Gráficos customizáveis** — cada usuário mostra/oculta os gráficos que quiser (preferência salva no navegador)

### Matrículas
- Visualização em **Lista** ou **Quadro (Kanban)**
- **Pop-up de detalhes** com todos os dados, documentos anexados e passo a passo do fluxo
- **Etapas configuráveis** — cada instituição cria/renomeia/remove as próprias etapas (recurso-chave para revenda)
- **Status editável** direto na linha/card (mover a matrícula entre etapas)
- Filtros por **curso, vendedor e etapa** + busca
- Contadores de **pendências por etapa**
- **Exportar** (CSV com escolha de campos)
- **Nova Matrícula** com formulário completo, upload de documentos e **validação de CPF, e-mail e telefone**

### Setores (Financeiro / Secretaria / Pedagógico)
- Ver **todas as matrículas** ou **só as do seu setor**
- **Financeiro**: status *Validado / Cadastro com pendência / Cancelado*
  - **Validado** → segue o fluxo automaticamente
  - **Pendência** → alerta vermelho em **todos os departamentos** (banner + sininho)
  - **Cancelado** → linha fica cinza e inativa
- **Anexar arquivos** (vão para o mesmo local dos documentos do Comercial)

### Outros módulos
- **SAAD** — chamados internos (abertos / aguardando / atrasados / resolvidos) com urgência e prazo
- **Equipe** — colaboradores por setor + equipes comerciais com metas
- **Configurações** — etapas do fluxo, cursos e identidade da instituição

---

## 🎨 Identidade visual
- Estilo **Liquid Glass** (vidro fosco translúcido, iOS-like) sobre fundo cinza degradê
- Paleta: **azul tiffany** (principal) · **azul escuro/navy** (estrutura) · **cinza claro** (base) · **roxo** (destaque)
- Cores/nome da instituição vêm de configuração — cada cliente com a própria marca

---

## 🧱 Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router) + React 19 |
| Linguagem | **TypeScript** |
| Estilo | **Tailwind CSS v4** |
| Ícones | **lucide-react** |
| Estado | Context API (`lib/store.tsx`) — dados de demo |
| Banco (planejado) | **Supabase** (Postgres) |

---

## 📁 Estrutura

```
app/
├── page.tsx            → Dashboard
├── matriculas/         → Lista/Quadro + modais
├── financeiro/         → Setor Financeiro (regras de status)
├── secretaria/         → Setor Secretaria
├── pedagogico/         → Setor Pedagógico
├── saad/               → Chamados internos
├── equipe/             → Colaboradores e equipes
├── configuracoes/      → Etapas, cursos, identidade
└── globals.css         → Vidro, aurora, animações
components/
├── Shell.tsx           → Layout (sidebar + topbar + alertas)
├── Sidebar.tsx         → Menu de navegação
├── matriculas.tsx      → Linha, Kanban, pop-up de detalhes
├── matricula-forms.tsx → Nova Matrícula + Exportar
├── dashboard.tsx       → Gráfico de área + listas de barras
└── DeptView.tsx        → Base das telas de setor
lib/
├── store.tsx           → "Central de dados" (Context)
├── types.ts            → Tipos do domínio
├── seed.ts             → Dados fictícios
├── ui.ts               → Utilitários (cores, dinheiro, datas)
└── config.ts           → Identidade do cliente
supabase/migrations/    → Schema do banco (para o passo do Supabase)
```

---

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```
Abra **http://localhost:3000**. Deixe o terminal aberto enquanto usa.

Build de produção:
```bash
npm run build && npm start
```

---

## ⚙️ Configuração por cliente
Copie `.env.local.example` para `.env.local`:
```
NEXT_PUBLIC_CLIENTE_NOME=Nome da Instituição
NEXT_PUBLIC_CLIENTE_COR=#0d9488
# Supabase (quando ligado):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 🗺️ Roadmap

- [x] Todas as telas (Dashboard, Matrículas, setores, SAAD, Equipe, Config)
- [x] Etapas configuráveis, Kanban, pop-up de detalhes
- [x] Nova Matrícula com validação · Exportar CSV
- [x] Regras do Financeiro (validado/pendência/cancelado) + alerta global
- [ ] **Ligar o Supabase** (salvar de verdade, multi-cliente)
- [ ] **Login e permissões** por setor
- [ ] Formulários de editar matrícula, abrir/responder chamado
- [ ] Metas vs. realizado, histórico/log da matrícula
- [ ] Integrações: Google Drive, WhatsApp, e-mail
- [ ] Arrastar-e-soltar no Kanban

---

## 📄 Observações
- Projeto próprio, reconstruído do zero com identidade e código próprios.
- Dados de demonstração são **fictícios**; nenhum dado real de aluno está incluído.
