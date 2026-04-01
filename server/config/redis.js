const Redis = require('ioredis')

let redis

try {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null
      return Math.min(times * 200, 1000)
    },
    lazyConnect: true,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  })

  redis.on('connect', () => console.log('Redis Connected'))
  redis.on('error', (err) => console.error(`Redis Error: ${err.message}`))
} catch (err) {
  console.error('Redis initialization failed:', err.message)
  // Create a dummy redis object so app doesn't crash
  redis = {
    get: async () => null,
    set: async () => null,
    setex: async () => null,
    del: async () => null,
    on: () => {},
  }
}

module.exports = redis