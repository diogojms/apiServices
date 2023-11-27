FROM node:18

# Create app directory
WORKDIR /usr/src/service/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8084
CMD [ "node", "server.js" ]

#docker build -t api-service . 
#docker run --name api-service -p 8084:8084 -d api-service