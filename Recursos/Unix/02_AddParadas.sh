#!/bin/bash

# Carga de Paradas

python importacionParadas.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f paradas.sql
