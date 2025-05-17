FROM php:8.2-cli

# Set working directory
WORKDIR /code

# Install Node.js (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update && apt-get install -y \
    nodejs \
    git \
    unzip

# Install Composer
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

RUN useradd -m student
USER student

RUN php -v && node -v && npm -v

CMD ["php", "solution.php"]
