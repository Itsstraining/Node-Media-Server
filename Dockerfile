FROM node:10.15.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i
#RUN apk add ppa:jonathonf/ffmpeg-4 
#RUN apk update
RUN apk add ffmpeg 

COPY . .

EXPOSE 1935 8000

CMD ["node","app.js"]
