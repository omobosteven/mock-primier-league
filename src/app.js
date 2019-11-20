import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './models';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

connectDb();

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`listening on port ${port}!`),);
}

export default app;
