FROM php:8.1-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    nodejs \
    npm \
    # more dependencies as needed
    && rm -rf /var/lib/apt/lists/*

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install test frameworks
RUN composer global require phpunit/phpunit
RUN npm install --global jest # or mocha, etc.

WORKDIR /var/www/html

# Entry point for running the tests
CMD ["bash"]
