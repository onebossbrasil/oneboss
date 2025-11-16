-- =====================================================
-- ONEBOSS - INVESTIGAÇÃO DA ESTRUTURA DO SUPABASE
-- =====================================================
-- Execute este SQL no Supabase SQL Editor para ver toda a estrutura
-- =====================================================

-- =====================================================
-- 1. LISTAR TODAS AS TABELAS DO PROJETO
-- =====================================================
SELECT
  schemaname as schema,
  tablename as table_name,
  tableowner as owner
FROM pg_tables
WHERE schemaname IN ('public', 'auth', 'storage')
ORDER BY schemaname, tablename;

-- =====================================================
-- 2. VER ESTRUTURA DA TABELA auth.users
-- =====================================================
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- =====================================================
-- 3. VER SE JÁ EXISTE TABELA profiles
-- =====================================================
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- 4. LISTAR TODAS AS TABELAS DO SCHEMA public
-- =====================================================
SELECT
  table_name,
  (
    SELECT string_agg(column_name || ' (' || data_type || ')', ', ')
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = t.table_name
  ) as columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- 5. VER POLÍTICAS RLS EXISTENTES
-- =====================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 6. VER TRIGGERS EXISTENTES
-- =====================================================
SELECT
  trigger_schema,
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema IN ('public', 'auth')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 7. VER FUNÇÕES/PROCEDURES EXISTENTES
-- =====================================================
SELECT
  routine_schema,
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema IN ('public', 'auth')
  AND routine_type IN ('FUNCTION', 'PROCEDURE')
ORDER BY routine_schema, routine_name;

-- =====================================================
-- 8. VER FOREIGN KEYS EXISTENTES
-- =====================================================
SELECT
  tc.table_schema,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================
-- 9. VER ÍNDICES EXISTENTES
-- =====================================================
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 10. VERIFICAR SE HÁ USUÁRIOS CADASTRADOS
-- =====================================================
SELECT
  id,
  email,
  created_at,
  confirmed_at,
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 11. CONTAR REGISTROS NAS TABELAS PUBLIC
-- =====================================================
DO $$
DECLARE
  row record;
  count_query text;
  table_count int;
BEGIN
  RAISE NOTICE '=== CONTAGEM DE REGISTROS ===';
  FOR row IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  LOOP
    count_query := 'SELECT COUNT(*) FROM public.' || quote_ident(row.table_name);
    EXECUTE count_query INTO table_count;
    RAISE NOTICE 'Tabela %: % registros', row.table_name, table_count;
  END LOOP;
END $$;

-- =====================================================
-- 12. VER CONFIGURAÇÕES DE AUTH
-- =====================================================
-- Esta query mostra se email confirmation está ativada, etc
SELECT
  key,
  value
FROM auth.config
WHERE key IN ('email_confirmation', 'smtp_admin_email', 'site_url')
ORDER BY key;

-- =====================================================
-- FIM DA INVESTIGAÇÃO
-- =====================================================
-- Agora você tem uma visão completa de:
-- ✅ Todas as tabelas existentes
-- ✅ Estrutura das tabelas
-- ✅ Políticas RLS
-- ✅ Triggers
-- ✅ Funções
-- ✅ Foreign Keys
-- ✅ Índices
-- ✅ Usuários existentes
-- ✅ Contagem de registros
-- =====================================================
