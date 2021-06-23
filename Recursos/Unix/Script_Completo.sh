#!/bin/bash

# Actualización de tablas Paradas y Recorridos con atributo geom

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f updateGeom.sql


# Carga de Paradas

python importacionParadas.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f paradas.sql


# Inserción de Líneas y Recorridos

python importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f lineas.sql
PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f recorridos.sql


# Carga de Horarios

python importacionHorarios.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f horarios.sql
