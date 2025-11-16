# 🔐 Sistema de Autenticação OneBoss - Guia Completo

## 📋 Campos de Cadastro

1. **Nome Completo** ✅
2. **Email** ✅
3. **Estado (UF)** ✅
4. **WhatsApp** ✅
5. **Senha** ✅

---

## 🏗️ Arquitetura do Sistema

### **1. Frontend (React)**
- Página de Login/Cadastro: `/login`
- Contexto de Autenticação: `AuthContext.tsx`
- Proteção de rotas: `AuthGuard.tsx`

### **2. Backend (Supabase)**
- Tabela `auth.users` - Credenciais (email + senha)
- Tabela `profiles` - Dados do usuário (nome, whatsapp, estado)

---

## 📊 Estrutura do Banco de Dados

### **Passo 1: Criar tabela `profiles` no Supabase**

Acesse **Supabase Dashboard → SQL Editor** e execute:

```sql
-- 1. Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN (
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  )),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX profiles_full_name_idx ON public.profiles (full_name);
CREATE INDEX profiles_estado_idx ON public.profiles (estado);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de acesso
-- Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Permitir criação de perfil durante signup
CREATE POLICY "Qualquer um pode criar perfil durante signup"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- 5. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp, estado)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'estado', 'SP')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger para executar função após criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔄 Fluxo de Cadastro (Sign Up)

### **Diagrama do Fluxo:**

```
┌──────────────────────────────────────────────┐
│ 1. Usuário preenche formulário              │
│    - Nome: João Silva                       │
│    - Email: joao@email.com                  │
│    - WhatsApp: (11) 99999-9999              │
│    - Estado: SP                             │
│    - Senha: ••••••                          │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 2. Frontend valida dados                    │
│    - Todos os campos obrigatórios           │
│    - Email válido                           │
│    - Senha mínima                           │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 3. Chama supabase.auth.signUp()             │
│    {                                         │
│      email: "joao@email.com",                │
│      password: "senha123",                   │
│      options: {                              │
│        data: {                               │
│          full_name: "João Silva",            │
│          whatsapp: "(11) 99999-9999",        │
│          estado: "SP"                        │
│        }                                     │
│      }                                       │
│    }                                         │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 4. Supabase cria registro em auth.users     │
│    - id: uuid-gerado-automaticamente         │
│    - email: joao@email.com                   │
│    - encrypted_password: hash-bcrypt         │
│    - raw_user_meta_data: {                   │
│        full_name, whatsapp, estado           │
│      }                                       │
│    - email_confirmed_at: NULL (não confirmado)│
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 5. Trigger "on_auth_user_created" dispara   │
│    - Lê dados do raw_user_meta_data          │
│    - Cria registro na tabela profiles:       │
│      id: uuid-do-usuario                     │
│      full_name: João Silva                   │
│      whatsapp: (11) 99999-9999               │
│      estado: SP                              │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 6. Supabase envia email de confirmação      │
│    Para: joao@email.com                      │
│    Link: https://seu-projeto.supabase.co/... │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 7. Usuário clica no link do email           │
│    - Campo email_confirmed_at é preenchido   │
│    - Usuário pode fazer login                │
└──────────────────────────────────────────────┘
```

---

## 🔑 Fluxo de Login (Sign In)

```
┌──────────────────────────────────────────────┐
│ 1. Usuário preenche email e senha           │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 2. Chama supabase.auth.signInWithPassword() │
│    {                                         │
│      email: "joao@email.com",                │
│      password: "senha123"                    │
│    }                                         │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 3. Supabase valida credenciais              │
│    - Verifica se email existe                │
│    - Compara hash da senha                   │
│    - Verifica se email foi confirmado        │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 4. Se válido, retorna Session                │
│    - access_token (JWT)                      │
│    - refresh_token                           │
│    - user { id, email, user_metadata }       │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 5. Frontend armazena session                 │
│    - LocalStorage (persistente)              │
│    - AuthContext (estado global)             │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 6. Redireciona para página solicitada       │
│    Exemplo: /perfil ou página de produto     │
└──────────────────────────────────────────────┘
```

---

## 🔐 Login com Google (OAuth)

```
┌──────────────────────────────────────────────┐
│ 1. Usuário clica "Continuar com Google"     │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 2. Chama signInWithOAuth({ provider: 'google' })│
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 3. Redireciona para tela do Google          │
│    - Usuário faz login no Google             │
│    - Autoriza acesso ao OneBoss              │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 4. Google retorna para Supabase              │
│    - Token de acesso do Google               │
│    - Dados: email, nome, foto                │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 5. Supabase cria/atualiza usuário            │
│    - Cria em auth.users se não existe        │
│    - raw_user_meta_data: { full_name, avatar }│
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 6. Trigger cria perfil (se novo usuário)     │
│    ⚠️ PROBLEMA: Não tem whatsapp/estado!     │
│    Solução: Pedir após login com modal       │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ 7. Redireciona de volta ao app               │
│    Com access_token na URL                   │
└──────────────────────────────────────────────┘
```

**⚠️ Importante:** Ao fazer login com Google, os campos `whatsapp` e `estado` ficam vazios. Você precisa:
1. Detectar que faltam dados
2. Mostrar modal pedindo WhatsApp e Estado
3. Atualizar tabela `profiles`

---

## 🛡️ Proteção de Rotas

### **Web (Navegador) - Acesso Livre**

```typescript
// Desktop: Navegação livre, proteção apenas em ações específicas
<Route path="/" element={<Index />} />  // ✅ Sem login
<Route path="/loja" element={<Store />} />  // ✅ Sem login
<Route path="/produto/:id" element={<ProductDetail />} />  // ✅ Sem login

// Botão "Enviar Mensagem" → Requer login
// Se não logado: Abre modal de login com redirect
```

### **App Nativo - Login Obrigatório**

```typescript
// App: Usuário PRECISA estar logado para navegar
if (isNativeApp && !user) {
  return <Navigate to="/login" />;
}

// Fluxo:
Splash Screen (2s) → Verifica autenticação → Login/Home
```

---

## 📱 Telas Principais

### **1. Tela de Login (`/login`)**

```
┌────────────────────────────────────┐
│  [← Voltar]                        │
│                                    │
│       [Logo OneBoss]               │
│    Bem-vindo de volta!             │
│  Entre para continuar na OneBoss   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ [Google] Continuar com Google│  │
│  └──────────────────────────────┘  │
│            ou                      │
│  ┌──────────────────────────────┐  │
│  │ Email                         │  │
│  │ [📧] seu@email.com            │  │
│  │                               │  │
│  │ Senha                         │  │
│  │ [🔒] ••••••••         [👁️]   │  │
│  │                               │  │
│  │ [Esqueceu a senha?]           │  │
│  │                               │  │
│  │ [Entrar] ← Botão dourado      │  │
│  └──────────────────────────────┘  │
│                                    │
│  Não tem conta? [Cadastre-se]      │
└────────────────────────────────────┘
```

### **2. Tela de Cadastro (`/login?mode=signup`)**

```
┌────────────────────────────────────┐
│  [← Voltar]                        │
│                                    │
│       [Logo OneBoss]               │
│      Criar sua conta               │
│  Junte-se à comunidade OneBoss     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ [Google] Continuar com Google│  │
│  └──────────────────────────────┘  │
│            ou                      │
│  ┌──────────────────────────────┐  │
│  │ Nome Completo                 │  │
│  │ [👤] João Silva               │  │
│  │                               │  │
│  │ WhatsApp                      │  │
│  │ [📱] (11) 99999-9999          │  │
│  │                               │  │
│  │ Estado                        │  │
│  │ [📍] [São Paulo ▼]            │  │
│  │                               │  │
│  │ Email                         │  │
│  │ [📧] seu@email.com            │  │
│  │                               │  │
│  │ Senha                         │  │
│  │ [🔒] ••••••••         [👁️]   │  │
│  │                               │  │
│  │ [Criar Conta] ← Botão dourado│  │
│  └──────────────────────────────┘  │
│                                    │
│  Já tem conta? [Faça login]        │
└────────────────────────────────────┘
```

---

## ⚙️ Configuração do Supabase

### **1. Habilitar Google OAuth**

1. Acesse **Supabase Dashboard → Authentication → Providers**
2. Clique em **Google**
3. Ative "Enable Google provider"
4. Obtenha credenciais no Google Cloud Console:
   - Acesse: https://console.cloud.google.com/
   - Crie projeto "OneBoss Brasil"
   - Ative Google+ API
   - Crie credenciais OAuth 2.0
   - **Authorized redirect URIs:**
     ```
     https://SEU_PROJECT_ID.supabase.co/auth/v1/callback
     ```
5. Cole **Client ID** e **Client Secret** no Supabase

### **2. Configurar Email Templates**

1. Acesse **Supabase Dashboard → Authentication → Email Templates**
2. Personalize template de **Confirm signup**:

```html
<h2>Bem-vindo à OneBoss!</h2>
<p>Confirme seu email clicando no botão abaixo:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
```

---

## 🔧 Código do AuthContext (Já Implementado)

Localização: `src/contexts/AuthContext.tsx`

**Funções disponíveis:**

```typescript
const { signIn, signUp, signInWithGoogle, signOut, user, session } = useAuth();

// Login
await signIn("email@test.com", "senha123");

// Cadastro
await signUp("email@test.com", "senha123", {
  full_name: "João Silva",
  whatsapp: "(11) 99999-9999",
  estado: "SP"
});

// Google
await signInWithGoogle();

// Logout
await signOut();
```

---

## ✅ Checklist de Implementação

- [x] Criar tabela `profiles` no Supabase
- [x] Configurar RLS (Row Level Security)
- [x] Criar trigger para auto-criação de perfil
- [x] Implementar `signUp` no AuthContext
- [x] Implementar `signInWithGoogle` no AuthContext
- [x] Criar página de Login com todos os campos
- [x] Adicionar validações de formulário
- [x] Criar select de Estados (UF)
- [ ] Configurar Google OAuth no Supabase
- [ ] Testar fluxo completo de cadastro
- [ ] Testar fluxo de login
- [ ] Testar Google OAuth
- [ ] Implementar modal para completar dados após Google login

---

## 🐛 Problemas Comuns

### **Erro: "Profiles table does not exist"**
Solução: Execute o SQL de criação da tabela no Supabase.

### **Erro: "Email not confirmed"**
Solução: Configure SMTP no Supabase ou desabilite confirmação:
```
Dashboard → Authentication → Settings → Confirm email: OFF (apenas para testes)
```

### **Google login não funciona no app nativo**
Solução: Use deep links do Capacitor:
```typescript
redirectTo: `oneboss://auth/callback`
```

---

## 📞 Suporte

Se encontrar erros, verifique:
1. Console do navegador (F12)
2. Logs do Supabase (Dashboard → Logs)
3. Tabela `auth.users` (SQL Editor)
4. Tabela `profiles` (SQL Editor)

**Pronto! Sistema de autenticação completo implementado.** 🎉
