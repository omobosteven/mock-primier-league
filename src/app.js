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

app.use(routes);

app.use((req, res, next) => {
    return res.status(404).send({
        status: 400,
        message: `Route ${req.method} ${req.url} not found.`
    });
});

app.use((error, req, res, next) => {
    return res.status(500).send({
        status: 500,
        message: 'internal server error'
    });
});

connectDb();

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`listening on port ${port}!`),);
}

export default app;
