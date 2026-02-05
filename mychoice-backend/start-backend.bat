@echo off
echo ========================================
echo MyChoice Backend - Java 17 + Spring Boot 3.2
echo ========================================
echo.
echo Lancement du backend modernise...
echo.

cd /d %~dp0
java -jar target\MyChoice.war --server.port=9090

pause
