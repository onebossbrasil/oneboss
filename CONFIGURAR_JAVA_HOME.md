# 🔧 Configurar JAVA_HOME no Windows - 2 Minutos

## Por que precisa?
O Gradle (ferramenta que gera o AAB) precisa saber onde o Java está instalado.

---

## 🎯 MÉTODO VISUAL (Mais Fácil)

### Passo 1: Abrir Variáveis de Ambiente

**Opção A: Atalho rápido**
1. Pressione `Win + R` (Win = tecla do Windows)
2. Digite: `sysdm.cpl`
3. Pressione `Enter`
4. Clique na aba **"Avançado"**
5. Clique em **"Variáveis de Ambiente"** (botão embaixo)

**OU Opção B: Pelo menu Iniciar**
1. Pesquise: "Variáveis de ambiente"
2. Clique em: "Editar as variáveis de ambiente do sistema"
3. Clique em **"Variáveis de Ambiente"**

---

### Passo 2: Criar JAVA_HOME

Na janela "Variáveis de Ambiente":

1. **Seção de baixo:** "Variáveis do sistema"
2. Clique em **"Novo..."**
3. Preencha:
   - **Nome da variável:** `JAVA_HOME`
   - **Valor da variável:** `C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot`
4. Clique em **OK**

```
┌────────────────────────────────────┐
│  Nova Variável do Sistema          │
├────────────────────────────────────┤
│                                    │
│  Nome da variável:                 │
│  ┌──────────────────────────────┐  │
│  │ JAVA_HOME                    │  │
│  └──────────────────────────────┘  │
│                                    │
│  Valor da variável:                │
│  ┌──────────────────────────────┐  │
│  │ C:\Program Files\Eclipse ... │  │
│  └──────────────────────────────┘  │
│                                    │
│       [  OK  ]    [ Cancelar ]     │
└────────────────────────────────────┘
```

---

### Passo 3: Adicionar ao PATH

**Ainda na janela "Variáveis de Ambiente":**

1. **Seção de baixo:** "Variáveis do sistema"
2. Encontre a variável **"Path"**
3. Selecione e clique em **"Editar..."**
4. Clique em **"Novo"**
5. Digite: `%JAVA_HOME%\bin`
6. Clique em **OK**
7. Clique em **OK** novamente
8. Clique em **OK** mais uma vez (fechar todas janelas)

```
┌────────────────────────────────────┐
│  Editar variável de ambiente       │
├────────────────────────────────────┤
│                                    │
│  C:\Windows\System32               │
│  C:\Windows                        │
│  %JAVA_HOME%\bin             ← NOVO│
│                                    │
│     [ Novo ]  [ Editar ] [ Excluir]│
│                                    │
│       [  OK  ]    [ Cancelar ]     │
└────────────────────────────────────┘
```

---

### Passo 4: Verificar

1. **Feche TODOS os terminais/CMD/PowerShell abertos**
2. Abra um **NOVO terminal** (PowerShell ou CMD)
3. Execute:

```bash
echo %JAVA_HOME%
```

**Deve mostrar:**
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot
```

4. Execute também:
```bash
java -version
```

**Deve mostrar:**
```
openjdk version "17.0.16" 2025-07-15
OpenJDK Runtime Environment Temurin-17.0.16+8 (build 17.0.16+8)
OpenJDK 64-Bit Server VM Temurin-17.0.16+8 (build 17.0.16+8, mixed mode, sharing)
```

---

## ✅ SUCESSO!

Se os dois comandos acima funcionaram, JAVA_HOME está configurado!

Agora você pode:

```bash
cd C:\Users\inaci\Desktop\Cursor\OneBoss\android
gradlew.bat bundleRelease
```

**E vai funcionar!** 🎉

---

## 🔥 ALTERNATIVA RÁPIDA (Se não quiser configurar):

**Simplesmente clique duas vezes em:**
```
build-aab.bat
```

Este script já configura tudo automaticamente para aquela execução!

---

## 🆘 PROBLEMAS?

### "echo %JAVA_HOME%" retorna "%JAVA_HOME%"
**Solução:** Fechar e abrir um NOVO terminal

### "java -version" ainda não funciona
**Solução:**
1. Verificar se digitou o caminho correto em JAVA_HOME
2. Verificar se adicionou `%JAVA_HOME%\bin` ao Path (não `%JAVA_HOME%` sozinho)
3. Reiniciar o computador (último recurso)

### Caminho diferente do JDK
Se instalou em outro local, ajuste o caminho. Para descobrir onde está:
1. Abrir Explorador de Arquivos
2. Navegar para: `C:\Program Files\Eclipse Adoptium\`
3. Ver qual pasta existe (ex: `jdk-17.0.16.8-hotspot`)
4. Usar esse caminho completo no JAVA_HOME

---

## 🎯 RESUMO VISUAL:

```
1. Win + R → "sysdm.cpl" → Enter
          ↓
2. Aba "Avançado" → Botão "Variáveis de Ambiente"
          ↓
3. Novo → Nome: JAVA_HOME
         Valor: C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot
          ↓
4. Editar Path → Novo → %JAVA_HOME%\bin
          ↓
5. OK → OK → OK (fechar tudo)
          ↓
6. Fechar terminais e abrir NOVO
          ↓
7. Testar: echo %JAVA_HOME%
          ↓
8. ✅ SUCESSO!
```

---

**TEMPO TOTAL: 2 minutos**

**DEPOIS DISSO, NUNCA MAIS PRECISA CONFIGURAR! ✅**
