FROM node:12-alpine as step01
WORKDIR /loyalty_web/src
COPY ./package.json /loyalty_web/src/package.json
RUN npm install
COPY . /loyalty_web/src
RUN npm run build

FROM nginx:1.13.6
WORKDIR /usr/share/nginx/html
COPY --from=step01 /loyalty_web/src/dist .
