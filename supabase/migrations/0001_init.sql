-- ============================================================
-- Sistema de Matrícula — Schema (modelo atual)
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run
-- Cada CLIENTE tem seu próprio projeto Supabase (isolamento total).
-- ============================================================

-- ---------- Etapas (pipeline configurável) ----------
create table if not exists etapas (
  id text primary key,
  nome text not null,
  cor text not null default '#64748b',
  ordem int not null default 0
);

-- ---------- Cursos ----------
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nome text not null,
  carga_horaria int,
  valor_matricula text default '0,00',
  ativo boolean not null default true
);

-- ---------- Equipes ----------
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  supervisor text,
  ativo boolean not null default true,
  meta_mes int default 0
);

-- ---------- Colaboradores ----------
create table if not exists colaboradores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  setor text not null default 'Comercial',
  equipe text,
  ativo boolean not null default true,
  meta_mes int default 0
);

-- ---------- Matrículas ----------
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  nome_cliente text not null,
  email text,
  cpf text,
  telefone text,
  nome_curso text,
  turma_mes text,
  vendedor text,
  valor_matricula text default '0,00',
  mensalidade text default '0,00',
  valor_curso text default '0,00',
  data_matricula date default now(),
  drive_url text,
  etapa_id text references etapas(id),
  criado_em timestamptz not null default now()
);

-- ---------- Chamados (SAAD) ----------
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  departamento text not null,
  responsavel text,
  urgencia text not null default 'Baixa',
  data_solicitacao timestamptz not null default now(),
  data_limite date,
  nome_aluno text,
  descricao text not null,
  status text not null default 'Aberto'
);

-- ============================================================
-- RLS — por enquanto liberado (o login/permissões entram depois).
-- ⚠️ Antes de usar com dados reais, apertar estas regras.
-- ============================================================
alter table etapas enable row level security;
alter table courses enable row level security;
alter table teams enable row level security;
alter table colaboradores enable row level security;
alter table enrollments enable row level security;
alter table tickets enable row level security;

do $$
declare t text;
begin
  foreach t in array array['etapas','courses','teams','colaboradores','enrollments','tickets']
  loop
    execute format('create policy "acesso_demo" on %I for all using (true) with check (true);', t);
  end loop;
end $$;
