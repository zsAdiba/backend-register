FROM node:latest

# Create app directory
WORKDIR /usr/src/app/backend-register-api

# Install required packages including MySQL client
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package.json /usr/src/app/backend-register-api
RUN npm install

# Bundle app source
COPY . /usr/src/app/backend-register-api
CMD ["node", "server.js"]