const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.error('Redis hatası:', err));
client.on('connect', () => console.log('Redis bağlantısı kuruldu.'));

const connectRedis = async () => {
  if (!client.isOpen) await client.connect();
};

module.exports = {
  client,
  connectRedis,
};
