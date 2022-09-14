#nodeのバージョンを記載
FROM node:18.4.0

WORKDIR /app

COPY . .

RUN npm install -g npm @vue/cli

RUN npm run build

CMD [ "http-server", "dist" ]
