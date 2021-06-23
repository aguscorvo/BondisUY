#!/bin/bash

# Actualización de tablas Paradas y Recorridos con atributo geom

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f updateGeom.sql


# Carga de Paradas

python3 /scripts/importacionParadas.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f paradas.sql


# Inserción de Líneas y Recorridos

python3 /scripts/importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f lineas.sql
PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f recorridos.sql


# Carga de Horarios

#python3 /scripts/importacionHorarios.py

#PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f horarios.sql
