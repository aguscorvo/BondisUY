#!/bin/bash
  until curl -sSf http://localhost:333 &> /dev/null; do
    echo "Esperando que Wildfly termine de deployar"
    sleep 1
  done
