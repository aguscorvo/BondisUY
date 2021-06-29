#!/bin/bash

# Espera que Wildfly termine de deployar
  until curl -sSf http://docker-compose_wildfly_1:8080/bondisuy-web/Bondisuy &> /dev/null; do
    echo "Esperando que Wildfly termine de deployar"
    sleep 2
  done

# Actualización de tablas Paradas y Recorridos con atributo geom

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/updateGeom.sql


# Carga de Paradas

#python3 /scripts/importacionParadas.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/paradas.sql


# Inserción de Líneas y Recorridos

#python3 /scripts/importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/lineas.sql
PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/recorridos.sql


# Carga de Horarios

#python3 /scripts/importacionHorarios.py

PGPASSWORD=postgis psql -h docker-compose_postgis_1 -p 5432 -d tsig -U postgis -f /scripts/horarios.sql
