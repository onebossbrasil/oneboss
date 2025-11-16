# 📱 Guia Completo: Build do App OneBoss para Android

## 🎯 Objetivo Final
Gerar um arquivo **AAB (Android App Bundle)** para enviar ao Google Play Console.

---

## 📋 Pré-requisitos

### 1. **Node.js e NPM**
- ✅ Já instalado (você está usando)

### 2. **Android Studio**
- Baixe em: https://developer.android.com/studio
- Instale e configure o **Android SDK**
- **Importante:** Durante instalação, marque:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (opcional, para testes)

### 3. **Java JDK 17** (obrigatório)
- Baixe em: https://adoptium.net/ (versão 17 LTS)
- Configure variável de ambiente `JAVA_HOME`

---

## 🚀 Passo 1: Instalar Capacitor

```bash
cd "c:\Users\inaci\Desktop\Cursor\OneBoss"

# Instalar dependências do Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Inicializar Capacitor
npx cap init
```

Quando solicitado:
- **App name:** `OneBoss Brasil`
- **App ID:** `com.oneboss.brasil` (importante para Play Store)
- **Web directory:** `dist` (ou `build`, dependendo do Vite/React)

---

## 🛠️ Passo 2: Configurar Build do React

Edite `package.json` e verifique se existe:

```json
{
  "scripts": {
    "build": "vite build"  // ou "react-scripts build"
  }
}
```

Execute o build:

```bash
npm run build
```

Isso cria a pasta `dist/` (ou `build/`) com HTML/CSS/JS otimizados.

---

## 📦 Passo 3: Adicionar Plataforma Android

```bash
# Adiciona plataforma Android
npx cap add android

# Sincroniza arquivos web com o projeto Android
npx cap sync
```

Estrutura criada:
```
OneBoss/
├── android/          ← Projeto Android nativo
│   ├── app/
│   ├── gradle/
│   └── build.gradle
├── dist/             ← Build React
└── capacitor.config.json
```

---

## ⚙️ Passo 4: Configurar capacitor.config.json

Edite `capacitor.config.json`:

```json
{
  "appId": "com.oneboss.brasil",
  "appName": "OneBoss Brasil",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "cleartext": true,
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#C9A227",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    }
  }
}
```

---

## 🎨 Passo 5: Adicionar Ícones e Splash Screen

### **Ícone do App (obrigatório)**

1. Crie um PNG de **1024x1024px** (ícone OneBoss)
2. Use ferramenta: https://icon.kitchen/ ou https://appicon.co/
3. Baixe todos os tamanhos gerados
4. Coloque em: `android/app/src/main/res/`

Estrutura:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### **Splash Screen (opcional)**

1. Crie PNG de **2732x2732px** (fundo dourado + logo)
2. Coloque em: `android/app/src/main/res/drawable/splash.png`

---

## 🔧 Passo 6: Abrir no Android Studio

```bash
npx cap open android
```

Isso abre o **Android Studio** com o projeto.

### **No Android Studio:**

1. **Aguarde o Gradle Sync** terminar (barra de progresso embaixo)
2. **Verifique erros** na aba "Build" (canto inferior)

---

## 🔐 Passo 7: Criar Keystore (Chave de Assinatura)

O Google Play exige que o APK/AAB seja assinado digitalmente.

```bash
# No terminal (Windows)
keytool -genkey -v -keystore oneboss-release.keystore -alias oneboss -keyalg RSA -keysize 2048 -validity 10000
```

Preencha:
- **Password:** (guarde bem, você vai precisar!)
- **Nome:** OneBoss Brasil
- **Organização:** OneBoss
- **Cidade:** Sua cidade
- **Estado:** Seu estado
- **País:** BR

**IMPORTANTE:** Guarde o arquivo `oneboss-release.keystore` em local seguro!

---

## 📝 Passo 8: Configurar Gradle para Assinatura

### **Criar arquivo `android/key.properties`:**

```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=oneboss
storeFile=../oneboss-release.keystore
```

Mova `oneboss-release.keystore` para `android/`

### **Editar `android/app/build.gradle`:**

Adicione ANTES de `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dentro de `android { ... }`, adicione:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

---

## 📦 Passo 9: Gerar AAB (Android App Bundle)

No **Android Studio**:

1. **Menu → Build → Generate Signed Bundle / APK**
2. Selecione **Android App Bundle**
3. Clique **Next**
4. **Key store path:** Selecione `android/oneboss-release.keystore`
5. Preencha as senhas
6. **Build type:** Release
7. Clique **Finish**

**Ou via terminal:**

```bash
cd android
./gradlew bundleRelease
```

O AAB estará em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 Passo 10: Enviar para Google Play Console

1. Acesse: https://play.google.com/console
2. Crie um novo app
3. Preencha informações:
   - **Nome:** OneBoss Brasil
   - **Categoria:** Shopping
   - **Idioma:** Português (Brasil)

4. **Configuração do App:**
   - Política de privacidade: https://onebossbrasil.com.br/privacidade
   - Dados de cancelamento: https://onebossbrasil.com.br/cancelar
   - Classificação de conteúdo: Preencher formulário

5. **Upload do AAB:**
   - Vá em: **Release → Production → Create new release**
   - Faça upload do `app-release.aab`
   - Preencha notas da versão
   - Clique em **Review release**

6. **Assets necessários:**
   - Ícone: 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots: Mínimo 2 (recomendado 8)
     - 16:9 ou 9:16
     - Resolução mínima: 320px

---

## 🎯 Comandos Rápidos (Resumo)

```bash
# 1. Build React
npm run build

# 2. Sincronizar com Android
npx cap sync

# 3. Abrir Android Studio
npx cap open android

# 4. Gerar AAB (no Android Studio ou terminal)
cd android && ./gradlew bundleRelease
```

---

## 🐛 Problemas Comuns

### **Erro: "SDK location not found"**
Solução: Crie `android/local.properties`:
```
sdk.dir=C:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### **Erro: "Java version incompatível"**
Solução: Instale Java JDK 17 e configure JAVA_HOME.

### **App não abre (tela branca)**
Solução: Verifique `capacitor.config.json` → `webDir` está correto (`dist` ou `build`).

### **Erro ao fazer upload no Play Console**
Solução: Incremente `versionCode` em `android/app/build.gradle`:
```gradle
versionCode 2  // era 1
versionName "1.0.1"  // era "1.0.0"
```

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] Android Studio instalado e configurado
- [ ] Java JDK 17 instalado
- [ ] Capacitor instalado (`@capacitor/android`)
- [ ] Build React gerado (`npm run build`)
- [ ] Ícones adicionados (todos os tamanhos)
- [ ] Keystore criado e configurado
- [ ] AAB gerado com sucesso
- [ ] Screenshots tirados (mínimo 2)
- [ ] Política de privacidade publicada
- [ ] Dados de cancelamento publicados

---

## 📞 Suporte

Se encontrar erros, verifique:
1. **Logs do Gradle:** Android Studio → Build → View Logs
2. **Logs do dispositivo:** `npx cap run android --livereload`
3. **Console do navegador:** No app, inspecione com Chrome DevTools

**Boa sorte com o lançamento! 🚀**
