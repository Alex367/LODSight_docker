FROM php:7.2-apache-stretch

WORKDIR /var/www/html/
ADD ./dist /var/www/html/

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

RUN a2enmod rewrite
