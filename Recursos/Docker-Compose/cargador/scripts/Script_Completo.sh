#!/bin/bash

echo "Espera cargador"
sleep 60
echo "Inicia cargador"

# Carga la bd

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/armadobase.sql

# Actualización de tablas Paradas y Recorridos con atributo geom - Ya no es mas necesario
# PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/updateGeom.sql

# Carga de Paradas

#python3 /scripts/importacionParadas.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/paradas.sql
#PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/paradas-dummy.sql


# Inserción de Líneas y Recorridos

#python3 /scripts/importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/lineas.sql
PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/recorridos.sql
#PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/lineas-dummy.sql
#PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/recorridos-dummy.sql


# Carga de Horarios

#python3 /scripts/importacionHorarios.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/horarios.sql
#PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/horarios-dummy.sql
