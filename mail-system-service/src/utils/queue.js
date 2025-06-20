const amqp = require('amqplib');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(url, queueName, delay = 10000) {
  while (true) {
    try {
      console.log("RabbitMQ bağlantısı deneniyor...");
      const conn = await amqp.connect(url);
      const channel = await conn.createChannel();
      await channel.assertQueue(queueName, { durable: true });
      console.log("RabbitMQ bağlantısı başarılı!");
      return { conn, channel };
    } catch (err) {
      console.log("Bağlantı başarısız:", err.message);
      console.log(`${delay / 1000} saniye sonra tekrar denenecek...`);
      await wait(delay);
    }
  }
}

async function connectRabbit(url, queuelName) {
  try {
    const connection = await amqp.connect(url);
    const channel    = await connection.createChannel();
    await channel.assertQueue(queuelName, { durable: true });
    console.log("RabbitMQ bağlantısı başarılı!");
    return { connection, channel};
  } catch (err) {
    console.log("Bağlantı başarısız!");
    return undefined
  }
}

async function sendToQueue(channel, queuelName, data, priority = 5) {
  if (!channel) throw new Error("Channel yok, önce connectQueue çağır!");
  channel.sendToQueue(queuelName, Buffer.from(JSON.stringify(data)),{ priority });
}

module.exports = {
  connectWithRetry,
  connectRabbit,
  sendToQueue,
};