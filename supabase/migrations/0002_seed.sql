-- ============================================================
-- Dados FICTÍCIOS de teste (rode depois do 0001_init.sql)
-- ============================================================

insert into etapas (id, nome, cor, ordem) values
  ('cadastro','Cadastro','#64748b',1),
  ('financeiro','Financeiro','#f59e0b',2),
  ('secretaria','Secretaria','#0ea5e9',3),
  ('pedagogico','Pedagógico','#8b5cf6',4),
  ('concluida','Concluída','#10b981',5)
on conflict (id) do nothing;

insert into courses (codigo, nome, carga_horaria, valor_matricula) values
  ('PRF01','Pós — Gestão Escolar',360,'300,00'),
  ('LIV02','Curso Livre — Marketing Digital',80,'150,00'),
  ('PRF03','Pós — Neuroeducação',400,'350,00');

insert into teams (nome, supervisor, meta_mes) values
  ('Equipe A','Marina Alves',40),
  ('Equipe B','Rafael Souza',35);

insert into colaboradores (nome, email, setor, equipe, meta_mes) values
  ('Marina Alves','marina@exemplo.com','Comercial','Equipe A',20),
  ('Rafael Souza','rafael@exemplo.com','Comercial','Equipe B',18),
  ('Fabíola Costa','fabiola@exemplo.com','Secretaria',null,0),
  ('Paulo Reis','paulo@exemplo.com','Financeiro',null,0);

insert into enrollments (nome_cliente, email, cpf, telefone, nome_curso, turma_mes, vendedor, valor_matricula, mensalidade, valor_curso, data_matricula, etapa_id) values
  ('Ana Souza','ana@exemplo.com','111.111.111-11','(11) 90000-0001','Pós — Gestão Escolar','2026-02','Marina (equipe A)','300,00','500,00','6.000,00','2026-07-08','cadastro'),
  ('Bruno Lima','bruno@exemplo.com','222.222.222-22','(11) 90000-0002','Pós — Gestão Escolar','2026-02','Marina (equipe A)','300,00','500,00','6.000,00','2026-07-07','financeiro'),
  ('Carla Dias','carla@exemplo.com','333.333.333-33','(11) 90000-0003','Curso Livre — Marketing Digital','2026-03','Rafael (equipe B)','150,00','100,00','1.200,00','2026-07-06','concluida');

insert into tickets (departamento, responsavel, urgencia, data_limite, nome_aluno, descricao, status) values
  ('Secretaria','Fabíola Costa','Média','2026-07-11','Ana Souza','Rematrícula da aluna no 1º termo.','Aberto'),
  ('Financeiro','Paulo Reis','Baixa',null,'Bruno Lima','Confirmar recebimento do PIX.','Resolvido');
