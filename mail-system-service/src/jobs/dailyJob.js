require('dotenv').config();
const cron = require('node-cron');
const User = require('../models/User');
const App  = require('../models/App');
const EmailTemplate   = require('../models/EmailTemplate');
const EmailSchedule   = require('../models/EmailSchedule');
const { connectRabbit, sendToQueue } = require('../utils/queue');

const triggers = require('../services/triggers/datingTriggers');

// Gelecekte diğer kategoriler de buraya eklenecek

const getPriorityForCategory = (category) => {
  switch (category) {
    case 'Dating': return 9;
    case 'Meditation': return 5;
    case 'Streaming': return 3;
    default: return 1;
  }
};

const scheduleEmails = async () => {
  console.log('Cron başladı: Kategori bazlı tetikleyiciler işleniyor...');

  const users = await User.find({ status: 'active' });

  for (const user of users) {
    const app = await App.findOne({ appId: user.appId });
    if (!app) continue;

    // DATING
    if (app.category === 'Dating') {
      const triggerList = [
        { type: 'match_notification',   check: triggers.shouldSendMatchNotification },
        { type: 'unread_message',       check: triggers.shouldSendUnreadMessageReminder },
        { type: 'nearby_alert',         check: triggers.shouldSendNearbyUserAlert },
      ];

        for (const trigger of triggerList) {
          const shouldSend = await trigger.check(user.userId);
          if (!shouldSend) continue;
        
          const template = await EmailTemplate.findOne({
            appId: app.appId,
            type: trigger.type,
          });

          if (!template) continue;

          await EmailSchedule.create({
            userId: user.userId,
            templateId: template.templateId,
            scheduledTime: new Date(),
            variables: { user: user.email },
            status: 'pending',
          });

          const rabbitMQ = await connectRabbit(process.env.RABBITMQ_URL, process.env.RABBITMQ_EMAIL_CHANNEL_NAME)
          if(rabbitMQ !== undefined){
            const  data = {
              userId: user.userId,
              email: user.email,
              templateId: template.templateId,
              subject: template.subject,
              content: template.content.replace('{{user}}', user.email),
            }

            await sendToQueue(rabbitMQ.channel,process.env.RABBITMQ_EMAIL_CHANNEL_NAME, data, getPriorityForCategory(app.category));
          }
          console.log(`${user.email} → ${trigger.type}`);
        }
      }
    }

    // TODO: Meditation ve Streaming için de benzer tetikleyiciler eklenebilir
    // Zamanim olmadigi icin simdilik biraktim
    //

    console.log('✅ Cron tamamlandı.');
  };


cron.schedule('0 0 * * *', scheduleEmails); // her gece 00:00
module.exports = scheduleEmails;
