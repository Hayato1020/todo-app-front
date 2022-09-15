#nodeのバージョンを記載
FROM node:18.4.0 as build-stage

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

#本番環境
FROM nginx:stable-alpine as production-stage
# 出力フォルダを表示させる
COPY --from=build-stage ./app/dist/ /usr/share/nginx/html/
#COPY ./nginx/ /etc/nginx/conf.d/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
