





--------------------------------------

Despliegue con Docker-Compose

Para desplegar el ambiente con Docker, hay que entrar a la carpeta Docker-Compose y una vez dentro, ejecutar el comando:
docker-compose up

Esto permite levantar contenedores de Wildfly, Postgres (con Postgis) y Geoserver con todo configurado, pero no con las capas de Geoserver publicadas, ya que no logramos automatizar eso por falta de tiempo. La publicación de dichas capas debe hacerse manualmente. 

La carga de datos sí se logró automatizar, a partir de la información que trae el SIG de la intendencia de Montevideo. Por ende, el proceso de despliegue puede demorar dado que ejecuta automáticamente los scripts sql que normalmente habría que correr a mano.
