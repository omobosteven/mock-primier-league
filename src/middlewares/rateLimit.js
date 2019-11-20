import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL);
const max = parseInt(process.env.RATE_LIMIT_MAX, 10) || 20;
const minutesBeforeLimit = parseInt(process.env.RATE_LIMIT_MINUTES, 10) || 1;

client.on('error', (err) => {
    console.log(`Something went wrong with Redis ${err}`);
});


const limiter = rateLimit({
    store: new RedisStore({
        client,
        expiry: minutesBeforeLimit * 60
    }),
    max,
    skip: (req) => {
        const {
            isAdmin
        } = req.decodedUser;

        return isAdmin;
    },
    keyGenerator: (req) => {
        const {
            user
        } = req.decodedUser;

        return user;
    },
    handler: (req, res) => {
        return res.status(429).send({
            status: 429,
            message: 'Too many request, please try again later'
        });
    }
});

export default limiter;
