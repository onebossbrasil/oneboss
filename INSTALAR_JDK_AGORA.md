# ⚡ INSTALAR JDK 17 AGORA - 3 Passos

## ❗ OBRIGATÓRIO PARA GERAR O AAB

---

## 📥 PASSO 1: Baixar JDK 17 (2 minutos)

### Clique neste link:
👉 **https://adoptium.net/temurin/releases/?version=17**

### Na página, selecione:
- **Operating System:** Windows ✅
- **Architecture:** x64 ✅
- **Package Type:** JDK ✅
- **Version:** 17 - LTS ✅

### Baixe o arquivo:
```
OpenJDK17U-jdk_x64_windows_hotspot_17.x.x_x.msi
```

**Tamanho:** ~180 MB
**Tempo de download:** 1-3 minutos

---

## 🔧 PASSO 2: Instalar JDK (3 minutos)

1. **Execute o arquivo .msi baixado**
2. **Clique "Next"**
3. **IMPORTANTE: Na tela "Custom Setup", selecione:**
   - ✅ **Set JAVA_HOME variable** (marcar)
   - ✅ **JavaSoft (Oracle) registry keys** (marcar)
   - ✅ **Add to PATH** (marcar)

4. **Clique "Next" até finalizar**
5. **Aguarde instalação** (~1 minuto)
6. **Clique "Finish"**

---

## ✅ PASSO 3: Verificar Instalação (1 minuto)

### Abra um NOVO terminal (CMD ou PowerShell)
**⚠️ IMPORTANTE: Feche e abra um novo terminal!**

### Execute:
```bash
java -version
```

### ✅ Resultado esperado:
```
openjdk version "17.0.12" 2024-07-16
OpenJDK Runtime Environment Temurin-17.0.12+7 (build 17.0.12+7)
OpenJDK 64-Bit Server VM Temurin-17.0.12+7 (build 17.0.12+7, mixed mode, sharing)
```

### Verificar JAVA_HOME:
```bash
echo %JAVA_HOME%
```

### ✅ Resultado esperado:
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot\
```

---

## 🎯 SE TUDO ACIMA FUNCIONOU:

✅ **JDK instalado com sucesso!**
✅ **Volte ao terminal do projeto**
✅ **Execute os próximos comandos**

---

## ⏭️ PRÓXIMOS PASSOS (após instalar JDK):

```bash
# 1. Gerar keystore
.\generate-keystore.bat

# 2. Gerar AAB
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease && cd ..

# 3. Localizar AAB
start android\app\build\outputs\bundle\release
```

---

## 🆘 PROBLEMAS?

### "java -version" ainda não funciona
**Solução:**
1. Fechar TODOS os terminais abertos
2. Abrir um NOVO terminal
3. Tentar novamente

### JAVA_HOME não aparece
**Solução:**
1. Desinstalar JDK
2. Reinstalar marcando a opção "Set JAVA_HOME"
3. Reiniciar computador (último recurso)

---

## 📥 LINK DIRETO DO DOWNLOAD:

**Windows x64 JDK 17 (LTS):**
https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.12%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.12_7.msi

**Tamanho:** 188 MB
**Tempo total:** 5-10 minutos

---

**INSTALE AGORA E VOLTE AQUI! ⚡**
