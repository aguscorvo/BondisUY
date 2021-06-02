@echo off

"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h 179.31.2.94 -p 5432 -d bondisuy -U webadmin -f horarios.sql >> horarios.log

pause
