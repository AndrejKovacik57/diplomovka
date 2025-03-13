# Diplomovka


## Rozbehnutie
### 1. Príprava .env súborov
v root priečinku a backend priečinku je potrebne vytvoriť .env file z .env.example
v backend/.env je potrebne vyplniť údaje pre databázu a redis password

### 2. Spustenie dockera
1. cd backend
2. php artisan key:generate
3. docker compose up --build -d
4. docker compose exec app php artisan migrate

