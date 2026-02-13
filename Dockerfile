# -------------------------
# Stage 1: PHP Dependencies
# -------------------------
FROM php:8.3-fpm-alpine AS base

WORKDIR /app

# Install system packages
RUN apk add --no-cache \
    ca-certificates \
    dcron \
    curl \
    git \
    unzip \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev \
    gmp-dev \
    oniguruma-dev \
    autoconf \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-configure zip \
    && docker-php-ext-install \
        bcmath \
        gd \
        pdo \
        pdo_pgsql \
        zip \
        intl \
        sockets \
        gmp

# Install Redis
RUN pecl install redis \
    && docker-php-ext-enable redis

# Cleanup build deps
RUN apk del autoconf make g++ gcc libc-dev linux-headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first (better caching)
COPY composer.json composer.lock ./

RUN composer install --no-dev --no-scripts --no-autoloader

# Copy project
COPY . .

RUN composer install --no-dev --optimize-autoloader


# -------------------------
# Stage 2: Node Build
# -------------------------
FROM node:22-alpine AS nodebuild

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
COPY --from=base /app/vendor /app/vendor

RUN npm run build


# -------------------------
# Stage 3: Production Image
# -------------------------
FROM php:8.3-cli-alpine AS production

WORKDIR /app

# Install runtime packages
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng \
    libxml2 \
    libzip \
    icu \
    gmp

# Install PHP extensions again (runtime)
RUN docker-php-ext-install \
    bcmath \
    gd \
    pdo \
    pdo_pgsql \
    zip \
    intl \
    sockets \
    gmp

# Install Redis
RUN pecl install redis \
    && docker-php-ext-enable redis

# Copy app
COPY --from=base /app /app
COPY --from=nodebuild /app/public /app/public

# Permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose Render port
EXPOSE 10000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "10000"]
