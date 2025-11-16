# 🔐 Configuração de Autenticação - OneBoss

## 📋 Passo a Passo para Configurar o Supabase

### 1️⃣ Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **gytzdhfbmmrsanrhquut**

---

### 2️⃣ Executar o SQL de Configuração

1. No menu lateral, clique em **SQL Editor**
2. Clique em **+ New Query**
3. Abra o arquivo `supabase-setup.sql` (na raiz do projeto)
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor
6. Clique em **Run** (ou pressione `Ctrl + Enter`)

✅ Você verá a mensagem: **Success. No rows returned**

---

### 3️⃣ Verificar se tudo foi criado

Execute esta query no SQL Editor para verificar:

\`\`\`sql
-- Verificar tabela profiles
SELECT * FROM information_schema.tables WHERE table_name = 'profiles';

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%profile%' OR tgname LIKE '%user%';
\`\`\`

---

### 4️⃣ Configurar E-mail de Confirmação (Opcional)

Por padrão, o Supabase exige confirmação de e-mail. Para facilitar testes:

1. Vá em **Authentication** > **Providers** > **Email**
2. Role até **Email Confirmations**
3. **Desmarque** "Enable email confirmations" (apenas para desenvolvimento)
4. Clique em **Save**

⚠️ **IMPORTANTE:** Re-ative isso antes de publicar em produção!

---

## ✅ O que foi configurado?

### 📊 Tabela `profiles`

| Campo       | Tipo      | Descrição                |
|-------------|-----------|--------------------------|
| id          | UUID      | ID do usuário (FK)       |
| full_name   | TEXT      | Nome completo            |
| whatsapp    | TEXT      | WhatsApp (opcional)      |
| estado      | TEXT      | Estado (UF)              |
| created_at  | TIMESTAMP | Data de criação          |
| updated_at  | TIMESTAMP | Data de atualização      |

### 🔒 Políticas RLS (Row Level Security)

- ✅ Usuários podem **ver** apenas seu próprio perfil
- ✅ Usuários podem **atualizar** apenas seu próprio perfil
- ✅ Usuários podem **inserir** apenas seu próprio perfil

### ⚙️ Triggers Automáticos

- ✅ **Auto-criar perfil** quando usuário se registra
- ✅ **Auto-atualizar** `updated_at` quando perfil é editado

---

## 🧪 Testar a Autenticação

### Registro de Novo Usuário

1. Acesse: `http://localhost:8081/register`
2. Preencha os campos:
   - Nome: Teste OneBoss
   - E-mail: teste@oneboss.com
   - WhatsApp: (11) 99999-9999
   - Estado: SP
   - Senha: teste123
3. Clique em **CRIAR CONTA**
4. ✅ Deve aparecer: "Conta criada com sucesso!"

### Login

1. Acesse: `http://localhost:8081/login`
2. Clique em **ACESSAR**
3. Preencha:
   - E-mail: teste@oneboss.com
   - Senha: teste123
4. Clique em **ACESSAR**
5. ✅ Deve aparecer: "Login realizado com sucesso!"

---

## 🔍 Verificar Dados no Supabase

### Ver usuários criados:

1. Vá em **Authentication** > **Users**
2. Você verá todos os usuários registrados

### Ver perfis criados:

1. Vá em **Table Editor**
2. Selecione a tabela **profiles**
3. Você verá os dados: nome, whatsapp, estado

---

## 🚨 Troubleshooting

### Erro: "relation 'profiles' does not exist"

**Solução:** Execute novamente o `supabase-setup.sql`

### Erro: "new row violates row-level security policy"

**Solução:** As políticas RLS não foram criadas. Execute:

\`\`\`sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
\`\`\`

### Usuário não recebe e-mail de confirmação

**Solução:** Desative confirmação de e-mail (passo 4) ou configure SMTP

---

## 📝 Próximos Passos

Após configurar o Supabase:

1. ✅ Testar registro e login
2. ✅ Fazer build do app Android
3. ✅ Testar no celular
4. ✅ Publicar na Play Store

---

## 🔗 Links Úteis

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Documentação Auth](https://supabase.com/docs/guides/auth)
- [Documentação RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

**Data de criação:** $(date)
**Projeto:** OneBoss
**Supabase Project:** gytzdhfbmmrsanrhquut
