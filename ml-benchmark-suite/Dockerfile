FROM node:18-alpine
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "-l", "3000", "build"]