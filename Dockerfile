FROM node:12.6.0-alpine

WORKDIR /app

COPY . /app

RUN apk --no-cache add curl bind-tools

RUN yarn install --non-interactive --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "start"]
