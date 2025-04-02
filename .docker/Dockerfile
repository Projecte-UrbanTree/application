# .docker/php/Dockerfile
FROM php:8.2-fpm-buster AS base

# Instalar dependencias
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpq-dev libonig-dev libxml2-dev zip curl \
    && docker-php-ext-install pdo pdo_mysql zip \
    && docker-php-ext-enable opcache

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

##############################
# 1. COMPOSER DEPENDENCIAS
##############################
FROM base AS composer-deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .

RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

##############################
# 2. NODE / VITE BUILD
##############################
FROM node:18-bullseye AS vite-builder
WORKDIR /app
COPY package*.json vite.config.js ./
RUN npm install
COPY . .
RUN npm run build

##############################
# 3. PRODUCCIÓN FINAL
##############################
FROM base AS production
COPY --from=composer-deps /var/www/html/vendor /var/www/html/vendor
COPY --from=composer-deps /var/www/html/artisan /var/www/html/artisan
COPY --from=vite-builder /app/public/build /var/www/html/public/build
COPY . /var/www/html

RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Configuración Supervisor para workers
COPY .docker/php/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
RUN apt-get update && apt-get install -y supervisor

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]
