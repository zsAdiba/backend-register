FROM node:latest

# Create app directory
WORKDIR /usr/src/app/backend-register-api

# Install app dependencies
COPY package.json /usr/src/app/backend-register-api
RUN npm install

# Bundle app source
COPY . /usr/src/app/backend-register-api
CMD ["node", "server.js"]