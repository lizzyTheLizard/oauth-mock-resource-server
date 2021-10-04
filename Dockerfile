# Common build stage
FROM node:14.14.0-alpine3.12 as build-stage
COPY ./package.json ./app/package.json
WORKDIR /app
ENV NODE_ENV production
RUN npm install

# Production build stage
FROM build-stage as production-build-stage
COPY . ./app
ENV NODE_ENV production
CMD ["npm", "run", "start"]
EXPOSE 3000
