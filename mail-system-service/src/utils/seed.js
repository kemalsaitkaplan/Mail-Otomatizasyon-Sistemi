require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const App = require('../models/App');
const EmailTemplate = require('../models/EmailTemplate');
const Match = require('../models/Match');
const Message = require('../models/Message');
const Location = require('../models/Location');

const runSeed = async () => {
  await connectDB();

  console.log('Veritabanı temizleniyor...');
  await Promise.all([
    User.deleteMany({}),
    App.deleteMany({}),
    EmailTemplate.deleteMany({}),
    Match.deleteMany({}),
    Message.deleteMany({}),
    Location.deleteMany({})
  ]);

  console.log('Veriler ekleniyor...');

  const apps = await App.insertMany([
    {
      appId: 'app1',
      name: 'DateConnect',
      category: 'Dating',
      description: 'Flört uygulaması',
    },
    {
      appId: 'app2',
      name: 'MeditateNow',
      category: 'Meditation',
      description: 'Günlük meditasyon uygulaması',
    }
  ]);

  const users = await User.insertMany([
    {
      userId: 'u1',
      email: 'a@example.com',
      appId: 'app1',
      lastLogin: new Date(),
      createdAt: new Date(),
      status: 'active',
    },
    {
      userId: 'u2',
      email: 'b@example.com',
      appId: 'app1',
      lastLogin: new Date(),
      createdAt: new Date(),
      status: 'active',
    },
    {
      userId: 'u3',
      email: 'c@example.com',
      appId: 'app2',
      lastLogin: new Date(),
      createdAt: new Date(),
      status: 'active',
    }
  ]);

  await EmailTemplate.insertMany([
    {
      templateId: 't1',
      appId: 'app1',
      category: 'Dating',
      type: 'match_notification',
      subject: 'Yeni Eşleşme!',
      content: 'Selam {{user}}, yeni bir eşleşmen var!',
      variables: ['user'],
    },
    {
      templateId: 't2',
      appId: 'app1',
      category: 'Dating',
      type: 'unread_message',
      subject: 'Okunmamış mesajın var!',
      content: 'Hey {{user}}, seni bekleyen bir mesaj var!',
      variables: ['user'],
    },
    {
      templateId: 't3',
      appId: 'app1',
      category: 'Dating',
      type: 'nearby_alert',
      subject: 'Yakındaki biriyle tanış!',
      content: 'Merhaba {{user}}, yakınında biri var!',
      variables: ['user'],
    },
    {
      templateId: 't4',
      appId: 'app2',
      category: 'Meditation',
      type: 'daily_reminder',
      subject: 'Bugünkü meditasyonun hazır!',
      content: 'Merhaba {{user}}, bugünkü pratik seni bekliyor.',
      variables: ['user'],
    },
    {
      templateId: 't3',
      appId: 'app1',
      category: 'Dating',
      type: 'nearby_alert',
      subject: 'Yakındaki biriyle tanış!',
      content: 'Merhaba {{user}}, yakınında biri var!',
      variables: ['user'],
    },
    {
      templateId: 't4',
      appId: 'app1',
      category: 'Dating',
      type: 'profile_viewed_alert',
      subject: 'Profilin görüntülendi!',
      content: 'Hey {{user}}, biri profilini inceledi!',
      variables: ['user'],
    }
  ]);

  await Match.create({
    matchId: 'm1',
    user1Id: 'u1',
    user2Id: 'u2',
    matchDate: new Date(),
    status: 'active',
    lastInteraction: new Date(),
  });

  await Message.create({
    messageId: 'msg1',
    senderId: 'u2',
    receiverId: 'u1',
    content: 'Merhaba, nasılsın?',
    sentAt: new Date(),
    status: 'sent',
  });

  await Location.insertMany([
    {
      locationId: 'l1',
      userId: 'u1',
      coordinates: { latitude: 40.1, longitude: 29.1 },
      lastUpdated: new Date(),
      city: 'Istanbul',
      country: 'Turkey',
    },
    {
      locationId: 'l2',
      userId: 'u2',
      coordinates: { latitude: 40.2, longitude: 29.2 },
      lastUpdated: new Date(),
      city: 'Istanbul',
      country: 'Turkey',
    }
  ]);

  console.log('Test verileri başarıyla eklendi.');
};

module.exports = runSeed;
