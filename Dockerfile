FROM node:14

WORKDIR /car-service-appointments
COPY package.json .
RUN npm install
COPY . .
CMD npm run start-server