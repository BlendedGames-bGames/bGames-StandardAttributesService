FROM node:lts-alpine
WORKDIR /usr/src/app
COPY bGames-StandardAttributesService/package*.json ./
RUN npm install
COPY bGames-StandardAttributesService ./
RUN ls -l
CMD ["npm", "run", "prod"]