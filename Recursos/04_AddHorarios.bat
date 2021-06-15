@echo off
echo Obteniebndo Paradas...

C:/Users/Usuario/AppData/Local/Programs/Python/Python38-32/python.exe importacionHorarios.py


echo Conexion BD

echo Inserción de horarios
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h 179.31.2.94 -p 5432 -d bondisuy -U webadmin -f horarios.sql -W >> horarios.log 2>&1

echo Fin del Proceso.
echo ver horarios.log
pause
