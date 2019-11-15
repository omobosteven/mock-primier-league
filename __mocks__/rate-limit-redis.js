const RedisStore = jest.genMockFromModule('rate-limit-redis');

RedisStore.prototype.incr = jest.fn().mockImplementation((key, cb) => {
    cb(null, 0, 0);
});

RedisStore.prototype.decrement = jest.fn().mockImplementation((key) => {
});

RedisStore.prototype.resetKey = jest.fn().mockImplementation((key) => {
});

export default RedisStore;
