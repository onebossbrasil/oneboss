@echo off
echo ================================
echo Gerando AAB para OneBoss...
echo ================================
echo.

REM Configurar JAVA_HOME
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME: %JAVA_HOME%
echo.
echo Verificando Java...
java -version
echo.

echo Entrando na pasta android...
cd android

echo.
echo Executando gradlew bundleRelease...
echo Isso pode demorar 5-15 minutos na primeira vez...
echo.

gradlew.bat bundleRelease

echo.
echo ================================
echo Build concluído!
echo ================================
echo.
echo AAB gerado em:
echo android\app\build\outputs\bundle\release\app-release.aab
echo.

cd ..
pause
