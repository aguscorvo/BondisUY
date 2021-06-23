#!/bin/bash

# Inserción de Líneas y Recorridos

python importacionLineaRecorrido.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f lineas.sql
PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f recorridos.sql
