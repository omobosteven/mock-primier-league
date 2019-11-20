import { hash, compare } from 'bcrypt';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

class Helper {
    static hashPassword(password) {
        return hash(password, 8).then((hashed) => {
            return hashed;
        });
    }

    static comparePassword(password, hashedPassword) {
        return compare(password, hashedPassword).then((matched) => {
            return matched;
        });
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
