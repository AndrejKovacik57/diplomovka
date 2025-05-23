FROM php:8.2-cli

WORKDIR /var/www/html
# Update package list and install dependencies
RUN apt-get update && apt-get install -y \
build-essential \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libxpm-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    bash \
    fcgiwrap \
    libmcrypt-dev \
    libonig-dev \
    libpq-dev \
    inkscape \
    iputils-ping \
    libldap2-dev \
    libssl-dev \
    git build-essential pkg-config zlib1g-dev libprotobuf-dev \
    libnl-3-dev libcap-dev libseccomp-dev \
    libtool automake \
    libboost-all-dev \
    python3 python3-pip \
    flex bison \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-configure ldap \
    && docker-php-ext-install gd pdo pdo_pgsql mbstring zip exif pcntl bcmath opcache ldap

# Install Redis extension
RUN pecl install redis \
    && docker-php-ext-enable redis \

# Clone and build nsjail
RUN git clone https://github.com/google/nsjail /opt/nsjail \
    && cd /opt/nsjail \
    && make \
    && cp nsjail /usr/local/bin/nsjail


# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"


# Optional: Node.js for JS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Setup
# Create sandbox folders
RUN mkdir -p /sandbox
RUN mkdir -p /sandbox/test && chown -R www-data:www-data /sandbox

# Copy PHP binary
RUN mkdir -p /sandbox/usr/local/bin
RUN cp /usr/local/bin/php /sandbox/usr/local/bin/php
RUN mkdir -p /sandbox/lib64

# Copy all dependent shared libraries using ldd
RUN bash -c "ldd /usr/local/bin/php | awk '{if (\$3 ~ /^\\//) print \$3}' | while read lib; do \
    mkdir -p \"/sandbox\$(dirname \$lib)\" && cp -v \"\$lib\" \"/sandbox\$lib\"; \
done"

# Copy the dynamic linker (typically in /lib64)
RUN cp -v /lib64/ld-linux-x86-64.so.2 /sandbox/lib64/

# Ensure /sandbox/usr/bin exists
RUN mkdir -p /sandbox/usr/bin

# Copy Node.js binary
RUN cp /usr/bin/node /sandbox/usr/bin/node

# Copy Node.js dependencies
RUN bash -c "ldd /usr/bin/node | awk '{if (\$3 ~ /^\\//) print \$3}' | while read lib; do \
    mkdir -p \"/sandbox\$(dirname \$lib)\" && cp -v \"\$lib\" \"/sandbox\$lib\"; \
done"



COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
