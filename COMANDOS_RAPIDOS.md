# ⚡ Comandos Rápidos - OneBoss

Comandos essenciais para builds e publicação.

---

## 🔥 Build Completo (Tudo de Uma Vez)

### Windows (CMD/PowerShell)
```bash
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease && cd ..
```

### Resultado:
- ✅ Build web na pasta `dist/`
- ✅ Sync com Capacitor
- ✅ AAB gerado em `android/app/build/outputs/bundle/release/app-release.aab`

---

## 📦 Build Passo a Passo

### 1. Build Web
```bash
npm run build
```
**Tempo:** ~30-60s
**Output:** `dist/` folder

### 2. Sync Capacitor
```bash
npx cap sync android
```
**Tempo:** ~5-10s
**Output:** Copia arquivos para `android/app/src/main/assets/public/`

### 3. Gerar AAB
```bash
cd android
./gradlew bundleRelease
cd ..
```
**Tempo primeira vez:** ~5-15min
**Tempo próximas:** ~1-3min
**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔑 Gerar Keystore

```bash
.\generate-keystore.bat
```

**Output:** `oneboss-release-key.keystore` (raiz do projeto)

**Senhas:**
- Keystore: `oneboss2024`
- Alias: `oneboss`
- Key: `oneboss2024`

---

## ✅ Verificar Instalações

### Java
```bash
java -version
```
**Esperado:** `openjdk version "17.0.x"`

### JAVA_HOME
```bash
echo %JAVA_HOME%
```
**Esperado:** `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot\`

### Node
```bash
node -v
```

### npm
```bash
npm -v
```

---

## 🧹 Limpar Build (Se houver erros)

### Limpar Web Build
```bash
rmdir /s /q dist
npm run build
```

### Limpar Android Build
```bash
cd android
./gradlew clean
./gradlew bundleRelease
cd ..
```

### Limpar Tudo e Rebuild
```bash
rmdir /s /q dist
rmdir /s /q node_modules
npm install
npm run build
npx cap sync android
cd android
./gradlew clean
./gradlew bundleRelease
cd ..
```

---

## 📱 Localizar AAB Gerado

### Caminho Completo:
```
C:\Users\inaci\Desktop\Cursor\OneBoss\android\app\build\outputs\bundle\release\app-release.aab
```

### Abrir Pasta no Explorer:
```bash
start android\app\build\outputs\bundle\release
```

### Verificar Tamanho:
```bash
dir android\app\build\outputs\bundle\release\app-release.aab
```

---

## 🔐 Verificar Assinatura do AAB

```bash
jarsigner -verify -verbose -certs android\app\build\outputs\bundle\release\app-release.aab
```

**Esperado:** `jar verified.`

---

## 🚀 Abrir Android Studio (se instalado)

```bash
npx cap open android
```

---

## 📊 Ver Informações do Build

### Ver versionCode e versionName:
```bash
type android\app\build.gradle | findstr version
```

### Ver applicationId:
```bash
type android\app\build.gradle | findstr applicationId
```

---

## 🔄 Atualizar Versão (Para próximas atualizações)

### Editar manualmente:
Abrir `android/app/build.gradle` e alterar:
```gradle
versionCode 2  // incrementar de 1 para 2
versionName "1.0.1"  // incrementar versão
```

---

## 🌐 Iniciar Dev Server (Teste local)

```bash
npm run dev
```

Acesse: http://localhost:8081

---

## 📸 Gerar Screenshots (Emulador)

### 1. Abrir emulador:
```bash
npx cap open android
```

### 2. Rodar app no emulador (Android Studio)

### 3. Tirar screenshots:
- **Atalho:** Ctrl + S
- **Ou:** Camera button na toolbar do emulador

---

## 🔗 Links Úteis

### Play Console
```
https://play.google.com/console
```

### Download JDK 17
```
https://adoptium.net/temurin/releases/?version=17
```

### Converter ICO para PNG
```
https://convertio.co/ico-png/
```

### Mockup de Screenshots
```
https://mockuphone.com/
https://smartmockups.com/
```

### Central de Ajuda Google Play
```
https://support.google.com/googleplay/android-developer
```

---

## 🆘 Solução de Problemas Rápida

### "JAVA_HOME is not set"
```bash
# Instalar JDK 17 primeiro
# Depois verificar:
echo %JAVA_HOME%
```

### "Keystore not found"
```bash
.\generate-keystore.bat
```

### "Build failed"
```bash
cd android
./gradlew clean
./gradlew bundleRelease
cd ..
```

### "Cannot find module"
```bash
npm install
```

### "Vite build error"
```bash
rmdir /s /q dist
npm run build
```

---

## 📋 Workflow Completo (Do Zero ao AAB)

```bash
# 1. Verificar instalações
java -version
node -v
npm -v

# 2. Gerar keystore (apenas primeira vez)
.\generate-keystore.bat

# 3. Build completo
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease && cd ..

# 4. Localizar AAB
start android\app\build\outputs\bundle\release

# 5. Verificar assinatura
jarsigner -verify android\app\build\outputs\bundle\release\app-release.aab

# ✅ Pronto para upload no Play Console!
```

---

## 🎯 Checklist Rápido

Antes do build:
```
✅ Java instalado (java -version)
✅ JAVA_HOME configurado (echo %JAVA_HOME%)
✅ Keystore gerada (oneboss-release-key.keystore existe)
✅ Código atualizado (git pull ou latest changes)
```

Após o build:
```
✅ AAB gerado (app-release.aab existe)
✅ AAB assinado (jarsigner -verify)
✅ Tamanho razoável (~15-50 MB)
✅ Backup da keystore feito
```

---

**Copie e cole estes comandos diretamente no terminal!** ⚡
