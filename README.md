# Diplomová práca – Rozbehnutie projektu

## Obsah
- [Príprava `.env` súborov](#príprava-env-súborov)
- [Lokálny vývoj](#lokálny-vývoj)
    - [Backend](#backend)
    - [Frontend](#frontend)
- [Deploy na server](#deploy-na-server)

---

## Príprava `.env` súborov

### Root a Frontend
Skopíruj `.env.example` ako `.env`:
- **root** priečinku - možeš zmeniť údaje
- **frontend** priečinku - VITE_API_BASE_URL lokálne bude http://localhost:8000 a pre server to musi byť prázdne


### Backend
1. Skopíruj `.env.example` ako `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Vyplň v ňom tieto hodnoty:
    - `APP_URL`= lokalne `http://localhost` na servery `http://node20.webte.fei.stuba.sk/`
    - `APP_FRONTEND_URL`= lokálne `http://localhost:3000` na servery `http://node20.webte.fei.stuba.sk/`
    - `DB_HOST=db` lokálne alebo `postgres` na serveri
    - `GOOGLE_CALLBACK_REDIRECT`= lokálne `http://localhost:8000/auth/google` na servery `http://node20.webte.fei.stuba.sk/auth/google`
    -  `REDIS_HOST=redis`

### Google OAuth konfigurácia
1. Prejdi na [Google Cloud Console](https://console.cloud.google.com)
2. Prihlás sa a zvoľ projekt (alebo vytvor nový)
3. V ľavom menu vyber **APIs & Services > Credentials**
4. Vytvor OAuth 2.0 Client ID:
    - **Authorized JavaScript origins**: `http://localhost:3000` `http://node20.webte.fei.stuba.sk`
    - **Authorized redirect URIs**: `http://localhost:8000/auth/google` `http://node20.webte.fei.stuba.sk/auth/google`
5. Skopíruj `Client ID` a `Client Secret` a vlož ich do `.env` backendu

---

## Lokálny vývoj

### Backend
```bash
docker compose up --build -d
docker compose exec app php artisan migrate
docker compose exec app php artisan key:generate
```
> 🛠 PgAdmin beží na: [http://localhost:5050](http://localhost:5050)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Deploy na server
```bash
sudo docker compose -f docker-compose-deploy.yaml up -d --build
sudo docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
```
> 🛠 PgAdmin beží na: [http://node20.webte.fei.stuba.sk/pgadmin/login?next=/](http://node20.webte.fei.stuba.sk/pgadmin/login?next=/)
---

Ǔdaje od učiteľa na servery sú ucitel@ucitel.sk, Heslo123!
Cez smtp sa dá nastaviť mailer.

✅ Projekt by mal byť teraz úspešne nasadený a pripravený na používanie.