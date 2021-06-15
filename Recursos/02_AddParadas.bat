@echo off
echo Obteniebndo Paradas...

C:/Users/Usuario/AppData/Local/Programs/Python/Python38-32/python.exe importacionParadas.py


echo Conexion BD

"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h 179.31.2.94 -p 5432 -d bondisuy -U webadmin -f paradas.sql -W -o paradas.log

echo Fin del Proceso.
echo ver paradas.log
pause
