#docker hubdan node:20-alpine imageni yuklab ol va unga build degan nom ber
FROM node:20-alpine AS build

#image ni ichidagi app papkasiga o't yoki yaratib keyin o't
WORKDIR /app

#hozirgi clone qilingan resourcelardan package.json va package-lock.json ni /app ko'chir
COPY package.json package-lock.json ./

#shu bo'yicha dependencielarni o'rnat, aniq versiyalari bilan
RUN npm ci

#qolgan fayllarni ham ko'chir.
COPY . .

#build qil
RUN npm run build

#dev dependencielarni node modulesdan chiqarib yubor
RUN npm prune --omit=dev


#yana dcker hub dan node:20-alpine imageni yuklab ol
FROM node:20-alpine

#uning ichiga kirib /app degan folder yarat yoki bo'lsa ichiga o't
WORKDIR /app

# buni tushunmadim.
ENV NODE_ENV=production

#build dan /app/package.json ni hozirgi /app ga ko'chir
COPY --from=build /app/package.json ./

#build dan /app/node_modules ni hozirgi app/node_modules ga ko'chir
COPY --from=build /app/node_modules ./node_modules

#build dan /app/dist ni hozirgi  /app/dist ga ko'chir
COPY --from=build /app/dist ./dist

#build dan /app/migrations ni hozirgi  app/migrations ga ko'chir
COPY --from=build /app/migrations ./migrations

COPY --from=build /app/seeds ./seeds

#foydalanuvchi node bo'lsin
USER node

#3000 portda ishga tushsin
EXPOSE 3000

#oxiri main.js ni ishga tushir
CMD ["node", "dist/src/main.js"]