FROM node:10.16.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install packages and setup application
COPY package.json /usr/src/app
RUN npm config set @bit:registry https://node.bitsrc.io
RUN npm install --silent
COPY . /usr/src/app

EXPOSE 3000
