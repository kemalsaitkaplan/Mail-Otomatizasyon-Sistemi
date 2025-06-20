FROM node:20

# Uygulama dizini (compose ile uyumlu olacak)
WORKDIR /mail-system-service

# Paketleri kur
COPY package*.json ./
RUN npm install
RUN npm install express mongoose redis amqplib node-cron dotenv


# Kodları kopyala
COPY . .

# Geliştirme aracı: nodemon
RUN npm install -g nodemon

# Port aç
EXPOSE 3000

# Uygulama başlat (hot-reload için)
#CMD ["nodemon", "--legacy-watch", "index.js"]


# Üretim ortamında çalışacaksa, bu satırı kullanabilirsiniz:
# CMD ["node", "index.js"]

