@echo off
cd /d %~dp0
echo ========================================
echo MyChoice - Build complet
echo Java 17 + Spring Boot 3.2.12 + Vue.js 3.5
echo ========================================
echo.
echo Compilation en cours...
echo Cela peut prendre 2-3 minutes (build frontend + backend)
echo.

call mvn clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD REUSSI !
    echo ========================================
    echo.
    echo WAR genere : target\MyChoice.war
    echo.
    echo Pour demarrer le backend :
    echo   java -jar target\MyChoice.war
    echo.
) else (
    echo.
    echo ========================================
    echo ERREUR DE BUILD
    echo ========================================
    echo.
)

pause
