require('dotenv').config();
const { connectWithRetry } = require('../utils/queue')
const EmailLog = require('../models/EmailLog');
const connectDB = require('../config/db');

const startWorker = async () => {
  console.log('Email Worker is runnig.');
  connectDB(); 
  const res = await connectWithRetry(process.env.RABBITMQ_URL, process.env.RABBITMQ_EMAIL_CHANNEL_NAME)
  console.log('Worker kuyruğu dinlemeye başladı...');

  res.channel.consume(process.env.RABBITMQ_EMAIL_CHANNEL_NAME, async (msg) => {
    const data = JSON.parse(msg.content.toString());

    // Simüle edilmiş e-posta gönderimi
    console.log(`E-posta gönderiliyor: ${data.email} | ${data.subject}`);
    
   //  
   //
   //
   //Mail burada gonderilecek, turboSMPT kodunu koyabilirsin, Mail spama dusmez.
   //
   //

    // EmailLog kaydı
    await EmailLog.create({
      userId: data.userId,
      templateId: data.templateId,
      sentAt: new Date(),
      status: 'sent',
    });

    res.channel.ack(msg); // mesaj başarıyla işlendi
  });
};

startWorker();
