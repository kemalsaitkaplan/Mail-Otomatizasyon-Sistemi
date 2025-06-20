const Match = require('../../models/Match');
const Message = require('../../models/Message');
const Location = require('../../models/Location');
const { client: redis } = require('../../config/redis');

// 1. Yeni eşleşme
async function shouldSendMatchNotification(userId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const match = await Match.findOne({
    $or: [{ user1Id: userId }, { user2Id: userId }],
    matchDate: { $gte: since },
    status: 'active',
  });
  return !!match;
}

// 2. Okunmamış mesaj
async function shouldSendUnreadMessageReminder(userId) {
  const msg = await Message.findOne({
    receiverId: userId,
    status: { $in: ['sent', 'delivered'] },
  });
  return !!msg;
}

// 3. Yakındaki kullanıcı (Redis ile cache'li)
async function shouldSendNearbyUserAlert(userId) {
  const userLocation = await Location.findOne({ userId });
  if (!userLocation) return false;

  const cacheKey = `nearby:${userLocation.city}:${userLocation.country}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    const result = JSON.parse(cached);
    return result.includes(userId) === false;
  }

  const nearbyUsers = await Location.find({
    userId: { $ne: userId },
    city: userLocation.city,
    country: userLocation.country,
    lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).select('userId');

  const ids = nearbyUsers.map(u => u.userId);
  await redis.set(cacheKey, JSON.stringify(ids), { EX: 1800 });

  return ids.length > 0;
}

module.exports = {
  shouldSendMatchNotification,
  shouldSendUnreadMessageReminder,
  shouldSendNearbyUserAlert,
};
