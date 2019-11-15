import express from 'express';

const root = express.Router();

root.get('', (req, res) => res.status(200).send({
    status: 200,
    message: 'mock premier league API'
}));


export default root;
