-- =====================================================
-- ONEBOSS - CONFIGURAÇÃO DE AUTENTICAÇÃO SUPABASE
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- =====================================================

-- 1. CRIAR TABELA DE PERFIS (PROFILES)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp TEXT,
  estado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- =====================================================

-- Política: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política: Permitir inserção de perfil (para signUp)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. FUNÇÃO PARA AUTO-CRIAR PERFIL AO REGISTRAR
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp, estado)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'estado', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGER PARA AUTO-CRIAR PERFIL
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGER PARA ATUALIZAR updated_at
-- =====================================================
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

CREATE TRIGGER on_profile_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- =====================================================
-- VERIFICAÇÃO (OPCIONAL)
-- =====================================================
-- Execute esta query para verificar se tudo foi criado:
-- SELECT * FROM information_schema.tables WHERE table_name = 'profiles';
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- SELECT * FROM pg_trigger WHERE tgname LIKE '%profile%' OR tgname LIKE '%user%';

-- =====================================================
-- SUCESSO! ✅
-- =====================================================
-- A estrutura de autenticação está pronta!
-- Agora você pode:
-- 1. Registrar novos usuários
-- 2. Fazer login
-- 3. Perfis serão criados automaticamente
-- =====================================================
