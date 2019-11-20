import 'dotenv/config';
import jwt from 'jsonwebtoken';
import models from '../../models';
import testData from '../testData';

const secret = process.env.SECRET_KEY;

const { User } = models;

const {
    user
} = testData;

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const testUser = new User(user);
        const payload = {
            id: testUser.id,
            isAdmin: testUser.is_admin
        };

        const token = testUser.generateAuthToken();

        const decoded = jwt.verify(token, secret);
        expect(decoded).toMatchObject(payload);
    });
});
