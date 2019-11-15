import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_KEY;

class Authenticate {
    static checkTokenExist(req, res, next) {
        const bearerToken = req.headers.authorization;

        if (bearerToken && bearerToken.startsWith('Bearer ')) {
            const token = bearerToken.slice(7);
            req.token = token;
            return next();
        }

        return res.status(401).send({
            status: 401,
            message: 'authentication credential not provided'
        });
    }

    static verifyToken(req, res, next) {
        const { token } = req;
        jwt.verify(token, secret, (error, user) => {
            if (error) {
                return res.status(401).send({
                    status: 401,
                    message: 'invalid authentication credential'
                });
            }

            req.decodedUser = user;
            return next();
        });
    }
}

export default Authenticate;
