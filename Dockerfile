FROM node:latest

WORKDIR /home/prellone-oauth
COPY . .

RUN npm install --production

EXPOSE 3000
CMD [ "npm", "start" ]