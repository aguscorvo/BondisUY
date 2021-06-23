#!/bin/bash

# Carga de Horarios

python importacionHorarios.py

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f horarios.sql
