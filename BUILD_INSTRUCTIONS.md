# 📱 Instruções de Build - OneBoss Android

## ✅ O que já foi configurado:

1. ✅ **Capacitor instalado e inicializado**
2. ✅ **Plataforma Android adicionada**
3. ✅ **Ícone do app configurado** (Logo-oneboss.png)
4. ✅ **Splash screen configurado** (fundo preto com logo OneBoss)
5. ✅ **Gradle configurado para release**
6. ✅ **Scripts NPM criados**

---

## 🔧 Pré-requisitos

Antes de fazer o build, você precisa instalar:

### 1. **Java Development Kit (JDK)**
- Baixe e instale o JDK 17: https://adoptium.net/
- Adicione ao PATH do Windows

### 2. **Android Studio**
- Baixe: https://developer.android.com/studio
- Durante instalação, instale:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device

### 3. **Gerar Keystore** (necessário para assinar o app)
Execute o script:
```bash
generate-keystore.bat
```
**Senha:** `oneboss2024` (guarde em local seguro!)

---

## 🚀 Como fazer o Build

### Opção 1: Gerar AAB para Google Play Store (RECOMENDADO)

```bash
npm run android:sync
npm run android:bundle
```

O arquivo será gerado em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Opção 2: Gerar APK para testes

```bash
npm run android:sync
npm run android:build
```

O arquivo será gerado em:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Opção 3: Abrir no Android Studio

```bash
npm run android:open
```

Depois clique em: **Build > Generate Signed Bundle / APK**

---

## 📋 Scripts NPM Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run android:sync` | Build React + sincronizar com Android |
| `npm run android:open` | Abrir projeto no Android Studio |
| `npm run android:build` | Gerar APK release |
| `npm run android:bundle` | Gerar AAB para Play Store |

---

## 🎨 Assets Configurados

### Ícone do App
- ✅ Gerado em todas as resoluções (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- ✅ Ícone adaptativo configurado
- ✅ Fundo preto (#000000)

### Splash Screen
- ✅ Gerado para todas orientações (portrait/landscape)
- ✅ Fundo preto com logo OneBoss centralizado
- ✅ Duração: 2 segundos
- ✅ Modo fullscreen/immersive

---

## 📦 Publicação no Google Play Store

### 1. Criar conta de desenvolvedor
- Acesse: https://play.google.com/console
- Taxa única: $25 USD

### 2. Upload do AAB
- Crie novo app
- Faça upload do arquivo `app-release.aab`
- Preencha informações (descrição, screenshots, etc)

### 3. Informações necessárias
- Nome: **OneBoss**
- Package: **com.oneboss.app**
- Versão: **1.0 (versionCode 1)**

---

## 🔐 Informações de Assinatura

**⚠️ GUARDE EM LOCAL SEGURO!**

- **Keystore:** `oneboss-release-key.keystore`
- **Alias:** `oneboss`
- **Senha Keystore:** `oneboss2024`
- **Senha Key:** `oneboss2024`

**IMPORTANTE:** Se perder o keystore, não poderá atualizar o app na Play Store!

---

## 🐛 Troubleshooting

### Erro: "keytool not found"
- Instale o JDK e adicione ao PATH

### Erro: "Android SDK not found"
- Abra Android Studio
- Tools > SDK Manager
- Instale Android SDK 33+

### Erro no build
```bash
cd android
./gradlew clean
cd ..
npm run android:sync
```

---

## 📞 Próximos Passos

1. ✅ Instalar JDK + Android Studio
2. ✅ Executar `generate-keystore.bat`
3. ✅ Fazer build: `npm run android:bundle`
4. ✅ Testar no celular
5. ✅ Publicar na Play Store

---

**Data:** $(date)
**Bundle ID:** com.oneboss.app
**Nome do App:** OneBoss
