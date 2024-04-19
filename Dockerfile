FROM node:18.18.0

WORKDIR /the/workdir/path

COPY package*.json ./
COPY prisma ./prisma/ 


RUN npm install
RUN npx prisma generate

COPY . .

CMD ["npm", "start", "dev"]
