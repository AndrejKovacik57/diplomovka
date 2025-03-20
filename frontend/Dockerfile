FROM node:20.19.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . /app

# Build the production assets
RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default nginx website config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# We'll rely on external nginx.conf or default site config that proxies /api.
CMD ["nginx", "-g", "daemon off;"]
