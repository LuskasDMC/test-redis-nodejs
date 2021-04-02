const redis = require("redis");
const { promisify } = require("util");
const dotenv = require("dotenv");

dotenv.config();

class Redis {
  constructor() {
    this.redis = null;
    this.seila = null;
    this.#init();
  }

  #init() {
    this.redis = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  set(key, value, expireIn) {
    this.redis.set(key, value, "EX", expireIn, (err) => {
      if (err) console.error(err);
    });
  }

  async get(key) {
    const getAsync = promisify(this.redis.get).bind(this.redis);
    const element = await getAsync(key);
    return element ? element : null;
  }
}

module.exports = new Redis();
