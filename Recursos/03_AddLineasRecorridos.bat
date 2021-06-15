@echo off
echo Obteniebndo Paradas...

C:/Users/Usuario/AppData/Local/Programs/Python/Python38-32/python.exe importacionLineaRecorrido.py


echo Conexion BD

echo Inserción de lineas
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h 179.31.2.94 -p 5432 -d bondisuy -U webadmin -f lineas.sql -W -o lineas.log

echo Inserción de recorridos
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h 179.31.2.94 -p 5432 -d bondisuy -U webadmin -f recorridos.sql -W -o recorridos.log

echo Fin del Proceso.
echo ver lineas.log
echo ver recorridos.log
pause
