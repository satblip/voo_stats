FROM node:23-alpine

ARG build_number_ci

ENV APP_NAME voo_stats
ENV BUILD_NUMBER $build_number_ci

WORKDIR /var/www

COPY ./config /var/www/config
COPY ./src /var/www/src
COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

RUN npm ci

CMD ["npm", "start"]
