# ⚡ EXECUTAR AGORA - 2 Comandos Finais

## ✅ JÁ FEITO POR MIM:
- ✅ JDK 17 instalado
- ✅ Keystore gerada (`oneboss-release-key.keystore`)
- ✅ Build web concluído (`dist/` pasta criada)
- ✅ Capacitor sincronizado com Android

---

## ⚠️ FALTA APENAS: Configurar JAVA_HOME e gerar AAB

O problema é que o JAVA_HOME precisa estar na variável de ambiente do Windows para o Gradle funcionar.

---

## 🔥 SOLUÇÃO RÁPIDA (Execute estes 2 comandos):

### OPÇÃO 1: Abrir um NOVO PowerShell e executar:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
cd C:\Users\inaci\Desktop\Cursor\OneBoss\android
.\gradlew.bat bundleRelease
```

**Copie e cole TUDO de uma vez no PowerShell!**

---

### OPÇÃO 2: Executar o script batch que criei:

1. Abrir Explorador de Arquivos
2. Navegar até: `C:\Users\inaci\Desktop\Cursor\OneBoss\`
3. Clicar duas vezes em: **`build-aab.bat`**
4. Aguardar (5-15 minutos na primeira vez)

---

### OPÇÃO 3: Configurar JAVA_HOME permanentemente (Recomendado):

#### Passo 1: Abrir Variáveis de Ambiente
1. Pressionar `Win + R`
2. Digitar: `sysdm.cpl`
3. Enter
4. Aba "Avançado"
5. Botão "Variáveis de Ambiente"

#### Passo 2: Adicionar JAVA_HOME
1. Em "Variáveis do sistema", clicar "Novo"
2. Nome da variável: `JAVA_HOME`
3. Valor da variável: `C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot`
4. OK

#### Passo 3: Adicionar ao PATH
1. Em "Variáveis do sistema", selecionar "Path"
2. Clicar "Editar"
3. Clicar "Novo"
4. Adicionar: `%JAVA_HOME%\bin`
5. OK em tudo

#### Passo 4: Reiniciar terminal
1. Fechar TODOS os terminais/CMD/PowerShell abertos
2. Abrir um NOVO terminal
3. Executar:
```bash
cd C:\Users\inaci\Desktop\Cursor\OneBoss\android
gradlew.bat bundleRelease
```

---

## ⏱️ TEMPO ESPERADO:

**Primeira vez:** 5-15 minutos (baixa dependências do Android)
**Próximas vezes:** 1-3 minutos

---

## 📁 LOCALIZAÇÃO DO AAB FINAL:

Após o build, o AAB estará em:

```
C:\Users\inaci\Desktop\Cursor\OneBoss\android\app\build\outputs\bundle\release\app-release.aab
```

---

## ✅ COMO SABER QUE DEU CERTO:

Você verá no final do terminal:

```
BUILD SUCCESSFUL in XXs
```

E o arquivo `app-release.aab` existirá na pasta mencionada acima.

---

## 🎯 RECOMENDAÇÃO:

**Use a OPÇÃO 2 (clicar duas vezes em `build-aab.bat`)** - É o mais fácil!

Ou se preferir controle total, use a OPÇÃO 3 para configurar permanentemente.

---

## 📤 DEPOIS DO BUILD:

1. Localizar o AAB:
   ```
   C:\Users\inaci\Desktop\Cursor\OneBoss\android\app\build\outputs\bundle\release\app-release.aab
   ```

2. **Este é o arquivo para fazer upload no Play Console!**

3. Tamanho esperado: ~15-50 MB

4. Upload no Play Console:
   - Menu: Produção → Releases → Produção
   - Criar nova versão
   - Upload do `app-release.aab`
   - Preencher notas da versão (copiar de `TEXTOS_PLAY_STORE.md`)
   - Enviar para revisão

---

## 🔒 INFORMAÇÕES DA KEYSTORE (já criada):

```
Arquivo: oneboss-release-key.keystore
Localização: C:\Users\inaci\Desktop\Cursor\OneBoss\oneboss-release-key.keystore

Senhas:
- Keystore Password: oneboss2024
- Key Alias: oneboss
- Key Password: oneboss2024

⚠️ FAÇA BACKUP DESTE ARQUIVO!
```

---

## 🎨 ASSETS QUE AINDA PRECISA CRIAR:

### 1. Ícone 512x512 PNG
- Ver: `CONVERTER_ICONE_AGORA.md`
- Link rápido: https://convertio.co/ico-png/
- Arquivo original: `public/Icone-oneboss.ico`

### 2. Screenshots (mínimo 2)
- Tamanho: 1080x1920 px
- Use: https://mockuphone.com/
- Ou tire screenshots do emulador Android

### 3. Feature Graphic (opcional mas recomendado)
- Tamanho: 1024x500 px
- Use: https://www.canva.com/

---

## 🆘 SE DER ERRO:

### "BUILD FAILED"
1. Limpar build:
   ```bash
   cd android
   gradlew.bat clean
   gradlew.bat bundleRelease
   ```

### "Could not find tools.jar"
- JAVA_HOME não configurado corretamente
- Seguir OPÇÃO 3 acima

### Outro erro
- Copiar mensagem de erro
- Consultar `PASSO_A_PASSO_PUBLICACAO.md` → seção Troubleshooting

---

**EXECUTE AGORA E O AAB ESTARÁ PRONTO! 🚀**
