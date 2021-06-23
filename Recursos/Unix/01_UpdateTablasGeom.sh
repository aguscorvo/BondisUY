#!/bin/bash

# Actualización de tablas Paradas y Recorridos con atributo geom

PGPASSWORD=postgis psql -h localhost -p 5432 -d tsig -U postgis -f updateGeom.sql
