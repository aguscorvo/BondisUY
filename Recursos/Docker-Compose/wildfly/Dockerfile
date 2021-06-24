FROM jboss/wildfly:21.0.0.Final
MAINTAINER Andres Lopez

ENV WILDFLY_HOME /opt/jboss/wildfly
ENV DEPLOY_DIR ${WILDFLY_HOME}/standalone/deployments/

# setup timezone
ENV TZ=America/Montevideo
USER root
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
USER jboss

ENV DATASOURCE_NAME java:/LaboratorioTSIG
ENV DATASOURCE_JNDI java:/LaboratorioTSIG

ENV DB_HOST docker-compose_postgis_1
ENV DB_PORT 5432
ENV DB_USER postgis
ENV DB_PASS postgis
ENV DB_NAME tsig

# create temporary deployment dir, because wars can deploy after the datasource is created
RUN mkdir /tmp/deployments
ENV DEPLOY_DIR /tmp/deployments

RUN mkdir /tmp/jboss-cli
ENV CLI_DIR /tmp/jboss-cli

COPY startWithPostgres.sh $WILDFLY_HOME/bin

USER root
RUN chown jboss:jboss $WILDFLY_HOME/bin/startWithPostgres.sh
RUN chmod 755 $WILDFLY_HOME/bin/startWithPostgres.sh
USER jboss

COPY binarios/postgresql-42.2.20.jar /tmp

ENTRYPOINT $WILDFLY_HOME/bin/startWithPostgres.sh
