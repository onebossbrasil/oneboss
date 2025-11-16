# 🔍 Análise da Estrutura do Supabase - OneBoss

## ✅ DESCOBERTAS IMPORTANTES

### 1. **Tabela `profiles` JÁ EXISTE!** 🎉

**Estrutura atual:**
```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT
)
```

**Políticas RLS já configuradas:**
- ✅ Seleção restrita ao próprio perfil
- ✅ Inserção restrita ao próprio perfil
- ✅ Atualização restrita ao próprio perfil

**⚠️ PROBLEMA:** A tabela só tem 2 campos (id, email). **Faltam os campos:**
- `full_name` (nome completo)
- `whatsapp` (WhatsApp)
- `estado` (UF)
- `created_at` (data criação)
- `updated_at` (data atualização)

---

### 2. **Tabela `auth.users` - Estrutura Completa**

A tabela de autenticação já existe e contém:
- ✅ `id` (UUID)
- ✅ `email` (varchar 255)
- ✅ `encrypted_password` (varchar 255)
- ✅ `email_confirmed_at` (timestamp)
- ✅ `raw_user_meta_data` (JSONB) ← **Podemos usar para armazenar dados temporários**
- ✅ `created_at`, `updated_at`
- ✅ `phone` (text) ← **Campo de telefone existe!**

---

### 3. **Já Existe 1 Usuário Cadastrado**

```json
{
  "id": "b4772733-d50e-4f60-ab56-51ce86c7cef1",
  "email": "mar.medeiros2015@gmail.com",
  "created_at": "2025-05-09 21:58:48",
  "confirmed_at": "2025-05-09 21:58:48",
  "last_sign_in_at": "2025-09-09 12:54:45"
}
```

**Este é provavelmente o admin!** ✅

---

### 4. **Funções Admin Já Existem**

Funções encontradas:
- ✅ `is_current_user_admin()` - Verifica se usuário é admin
- ✅ `current_user_is_admin()` - Outra função de verificação
- ✅ `get_current_user_email()` - Pega email do usuário
- ✅ `get_auth_user_email()` - Pega email via auth

**Tabela `admin_permissions` existe:**
```sql
admin_permissions (
  id UUID,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP
)
```

---

## 🔧 O QUE PRECISA SER FEITO

### ✅ Opção 1: ADICIONAR CAMPOS NA TABELA `profiles` (RECOMENDADO)

Ao invés de criar uma nova tabela, vamos **adicionar os campos faltantes**:

```sql
-- Adicionar campos na tabela profiles existente
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

**Vantagens:**
- ✅ Aproveita estrutura existente
- ✅ RLS já está configurado
- ✅ Não duplica dados
- ✅ Compatível com código atual

---

### ⚠️ Opção 2: Criar Tabela Nova (NÃO RECOMENDADO)

Criar `user_profiles` separada geraria:
- ❌ Duplicação de dados
- ❌ Complexidade extra
- ❌ Problemas de sincronização

---

## 📝 SQL ATUALIZADO RECOMENDADO

Baseado na análise, o SQL ideal é:

```sql
-- =====================================================
-- 1. ADICIONAR CAMPOS FALTANTES NA TABELA profiles
-- =====================================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- 2. CRIAR/ATUALIZAR FUNÇÃO DE AUTO-CRIAR PERFIL
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, whatsapp, estado)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'estado', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    whatsapp = COALESCE(EXCLUDED.whatsapp, profiles.whatsapp),
    estado = COALESCE(EXCLUDED.estado, profiles.estado),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. CRIAR TRIGGER (se não existir)
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGER PARA updated_at
-- =====================================================
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

CREATE TRIGGER on_profile_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. ATUALIZAR POLÍTICAS RLS (já existem, mas garantir)
-- =====================================================
-- As políticas já existem e estão corretas!
-- Não é necessário recriar

-- =====================================================
-- 7. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);
```

---

## ✅ RESUMO DA ANÁLISE

| Item | Status | Ação Necessária |
|------|--------|-----------------|
| Tabela `profiles` | ✅ Existe | Adicionar campos |
| Tabela `auth.users` | ✅ Existe | Nenhuma |
| RLS Policies | ✅ Existem | Nenhuma |
| Admin System | ✅ Existe | Nenhuma |
| Triggers | ❌ Não existem | Criar |
| Funções | ⚠️ Parciais | Criar handle_new_user |

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Executar SQL atualizado (versão nova)
2. ✅ Testar registro de usuário
3. ✅ Testar login
4. ✅ Verificar se perfil é criado automaticamente
5. ✅ Fazer build Android

---

**Data:** 2025-10-09
**Projeto:** OneBoss
**Banco:** gytzdhfbmmrsanrhquut.supabase.co
