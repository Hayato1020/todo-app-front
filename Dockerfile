#nodeのバージョンを記載
FROM node:18.4.0

WORKDIR /app

COPY . .

RUN npm install -g npm @vue/cli

RUN npm run build

#本番環境
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
