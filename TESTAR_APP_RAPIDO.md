# 🚀 Guia Rápido: Testar App Mobile Localmente

## ✅ Forma MAIS FÁCIL: Simular o App no Navegador

### Opção 1: DevTools Mobile Simulator (RECOMENDADO)

```bash
# 1. Execute o servidor
npm run dev

# 2. Abra Chrome e pressione F12 (DevTools)
# 3. Clique no ícone de celular 📱 (Toggle device toolbar)
# 4. Selecione um dispositivo (ex: iPhone 12, Pixel 5)
# 5. Acesse: http://localhost:8080
```

**Pronto!** Você está testando o app em modo mobile no navegador!

**Para testar especificamente o comportamento do app:**
- A detecção de plataforma irá reconhecer como "web"
- Para simular app nativo, abra o Console e digite:
  ```javascript
  localStorage.setItem('debug_platform', 'android');
  location.reload();
  ```

---

## 📱 Forma REAL: Testar no Celular/Emulador

### Método 1: Chrome DevTools com Celular Real

```bash
# Passo 1: Habilite USB Debugging no celular
# Configurações → Sobre → Toque 7x em "Número da versão"
# Volte → Opções do desenvolvedor → Ative "Depuração USB"

# Passo 2: Conecte via USB e verifique
adb devices

# Passo 3: Execute o teste
npm run test:app

# Isso irá:
# ✅ Fazer o build de desenvolvimento
# ✅ Sincronizar com Android
# ✅ Instalar e abrir no celular

# Passo 4: Debug com Chrome DevTools
# Abra Chrome → chrome://inspect
# Clique em "inspect" no seu app
```

Agora você pode ver TODOS os erros JavaScript no Console do Chrome! 🎉

---

### Método 2: Android Studio Emulator

```bash
# Passo 1: Instale Android Studio
# https://developer.android.com/studio

# Passo 2: Crie um emulador
# Android Studio → Tools → Device Manager → Create Device

# Passo 3: Execute o teste
npm run test:app

# O app abrirá no emulador automaticamente!
```

---

## 🐛 Debugar Problema de Login

### Passo a Passo:

```bash
# 1. Execute o app em modo debug
npm run test:app

# 2. Abra Chrome DevTools
# Chrome → chrome://inspect → Clique em "inspect"

# 3. Vá na aba Console

# 4. Tente fazer login ou criar conta no app

# 5. Veja os erros que aparecem no Console!
```

**Erros comuns que você verá:**
- ❌ "Network request failed" → Problema de conexão
- ❌ "CORS error" → Configuração do Supabase
- ❌ "Invalid login credentials" → Email/senha errados
- ❌ "User already registered" → Email já existe

---

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento web (navegador)
npm run dev

# Desenvolvimento web com IP visível (para celular na mesma rede)
npm run dev:app

# Testar no celular/emulador (recomendado para debug)
npm run test:app

# Apenas executar no Android (sem rebuild)
npm run android:run

# Ver logs de erro do Android
npm run android:logs

# Gerar APK de debug para instalar manualmente
npm run android:debug
```

---

## 💡 Dica de Ouro: Live Reload no Celular

Para testar mudanças em tempo real no celular (igual ao `npm run dev`):

### Passo 1: Descubra seu IP local
```bash
# macOS/Linux:
ipconfig getifaddr en0

# Windows:
ipconfig
# Procure "IPv4 Address"

# Exemplo: 192.168.15.8
```

### Passo 2: Configure o Capacitor
Edite `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.oneboss.app',
  appName: 'OneBoss',
  webDir: 'dist',
  server: {
    url: 'http://192.168.15.8:8080', // ← SEU IP AQUI!
    cleartext: true
  },
  // ... resto
};
```

### Passo 3: Execute
```bash
# Terminal 1: Servidor de desenvolvimento
npm run dev:app

# Terminal 2: Instalar no celular
npm run android:run
```

**Agora qualquer mudança no código aparece instantaneamente no celular!** 🚀

### Passo 4: Quando terminar, desative o Live Reload
```typescript
// Remova ou comente a config server:
const config: CapacitorConfig = {
  appId: 'com.oneboss.app',
  appName: 'OneBoss',
  webDir: 'dist',
  // server: { ... } ← Comentar ou remover
};
```

---

## 🔍 Investigar Erro Específico de Login

Se o login não funciona no app, faça isso:

```bash
# 1. Execute o app em debug
npm run test:app

# 2. Abra Chrome DevTools
# Chrome → chrome://inspect → inspect

# 3. No Console, ative logs detalhados
localStorage.setItem('debug', 'true');

# 4. Tente fazer login

# 5. Copie TODOS os erros que aparecerem no Console

# 6. Me envie os erros!
```

---

## ⚡ Comandos Rápidos

```bash
# Testar agora (celular conectado via USB)
npm run test:app

# Ver logs em tempo real
npm run android:logs

# Apenas rodar (sem rebuild)
npm run android:run

# Debug no Chrome
# chrome://inspect
```

---

## 📋 Checklist Final

Antes de testar:
- [ ] Celular conectado via USB (ou emulador rodando)
- [ ] USB Debugging habilitado
- [ ] `adb devices` mostra seu dispositivo
- [ ] Chrome instalado (para DevTools)

Para debugar login:
- [ ] App rodando no celular/emulador
- [ ] Chrome DevTools aberto (`chrome://inspect`)
- [ ] Console aberto e visível
- [ ] Tentar login e observar erros

---

**Agora você pode testar o app localmente!** 🎉

Se tiver algum erro, me mostre o que aparece no Console do Chrome DevTools!
