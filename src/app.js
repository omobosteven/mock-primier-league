import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './models';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).send({
    status: 'success',
    message: 'mock premier league API'
}));

app.use(routes);

app.use((req, res) => {
    return res.status(404).send({
        status: 'error',
        message: `Route ${req.method} ${req.url} not found.`
    });
});

connectDb();

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`listening on port ${port}!`),);
}

export default app;
