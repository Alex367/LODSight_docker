FROM php:7.1-apache-stretch

WORKDIR /var/www/html/
ADD . /var/www/html/

# Hack for debian-slim to make the jdk install work below.
RUN mkdir -p /usr/share/man/man1

# repo needed for jdk install below.
RUN echo 'deb http://deb.debian.org/debian stretch-backports main' > /etc/apt/sources.list.d/backports.list

# Update image & install application dependant packages.
RUN set -e \
    && apt-get update && apt-get install -y \
    nano \
    libxext6 \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libmcrypt-dev \
    libxslt-dev \
    libpcre3-dev \
    libxrender1 \
    libfontconfig \
    uuid-dev \
    ghostscript \
    curl \
    wget \
    ca-certificates-java

RUN set -e \
    && apt-get -t stretch-backports install -y openjdk-8-jre-headless \
    && update-alternatives --set java /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java


RUN set -e \
    && apt-get update \
    && apt-get install -y cron \
    && apt-get install -y less

# create cron log
RUN touch /var/log/cron.log && chmod 777 /var/log/cron.log

# add crontab file
ADD cron_setup /etc/cron.d/cron_setup
RUN chmod 777 /etc/cron.d/cron_setup
RUN /usr/bin/crontab /etc/cron.d/cron_setup

RUN set -e \
    && mkdir -p /var/www/html/done && chmod -R 777 /var/www/html/done \
    && mkdir -p /var/www/html/todo && chmod -R 777 /var/www/html/todo \
    && mkdir -p /var/www/html/logs && chmod -R 777 /var/www/html/logs \
    && mkdir -p /var/www/html/logs/err && chmod -R 777 /var/www/html/logs/err

