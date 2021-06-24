#!/bin/bash

# Espera que Wildfly termine de deployar
  until curl -sSf http://docker-compose_wildfly_1:8080 &> /dev/null; do
    echo "Esperando que Wildfly termine de deployar"
    sleep 2
  done

# Actualización de tablas Paradas y Recorridos con atributo geom

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f updateGeom.sql


# Carga de Paradas

#python3 importacionParadas.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f paradas.sql


# Inserción de Líneas y Recorridos

#python3 importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f lineas.sql
PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f recorridos.sql


# Carga de Horarios

#python3 importacionHorarios.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f horarios.sql
