@echo off
echo Gerando Keystore para OneBoss...
echo.
echo IMPORTANTE: Guarde a senha em local seguro!
echo Senha do Keystore: oneboss2024
echo Senha da Key: oneboss2024
echo.

keytool -genkey -v -keystore oneboss-release-key.keystore -alias oneboss -keyalg RSA -keysize 2048 -validity 10000 -storepass oneboss2024 -keypass oneboss2024 -dname "CN=OneBoss, OU=Development, O=OneBoss, L=Unknown, ST=Unknown, C=BR"

echo.
echo Keystore gerado com sucesso!
echo Local: oneboss-release-key.keystore
echo.
pause
