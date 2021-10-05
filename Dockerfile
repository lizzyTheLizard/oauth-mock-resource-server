#Download the prod dependencies
FROM node:latest as prodDependencies
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --omit=optional --omit=dev

#Build the app, therefore we need also the dev dependencies
FROM node:latest as appbuild
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY --from=prodDependencies /app/node_modules ./node_modules
RUN npm install
COPY ./tsconfig.json ./
COPY ./src ./src
RUN npm run build

#Run the app, therefore we copy the build output but download only the prod dependencies
FROM node:latest
WORKDIR /app
COPY package.json ./
COPY --from=prodDependencies /app/node_modules ./node_modules
COPY --from=appbuild /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production 
CMD npm start