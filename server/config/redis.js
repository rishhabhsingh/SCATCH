const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
  lazyConnect: true,
  tls: {},
})

redis.on('connect', () => console.log('Redis Connected'))
redis.on('error', (err) => console.error(`Redis Error: ${err.message}`))

module.exports = redis