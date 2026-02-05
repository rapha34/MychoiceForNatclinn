@echo off
cd /d %~dp0
echo Testing MyChoice Backend - Java 17 + Spring Boot 3.2.12
echo.
java -version
echo.
echo Starting backend...
echo.
java -jar target\MyChoice.war 
pause
