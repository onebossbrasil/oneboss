# ✅ Checklist de Publicação - OneBoss

Use este checklist para garantir que tudo está pronto antes de enviar o app para o Google Play Store.

---

## 📋 FASE 1: Preparação do Ambiente

### Instalação de Ferramentas
- [ ] **JDK 17 instalado**
  - Comando de teste: `java -version`
  - Deve mostrar: `openjdk version "17.0.x"`
- [ ] **JAVA_HOME configurado**
  - Comando de teste: `echo %JAVA_HOME%`
  - Deve mostrar o caminho do JDK
- [ ] **Node.js instalado** (já deve estar)
  - Comando de teste: `node -v`
- [ ] **npm funcionando** (já deve estar)
  - Comando de teste: `npm -v`

---

## 🔐 FASE 2: Keystore (Assinatura Digital)

### Geração da Keystore
- [ ] **Executar `generate-keystore.bat`**
  - Arquivo gerado: `oneboss-release-key.keystore`
- [ ] **Verificar arquivo na raiz do projeto**
  - Localização: `c:\Users\inaci\Desktop\Cursor\OneBoss\oneboss-release-key.keystore`
- [ ] **Fazer backup da keystore**
  - Copiar para Google Drive, pen drive ou local seguro
  - ⚠️ **SEM ESTA KEYSTORE VOCÊ NÃO PODERÁ ATUALIZAR O APP!**
- [ ] **Anotar as senhas**
  - Keystore Password: `oneboss2024`
  - Key Alias: `oneboss`
  - Key Password: `oneboss2024`

### Verificação de Configuração
- [ ] **Abrir `android/app/build.gradle`**
- [ ] **Confirmar signingConfigs presente**
  ```gradle
  signingConfigs {
      release {
          storeFile file('../../oneboss-release-key.keystore')
          storePassword 'oneboss2024'
          keyAlias 'oneboss'
          keyPassword 'oneboss2024'
      }
  }
  ```
- [ ] **Confirmar buildTypes.release usando signingConfig**

---

## 🏗️ FASE 3: Build do Projeto

### Build Web
- [ ] **Executar `npm run build`**
  - Tempo esperado: 30-60 segundos
  - Deve criar pasta `dist/`
- [ ] **Verificar pasta `dist/` criada**
- [ ] **Sem erros no console**

### Sync Capacitor
- [ ] **Executar `npx cap sync android`**
  - Tempo esperado: 5-10 segundos
  - Deve copiar arquivos para `android/app/src/main/assets/public/`
- [ ] **Mensagem de sucesso: "Sync finished in X.XXs"**

### Geração do AAB
- [ ] **Executar `cd android && ./gradlew bundleRelease`**
  - Tempo esperado primeira vez: 5-15 minutos
  - Tempo esperado próximas vezes: 1-3 minutos
- [ ] **Aguardar mensagem "BUILD SUCCESSFUL"**
- [ ] **Verificar arquivo AAB gerado**
  - Localização: `android/app/build/outputs/bundle/release/app-release.aab`
  - Tamanho esperado: 15-50 MB

### Verificação do AAB
- [ ] **Arquivo existe**
- [ ] **Tamanho razoável (não vazio, não gigante)**
- [ ] **Verificar assinatura** (opcional)
  ```bash
  jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
  ```
  - Deve mostrar: `jar verified.`

---

## 🌐 FASE 4: Política de Privacidade

### Publicação da Política
- [ ] **Escolher método de hospedagem**
  - [ ] GitHub Pages (grátis, recomendado)
  - [ ] Seu próprio domínio
  - [ ] Lovable/Vercel/Netlify
- [ ] **Criar página pública com a política**
  - Conteúdo em: `src/pages/PrivacyPolicy.tsx`
- [ ] **Obter URL pública HTTPS**
  - Exemplo: `https://seu-usuario.github.io/oneboss-policies/`
- [ ] **Testar URL em navegador** (deve abrir e mostrar a política)
- [ ] **Anotar URL para usar no Play Console**

---

## 🎮 FASE 5: Conta Google Play Console

### Criação da Conta
- [ ] **Acessar https://play.google.com/console/signup**
- [ ] **Preencher informações pessoais/empresa**
- [ ] **Pagar taxa de $25 USD**
  - Cartão de crédito/débito internacional necessário
- [ ] **Aguardar confirmação** (geralmente instantânea)
- [ ] **Acessar o console: https://play.google.com/console**

---

## 📱 FASE 6: Criar App no Play Console

### Informações Básicas
- [ ] **Clicar em "Criar app"**
- [ ] **Preencher informações:**
  - Nome: `OneBoss`
  - Idioma: `Português (Brasil)`
  - Tipo: `App`
  - Gratuito/Pago: `Gratuito`
- [ ] **Marcar declarações obrigatórias**
- [ ] **Criar app**

---

## 📝 FASE 7: Preencher Ficha da Loja

### Presença na Loja → Ficha da Loja Principal

#### Detalhes do App
- [ ] **Nome do app:** `OneBoss`
- [ ] **Descrição curta** (80 caracteres)
  ```
  Marketplace premium de itens exclusivos e ultra-luxuosos
  ```
  - Ver opções em `TEXTOS_PLAY_STORE.md`
- [ ] **Descrição completa** (até 4000 caracteres)
  - Copiar de `TEXTOS_PLAY_STORE.md` → Descrição Completa
  - Escolher Versão 1 ou Versão 2

#### Detalhes de Contato
- [ ] **E-mail:** _____________@_____________ (seu e-mail)
- [ ] **Telefone:** (opcional) +55 (62) 98280-1810
- [ ] **Website:** _____________________________ (seu site)

#### Gráficos

##### Ícone do App (512x512 px) - OBRIGATÓRIO
- [ ] **Converter `public/Icone-oneboss.ico` para PNG**
  - Use: https://convertio.co/ico-png/
- [ ] **Redimensionar para 512x512 px** (se necessário)
- [ ] **Upload no Play Console**

##### Feature Graphic (1024x500 px) - RECOMENDADO
- [ ] **Criar banner horizontal**
  - Use Canva: https://www.canva.com/
  - Template: 1024x500 px
  - Adicionar logo e slogan
- [ ] **Upload no Play Console**

##### Screenshots (OBRIGATÓRIO - mínimo 2)
- [ ] **Gerar screenshots 1080x1920 px**
  - Opção A: Usar emulador Android
  - Opção B: Usar ferramentas online (mockuphone.com)
  - Opção C: Usar dispositivo real
- [ ] **Mínimo 2 screenshots criados**
  - Sugestão 1: Tela inicial com produtos
  - Sugestão 2: Detalhes do produto
  - Sugestão 3: Catálogo/Loja (opcional)
  - Sugestão 4: Tela de login (opcional)
- [ ] **Upload de todos screenshots**

---

## 🎯 FASE 8: Classificação e Público

### Classificação de Conteúdo
- [ ] **Menu: Conteúdo do app → Classificação de conteúdo**
- [ ] **Iniciar questionário**
- [ ] **Categoria:** E-commerce
- [ ] **Responder todas perguntas**
  - Violência: Não
  - Sexual: Não
  - Linguagem: Não
  - Drogas: Não
  - etc.
- [ ] **Obter classificação** (geralmente: Livre ou 12+)
- [ ] **Salvar**

### Público-alvo
- [ ] **Menu: Conteúdo do app → Público-alvo e conteúdo**
- [ ] **Faixa etária:** 18 ou mais
- [ ] **Público infantil:** Não
- [ ] **Países:** Brasil (ou escolher outros)
- [ ] **Salvar**

---

## 🔒 FASE 9: Dados de Segurança

### Declaração de Dados
- [ ] **Menu: Conteúdo do app → Dados de segurança**
- [ ] **Iniciar formulário**
- [ ] **Coleta de dados:** Sim
- [ ] **Tipos de dados:**
  - [ ] Informações pessoais (nome, e-mail, telefone)
  - [ ] Atividade no app (produtos visualizados, favoritos)
- [ ] **Finalidade:**
  - [ ] Funcionalidade do app (autenticação)
  - [ ] Personalização
  - [ ] Comunicação
- [ ] **Práticas de segurança:**
  - [ ] Dados criptografados em trânsito (HTTPS)
  - [ ] Usuários podem solicitar exclusão
  - [ ] Conformidade com LGPD
- [ ] **Salvar**

### Política de Privacidade
- [ ] **Menu: Conteúdo do app → Política de privacidade**
- [ ] **Adicionar URL da política**
  - URL: ____________________________________
  - Deve ser HTTPS e público
- [ ] **Salvar**

---

## 📤 FASE 10: Upload do AAB

### Criar Release de Produção
- [ ] **Menu: Produção → Releases → Produção**
- [ ] **Clicar em "Criar nova versão"**
- [ ] **Fazer upload do AAB**
  - Arquivo: `android/app/build/outputs/bundle/release/app-release.aab`
  - Aguardar upload (1-5 minutos)
- [ ] **Aguardar processamento** (análise automática do Google)

### Notas da Versão
- [ ] **Nome da versão:** v1.0.0
- [ ] **Notas em Português (Brasil)**
  - Copiar de `TEXTOS_PLAY_STORE.md` → Notas da Versão → Português
- [ ] **Notas em English (US)** (opcional)
  - Copiar de `TEXTOS_PLAY_STORE.md` → Notas da Versão → English
- [ ] **Salvar**

### Configurar Lançamento
- [ ] **Tipo de lançamento:** Completo (100%)
- [ ] **Países:** Brasil (ou escolhidos anteriormente)
- [ ] **Salvar rascunho**

---

## ✅ FASE 11: Verificação Final

### Checklist do Play Console
Antes de enviar, o console mostra um checklist. Confirme que TUDO está ✅:

- [ ] ✅ Ficha da loja configurada
- [ ] ✅ Ícone 512x512 adicionado
- [ ] ✅ Screenshots (mínimo 2) adicionados
- [ ] ✅ Descrição curta preenchida
- [ ] ✅ Descrição completa preenchida
- [ ] ✅ Classificação de conteúdo completa
- [ ] ✅ Público-alvo definido
- [ ] ✅ Dados de segurança preenchidos
- [ ] ✅ Política de privacidade (URL válida)
- [ ] ✅ AAB enviado e processado
- [ ] ✅ Notas da versão preenchidas

---

## 🚀 FASE 12: Envio para Revisão

### Submissão Final
- [ ] **Revisar TUDO mais uma vez**
- [ ] **Clicar em "Enviar para revisão"**
- [ ] **Confirmar envio**
- [ ] **Aguardar e-mail de confirmação**
- [ ] **Anotar data/hora do envio:** ___/___/___ às ___:___

### Aguardar Aprovação
- [ ] **Tempo esperado:** 1-7 dias (geralmente 24-48h)
- [ ] **Verificar e-mail diariamente**
- [ ] **Verificar notificações no Play Console**

---

## 🎉 FASE 13: Pós-Aprovação

### App Aprovado ✅
- [ ] **Receber e-mail de aprovação**
- [ ] **App publicado automaticamente**
- [ ] **Aguardar indexação (até 24h)**
- [ ] **Buscar "OneBoss" na Play Store**
- [ ] **Verificar se aparece**
- [ ] **Instalar e testar**
- [ ] **Compartilhar link:**
  ```
  https://play.google.com/store/apps/details?id=com.oneboss.app
  ```

### Divulgação
- [ ] **Postar nas redes sociais**
- [ ] **Enviar para clientes/contatos**
- [ ] **Adicionar badge do Google Play no site**
- [ ] **Criar campanha de lançamento**

### Monitoramento
- [ ] **Acessar Play Console diariamente**
- [ ] **Menu: Estatísticas**
  - Verificar instalações
  - Verificar desinstalações
  - Ler avaliações
  - Responder comentários
- [ ] **Corrigir bugs reportados**
- [ ] **Planejar próxima atualização**

---

## ❌ FASE 14: Se Rejeitado

### App Rejeitado
- [ ] **Ler e-mail de rejeição com atenção**
- [ ] **Identificar motivo da rejeição**
- [ ] **Acessar Play Console → Ver detalhes**
- [ ] **Corrigir problemas indicados**
- [ ] **Re-enviar para revisão**
  - Geralmente mais rápido na segunda vez

### Motivos Comuns de Rejeição
- [ ] Política de privacidade inválida
- [ ] Screenshots de baixa qualidade
- [ ] Permissões não justificadas
- [ ] Crash ao abrir
- [ ] Descrição inadequada ou enganosa
- [ ] Ícone de baixa qualidade
- [ ] Violação de políticas do Google

---

## 📊 MÉTRICAS DE SUCESSO

### Primeiros 7 Dias
- [ ] Instalações: ___________
- [ ] Desinstalações: ___________
- [ ] Avaliação média: ⭐ ___________
- [ ] Crashes: ___________

### Primeiro Mês
- [ ] Instalações totais: ___________
- [ ] Usuários ativos: ___________
- [ ] Taxa de retenção: ___________%
- [ ] Avaliações positivas: ___________

---

## 🔄 PRÓXIMA ATUALIZAÇÃO (v1.0.1)

### Quando Atualizar
- [ ] Após 1-2 semanas do lançamento
- [ ] Após corrigir bugs reportados
- [ ] Após implementar melhorias solicitadas

### Processo de Atualização
- [ ] Editar `android/app/build.gradle`:
  ```gradle
  versionCode 2  // incrementar
  versionName "1.0.1"  // incrementar
  ```
- [ ] Fazer alterações no código
- [ ] Executar build completo:
  ```bash
  npm run build && npx cap sync android && cd android && ./gradlew bundleRelease
  ```
- [ ] Upload do novo AAB no Play Console
- [ ] Preencher notas da nova versão
- [ ] Enviar para revisão

---

## 📁 BACKUP - NÃO ESQUECER!

### Arquivos Críticos para Backup
- [ ] **oneboss-release-key.keystore** (ESSENCIAL!)
- [ ] **Senhas anotadas** (keystore e key)
- [ ] **Código-fonte** (GitHub/GitLab)
- [ ] **Chaves de API** (Supabase, etc)
- [ ] **Screenshots originais**
- [ ] **Ícone original (alta resolução)**
- [ ] **Feature graphic original**

### Locais de Backup Recomendados
- [ ] Google Drive / OneDrive / Dropbox
- [ ] Pen drive externo
- [ ] HD externo
- [ ] Repositório Git privado
- [ ] Cofre de senhas (1Password, LastPass, etc)

---

## ✅ CHECKLIST RESUMIDO (Quick Check)

**Antes de enviar para revisão, confirme:**

```
✅ JDK instalado e funcionando
✅ Keystore gerada e com backup
✅ Build web sem erros
✅ AAB gerado e assinado
✅ Conta Play Console criada
✅ App criado no console
✅ Ícone 512x512 enviado
✅ Screenshots (mín. 2) enviados
✅ Descrições preenchidas
✅ Classificação completa
✅ Dados de segurança preenchidos
✅ Política de privacidade (URL pública)
✅ AAB enviado e processado
✅ Notas da versão preenchidas
✅ Tudo revisado
```

**Se TODOS os itens acima estiverem ✅, você está pronto para clicar em "Enviar para revisão"!**

---

## 🆘 SUPORTE

**Problemas?**
1. Consulte `PASSO_A_PASSO_PUBLICACAO.md`
2. Seção de troubleshooting
3. Central de Ajuda do Google Play: https://support.google.com/googleplay/android-developer
4. Documentação Capacitor: https://capacitorjs.com/docs

---

**BOA SORTE! 🚀**

**Última atualização:** 2024-10-09
