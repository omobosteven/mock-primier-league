import 'dotenv/config';
import Authenticate from '../../middlewares/Authentication';
import models from '../../models';
import testData from '../testData';

const { User } = models;

const {
    user
} = testData;

const {
    checkTokenExist,
    verifyToken
} = Authenticate;

let mockRequest;
let mockResponse;
let mockNext;
let jwtToken;

describe('Test authentication middleware', () => {
    beforeEach(async () => {
        const testUser = new User(user);
        jwtToken = testUser.generateAuthToken();

        mockRequest = (token) => {
            return {
                headers: { authorization: token },
                token
            };
        };
        mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnThis();
            res.send = jest.fn().mockReturnThis();
            return res;
        };
        mockNext = jest.fn().mockReturnThis();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call next if token is provided', async (done) => {
        const req = mockRequest('Bearer e3ygfdbsndgeenbv');
        const res = mockResponse();
        const next = mockNext;

        checkTokenExist(req, res, next);
        expect(next).toHaveBeenCalled();
        done();
    });

    it('should call res with 401 if token is not provided', async (done) => {
        const req = mockRequest();
        const res = mockResponse();
        const next = mockNext;

        await checkTokenExist(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
        done();
    });

    it('should call res with 401 if token is not valid', async (done) => {
        const req = mockRequest('e3ygfdbsndgeenbv');
        const res = mockResponse();
        const next = mockNext;

        verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
        done();
    });

    it('should call next if token is valid', async (done) => {
        const req = mockRequest(jwtToken);
        const res = mockResponse();
        const next = mockNext;

        verifyToken(req, res, next);
        expect(next).toHaveBeenCalled();
        done();
    });
});
