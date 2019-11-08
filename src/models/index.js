import mongoose from 'mongoose';
import User from './User';

const dbUrl = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

const connectDb = () => {
    return mongoose.connect(dbUrl, options);
};

const models = { User };

export { connectDb };
export default models;