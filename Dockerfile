FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN cd client && yarn install && yarn build && cd ../api && yarn install
EXPOSE 5000
CMD [ "node", "api/index.js" ]
