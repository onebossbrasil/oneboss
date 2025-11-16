-- =====================================================
-- SETUP ATUALIZADO PARA AUTENTICAÇÃO - OneBoss
-- =====================================================
-- Este SQL atualiza a estrutura existente do Supabase
-- ao invés de criar tabelas novas.
--
-- BASEADO NA ANÁLISE:
-- - A tabela profiles JÁ EXISTE com (id, email)
-- - RLS policies JÁ ESTÃO configuradas
-- - Vamos apenas ADICIONAR os campos faltantes
-- =====================================================

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
-- Esta função é chamada quando um novo usuário é criado
-- Ela cria automaticamente um registro na tabela profiles
-- usando os dados de raw_user_meta_data do auth.users

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
-- Remove trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria trigger que chama a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
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
-- Remove trigger antigo se existir
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Cria trigger que atualiza updated_at automaticamente
CREATE TRIGGER on_profile_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. POLÍTICAS RLS (já existem, verificação apenas)
-- =====================================================
-- As políticas já existem e estão corretas:
-- - SELECT: auth.uid() = id
-- - INSERT: auth.uid() = id
-- - UPDATE: auth.uid() = id
-- Não é necessário recriar

-- =====================================================
-- 7. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- =====================================================
-- ✅ FIM DO SETUP
-- =====================================================
--
-- PRÓXIMOS PASSOS:
-- 1. Execute este SQL no SQL Editor do Supabase
-- 2. Teste criar um novo usuário via Register.tsx
-- 3. Verifique se o perfil é criado automaticamente
-- 4. Teste fazer login
-- 5. Verifique se a sessão é mantida
--
-- =====================================================
