# 🚀 Build Android - Guia Rápido

## ✅ Build Web Concluído!

O build web já foi feito com sucesso:
- ✅ `dist/` pasta criada
- ✅ Assets copiados para Android
- ✅ Capacitor sincronizado

---

## 📱 Para Fazer o Build Android

### Opção 1: Instalar Java JDK (Necessário)

O build Android precisa do Java. Escolha uma opção:

#### macOS:
```bash
# Opção A: Via Homebrew (Recomendado)
brew install openjdk@17

# Configurar JAVA_HOME
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verificar
java -version
```

#### Ou baixe manualmente:
- https://adoptium.net/ (Eclipse Temurin 17)
- Baixe e instale
- Configure JAVA_HOME apontando para a pasta de instalação

---

### Depois de Instalar o Java:

```bash
# 1. Verificar Java
java -version

# 2. Build do AAB (Play Store)
cd android && ./gradlew bundleRelease

# 3. Build do APK (Teste local)
cd android && ./gradlew assembleRelease

# O AAB ficará em:
# android/app/build/outputs/bundle/release/app-release.aab

# O APK ficará em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Opção 2: Usar Android Studio (Mais Fácil)

Se não quiser instalar Java manualmente:

```bash
# 1. Abra o projeto no Android Studio
npx cap open android

# 2. No Android Studio:
# Build → Generate Signed Bundle / APK
# → Selecione "Android App Bundle"
# → Selecione o keystore criado
# → Build

# Pronto! AAB gerado automaticamente
```

Android Studio já vem com Java incluído! 🎉

---

## 📦 Resumo dos Arquivos

### Build Web (Concluído ✅)
```
dist/
├── index.html
├── assets/
│   ├── index-B0bVF29S.css  (106 KB)
│   └── index-CGjCNuuH.js   (938 KB)
```

### Build Android (Precisa fazer)
```
android/app/build/outputs/
├── bundle/release/
│   └── app-release.aab  ← Para Play Store
└── apk/release/
    └── app-release.apk  ← Para instalar manualmente
```

---

## 🔑 Lembrete: Keystore

Você já criou a keystore antes:
```
oneboss-release-key.keystore
Senha: oneboss2024
Alias: oneboss
```

Se o Android Studio pedir, use essas credenciais!

---

## ⚡ Comandos Rápidos

```bash
# Build completo (web + Android)
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease

# Apenas AAB
cd android && ./gradlew bundleRelease

# Apenas APK
cd android && ./gradlew assembleRelease

# Abrir no Android Studio
npx cap open android
```

---

## 🎯 Próximos Passos

1. **Instale o Java JDK 17** (se ainda não tem)
2. **Execute:** `cd android && ./gradlew bundleRelease`
3. **AAB será gerado em:** `android/app/build/outputs/bundle/release/`
4. **Faça upload para Play Console!**

---

**O build web já está pronto! Agora só falta o Java para fazer o build Android.** 🚀
