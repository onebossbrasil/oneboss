# 📱 Guia Completo: Como Testar o App Mobile Localmente

Este guia ensina diferentes formas de testar o aplicativo Android sem precisar publicar na Play Store.

---

## 🎯 Opções de Teste

### 1. **Android Studio Emulator** (Recomendado)
Teste em um emulador Android oficial no seu computador.

### 2. **USB Debugging** (Mais Real)
Teste no seu celular físico conectado via USB.

### 3. **Build de Depuração (Debug APK)**
Gera um APK de teste que pode ser instalado diretamente.

### 4. **Capacitor Live Reload**
Testa mudanças em tempo real no dispositivo.

---

## 🚀 Opção 1: Android Studio Emulator

### Passo 1: Instalar Android Studio
```bash
# macOS (via Homebrew)
brew install --cask android-studio

# Ou baixe em: https://developer.android.com/studio
```

### Passo 2: Configurar Emulador
1. Abra Android Studio
2. Tools → Device Manager
3. Create Device → Escolha um modelo (ex: Pixel 5)
4. Selecione uma API (ex: Android 13)
5. Clique em "Finish"

### Passo 3: Executar no Emulador
```bash
# 1. Build do projeto web
npm run build

# 2. Sincronizar com Capacitor
npx cap sync android

# 3. Abrir Android Studio
npx cap open android

# 4. No Android Studio, clique no botão ▶️ Run
```

**Vantagens:**
- ✅ Não precisa de celular físico
- ✅ Pode testar diferentes versões do Android
- ✅ Console de debug integrado

**Desvantagens:**
- ❌ Lento em máquinas mais fracas
- ❌ Não testa hardware real (câmera, GPS, etc)

---

## 🔌 Opção 2: USB Debugging (Celular Físico)

### Passo 1: Habilitar Modo Desenvolvedor no Celular
1. Vá em **Configurações → Sobre o telefone**
2. Toque 7 vezes em **Número da versão**
3. Volte e entre em **Opções do desenvolvedor**
4. Ative **Depuração USB**

### Passo 2: Conectar via USB
```bash
# Conecte o celular via USB

# Verifique se o dispositivo foi detectado
adb devices

# Deve aparecer algo como:
# List of devices attached
# ABC123XYZ    device
```

### Passo 3: Instalar no Celular
```bash
# 1. Build do projeto
npm run build

# 2. Sincronizar
npx cap sync android

# 3. Executar no dispositivo
npx cap run android
```

**Vantagens:**
- ✅ Testa no hardware real
- ✅ Mais rápido que emulador
- ✅ Experiência real do usuário

**Desvantagens:**
- ❌ Precisa de cabo USB
- ❌ Requer configuração do celular

---

## 📦 Opção 3: Build de Depuração (Debug APK)

### Gerar APK de Teste
```bash
# 1. Build do projeto web
npm run build

# 2. Sincronizar
npx cap sync android

# 3. Gerar APK de debug
cd android
./gradlew assembleDebug

# APK gerado em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar APK Manualmente
```bash
# Via ADB (celular conectado)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou copie o arquivo para o celular e instale manualmente
# (Precisa ativar "Instalar apps desconhecidos")
```

**Vantagens:**
- ✅ Pode compartilhar com testadores
- ✅ Instala facilmente
- ✅ Não precisa de Android Studio

**Desvantagens:**
- ❌ APK debug é maior e mais lento
- ❌ Não é otimizado

---

## ⚡ Opção 4: Live Reload (Desenvolvimento Rápido)

### Setup Inicial
```bash
# 1. Encontre o IP da sua máquina
# macOS/Linux:
ipconfig getifaddr en0

# Windows:
ipconfig
# Procure por "IPv4 Address"
```

### Configurar Capacitor
Edite `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.oneboss.app',
  appName: 'OneBoss',
  webDir: 'dist',
  server: {
    url: 'http://192.168.15.8:8080', // SEU IP AQUI
    cleartext: true
  },
  // ... resto da config
};
```

### Executar
```bash
# Terminal 1: Servidor de desenvolvimento
npm run dev

# Terminal 2: Sync e Run
npx cap sync android
npx cap run android
```

**Vantagens:**
- ✅ Mudanças em tempo real
- ✅ Super rápido para desenvolvimento
- ✅ Não precisa rebuild

**Desvantagens:**
- ❌ Celular precisa estar na mesma rede Wi-Fi
- ❌ Não testa a versão final

---

## 🐛 Debug de Erros no App

### Chrome DevTools (Recomendado para Login)
```bash
# 1. Com o app rodando no celular/emulador
# 2. Abra Chrome e digite:
chrome://inspect

# 3. Clique em "inspect" no seu app
# 4. Console JavaScript aparecerá!
```

Agora você pode:
- ✅ Ver erros de JavaScript
- ✅ Inspecionar elementos
- ✅ Ver logs do console
- ✅ Debugar o problema de login!

### Logcat (Logs do Android)
```bash
# Ver todos os logs
adb logcat

# Filtrar apenas erros
adb logcat *:E

# Filtrar pelo app
adb logcat | grep "com.oneboss.app"
```

### Android Studio Logcat
1. Abra Android Studio
2. Execute o app
3. Vá em **View → Tool Windows → Logcat**
4. Filtre por "Error" ou "Warn"

---

## 🔍 Investigar Problema de Login Específico

### Script de Debug
Crie este script para capturar logs:

```bash
#!/bin/bash
# Salve como: debug-login.sh

echo "🔍 Iniciando debug do app OneBoss..."

# Limpar logs antigos
adb logcat -c

# Capturar logs em arquivo
echo "📝 Capturando logs (pressione Ctrl+C para parar)..."
adb logcat -v time *:E *:W | tee debug-login.log

# Os logs ficarão em debug-login.log
```

Execute:
```bash
chmod +x debug-login.sh
./debug-login.sh

# Agora tente fazer login no app
# Todos os erros serão salvos em debug-login.log
```

### Verificar Console JavaScript
```bash
# Build com source maps para debug
npm run build:dev

# Sync
npx cap sync android

# Run
npx cap run android

# Abrir DevTools (Chrome)
# chrome://inspect
```

No DevTools, procure por:
- ❌ Erros de rede (Network tab)
- ❌ Erros JavaScript (Console tab)
- ❌ Erros de CORS
- ❌ Problemas com Supabase

---

## 📋 Checklist de Problemas Comuns

### Login não funciona no app?

- [ ] **CORS:** Supabase está configurado para permitir `com.oneboss.app`?
- [ ] **Network:** App tem permissão de internet? (AndroidManifest.xml)
- [ ] **HTTPS:** URLs do Supabase estão corretas?
- [ ] **Console:** Há erros no Chrome DevTools?
- [ ] **Toast:** As mensagens de erro aparecem no app?
- [ ] **Loading:** O botão fica em loading infinito?

### Como Verificar
```bash
# 1. Gerar APK de debug
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug

# 2. Instalar
adb install app/build/outputs/apk/debug/app-debug.apk

# 3. Abrir Chrome DevTools
# Abra Chrome → chrome://inspect

# 4. Clicar em login e ver os erros
```

---

## 🛠️ Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",

    "android:sync": "npm run build && npx cap sync android",
    "android:dev": "npm run build:dev && npx cap sync android && npx cap run android",
    "android:open": "npx cap open android",
    "android:debug": "cd android && ./gradlew assembleDebug",
    "android:install": "adb install android/app/build/outputs/apk/debug/app-debug.apk",
    "android:logs": "adb logcat *:E *:W",

    "test:app": "npm run build && npx cap sync android && npx cap run android"
  }
}
```

Uso:
```bash
# Desenvolvimento rápido
npm run android:dev

# Gerar APK de debug
npm run android:debug

# Ver logs de erro
npm run android:logs

# Testar app completo
npm run test:app
```

---

## 💡 Dicas Finais

1. **Use Chrome DevTools** - É a melhor forma de debugar JavaScript no app
2. **Teste em Debug APK primeiro** - Mais rápido que release
3. **Sempre verifique os logs** - `adb logcat` mostra tudo
4. **Live reload para desenvolvimento** - Economiza muito tempo
5. **Emulador para testes rápidos** - Não precisa de celular físico

---

## 📞 Próximos Passos

Se o login ainda não funcionar:
1. Execute `npm run test:app`
2. Abra `chrome://inspect`
3. Clique em login
4. Copie o erro que aparecer no Console
5. Me mostre o erro para investigarmos juntos!

---

**Boa sorte com os testes! 🚀**
