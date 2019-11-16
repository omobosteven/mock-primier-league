import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const secret = process.env.SECRET_KEY;

class Helper {
    static hashPassword(password) {
        const hashedPassword = hash(password, 8).then((hashed) => {
            return hashed;
        });

        return hashedPassword;
    }

    static comparePassword(password, hashedPassword) {
        const isMatched = compare(password, hashedPassword).then((matched) => {
            return matched;
        });

        return isMatched;
    }

    static generateToken(payload) {
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        return token;
    }

    static removeExtraWhiteSpaces(payload) {
        Object.keys(payload).forEach((key) => {
            if (typeof (payload[key]) === 'string') {
                payload[key] = payload[key].replace(/\s+/g, ' ').trim();
            }
        });
        return payload;
    }

    static replaceWhiteSpacesWithHyphen(payload) {
        if (typeof (payload) === 'string') {
            return payload.trim().replace(/\s+/g, '-').trim();
        }

        return payload;
    }

    static verifyMongooseObjectId(id) {
        const isValidId = ObjectId.isValid(id);
        let documentId;

        if (isValidId) {
            documentId = ObjectId(id);
        }

        return documentId;
    }
}

export default Helper;
